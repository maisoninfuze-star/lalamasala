-- ============================================================================
-- LALA MASALA — CORE SCHEMA (0001)
-- Multi-location vegetarian Indian restaurant + pickup ordering platform.
--
-- Conventions:
--   * All money is stored as INTEGER cents (CAD). Never floats.
--   * Translatable copy lives in *_translations tables (en, fr today; the
--     schema supports adding pa/Punjabi later with zero migrations).
--   * Orders are IMMUTABLE snapshots: order_items/order_item_modifiers copy the
--     name + price at purchase time so editing the menu never rewrites history.
--   * updated_at is maintained by trigger.
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()
create extension if not exists "citext";   -- case-insensitive email

-- ----------------------------------------------------------------------------
-- Enumerated types
-- ----------------------------------------------------------------------------
create type staff_role as enum (
  'super_admin', 'owner', 'location_manager', 'kitchen', 'content_editor', 'analyst'
);

create type spice_level as enum ('none', 'mild', 'medium', 'hot', 'extra_hot');

create type modifier_select as enum ('single', 'multiple');

create type order_status as enum (
  'pending_payment', 'payment_failed', 'paid', 'received', 'accepted',
  'rejected', 'preparing', 'ready', 'completed', 'cancelled',
  'refunded', 'partially_refunded'
);

create type payment_status as enum (
  'pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded'
);

create type payment_method as enum ('online', 'pay_at_pickup');

create type pickup_type as enum ('asap', 'scheduled');

create type promotion_type as enum ('percentage', 'fixed', 'free_item', 'free_modifier');

create type inquiry_status as enum ('new', 'contacted', 'quoted', 'won', 'lost', 'closed');

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- IDENTITY & ACCESS
-- ============================================================================

-- Staff/admin profiles (1:1 with auth.users). Customers use `customers`.
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  avatar_url   text,
  is_active     boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Reference table of roles with human labels + privilege rank (higher = more).
create table roles (
  key         staff_role primary key,
  label       text not null,
  description text,
  rank        int  not null default 0
);

-- A user may hold a role globally (location_id null) or scoped to a location.
create table user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  role        staff_role not null references roles(key),
  location_id uuid, -- FK added after locations exists; null = all locations
  created_at  timestamptz not null default now(),
  unique (user_id, role, location_id)
);

-- Time-limited admin invitations (auto-expire; see security requirements).
create table staff_invitations (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null,
  role        staff_role not null references roles(key),
  location_id uuid,
  token_hash  text not null,
  invited_by  uuid references profiles(id) on delete set null,
  expires_at  timestamptz not null,
  accepted_at timestamptz,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- LOCATIONS
-- ============================================================================
create table locations (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  name                  text not null,
  is_active             boolean not null default true,
  ordering_paused       boolean not null default false,
  pay_at_pickup_enabled boolean not null default false,

  address_line1 text,
  address_line2 text,
  city          text,
  province      text,
  postal_code   text,
  country       text not null default 'CA',
  phone         text,
  email         citext,
  maps_url      text,
  latitude      numeric(9,6),
  longitude     numeric(9,6),
  timezone      text not null default 'America/Toronto',

  -- Ordering rules (managers edit these from the dashboard)
  tax_rate_percent      numeric(6,4) not null default 13.0000, -- ON HST default
  minimum_order_cents   integer not null default 0,
  prep_time_minutes     int not null default 20,   -- default preparation time
  extra_delay_minutes   int not null default 0,    -- temporary "busy mode" delay
  pickup_interval_min   int not null default 15,   -- slot granularity
  max_orders_per_slot   int not null default 6,
  order_cutoff_minutes  int not null default 30,   -- stop before close
  advance_order_days    int not null default 7,

  hero_image_url text,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table user_roles
  add constraint user_roles_location_fk
  foreign key (location_id) references locations(id) on delete cascade;

-- Regular weekly hours. day_of_week: 0=Sunday … 6=Saturday.
create table location_hours (
  id          uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  open_time   time,
  close_time  time,
  is_closed   boolean not null default false,
  unique (location_id, day_of_week)
);

-- Holiday closures & special hours override the weekly schedule for a date.
create table special_hours (
  id          uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  date        date not null,
  open_time   time,
  close_time  time,
  is_closed   boolean not null default false,
  note        text,
  unique (location_id, date)
);

-- ============================================================================
-- MENU
-- ============================================================================
create table categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name_en     text not null,
  name_fr     text not null,
  description_en text,
  description_fr text,
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table dishes (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  category_id  uuid references categories(id) on delete set null,
  -- Base (fallback) price; per-location overrides live in location_dishes.
  base_price_cents integer not null default 0 check (base_price_cents >= 0),
  spice        spice_level not null default 'none',
  is_vegan            boolean not null default false,
  can_be_vegan        boolean not null default false,
  is_gluten_friendly  boolean not null default false,
  contains_dairy      boolean not null default false,
  contains_nuts       boolean not null default false,
  is_popular   boolean not null default false,
  is_featured  boolean not null default false,
  is_active    boolean not null default true, -- false = archived/disabled everywhere
  available_from timestamptz, -- optional scheduled availability window
  available_to   timestamptz,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index dishes_category_idx on dishes(category_id);

-- Translatable dish copy. One row per (dish, locale). Add 'pa' later freely.
create table dish_translations (
  id          uuid primary key default gen_random_uuid(),
  dish_id     uuid not null references dishes(id) on delete cascade,
  locale      text not null check (locale in ('en','fr','pa')),
  name        text not null,
  description text,
  ingredients text,
  allergen_note text,
  unique (dish_id, locale)
);

create table dish_images (
  id          uuid primary key default gen_random_uuid(),
  dish_id     uuid not null references dishes(id) on delete cascade,
  url         text not null,
  alt_en      text,
  alt_fr      text,
  is_primary  boolean not null default false,
  sort_order  int not null default 0
);
create index dish_images_dish_idx on dish_images(dish_id);

-- Per-location price override + availability. A dish is offered at a location
-- only when a row exists here (or by policy: absence = uses base price).
create table location_dishes (
  id          uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  dish_id     uuid not null references dishes(id) on delete cascade,
  price_cents integer check (price_cents >= 0), -- null = use dishes.base_price_cents
  is_available boolean not null default true,
  is_sold_out  boolean not null default false,
  sort_order   int,
  unique (location_id, dish_id)
);

-- ============================================================================
-- MODIFIERS
-- ============================================================================
create table modifier_groups (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name_en     text not null,
  name_fr     text not null,
  selection   modifier_select not null default 'single',
  min_select  int not null default 0,
  max_select  int, -- null = unlimited
  is_required boolean not null default false,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (max_select is null or max_select >= min_select)
);

create table modifier_options (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references modifier_groups(id) on delete cascade,
  name_en     text not null,
  name_fr     text not null,
  price_delta_cents integer not null default 0, -- may be negative (discount)
  is_active   boolean not null default true,
  sort_order  int not null default 0
);
create index modifier_options_group_idx on modifier_options(group_id);

-- Per-location availability toggle for a specific option (e.g. sold-out curry).
create table location_modifier_options (
  id          uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  option_id   uuid not null references modifier_options(id) on delete cascade,
  is_available boolean not null default true,
  price_delta_cents integer, -- optional per-location override
  unique (location_id, option_id)
);

-- Which modifier groups attach to which dish, and in what order.
create table dish_modifier_groups (
  id          uuid primary key default gen_random_uuid(),
  dish_id     uuid not null references dishes(id) on delete cascade,
  group_id    uuid not null references modifier_groups(id) on delete cascade,
  sort_order  int not null default 0,
  required_override boolean, -- overrides group.is_required for this dish
  unique (dish_id, group_id)
);

-- ============================================================================
-- CUSTOMERS & CARTS
-- ============================================================================
create table customers (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null, -- null = guest
  email            citext,
  full_name        text,
  phone            text,
  favourite_location_id uuid references locations(id) on delete set null,
  marketing_consent boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create unique index customers_user_idx on customers(user_id) where user_id is not null;

create table carts (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  location_id uuid references locations(id) on delete set null,
  session_token text, -- for guest carts
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid not null references carts(id) on delete cascade,
  dish_id     uuid not null references dishes(id) on delete cascade,
  quantity    int not null default 1 check (quantity > 0),
  notes       text,
  created_at  timestamptz not null default now()
);

create table cart_item_modifiers (
  id           uuid primary key default gen_random_uuid(),
  cart_item_id uuid not null references cart_items(id) on delete cascade,
  option_id    uuid not null references modifier_options(id) on delete cascade
);

-- ============================================================================
-- ORDERS  (immutable snapshots)
-- ============================================================================
create sequence if not exists order_number_seq start 1001;

create table orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique,
  location_id    uuid not null references locations(id),
  customer_id    uuid references customers(id) on delete set null,

  status         order_status not null default 'pending_payment',
  payment_method payment_method not null default 'online',

  -- Contact snapshot (so historical orders keep who ordered)
  customer_name  text not null,
  customer_email citext not null,
  customer_phone text,

  -- Pickup
  pickup_type    pickup_type not null default 'asap',
  pickup_at      timestamptz, -- promised/estimated pickup time
  pickup_notes   text,

  -- Money (all integer cents, recomputed server-side at checkout)
  subtotal_cents  integer not null default 0,
  discount_cents  integer not null default 0,
  tax_cents       integer not null default 0,
  tip_cents       integer not null default 0,
  total_cents     integer not null default 0,
  currency        text not null default 'CAD',

  promotion_id   uuid, -- FK added after promotions
  promo_code     text,

  -- Secure public tracking token (not the guessable order_number)
  tracking_token text not null default encode(gen_random_bytes(16), 'hex'),

  notes          text, -- internal staff notes
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index orders_location_status_idx on orders(location_id, status);
create index orders_created_idx on orders(created_at desc);

create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  dish_id     uuid references dishes(id) on delete set null, -- reference only
  -- SNAPSHOT fields (immutable record of what was sold)
  dish_name_en text not null,
  dish_name_fr text,
  unit_price_cents integer not null,
  quantity    int not null check (quantity > 0),
  line_total_cents integer not null,
  notes       text
);
create index order_items_order_idx on order_items(order_id);

create table order_item_modifiers (
  id            uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  option_id     uuid references modifier_options(id) on delete set null,
  -- SNAPSHOT fields
  group_name_en text,
  option_name_en text not null,
  option_name_fr text,
  price_delta_cents integer not null default 0
);

create table order_status_history (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  status      order_status not null,
  changed_by  uuid references profiles(id) on delete set null,
  note        text,
  created_at  timestamptz not null default now()
);
create index order_status_history_order_idx on order_status_history(order_id, created_at);

-- ============================================================================
-- PAYMENTS & REFUNDS
-- ============================================================================
create table payments (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders(id) on delete cascade,
  status         payment_status not null default 'pending',
  amount_cents   integer not null,
  currency       text not null default 'CAD',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id   text unique,
  -- No card data is ever stored. Only Stripe references + brand/last4 for UX.
  card_brand     text,
  card_last4     text,
  error_message  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index payments_order_idx on payments(order_id);

create table refunds (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  payment_id   uuid references payments(id) on delete set null,
  amount_cents integer not null,
  reason       text,
  stripe_refund_id text unique,
  created_by   uuid references profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ============================================================================
-- PICKUP SLOTS  (capacity per interval)
-- ============================================================================
create table pickup_slots (
  id          uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  slot_start  timestamptz not null,
  capacity    int not null,
  booked_count int not null default 0,
  unique (location_id, slot_start)
);

-- ============================================================================
-- PROMOTIONS
-- ============================================================================
create table promotions (
  id            uuid primary key default gen_random_uuid(),
  code          text unique, -- null = automatic promotion
  type          promotion_type not null,
  value         integer not null default 0, -- percent (0-100) or cents
  name_en       text not null,
  name_fr       text,
  description_en text,
  description_fr text,
  min_spend_cents integer not null default 0,
  free_item_dish_id uuid references dishes(id) on delete set null,
  free_modifier_option_id uuid references modifier_options(id) on delete set null,
  first_order_only boolean not null default false,
  is_automatic  boolean not null default false,
  redemption_limit int, -- null = unlimited
  redeemed_count int not null default 0,
  starts_at     timestamptz,
  ends_at       timestamptz,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table promotion_locations (
  promotion_id uuid not null references promotions(id) on delete cascade,
  location_id  uuid not null references locations(id) on delete cascade,
  primary key (promotion_id, location_id)
);

create table promotion_categories (
  promotion_id uuid not null references promotions(id) on delete cascade,
  category_id  uuid not null references categories(id) on delete cascade,
  primary key (promotion_id, category_id)
);

create table promotion_redemptions (
  id           uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references promotions(id) on delete cascade,
  order_id     uuid references orders(id) on delete set null,
  customer_id  uuid references customers(id) on delete set null,
  amount_cents integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table orders
  add constraint orders_promotion_fk
  foreign key (promotion_id) references promotions(id) on delete set null;

-- ============================================================================
-- INQUIRIES (catering + event hall)
-- ============================================================================
create table catering_inquiries (
  id           uuid primary key default gen_random_uuid(),
  location_id  uuid references locations(id) on delete set null,
  name         text not null,
  email        citext not null,
  phone        text,
  event_date   date,
  guest_count  int,
  message      text,
  status       inquiry_status not null default 'new',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table event_inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        citext not null,
  phone        text,
  event_type   text,
  event_date   date,
  guest_count  int,
  message      text,
  status       inquiry_status not null default 'new',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================================
-- CONTENT / MEDIA / REVIEWS  (built-in CMS)
-- ============================================================================
-- Structured content blocks keyed by section + locale (no raw HTML).
create table content_sections (
  id          uuid primary key default gen_random_uuid(),
  key         text not null,      -- e.g. 'home.hero', 'story.body'
  locale      text not null check (locale in ('en','fr','pa')),
  data        jsonb not null default '{}'::jsonb,
  updated_by  uuid references profiles(id) on delete set null,
  updated_at  timestamptz not null default now(),
  unique (key, locale)
);

create table media_assets (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  storage_path text,
  alt_en      text,
  alt_fr      text,
  mime_type   text,
  width       int,
  height      int,
  size_bytes  bigint,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Real reviews only. Imported from Google or entered by staff — never faked.
create table reviews (
  id           uuid primary key default gen_random_uuid(),
  location_id  uuid references locations(id) on delete set null,
  author_name  text not null,
  rating       smallint not null check (rating between 1 and 5),
  body         text,
  source       text not null default 'manual', -- 'manual' | 'google'
  source_url   text,
  reviewed_at  date,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- ============================================================================
-- NOTIFICATIONS / SETTINGS / AUDIT
-- ============================================================================
create table notifications (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id) on delete cascade,
  channel     text not null default 'email', -- email | sms
  template    text not null,
  recipient   text not null,
  status      text not null default 'queued', -- queued | sent | failed
  error       text,
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Global + per-location key/value settings (theme tokens, feature flags, etc).
create table settings (
  id          uuid primary key default gen_random_uuid(),
  location_id uuid references locations(id) on delete cascade, -- null = global
  key         text not null,
  value       jsonb not null default '{}'::jsonb,
  updated_by  uuid references profiles(id) on delete set null,
  updated_at  timestamptz not null default now(),
  unique (location_id, key)
);

create table audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references profiles(id) on delete set null,
  actor_email text,
  action      text not null,       -- e.g. 'price.update', 'order.refund'
  entity_type text not null,
  entity_id   text,
  before      jsonb,
  after       jsonb,
  ip          inet,
  created_at  timestamptz not null default now()
);
create index audit_logs_entity_idx on audit_logs(entity_type, entity_id);
create index audit_logs_created_idx on audit_logs(created_at desc);

-- ----------------------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','locations','categories','dishes','modifier_groups','customers',
    'carts','orders','payments','promotions','catering_inquiries',
    'event_inquiries'
  ]
  loop
    execute format(
      'create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at()', t);
  end loop;
end $$;

-- ============================================================================
-- LALA MASALA — ROW LEVEL SECURITY (0003)
-- Principle: public site reads published menu/content anonymously; every write
-- and all private order/customer data is gated by authenticated roles.
-- The service-role key (server-only) bypasses RLS for webhooks + finalisation.
-- ============================================================================

-- Enable RLS on every table.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','roles','user_roles','staff_invitations','locations',
    'location_hours','special_hours','categories','dishes','dish_translations',
    'dish_images','location_dishes','modifier_groups','modifier_options',
    'location_modifier_options','dish_modifier_groups','customers','carts',
    'cart_items','cart_item_modifiers','orders','order_items',
    'order_item_modifiers','order_status_history','payments','refunds',
    'pickup_slots','promotions','promotion_locations','promotion_categories',
    'promotion_redemptions','catering_inquiries','event_inquiries',
    'content_sections','media_assets','reviews','notifications','settings',
    'audit_logs'
  ]
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- PUBLIC READ — published catalogue & content (anon + authenticated)
-- ----------------------------------------------------------------------------
create policy pub_read_locations on locations
  for select using (is_active);
create policy pub_read_location_hours on location_hours
  for select using (true);
create policy pub_read_special_hours on special_hours
  for select using (true);
create policy pub_read_categories on categories
  for select using (is_active);
create policy pub_read_dishes on dishes
  for select using (is_active);
create policy pub_read_dish_translations on dish_translations
  for select using (true);
create policy pub_read_dish_images on dish_images
  for select using (true);
create policy pub_read_location_dishes on location_dishes
  for select using (true);
create policy pub_read_modifier_groups on modifier_groups
  for select using (is_active);
create policy pub_read_modifier_options on modifier_options
  for select using (is_active);
create policy pub_read_location_modifier_options on location_modifier_options
  for select using (true);
create policy pub_read_dish_modifier_groups on dish_modifier_groups
  for select using (true);
create policy pub_read_content on content_sections
  for select using (true);
create policy pub_read_reviews on reviews
  for select using (is_published);
create policy pub_read_media on media_assets
  for select using (true);
create policy pub_read_promotions on promotions
  for select using (is_active and coalesce(is_automatic, false));

-- ----------------------------------------------------------------------------
-- STAFF WRITE — content managers manage the catalogue & CMS
-- ----------------------------------------------------------------------------
-- Menu/content editing: content_editor and above.
do $$
declare t text;
begin
  foreach t in array array[
    'locations','location_hours','special_hours','categories','dishes',
    'dish_translations','dish_images','location_dishes','modifier_groups',
    'modifier_options','location_modifier_options','dish_modifier_groups',
    'content_sections','media_assets','reviews','promotions',
    'promotion_locations','promotion_categories','settings'
  ]
  loop
    execute format($p$
      create policy staff_write_%1$s on %1$I for all
      using (has_role(array['super_admin','owner','content_editor','location_manager']::staff_role[]))
      with check (has_role(array['super_admin','owner','content_editor','location_manager']::staff_role[]))
    $p$, t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- PROFILES & ROLES
-- ----------------------------------------------------------------------------
create policy profiles_self_read on profiles
  for select using (id = auth.uid() or is_staff());
create policy profiles_self_update on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy roles_read on roles
  for select using (is_staff());
create policy user_roles_read on user_roles
  for select using (user_id = auth.uid() or has_role(array['super_admin','owner']::staff_role[]));
create policy user_roles_admin on user_roles
  for all using (has_role(array['super_admin','owner']::staff_role[]))
  with check (has_role(array['super_admin','owner']::staff_role[]));

-- ----------------------------------------------------------------------------
-- CUSTOMERS & CARTS — owners see their own; staff can read for support
-- ----------------------------------------------------------------------------
create policy customers_self on customers
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy customers_staff_read on customers
  for select using (has_role(array['super_admin','owner','location_manager']::staff_role[]));

create policy carts_owner on carts
  for all using (
    customer_id in (select id from customers where user_id = auth.uid())
  ) with check (
    customer_id in (select id from customers where user_id = auth.uid())
  );
create policy cart_items_owner on cart_items
  for all using (
    cart_id in (select c.id from carts c
      join customers cu on cu.id = c.customer_id where cu.user_id = auth.uid())
  ) with check (
    cart_id in (select c.id from carts c
      join customers cu on cu.id = c.customer_id where cu.user_id = auth.uid())
  );
create policy cart_item_mods_owner on cart_item_modifiers
  for all using (
    cart_item_id in (select ci.id from cart_items ci
      join carts c on c.id = ci.cart_id
      join customers cu on cu.id = c.customer_id where cu.user_id = auth.uid())
  ) with check (true);

-- ----------------------------------------------------------------------------
-- ORDERS — signed-in customer sees own; staff sees their location's orders.
-- Guest/public tracking is handled by a server route using the service role +
-- the secret tracking_token, NOT by a broad anon policy (prevents IDOR).
-- ----------------------------------------------------------------------------
create policy orders_customer_read on orders
  for select using (
    customer_id in (select id from customers where user_id = auth.uid())
  );
create policy orders_staff_read on orders
  for select using (is_staff() and manages_location(location_id));
create policy orders_staff_update on orders
  for update using (is_staff() and manages_location(location_id))
  with check (is_staff() and manages_location(location_id));

create policy order_items_read on order_items
  for select using (
    order_id in (
      select id from orders o where
        o.customer_id in (select id from customers where user_id = auth.uid())
        or (is_staff() and manages_location(o.location_id))
    )
  );
create policy order_item_mods_read on order_item_modifiers
  for select using (
    order_item_id in (select oi.id from order_items oi
      join orders o on o.id = oi.order_id
      where o.customer_id in (select id from customers where user_id = auth.uid())
         or (is_staff() and manages_location(o.location_id)))
  );
create policy order_status_history_read on order_status_history
  for select using (
    order_id in (select id from orders o
      where o.customer_id in (select id from customers where user_id = auth.uid())
         or (is_staff() and manages_location(o.location_id)))
  );
create policy payments_staff_read on payments
  for select using (is_staff() and exists(
    select 1 from orders o where o.id = payments.order_id and manages_location(o.location_id)));
create policy refunds_staff on refunds
  for all using (has_role(array['super_admin','owner','location_manager']::staff_role[]))
  with check (has_role(array['super_admin','owner','location_manager']::staff_role[]));

-- ----------------------------------------------------------------------------
-- INQUIRIES — anyone may create (rate-limited in app); staff read/manage.
-- ----------------------------------------------------------------------------
create policy catering_insert on catering_inquiries for insert with check (true);
create policy catering_staff on catering_inquiries for select
  using (has_role(array['super_admin','owner','location_manager']::staff_role[]));
create policy event_insert on event_inquiries for insert with check (true);
create policy event_staff on event_inquiries for select
  using (has_role(array['super_admin','owner','location_manager']::staff_role[]));

-- ----------------------------------------------------------------------------
-- AUDIT & NOTIFICATIONS — staff read only; writes via service role.
-- ----------------------------------------------------------------------------
create policy audit_read on audit_logs for select
  using (has_role(array['super_admin','owner']::staff_role[]));
create policy notifications_staff_read on notifications for select
  using (has_role(array['super_admin','owner','location_manager']::staff_role[]));

-- ============================================================================
-- LALA MASALA — FUNCTIONS (0002)
-- Authorization helpers + order-number generation.
-- ============================================================================

-- Highest-privilege role for the current user (or null). SECURITY DEFINER so
-- RLS on user_roles cannot cause recursive policy evaluation.
create or replace function auth_staff_role()
returns staff_role
language sql stable security definer set search_path = public as $$
  select ur.role
  from user_roles ur
  join roles r on r.key = ur.role
  where ur.user_id = auth.uid()
  order by r.rank desc
  limit 1;
$$;

create or replace function is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from user_roles where user_id = auth.uid());
$$;

create or replace function has_role(required staff_role[])
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = any(required)
  );
$$;

-- True if the current user can manage the given location (global roles always
-- can; location_manager/kitchen only for their assigned locations).
create or replace function manages_location(loc uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid()
      and (
        ur.role in ('super_admin','owner','content_editor','analyst')
        or ur.location_id is null
        or ur.location_id = loc
      )
  );
$$;

-- Human-friendly, collision-free order number: LM-YYMMDD-NNNN
create or replace function next_order_number()
returns text
language sql volatile as $$
  select 'LM-' || to_char(now() at time zone 'America/Toronto', 'YYMMDD')
         || '-' || lpad(nextval('order_number_seq')::text, 4, '0');
$$;

-- Append a status-history row automatically whenever orders.status changes.
create or replace function log_order_status()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into order_status_history(order_id, status)
    values (new.id, new.status);
  end if;
  return new;
end;
$$;

create trigger trg_orders_status_history
  after insert or update of status on orders
  for each row execute function log_order_status();

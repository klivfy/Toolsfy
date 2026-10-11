-- Makes the Stripe webhook idempotent and immune to out-of-order delivery.

-- Every processed event id is stored; redeliveries are ignored.
create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- Written only by the webhook (service role). No policies: API roles see
-- nothing.
alter table public.stripe_events enable row level security;
revoke all on public.stripe_events from anon, authenticated;

-- Creation time of the newest Stripe event applied to the row. Older events
-- that arrive late are skipped.
alter table public.subscriptions
  add column if not exists stripe_event_created timestamptz;

-- The webhook looks rows up by these ids; one Stripe customer or
-- subscription belongs to a single user.
create unique index if not exists subscriptions_stripe_customer_id_key
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists subscriptions_stripe_subscription_id_key
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- Applies a Stripe event to the user's subscription row, unless a newer
-- event was already applied. A null argument keeps the stored value.
-- Returns false when the event was skipped as stale.
create or replace function public.apply_stripe_subscription_event(
  p_user_id uuid,
  p_customer_id text,
  p_subscription_id text,
  p_status text,
  p_event_created timestamptz
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_applied boolean;
begin
  insert into public.subscriptions as s (
    user_id, stripe_customer_id, stripe_subscription_id, status,
    stripe_event_created, updated_at
  )
  values (
    p_user_id, p_customer_id, p_subscription_id,
    coalesce(p_status, 'inactive'), p_event_created, now()
  )
  on conflict (user_id) do update
    set stripe_customer_id = coalesce(excluded.stripe_customer_id, s.stripe_customer_id),
        stripe_subscription_id = coalesce(excluded.stripe_subscription_id, s.stripe_subscription_id),
        status = coalesce(p_status, s.status),
        stripe_event_created = excluded.stripe_event_created,
        updated_at = now()
    where s.stripe_event_created is null
       or s.stripe_event_created <= excluded.stripe_event_created
  returning true into v_applied;

  return coalesce(v_applied, false);
end;
$$;

revoke execute on function public.apply_stripe_subscription_event(uuid, text, text, text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.apply_stripe_subscription_event(uuid, text, text, text, timestamptz)
  to service_role;

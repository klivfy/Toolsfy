-- Credits are charged only by the server. Users can read their own usage
-- but can no longer insert or delete rows, so they cannot fake negative
-- credits or "refund" the month by clearing the history.

drop policy if exists "Users can insert their own tool usage" on public.tool_usage;
drop policy if exists "Users can delete their own tool usage" on public.tool_usage;

-- Defense in depth: even with a future permissive policy, the API roles
-- cannot write to the table directly.
revoke insert, update, delete on public.tool_usage from anon, authenticated;

-- NOT VALID keeps the migration from failing on rows written before this
-- change; every new or updated row is checked. Find old offenders with:
--   select * from public.tool_usage where credits < 0;
alter table public.tool_usage
  add constraint tool_usage_credits_nonneg check (credits >= 0) not valid;

-- "Limpar Histórico" hides rows instead of deleting them. Hidden rows still
-- count towards the monthly credits.
alter table public.tool_usage add column if not exists hidden_at timestamptz;

create index if not exists tool_usage_visible_user_id_created_at_idx
  on public.tool_usage (user_id, created_at desc)
  where hidden_at is null;

-- Start of the current billing month. Months turn over at midnight in
-- America/Sao_Paulo, wherever the app or the database runs.
create or replace function public.billing_month_start()
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select date_trunc('month', now() at time zone 'America/Sao_Paulo')
    at time zone 'America/Sao_Paulo';
$$;

-- Checks the balance and records the usage in one transaction. The advisory
-- lock serializes concurrent calls for the same user, so parallel requests
-- cannot all pass the check and overspend the limit.
-- Raises 'insufficient_credits' when the cost does not fit in the limit.
create or replace function public.consume_credits(
  p_user_id uuid,
  p_tool_id text,
  p_tool_name text,
  p_cost integer,
  p_limit integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_used integer;
  v_id uuid;
begin
  if p_cost is null or p_cost < 0 then
    raise exception 'invalid_cost';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('consume_credits:' || p_user_id::text, 0));

  select coalesce(sum(credits), 0)
    into v_used
    from public.tool_usage
   where user_id = p_user_id
     and created_at >= public.billing_month_start();

  if v_used + p_cost > p_limit then
    raise exception 'insufficient_credits';
  end if;

  insert into public.tool_usage (user_id, tool_id, tool_name, credits, status)
  values (p_user_id, p_tool_id, p_tool_name, p_cost, 'success')
  returning id into v_id;

  return v_id;
end;
$$;

-- Only the server (service role) may charge credits: the cost and the limit
-- come from server-side code, never from the browser.
revoke execute on function public.consume_credits(uuid, text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_credits(uuid, text, text, integer, integer)
  to service_role;

-- Soft-deletes the signed-in user's visible history.
create or replace function public.hide_tool_usage_history()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.tool_usage
     set hidden_at = now()
   where user_id = auth.uid()
     and hidden_at is null;
$$;

revoke execute on function public.hide_tool_usage_history() from public, anon;
grant execute on function public.hide_tool_usage_history() to authenticated;

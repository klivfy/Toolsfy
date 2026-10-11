-- Aggregates for the dashboard and history pages, computed in the database
-- instead of shipping every row to the server (PostgREST also caps result
-- sets at max-rows, which made the sums silently wrong past that).
-- Both run as the caller, so RLS still limits them to the user's own rows.

-- Current billing month (see billing_month_start). Hidden history rows
-- still count: clearing the history does not refund credits.
create or replace function public.get_monthly_usage()
returns table (credits_used bigint, executions bigint, successes bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(credits), 0),
         count(*),
         count(*) filter (where status = 'success')
    from public.tool_usage
   where user_id = auth.uid()
     and created_at >= public.billing_month_start();
$$;

-- Most used tools (successful runs) over the last p_days days, among the
-- rows still visible in the history.
create or replace function public.get_top_tools(p_days integer default 30, p_limit integer default 8)
returns table (tool_name text, uses bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select tool_name, count(*) as uses
    from public.tool_usage
   where user_id = auth.uid()
     and status = 'success'
     and hidden_at is null
     and created_at >= now() - make_interval(days => least(greatest(p_days, 1), 366))
   group by tool_name
   order by uses desc, tool_name
   limit least(greatest(p_limit, 1), 50);
$$;

revoke execute on function public.get_monthly_usage() from public, anon;
revoke execute on function public.get_top_tools(integer, integer) from public, anon;
grant execute on function public.get_monthly_usage() to authenticated;
grant execute on function public.get_top_tools(integer, integer) to authenticated;

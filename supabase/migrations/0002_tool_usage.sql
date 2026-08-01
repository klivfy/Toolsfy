-- Tracks each execution of a native tool by a user, powering the
-- Histórico/Consumo sections of the dashboard.
create table if not exists public.tool_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tool_id text not null,
  tool_name text not null,
  credits integer not null default 0,
  status text not null default 'success' check (status in ('success', 'error')),
  created_at timestamptz not null default now()
);

create index if not exists tool_usage_user_id_created_at_idx
  on public.tool_usage (user_id, created_at desc);

alter table public.tool_usage enable row level security;

create policy "Users can view their own tool usage"
  on public.tool_usage for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tool usage"
  on public.tool_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own tool usage"
  on public.tool_usage for delete
  using (auth.uid() = user_id);

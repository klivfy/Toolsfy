-- Enables Supabase Realtime on subscriptions so the dashboard can react
-- instantly when a Stripe webhook flips a user's plan to Premium.
alter publication supabase_realtime add table public.subscriptions;

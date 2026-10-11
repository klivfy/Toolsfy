Toolsfy — a dashboard for managing and subscribing to your tools.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Supabase Auth](https://supabase.com/docs/guides/auth) for authentication and protected routes
- [Stripe](https://stripe.com/docs) for subscriptions and billing

## Getting started

```bash
npm install
cp .env.example .env.local # fill in Supabase and Stripe keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project structure

- `src/app/(auth)` — login/signup pages
- `src/app/(dashboard)/dashboard` — protected dashboard (overview, tools, billing, settings)
- `src/app/api/stripe` — checkout, billing portal, and webhook route handlers
- `src/lib/supabase` — browser/server Supabase clients, middleware session helper, and auth server actions
- `src/lib/stripe` — server-side Stripe client
- `src/proxy.ts` — refreshes the Supabase session on `/dashboard`, `/login` and `/signup` and redirects unauthenticated users away from `/dashboard` (it must sit next to `src/app`, or Next.js ignores it)
- `supabase/migrations` — SQL migrations, starting with a `subscriptions` table used by the Stripe webhook

## Environment variables

See `.env.example` for the full list. You'll need:

- A Supabase project URL, anon key, and service role key
- A Stripe secret key, webhook signing secret, and a price ID for the plan you want to sell

## Stripe webhook (local development)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The webhook handles `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
`invoice.payment_succeeded` and `customer.subscription.created|updated|deleted`; enable these
events on the endpoint in the Stripe Dashboard.

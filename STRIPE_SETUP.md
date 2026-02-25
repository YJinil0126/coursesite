# Stripe Checkout Setup & How It Works

This guide explains the Stripe checkout flow and how each piece fits together.

---

## The Big Picture: What Happens When Someone Buys a Course

```
User clicks "Buy" → Our API creates a Stripe Checkout Session
                            ↓
User is redirected to Stripe's hosted payment page (Stripe handles the form, card input, etc.)
                            ↓
User enters card and pays → Stripe processes the payment
                            ↓
Stripe sends a webhook to our server: "checkout.session.completed"
                            ↓
Our webhook handler receives it → Inserts a row into the purchases table
                            ↓
User is redirected back to our course page → They now have access (we check purchases table)
```

**Why a webhook?** Stripe can't call our frontend (the user might have closed the tab). So Stripe calls our server directly with the result. That's the webhook.

---

## 1. Environment Variables

Add to `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### What each one does

| Variable | Purpose |
|----------|---------|
| **STRIPE_SECRET_KEY** | Used on the server to create Checkout Sessions and verify webhooks. Never expose to the browser. |
| **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** | Used in the browser if you ever add Stripe Elements (e.g. custom checkout). Not needed for hosted Checkout. |
| **STRIPE_WEBHOOK_SECRET** | Used to verify that incoming webhook requests really come from Stripe (not a fake request). |
| **SUPABASE_SERVICE_ROLE_KEY** | Bypasses Row Level Security. The webhook runs without a user session, so we need this to insert into `purchases`. |

**Where to find them:**
- Stripe keys: Stripe Dashboard → Developers → API keys (use **Test mode**)
- SUPABASE_SERVICE_ROLE_KEY: Supabase → Settings → API → `service_role` (keep secret!)

---

## 2. Purchases Table Column

The webhook inserts the Stripe session ID into `stripe_session_id`. That lets us:
- Avoid duplicate purchases (same session = same payment)
- Debug issues (look up the session in Stripe Dashboard)

If your table has `stripe_id` instead of `stripe_session_id`, run in Supabase SQL Editor:

```sql
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS stripe_session_id text;
```

---

## 3. Stripe Webhook (for local testing)

**The problem:** Stripe's servers need to reach your webhook URL. When you're on `localhost`, Stripe can't reach you from the internet.

**The solution:** Stripe CLI creates a tunnel. It listens for Stripe events and forwards them to your local server:

```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

When you run this, Stripe CLI prints a **webhook signing secret** (starts with `whsec_`). Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`. This secret is used to verify that each webhook request is really from Stripe.

**In production:** You add a webhook endpoint in Stripe Dashboard (e.g. `https://yoursite.com/api/webhooks/stripe`) and get a different secret for that URL.

---

## 4. How the Code Works

### Create Checkout (`/api/create-checkout`)

1. Receives `courseId` from the frontend
2. Gets the current user from Supabase (must be signed in)
3. Fetches the course from the database
4. Checks if the user already purchased (avoids double charge)
5. Creates a Stripe Checkout Session with:
   - `metadata`: `courseId` and `userId` (so the webhook knows what to record)
   - `success_url` / `cancel_url`: where to send the user after payment
6. Returns the Checkout URL; the frontend redirects the user there

### Webhook (`/api/webhooks/stripe`)

1. Receives the raw request body and `Stripe-Signature` header
2. Verifies the signature using `STRIPE_WEBHOOK_SECRET` (ensures it's from Stripe)
3. If the event is `checkout.session.completed`:
   - Reads `courseId` and `userId` from `session.metadata`
   - Inserts a row into `purchases` using the service role key (bypasses RLS)
4. Returns 200 so Stripe knows we received it

### Buy Button (`BuyCourseButton.tsx`)

1. User clicks "Buy course"
2. Calls `POST /api/create-checkout` with `courseId`
3. Receives the Checkout URL
4. Redirects the user: `window.location.href = url`
5. User pays on Stripe's page, then Stripe redirects them back to our `success_url`

---

## 5. Test the Flow

1. Sign in to your app
2. Go to a course you haven't purchased
3. Click "Buy course — $29.99"
4. Use Stripe test card: `4242 4242 4242 4242` (any future expiry, any CVC)
5. After payment, you should be redirected back and lessons should unlock

**Other test cards:** See [Stripe Testing](https://docs.stripe.com/testing#cards) (e.g. `4000 0000 0000 0002` for declined card).

# Deploy to Vercel

Step-by-step guide to get your CourseSite live. You can update the site anytime by pushing changes to GitHub.

---

## 1. Push to GitHub

If you haven't already:

```powershell
cd c:\Users\coursesite
git init
git add .
git commit -m "Initial commit"
```

Create a new repo on [GitHub](https://github.com/new), then:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New** → **Project**.
3. Import your GitHub repo.
4. Vercel will detect Next.js. Click **Deploy** (you'll add env vars next).

---

## 3. Add Environment Variables

In Vercel: Project → **Settings** → **Environment Variables**. Add these (for Production and Preview):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe secret key (use live key when ready for real payments) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard (see step 4) |
| `MUX_TOKEN_ID` | Mux token ID (if using video) |
| `MUX_TOKEN_SECRET` | Mux token secret |

After adding, trigger a **Redeploy** (Deployments → ⋮ → Redeploy).

---

## 4. Stripe Webhook for Production

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**.
2. **Endpoint URL**: `https://your-site.vercel.app/api/webhooks/stripe`
3. **Events**: Select `checkout.session.completed`.
4. Click **Add endpoint**.
5. Click **Reveal** on the signing secret and add it to Vercel as `STRIPE_WEBHOOK_SECRET`.
6. Redeploy so the new secret is used.

---

## 5. Supabase URL Configuration

1. Supabase → **Authentication** → **URL Configuration**.
2. **Site URL**: `https://your-site.vercel.app`
3. **Redirect URLs**: Add `https://your-site.vercel.app/**`
4. Save.

---

## 6. You're Live

Your site will be at `https://your-project.vercel.app` (or your custom domain).

---

## Updating the Site Later

1. Edit your code locally.
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Update landing page"
   git push
   ```
3. Vercel automatically redeploys. Changes go live in 1–2 minutes.

# Environment Variables Checklist

Copy these from your `.env.local` file to Vercel Dashboard → Project Settings → Environment Variables

## Required Variables

### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Stripe
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET` (get this after setting up webhook)

### Dacast
- [ ] `NEXT_PUBLIC_DACAST_ACCOUNT_ID`

### Resend
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`

### App Configuration
- [ ] `NEXT_PUBLIC_APP_URL` (set to your Vercel URL: `https://your-project.vercel.app`)
- [ ] `CRON_SECRET` (generate a random string for security)

## How to Add in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter the **Name** and **Value**
5. Select **Production**, **Preview**, and **Development** (or just Production)
6. Click **Save**
7. Repeat for all variables above

## After Adding Variables

- Vercel will automatically redeploy
- Or manually trigger a redeploy from the Deployments tab


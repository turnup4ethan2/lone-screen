# Quick Deployment Steps

Follow these steps in order to deploy your application.

## Step 1: Fix Xcode License (if needed)

If you see Xcode license errors, run:
```bash
sudo xcodebuild -license
```
Accept the license agreement.

## Step 2: Initialize Git

```bash
cd /Users/ethannguyen/Desktop/lone-screen/lone-screen-app
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

## Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it: `lone-screen` (or your preferred name)
4. Set to **Private** (recommended) or **Public**
5. **Don't** initialize with README, .gitignore, or license
6. Click **Create repository**

## Step 4: Connect and Push to GitHub

Copy the commands GitHub shows you, or use these (replace with your username/repo):

```bash
git remote add origin https://github.com/YOUR_USERNAME/lone-screen.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy to Vercel

### 5a. Sign Up/Login
- Go to [vercel.com](https://vercel.com)
- Click **Sign Up** or **Log In**
- **Recommended:** Sign up with GitHub (easiest integration)

### 5b. Import Project
1. Click **Add New...** → **Project**
2. Click **Import Git Repository**
3. Find your `lone-screen` repository
4. Click **Import**

### 5c. Configure Project
1. **Framework Preset:** Next.js (auto-detected) ✅
2. **Root Directory:** `./` (should be `lone-screen-app` if repo is parent folder)
   - If your repo is the parent folder, set to: `lone-screen-app`
3. **Build Command:** `npm run build` (default) ✅
4. **Output Directory:** `.next` (default) ✅
5. **Install Command:** `npm install` (default) ✅

### 5d. Add Environment Variables
1. Click **Environment Variables** section
2. Add each variable from `ENV_VARIABLES_CHECKLIST.md`
3. For `NEXT_PUBLIC_APP_URL`, use: `https://your-project-name.vercel.app` (you'll get this after first deploy)
4. Click **Deploy**

### 5e. Wait for Build
- Build usually takes 2-3 minutes
- Watch the build logs for any errors
- Your site will be live at: `https://your-project-name.vercel.app`

## Step 6: Update Environment Variables

After first deployment:
1. Copy your actual Vercel URL
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` to your actual URL
4. Click **Redeploy** from the Deployments tab

## Step 7: Set Up Stripe Webhook

1. **Get your webhook URL:**
   - `https://your-project-name.vercel.app/api/webhooks/stripe`

2. **In Stripe Dashboard:**
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Paste your webhook URL
   - Select event: `checkout.session.completed`
   - Click **Add endpoint**
   - **Copy the "Signing secret"** (starts with `whsec_`)

3. **Add to Vercel:**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add: `STRIPE_WEBHOOK_SECRET` with the signing secret value
   - Redeploy

## Step 8: Run Database Migrations

In Supabase Dashboard → SQL Editor, run these in order:

1. `schema.sql`
2. `functions.sql`
3. `add-livestream-duration.sql`
4. `add-forum-tables.sql`
5. `add-comment-likes.sql`
6. `add-lobby-background.sql`
7. `add-stripe-product-id.sql` ⭐ NEW
8. `add-admin-support.sql`

## Step 9: Set Up Storage Buckets

In Supabase Dashboard → Storage:

1. **Create `film-posters` bucket:**
   - Click **New bucket**
   - Name: `film-posters`
   - Public: **Yes**
   - File size limit: 5 MB
   - Click **Create**

2. **Create `filmmaker-submissions` bucket:**
   - Click **New bucket**
   - Name: `filmmaker-submissions`
   - Public: **Yes** (or configure RLS)
   - File size limit: 100 MB
   - Click **Create**

## Step 10: Create Admin User

In Supabase Dashboard → SQL Editor:

```sql
UPDATE public.profiles
SET is_admin = TRUE
WHERE email = 'your-email@example.com';
```

Replace with your actual email address.

## Step 11: Test Everything

- [ ] Visit your production URL
- [ ] Test user registration
- [ ] Test login
- [ ] Test ticket purchase (use Stripe test mode)
- [ ] Test admin features
- [ ] Verify emails are sending
- [ ] Test Stripe webhook (check Stripe dashboard for webhook logs)

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Ensure all environment variables are set
- Verify `package.json` dependencies

### Database Errors
- Verify all migrations ran
- Check Supabase connection strings
- Verify RLS policies

### Email Not Sending
- Check Resend dashboard for logs
- Verify `RESEND_FROM_EMAIL` is verified in Resend

### Stripe Webhook Not Working
- Check webhook URL is correct
- Verify webhook secret matches
- Check Stripe dashboard for webhook logs

## Success! 🎉

Your application is now live! Every push to `main` will automatically deploy.


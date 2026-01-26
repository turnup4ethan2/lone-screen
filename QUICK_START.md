# 🚀 Quick Start - Deploy to Production

## First: Fix Xcode License (if needed)

If you see Xcode license errors, open Terminal and run:
```bash
sudo xcodebuild -license
```
Press `space` to scroll, type `agree` at the end, press Enter.

## Then: Run These Commands

Open Terminal and run these commands one by one:

```bash
# Navigate to your project
cd /Users/ethannguyen/Desktop/lone-screen/lone-screen-app

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit - ready for deployment"
```

## Next: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `lone-screen` (or your choice)
3. Choose **Private** (recommended)
4. **Don't** check "Initialize with README"
5. Click **Create repository**

## Then: Connect and Push

GitHub will show you commands. Use these (replace YOUR_USERNAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/lone-screen.git
git branch -M main
git push -u origin main
```

## Finally: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/login (use GitHub - easiest!)
3. Click **Add New Project**
4. Import your `lone-screen` repository
5. **Root Directory:** Leave as `./` (or set to `lone-screen-app` if your repo is parent folder)
6. Click **Environment Variables**
7. Add all variables from `ENV_VARIABLES_CHECKLIST.md`
8. Click **Deploy**

## After First Deploy

1. Copy your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
3. Set up Stripe webhook (see `DEPLOYMENT_STEPS.md` Step 7)
4. Run database migrations in Supabase
5. Create storage buckets
6. Create admin user

## Need Help?

See `DEPLOYMENT_STEPS.md` for detailed step-by-step instructions.


#!/bin/bash

# Deployment Script for The Lone Screen
# This script helps you prepare and deploy your application

set -e

echo "🚀 The Lone Screen - Deployment Helper"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the lone-screen-app directory"
    exit 1
fi

# Step 1: Initialize Git
echo "📦 Step 1: Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Step 2: Check for uncommitted changes
echo ""
echo "📝 Step 2: Checking for changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Let's commit them..."
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Prepare for deployment"
    fi
    
    git add .
    git commit -m "$commit_msg"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Step 3: Check for remote
echo ""
echo "🔗 Step 3: Checking for remote repository..."
if git remote | grep -q origin; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
else
    echo "⚠️  No remote repository configured"
    echo ""
    echo "To connect to GitHub:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "3. Run: git push -u origin main"
    echo ""
    read -p "Do you want to add a remote now? (y/n): " add_remote
    if [ "$add_remote" = "y" ]; then
        read -p "Enter your GitHub repository URL: " repo_url
        git remote add origin "$repo_url"
        echo "✅ Remote added"
    fi
fi

# Step 4: Check environment variables
echo ""
echo "🔐 Step 4: Checking environment variables..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found"
    echo "Please create it with all required environment variables"
else
    echo "✅ .env.local file exists"
    echo ""
    echo "Required environment variables:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "  - STRIPE_SECRET_KEY"
    echo "  - STRIPE_WEBHOOK_SECRET"
    echo "  - NEXT_PUBLIC_DACAST_ACCOUNT_ID"
    echo "  - RESEND_API_KEY"
    echo "  - RESEND_FROM_EMAIL"
    echo "  - NEXT_PUBLIC_APP_URL"
    echo "  - CRON_SECRET"
fi

# Step 5: Build check
echo ""
echo "🔨 Step 5: Testing build..."
read -p "Do you want to test the build now? (y/n): " test_build
if [ "$test_build" = "y" ]; then
    echo "Running npm run build..."
    npm run build
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
    else
        echo "❌ Build failed. Please fix errors before deploying."
        exit 1
    fi
fi

echo ""
echo "✅ Preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push -u origin main"
echo "2. Go to vercel.com and import your repository"
echo "3. Add all environment variables in Vercel dashboard"
echo "4. Deploy!"
echo ""
echo "See docs/deployment-guide.md for detailed instructions"


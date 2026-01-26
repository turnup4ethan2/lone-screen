# Database Setup Instructions

## 1. Get Supabase Keys

1. Go to your Supabase project: https://pmbmamxcfpzoulvoybjm.supabase.co
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL**: `https://pmbmamxcfpzoulvoybjm.supabase.co` ✅ (already have)
   - **anon public key**: Look for the `anon` `public` key (long string starting with `eyJ...`)
   - **service_role secret key**: Look for the `service_role` `secret` key (long string starting with `eyJ...`)

⚠️ **Important**: The `service_role` key has admin access - keep it secret and only use server-side!

## 2. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `schema.sql` in this folder
4. Paste into the SQL Editor
5. Click **Run** to execute

This will create:
- All necessary tables (profiles, films, premieres, tickets, ratings, form_submissions)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic profile creation and timestamp updates

## 3. Update Environment Variables

Update `.env.local` with your actual keys:
- Replace `REPLACE_WITH_ACTUAL_ANON_KEY` with your anon key
- Replace `REPLACE_WITH_ACTUAL_SERVICE_ROLE_KEY` with your service_role key

## 4. Verify Setup

After running the schema, you should see these tables in the **Table Editor**:
- `profiles`
- `films`
- `premieres`
- `tickets`
- `ratings`
- `form_submissions`


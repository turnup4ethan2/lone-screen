-- Manual Ticket Creation for Testing
-- Run this in Supabase SQL Editor

-- Step 1: Find your user ID
-- Replace 'your-email@example.com' with your actual email
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Step 2: Create the ticket
-- Replace 'YOUR_USER_ID_HERE' with the ID from Step 1
-- The premiere ID should be: '00000000-0000-0000-0000-000000000002' (from test data)

INSERT INTO public.tickets (
  id,
  user_id,
  premiere_id,
  status
) VALUES (
  uuid_generate_v4(),
  'YOUR_USER_ID_HERE',
  '00000000-0000-0000-0000-000000000002',
  'active'
);

-- Step 3: Verify the ticket was created
SELECT 
  t.id,
  t.user_id,
  t.premiere_id,
  t.status,
  t.created_at,
  p.title as premiere_title,
  u.email
FROM public.tickets t
JOIN public.premieres p ON t.premiere_id = p.id
JOIN auth.users u ON t.user_id = u.id
WHERE t.user_id = 'YOUR_USER_ID_HERE';


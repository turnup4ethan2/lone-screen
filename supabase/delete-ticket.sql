-- Delete a ticket for testing
-- Replace 'your-email@example.com' with your actual email

-- Method 1: Delete by email (easiest)
DELETE FROM public.tickets
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
AND premiere_id = '00000000-0000-0000-0000-000000000002';

-- Method 2: Delete all tickets for a user
-- DELETE FROM public.tickets
-- WHERE user_id IN (
--   SELECT id FROM auth.users WHERE email = 'your-email@example.com'
-- );

-- Method 3: Delete by user ID (if you know it)
-- First get your user ID:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- Then delete:
-- DELETE FROM public.tickets
-- WHERE user_id = 'YOUR_USER_ID_HERE'
-- AND premiere_id = '00000000-0000-0000-0000-000000000002';

-- Verify deletion
SELECT 
  t.id,
  u.email,
  f.title as film_title
FROM public.tickets t
JOIN auth.users u ON t.user_id = u.id
JOIN public.premieres p ON t.premiere_id = p.id
JOIN public.films f ON p.film_id = f.id
WHERE u.email = 'your-email@example.com';


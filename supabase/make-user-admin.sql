-- Make your user an admin (replace 'your-email@example.com' with your actual email)
-- To find your email, check the auth.users table or your profile

UPDATE public.profiles 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';

-- To verify it worked:
SELECT email, is_admin FROM public.profiles WHERE is_admin = TRUE;


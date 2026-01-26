-- Add is_admin field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Note: To make a user an admin, run:
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'admin@example.com';


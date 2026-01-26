-- Add lobby_background_image_url to premieres table
ALTER TABLE public.premieres
ADD COLUMN IF NOT EXISTS lobby_background_image_url TEXT;


-- Update film poster URL
-- Replace 'YOUR_IMAGE_URL_HERE' with your actual image URL

UPDATE public.films
SET poster_url = 'YOUR_IMAGE_URL_HERE'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Example with a real image:
-- UPDATE public.films
-- SET poster_url = 'https://example.com/poster.jpg'
-- WHERE id = '00000000-0000-0000-0000-000000000001';


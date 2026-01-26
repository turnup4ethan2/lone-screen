-- Step 1: First, find which film is linked to your premiere
-- Run this to see the film_id:
SELECT 
  p.id as premiere_id,
  f.id as film_id,
  f.title,
  f.dacast_video_id
FROM public.premieres p
JOIN public.films f ON p.film_id = f.id
WHERE p.id = '00000000-0000-0000-0000-000000000002';

-- Step 2: Update the film's video ID (replace FILM_ID_HERE with the film_id from step 1)
-- UPDATE public.films
-- SET dacast_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e'
-- WHERE id = 'FILM_ID_HERE';


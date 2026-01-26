-- Update the Q&A video ID for the film linked to premiere 000002
-- This is a VOD (regular video), not a livestream

UPDATE public.films
SET dacast_qa_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-vod-28237053-834b-4bbf-9b4f-44f9758a16f0'
WHERE id = (
  SELECT film_id 
  FROM public.premieres 
  WHERE id = '00000000-0000-0000-0000-000000000002'
);

-- Verify it worked
SELECT 
  p.id as premiere_id,
  f.id as film_id,
  f.title,
  f.dacast_qa_video_id
FROM public.premieres p
JOIN public.films f ON p.film_id = f.id
WHERE p.id = '00000000-0000-0000-0000-000000000002';


-- Fix the video ID for the film linked to premiere 000002
-- This updates whichever film is linked to that premiere

UPDATE public.films
SET dacast_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e'
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
  f.dacast_video_id,
  CASE 
    WHEN f.dacast_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e' THEN '✅ CORRECT'
    ELSE '❌ WRONG'
  END as status
FROM public.premieres p
JOIN public.films f ON p.film_id = f.id
WHERE p.id = '00000000-0000-0000-0000-000000000002';


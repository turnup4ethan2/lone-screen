-- Find which film is linked to premiere 000002
SELECT 
  p.id as premiere_id,
  p.premiere_date,
  f.id as film_id,
  f.title as film_title,
  f.dacast_video_id,
  f.dacast_countdown_video_id
FROM public.premieres p
JOIN public.films f ON p.film_id = f.id
WHERE p.id = '00000000-0000-0000-0000-000000000002';


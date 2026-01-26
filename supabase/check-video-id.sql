-- Check which film is linked to premiere 000002 and its video ID
SELECT 
  p.id as premiere_id,
  p.film_id,
  f.id as film_id_verify,
  f.title,
  f.dacast_video_id,
  CASE 
    WHEN f.dacast_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e' THEN '✅ CORRECT (new live stream)'
    WHEN f.dacast_video_id = 'a1266caa-34d1-40f2-99f5-fa5fdc6926fa' THEN '❌ OLD (test video)'
    WHEN f.dacast_video_id IS NULL THEN '❌ NULL (will use fallback)'
    ELSE '⚠️ DIFFERENT VALUE'
  END as status
FROM public.premieres p
JOIN public.films f ON p.film_id = f.id
WHERE p.id = '00000000-0000-0000-0000-000000000002';


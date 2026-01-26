-- Complete debugging query to see exactly what's stored
-- Run this and share the results

-- 1. Check what film is linked to premiere 000002
SELECT 
  '=== PREMIERE INFO ===' as section,
  p.id as premiere_id,
  p.premiere_date,
  p.film_id,
  p.status
FROM public.premieres p
WHERE p.id = '00000000-0000-0000-0000-000000000002';

-- 2. Check what video IDs are stored for that film
SELECT 
  '=== FILM VIDEO IDs ===' as section,
  f.id as film_id,
  f.title,
  f.dacast_video_id,
  f.dacast_countdown_video_id,
  f.dacast_qa_video_id
FROM public.films f
WHERE f.id = (
  SELECT film_id 
  FROM public.premieres 
  WHERE id = '00000000-0000-0000-0000-000000000002'
);

-- 3. Check environment variable fallback (this is what the code uses if dacast_video_id is NULL)
-- Note: You'll need to check your .env.local file for this
SELECT 
  '=== CHECK .env.local ===' as section,
  'NEXT_PUBLIC_DACAST_TEST_VIDEO_ID should be checked manually' as note;


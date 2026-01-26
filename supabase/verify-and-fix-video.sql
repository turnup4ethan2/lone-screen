-- Step 1: Verify what's in the database
SELECT 
  p.id as premiere_id,
  f.id as film_id,
  f.title,
  f.dacast_video_id,
  CASE 
    WHEN f.dacast_video_id IS NULL THEN '❌ NULL - WILL USE FALLBACK'
    WHEN f.dacast_video_id = '' THEN '❌ EMPTY - WILL USE FALLBACK'
    WHEN f.dacast_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e' THEN '✅ CORRECT'
    ELSE '⚠️ DIFFERENT VALUE'
  END as status
FROM public.premieres p
JOIN public.films f ON p.film_id = f.id
WHERE p.id = '00000000-0000-0000-0000-000000000002';

-- Step 2: Force update to make absolutely sure it's set
UPDATE public.films
SET dacast_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e'
WHERE id = (
  SELECT film_id 
  FROM public.premieres 
  WHERE id = '00000000-0000-0000-0000-000000000002'
);

-- Step 3: Verify again
SELECT 
  f.id as film_id,
  f.title,
  f.dacast_video_id
FROM public.films f
WHERE id = (
  SELECT film_id 
  FROM public.premieres 
  WHERE id = '00000000-0000-0000-0000-000000000002'
);


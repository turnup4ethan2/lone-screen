-- Check what video ID is currently stored in the database
SELECT 
  id,
  title,
  dacast_video_id,
  dacast_countdown_video_id
FROM public.films
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Expected video ID should be:
-- a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e


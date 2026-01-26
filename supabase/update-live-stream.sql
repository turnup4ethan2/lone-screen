-- Update the film with the new live stream video ID
-- Replace the video ID with your actual live stream ID from Dacast

UPDATE public.films
SET 
  dacast_video_id = 'a7ff0f8c-63e1-9b1c-91bf-c8ab9d946f9f-live-27eb599b-439e-41e3-b8bb-98ddedaa229e'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Verify the update
SELECT 
  id,
  title,
  dacast_video_id,
  dacast_countdown_video_id
FROM public.films
WHERE id = '00000000-0000-0000-0000-000000000001';


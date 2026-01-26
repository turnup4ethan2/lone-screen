-- Update the premiere date to match your Dacast livestream schedule
-- Livestream starts: Tue Jan 06 2026 20:52:00 GMT+0000 (UTC)

UPDATE public.premieres
SET premiere_date = '2026-01-06 20:52:00+00:00'  -- UTC time
WHERE id = '00000000-0000-0000-0000-000000000002';

-- Verify it's set correctly
SELECT 
  id,
  premiere_date,
  premiere_date AT TIME ZONE 'UTC' as premiere_date_utc,
  NOW() as current_time,
  premiere_date - NOW() as time_until_premiere
FROM public.premieres
WHERE id = '00000000-0000-0000-0000-000000000002';


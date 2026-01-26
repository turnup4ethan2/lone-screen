-- Examples of setting livestream duration (hours, minutes, seconds)

-- 1 hour 30 minutes 0 seconds
UPDATE public.premieres
SET 
  livestream_duration_hours = 1,
  livestream_duration_minutes = 30,
  livestream_duration_seconds = 0
WHERE id = '00000000-0000-0000-0000-000000000002';

-- 90 minutes 30 seconds (0 hours)
-- UPDATE public.premieres
-- SET 
--   livestream_duration_hours = 0,
--   livestream_duration_minutes = 90,
--   livestream_duration_seconds = 30
-- WHERE id = '00000000-0000-0000-0000-000000000002';

-- 2 hours 15 minutes 45 seconds
-- UPDATE public.premieres
-- SET 
--   livestream_duration_hours = 2,
--   livestream_duration_minutes = 15,
--   livestream_duration_seconds = 45
-- WHERE id = '00000000-0000-0000-0000-000000000002';

-- 0 hours 45 minutes 0 seconds (just 45 minutes)
-- UPDATE public.premieres
-- SET 
--   livestream_duration_hours = 0,
--   livestream_duration_minutes = 45,
--   livestream_duration_seconds = 0
-- WHERE id = '00000000-0000-0000-0000-000000000002';

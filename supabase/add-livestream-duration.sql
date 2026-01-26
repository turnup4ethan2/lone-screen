-- Add livestream duration fields to premieres table
-- Separate fields for hours, minutes, and seconds for easy input

ALTER TABLE public.premieres
ADD COLUMN IF NOT EXISTS livestream_duration_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS livestream_duration_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS livestream_duration_seconds INTEGER DEFAULT 0;

-- Add comments to explain the fields
COMMENT ON COLUMN public.premieres.livestream_duration_hours IS 'Hours component of livestream duration';
COMMENT ON COLUMN public.premieres.livestream_duration_minutes IS 'Minutes component of livestream duration (0-59)';
COMMENT ON COLUMN public.premieres.livestream_duration_seconds IS 'Seconds component of livestream duration (0-59)';

-- Example: Set duration for existing premiere
-- 1 hour 30 minutes 0 seconds
-- UPDATE public.premieres
-- SET 
--   livestream_duration_hours = 1,
--   livestream_duration_minutes = 30,
--   livestream_duration_seconds = 0
-- WHERE id = '00000000-0000-0000-0000-000000000002';

-- 90 minutes 30 seconds (0 hours)
-- UPDATE public.premieres
-- SET 
--   livestream_duration_hours = 0,
--   livestream_duration_minutes = 90,
--   livestream_duration_seconds = 30
-- WHERE id = '00000000-0000-0000-0000-000000000002';


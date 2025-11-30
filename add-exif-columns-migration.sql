-- ====================================
-- EXIF DATA COLUMNS MIGRATION
-- ====================================
-- Adds camera and technical metadata columns to photography table

ALTER TABLE photography 
ADD COLUMN IF NOT EXISTS camera_make text,
ADD COLUMN IF NOT EXISTS camera_model text,
ADD COLUMN IF NOT EXISTS lens_model text,
ADD COLUMN IF NOT EXISTS iso integer,
ADD COLUMN IF NOT EXISTS aperture text,
ADD COLUMN IF NOT EXISTS shutter_speed text,
ADD COLUMN IF NOT EXISTS focal_length text,
ADD COLUMN IF NOT EXISTS capture_date timestamp with time zone;

-- Create index for capture_date sorting
CREATE INDEX IF NOT EXISTS idx_photography_capture_date ON photography (capture_date DESC NULLS LAST);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'photography'
AND column_name IN ('camera_make', 'camera_model', 'lens_model', 'iso', 'aperture', 'shutter_speed', 'focal_length', 'capture_date')
ORDER BY ordinal_position;

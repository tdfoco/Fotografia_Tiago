-- Add event columns to hero_images if they don't exist
ALTER TABLE hero_images 
ADD COLUMN IF NOT EXISTS event_name text,
ADD COLUMN IF NOT EXISTS event_date date;

-- Ensure photography has these columns (redundant if previous migration ran, but safe)
ALTER TABLE photography 
ADD COLUMN IF NOT EXISTS event_name text,
ADD COLUMN IF NOT EXISTS event_date date,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Ensure design_projects has these columns
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS event_name text,
ADD COLUMN IF NOT EXISTS event_date date,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create indexes for hero_images
CREATE INDEX IF NOT EXISTS idx_hero_event_date ON hero_images (event_date DESC NULLS LAST);

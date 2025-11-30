-- ====================================
-- CONTENT ORGANIZATION & TAGS MIGRATION
-- ====================================
-- Adds event organization and tag system to photography and design_projects tables

-- Add columns to photography table
ALTER TABLE photography 
ADD COLUMN IF NOT EXISTS event_name text,
ADD COLUMN IF NOT EXISTS event_date date,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add columns to design_projects table
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS event_name text,
ADD COLUMN IF NOT EXISTS event_date date,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create index for faster tag searches
CREATE INDEX IF NOT EXISTS idx_photography_tags ON photography USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_design_tags ON design_projects USING GIN (tags);

-- Create index for event_date sorting
CREATE INDEX IF NOT EXISTS idx_photography_event_date ON photography (event_date DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_design_event_date ON design_projects (event_date DESC NULLS LAST);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('photography', 'design_projects')
AND column_name IN ('event_name', 'event_date', 'tags')
ORDER BY table_name, ordinal_position;

-- Add page column to hero_images table
ALTER TABLE hero_images 
ADD COLUMN IF NOT EXISTS page TEXT DEFAULT 'home';

-- Update existing records to be 'home'
UPDATE hero_images SET page = 'home' WHERE page IS NULL;

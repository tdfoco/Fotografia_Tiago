-- ====================================
-- SOCIAL INTERACTIONS MIGRATION
-- ====================================

-- 1. Add count columns to main tables
ALTER TABLE photography 
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count integer DEFAULT 0;

ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count integer DEFAULT 0;

-- 2. Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content text NOT NULL,
    user_name text DEFAULT 'Anonymous',
    created_at timestamptz DEFAULT now(),
    photo_id uuid REFERENCES photography(id) ON DELETE CASCADE,
    project_id uuid REFERENCES design_projects(id) ON DELETE CASCADE,
    -- Constraint to ensure comment belongs to either photo OR project, not both (or neither)
    CONSTRAINT comment_target_check CHECK (
        (photo_id IS NOT NULL AND project_id IS NULL) OR 
        (photo_id IS NULL AND project_id IS NOT NULL)
    )
);

-- 3. Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_photo_id ON comments(photo_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 4. Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 5. Policies for comments
-- Allow anyone to read comments
CREATE POLICY "Public comments are viewable by everyone" 
ON comments FOR SELECT 
USING (true);

-- Allow anyone to insert comments (public interaction)
CREATE POLICY "Anyone can insert comments" 
ON comments FOR INSERT 
WITH CHECK (true);

-- Allow admin to delete comments (assuming admin uses authenticated client)
CREATE POLICY "Admin can delete comments" 
ON comments FOR DELETE 
USING (auth.role() = 'authenticated');

-- 6. Function to increment counts automatically
CREATE OR REPLACE FUNCTION increment_interaction_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.photo_id IS NOT NULL) THEN
            UPDATE photography SET comments_count = comments_count + 1 WHERE id = NEW.photo_id;
        ELSIF (NEW.project_id IS NOT NULL) THEN
            UPDATE design_projects SET comments_count = comments_count + 1 WHERE id = NEW.project_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.photo_id IS NOT NULL) THEN
            UPDATE photography SET comments_count = comments_count - 1 WHERE id = OLD.photo_id;
        ELSIF (OLD.project_id IS NOT NULL) THEN
            UPDATE design_projects SET comments_count = comments_count - 1 WHERE id = OLD.project_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger for comment counts
DROP TRIGGER IF EXISTS update_comment_count ON comments;
CREATE TRIGGER update_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION increment_interaction_count();

-- 8. RPC function to increment likes/shares safely
CREATE OR REPLACE FUNCTION increment_likes(
    row_id uuid,
    table_name text
)
RETURNS void AS $$
BEGIN
    IF table_name = 'photography' THEN
        UPDATE photography SET likes_count = likes_count + 1 WHERE id = row_id;
    ELSIF table_name = 'design_projects' THEN
        UPDATE design_projects SET likes_count = likes_count + 1 WHERE id = row_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_shares(
    row_id uuid,
    table_name text
)
RETURNS void AS $$
BEGIN
    IF table_name = 'photography' THEN
        UPDATE photography SET shares_count = shares_count + 1 WHERE id = row_id;
    ELSIF table_name = 'design_projects' THEN
        UPDATE design_projects SET shares_count = shares_count + 1 WHERE id = row_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

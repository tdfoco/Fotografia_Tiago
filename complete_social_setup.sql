-- 1. Add counters to photography table
ALTER TABLE public.photography 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;

-- 2. Add counters to design_projects table
ALTER TABLE public.design_projects 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;

-- 3. Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_name TEXT DEFAULT 'Anônimo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    photo_id UUID REFERENCES public.photography(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.design_projects(id) ON DELETE CASCADE,
    approved BOOLEAN DEFAULT FALSE
);

-- 4. Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.comments;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.comments;
DROP POLICY IF EXISTS "Enable delete for admin only" ON public.comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Admin can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Admin can update comments" ON public.comments;
DROP POLICY IF EXISTS "Admin can delete comments" ON public.comments;

-- Public read (approved only)
CREATE POLICY "Public can view approved comments"
ON public.comments FOR SELECT
USING (approved = true);

-- Public insert (always allowed, defaults to approved=false)
CREATE POLICY "Public can insert comments"
ON public.comments FOR INSERT
WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admin can view all comments"
ON public.comments FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update comments"
ON public.comments FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete comments"
ON public.comments FOR DELETE
USING (auth.role() = 'authenticated');

-- 6. Functions for counters
CREATE OR REPLACE FUNCTION increment_likes(row_id UUID, table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET likes_count = likes_count + 1 WHERE id = $1', table_name) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_shares(row_id UUID, table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET shares_count = shares_count + 1 WHERE id = $1', table_name) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

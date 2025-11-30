-- Add approved column to comments table
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;

-- Update RLS policies for comments

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable read access for all users" ON public.comments;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.comments;
DROP POLICY IF EXISTS "Enable delete for admin only" ON public.comments;

-- 1. SELECT: Public can only see approved comments
CREATE POLICY "Public can view approved comments"
ON public.comments
FOR SELECT
USING (approved = true);

-- 2. INSERT: Public can insert comments (they will be approved=false by default)
CREATE POLICY "Public can insert comments"
ON public.comments
FOR INSERT
WITH CHECK (true);

-- 3. ADMIN: Authenticated users (admin) can do everything (SELECT, UPDATE, DELETE)
-- Assuming admin is the only authenticated user in this context, or we check for specific role if needed.
-- For this project, we've been using "authenticated" role as admin for simplicity in some parts, 
-- but let's be specific if possible or stick to the pattern used in other tables.
-- The previous pattern for delete was "Enable delete for admin only" using auth.uid() check against a hardcoded ID or just being authenticated if that's how it was set up.
-- Let's check the previous policy for delete: "Enable delete for users based on user_id" or similar?
-- Actually, in social_interactions.sql we had:
-- CREATE POLICY "Enable delete for admin only" ON public.comments FOR DELETE USING (auth.role() = 'authenticated');

-- So we will use auth.role() = 'authenticated' for Admin privileges.

CREATE POLICY "Admin can view all comments"
ON public.comments
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update comments"
ON public.comments
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete comments"
ON public.comments
FOR DELETE
USING (auth.role() = 'authenticated');

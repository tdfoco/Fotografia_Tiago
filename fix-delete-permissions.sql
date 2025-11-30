-- Allow authenticated users to DELETE files from storage buckets
-- This is necessary for the delete functionality to work completely (removing the file + database record)

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Permitir deleção de imagens de fotografia" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção de imagens de design" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção de imagens de hero" ON storage.objects;

-- Policy for 'photography' bucket
CREATE POLICY "Permitir deleção de imagens de fotografia"
ON storage.objects FOR DELETE
USING (bucket_id = 'photography' AND auth.role() = 'authenticated');

-- Policy for 'design' bucket
CREATE POLICY "Permitir deleção de imagens de design"
ON storage.objects FOR DELETE
USING (bucket_id = 'design' AND auth.role() = 'authenticated');

-- Policy for 'hero' bucket
CREATE POLICY "Permitir deleção de imagens de hero"
ON storage.objects FOR DELETE
USING (bucket_id = 'hero' AND auth.role() = 'authenticated');

-- ========================================
-- DATABASE TABLE DELETE POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS photography ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS design_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hero_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for photography table
DROP POLICY IF EXISTS "Permitir leitura pública de fotografias" ON photography;
DROP POLICY IF EXISTS "Permitir inserção de fotografias para autenticados" ON photography;
DROP POLICY IF EXISTS "Permitir atualização de fotografias para autenticados" ON photography;
DROP POLICY IF EXISTS "Permitir deleção de fotografias para autenticados" ON photography;

-- Create policies for photography table
CREATE POLICY "Permitir leitura pública de fotografias"
ON photography FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de fotografias para autenticados"
ON photography FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de fotografias para autenticados"
ON photography FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir deleção de fotografias para autenticados"
ON photography FOR DELETE
USING (auth.role() = 'authenticated');

-- Drop existing policies for design_projects table
DROP POLICY IF EXISTS "Permitir leitura pública de design_projects" ON design_projects;
DROP POLICY IF EXISTS "Permitir inserção de design_projects para autenticados" ON design_projects;
DROP POLICY IF EXISTS "Permitir atualização de design_projects para autenticados" ON design_projects;
DROP POLICY IF EXISTS "Permitir deleção de design_projects para autenticados" ON design_projects;

-- Create policies for design_projects table
CREATE POLICY "Permitir leitura pública de design_projects"
ON design_projects FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de design_projects para autenticados"
ON design_projects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de design_projects para autenticados"
ON design_projects FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir deleção de design_projects para autenticados"
ON design_projects FOR DELETE
USING (auth.role() = 'authenticated');

-- Drop existing policies for hero_images table
DROP POLICY IF EXISTS "Permitir leitura pública de hero_images" ON hero_images;
DROP POLICY IF EXISTS "Permitir inserção de hero_images para autenticados" ON hero_images;
DROP POLICY IF EXISTS "Permitir atualização de hero_images para autenticados" ON hero_images;
DROP POLICY IF EXISTS "Permitir deleção de hero_images para autenticados" ON hero_images;

-- Create policies for hero_images table
CREATE POLICY "Permitir leitura pública de hero_images"
ON hero_images FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de hero_images para autenticados"
ON hero_images FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de hero_images para autenticados"
ON hero_images FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir deleção de hero_images para autenticados"
ON hero_images FOR DELETE
USING (auth.role() = 'authenticated');

-- FORCE FIX DELETE PERMISSIONS
-- Run this script to completely reset and fix delete permissions for all tables and storage buckets

-- 1. Fix Photography Table
DROP POLICY IF EXISTS "Permitir deleção para usuários autenticados" ON photography;
CREATE POLICY "Permitir deleção para usuários autenticados" 
ON photography FOR DELETE 
USING (auth.role() = 'authenticated');

-- 2. Fix Design Projects Table
DROP POLICY IF EXISTS "Permitir deleção de projetos para usuários autenticados" ON design_projects;
CREATE POLICY "Permitir deleção de projetos para usuários autenticados" 
ON design_projects FOR DELETE 
USING (auth.role() = 'authenticated');

-- 3. Fix Hero Images Table
DROP POLICY IF EXISTS "Permitir deleção de hero_images para autenticados" ON hero_images;
CREATE POLICY "Permitir deleção de hero_images para autenticados" 
ON hero_images FOR DELETE 
USING (auth.role() = 'authenticated');

-- 4. Fix Storage Buckets (Photography)
DROP POLICY IF EXISTS "Permitir deleção de imagens de fotografia" ON storage.objects;
CREATE POLICY "Permitir deleção de imagens de fotografia"
ON storage.objects FOR DELETE
USING (bucket_id = 'photography' AND auth.role() = 'authenticated');

-- 5. Fix Storage Buckets (Design)
DROP POLICY IF EXISTS "Permitir deleção de imagens de design" ON storage.objects;
CREATE POLICY "Permitir deleção de imagens de design"
ON storage.objects FOR DELETE
USING (bucket_id = 'design' AND auth.role() = 'authenticated');

-- 6. Fix Storage Buckets (Hero)
DROP POLICY IF EXISTS "Permitir deleção de imagens de hero" ON storage.objects;
CREATE POLICY "Permitir deleção de imagens de hero"
ON storage.objects FOR DELETE
USING (bucket_id = 'hero' AND auth.role() = 'authenticated');

-- 7. Verify RLS is enabled
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

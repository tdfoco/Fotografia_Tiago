-- ==========================================
-- STORAGE POLICIES - VERSÃO SIMPLES
-- ==========================================
-- Execute este script DEPOIS de criar os buckets photography e design

-- Remover políticas antigas
DROP POLICY IF EXISTS "Allow authenticated uploads to photography" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read photography" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update photography" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete photography" ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated uploads to design" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read design" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update design" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete design" ON storage.objects;

-- PHOTOGRAPHY BUCKET
CREATE POLICY "Allow authenticated uploads to photography"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'photography');

CREATE POLICY "Allow public read photography"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'photography');

CREATE POLICY "Allow authenticated update photography"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'photography');

CREATE POLICY "Allow authenticated delete photography"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'photography');

-- DESIGN BUCKET
CREATE POLICY "Allow authenticated uploads to design"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'design');

CREATE POLICY "Allow public read design"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'design');

CREATE POLICY "Allow authenticated update design"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'design');

CREATE POLICY "Allow authenticated delete design"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'design');

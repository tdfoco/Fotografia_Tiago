-- ==========================================
-- STORAGE POLICIES - PHOTOGRAPHY & DESIGN
-- ==========================================

-- PHOTOGRAPHY BUCKET POLICIES

-- 1. Permitir UPLOAD para usuários autenticados
CREATE POLICY "Allow authenticated uploads to photography"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photography');

-- 2. Permitir LEITURA pública
CREATE POLICY "Allow public read photography"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'photography');

-- 3. Permitir UPDATE para usuários autenticados
CREATE POLICY "Allow authenticated update photography"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'photography')
WITH CHECK (bucket_id = 'photography');

-- 4. Permitir DELETE para usuários autenticados
CREATE POLICY "Allow authenticated delete photography"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'photography');

-- DESIGN BUCKET POLICIES

-- 5. Permitir UPLOAD para usuários autenticados
CREATE POLICY "Allow authenticated uploads to design"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'design');

-- 6. Permitir LEITURA pública
CREATE POLICY "Allow public read design"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'design');

-- 7. Permitir UPDATE para usuários autenticados
CREATE POLICY "Allow authenticated update design"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'design')
WITH CHECK (bucket_id = 'design');

-- 8. Permitir DELETE para usuários autenticados
CREATE POLICY "Allow authenticated delete design"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'design');

-- VERIFICAÇÃO: Ver políticas de storage criadas
SELECT policyname, bucket_id 
FROM storage.policies 
WHERE bucket_id IN ('photography', 'design');

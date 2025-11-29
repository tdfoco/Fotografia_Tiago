-- ==========================================
-- STORAGE POLICIES - LIMPAR E RECRIAR
-- ==========================================

-- PASSO 1: Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Allow authenticated uploads to photography" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read photography" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update photography" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete photography" ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated uploads to design" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read design" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update design" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete design" ON storage.objects;

-- PASSO 2: Criar políticas para PHOTOGRAPHY

CREATE POLICY "Allow authenticated uploads to photography"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photography');

CREATE POLICY "Allow public read photography"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'photography');

CREATE POLICY "Allow authenticated update photography"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'photography')
WITH CHECK (bucket_id = 'photography');

CREATE POLICY "Allow authenticated delete photography"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'photography');

-- PASSO 3: Criar políticas para DESIGN

CREATE POLICY "Allow authenticated uploads to design"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'design');

CREATE POLICY "Allow public read design"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'design');

CREATE POLICY "Allow authenticated update design"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'design')
WITH CHECK (bucket_id = 'design');

CREATE POLICY "Allow authenticated delete design"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'design');

-- VERIFICAÇÃO
SELECT policyname, cmd, bucket_id 
FROM storage.policies 
WHERE bucket_id IN ('photography', 'design')
ORDER BY bucket_id, cmd;

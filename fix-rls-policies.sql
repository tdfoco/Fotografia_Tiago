-- ==========================================
-- FIX RLS POLICIES - PERMITIR INSERTS
-- ==========================================
-- Execute este script no SQL Editor do Supabase

-- 1. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir inserção para usuários autenticados" ON photography;
DROP POLICY IF EXISTS "Permitir atualização para usuários autenticados" ON photography;
DROP POLICY IF EXISTS "Permitir deleção para usuários autenticados" ON photography;

DROP POLICY IF EXISTS "Permitir inserção de projetos para usuários autenticados" ON design_projects;
DROP POLICY IF EXISTS "Permitir atualização de projetos para usuários autenticados" ON design_projects;
DROP POLICY IF EXISTS "Permitir deleção de projetos para usuários autenticados" ON design_projects;

-- 2. Criar novas políticas CORRETAS para PHOTOGRAPHY
CREATE POLICY "Allow authenticated insert photography" 
ON photography FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update photography" 
ON photography FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete photography" 
ON photography FOR DELETE 
TO authenticated
USING (true);

-- 3. Criar novas políticas CORRETAS para DESIGN_PROJECTS
CREATE POLICY "Allow authenticated insert design" 
ON design_projects FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update design" 
ON design_projects FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete design" 
ON design_projects FOR DELETE 
TO authenticated
USING (true);

-- 4. Verificar se o RLS está habilitado
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- FIM DO SCRIPT

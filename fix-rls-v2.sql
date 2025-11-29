-- ==========================================
-- FIX RLS - VERSÃO 2 (MAIS PERMISSIVA)
-- ==========================================

-- 1. DESABILITAR RLS temporariamente para teste
ALTER TABLE photography DISABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects DISABLE ROW LEVEL SECURITY;

-- 2. REMOVER TODAS as políticas existentes
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename IN ('photography', 'design_projects')) 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON photography CASCADE';
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON design_projects CASCADE';
    END LOOP;
END $$;

-- 3. REABILITAR RLS
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas SIMPLES usando auth.uid()
CREATE POLICY "Enable all for authenticated users on photography" 
ON photography
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all for authenticated users on design_projects" 
ON design_projects
FOR ALL  
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. VERIFICAÇÃO: Ver políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('photography', 'design_projects');

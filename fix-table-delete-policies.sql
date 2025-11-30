-- Script simplificado: APENAS políticas DELETE para tabelas do banco
-- Execute este script no Supabase SQL Editor

-- ====================================
-- TABELA: photography
-- ====================================

-- Remove política antiga se existir
DROP POLICY IF EXISTS "Permitir deleção de fotografias para autenticados" ON photography;

-- Cria política DELETE
CREATE POLICY "Permitir deleção de fotografias para autenticados"
ON photography 
FOR DELETE
USING (auth.role() = 'authenticated');

-- ====================================
-- TABELA: design_projects
-- ====================================

-- Remove política antiga se existir
DROP POLICY IF EXISTS "Permitir deleção de design_projects para autenticados" ON design_projects;

-- Cria política DELETE
CREATE POLICY "Permitir deleção de design_projects para autenticados"
ON design_projects 
FOR DELETE
USING (auth.role() = 'authenticated');

-- ====================================
-- TABELA: hero_images
-- ====================================

-- Remove política antiga se existir
DROP POLICY IF EXISTS "Permitir deleção de hero_images para autenticados" ON hero_images;

-- Cria política DELETE
CREATE POLICY "Permitir deleção de hero_images para autenticados"
ON hero_images 
FOR DELETE
USING (auth.role() = 'authenticated');

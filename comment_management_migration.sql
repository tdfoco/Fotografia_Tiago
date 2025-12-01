-- ==========================================
-- Migração para Suporte a Respostas e Gerenciamento de Comentários
-- ==========================================

-- 1. Adicionar colunas parent_id e is_admin (se não existirem)
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON public.comments(approved);

-- 3. Atualizar políticas RLS para permitir DELETE de comentários
DROP POLICY IF EXISTS "Admin can delete comments" ON public.comments;

CREATE POLICY "Admin can delete comments"
ON public.comments FOR DELETE
USING (auth.role() = 'authenticated');

-- 4. Criar política para permitir admin inserir respostas
DROP POLICY IF EXISTS "Admin can insert replies" ON public.comments;

CREATE POLICY "Admin can insert replies"
ON public.comments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 5. Atualizar política de SELECT para incluir respostas
DROP POLICY IF EXISTS "Public can view approved comments and replies" ON public.comments;

CREATE POLICY "Public can view approved comments and replies"
ON public.comments FOR SELECT
USING (
    approved = true OR 
    auth.role() = 'authenticated'
);

-- 6. Verificar todas as políticas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'comments'
ORDER BY policyname;

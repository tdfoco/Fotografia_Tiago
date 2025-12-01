-- Verificar e corrigir permissões de DELETE para comentários

-- 1. Permitir que autenticados (admin) possam deletar comentários
DROP POLICY IF EXISTS "Admin can delete comments" ON public.comments;

CREATE POLICY "Admin can delete comments"
ON public.comments FOR DELETE
USING (auth.role() = 'authenticated');

-- 2. Verificar todas as políticas atuais
SELECT table_name, policy_name, command, permissive, roles, qual, with_check
FROM pg_policies
WHERE table_name = 'comments';

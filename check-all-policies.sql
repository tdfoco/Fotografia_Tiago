-- Ver TODAS as políticas (SELECT, INSERT, UPDATE, DELETE) para as tabelas
-- Procurando por políticas que possam estar bloqueando DELETE

-- Todas as políticas da tabela photography
SELECT 
    tablename,
    policyname,
    cmd as command,
    permissive,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'photography'
ORDER BY cmd;

-- Todas as políticas da tabela design_projects
SELECT 
    tablename,
    policyname,
    cmd as command,
    permissive,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'design_projects'
ORDER BY cmd;

-- Todas as políticas da tabela hero_images
SELECT 
    tablename,
    policyname,
    cmd as command,
    permissive,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'hero_images'
ORDER BY cmd;

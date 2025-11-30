-- Ver os detalhes exatos da política ALL
SELECT 
    tablename,
    policyname,
    cmd,
    qual as using_expression
FROM pg_policies 
WHERE tablename IN ('photography', 'design_projects') 
AND cmd = 'ALL';

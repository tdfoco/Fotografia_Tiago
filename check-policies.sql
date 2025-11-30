-- Run this query to see exactly what DELETE policies exist for your tables
-- This will help us diagnose if the policies were created correctly

-- Check policies for photography table
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'photography' AND cmd = 'DELETE';

-- Check policies for design_projects table
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'design_projects' AND cmd = 'DELETE';

-- Check policies for hero_images table
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'hero_images' AND cmd = 'DELETE';

-- Check storage.objects DELETE policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage' AND cmd = 'DELETE';

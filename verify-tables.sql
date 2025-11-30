-- Check if tables exist and their exact names
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name IN ('photography', 'design_projects', 'hero_images')
ORDER BY table_name;


-- Check if columns exist in photography table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'photography' 
AND column_name IN ('likes_count', 'comments_count', 'shares_count');

-- Check if columns exist in design_projects table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'design_projects' 
AND column_name IN ('likes_count', 'comments_count', 'shares_count');

-- Check if RPC functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
AND routine_name IN ('increment_likes', 'increment_shares');

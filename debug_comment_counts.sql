-- Check if the trigger exists
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'comments'
AND trigger_name = 'trg_update_comments_count';

-- Check a few photography items and their comment counts vs actual approved comments
SELECT 
    p.id, 
    p.title, 
    p.comments_count as stored_count,
    (SELECT count(*) FROM comments c WHERE c.photo_id = p.id AND c.approved = true) as actual_count,
    (SELECT count(*) FROM comments c WHERE c.photo_id = p.id) as total_comments
FROM photography p
LIMIT 5;

-- Check a few design projects
SELECT 
    d.id, 
    d.title, 
    d.comments_count as stored_count,
    (SELECT count(*) FROM comments c WHERE c.project_id = d.id AND c.approved = true) as actual_count,
    (SELECT count(*) FROM comments c WHERE c.project_id = d.id) as total_comments
FROM design_projects d
LIMIT 5;

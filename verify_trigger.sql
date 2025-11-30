-- 1. Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'photography' AND column_name = 'comments_count';

-- 2. Check if trigger exists
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'comments'
AND trigger_name = 'trg_update_comments_count';

-- 3. Test: Pick a photo, get current count, insert approved comment, check count again
DO $$
DECLARE
    v_photo_id UUID;
    v_initial_count INTEGER;
    v_new_count INTEGER;
BEGIN
    -- Get a photo ID
    SELECT id INTO v_photo_id FROM public.photography LIMIT 1;
    
    -- Get initial count
    SELECT comments_count INTO v_initial_count FROM public.photography WHERE id = v_photo_id;
    
    RAISE NOTICE 'Initial count for photo %: %', v_photo_id, v_initial_count;
    
    -- Insert APPROVED comment (simulating approval)
    INSERT INTO public.comments (content, user_name, photo_id, approved)
    VALUES ('Test Trigger', 'Tester', v_photo_id, true);
    
    -- Check new count
    SELECT comments_count INTO v_new_count FROM public.photography WHERE id = v_photo_id;
    
    RAISE NOTICE 'Count after approved insert: %', v_new_count;
    
    IF v_new_count = (COALESCE(v_initial_count, 0) + 1) THEN
        RAISE NOTICE 'SUCCESS: Trigger updated count.';
    ELSE
        RAISE NOTICE 'FAILURE: Trigger did not update count.';
    END IF;
    
    -- Cleanup
    DELETE FROM public.comments WHERE content = 'Test Trigger' AND user_name = 'Tester';
END $$;

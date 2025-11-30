-- 1. Ensure no NULL values exist in counters
UPDATE public.photography SET comments_count = 0 WHERE comments_count IS NULL;
UPDATE public.design_projects SET comments_count = 0 WHERE comments_count IS NULL;

UPDATE public.photography SET likes_count = 0 WHERE likes_count IS NULL;
UPDATE public.design_projects SET likes_count = 0 WHERE likes_count IS NULL;

UPDATE public.photography SET shares_count = 0 WHERE shares_count IS NULL;
UPDATE public.design_projects SET shares_count = 0 WHERE shares_count IS NULL;

-- 2. Update the function to handle NULLs safely using COALESCE
CREATE OR REPLACE FUNCTION public.update_comments_count_fn()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.approved = true) THEN
            IF (NEW.photo_id IS NOT NULL) THEN
                UPDATE public.photography 
                SET comments_count = COALESCE(comments_count, 0) + 1 
                WHERE id = NEW.photo_id;
            ELSIF (NEW.project_id IS NOT NULL) THEN
                UPDATE public.design_projects 
                SET comments_count = COALESCE(comments_count, 0) + 1 
                WHERE id = NEW.project_id;
            END IF;
        END IF;
        RETURN NEW;
    
    -- Handle DELETE
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.approved = true) THEN
            IF (OLD.photo_id IS NOT NULL) THEN
                UPDATE public.photography 
                SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1) 
                WHERE id = OLD.photo_id;
            ELSIF (OLD.project_id IS NOT NULL) THEN
                UPDATE public.design_projects 
                SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1) 
                WHERE id = OLD.project_id;
            END IF;
        END IF;
        RETURN OLD;

    -- Handle UPDATE
    ELSIF (TG_OP = 'UPDATE') THEN
        -- If status changed from NOT APPROVED to APPROVED -> Increment
        IF (OLD.approved = false AND NEW.approved = true) THEN
            IF (NEW.photo_id IS NOT NULL) THEN
                UPDATE public.photography 
                SET comments_count = COALESCE(comments_count, 0) + 1 
                WHERE id = NEW.photo_id;
            ELSIF (NEW.project_id IS NOT NULL) THEN
                UPDATE public.design_projects 
                SET comments_count = COALESCE(comments_count, 0) + 1 
                WHERE id = NEW.project_id;
            END IF;
        
        -- If status changed from APPROVED to NOT APPROVED -> Decrement
        ELSIF (OLD.approved = true AND NEW.approved = false) THEN
            IF (NEW.photo_id IS NOT NULL) THEN
                UPDATE public.photography 
                SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1) 
                WHERE id = NEW.photo_id;
            ELSIF (NEW.project_id IS NOT NULL) THEN
                UPDATE public.design_projects 
                SET comments_count = GREATEST(0, COALESCE(comments_count, 0) - 1) 
                WHERE id = NEW.project_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Force recalculation of all counts to be 100% sure
UPDATE public.photography p 
SET comments_count = (
    SELECT count(*) 
    FROM public.comments c 
    WHERE c.photo_id = p.id AND c.approved = true
);

UPDATE public.design_projects p 
SET comments_count = (
    SELECT count(*) 
    FROM public.comments c 
    WHERE c.project_id = p.id AND c.approved = true
);

-- Function to update comments count
CREATE OR REPLACE FUNCTION public.update_comments_count_fn()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.approved = true) THEN
            IF (NEW.photo_id IS NOT NULL) THEN
                UPDATE public.photography SET comments_count = comments_count + 1 WHERE id = NEW.photo_id;
            ELSIF (NEW.project_id IS NOT NULL) THEN
                UPDATE public.design_projects SET comments_count = comments_count + 1 WHERE id = NEW.project_id;
            END IF;
        END IF;
        RETURN NEW;
    
    -- Handle DELETE
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.approved = true) THEN
            IF (OLD.photo_id IS NOT NULL) THEN
                UPDATE public.photography SET comments_count = comments_count - 1 WHERE id = OLD.photo_id;
            ELSIF (OLD.project_id IS NOT NULL) THEN
                UPDATE public.design_projects SET comments_count = comments_count - 1 WHERE id = OLD.project_id;
            END IF;
        END IF;
        RETURN OLD;

    -- Handle UPDATE
    ELSIF (TG_OP = 'UPDATE') THEN
        -- If status changed from NOT APPROVED to APPROVED -> Increment
        IF (OLD.approved = false AND NEW.approved = true) THEN
            IF (NEW.photo_id IS NOT NULL) THEN
                UPDATE public.photography SET comments_count = comments_count + 1 WHERE id = NEW.photo_id;
            ELSIF (NEW.project_id IS NOT NULL) THEN
                UPDATE public.design_projects SET comments_count = comments_count + 1 WHERE id = NEW.project_id;
            END IF;
        
        -- If status changed from APPROVED to NOT APPROVED -> Decrement
        ELSIF (OLD.approved = true AND NEW.approved = false) THEN
            IF (NEW.photo_id IS NOT NULL) THEN
                UPDATE public.photography SET comments_count = comments_count - 1 WHERE id = NEW.photo_id;
            ELSIF (NEW.project_id IS NOT NULL) THEN
                UPDATE public.design_projects SET comments_count = comments_count - 1 WHERE id = NEW.project_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trg_update_comments_count ON public.comments;

-- Create trigger
CREATE TRIGGER trg_update_comments_count
AFTER INSERT OR UPDATE OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.update_comments_count_fn();

-- Recalculate existing counts for Photography
UPDATE public.photography p 
SET comments_count = (
    SELECT count(*) 
    FROM public.comments c 
    WHERE c.photo_id = p.id AND c.approved = true
);

-- Recalculate existing counts for Design Projects
UPDATE public.design_projects p 
SET comments_count = (
    SELECT count(*) 
    FROM public.comments c 
    WHERE c.project_id = p.id AND c.approved = true
);

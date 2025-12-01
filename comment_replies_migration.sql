-- Adicionar suporte a respostas nos comentários
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Criar índice para melhorar performance de queries de respostas
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

-- Comentários de resposta (com parent_id) não devem contar no total
-- Atualizar o trigger para considerar apenas comentários raiz (parent_id IS NULL)
CREATE OR REPLACE FUNCTION public.update_comments_count_fn()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF (TG_OP = 'INSERT') THEN
        -- Apenas contar se for comentário raiz (não é resposta) e está aprovado
        IF (NEW.approved = true AND NEW.parent_id IS NULL) THEN
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
        -- Apenas decrementar se for comentário raiz aprovado
        IF (OLD.approved = true AND OLD.parent_id IS NULL) THEN
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
        -- Apenas para comentários raiz
        IF (NEW.parent_id IS NULL) THEN
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
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recalcular contagens (apenas comentários raiz)
UPDATE public.photography p 
SET comments_count = (
    SELECT count(*) 
    FROM public.comments c 
    WHERE c.photo_id = p.id AND c.approved = true AND c.parent_id IS NULL
);

UPDATE public.design_projects p 
SET comments_count = (
    SELECT count(*) 
    FROM public.comments c 
    WHERE c.project_id = p.id AND c.approved = true AND c.parent_id IS NULL
);

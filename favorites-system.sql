-- ====================================
-- FAVORITES SYSTEM
-- Sistema de favoritos para usuários
-- ====================================

-- Este script implementa um sistema completo de favoritos
-- Permite que usuários salvem suas fotografias e projetos favoritos
-- Inclui contadores automáticos e RLS para segurança

-- ====================================
-- 1. CRIAR TABELA DE FAVORITOS
-- ====================================

CREATE TABLE IF NOT EXISTS favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_id uuid REFERENCES photography(id) ON DELETE CASCADE,
  project_id uuid REFERENCES design_projects(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Garantir que cada usuário pode favoritar cada item apenas uma vez
  CONSTRAINT unique_user_photo UNIQUE(user_id, photo_id),
  CONSTRAINT unique_user_project UNIQUE(user_id, project_id),
  
  -- Garantir que OU é uma foto OU é um projeto, não ambos
  CONSTRAINT check_photo_or_project CHECK (
    (photo_id IS NOT NULL AND project_id IS NULL) OR 
    (photo_id IS NULL AND project_id IS NOT NULL)
  )
);

COMMENT ON TABLE favorites IS 'Favoritos dos usuários (fotografias e projetos)';
COMMENT ON COLUMN favorites.user_id IS 'Usuário que favoritou';
COMMENT ON COLUMN favorites.photo_id IS 'ID da fotografia (se aplicável)';
COMMENT ON COLUMN favorites.project_id IS 'ID do projeto de design (se aplicável)';

-- ====================================
-- 2. ADICIONAR CONTADORES NAS TABELAS PRINCIPAIS
-- ====================================

-- Adicionar contador de favoritos em photography
ALTER TABLE photography 
ADD COLUMN IF NOT EXISTS favorites_count integer DEFAULT 0 NOT NULL;

COMMENT ON COLUMN photography.favorites_count IS 'Contador de favoritos (atualizado automaticamente)';

-- Adicionar contador de favoritos em design_projects
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS favorites_count integer DEFAULT 0 NOT NULL;

COMMENT ON COLUMN design_projects.favorites_count IS 'Contador de favoritos (atualizado automaticamente)';

-- Criar índices para os contadores (útil para ordenação)
CREATE INDEX IF NOT EXISTS photography_favorites_count_idx ON photography(favorites_count DESC);
CREATE INDEX IF NOT EXISTS design_projects_favorites_count_idx ON design_projects(favorites_count DESC);

-- ====================================
-- 3. FUNÇÕES DE ATUALIZAÇÃO DE CONTADORES
-- ====================================

-- Função para incrementar contador
CREATE OR REPLACE FUNCTION increment_favorites_count()
RETURNS trigger AS $$
BEGIN
  -- Incrementar contador na tabela apropriada
  IF NEW.photo_id IS NOT NULL THEN
    UPDATE photography 
    SET favorites_count = favorites_count + 1 
    WHERE id = NEW.photo_id;
  ELSIF NEW.project_id IS NOT NULL THEN
    UPDATE design_projects 
    SET favorites_count = favorites_count + 1 
    WHERE id = NEW.project_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para decrementar contador
CREATE OR REPLACE FUNCTION decrement_favorites_count()
RETURNS trigger AS $$
BEGIN
  -- Decrementar contador na tabela apropriada
  IF OLD.photo_id IS NOT NULL THEN
    UPDATE photography 
    SET favorites_count = GREATEST(favorites_count - 1, 0)
    WHERE id = OLD.photo_id;
  ELSIF OLD.project_id IS NOT NULL THEN
    UPDATE design_projects 
    SET favorites_count = GREATEST(favorites_count - 1, 0)
    WHERE id = OLD.project_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 4. CRIAR TRIGGERS PARA CONTADORES
-- ====================================

-- Drop triggers se existirem
DROP TRIGGER IF EXISTS favorites_increment_trigger ON favorites;
DROP TRIGGER IF EXISTS favorites_decrement_trigger ON favorites;

-- Trigger para incrementar ao adicionar favorito
CREATE TRIGGER favorites_increment_trigger
AFTER INSERT ON favorites
FOR EACH ROW
EXECUTE FUNCTION increment_favorites_count();

-- Trigger para decrementar ao remover favorito
CREATE TRIGGER favorites_decrement_trigger
AFTER DELETE ON favorites
FOR EACH ROW
EXECUTE FUNCTION decrement_favorites_count();

-- ====================================
-- 5. POPULAR CONTADORES EXISTENTES
-- ====================================

-- Atualizar contadores para refletir favoritos existentes (se houver)
UPDATE photography p
SET favorites_count = (
  SELECT COUNT(*) 
  FROM favorites f 
  WHERE f.photo_id = p.id
);

UPDATE design_projects d
SET favorites_count = (
  SELECT COUNT(*) 
  FROM favorites f 
  WHERE f.project_id = d.id
);

-- ====================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ====================================

-- Habilitar RLS na tabela de favoritos
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seus próprios favoritos
CREATE POLICY "Usuários podem ver seus próprios favoritos"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuários autenticados podem adicionar favoritos
CREATE POLICY "Usuários autenticados podem adicionar favoritos"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem remover apenas seus próprios favoritos
CREATE POLICY "Usuários podem remover seus próprios favoritos"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- ====================================
-- 7. ÍNDICES PARA PERFORMANCE
-- ====================================

-- Índice para buscar favoritos de um usuário
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);

-- Índice para buscar favoritos de uma foto
CREATE INDEX IF NOT EXISTS favorites_photo_id_idx ON favorites(photo_id) WHERE photo_id IS NOT NULL;

-- Índice para buscar favoritos de um projeto
CREATE INDEX IF NOT EXISTS favorites_project_id_idx ON favorites(project_id) WHERE project_id IS NOT NULL;

-- Índice composto para verificação rápida de favorito existente
CREATE INDEX IF NOT EXISTS favorites_user_photo_idx ON favorites(user_id, photo_id) WHERE photo_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS favorites_user_project_idx ON favorites(user_id, project_id) WHERE project_id IS NOT NULL;

-- ====================================
-- 8. FUNÇÕES HELPER
-- ====================================

-- Verificar se um item está favoritado por um usuário
CREATE OR REPLACE FUNCTION is_favorited(
  item_id uuid,
  item_type text,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS boolean AS $$
DECLARE
  result boolean;
BEGIN
  IF user_id_param IS NULL THEN
    RETURN false;
  END IF;

  IF item_type = 'photography' THEN
    SELECT EXISTS(
      SELECT 1 FROM favorites 
      WHERE user_id = user_id_param AND photo_id = item_id
    ) INTO result;
  ELSIF item_type = 'design' THEN
    SELECT EXISTS(
      SELECT 1 FROM favorites 
      WHERE user_id = user_id_param AND project_id = item_id
    ) INTO result;
  ELSE
    RETURN false;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Toggle favorito (adicionar se não existe, remover se existe)
CREATE OR REPLACE FUNCTION toggle_favorite(
  item_id uuid,
  item_type text,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS boolean AS $$
DECLARE
  is_fav boolean;
  fav_id uuid;
BEGIN
  -- Verificar autenticação
  IF user_id_param IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  -- Verificar se já está favoritado
  is_fav := is_favorited(item_id, item_type, user_id_param);

  IF is_fav THEN
    -- Remover favorito
    IF item_type = 'photography' THEN
      DELETE FROM favorites 
      WHERE user_id = user_id_param AND photo_id = item_id;
    ELSIF item_type = 'design' THEN
      DELETE FROM favorites 
      WHERE user_id = user_id_param AND project_id = item_id;
    END IF;
    RETURN false; -- Não está mais favoritado
  ELSE
    -- Adicionar favorito
    IF item_type = 'photography' THEN
      INSERT INTO favorites (user_id, photo_id) 
      VALUES (user_id_param, item_id);
    ELSIF item_type = 'design' THEN
      INSERT INTO favorites (user_id, project_id) 
      VALUES (user_id_param, item_id);
    END IF;
    RETURN true; -- Agora está favoritado
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obter todos os favoritos de um usuário
CREATE OR REPLACE FUNCTION get_user_favorites(
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS TABLE (
  id uuid,
  type text,
  title text,
  url text,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  
  -- Fotografias favoritadas
  SELECT 
    p.id,
    'photography'::text as type,
    p.title,
    p.url,
    f.created_at
  FROM favorites f
  JOIN photography p ON f.photo_id = p.id
  WHERE f.user_id = user_id_param AND f.photo_id IS NOT NULL
  
  UNION ALL
  
  -- Projetos favoritados
  SELECT 
    d.id,
    'design'::text as type,
    d.title,
    d.images[1] as url,
    f.created_at
  FROM favorites f
  JOIN design_projects d ON f.project_id = d.id
  WHERE f.user_id = user_id_param AND f.project_id IS NOT NULL
  
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- EXEMPLOS DE USO
-- ====================================

-- EXEMPLO 1: Adicionar favorito
-- INSERT INTO favorites (user_id, photo_id) VALUES (auth.uid(), 'uuid-da-foto');

-- EXEMPLO 2: Remover favorito
-- DELETE FROM favorites WHERE user_id = auth.uid() AND photo_id = 'uuid-da-foto';

-- EXEMPLO 3: Toggle favorito (usar função helper)
-- SELECT toggle_favorite('uuid-do-item', 'photography');

-- EXEMPLO 4: Verificar se está favoritado
-- SELECT is_favorited('uuid-do-item', 'photography');

-- EXEMPLO 5: Obter todos os favoritos do usuário
-- SELECT * FROM get_user_favorites();

-- EXEMPLO 6: Itens mais favoritados
-- SELECT title, favorites_count FROM photography ORDER BY favorites_count DESC LIMIT 10;

-- ====================================
-- FIM DO SCRIPT
-- ====================================

-- NOTAS IMPORTANTES:
-- 1. RLS garante que usuários só veem seus próprios favoritos
-- 2. Triggers mantêm contadores sempre atualizados automaticamente
-- 3. Constraints garantem que cada item só pode ser favoritado uma vez por usuário
-- 4. Funções helper facilitam operações comuns do frontend
-- 5. Índices otimizam queries de favoritos para performance

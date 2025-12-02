-- ====================================
-- FULL-TEXT SEARCH IMPLEMENTATION
-- PostgreSQL tsvector com suporte PT-BR
-- ====================================

-- Este script implementa busca de texto completo usando tsvector do PostgreSQL
-- Benefícios:
-- - Busca muito mais rápida que ILIKE
-- - Suporte a stemming (radicais de palavras)
-- - Ranking de relevância
-- - Suporte a acentuação português brasileiro

-- ====================================
-- 1. ADICIONAR COLUNAS SEARCH_VECTOR
-- ====================================

-- Adicionar coluna para photography
ALTER TABLE photography 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Adicionar coluna para design_projects
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- ====================================
-- 2. FUNÇÃO DE ATUALIZAÇÃO DO SEARCH_VECTOR
-- ====================================

-- Função para photography
CREATE OR REPLACE FUNCTION photography_search_vector_update() 
RETURNS trigger AS $$
BEGIN
  -- Combinar title, description, event_name e tags para busca
  -- Usando configuração 'portuguese' para stemming correto
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.event_name, '')), 'C') ||
    setweight(to_tsvector('portuguese', coalesce(array_to_string(NEW.tags, ' '), '')), 'D');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para design_projects
CREATE OR REPLACE FUNCTION design_projects_search_vector_update() 
RETURNS trigger AS $$
BEGIN
  -- Combinar title, description, event_name, client e tags para busca
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.event_name, '')), 'C') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.client, '')), 'C') ||
    setweight(to_tsvector('portuguese', coalesce(array_to_string(NEW.tags, ' '), '')), 'D');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 3. CRIAR TRIGGERS
-- ====================================

-- Drop triggers se já existirem
DROP TRIGGER IF EXISTS photography_search_vector_trigger ON photography;
DROP TRIGGER IF EXISTS design_projects_search_vector_trigger ON design_projects;

-- Trigger para photography (antes de INSERT ou UPDATE)
CREATE TRIGGER photography_search_vector_trigger
BEFORE INSERT OR UPDATE ON photography
FOR EACH ROW
EXECUTE FUNCTION photography_search_vector_update();

-- Trigger para design_projects (antes de INSERT ou UPDATE)
CREATE TRIGGER design_projects_search_vector_trigger
BEFORE INSERT OR UPDATE ON design_projects
FOR EACH ROW
EXECUTE FUNCTION design_projects_search_vector_update();

-- ====================================
-- 4. POPULAR SEARCH_VECTOR EXISTENTE
-- ====================================

-- Atualizar todas as linhas existentes para gerar search_vector
UPDATE photography SET updated_at = updated_at;
UPDATE design_projects SET updated_at = updated_at;

-- ====================================
-- 5. CRIAR ÍNDICES GIN
-- ====================================

-- Índice GIN para photography (muito mais rápido para full-text search)
CREATE INDEX IF NOT EXISTS photography_search_vector_idx 
ON photography USING GIN(search_vector);

-- Índice GIN para design_projects
CREATE INDEX IF NOT EXISTS design_projects_search_vector_idx 
ON design_projects USING GIN(search_vector);

-- ====================================
-- 6. FUNÇÃO HELPER PARA BUSCA
-- ====================================

-- Função helper que pode ser chamada do frontend
CREATE OR REPLACE FUNCTION search_content(
  query_text text,
  limit_results integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  type text,
  title text,
  description text,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  
  -- Buscar em photography
  SELECT 
    p.id,
    'photography'::text as type,
    p.title,
    p.description,
    ts_rank(p.search_vector, plainto_tsquery('portuguese', query_text)) as rank
  FROM photography p
  WHERE p.search_vector @@ plainto_tsquery('portuguese', query_text)
  
  UNION ALL
  
  -- Buscar em design_projects
  SELECT 
    d.id,
    'design'::text as type,
    d.title,
    d.description,
    ts_rank(d.search_vector, plainto_tsquery('portuguese', query_text)) as rank
  FROM design_projects d
  WHERE d.search_vector @@ plainto_tsquery('portuguese', query_text)
  
  ORDER BY rank DESC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 7. EXEMPLOS DE USO
-- ====================================

-- EXEMPLO 1: Busca simples
-- SELECT * FROM search_content('paisagem');

-- EXEMPLO 2: Busca com ranking
-- SELECT 
--   title,
--   ts_rank(search_vector, plainto_tsquery('portuguese', 'urbano')) as rank
-- FROM photography
-- WHERE search_vector @@ plainto_tsquery('portuguese', 'urbano')
-- ORDER BY rank DESC;

-- EXEMPLO 3: Busca com múltiplas palavras
-- SELECT * FROM search_content('retrato profissional');

-- EXEMPLO 4: Highlighting (destacar termos encontrados)
-- SELECT 
--   title,
--   ts_headline('portuguese', description, plainto_tsquery('portuguese', 'fotografia')) as highlighted
-- FROM photography
-- WHERE search_vector @@ plainto_tsquery('portuguese', 'fotografia')
-- LIMIT 5;

-- ====================================
-- FIM DO SCRIPT
-- ====================================

-- NOTAS IMPORTANTES:
-- 1. A configuração 'portuguese' aplica stemming correto para português
-- 2. Os pesos (A, B, C, D) determinam a importância de cada campo no ranking
--    A = mais importante (title)
--    B = importante (description)
--    C = moderado (event_name, client)
--    D = menos importante (tags)
-- 3. O operador @@ verifica se o search_vector contém a query
-- 4. ts_rank() calcula relevância (quanto maior, melhor)
-- 5. Índices GIN tornam a busca muito rápida mesmo com milhares de registros

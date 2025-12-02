-- ====================================
-- IMAGE OPTIMIZATION SYSTEM
-- Low-Res/High-Res com Supabase Storage
-- ====================================

-- Este script adiciona suporte para múltiplas versões de imagens
-- Benefícios:
-- - Servir imagens de baixa resolução publicamente (proteção)
-- - Alta resolução apenas para usuários autenticados
-- - Melhor performance no carregamento inicial
-- - Thumbnails para listagens

-- ====================================
-- 1. ADICIONAR COLUNAS PARA VERSÕES DE IMAGENS
-- ====================================

-- Photography: adicionar colunas para low-res e thumbnail
ALTER TABLE photography 
ADD COLUMN IF NOT EXISTS url_lowres text,
ADD COLUMN IF NOT EXISTS url_thumbnail text,
ADD COLUMN IF NOT EXISTS blur_hash text; -- Para placeholder blur

COMMENT ON COLUMN photography.url_lowres IS 'URL da versão de baixa resolução (pública)';
COMMENT ON COLUMN photography.url_thumbnail IS 'URL do thumbnail pequeno';
COMMENT ON COLUMN photography.blur_hash IS 'Hash para blur placeholder';

-- Design Projects: adicionar colunas para low-res e thumbnails
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS images_lowres text[],
ADD COLUMN IF NOT EXISTS images_thumbnail text[],
ADD COLUMN IF NOT EXISTS blur_hashes text[];

COMMENT ON COLUMN design_projects.images_lowres IS 'URLs das versões de baixa resolução';
COMMENT ON COLUMN design_projects.images_thumbnail IS 'URLs dos thumbnails';
COMMENT ON COLUMN design_projects.blur_hashes IS 'Hashes para blur placeholders';

-- ====================================
-- 2. FUNÇÃO PARA GERAR URLs TRANSFORMADAS
-- ====================================

-- Supabase Storage permite transformações via parâmetros de URL
-- Formato: /storage/v1/object/public/bucket/path?width=X&height=Y&quality=Q

CREATE OR REPLACE FUNCTION generate_transformed_image_url(
  original_url text,
  transformation_type text -- 'lowres', 'thumbnail', 'highres'
)
RETURNS text AS $$
DECLARE
  base_url text;
  params text;
BEGIN
  -- Se a URL já tem parâmetros ou não é do Supabase Storage, retornar original
  IF original_url IS NULL OR original_url !~ 'supabase' THEN
    RETURN original_url;
  END IF;

  -- Remover parâmetros existentes
  base_url := regexp_replace(original_url, '\?.*$', '');

  -- Definir parâmetros de transformação
  params := CASE transformation_type
    WHEN 'lowres' THEN '?width=800&quality=60'
    WHEN 'thumbnail' THEN '?width=400&height=300&quality=50'
    WHEN 'highres' THEN '?quality=90'
    ELSE ''
  END;

  RETURN base_url || params;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ====================================
-- 3. FUNÇÃO PARA ATUALIZAR URLs AUTOMATICAMENTE
-- ====================================

-- Trigger function para photography
CREATE OR REPLACE FUNCTION update_photography_image_urls()
RETURNS trigger AS $$
BEGIN
  -- Se a URL principal foi atualizada, gerar versões automaticamente
  IF NEW.url IS DISTINCT FROM OLD.url OR (TG_OP = 'INSERT' AND NEW.url IS NOT NULL) THEN
    NEW.url_lowres := generate_transformed_image_url(NEW.url, 'lowres');
    NEW.url_thumbnail := generate_transformed_image_url(NEW.url, 'thumbnail');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function para design_projects
CREATE OR REPLACE FUNCTION update_design_images_urls()
RETURNS trigger AS $$
DECLARE
  img_url text;
  lowres_urls text[];
  thumbnail_urls text[];
BEGIN
  -- Se as imagens foram atualizadas, gerar versões
  IF NEW.images IS DISTINCT FROM OLD.images OR (TG_OP = 'INSERT' AND NEW.images IS NOT NULL) THEN
    lowres_urls := ARRAY[]::text[];
    thumbnail_urls := ARRAY[]::text[];
    
    -- Processar cada imagem
    FOREACH img_url IN ARRAY NEW.images LOOP
      lowres_urls := lowres_urls || generate_transformed_image_url(img_url, 'lowres');
      thumbnail_urls := thumbnail_urls || generate_transformed_image_url(img_url, 'thumbnail');
    END LOOP;
    
    NEW.images_lowres := lowres_urls;
    NEW.images_thumbnail := thumbnail_urls;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 4. CRIAR TRIGGERS
-- ====================================

-- Drop triggers se existirem
DROP TRIGGER IF EXISTS photography_image_urls_trigger ON photography;
DROP TRIGGER IF EXISTS design_images_urls_trigger ON design_projects;

-- Trigger para photography
CREATE TRIGGER photography_image_urls_trigger
BEFORE INSERT OR UPDATE ON photography
FOR EACH ROW
EXECUTE FUNCTION update_photography_image_urls();

-- Trigger para design_projects
CREATE TRIGGER design_images_urls_trigger
BEFORE INSERT OR UPDATE ON design_projects
FOR EACH ROW
EXECUTE FUNCTION update_design_images_urls();

-- ====================================
-- 5. ATUALIZAR REGISTROS EXISTENTES
-- ====================================

-- Gerar URLs transformadas para todos os registros existentes
UPDATE photography 
SET url = url
WHERE url IS NOT NULL AND url_lowres IS NULL;

UPDATE design_projects 
SET images = images
WHERE images IS NOT NULL AND images_lowres IS NULL;

-- ====================================
-- 6. POLÍTICA DE ACESSO RLS PARA IMAGENS
-- ====================================

-- Já temos RLS nas tabelas principais, mas vamos garantir que:
-- - Qualquer pessoa pode ver low-res e thumbnails (via SELECT público)
-- - Apenas autenticados podem fazer upload/update de imagens

-- Verificar políticas de Storage (deve ser configurado na UI do Supabase)
-- Bucket 'photography' e 'design' devem permitir:
-- - Leitura pública (para servir low-res)
-- - Upload apenas autenticado

-- ====================================
-- 7. FUNÇÃO HELPER PARA OBTER VERSÃO CORRETA
-- ====================================

CREATE OR REPLACE FUNCTION get_image_url_for_user(
  photo_id uuid,
  user_authenticated boolean DEFAULT false
)
RETURNS text AS $$
DECLARE
  result text;
BEGIN
  IF user_authenticated THEN
    -- Usuário autenticado: retornar alta resolução
    SELECT url INTO result FROM photography WHERE id = photo_id;
  ELSE
    -- Público: retornar baixa resolução
    SELECT url_lowres INTO result FROM photography WHERE id = photo_id;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- 8. ÍNDICES PARA PERFORMANCE
-- ====================================

-- Criar índices para buscas rápidas
CREATE INDEX IF NOT EXISTS photography_url_idx ON photography(url);
CREATE INDEX IF NOT EXISTS design_projects_images_idx ON design_projects USING GIN(images);

-- ====================================
-- EXEMPLOS DE USO
-- ====================================

-- EXEMPLO 1: Obter todas as fotos com URLs otimizadas
-- SELECT id, title, url_lowres, url_thumbnail FROM photography LIMIT 5;

-- EXEMPLO 2: Obter URL correta baseado em autenticação
-- SELECT get_image_url_for_user('uuid-da-foto', true); -- autenticado
-- SELECT get_image_url_for_user('uuid-da-foto', false); -- público

-- EXEMPLO 3: Atualizar uma foto (trigger gera URLs automaticamente)
-- UPDATE photography SET url = 'nova-url.jpg' WHERE id = 'uuid';

-- ====================================
-- FIM DO SCRIPT
-- ====================================

-- NOTAS IMPORTANTES:
-- 1. As transformações de imagem do Supabase são aplicadas via parâmetros de URL
-- 2. Formatos suportados: ?width=X&height=Y&quality=Q&resize=cover/contain
-- 3. O trigger atualiza automaticamente as URLs quando a imagem principal muda
-- 4. Para blur placeholder, uma biblioteca JS (blurhash) pode ser usada no frontend
-- 5. Configurar CORS e políticas de Storage no dashboard do Supabase

-- PRÓXIMOS PASSOS:
-- 1. Configurar buckets no Supabase Storage UI
-- 2. Configurar políticas de acesso nos buckets
-- 3. Implementar upload de imagens com geração de blur hash no frontend
-- 4. Atualizar componentes React para usar url_lowres por padrão

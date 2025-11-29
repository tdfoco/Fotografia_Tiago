-- ====================================
-- SUPABASE SQL SETUP - REFERÊNCIA RÁPIDA
-- ====================================
-- Cole este arquivo inteiro no SQL Editor do Supabase
-- ou execute seção por seção

-- ====================================
-- 1. TABELAS
-- ====================================

-- Tabela de Fotografia
CREATE TABLE photography (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text CHECK (category IN ('portraits', 'urban', 'nature', 'art', 'events')),
  url text NOT NULL,
  description text,
  year integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Projetos de Design
CREATE TABLE design_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text CHECK (category IN ('logos', 'visual_identity', 'social_media', 'posters', 'special')),
  description text NOT NULL,
  images text[] NOT NULL,
  client text,
  year integer,
  link text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ====================================

-- Habilitar RLS nas tabelas
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 3. POLÍTICAS DE ACESSO - PHOTOGRAPHY
-- ====================================

-- Leitura pública (qualquer pessoa pode ver)
CREATE POLICY "Permitir leitura pública de fotografia" 
ON photography FOR SELECT 
USING (true);

-- Inserção apenas para usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" 
ON photography FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Atualização apenas para usuários autenticados
CREATE POLICY "Permitir atualização para usuários autenticados" 
ON photography FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Deleção apenas para usuários autenticados
CREATE POLICY "Permitir deleção para usuários autenticados" 
ON photography FOR DELETE 
USING (auth.role() = 'authenticated');

-- ====================================
-- 4. POLÍTICAS DE ACESSO - DESIGN PROJECTS
-- ====================================

-- Leitura pública (qualquer pessoa pode ver)
CREATE POLICY "Permitir leitura pública de projetos" 
ON design_projects FOR SELECT 
USING (true);

-- Inserção apenas para usuários autenticados
CREATE POLICY "Permitir inserção de projetos para usuários autenticados" 
ON design_projects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Atualização apenas para usuários autenticados
CREATE POLICY "Permitir atualização de projetos para usuários autenticados" 
ON design_projects FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Deleção apenas para usuários autenticados
CREATE POLICY "Permitir deleção de projetos para usuários autenticados" 
ON design_projects FOR DELETE 
USING (auth.role() = 'authenticated');

-- ====================================
-- 5. STORAGE POLICIES
-- ====================================
-- ATENÇÃO: Execute estas políticas DEPOIS de criar os buckets 'photography' e 'design'
-- na interface do Supabase Storage

-- Política de leitura pública para bucket 'photography'
CREATE POLICY "Permitir leitura pública de imagens de fotografia"
ON storage.objects FOR SELECT
USING (bucket_id = 'photography');

-- Política de upload para bucket 'photography' (apenas autenticados)
CREATE POLICY "Permitir upload de fotografia para usuários autenticados"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photography' AND auth.role() = 'authenticated');

-- Política de leitura pública para bucket 'design'
CREATE POLICY "Permitir leitura pública de imagens de design"
ON storage.objects FOR SELECT
USING (bucket_id = 'design');

-- Política de upload para bucket 'design' (apenas autenticados)
CREATE POLICY "Permitir upload de design para usuários autenticados"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'design' AND auth.role() = 'authenticated');

-- ====================================
-- 6. DADOS DE TESTE (OPCIONAL)
-- ====================================

-- Inserir fotografia de teste
INSERT INTO photography (title, category, url, description, year)
VALUES 
  ('Urban Sunset', 'urban', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963', 'Pôr do sol urbano', 2024),
  ('Portrait Study', 'portraits', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'Estudo de retrato', 2024),
  ('Nature Landscape', 'nature', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'Paisagem natural', 2024);

-- Inserir projeto de design de teste
INSERT INTO design_projects (title, category, description, images, client, year)
VALUES 
  ('Modern Logo', 'logos', 'Logo moderno e minimalista', ARRAY['https://images.unsplash.com/photo-1626785774573-4b799315345d'], 'Cliente ABC', 2024),
  ('Brand Identity', 'visual_identity', 'Identidade visual completa', ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5'], 'Empresa XYZ', 2024);

-- ====================================
-- FIM DO SETUP
-- ====================================

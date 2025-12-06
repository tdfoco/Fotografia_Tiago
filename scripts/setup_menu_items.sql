-- Script SQL para popular a tabela page_visibility
-- Execute este script diretamente no PocketBase Admin

-- Limpar dados existentes (opcional)
-- DELETE FROM page_visibility;

-- Inserir itens do menu
INSERT INTO page_visibility (page_key, page_name, page_path, is_active, "order", is_system) VALUES
('home', 'Home', '/', true, 1, true),
('photography', 'Fotografia', '/photography', true, 2, false),
('design', 'Design Gráfico', '/design', true, 3, false),
('about', 'Sobre', '/about', true, 4, false),
('services', 'Serviços', '/services', true, 5, false),
('behind_scenes', 'Bastidores', '/behind-the-scenes', true, 6, false),
('testimonials', 'Depoimentos', '/testimonials', true, 7, false),
('visual_search', 'Busca Visual', '/visual-search', true, 8, false),
('ranking', 'Ranking', '/ranking', true, 9, false),
('contact', 'Contato', '/contact', true, 10, false);

-- Verificar resultados
SELECT * FROM page_visibility ORDER BY "order";

#!/bin/bash
# Script para criar collections principais do PocketBase

echo "🔧 Criando collections principais no PocketBase..."

# Tentar autenticar e obter token
echo "Testando credenciais..."

# Credencial 1
TOKEN=$(curl -s -X POST http://127.0.0.1:8090/api/admins/auth-with-password \
  -H 'Content-Type: application/json' \
  -d '{"identity":"td.foco@gmail.com","password":"luaTD0101#"}' 2>/dev/null | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Tentando credencial alternativa..."
  TOKEN=$(curl -s -X POST http://127.0.0.1:8090/api/admins/auth-with-password \
    -H 'Content-Type: application/json' \
    -d '{"identity":"admin@tdfoco.cloud","password":"luaTD0101*"}' 2>/dev/null | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Erro na autenticação. Verifique as credenciais no Admin UI."
  exit 1
fi

echo "✅ Autenticado!"

# Criar collection: photography
echo "📸 Criando collection: photography..."
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "photography",
    "type": "base",
    "schema": [
      {"name": "title", "type": "text", "required": true},
      {"name": "image", "type": "file", "required": true, "options": {"maxSelect": 1, "maxSize": 52428800, "mimeTypes": ["image/*"]}},
      {"name": "category", "type": "select", "options": {"values": ["portraits", "urban", "nature", "art", "events"]}},
      {"name": "description", "type": "text"},
      {"name": "featured", "type": "bool"}
    ]
  }' && echo "✅ photography criada" || echo "ℹ️  photography já existe"

# Criar collection: graphic_design
echo "🎨 Criando collection: graphic_design..."
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "graphic_design",
    "type": "base",
    "schema": [
      {"name": "title", "type": "text", "required": true},
      {"name": "images", "type": "file", "required": true, "options": {"maxSelect": 10, "maxSize": 52428800, "mimeTypes": ["image/*"]}},
      {"name": "category", "type": "select", "options": {"values": ["logos", "visual_identity", "social_media", "posters", "special"]}},
      {"name": "description", "type": "text"},
      {"name": "client", "type": "text"},
      {"name": "featured", "type": "bool"}
    ]
  }' && echo "✅ graphic_design criada" || echo "ℹ️  graphic_design já existe"

# Criar collection: hero_images
echo "🖼️  Criando collection: hero_images..."
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "hero_images",
    "type": "base",
    "schema": [
      {"name": "page", "type": "select", "required": true, "options": {"values": ["home", "photography", "design", "about", "contact"]}},
      {"name": "image", "type": "file", "required": true, "options": {"maxSelect": 1, "maxSize": 52428800, "mimeTypes": ["image/*"]}},
      {"name": "active", "type": "bool"}
    ]
  }' && echo "✅ hero_images criada" || echo "ℹ️  hero_images já existe"

echo ""
echo "🎉 Collections principais criadas!"
echo ""
echo "⚠️  IMPORTANTE: As collections estão vazias!"
echo "Acesse https://db.tdfoco.cloud/_/ para adicionar fotos e projetos."

#!/bin/bash
# Script para criar collections no PocketBase via API REST

echo "🔧 Criando collections no PocketBase..."

# Autenticar e obter token
TOKEN=$(curl -s -X POST http://127.0.0.1:8090/api/admins/auth-with-password \
  -H 'Content-Type: application/json' \
  -d '{"identity":"td.foco@gmail.com","password":"luaTD0101#"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erro na autenticação"
  exit 1
fi

echo "✅ Autenticado com sucesso"

# Criar collection: categories
echo "📝 Criando collection: categories..."
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "categories",
    "type": "base",
    "schema": [
      {"name": "name", "type": "text", "required": true, "options": {"min": 1}},
      {"name": "slug", "type": "text", "required": true, "options": {"min": 1}}
    ],
    "indexes": ["CREATE UNIQUE INDEX idx_categories_name ON categories (name)", "CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)"]
  }' && echo "✅ categories criada" || echo "ℹ️  categories já existe"

# Criar collection: testimonials
echo "📝 Criando collection: testimonials..."
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "testimonials",
    "type": "base",
    "schema": [
      {"name": "name", "type": "text", "required": true},
      {"name": "role", "type": "text"},
      {"name": "content", "type": "text", "required": true},
      {"name": "rating", "type": "number", "options": {"min": 1, "max": 5}},
      {"name": "active", "type": "bool"},
      {"name": "featured", "type": "bool"}
    ]
  }' && echo "✅ testimonials criada" || echo "ℹ️  testimonials já existe"

# Criar collection: newsletter_subscribers
echo "📝 Criando collection: newsletter_subscribers..."
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "newsletter_subscribers",
    "type": "base",
    "schema": [
      {"name": "email", "type": "email", "required": true},
      {"name": "active", "type": "bool"}
    ],
    "indexes": ["CREATE UNIQUE INDEX idx_newsletter_email ON newsletter_subscribers (email)"]
  }' && echo "✅ newsletter_subscribers criada" || echo "ℹ️  newsletter_subscribers já existe"

echo ""
echo "🎉 Processo concluído!"

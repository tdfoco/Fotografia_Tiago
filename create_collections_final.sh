#!/bin/bash
# Criar collections com credenciais corretas

TOKEN=$(curl -s -X POST http://127.0.0.1:8090/api/admins/auth-with-password \
  -H 'Content-Type: application/json' \
  -d '{"identity":"td.foco@gmail.com","password":"luaTD0101*"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erro na autenticação"
  exit 1
fi

echo "✅ Autenticado!"

# Photography
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"photography","type":"base","schema":[{"name":"title","type":"text","required":true},{"name":"image","type":"file","required":true,"options":{"maxSelect":1,"maxSize":52428800,"mimeTypes":["image/*"]}},{"name":"category","type":"select","options":{"values":["portraits","urban","nature","art","events"]}},{"name":"description","type":"text"},{"name":"featured","type":"bool"}]}' && echo "✅ photography" || echo "ℹ️  photography existe"

# Graphic Design
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"graphic_design","type":"base","schema":[{"name":"title","type":"text","required":true},{"name":"images","type":"file","required":true,"options":{"maxSelect":10,"maxSize":52428800,"mimeTypes":["image/*"]}},{"name":"category","type":"select","options":{"values":["logos","visual_identity","social_media","posters","special"]}},{"name":"description","type":"text"},{"name":"client","type":"text"},{"name":"featured","type":"bool"}]}' && echo "✅ graphic_design" || echo "ℹ️  graphic_design existe"

# Hero Images
curl -s -X POST http://127.0.0.1:8090/api/collections \
  -H "Authorization: Admin $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"hero_images","type":"base","schema":[{"name":"page","type":"select","required":true,"options":{"values":["home","photography","design","about","contact"]}},{"name":"image","type":"file","required":true,"options":{"maxSelect":1,"maxSize":52428800,"mimeTypes":["image/*"]}},{"name":"active","type":"bool"}]}' && echo "✅ hero_images" || echo "ℹ️  hero_images existe"

echo "🎉 Collections criadas!"

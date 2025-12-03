#!/bin/bash
set -x # Mostrar comandos

echo "☢️ INICIANDO CORREÇÃO TOTAL DO SSL..."

# 1. Matar qualquer coisa na porta 80
echo "🔪 Matando processos na porta 80..."
fuser -k 80/tcp || true
systemctl stop nginx || true
pkill -f nginx || true

# 2. Limpar configs antigas do Nginx para evitar conflitos
echo "🧹 Limpando configurações antigas..."
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/pocketbase
rm -f /etc/nginx/sites-available/pocketbase

# 3. Gerar Certificado (Modo Standalone - Mais garantido)
echo "🔒 Gerando Certificado..."
certbot certonly --standalone \
  -d db.tdfoco.cloud \
  --non-interactive \
  --agree-tos \
  --email td.foco@gmail.com \
  --force-renewal

# 4. Criar Nova Configuração do Nginx
echo "📝 Criando nova configuração do Nginx..."
cat > /etc/nginx/sites-available/pocketbase <<'EOF'
server {
    listen 80;
    server_name db.tdfoco.cloud;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name db.tdfoco.cloud;

    ssl_certificate /etc/letsencrypt/live/db.tdfoco.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/db.tdfoco.cloud/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
EOF

# 5. Ativar e Iniciar
echo "🚀 Iniciando Nginx..."
ln -s /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
nginx -t
systemctl start nginx

echo "✅ PROCESSO FINALIZADO!"

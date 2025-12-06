#!/bin/bash
set -e

# Configurações
DOMAIN="n8n.tdfoco.cloud"
EMAIL="td.foco@gmail.com"

echo "🚀 Iniciando instalação do n8n em $DOMAIN..."

# 1. Instalar Docker se não existir
if ! command -v docker &> /dev/null; then
    echo "📦 Instalando Docker..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "✅ Docker instalado!"
else
    echo "✅ Docker já está instalado."
fi

# 2. Criar diretório e docker-compose para n8n
echo "📂 Configurando diretório do n8n..."
mkdir -p /opt/n8n
cd /opt/n8n

cat > docker-compose.yml <<EOF
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      - N8N_HOST=$DOMAIN
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://$DOMAIN/
      - GENERIC_TIMEZONE=America/Sao_Paulo
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
EOF

# 3. Iniciar n8n
echo "🔥 Iniciando container n8n..."
docker compose up -d

# 4. Configurar Nginx
echo "🌐 Configurando Nginx..."
cat > /etc/nginx/sites-available/n8n <<EOF
server {
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Increase timeouts for long running workflows
        proxy_read_timeout 300s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t
systemctl reload nginx

# 5. Configurar SSL com Certbot
echo "🔒 Configurando SSL..."
if command -v certbot &> /dev/null; then
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect
else
    echo "⚠️ Certbot não encontrado. Instalando..."
    apt-get install -y certbot python3-certbot-nginx
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect
fi

echo "✅ Instalação concluída!"
echo "🌍 Acesse: https://$DOMAIN"

#!/bin/bash

# Script para configurar Nginx como reverse proxy para PocketBase
# Execute este script no seu VPS como root

set -e

echo "=== Configurando Reverse Proxy para PocketBase ==="

# 1. Instalar Nginx e Certbot (se não estiverem instalados)
echo "Verificando instalação do Nginx e Certbot..."
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# 2. Criar configuração do Nginx para db.tdfoco.cloud
echo "Criando configuração do Nginx..."
cat > /etc/nginx/sites-available/pocketbase << 'EOF'
server {
    listen 80;
    server_name db.tdfoco.cloud;

    # Redirecionar HTTP para HTTPS (será configurado pelo certbot)
    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Aumentar timeouts para uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
        
        # Aumentar tamanho máximo de upload
        client_max_body_size 50M;
    }
}
EOF

# 3. Habilitar o site
echo "Habilitando configuração..."
ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/

# 4. Testar configuração do Nginx
echo "Testando configuração do Nginx..."
nginx -t

# 5. Recarregar Nginx
echo "Recarregando Nginx..."
systemctl reload nginx

# 6. Configurar SSL com Let's Encrypt
echo "Configurando SSL com Let's Encrypt..."
certbot --nginx -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --redirect

echo ""
echo "=== Configuração Concluída! ==="
echo "PocketBase agora está acessível em: https://db.tdfoco.cloud"
echo ""
echo "Próximos passos:"
echo "1. Atualize VITE_POCKETBASE_URL no .env local para: https://db.tdfoco.cloud"
echo "2. Atualize VITE_POCKETBASE_URL no Vercel para: https://db.tdfoco.cloud"
echo "3. Teste o acesso em: https://db.tdfoco.cloud/_/"

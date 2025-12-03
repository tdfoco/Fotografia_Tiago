#!/bin/bash
# Cole este script inteiro no seu terminal SSH e pressione Enter

echo "=== Instalando dependências ==="
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

echo "=== Criando configuração do Nginx ==="
cat > /etc/nginx/sites-available/pocketbase << 'EOFNGINX'
server {
    listen 80;
    server_name db.tdfoco.cloud;

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
        
        client_max_body_size 50M;
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
    }
}
EOFNGINX

echo "=== Habilitando configuração ==="
ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo "=== Configurando SSL ==="
certbot --nginx -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --redirect

echo ""
echo "✅ CONCLUÍDO!"
echo "PocketBase disponível em: https://db.tdfoco.cloud"
echo "Admin panel: https://db.tdfoco.cloud/_/"

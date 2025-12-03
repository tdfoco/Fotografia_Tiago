#!/bin/bash
# Script para corrigir certificado SSL
# Execute no VPS como root

echo "=== Parando Nginx ==="
systemctl stop nginx

echo "=== Renovando Certificado SSL (Forçado) ==="
certbot certonly --standalone -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --force-renewal

echo "=== Atualizando Configuração Nginx ==="
# Garantir que o caminho do certificado está correto
cat > /etc/nginx/sites-available/pocketbase << 'EOF'
server {
    listen 80;
    server_name db.tdfoco.cloud;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
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

echo "=== Reiniciando Nginx ==="
systemctl start nginx
systemctl status nginx

echo "=== Verificando Certificado ==="
certbot certificates

echo ""
echo "✅ Correção SSL Concluída!"

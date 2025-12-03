#!/bin/bash
set -e

echo "🔧 Iniciando Correção Robusta do SSL..."

# 1. Parar Nginx para liberar a porta 80
echo "🛑 Parando Nginx..."
systemctl stop nginx

# 2. Obter certificado no modo Standalone (sem depender do Nginx)
echo "🔒 Gerando certificado (Modo Standalone)..."
certbot certonly --standalone -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --force-renewal

# 3. Criar configuração do Nginx JÁ com SSL (para não depender do instalador)
echo "📝 Escrevendo configuração final do Nginx..."
cat > /etc/nginx/sites-available/pocketbase <<'EOF'
server {
    listen 80;
    server_name db.tdfoco.cloud;
    # Redirecionar tudo para HTTPS
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

# 4. Garantir links e permissões
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/

# 5. Iniciar Nginx
echo "🚀 Iniciando Nginx..."
systemctl start nginx

echo "---------------------------------------------------"
echo "✅ CORREÇÃO CONCLUÍDA!"
echo "Teste agora: https://db.tdfoco.cloud/_/"
echo "---------------------------------------------------"

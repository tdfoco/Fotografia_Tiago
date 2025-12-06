#!/bin/bash

# Script para corrigir configuração Nginx - Erro 404 nas rotas React

SERVER="root@148.230.76.195"
CONFIG_FILE="/etc/nginx/sites-available/tdfoco.cloud"

echo "========================================"
echo "  Corrigindo Nginx - Rotas React"
echo "========================================"
echo ""

ssh $SERVER << 'ENDSSH'
echo "🔍 Verificando configuração atual..."

CONFIG_FILE="/etc/nginx/sites-available/tdfoco.cloud"

# Backup
echo "📦 Criando backup..."
cp $CONFIG_FILE ${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)

# Verificar se try_files já existe
if grep -q "try_files.*index.html" $CONFIG_FILE; then
    echo "✅ try_files já está configurado corretamente"
else
    echo "⚠️  try_files não encontrado ou incorreto"
    echo "🔧 Atualizando configuração..."
    
    # Criar nova configuração
    cat > $CONFIG_FILE << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name tdfoco.cloud www.tdfoco.cloud;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tdfoco.cloud www.tdfoco.cloud;

    ssl_certificate /etc/letsencrypt/live/tdfoco.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tdfoco.cloud/privkey.pem;

    root /home/tdfoco/htdocs/tdfoco.cloud/dist;
    index index.html;

    # CORS headers para API
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS, PUT, DELETE';
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';

    # React Router - redirecionar todas rotas para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF
    
    echo "✅ Configuração atualizada"
fi

# Testar configuração
echo ""
echo "🔍 Testando configuração Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração válida!"
    echo ""
    echo "🔄 Recarregando Nginx..."
    systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx recarregado com sucesso!"
        echo ""
        echo "🎉 Correção aplicada!"
        echo ""
        echo "Teste agora:"
        echo "  https://tdfoco.cloud/admin/menu"
    else
        echo "❌ Erro ao recarregar Nginx"
        exit 1
    fi
else
    echo "❌ Erro na configuração Nginx!"
    echo "🔙 Restaurando backup..."
    
    # Restaurar último backup
    LATEST_BACKUP=$(ls -t ${CONFIG_FILE}.backup.* | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        cp $LATEST_BACKUP $CONFIG_FILE
        echo "✅ Backup restaurado"
    fi
    
    exit 1
fi
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✅ Correção Concluída!"
    echo "========================================"
    echo ""
    echo "Teste as rotas:"
    echo "  - https://tdfoco.cloud/admin/menu"
    echo "  - https://tdfoco.cloud/admin"
    echo "  - https://tdfoco.cloud/photography"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  ❌ Erro na Correção"
    echo "========================================"
    echo ""
    echo "Execute manualmente:"
    echo "  ssh root@148.230.76.195"
    echo "  nano /etc/nginx/sites-available/tdfoco.cloud"
    echo ""
fi

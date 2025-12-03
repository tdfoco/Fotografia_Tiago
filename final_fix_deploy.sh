#!/bin/bash
set -e

echo "🚀 INICIANDO CORREÇÃO FINAL E DEPLOY..."

# --- 1. CORREÇÃO DO NGINX ---
echo "🔧 Corrigindo Nginx..."

# Encontrar o arquivo de configuração principal (que não seja o nosso 'pocketbase')
MAIN_CONF=$(grep -l "server_name.*tdfoco.cloud" /etc/nginx/sites-enabled/* | grep -v "pocketbase" | head -n 1)

if [ -z "$MAIN_CONF" ]; then
    echo "⚠️ Configuração principal não encontrada. Mantendo configuração separada."
    # Se não achou, garante que o nosso está lá
    ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
else
    echo "found Main Config: $MAIN_CONF"
    
    # Verificar se já tem o bloco do db.tdfoco.cloud
    if grep -q "db.tdfoco.cloud" "$MAIN_CONF"; then
        echo "✅ Configuração já existe no arquivo principal."
    else
        echo "➕ Adicionando bloco PocketBase ao arquivo principal..."
        # Fazer backup antes
        cp "$MAIN_CONF" "$MAIN_CONF.bak"
        
        # Adicionar o bloco ao final
        cat >> "$MAIN_CONF" <<'EOF'

# --- POCKETBASE BLOCK ---
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
    fi
    
    # Remover o arquivo separado para evitar conflitos
    rm -f /etc/nginx/sites-enabled/pocketbase
fi

# Testar e Recarregar
nginx -t && systemctl reload nginx
echo "✅ Nginx Reconfigurado."

# --- 2. DEPLOY DA APLICAÇÃO ---
echo "📦 Atualizando Aplicação..."
cd /home/tdfoco/htdocs/tdfoco.cloud
git pull origin main
npm install
npm run build
pm2 restart portfolio

echo "---------------------------------------------------"
echo "✅ TUDO PRONTO!"
echo "👉 Admin: https://tdfoco.cloud/admin/dashboard"
echo "👉 Banco: https://db.tdfoco.cloud/_/"
echo "---------------------------------------------------"

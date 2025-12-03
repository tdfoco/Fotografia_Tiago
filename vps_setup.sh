#!/bin/bash
set -e

echo "🚀 Iniciando Deploy e Configuração Automática..."

# 1. Atualizar Código do Site
echo "📦 Atualizando código do site..."
cd /home/tdfoco/htdocs/tdfoco.cloud
git pull origin main
npm install
npm run build
pm2 restart portfolio

# 2. Configurar PocketBase (Nginx)
echo "🌐 Configurando Nginx para PocketBase..."
# Habilitar serviço se não estiver rodando
systemctl enable pocketbase || true
systemctl start pocketbase || true

# Criar config do Nginx
cat > /etc/nginx/sites-available/pocketbase <<'EOF'
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
        client_max_body_size 50M;
    }
}
EOF

# Link simbólico
ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/

# Testar e recarregar Nginx
nginx -t && systemctl reload nginx

# 3. Configurar SSL (Certbot)
echo "🔒 Verificando SSL..."
if ! [ -d "/etc/letsencrypt/live/db.tdfoco.cloud" ]; then
    echo "Gerando novo certificado SSL..."
    certbot --nginx -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --redirect
else
    echo "✅ Certificado SSL já existe."
fi

echo "---------------------------------------------------"
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo "---------------------------------------------------"
echo "👉 Admin do Site: https://tdfoco.cloud/admin/dashboard"
echo "👉 PocketBase:    https://db.tdfoco.cloud/_/"

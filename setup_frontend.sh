#!/bin/bash
set -e

echo "🌐 Configurando Nginx para Frontend (tdfoco.cloud)..."

# 1. Criar diretório se não existir
mkdir -p /home/tdfoco/htdocs/tdfoco.cloud/dist
chown -R root:root /home/tdfoco/htdocs/tdfoco.cloud

# 2. Criar configuração do Nginx
cat > /etc/nginx/sites-available/frontend << 'EOF'
server {
    listen 80;
    server_name tdfoco.cloud www.tdfoco.cloud;
    root /home/tdfoco/htdocs/tdfoco.cloud/dist;
    index index.html;

    # React Router (SPA) - Redirecionar tudo para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# 3. Ativar site
ln -sf /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 4. Testar e Recarregar
nginx -t
systemctl reload nginx

# 5. Configurar SSL
echo "🔒 Configurando SSL para Frontend..."
certbot --nginx -d tdfoco.cloud -d www.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --redirect

echo "✅ Frontend Configurado!"

#!/bin/bash
set -e

echo "🚀 INICIANDO CONFIGURAÇÃO MANUAL DA VPS..."

# 1. Atualizar Sistema e Instalar Dependências
echo "📦 Atualizando sistema e instalando dependências..."
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git unzip gnupg build-essential nginx certbot python3-certbot-nginx nodejs npm

# Instalar Node.js 20 se não existir
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Instalar PM2
npm install -g pm2

# 2. Instalar PocketBase
echo "🟢 Instalando PocketBase..."
mkdir -p /opt/pocketbase
cd /opt/pocketbase
# Baixar (versão hardcoded para garantir)
wget -q -O pb.zip https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip
unzip -o pb.zip
chmod +x pocketbase

# Criar Serviço PocketBase
cat > /etc/systemd/system/pocketbase.service <<EOF
[Unit]
Description=PocketBase
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/opt/pocketbase
ExecStart=/opt/pocketbase/pocketbase serve --http="0.0.0.0:8090"
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable pocketbase
systemctl restart pocketbase

# 3. Configurar Nginx
echo "🌐 Configurando Nginx..."
cat > /etc/nginx/sites-available/pocketbase << 'EOF'
server {
    listen 80;
    server_name db.tdfoco.cloud;
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 4. Configurar SSL
echo "🔒 Configurando SSL..."
certbot --nginx -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --redirect

# 5. Clonar Site (Se necessário)
echo "📂 Verificando código do site..."
mkdir -p /home/tdfoco/htdocs/tdfoco.cloud
cd /home/tdfoco/htdocs/tdfoco.cloud
if [ ! -d ".git" ]; then
    git clone https://github.com/tdfoco/Fotografia_Tiago.git .
    npm install
    npm run build
    pm2 start npm --name "portfolio" -- start
    pm2 save
fi

echo "---------------------------------------------------"
echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
echo "PocketBase: https://db.tdfoco.cloud/_/"
echo "Site: https://tdfoco.cloud"
echo "---------------------------------------------------"

#!/bin/bash

# Setup DEV environment on VPS - dev.tdfoco.cloud

VPS_IP="148.230.76.195"
VPS_USER="root"
DEV_DIR="/home/tdfoco/development"
PROD_DIR="/home/tdfoco/htdocs/tdfoco.cloud"

echo "🚀 Setting up dev.tdfoco.cloud environment..."

# 1. Create development directory
echo "📁 Creating development directory..."
ssh $VPS_USER@$VPS_IP "mkdir -p $DEV_DIR"

# 2. Configure Nginx for dev subdomain
echo "⚙️  Configuring Nginx for dev.tdfoco.cloud..."
ssh $VPS_USER@$VPS_IP "cat > /etc/nginx/sites-available/dev.tdfoco.cloud << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name dev.tdfoco.cloud;

    root $DEV_DIR/dist;
    index index.html;

    # Enable CORS for development
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;

    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # Proxy API requests to PocketBase
    location /api {
        proxy_pass https://db.tdfoco.cloud;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
    }
}
EOF"

# 3. Enable site
echo "✅ Enabling dev.tdfoco.cloud site..."
ssh $VPS_USER@$VPS_IP "ln -sf /etc/nginx/sites-available/dev.tdfoco.cloud /etc/nginx/sites-enabled/"

# 4. Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
ssh $VPS_USER@$VPS_IP "nginx -t"

# 5. Reload Nginx
echo "🔄 Reloading Nginx..."
ssh $VPS_USER@$VPS_IP "systemctl reload nginx"

# 6. Setup SSL (Let's Encrypt)
echo "🔒 Setting up SSL certificate..."
ssh $VPS_USER@$VPS_IP "certbot --nginx -d dev.tdfoco.cloud --non-interactive --agree-tos --email tdfoco@gmail.com"

echo "✅ dev.tdfoco.cloud setup complete!"
echo "🌍 Access: http://dev.tdfoco.cloud (will be https after SSL setup)"

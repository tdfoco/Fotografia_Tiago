@echo off
REM Setup DEV environment on VPS - dev.tdfoco.cloud (Windows version)

echo ========================================
echo   SETUP DEV.TDFOCO.CLOUD
echo ========================================

echo [1/6] Creating development directory...
ssh root@148.230.76.195 "mkdir -p /home/tdfoco/development"

echo [2/6] Configuring Nginx for dev.tdfoco.cloud...
ssh root@148.230.76.195 "cat > /etc/nginx/sites-available/dev.tdfoco.cloud << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name dev.tdfoco.cloud;

    root /home/tdfoco/development/dist;
    index index.html;

    # Enable CORS for development
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to PocketBase
    location /api {
        proxy_pass https://db.tdfoco.cloud;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF"

echo [3/6] Enabling dev.tdfoco.cloud site...
ssh root@148.230.76.195 "ln -sf /etc/nginx/sites-available/dev.tdfoco.cloud /etc/nginx/sites-enabled/"

echo [4/6] Testing Nginx configuration...
ssh root@148.230.76.195 "nginx -t"

echo [5/6] Reloading Nginx...
ssh root@148.230.76.195 "systemctl reload nginx"

echo [6/6] Setting up SSL certificate...
ssh root@148.230.76.195 "certbot --nginx -d dev.tdfoco.cloud --non-interactive --agree-tos --email tdfoco@gmail.com"

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo Access dev environment at: https://dev.tdfoco.cloud
pause

#!/bin/bash

# Configuration
VPS_IP="148.230.76.195"
VPS_USER="root"
REMOTE_DIR="/var/www/html"

echo "🚀 Starting deployment to tdfoco.cloud..."

# 1. Generate Sitemap
echo "🗺️  Generating sitemap..."
node scripts/generate-sitemap.js

# 2. Build Project
echo "🏗️  Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Aborting deployment."
    exit 1
fi

# 3. Upload to VPS
echo "📤 Uploading files to VPS..."
scp -r dist/* $VPS_USER@$VPS_IP:$REMOTE_DIR/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed! Check SSH connection."
    exit 1
fi

# 4. Restart Services
echo "🔄 Restarting services on VPS..."
ssh $VPS_USER@$VPS_IP "pm2 restart all && systemctl reload nginx"

echo "✅ Deployment completed successfully!"
echo "🌍 Visit https://tdfoco.cloud to see changes."

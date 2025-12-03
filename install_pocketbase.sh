#!/bin/bash
set -e

# Variables
PB_VERSION="0.22.21"
PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip"
INSTALL_DIR="/opt/pocketbase"
PASSWORD="luaTD202020#"

echo "Starting PocketBase Installation..."

# Helper for sudo
run_sudo() {
    echo "$PASSWORD" | sudo -S "$@"
}

# Install unzip if missing
if ! command -v unzip &> /dev/null; then
    echo "Installing unzip..."
    run_sudo apt-get update
    run_sudo apt-get install -y unzip wget
fi

# Create directory
echo "Creating directory..."
run_sudo mkdir -p $INSTALL_DIR
run_sudo chmod 755 $INSTALL_DIR

# Download
echo "Downloading PocketBase v$PB_VERSION..."
wget -q -O /tmp/pb.zip $PB_URL
run_sudo unzip -o /tmp/pb.zip -d $INSTALL_DIR
run_sudo chmod +x $INSTALL_DIR/pocketbase

# Create Service
echo "Creating Systemd Service..."
SERVICE_CONTENT="[Unit]
Description=PocketBase
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/pocketbase serve --http=\"0.0.0.0:8090\"
Restart=always

[Install]
WantedBy=multi-user.target"

echo "$SERVICE_CONTENT" | run_sudo tee /etc/systemd/system/pocketbase.service > /dev/null

# Reload and Start
echo "Starting Service..."
run_sudo systemctl daemon-reload
run_sudo systemctl enable pocketbase
run_sudo systemctl restart pocketbase

echo "SUCCESS: PocketBase is running at http://$(curl -s ifconfig.me):8090"

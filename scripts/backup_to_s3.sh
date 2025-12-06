#!/bin/bash

##############################################################################
# Backup Script for TDFoco Portfolio
# Creates backups of PocketBase data and uploads to cloud storage
# Supports local backup and optional S3/Backblaze upload
##############################################################################

# Configuration
BACKUP_DIR="/root/backups/tdfoco"
PROJECT_DIR="/home/tdfoco/htdocs/tdfoco.cloud"
POCKETBASE_DATA="${PROJECT_DIR}/pb_data"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="tdfoco_backup_${DATE}"
RETENTION_DAYS=30

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  TDFoco Portfolio Backup Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Navigate to backup directory
cd "${BACKUP_DIR}" || exit 1

echo -e "${YELLOW}📦 Creating backup: ${BACKUP_NAME}${NC}"

# Create temporary directory for this backup
mkdir -p "${BACKUP_NAME}"

# Backup PocketBase data
if [ -d "${POCKETBASE_DATA}" ]; then
    echo -e "${YELLOW}📸 Backing up PocketBase data...${NC}"
    cp -r "${POCKETBASE_DATA}" "${BACKUP_NAME}/pb_data"
    echo -e "${GREEN}✓ PocketBase data backed up${NC}"
else
    echo -e "${RED}✗ PocketBase data directory not found${NC}"
fi

# Backup uploads/public files (if any)
if [ -d "${PROJECT_DIR}/public/uploads" ]; then
    echo -e "${YELLOW}📸 Backing up uploads...${NC}"
    cp -r "${PROJECT_DIR}/public/uploads" "${BACKUP_NAME}/uploads"
    echo -e "${GREEN}✓ Uploads backed up${NC}"
fi

# Backup .env file (if exists)
if [ -f "${PROJECT_DIR}/.env" ]; then
    echo -e "${YELLOW}📸 Backing up .env file...${NC}"
    cp "${PROJECT_DIR}/.env" "${BACKUP_NAME}/.env"
    echo -e "${GREEN}✓ .env file backed up${NC}"
fi

# Create backup info file
cat > "${BACKUP_NAME}/backup_info.txt" << EOF
Backup Information
==================
Date: $(date)
Hostname: $(hostname)
Project Directory: ${PROJECT_DIR}
Backup Size: $(du -sh "${BACKUP_NAME}" | cut -f1)
Git Commit: $(cd "${PROJECT_DIR}" && git rev-parse HEAD 2>/dev/null || echo "N/A")
EOF

# Compress backup
echo -e "${YELLOW}🗜️  Compressing backup...${NC}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
BACKUP_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
echo -e "${GREEN}✓ Backup compressed: ${BACKUP_SIZE}${NC}"

# Remove uncompressed directory
rm -rf "${BACKUP_NAME}"

# Upload to S3/Backblaze (optional)
if [ ! -z "${S3_BUCKET}" ] && command -v aws &> /dev/null; then
    echo -e "${YELLOW}☁️  Uploading to S3...${NC}"
    aws s3 cp "${BACKUP_NAME}.tar.gz" "s3://${S3_BUCKET}/backups/${BACKUP_NAME}.tar.gz"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Uploaded to S3${NC}"
    else
        echo -e "${RED}✗ Failed to upload to S3${NC}"
    fi
fi

# Clean old backups (keep last N days)
echo -e "${YELLOW}🧹 Cleaning old backups (keeping ${RETENTION_DAYS} days)...${NC}"
find "${BACKUP_DIR}" -name "tdfoco_backup_*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete
REMAINING=$(find "${BACKUP_DIR}" -name "tdfoco_backup_*.tar.gz" -type f | wc -l)
echo -e "${GREEN}✓ Cleanup complete. ${REMAINING} backups remaining${NC}"

# Display summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Backup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Backup file: ${BACKUP_NAME}.tar.gz"
echo -e "Size: ${BACKUP_SIZE}"
echo -e "Location: ${BACKUP_DIR}"
echo ""

# Exit successfully
exit 0

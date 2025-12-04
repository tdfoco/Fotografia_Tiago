#!/bin/bash
set -e

echo "🚀 Iniciando Bootstrap do VPS..."

export DEBIAN_FRONTEND=noninteractive

# 1. Atualizar Sistema
echo "📦 Atualizando pacotes do sistema..."
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git unzip gnupg build-essential

# 2. Instalar Node.js 20
echo "🟢 Instalando Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js já instalado: $(node -v)"
fi

# 3. Instalar Nginx
echo "🌐 Instalando Nginx..."
apt-get install -y nginx

# 4. Instalar Certbot
echo "🔒 Instalando Certbot..."
apt-get install -y certbot python3-certbot-nginx

# 5. Instalar PM2 Globalmente
echo "⚙️ Instalando PM2..."
npm install -g pm2

# 6. Criar Diretório da Aplicação
echo "📂 Criando diretórios..."
mkdir -p /home/tdfoco/htdocs/tdfoco.cloud
cd /home/tdfoco/htdocs/tdfoco.cloud

if [ ! -d ".git" ]; then
    echo "📥 Clonando repositório..."
    git clone https://github.com/tdfoco/Fotografia_Tiago.git .
else
    echo "📦 Repositório já existe."
fi

# Garantir permissões (assumindo que vamos rodar como root por enquanto ou ajustar depois)
# Se o usuário tdfoco não existir, criar? O script de upload usa user tdfoco?
# O script deploy-to-vps.ps1 usa user 'root'. O upload-to-vps.ps1 usa 'tdfoco'.
# Vamos padronizar para root por enquanto para evitar problemas de permissão no restore,
# mas idealmente deveríamos usar um usuário não-root.
# Dado que é um restore rápido, vamos focar em fazer funcionar.

echo "---------------------------------------------------"
echo "✅ BOOTSTRAP CONCLUÍDO!"
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Nginx: $(nginx -v)"
echo "---------------------------------------------------"

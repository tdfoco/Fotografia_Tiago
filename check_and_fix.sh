#!/bin/bash
set -e

echo "🔧 Iniciando Diagnóstico e Correção do VPS..."

# 1. Verificar PocketBase
echo "---------------------------------------------------"
echo "🔍 Verificando PocketBase..."
if systemctl is-active --quiet pocketbase; then
    echo "✅ PocketBase está rodando."
else
    echo "⚠️ PocketBase NÃO está rodando. Tentando iniciar..."
    systemctl enable pocketbase
    systemctl start pocketbase
    
    if systemctl is-active --quiet pocketbase; then
        echo "✅ PocketBase iniciado com sucesso."
    else
        echo "❌ Falha ao iniciar PocketBase. Verifique os logs: journalctl -u pocketbase"
        # Tentar reinstalar se o binário não existir
        if [ ! -f "/opt/pocketbase/pocketbase" ]; then
            echo "⚠️ Binário não encontrado. Reinstalando..."
            ./install_pocketbase.sh
        fi
    fi
fi

# 2. Verificar Nginx para db.tdfoco.cloud
echo "---------------------------------------------------"
echo "🔍 Verificando Nginx (db.tdfoco.cloud)..."

if [ -f "/etc/nginx/sites-enabled/pocketbase" ]; then
    echo "✅ Configuração do Nginx encontrada."
else
    echo "⚠️ Configuração do Nginx AUSENTE. Criando..."
    ./setup_nginx_proxy.sh
fi

# 3. Verificar SSL
echo "---------------------------------------------------"
echo "🔍 Verificando SSL..."
if [ -d "/etc/letsencrypt/live/db.tdfoco.cloud" ]; then
    echo "✅ Certificado SSL encontrado."
else
    echo "⚠️ Certificado SSL AUSENTE. Tentando gerar..."
    certbot --nginx -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --redirect
fi

# 4. Verificar Status Final
echo "---------------------------------------------------"
echo "📊 Status Final:"
echo "Nginx: $(systemctl is-active nginx)"
echo "PocketBase: $(systemctl is-active pocketbase)"
echo "Porta 8090 (PB): $(lsof -i :8090 | grep LISTEN | wc -l)"
echo "---------------------------------------------------"

# Script PowerShell para corrigir Nginx - Erro 404 nas rotas React

$SERVER = "root@148.230.76.195"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Corrigindo Nginx - Rotas React" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 Conectando ao servidor..." -ForegroundColor Yellow

$sshCommand = @"
echo '🔍 Verificando configuração atual...'

CONFIG_FILE='/etc/nginx/sites-available/tdfoco.cloud'

echo '📦 Criando backup...'
cp `$CONFIG_FILE `${CONFIG_FILE}.backup.`$(date +%Y%m%d_%H%M%S)

echo '🔧 Atualizando configuração...'

cat > `$CONFIG_FILE << 'ENDCONFIG'
server {
    listen 80;
    listen [::]:80;
    server_name tdfoco.cloud www.tdfoco.cloud;
    
    return 301 https://`$server_name`$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tdfoco.cloud www.tdfoco.cloud;

    ssl_certificate /etc/letsencrypt/live/tdfoco.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tdfoco.cloud/privkey.pem;

    root /home/tdfoco/htdocs/tdfoco.cloud/dist;
    index index.html;

    # React Router - redirecionar todas rotas para index.html
    location / {
        try_files `$uri `$uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)`$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
ENDCONFIG

echo '✅ Configuração atualizada'
echo ''
echo '🔍 Testando configuração Nginx...'

nginx -t

if [ `$? -eq 0 ]; then
    echo '✅ Configuração válida!'
    echo ''
    echo '🔄 Recarregando Nginx...'
    systemctl reload nginx
    
    if [ `$? -eq 0 ]; then
        echo '✅ Nginx recarregado com sucesso!'
        echo ''
        echo '🎉 Correção aplicada!'
        exit 0
    else
        echo '❌ Erro ao recarregar Nginx'
        exit 1
    fi
else
    echo '❌ Erro na configuração Nginx!'
    exit 1
fi
"@

try {
    Write-Host "Executando comandos no servidor..." -ForegroundColor Yellow
    Write-Host ""
    
    $result = ssh $SERVER $sshCommand
    
    Write-Host $result
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ Correção Concluída!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Teste as rotas:" -ForegroundColor Cyan
        Write-Host "  - https://tdfoco.cloud/admin/menu" -ForegroundColor White
        Write-Host "  - https://tdfoco.cloud/admin" -ForegroundColor White
        Write-Host "  - https://tdfoco.cloud/photography" -ForegroundColor White
        Write-Host ""
    }
    else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ❌ Erro na Correção" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
    }
}
catch {
    Write-Host "❌ Erro ao executar SSH: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute manualmente:" -ForegroundColor Yellow
    Write-Host "  ssh root@148.230.76.195" -ForegroundColor White
    Write-Host "  nano /etc/nginx/sites-available/tdfoco.cloud" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

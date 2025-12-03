# Script de Deploy Automático para VPS
# Atualiza o código no servidor fazendo pull do GitHub

$VPS_IP = "148.230.76.195"
$VPS_USER = "root"
$APP_DIR = "/home/tdfoco/htdocs/tdfoco.cloud"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 DEPLOY PARA VPS - tdfoco.cloud" -ForegroundColor Green  
Write-Host "========================================`n" -ForegroundColor Cyan

# Comandos a executar no VPS
$commands = @(
    "cd $APP_DIR",
    "echo '📥 Fazendo pull do repositório...'",
    "git pull origin main",
    "echo '📦 Instalando dependências...'",
    "npm install",
    "echo '🔨 Fazendo build da aplicação...'",
    "npm run build",
    "echo '🔄 Reiniciando PM2...'",
    "pm2 restart portfolio || pm2 start npm --name portfolio -- start",
    "pm2 save",
    "echo '✅ Deploy concluído!'",
    "echo '🌐 Site: https://tdfoco.cloud'",
    "echo '📊 Status PM2:'",
    "pm2 status"
)

# Juntar comandos em uma string
$remoteCommand = $commands -join " && "

Write-Host "🔗 Conectando ao servidor $VPS_IP..." -ForegroundColor Yellow
Write-Host "📂 Diretório: $APP_DIR`n" -ForegroundColor White

# Executar via SSH
ssh ${VPS_USER}@${VPS_IP} $remoteCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "✅ DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "🌐 Acesse: https://tdfoco.cloud" -ForegroundColor White
    Write-Host "📊 PocketBase: https://db.tdfoco.cloud`n" -ForegroundColor White
}
else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "❌ ERRO NO DEPLOY" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
}

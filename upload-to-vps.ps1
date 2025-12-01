# Script de Upload para VPS
# Execute este script após configurar o VPS e CloudPanel

# ============================================
# INSTRUÇÕES DE USO
# ============================================

# 1. Substitua VARIÁVEIS abaixo com seus dados reais
# 2. Execute este script no PowerShell
# 3. Digite a senha quando solicitado

# ============================================
# VARIÁVEIS - CONFIGURE AQUI
# ============================================

$VPS_IP = "SEU_IP_DO_VPS_AQUI"          # Ex: "203.0.113.45"
$VPS_USER = "tdfoco"                     # Usuário criado no CloudPanel
$REMOTE_PATH = "/home/tdfoco/htdocs/tdfoco.cloud/"
$LOCAL_DIST = "C:\Users\Tiago\Documents\Portifolio\dist"

# ============================================
# SCRIPT DE UPLOAD
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 UPLOAD PARA VPS HOSTINGER" -ForegroundColor Green  
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar se pasta dist existe
if (-Not (Test-Path $LOCAL_DIST)) {
    Write-Host "❌ Erro: Pasta dist não encontrada!" -ForegroundColor Red
    Write-Host "Execute 'npm run build' primeiro.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "📂 Pasta local: $LOCAL_DIST" -ForegroundColor White
Write-Host "🌐 Servidor: $VPS_USER@$VPS_IP" -ForegroundColor White
Write-Host "📁 Destino: $REMOTE_PATH`n" -ForegroundColor White

# Confirmar upload
$confirm = Read-Host "Deseja continuar com o upload? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "`n❌ Upload cancelado pelo usuário.`n" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n📤 Iniciando upload..." -ForegroundColor Yellow

# Comando SCP para upload
$scpCommand = "scp -r `"$LOCAL_DIST\*`" ${VPS_USER}@${VPS_IP}:${REMOTE_PATH}"

Write-Host "`nExecutando:" -ForegroundColor Cyan
Write-Host $scpCommand -ForegroundColor Gray
Write-Host ""

# Executar upload
Invoke-Expression $scpCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "✅ UPLOAD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "🌐 Acesse: https://tdfoco.cloud`n" -ForegroundColor White
}
else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "❌ ERRO NO UPLOAD" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    Write-Host "Verifique:" -ForegroundColor Yellow
    Write-Host "  - IP do VPS está correto?" -ForegroundColor White
    Write-Host "  - Usuário existe no CloudPanel?" -ForegroundColor White
    Write-Host "  - Senha está correta?" -ForegroundColor White
    Write-Host "  - Servidor está acessível?`n" -ForegroundColor White
}

# ============================================
# PRÓXIMOS PASSOS
# ============================================

Write-Host "📋 Próximos Passos:" -ForegroundColor Cyan
Write-Host "  1. Acesse CloudPanel: https://${VPS_IP}:8443" -ForegroundColor White
Write-Host "  2. Verifique os arquivos em Sites" -ForegroundColor White
Write-Host "  3. Configure SSL (Let's Encrypt)" -ForegroundColor White
Write-Host "  4. Teste o site: https://tdfoco.cloud`n" -ForegroundColor White

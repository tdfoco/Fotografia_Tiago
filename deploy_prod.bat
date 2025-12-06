@echo off
echo ========================================
echo   DEPLOY TO PROD (tdfoco.cloud)
echo ========================================
echo ⚠️  ATENÇÃO: Você está fazendo deploy para PRODUÇÃO!
echo.
set /p confirm="Tem certeza? (S/N): "
if /i "%confirm%" NEQ "S" (
    echo Deploy cancelado.
    pause
    exit /b
)
call node scripts/deploy.mjs prod
pause

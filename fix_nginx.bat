@echo off
echo ========================================
echo   Corrigindo Nginx - Erro 404
echo ========================================
echo.

cd /d "%~dp0"

echo Este script vai corrigir a configuracao do Nginx
echo para permitir rotas do React Router funcionarem.
echo.
echo Sera necessario acesso SSH ao servidor.
echo.

set /p confirm="Continuar? (S/N): "
if /i not "%confirm%"=="S" (
    echo.
    echo Cancelado.
    pause
    exit /b 0
)

echo.
echo Executando correcao via SSH...
echo.

bash fix_nginx_404.sh

pause

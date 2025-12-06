@echo off
echo ========================================
echo   Configurar Itens do Menu
echo ========================================
echo.

cd /d "%~dp0.."

echo Executando script de configuracao...
node scripts/setup_menu_items.mjs

echo.
echo Pressione qualquer tecla para sair...
pause > nul

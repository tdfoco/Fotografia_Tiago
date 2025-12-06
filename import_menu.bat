@echo off
echo ========================================
echo   Importar Dados do Menu
echo ========================================
echo.

cd /d "%~dp0.."

echo Executando importacao via API...
node scripts/import_menu_data.mjs

echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Importacao concluida com sucesso!
) else (
    echo ❌ Erro na importacao
)

echo.
echo Pressione qualquer tecla para sair...
pause > nul

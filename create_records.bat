@echo off
echo ========================================
echo   Criar Registros do Menu via API
echo ========================================
echo.

cd /d "%~dp0"

echo Executando script...
echo.

node create_menu_records.mjs

echo.
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ Registros criados com sucesso!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   ❌ Erro ao criar registros
    echo ========================================
)

echo.
pause

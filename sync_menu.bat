@echo off
echo ========================================
echo   Sincronizar Menu - Update/Merge
echo ========================================
echo.

cd /d "%~dp0"

echo Executando sincronizacao...
echo.

node sync_menu.mjs

echo.
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ Sincronizacao concluida!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   ❌ Erro na sincronizacao
    echo ========================================
)

echo.
pause

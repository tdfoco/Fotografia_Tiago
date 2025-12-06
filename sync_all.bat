@echo off
echo ========================================
echo   Sincronizacao Completa de Dados
echo   Localhost -^> Producao
echo ========================================
echo.

cd /d "%~dp0"

echo ATENCAO: Este script sincronizara TODOS os dados
echo do PocketBase local para producao!
echo.
echo Coleções que serao sincronizadas:
echo   - page_visibility (menu)
echo   - photography (fotos)
echo   - design_projects (projetos)
echo   - testimonials (depoimentos)
echo   - blog_posts (blog)
echo   - hero_images (imagens hero)
echo   - clients (clientes)
echo.

set /p confirm="Deseja continuar? (S/N): "
if /i not "%confirm%"=="S" (
    echo.
    echo Cancelado pelo usuario.
    pause
    exit /b 0
)

echo.
echo Executando sincronizacao...
echo.

node sync_all_data.mjs

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

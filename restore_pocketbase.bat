@echo off
echo ===================================================
echo   RESTAURAR POCKETBASE PARA O VPS
echo ===================================================

if "%~1"=="" (
    echo ERRO: Especifique o diretorio de backup!
    echo Uso: restore_pocketbase.bat [diretorio_backup]
    echo Exemplo: restore_pocketbase.bat pb_backup_20251204_0136
    pause
    exit /b 1
)

set BACKUP_DIR=%~1

if not exist "%BACKUP_DIR%\pb_data" (
    echo ERRO: Diretorio %BACKUP_DIR%\pb_data nao encontrado!
    pause
    exit /b 1
)

echo Backup selecionado: %BACKUP_DIR%
echo.
echo ATENCAO: Isso vai SUBSTITUIR todos os dados atuais no VPS!
pause

echo [1/3] Parando PocketBase no VPS...
ssh tdfoco "sudo systemctl stop pocketbase"

echo [2/3] Enviando arquivos para o VPS...
scp -r %BACKUP_DIR%/pb_data/* tdfoco:/opt/pocketbase/pb_data/

echo [3/3] Reiniciando PocketBase no VPS...
ssh tdfoco "sudo systemctl start pocketbase"

echo.
echo ===================================================
echo   RESTAURACAO CONCLUIDA!
echo ===================================================
pause

@echo off
echo ===================================================
echo   BACKUP POCKETBASE DO VPS
echo ===================================================

set BACKUP_DIR=pb_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =0%

echo Criando diretorio de backup: %BACKUP_DIR%
mkdir %BACKUP_DIR%

echo [1/3] Parando PocketBase no VPS...
ssh tdfoco "sudo systemctl stop pocketbase"

echo [2/3] Baixando arquivos do PocketBase...
scp -r tdfoco:/opt/pocketbase/pb_data %BACKUP_DIR%/

echo [3/3] Reiniciando PocketBase no VPS...
ssh tdfoco "sudo systemctl start pocketbase"

echo.
echo ===================================================
echo   BACKUP CONCLUIDO!
echo ===================================================
echo Arquivos salvos em: %BACKUP_DIR%
pause

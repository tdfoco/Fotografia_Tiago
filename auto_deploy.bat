@echo off
echo ===================================================
echo   AUTO DEPLOY (TDFOCO.CLOUD)
echo ===================================================

echo [1/4] Construindo o site...
call npm install
call npm run build

if %errorlevel% neq 0 (
    echo ERRO NO BUILD.
    exit /b 1
)

echo [2/4] Enviando script de configuracao...
scp -o StrictHostKeyChecking=no setup_frontend.sh root@148.230.76.195:/root/setup_frontend.sh

echo [3/4] Configurando Nginx no VPS...
ssh -o StrictHostKeyChecking=no root@148.230.76.195 "chmod +x /root/setup_frontend.sh && bash /root/setup_frontend.sh"

echo [4/4] Enviando arquivos do site (dist)...
scp -o StrictHostKeyChecking=no -r dist/* root@148.230.76.195:/home/tdfoco/htdocs/tdfoco.cloud/dist/

echo ===================================================
echo   DEPLOY FINALIZADO!
echo ===================================================

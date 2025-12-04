@echo off
echo ===================================================
echo   DEPLOY COMPLETO DO SITE (TDFOCO.CLOUD)
echo ===================================================
echo.
echo ESTE SCRIPT IRA:
echo 1. Construir o site no seu computador (npm run build)
echo 2. Configurar o Nginx no VPS (setup_frontend.sh)
echo 3. Enviar todos os arquivos para o VPS
echo.
echo IMPORTANTE:
echo O dominio tdfoco.cloud deve apontar para 148.230.76.195
echo Se voce nao mudou o DNS ainda, o SSL pode falhar.
echo.
pause

echo.
echo [1/4] Construindo o site...
call npm install
call npm run build

if %errorlevel% neq 0 (
    echo ERRO NO BUILD. Corrija antes de continuar.
    pause
    exit /b
)

echo.
echo [2/4] Enviando script de configuracao...
scp -o StrictHostKeyChecking=no setup_frontend.sh root@148.230.76.195:/root/setup_frontend.sh

echo.
echo [3/4] Configurando Nginx no VPS...
echo (Digite a senha se pedir)
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "chmod +x /root/setup_frontend.sh && bash /root/setup_frontend.sh"

echo.
echo [4/4] Enviando arquivos do site (dist)...
echo Isso pode demorar um pouco...
scp -o StrictHostKeyChecking=no -r dist/* root@148.230.76.195:/home/tdfoco/htdocs/tdfoco.cloud/dist/

echo.
echo ===================================================
echo   DEPLOY FINALIZADO!
echo ===================================================
echo Acesse: https://tdfoco.cloud
echo.
pause

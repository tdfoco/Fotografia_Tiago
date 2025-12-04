@echo off
echo ===================================================
echo   DEPLOY DIRETO NA VPS (BUILD REMOTO)
echo ===================================================
echo.
echo ESTE SCRIPT IRA:
echo 1. Configurar o Nginx no VPS (se necessario)
echo 2. Baixar o codigo mais recente do GitHub no VPS
echo 3. Construir o site (npm run build) LÁ NO VPS
echo.
echo VANTAGEM: Nao precisa subir arquivos pesados.
echo REQUISITO: O DNS (tdfoco.cloud) ja deve apontar para o VPS.
echo.
pause

echo.
echo [1/3] Enviando script de configuracao...
scp -o StrictHostKeyChecking=no setup_frontend.sh root@148.230.76.195:/root/setup_frontend.sh

echo.
echo [2/3] Configurando Nginx...
echo (Digite a senha se pedir)
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "chmod +x /root/setup_frontend.sh && bash /root/setup_frontend.sh"

echo.
echo [3/3] Atualizando e Construindo o Site...
echo (Digite a senha novamente)
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "cd /home/tdfoco/htdocs/tdfoco.cloud && git pull origin main && npm install && npm run build && pm2 restart portfolio || pm2 start npm --name portfolio -- start"

echo.
echo ===================================================
echo   DEPLOY FINALIZADO!
echo ===================================================
echo Acesse: https://tdfoco.cloud
echo.
pause

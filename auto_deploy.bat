@echo off
echo ===================================================
echo   AUTO DEPLOY (TDFOCO.CLOUD)
echo ===================================================

echo [1/5] Construindo o site...
call npm install
call npm run build

if %errorlevel% neq 0 (
    echo ERRO NO BUILD.
    exit /b 1
)

echo [2/5] Enviando script de configuracao...
scp -o StrictHostKeyChecking=no setup_frontend.sh root@148.230.76.195:/root/setup_frontend.sh

echo [3/5] Configurando Nginx no VPS...
ssh -o StrictHostKeyChecking=no root@148.230.76.195 "chmod +x /root/setup_frontend.sh && bash /root/setup_frontend.sh"

echo [4/5] Atualizando Banco de Dados (Schemas)...
echo     - Enviando scripts...
scp -o StrictHostKeyChecking=no scripts/create_testimonials_schema.js root@148.230.76.195:/root/create_testimonials_schema.mjs
scp -o StrictHostKeyChecking=no scripts/create_newsletter_schema.js root@148.230.76.195:/root/create_newsletter_schema.mjs
scp -o StrictHostKeyChecking=no scripts/create_blog_schema.js root@148.230.76.195:/root/create_blog_schema.mjs
scp -o StrictHostKeyChecking=no scripts/create_client_schema.js root@148.230.76.195:/root/create_client_schema.mjs

echo     - Executando scripts no VPS...
ssh -o StrictHostKeyChecking=no root@148.230.76.195 "cd /root && npm install pocketbase && node create_testimonials_schema.mjs && node create_newsletter_schema.mjs && node create_blog_schema.mjs && node create_client_schema.mjs"

echo [5/5] Enviando arquivos do site (dist)...
scp -o StrictHostKeyChecking=no -r dist/* root@148.230.76.195:/home/tdfoco/htdocs/tdfoco.cloud/dist/

echo ===================================================
echo   DEPLOY FINALIZADO!
echo ===================================================

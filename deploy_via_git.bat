@echo off
echo ===================================================
echo   DEPLOY VIA GIT (TDFOCO.CLOUD)
echo ===================================================

echo [1/4] Conectando ao VPS e atualizando codigo...
ssh root@148.230.76.195 "cd /home/tdfoco/htdocs/tdfoco.cloud && git pull origin main"

echo [2/4] Instalando dependencias...
ssh root@148.230.76.195 "cd /home/tdfoco/htdocs/tdfoco.cloud && npm install"

echo [3/4] Construindo o site no VPS...
ssh root@148.230.76.195 "cd /home/tdfoco/htdocs/tdfoco.cloud && npm run build"

echo [4/4] Executando schemas do banco de dados...
ssh root@148.230.76.195 "cd /home/tdfoco/htdocs/tdfoco.cloud/scripts && node create_blog_schema.js && node create_client_schema.js && node create_testimonials_schema.js && node create_newsletter_schema.js"

echo ===================================================
echo   DEPLOY CONCLUIDO!
echo ===================================================
echo Site atualizado: https://tdfoco.cloud/
pause

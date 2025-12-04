@echo off
echo ===================================================
echo   RESTAURACAO DO AMBIENTE VPS - TDFOCO
echo ===================================================
echo.
echo Este script ira:
echo 1. Instalar dependencias (Node, Nginx, etc.)
echo 2. Instalar PocketBase
echo 3. Configurar Nginx e SSL
echo 4. Fazer o deploy da aplicacao
echo.
echo IP do VPS: 148.230.76.195
echo.
pause

echo [0/4] Limpando chaves SSH antigas...
ssh-keygen -R 148.230.76.195

echo.
echo [1/4] Executando Bootstrap (Instalacao de Dependencias)...
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "bash -s" < bootstrap_vps.sh

echo.
echo [2/4] Instalando PocketBase...
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "bash -s" < install_pocketbase.sh

echo.
echo [3/4] Configurando Nginx e SSL...
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "bash -s" < setup_nginx_proxy.sh

echo.
echo [4/4] Executando Deploy da Aplicacao...
powershell -ExecutionPolicy Bypass -File deploy-to-vps.ps1

echo.
echo ===================================================
echo   RESTAURACAO CONCLUIDA!
echo ===================================================
echo.
pause

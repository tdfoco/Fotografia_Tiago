@echo off
echo ===================================================
echo   CORRECAO FINAL E DEPLOY
echo ===================================================
echo.
echo Conectando a VPS...
echo Digite a senha quando solicitado.
echo.
ssh -t root@148.230.76.195 "bash -s" < final_fix_deploy.sh
echo.
echo ===================================================
echo   FIM
echo ===================================================
pause

@echo off
echo ===================================================
echo   DEPLOY AUTOMATICO TDFOCO
echo ===================================================
echo.
echo Conectando a VPS (148.230.76.195)...
echo Por favor, digite a senha da VPS quando solicitado.
echo.
ssh -t root@148.230.76.195 "bash -s" < vps_setup.sh
echo.
echo ===================================================
echo   FIM DO PROCESSO
echo ===================================================
pause

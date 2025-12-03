@echo off
echo ===================================================
echo   CORRECAO TOTAL SSL (NUCLEAR)
echo ===================================================
echo.
echo Conectando a VPS...
echo Digite a senha quando solicitado.
echo.
ssh -t root@148.230.76.195 "bash -s" < nuclear_fix_ssl.sh
echo.
echo ===================================================
echo   FIM
echo ===================================================
pause

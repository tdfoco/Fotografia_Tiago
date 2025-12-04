@echo off
echo ===================================================
echo   RODANDO DIAGNOSTICO NO VPS
echo ===================================================
echo.
echo Enviando script...
scp -o StrictHostKeyChecking=no diagnose.sh root@148.230.76.195:/root/diagnose.sh
echo.
echo Executando...
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "chmod +x /root/diagnose.sh && /root/diagnose.sh"
echo.
pause

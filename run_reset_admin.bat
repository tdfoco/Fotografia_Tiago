@echo off
echo ===================================================
echo   REDEFININDO SENHA DO ADMIN
echo ===================================================
echo.
echo Enviando script...
scp -o StrictHostKeyChecking=no reset_admin.sh root@148.230.76.195:/root/reset_admin.sh
echo.
echo Executando...
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "chmod +x /root/reset_admin.sh && /root/reset_admin.sh"
echo.
pause

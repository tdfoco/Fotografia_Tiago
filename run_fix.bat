@echo off
echo ===================================================
echo   DIAGNOSTICO E CORRECAO TDFOCO
echo ===================================================
echo.
echo Conectando ao VPS para verificar e corrigir problemas...
echo Digite a senha do VPS quando solicitado.
echo.

ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "bash -s" < check_and_fix.sh

echo.
echo ===================================================
echo   FIM DO DIAGNOSTICO
echo ===================================================

@echo off
echo ===================================================
echo   INSTALACAO DO SERVIDOR (TENTATIVA 2)
echo ===================================================
echo.
echo O diagnostico mostrou que o servidor esta VAZIO.
echo A instalacao anterior nao funcionou.
echo.
echo VAMOS TENTAR NOVAMENTE.
echo.
echo IMPORTANTE:
echo 1. Voce precisara digitar a senha DUAS VEZES.
echo 2. A instalacao pode demorar 5-10 minutos.
echo.
pause

echo.
echo [PASSO 1/2] Enviando arquivo de instalacao...
echo Digite a senha do VPS agora:
scp -o StrictHostKeyChecking=no vps_manual_restore.sh root@148.230.76.195:/root/setup.sh

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Nao foi possivel enviar o arquivo.
    echo Verifique a senha e tente novamente.
    pause
    exit /b
)

echo.
echo [PASSO 2/2] Rodando a instalacao...
echo Digite a senha do VPS novamente:
ssh -o StrictHostKeyChecking=no -t root@148.230.76.195 "chmod +x /root/setup.sh && bash /root/setup.sh"

echo.
echo ===================================================
echo   PROCESSO FINALIZADO
echo ===================================================
pause

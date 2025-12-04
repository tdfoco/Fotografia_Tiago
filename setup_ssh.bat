@echo off
echo ===================================================
echo   CONFIGURACAO SSH SEM SENHA
echo ===================================================
echo.
echo Este script vai configurar autenticacao SSH por chave.
echo Voce precisara digitar a senha do VPS APENAS UMA VEZ.
echo.
pause

echo.
echo [Passo 1/3] Verificando se a chave SSH ja existe...
if exist "%USERPROFILE%\.ssh\id_ed25519" (
    echo Chave SSH ja existe! Pulando geracao...
) else (
    echo Gerando chave SSH...
    ssh-keygen -t ed25519 -C "tiago@tdfoco.cloud" -f "%USERPROFILE%\.ssh\id_ed25519" -N ""
    echo Chave gerada com sucesso!
)

echo.
echo [Passo 2/3] Enviando chave para o VPS...
echo IMPORTANTE: Digite a senha do VPS quando solicitado: luaTD202020#
echo.
type "%USERPROFILE%\.ssh\id_ed25519.pub" | ssh root@148.230.76.195 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

echo.
echo [Passo 3/3] Ajustando permissoes no VPS...
ssh root@148.230.76.195 "chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"

echo.
echo ===================================================
echo   PRONTO! SSH SEM SENHA CONFIGURADO!
echo ===================================================
echo.
echo Testando conexao...
ssh root@148.230.76.195 "echo 'Conexao SSH funcionando sem senha!'"

echo.
echo Agora voce pode rodar auto_deploy.bat sem digitar senha!
echo.
pause

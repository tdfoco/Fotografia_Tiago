@echo off
echo ========================================
echo   DEPLOY TO DEV (dev.tdfoco.cloud)
echo ========================================
call node scripts/deploy.mjs dev
pause

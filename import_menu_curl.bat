@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

echo ========================================
echo   Importar Dados do Menu - PocketBase
echo ========================================
echo.

set "BASE_URL=https://db.tdfoco.cloud"
set "EMAIL=td.foco@gmail.com"
set "PASSWORD=luaTD0101*"

echo [1/3] Autenticando...
echo.

REM Autenticar e pegar token
curl -s -X POST "%BASE_URL%/api/collections/users/auth-with-password" ^
  -H "Content-Type: application/json" ^
  -d "{\"identity\":\"%EMAIL%\",\"password\":\"%PASSWORD%\"}" > auth_response.json

REM Extrair token (usando PowerShell inline)
for /f "delims=" %%i in ('powershell -Command "(Get-Content auth_response.json | ConvertFrom-Json).token"') do set TOKEN=%%i

if "%TOKEN%"=="" (
    echo [X] Falha na autenticacao
    del auth_response.json
    pause
    exit /b 1
)

echo [OK] Autenticado com sucesso!
echo.
echo [2/3] Criando registros...
echo.

REM Criar registros
set /a count=0

REM 1. Home
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"home\",\"page_name\":\"Home\",\"page_path\":\"/\",\"is_active\":true,\"order\":1,\"is_system\":true}" > nul && (echo [OK] 1. Home) || (echo [X] 1. Home)

REM 2. Fotografia
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"photography\",\"page_name\":\"Fotografia\",\"page_path\":\"/photography\",\"is_active\":true,\"order\":2,\"is_system\":false}" > nul && (echo [OK] 2. Fotografia) || (echo [X] 2. Fotografia)

REM 3. Design Gráfico
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"design\",\"page_name\":\"Design Grafico\",\"page_path\":\"/design\",\"is_active\":true,\"order\":3,\"is_system\":false}" > nul && (echo [OK] 3. Design Grafico) || (echo [X] 3. Design Grafico)

REM 4. Sobre
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"about\",\"page_name\":\"Sobre\",\"page_path\":\"/about\",\"is_active\":true,\"order\":4,\"is_system\":false}" > nul && (echo [OK] 4. Sobre) || (echo [X] 4. Sobre)

REM 5. Serviços
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"services\",\"page_name\":\"Servicos\",\"page_path\":\"/services\",\"is_active\":true,\"order\":5,\"is_system\":false}" > nul && (echo [OK] 5. Servicos) || (echo [X] 5. Servicos)

REM 6. Bastidores
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"behind_scenes\",\"page_name\":\"Bastidores\",\"page_path\":\"/behind-the-scenes\",\"is_active\":true,\"order\":6,\"is_system\":false}" > nul && (echo [OK] 6. Bastidores) || (echo [X] 6. Bastidores)

REM 7. Depoimentos
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"testimonials\",\"page_name\":\"Depoimentos\",\"page_path\":\"/testimonials\",\"is_active\":true,\"order\":7,\"is_system\":false}" > nul && (echo [OK] 7. Depoimentos) || (echo [X] 7. Depoimentos)

REM 8. Busca Visual
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"visual_search\",\"page_name\":\"Busca Visual\",\"page_path\":\"/visual-search\",\"is_active\":true,\"order\":8,\"is_system\":false}" > nul && (echo [OK] 8. Busca Visual) || (echo [X] 8. Busca Visual)

REM 9. Ranking
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"ranking\",\"page_name\":\"Ranking\",\"page_path\":\"/ranking\",\"is_active\":true,\"order\":9,\"is_system\":false}" > nul && (echo [OK] 9. Ranking) || (echo [X] 9. Ranking)

REM 10. Contato
curl -s -X POST "%BASE_URL%/api/collections/page_visibility/records" -H "Authorization: %TOKEN%" -H "Content-Type: application/json" -d "{\"page_key\":\"contact\",\"page_name\":\"Contato\",\"page_path\":\"/contact\",\"is_active\":true,\"order\":10,\"is_system\":false}" > nul && (echo [OK] 10. Contato) || (echo [X] 10. Contato)

echo.
echo [3/3] Verificando registros...
echo.

curl -s -X GET "%BASE_URL%/api/collections/page_visibility/records?sort=order" -H "Authorization: %TOKEN%" | powershell -Command "$json=$input|ConvertFrom-Json; Write-Host \"Total de registros: $($json.totalItems)\"; $json.items | ForEach-Object {$status=if($_.is_active){'ON'}else{'OFF'}; Write-Host \"  $($_.order). $($_.page_name) - $status\"}"

echo.
del auth_response.json
echo.
echo ========================================
echo   Importacao concluida!
echo ========================================
echo.
pause

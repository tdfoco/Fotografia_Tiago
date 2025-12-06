# Script PowerShell para importar dados do menu no PocketBase

$baseUrl = "https://db.tdfoco.cloud"
$email = "td.foco@gmail.com"
$password = "luaTD0101*"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Importar Dados do Menu - PocketBase" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Autenticar
Write-Host "🔐 Autenticando..." -ForegroundColor Yellow

$authBody = @{
    identity = $email
    password = $password
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod `
        -Uri "$baseUrl/api/collections/users/auth-with-password" `
        -Method Post `
        -Body $authBody `
        -ContentType "application/json"
    
    $token = $authResponse.token
    Write-Host "✅ Autenticado com sucesso!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Erro na autenticação: $_" -ForegroundColor Red
    exit 1
}

# Passo 2: Ler dados do JSON
Write-Host "📋 Carregando dados..." -ForegroundColor Yellow

$jsonPath = Join-Path $PSScriptRoot "scripts\page_visibility_data.json"
$menuItems = Get-Content $jsonPath | ConvertFrom-Json

Write-Host "   $($menuItems.Count) itens para importar" -ForegroundColor White
Write-Host ""

# Passo 3: Criar cada registro
Write-Host "📝 Criando registros..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($item in $menuItems) {
    try {
        $body = $item | ConvertTo-Json
        
        $response = Invoke-RestMethod `
            -Uri "$baseUrl/api/collections/page_visibility/records" `
            -Method Post `
            -Headers @{
                "Authorization" = $token
            } `
            -Body $body `
            -ContentType "application/json"
        
        Write-Host "✅ Criado: $($item.order). $($item.page_name) ($($item.page_path))" -ForegroundColor Green
        $successCount++
        
    } catch {
        Write-Host "❌ Erro ao criar $($item.page_name): $_" -ForegroundColor Red
        $errorCount++
    }
}

# Passo 4: Resumo
Write-Host ""
Write-Host "📊 Resumo da Importação:" -ForegroundColor Cyan
Write-Host "   ✅ Sucesso: $successCount" -ForegroundColor Green
Write-Host "   ❌ Erros: $errorCount" -ForegroundColor Red
Write-Host "   📦 Total: $($menuItems.Count)" -ForegroundColor White
Write-Host ""

if ($successCount -eq $menuItems.Count) {
    Write-Host "🎉 Todos os itens foram importados com sucesso!" -ForegroundColor Green
}

# Passo 5: Verificar registros
Write-Host "🔍 Verificando registros..." -ForegroundColor Yellow

try {
    $records = Invoke-RestMethod `
        -Uri "$baseUrl/api/collections/page_visibility/records?sort=order" `
        -Method Get `
        -Headers @{
            "Authorization" = $token
        }
    
    Write-Host ""
    Write-Host "📌 Total de registros na coleção: $($records.totalItems)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Registros criados:" -ForegroundColor White
    
    foreach ($record in $records.items) {
        $status = if ($record.is_active) { "✓ ON " } else { "✗ OFF" }
        $system = if ($record.is_system) { "⭐" } else { "  " }
        
        Write-Host "  $system $($record.order). $($record.page_name.PadRight(20)) $($record.page_path.PadRight(25)) $status"
    }
    
} catch {
    Write-Host "⚠️  Não foi possível verificar registros: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Script concluído!" -ForegroundColor Cyan
Write-Host ""

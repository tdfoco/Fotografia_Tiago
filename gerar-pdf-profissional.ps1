# Script para converter Markdown para PDF com layout profissional
# Usa a fonte Lato do Google e CSS customizado

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Gerador de PDF Profissional" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Caminhos dos arquivos
$markdownFile = "C:\Users\Tiago\Documents\Portifolio\DOCUMENTACAO_UNIFICADA.md"
$htmlTemplate = "C:\Users\Tiago\Documents\Portifolio\documentacao-template.html"
$outputHtml = "C:\Users\Tiago\Documents\Portifolio\DOCUMENTACAO_FINAL.html"
$outputPdf = "C:\Users\Tiago\Documents\Portifolio\DOCUMENTACAO_PORTFOLIO_PROFISSIONAL.pdf"

Write-Host "1. Lendo arquivo markdown..." -ForegroundColor Yellow
$markdownContent = Get-Content $markdownFile -Raw -Encoding UTF8

Write-Host "2. Convertendo Markdown para HTML..." -ForegroundColor Yellow

# Conversão simples de Markdown para HTML
$htmlContent = $markdownContent `
    -replace '### (.*)', '<h3>$1</h3>' `
    -replace '## (.*)', '<h2>$1</h2>' `
    -replace '^# (.*)', '<h1>$1</h1>' `
    -replace '```(\w+)?\r?\n(.*?)\r?\n```', '<pre><code>$2</code></pre>' `
    -replace '\*\*(.*?)\*\*', '<strong>$1</strong>' `
    -replace '\*(.*?)\*', '<em>$1</em>' `
    -replace '`([^`]+)`', '<code>$1</code>' `
    -replace '\[(.*?)\]\((.*?)\)', '<a href="$2">$1</a>' `
    -replace '^\- (.*)','<li>$1</li>' `
    -replace '^---+', '<hr>' `
    -replace '\n\n', '</p><p>'

# Envolver parágrafos
$htmlContent = "<p>" + $htmlContent + "</p>"
$htmlContent = $htmlContent -replace '<p><h', '<h' -replace '</h([1-6])></p>', '</h$1>'
$htmlContent = $htmlContent -replace '<p><pre>', '<pre>' -replace '</pre></p>', '</pre>'
$htmlContent = $htmlContent -replace '<p><hr></p>', '<hr>'
$htmlContent = $htmlContent -replace '<p></p>', ''

# Envolver <li> em <ul>
$htmlContent = $htmlContent -replace '(<li>.*?</li>)+', '<ul>$0</ul>'

Write-Host "3. Inserindo conteúdo no template HTML..." -ForegroundColor Yellow
$template = Get-Content $htmlTemplate -Raw -Encoding UTF8
$finalHtml = $template -replace '<!-- O conteúdo será inserido aqui -->\s*<div id="content">\s*<!-- Conteúdo markdown convertido virá aqui -->\s*</div>', 
    "<div id='content'>$htmlContent</div>"

# Salvar HTML final
$finalHtml | Out-File -FilePath $outputHtml -Encoding UTF8
Write-Host "   ✓ HTML salvo em: $outputHtml" -ForegroundColor Green

Write-Host "`n4. Gerando PDF com Chrome..." -ForegroundColor Yellow
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

if (Test-Path $chromePath) {
    & $chromePath --headless --disable-gpu  --print-to-pdf="$outputPdf" "file:///$($outputHtml -replace '\\','/')" 2>$null
    
    Start-Sleep -Seconds 2
    
    if (Test-Path $outputPdf) {
        $pdfSize = (Get-Item $outputPdf).Length / 1KB
        Write-Host "   ✓ PDF gerado com sucesso!" -ForegroundColor Green
        Write-Host "   📄 Tamanho: $([math]::Round($pdfSize, 2)) KB" -ForegroundColor Green
        Write-Host "`n========================================" -ForegroundColor Cyan
        Write-Host "PDF PROFISSIONAL CRIADO!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Localização: $outputPdf`n" -ForegroundColor White
        
        # Abrir o PDF automaticamente
        Write-Host "Abrindo PDF..." -ForegroundColor Yellow
        Start-Process $outputPdf
    } else {
        Write-Host "   ✗ Erro ao gerar PDF" -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ Chrome não encontrado em: $chromePath" -ForegroundColor Red
    Write-Host "   Use o arquivo HTML: $outputHtml" -ForegroundColor Yellow
}

Write-Host "`nArquivos gerados:" -ForegroundColor Cyan
Write-Host "  - HTML: $outputHtml" -ForegroundColor White
Write-Host "  - PDF:  $outputPdf" -ForegroundColor White

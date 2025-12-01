// Gerador de PDF Profissional
const fs = require('fs');
const path = require('path');

console.log('\n==== Gerador de PDF Profissional ====\n');

// Ler markdown
const markdownPath = path.join(__dirname, 'DOCUMENTACAO_UNIFICADA.md');
const markdown = fs.readFileSync(markdownPath, 'utf8');

console.log('✓ Markdown carregado');

// Conversão simples de markdown para HTML
let html = markdown
    // Headers
    .replace(/####\s+(.+)/g, '<h4>$1</h4>')
    .replace(/###\s+(.+)/g, '<h3>$1</h3>')
    .replace(/##\s+(.+)/g, '<h2>$1</h2>')
    .replace(/^#\s+(.+)/gm, '<h1>$1</h1>')
    // Formatação
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Listas
    .replace(/^\-\s+(.+)/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)/gm, '<li>$1</li>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]+?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Parágrafos
    .replace(/\n\n/g, '</p><p>');

// Envolver em parágrafos
html = '<p>' + html + '</p>';

// Limpar tags mal formadas
html = html
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><pre>/g, '<pre>')
    .replace(/<\/pre><\/p>/g, '</pre>')
    .replace(/<p><\/?ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>')
    .replace(/<p><\/p>/g, '')
    .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

console.log('✓ HTML convertido');

// Ler template
const templatePath = path.join(__dirname, 'DOCUMENTACAO_PROFISSIONAL.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Inserir conteúdo
const content = `
<div class="page">
    <div class="page-header">
        <span>Portfolio de Fotografia - Documentação Técnica</span>
        <span>Tiago Damasceno</span>
    </div>
    
    <div style="padding-top: 20mm;">
        ${html}
    </div>
    
    <div class="page-footer">
        <span class="footer-left">Portfolio - Tiago Damasceno</span>
        <span class="footer-center">tdfoco.cloud</span>
        <span class="footer-right page-number"></span>
    </div>
</div>
`;

const finalHtml = template.replace(
    '<div id="main-content">',
    '<div id="main-content">' + content
);

// Salvar HTML final
const outputHtmlPath = path.join(__dirname, 'DOCUMENTACAO_FINAL_COMPLETA.html');
fs.writeFileSync(outputHtmlPath, finalHtml, 'utf8');

console.log('✓ HTML final salvo em:', outputHtmlPath);
console.log('\n✅ Pronto! Agora execute o Chrome para gerar o PDF.\n');

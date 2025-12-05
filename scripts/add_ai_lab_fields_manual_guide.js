/**
 * Script para guiar adição manual de campos no PocketBase
 * 
 * Como a autenticação API falhou, siga estas instruções manuais:
 */

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║  CAMPOS NECESSÁRIOS PARA IA LAB - INSTALAÇÃO MANUAL         ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('❌ Não foi possível autenticar via API');
console.log('✓ Solução: Adicionar campos manualmente\n');

console.log('📋 PASSO A PASSO:\n');

console.log('1. Acesse: https://db.tdfoco.cloud/_/\n');

console.log('2. Faça login com as credenciais de admin\n');

console.log('3. No menu lateral, clique em "Collections"\n');

console.log('4. Selecione a collection "photography"\n');

console.log('5. Adicione estes 5 campos (clique "+ New field" para cada um):\n');

const fieldsToAdd = [
    {
        nome: 'featured',
        tipo: 'Bool',
        obrigatorio: 'NÃO',
        observacoes: 'Marca foto como destaque'
    },
    {
        nome: 'priority',
        tipo: 'Number',
        obrigatorio: 'NÃO',
        observacoes: 'Min: 0, Max: 10 - Prioridade de exibição'
    },
    {
        nome: 'use_as_banner',
        tipo: 'Bool',
        obrigatorio: 'NÃO',
        observacoes: 'Indica uso como banner'
    },
    {
        nome: 'promoted',
        tipo: 'Bool',
        obrigatorio: 'NÃO',
        observacoes: 'Marca para promoção'
    },
    {
        nome: 'recommended',
        tipo: 'Bool',
        obrigatorio: 'NÃO',
        observacoes: 'Adiciona a recomendações'
    }
];

fieldsToAdd.forEach((field, index) => {
    console.log(`   Campo ${index + 1}:`);
    console.log(`   📌 Nome: ${field.nome}`);
    console.log(`   📊 Tipo: ${field.tipo}`);
    console.log(`   ⚙️  Obrigatório: ${field.obrigatorio}`);
    console.log(`   💡 ${field.observacoes}`);
    console.log('');
});

console.log('6. Clique em "Save" para salvar as alterações\n');

console.log('✅ APÓS ADICIONAR OS CAMPOS:\n');
console.log('   → Volte para https://tdfoco.cloud/admin/ai-lab');
console.log('   → Teste os botões "Aplicar" nas sugestões');
console.log('   → Eles devem funcionar corretamente agora!\n');

console.log('═══════════════════════════════════════════════════════════════\n');

// Campos em formato JSON para referência
console.log('📄 REFERÊNCIA JSON (para desenvolvedores):\n');
console.log(JSON.stringify(fieldsToAdd.map(f => ({
    name: f.nome,
    type: f.tipo.toLowerCase(),
    required: false,
    ...(f.nome === 'priority' ? { options: { min: 0, max: 10 } } : {})
})), null, 2));
console.log('\n');

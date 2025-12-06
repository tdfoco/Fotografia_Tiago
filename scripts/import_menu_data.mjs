/**
 * Script para importar dados do menu via API do PocketBase
 */

import PocketBase from 'pocketbase';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pb = new PocketBase('https://db.tdfoco.cloud');

// Credenciais
const email = 'td.foco@gmail.com';
const password = 'luaTD0101*';

async function importMenuData() {
    try {
        console.log('📡 Conectando ao PocketBase...');
        console.log('🔐 Autenticando...');

        // Autenticar como usuário
        await pb.collection('users').authWithPassword(email, password);
        console.log('✅ Autenticado com sucesso!\n');

        // Ler arquivo JSON
        const dataPath = join(__dirname, 'page_visibility_data.json');
        const menuItems = JSON.parse(readFileSync(dataPath, 'utf-8'));

        console.log(`📋 ${menuItems.length} itens para importar\n`);

        // Criar cada registro
        let successCount = 0;
        let errorCount = 0;

        for (const item of menuItems) {
            try {
                const record = await pb.collection('page_visibility').create(item);
                console.log(`✅ Criado: ${item.order}. ${item.page_name} (${item.page_path})`);
                successCount++;
            } catch (error) {
                console.error(`❌ Erro ao criar ${item.page_name}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n📊 Resumo da Importação:');
        console.log(`   ✅ Sucesso: ${successCount}`);
        console.log(`   ❌ Erros: ${errorCount}`);
        console.log(`   📦 Total: ${menuItems.length}`);

        if (successCount === menuItems.length) {
            console.log('\n🎉 Todos os itens foram importados com sucesso!');
        }

        // Verificar registros criados
        console.log('\n🔍 Verificando registros...');
        const records = await pb.collection('page_visibility').getFullList({
            sort: 'order',
        });

        console.log(`\n📌 Total de registros na coleção: ${records.length}`);
        console.log('\nRegistros criados:');
        records.forEach(record => {
            const status = record.is_active ? '✓ ON ' : '✗ OFF';
            const system = record.is_system ? '⭐' : '  ';
            console.log(`  ${system} ${record.order}. ${record.page_name.padEnd(20)} ${record.page_path.padEnd(25)} ${status}`);
        });

    } catch (error) {
        console.error('\n💥 Erro:', error);

        if (error.status === 400) {
            console.log('\n💡 Dica: Verifique se:');
            console.log('   - A coleção "page_visibility" existe');
            console.log('   - Os campos estão configurados corretamente');
            console.log('   - Não há registros duplicados');
        } else if (error.status === 403) {
            console.log('\n💡 Dica: Problema de autenticação');
            console.log('   - Verifique as credenciais');
            console.log('   - Confirme permissões da coleção');
        }

        throw error;
    }
}

// Executar
importMenuData()
    .then(() => {
        console.log('\n✨ Script concluído com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Falha ao executar script');
        process.exit(1);
    });

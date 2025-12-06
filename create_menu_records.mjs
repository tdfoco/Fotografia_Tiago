/**
 * Script para criar registros no PocketBase via API
 * Uso: node create_menu_records.mjs
 * Requer: Node.js 18+ (fetch nativo)
 */

import fs from 'fs';

const BASE_URL = 'https://db.tdfoco.cloud';
const EMAIL = 'td.foco@gmail.com';  // Credencial correta confirmada
const PASSWORD = 'luaTD0101*';      // Senha correta confirmada

// Ler dados do JSON
const menuItems = JSON.parse(fs.readFileSync('./pocketbase_import_complete.json', 'utf-8'));

async function createRecords() {
    console.log('========================================');
    console.log('  Criar Registros via API - PocketBase');
    console.log('========================================\n');

    try {
        // 1. Autenticar como ADMIN
        console.log('🔐 Autenticando como admin...');
        const authResponse = await fetch(`${BASE_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identity: EMAIL,
                password: PASSWORD
            })
        });

        if (!authResponse.ok) {
            const error = await authResponse.text();
            throw new Error(`Falha na autenticação: ${error}`);
        }

        const authData = await authResponse.json();
        const token = authData.token;
        console.log('✅ Autenticado com sucesso!\n');

        // 2. Criar cada registro
        console.log('📝 Criando registros...\n');
        let successCount = 0;
        let errorCount = 0;

        for (const item of menuItems) {
            try {
                const response = await fetch(`${BASE_URL}/api/collections/page_visibility/records`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(item)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erro desconhecido');
                }

                const created = await response.json();
                console.log(`✅ ${item.order}. ${item.page_name.padEnd(20)} (${item.page_path})`);
                successCount++;

            } catch (error) {
                console.log(`❌ ${item.order}. ${item.page_name.padEnd(20)} - ${error.message}`);
                errorCount++;
            }
        }

        // 3. Resumo
        console.log('\n========================================');
        console.log('📊 Resumo da Importação:');
        console.log(`   ✅ Sucesso: ${successCount}`);
        console.log(`   ❌ Erros: ${errorCount}`);
        console.log(`   📦 Total: ${menuItems.length}`);
        console.log('========================================\n');

        if (successCount === menuItems.length) {
            console.log('🎉 Todos os registros foram criados com sucesso!\n');
        } else if (successCount > 0) {
            console.log('⚠️  Alguns registros foram criados, mas houve erros.\n');
        } else {
            console.log('❌ Nenhum registro foi criado.\n');
        }

        // 4. Verificar registros criados
        console.log('🔍 Verificando registros no PocketBase...');
        const listResponse = await fetch(`${BASE_URL}/api/collections/page_visibility/records?sort=order`, {
            headers: { 'Authorization': token }
        });

        if (listResponse.ok) {
            const data = await listResponse.json();
            console.log(`\n📌 Total de registros na coleção: ${data.totalItems}\n`);

            if (data.totalItems > 0) {
                console.log('Registros criados:');
                data.items.forEach(record => {
                    const status = record.is_active ? '✓ ON ' : '✗ OFF';
                    const system = record.is_system ? '⭐' : '  ';
                    console.log(`  ${system} ${record.order}. ${record.page_name.padEnd(20)} ${record.page_path.padEnd(25)} ${status}`);
                });
            }
        }

        console.log('\n✨ Script concluído!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n💥 Erro:', error.message);
        console.error('\nDetalhes:', error);
        process.exit(1);
    }
}

// Executar
createRecords();

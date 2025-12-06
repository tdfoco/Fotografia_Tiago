/**
 * Script para atualizar ou mesclar registros de menu no PocketBase
 * - Verifica registros existentes
 * - Atualiza se existir (por page_key)
 * - Cria se não existir
 */

import fs from 'fs';

const BASE_URL = 'https://db.tdfoco.cloud';
const EMAIL = 'td.foco@gmail.com';
const PASSWORD = 'luaTD0101*';

const menuItems = JSON.parse(fs.readFileSync('./pocketbase_import_complete.json', 'utf-8'));

async function syncMenuRecords() {
    console.log('========================================');
    console.log('  Sincronizar Menu - Update ou Merge');
    console.log('========================================\n');

    try {
        // 1. Autenticar
        console.log('🔐 Autenticando como admin...');
        const authResponse = await fetch(`${BASE_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: EMAIL, password: PASSWORD })
        });

        if (!authResponse.ok) throw new Error('Falha na autenticação');

        const { token } = await authResponse.json();
        console.log('✅ Autenticado!\n');

        // 2. Buscar registros existentes
        console.log('📋 Buscando registros existentes...');
        const listResponse = await fetch(`${BASE_URL}/api/collections/page_visibility/records?perPage=100`, {
            headers: { 'Authorization': token }
        });

        const existingData = await listResponse.json();
        const existingRecords = new Map();

        existingData.items.forEach(record => {
            existingRecords.set(record.page_key, record);
        });

        console.log(`   Encontrados: ${existingRecords.size} registros\n`);

        // 3. Processar cada item
        console.log('🔄 Processando itens...\n');

        let created = 0;
        let updated = 0;
        let skipped = 0;
        let errors = 0;

        for (const item of menuItems) {
            const existing = existingRecords.get(item.page_key);

            try {
                if (existing) {
                    // Verificar se precisa atualizar
                    const needsUpdate =
                        existing.page_name !== item.page_name ||
                        existing.page_path !== item.page_path ||
                        existing.is_active !== item.is_active ||
                        existing.order !== item.order ||
                        existing.is_system !== item.is_system;

                    if (needsUpdate) {
                        // Atualizar registro existente
                        const updateResponse = await fetch(
                            `${BASE_URL}/api/collections/page_visibility/records/${existing.id}`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': token
                                },
                                body: JSON.stringify(item)
                            }
                        );

                        if (updateResponse.ok) {
                            console.log(`🔄 ATUALIZADO: ${item.order}. ${item.page_name}`);
                            updated++;
                        } else {
                            throw new Error('Falha ao atualizar');
                        }
                    } else {
                        console.log(`⏭️  IGUAL:      ${item.order}. ${item.page_name}`);
                        skipped++;
                    }
                } else {
                    // Criar novo registro
                    const createResponse = await fetch(
                        `${BASE_URL}/api/collections/page_visibility/records`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            },
                            body: JSON.stringify(item)
                        }
                    );

                    if (createResponse.ok) {
                        console.log(`✨ CRIADO:     ${item.order}. ${item.page_name}`);
                        created++;
                    } else {
                        throw new Error('Falha ao criar');
                    }
                }
            } catch (error) {
                console.log(`❌ ERRO:       ${item.order}. ${item.page_name} - ${error.message}`);
                errors++;
            }
        }

        // 4. Resumo
        console.log('\n========================================');
        console.log('📊 Resumo da Sincronização:');
        console.log(`   ✨ Criados:     ${created}`);
        console.log(`   🔄 Atualizados: ${updated}`);
        console.log(`   ⏭️  Inalterados: ${skipped}`);
        console.log(`   ❌ Erros:       ${errors}`);
        console.log(`   📦 Total:       ${menuItems.length}`);
        console.log('========================================\n');

        // 5. Verificar estado final
        console.log('🔍 Estado final do banco...');
        const finalResponse = await fetch(
            `${BASE_URL}/api/collections/page_visibility/records?sort=order`,
            { headers: { 'Authorization': token } }
        );

        const finalData = await finalResponse.json();
        console.log(`\n📌 Total de registros: ${finalData.totalItems}\n`);

        console.log('Registros atuais:');
        finalData.items.forEach(record => {
            const status = record.is_active ? '🟢 ON ' : '🔴 OFF';
            const system = record.is_system ? '⭐' : '  ';
            console.log(`  ${system} ${record.order}. ${record.page_name.padEnd(20)} ${status}`);
        });

        console.log('\n✨ Sincronização concluída!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n💥 Erro:', error.message);
        process.exit(1);
    }
}

syncMenuRecords();

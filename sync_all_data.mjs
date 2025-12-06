/**
 * Script completo para sincronizar TODOS os dados
 * De: PocketBase Local (localhost:8090)
 * Para: PocketBase Produção (db.tdfoco.cloud)
 */

import fs from 'fs';

const LOCAL_URL = 'http://localhost:8090';
const PROD_URL = 'https://db.tdfoco.cloud';
const ADMIN_EMAIL = 'td.foco@gmail.com';
const ADMIN_PASSWORD = 'luaTD0101*';

// Coleções para sincronizar
const COLLECTIONS_TO_SYNC = [
    'page_visibility',
    'photography',
    'design_projects',
    'testimonials',
    'blog_posts',
    'hero_images',
    'clients'
];

async function authenticateAdmin(baseUrl) {
    const response = await fetch(`${baseUrl}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        })
    });

    if (!response.ok) {
        throw new Error(`Auth failed on ${baseUrl}: ${await response.text()}`);
    }

    const data = await response.json();
    return data.token;
}

async function getCollectionRecords(baseUrl, token, collection) {
    try {
        const response = await fetch(
            `${baseUrl}/api/collections/${collection}/records?perPage=500`,
            { headers: { 'Authorization': token } }
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`   ⚠️  Coleção '${collection}' não existe`);
                return [];
            }
            throw new Error(`Failed to fetch ${collection}`);
        }

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.log(`   ❌ Erro ao buscar '${collection}': ${error.message}`);
        return [];
    }
}

async function syncCollection(localToken, prodToken, collection) {
    console.log(`\n📦 Sincronizando: ${collection}`);
    console.log('─'.repeat(50));

    try {
        // Buscar registros locais
        const localRecords = await getCollectionRecords(LOCAL_URL, localToken, collection);
        console.log(`   📍 Local: ${localRecords.length} registros`);

        if (localRecords.length === 0) {
            console.log(`   ⏭️  Pulando (sem dados locais)`);
            return { collection, local: 0, created: 0, updated: 0, skipped: 0, errors: 0 };
        }

        // Buscar registros de produção
        const prodRecords = await getCollectionRecords(PROD_URL, prodToken, collection);
        console.log(`   🌐 Produção: ${prodRecords.length} registros`);

        // Criar mapa de registros existentes em produção
        const prodMap = new Map();
        prodRecords.forEach(record => {
            // Usar page_key como identificador único, se existir
            const key = record.page_key || record.slug || record.email || record.id;
            prodMap.set(key, record);
        });

        let created = 0;
        let updated = 0;
        let skipped = 0;
        let errors = 0;

        // Processar cada registro local
        for (const localRecord of localRecords) {
            try {
                // Remover campos de sistema
                const { id, created: _, updated: __, collectionId, collectionName, ...data } = localRecord;

                const key = localRecord.page_key || localRecord.slug || localRecord.email || localRecord.id;
                const existingRecord = prodMap.get(key);

                if (existingRecord) {
                    // Verificar se precisa atualizar
                    const dataStr = JSON.stringify(data);
                    const existingDataStr = JSON.stringify({
                        ...existingRecord,
                        id: undefined,
                        created: undefined,
                        updated: undefined,
                        collectionId: undefined,
                        collectionName: undefined
                    });

                    if (dataStr === existingDataStr) {
                        skipped++;
                        continue;
                    }

                    // Atualizar
                    const response = await fetch(
                        `${PROD_URL}/api/collections/${collection}/records/${existingRecord.id}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': prodToken
                            },
                            body: JSON.stringify(data)
                        }
                    );

                    if (response.ok) {
                        updated++;
                    } else {
                        errors++;
                        console.log(`   ❌ Erro ao atualizar: ${key}`);
                    }
                } else {
                    // Criar novo
                    const response = await fetch(
                        `${PROD_URL}/api/collections/${collection}/records`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': prodToken
                            },
                            body: JSON.stringify(data)
                        }
                    );

                    if (response.ok) {
                        created++;
                    } else {
                        errors++;
                        const error = await response.json();
                        console.log(`   ❌ Erro ao criar: ${error.message || 'Unknown'}`);
                    }
                }
            } catch (error) {
                errors++;
                console.log(`   ❌ Erro no registro: ${error.message}`);
            }
        }

        console.log(`\n   Resultado:`);
        console.log(`   ✨ Criados: ${created}`);
        console.log(`   🔄 Atualizados: ${updated}`);
        console.log(`   ⏭️  Inalterados: ${skipped}`);
        console.log(`   ❌ Erros: ${errors}`);

        return { collection, local: localRecords.length, created, updated, skipped, errors };

    } catch (error) {
        console.log(`   💥 Erro fatal: ${error.message}`);
        return { collection, local: 0, created: 0, updated: 0, skipped: 0, errors: 1 };
    }
}

async function fullSync() {
    console.log('========================================');
    console.log('  Sincronização Completa de Dados');
    console.log('  Local → Produção');
    console.log('========================================\n');

    try {
        // Autenticar em ambos
        console.log('🔐 Autenticando...');
        const localToken = await authenticateAdmin(LOCAL_URL);
        console.log('   ✅ Local autenticado');

        const prodToken = await authenticateAdmin(PROD_URL);
        console.log('   ✅ Produção autenticada\n');

        // Sincronizar cada coleção
        const results = [];
        for (const collection of COLLECTIONS_TO_SYNC) {
            const result = await syncCollection(localToken, prodToken, collection);
            results.push(result);
        }

        // Resumo final
        console.log('\n========================================');
        console.log('📊 Resumo Geral da Sincronização');
        console.log('========================================\n');

        const totals = results.reduce((acc, r) => ({
            local: acc.local + r.local,
            created: acc.created + r.created,
            updated: acc.updated + r.updated,
            skipped: acc.skipped + r.skipped,
            errors: acc.errors + r.errors
        }), { local: 0, created: 0, updated: 0, skipped: 0, errors: 0 });

        console.log('Por Coleção:');
        results.forEach(r => {
            if (r.local > 0) {
                console.log(`   ${r.collection.padEnd(20)} - ${r.local} registros (✨${r.created} 🔄${r.updated} ⏭️${r.skipped} ❌${r.errors})`);
            }
        });

        console.log('\nTotal Geral:');
        console.log(`   📍 Registros locais: ${totals.local}`);
        console.log(`   ✨ Criados: ${totals.created}`);
        console.log(`   🔄 Atualizados: ${totals.updated}`);
        console.log(`   ⏭️  Inalterados: ${totals.skipped}`);
        console.log(`   ❌ Erros: ${totals.errors}`);

        console.log('\n========================================');
        console.log('✨ Sincronização completa!\n');

        process.exit(totals.errors > 0 ? 1 : 0);

    } catch (error) {
        console.error('\n💥 Erro fatal:', error.message);
        console.error(error);
        process.exit(1);
    }
}

fullSync();

/**
 * Script de debug para testar autenticação PocketBase
 */

import fs from 'fs';

const BASE_URL = 'https://db.tdfoco.cloud';
const EMAIL = 'td.foco@gmail.com';
const PASSWORD = 'luaTD0101*';

async function testAuth() {
    console.log('========================================');
    console.log('  Debug Autenticação PocketBase');
    console.log('========================================\n');

    console.log('Dados de autenticação:');
    console.log(`  Email: ${EMAIL}`);
    console.log(`  Password: ${PASSWORD.replace(/./g, '*')}`);
    console.log(`  URL: ${BASE_URL}\n`);

    // Teste 1: Auth como usuário regular
    console.log('Teste 1: Autenticação como usuário (users collection)');
    try {
        const response = await fetch(`${BASE_URL}/api/collections/users/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identity: EMAIL,
                password: PASSWORD
            })
        });

        console.log(`  Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log('  ✅ Sucesso!');
            console.log(`  Token: ${data.token.substring(0, 20)}...`);
            console.log(`  User ID: ${data.record.id}`);
        } else {
            const error = await response.json();
            console.log('  ❌ Falhou');
            console.log(`  Erro: ${JSON.stringify(error, null, 2)}`);
        }
    } catch (error) {
        console.log(`  ❌ Exceção: ${error.message}`);
    }

    console.log('\n');

    // Teste 2: Auth como admin
    console.log('Teste 2: Autenticação como admin');
    try {
        const response = await fetch(`${BASE_URL}/api/admins/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identity: EMAIL,
                password: PASSWORD
            })
        });

        console.log(`  Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log('  ✅ Sucesso!');
            console.log(`  Token: ${data.token.substring(0, 20)}...`);
            console.log(`  Admin ID: ${data.admin.id}`);
        } else {
            const error = await response.json();
            console.log('  ❌ Falhou');
            console.log(`  Erro: ${JSON.stringify(error, null, 2)}`);
        }
    } catch (error) {
        console.log(`  ❌ Exceção: ${error.message}`);
    }

    console.log('\n========================================\n');
}

testAuth();

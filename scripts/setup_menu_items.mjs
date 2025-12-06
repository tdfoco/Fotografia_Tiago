/**
 * Script para popular a coleção page_visibility no PocketBase
 * com os itens iniciais do menu de navegação
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.tdfoco.cloud');

// Autenticar como usuário
const userEmail = 'tdfoco@gmail.com';
const userPassword = 'luaTD0101*';

const menuItems = [
    {
        page_key: 'home',
        page_name: 'Home',
        page_path: '/',
        is_active: true,
        order: 1,
        is_system: true, // Página essencial
    },
    {
        page_key: 'photography',
        page_name: 'Fotografia',
        page_path: '/photography',
        is_active: true,
        order: 2,
        is_system: false,
    },
    {
        page_key: 'design',
        page_name: 'Design Gráfico',
        page_path: '/design',
        is_active: true,
        order: 3,
        is_system: false,
    },
    {
        page_key: 'about',
        page_name: 'Sobre',
        page_path: '/about',
        is_active: true,
        order: 4,
        is_system: false,
    },
    {
        page_key: 'services',
        page_name: 'Serviços',
        page_path: '/services',
        is_active: true,
        order: 5,
        is_system: false,
    },
    {
        page_key: 'behind_scenes',
        page_name: 'Bastidores',
        page_path: '/behind-the-scenes',
        is_active: true,
        order: 6,
        is_system: false,
    },
    {
        page_key: 'testimonials',
        page_name: 'Depoimentos',
        page_path: '/testimonials',
        is_active: true,
        order: 7,
        is_system: false,
    },
    {
        page_key: 'visual_search',
        page_name: 'Busca Visual',
        page_path: '/visual-search',
        is_active: true,
        order: 8,
        is_system: false,
    },
    {
        page_key: 'ranking',
        page_name: 'Ranking',
        page_path: '/ranking',
        is_active: true,
        order: 9,
        is_system: false,
    },
    {
        page_key: 'contact',
        page_name: 'Contato',
        page_path: '/contact',
        is_active: true,
        order: 10,
        is_system: false,
    },
];

async function setupMenuItems() {
    try {
        console.log('🔐 Autenticando no PocketBase...');
        await pb.collection('users').authWithPassword(userEmail, userPassword);
        console.log('✅ Autenticado com sucesso!\n');

        console.log('📋 Verificando coleção page_visibility...');

        // Verificar se já existem registros
        const existing = await pb.collection('page_visibility').getFullList();

        if (existing.length > 0) {
            console.log(`⚠️  Já existem ${existing.length} registros na coleção.`);
            console.log('🗑️  Deseja limpar e recriar? Execute com --force\n');

            // Listar registros existentes
            console.log('Registros existentes:');
            existing.forEach(item => {
                console.log(`  - ${item.order}. ${item.page_name} (${item.page_path}) - ${item.is_active ? 'ATIVO' : 'INATIVO'}`);
            });

            return;
        }

        console.log('📝 Criando itens do menu...\n');

        for (const item of menuItems) {
            try {
                const record = await pb.collection('page_visibility').create(item);
                console.log(`✅ Criado: ${item.order}. ${item.page_name} (${item.page_path})`);
            } catch (error) {
                console.error(`❌ Erro ao criar ${item.page_name}:`, error.message);
            }
        }

        console.log('\n🎉 Todos os itens foram criados com sucesso!');
        console.log('\n📊 Resumo:');
        console.log(`   Total de itens: ${menuItems.length}`);
        console.log(`   Itens ativos: ${menuItems.filter(i => i.is_active).length}`);
        console.log(`   Páginas do sistema: ${menuItems.filter(i => i.is_system).length}`);

    } catch (error) {
        console.error('❌ Erro:', error);
        throw error;
    }
}

// Executar
setupMenuItems()
    .then(() => {
        console.log('\n✨ Script concluído!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Falha ao executar script:', error);
        process.exit(1);
    });

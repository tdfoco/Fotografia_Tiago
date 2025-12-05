/**
 * Setup PocketBase Collection: page_visibility
 * Cria a collection e popula com dados iniciais
 */

const PocketBase = require('pocketbase');

const pb = new PocketBase('http://127.0.0.1:8090');

async function setupPageVisibility() {
    console.log('🚀 Configurando collection page_visibility...\n');

    try {
        // Login como admin
        await pb.admins.authWithPassword('admin@tdfoco.cloud', 'admin123456');
        console.log('✓ Autenticado como admin\n');

        // Verificar se collection já existe
        let collection;
        try {
            collection = await pb.collections.getOne('page_visibility');
            console.log('⚠️  Collection já existe, atualizando...\n');
        } catch (error) {
            // Collection não existe, criar
            console.log('📝 Criando collection page_visibility...\n');

            collection = await pb.collections.create({
                name: 'page_visibility',
                type: 'base',
                schema: [
                    {
                        name: 'page_key',
                        type: 'text',
                        required: true,
                        options: {
                            min: 1,
                            max: 50
                        }
                    },
                    {
                        name: 'page_name',
                        type: 'text',
                        required: true,
                        options: {
                            min: 1,
                            max: 100
                        }
                    },
                    {
                        name: 'page_path',
                        type: 'text',
                        required: true,
                        options: {
                            min: 1,
                            max: 200
                        }
                    },
                    {
                        name: 'is_active',
                        type: 'bool',
                        required: true
                    },
                    {
                        name: 'order',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'icon',
                        type: 'text',
                        required: false,
                        options: {
                            max: 50
                        }
                    },
                    {
                        name: 'is_system',
                        type: 'bool',
                        required: true
                    }
                ],
                indexes: [
                    'CREATE UNIQUE INDEX idx_page_key ON page_visibility (page_key)'
                ],
                listRule: '',  // Público pode listar
                viewRule: '',  // Público pode ver
                createRule: '@request.auth.id != ""',  // Apenas autenticados
                updateRule: '@request.auth.id != ""',  // Apenas autenticados
                deleteRule: '@request.auth.id != ""'   // Apenas autenticados
            });

            console.log('✓ Collection criada com sucesso!\n');
        }

        // Dados iniciais das páginas
        const pages = [
            {
                page_key: 'home',
                page_name: 'Home',
                page_path: '/',
                is_active: true,
                order: 1,
                icon: 'Home',
                is_system: true  // Não pode ser desativada
            },
            {
                page_key: 'photography',
                page_name: 'Fotografia',
                page_path: '/photography',
                is_active: true,
                order: 2,
                icon: 'Camera',
                is_system: false
            },
            {
                page_key: 'design',
                page_name: 'Design Gráfico',
                page_path: '/design',
                is_active: true,
                order: 3,
                icon: 'Palette',
                is_system: false
            },
            {
                page_key: 'about',
                page_name: 'Sobre',
                page_path: '/about',
                is_active: true,
                order: 4,
                icon: 'User',
                is_system: false
            },
            {
                page_key: 'services',
                page_name: 'Serviços',
                page_path: '/services',
                is_active: true,
                order: 5,
                icon: 'Briefcase',
                is_system: false
            },
            {
                page_key: 'behind-the-scenes',
                page_name: 'Bastidores',
                page_path: '/behind-the-scenes',
                is_active: true,
                order: 6,
                icon: 'Film',
                is_system: false
            },
            {
                page_key: 'testimonials',
                page_name: 'Depoimentos',
                page_path: '/testimonials',
                is_active: true,
                order: 7,
                icon: 'MessageSquare',
                is_system: false
            },
            {
                page_key: 'visual-search',
                page_name: 'Busca Visual',
                page_path: '/visual-search',
                is_active: true,
                order: 8,
                icon: 'Search',
                is_system: false
            },
            {
                page_key: 'ranking',
                page_name: 'Ranking',
                page_path: '/ranking',
                is_active: true,
                order: 9,
                icon: 'Trophy',
                is_system: false
            },
            {
                page_key: 'contact',
                page_name: 'Contato',
                page_path: '/contact',
                is_active: true,
                order: 10,
                icon: 'Mail',
                is_system: true  // Não pode ser desativada
            }
        ];

        // Popular dados
        console.log('📊 Populando dados iniciais...\n');

        for (const page of pages) {
            try {
                // Verificar se já existe
                const existing = await pb.collection('page_visibility').getFirstListItem(`page_key="${page.page_key}"`);
                console.log(`  ⚠️  Página "${page.page_name}" já existe, pulando...`);
            } catch (error) {
                // Não existe, criar
                await pb.collection('page_visibility').create(page);
                console.log(`  ✓ Página "${page.page_name}" criada`);
            }
        }

        console.log('\n✅ Setup concluído com sucesso!\n');
        console.log('📋 Total de páginas:', pages.length);
        console.log('🔒 Páginas do sistema (não podem ser desativadas): Home, Contato\n');

    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

// Executar setup
setupPageVisibility();

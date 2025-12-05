import PocketBase from 'pocketbase';

const PB_URL = 'https://db.tdfoco.cloud';
const PB_ADMIN_EMAIL = 'td.foco@gmail.com';
const PB_ADMIN_PASS = 'luaTD0101*';

const pb = new PocketBase(PB_URL);

async function updatePhotographySchema() {
    try {
        console.log('🔄 Conectando ao PocketBase:', PB_URL);
        console.log('📧 Email:', PB_ADMIN_EMAIL);
        console.log('');

        // Authenticate as admin
        console.log('🔐 Autenticando como admin...');
        const authData = await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASS);
        console.log('✅ Autenticado com sucesso!');
        console.log('👤 Admin:', authData.admin.email);
        console.log('');

        // Get photography collection
        console.log('📂 Buscando collection photography...');
        const collection = await pb.collections.getOne('photography');
        console.log('✅ Collection encontrada:', collection.name);
        console.log('');

        // Current schema fields
        const currentFields = collection.schema.map(f => f.name);
        console.log('📋 Campos existentes:', currentFields.join(', '));
        console.log('');

        // Define new AI Lab fields
        const aiLabFields = [
            {
                name: 'featured',
                type: 'bool',
                required: false
            },
            {
                name: 'priority',
                type: 'number',
                required: false,
                options: { min: 0, max: 10 }
            },
            {
                name: 'use_as_banner',
                type: 'bool',
                required: false
            },
            {
                name: 'promoted',
                type: 'bool',
                required: false
            },
            {
                name: 'recommended',
                type: 'bool',
                required: false
            }
        ];

        // Filter fields that don't exist yet
        const fieldsToAdd = aiLabFields.filter(f => !currentFields.includes(f.name));

        if (fieldsToAdd.length === 0) {
            console.log('✅ Todos os campos do IA Lab já existem!');
            console.log('✨ Nada a fazer - sistema já está configurado!');
            return;
        }

        console.log('➕ Adicionando', fieldsToAdd.length, 'novos campos:');
        fieldsToAdd.forEach(f => {
            console.log(`   • ${f.name} (${f.type})`);
        });
        console.log('');

        // Update schema by adding new fields
        const updatedSchema = [...collection.schema, ...fieldsToAdd];

        console.log('💾 Atualizando schema da collection...');
        await pb.collections.update(collection.id, {
            schema: updatedSchema
        });

        console.log('');
        console.log('╔═══════════════════════════════════════════════════╗');
        console.log('║  ✅ SUCESSO! CAMPOS ADICIONADOS COM ÊXITO!        ║');
        console.log('╚═══════════════════════════════════════════════════╝');
        console.log('');
        console.log('✨ Campos do IA Lab adicionados:');
        fieldsToAdd.forEach(f => {
            console.log(`   ✓ ${f.name}`);
        });
        console.log('');
        console.log('🚀 O IA Lab agora está totalmente funcional!');
        console.log('🔗 Acesse: https://tdfoco.cloud/admin/ai-lab');
        console.log('');

    } catch (error) {
        console.log('');
        console.log('╔═══════════════════════════════════════════════════╗');
        console.log('║  ❌ ERRO AO ATUALIZAR SCHEMA                      ║');
        console.log('╚═══════════════════════════════════════════════════╝');
        console.log('');
        console.log('Detalhes do erro:');
        console.log('Mensagem:', error.message);
        if (error.status) console.log('Status:', error.status);
        if (error.data) console.log('Data:', JSON.stringify(error.data, null, 2));
        console.log('');

        if (error.status === 401 || error.message.includes('auth')) {
            console.log('⚠️  PROBLEMA DE AUTENTICAÇÃO');
            console.log('');
            console.log('A conta fornecida não tem privilégios de admin no PocketBase.');
            console.log('');
            console.log('📝 SOLUÇÃO MANUAL:');
            console.log('1. Acesse: https://db.tdfoco.cloud/_/');
            console.log('2. Faça login com credenciais de ADMIN');
            console.log('3. Vá em Collections → photography');
            console.log('4. Adicione os 5 campos manualmente');
            console.log('');
        }

        process.exit(1);
    }
}

updatePhotographySchema();

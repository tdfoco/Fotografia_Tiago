import PocketBase from 'pocketbase';

// Configuração
const PB_URL = 'https://db.tdfoco.cloud';
const ADMIN_EMAIL = 'tdfoco@gmail.com';
const ADMIN_PASS = 'luaTD0101*';

const pb = new PocketBase(PB_URL);

async function createCollections() {
    console.log('🔄 Conectando ao PocketBase...');

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log('✅ Autenticado com sucesso!');
    } catch (e) {
        console.error('❌ Erro ao autenticar. Verifique se o usuário admin foi criado.');
        console.error(e.message);
        return;
    }

    // 1. Photography
    try {
        console.log('Criando coleção: photography...');
        await pb.collections.create({
            name: 'photography',
            type: 'base',
            schema: [
                { name: 'title', type: 'text' },
                { name: 'category', type: 'select', options: { maxSelect: 1, values: ['portraits', 'urban', 'nature', 'art', 'events'] } },
                { name: 'image', type: 'file', options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
                { name: 'description', type: 'text' },
                { name: 'year', type: 'number' },
                { name: 'event_name', type: 'text' },
                { name: 'event_date', type: 'date' },
                { name: 'camera_make', type: 'text' },
                { name: 'camera_model', type: 'text' },
                { name: 'lens_model', type: 'text' },
                { name: 'iso', type: 'number' },
                { name: 'aperture', type: 'text' },
                { name: 'shutter_speed', type: 'text' },
                { name: 'focal_length', type: 'text' },
                { name: 'capture_date', type: 'date' },
                { name: 'likes_count', type: 'number' },
                { name: 'comments_count', type: 'number' },
                { name: 'shares_count', type: 'number' },
            ]
        });
        console.log('✅ photography criada.');
    } catch (e) {
        console.log(`⚠️ photography: ${e.message}`);
    }

    // 2. Design Projects
    try {
        console.log('Criando coleção: design_projects...');
        await pb.collections.create({
            name: 'design_projects',
            type: 'base',
            schema: [
                { name: 'title', type: 'text' },
                { name: 'category', type: 'select', options: { maxSelect: 1, values: ['branding', 'editorial', 'web', 'illustration', 'packaging'] } },
                { name: 'description', type: 'text' },
                { name: 'images', type: 'file', options: { maxSelect: 10, maxSize: 52428800, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
                { name: 'client', type: 'text' },
                { name: 'year', type: 'number' },
                { name: 'link', type: 'url' },
                { name: 'likes_count', type: 'number' },
                { name: 'comments_count', type: 'number' },
                { name: 'shares_count', type: 'number' },
            ]
        });
        console.log('✅ design_projects criada.');
    } catch (e) {
        console.log(`⚠️ design_projects: ${e.message}`);
    }

    // 3. Hero Images
    try {
        console.log('Criando coleção: hero_images...');
        await pb.collections.create({
            name: 'hero_images',
            type: 'base',
            schema: [
                { name: 'title', type: 'text' },
                { name: 'image', type: 'file', options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
                { name: 'active', type: 'bool' },
                { name: 'page', type: 'text' },
            ]
        });
        console.log('✅ hero_images criada.');
    } catch (e) {
        console.log(`⚠️ hero_images: ${e.message}`);
    }

    // 4. Clients
    try {
        console.log('Criando coleção: clients...');
        await pb.collections.create({
            name: 'clients',
            type: 'base',
            schema: [
                { name: 'name', type: 'text' },
                { name: 'email', type: 'email' },
                { name: 'phone', type: 'text' },
                { name: 'status', type: 'select', options: { maxSelect: 1, values: ['booked', 'lead', 'completed'] } },
                { name: 'date', type: 'date' },
                { name: 'type', type: 'text' },
            ]
        });
        console.log('✅ clients criada.');
    } catch (e) {
        console.log(`⚠️ clients: ${e.message}`);
    }

    console.log('🎉 Restauração de Schema Concluída!');
}

createCollections();

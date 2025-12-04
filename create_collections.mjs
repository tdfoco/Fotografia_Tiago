import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function createCollections() {
    try {
        await pb.admins.authWithPassword('td.foco@gmail.com', 'luaTD0101*');
        console.log('✅ Autenticado');

        // photography
        try {
            await pb.collections.create({
                name: 'photography',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'image', type: 'file', required: true, options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['image/*'] } },
                    { name: 'category', type: 'select', options: { values: ['portraits', 'urban', 'nature', 'art', 'events'] } },
                    { name: 'description', type: 'text' },
                    { name: 'featured', type: 'bool' }
                ]
            });
            console.log('✅ photography');
        } catch (e) {
            console.log('ℹ️  photography existe');
        }

        // graphic_design
        try {
            await pb.collections.create({
                name: 'graphic_design',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'images', type: 'file', required: true, options: { maxSelect: 10, maxSize: 52428800, mimeTypes: ['image/*'] } },
                    { name: 'category', type: 'select', options: { values: ['logos', 'visual_identity', 'social_media', 'posters', 'special'] } },
                    { name: 'description', type: 'text' },
                    { name: 'client', type: 'text' },
                    { name: 'featured', type: 'bool' }
                ]
            });
            console.log('✅ graphic_design');
        } catch (e) {
            console.log('ℹ️  graphic_design existe');
        }

        console.log('\n🎉 Pronto! Acesse https://db.tdfoco.cloud/_/ para adicionar fotos!');
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

createCollections();

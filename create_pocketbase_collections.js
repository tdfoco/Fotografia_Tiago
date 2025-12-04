const PocketBase = require('pocketbase');

const pb = new PocketBase('http://127.0.0.1:8090');

async function createCollections() {
    try {
        // Autenticar
        await pb.admins.authWithPassword('td.foco@gmail.com', 'luaTD0101*');
        console.log('✅ Autenticado como admin');

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
            console.log('✅ Collection "photography" criada');
        } catch (e) {
            if (e.status === 400) {
                console.log('ℹ️  Collection "photography" já existe');
            } else {
                console.error('❌ Erro ao criar photography:', e.message);
            }
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
            console.log('✅ Collection "graphic_design" criada');
        } catch (e) {
            if (e.status === 400) {
                console.log('ℹ️  Collection "graphic_design" já existe');
            } else {
                console.error('❌ Erro ao criar graphic_design:', e.message);
            }
        }

        // hero_images
        try {
            await pb.collections.create({
                name: 'hero_images',
                type: 'base',
                schema: [
                    { name: 'page', type: 'select', required: true, options: { values: ['home', 'photography', 'design', 'about', 'contact'] } },
                    { name: 'image', type: 'file', required: true, options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['image/*'] } },
                    { name: 'active', type: 'bool' }
                ]
            });
            console.log('✅ Collection "hero_images" criada');
        } catch (e) {
            if (e.status === 400) {
                console.log('ℹ️  Collection "hero_images" já existe');
            } else {
                console.error('❌ Erro ao criar hero_images:', e.message);
            }
        }

        console.log('\n🎉 Collections criadas com sucesso!');
        console.log('📌 Próximo passo: Acesse https://db.tdfoco.cloud/_/ para adicionar fotos');

    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

createCollections();

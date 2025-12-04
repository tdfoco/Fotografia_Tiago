import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        await pb.admins.authWithPassword('td.foco@gmail.com', 'luaTD0101*');
        console.log('✅ Login bem-sucedido!');

        // Photography
        try {
            await pb.collections.create({
                name: 'photography',
                type: 'base',
                listRule: '',
                viewRule: '',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'image', type: 'file', required: true, options: { maxSelect: 1, maxSize: 52428800 } },
                    { name: 'category', type: 'select', options: { values: ['portraits', 'urban', 'nature', 'art', 'events'] } },
                    { name: 'description', type: 'text' },
                    { name: 'featured', type: 'bool' }
                ]
            });
            console.log('✅ photography criada');
        } catch (e) { console.log('ℹ️  photography existe -', e.message); }

        // Graphic Design  
        try {
            await pb.collections.create({
                name: 'graphic_design',
                type: 'base',
                listRule: '',
                viewRule: '',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'images', type: 'file', required: true, options: { maxSelect: 10, maxSize: 52428800 } },
                    { name: 'category', type: 'select', options: { values: ['logos', 'visual_identity', 'social_media', 'posters', 'special'] } },
                    { name: 'description', type: 'text' },
                    { name: 'client', type: 'text' },
                    { name: 'featured', type: 'bool' }
                ]
            });
            console.log('✅ graphic_design criada');
        } catch (e) { console.log('ℹ️  graphic_design existe -', e.message); }

        console.log('\n🎉 Pronto! Acesse https://db.tdfoco.cloud/_/ para adicionar fotos!');

    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

main();

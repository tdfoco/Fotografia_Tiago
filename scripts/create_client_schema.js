import PocketBase from 'pocketbase';

// Localhost on VPS
const pb = new PocketBase('http://127.0.0.1:8090');

async function createClientSchema() {
    try {
        // Authenticate as Admin
        await pb.admins.authWithPassword('admin@tdfoco.cloud', 'Tiago123!@#');
        console.log('✅ Authenticated as Admin');

        // 1. Create Clients Collection
        try {
            await pb.collections.create({
                name: 'clients',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'email', type: 'email' },
                    { name: 'phone', type: 'text' },
                    { name: 'access_code', type: 'text', required: true, unique: true },
                    {
                        name: 'status',
                        type: 'select',
                        options: { values: ['lead', 'booked', 'completed'] }
                    },
                    { name: 'notes', type: 'text' }
                ]
            });
            console.log('✅ Created "clients" collection');
        } catch (e) {
            console.log('ℹ️ "clients" collection might already exist');
        }

        // 2. Create Private Galleries Collection
        try {
            await pb.collections.create({
                name: 'private_galleries',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text', required: true },
                    {
                        name: 'client',
                        type: 'relation',
                        required: true,
                        options: { collectionId: 'clients', cascadeDelete: true, maxSelect: 1 }
                    },
                    {
                        name: 'images',
                        type: 'file',
                        options: { maxSelect: 100, maxSize: 52428800, mimeTypes: ['image/*'] }
                    },
                    {
                        name: 'cover_image',
                        type: 'file',
                        options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/*'] }
                    },
                    { name: 'date', type: 'date' },
                    { name: 'download_enabled', type: 'bool' }
                ]
            });
            console.log('✅ Created "private_galleries" collection');
        } catch (e) {
            console.log('ℹ️ "private_galleries" collection might already exist');
        }

        // 3. Create Client Favorites Collection
        try {
            await pb.collections.create({
                name: 'client_favorites',
                type: 'base',
                schema: [
                    {
                        name: 'client',
                        type: 'relation',
                        required: true,
                        options: { collectionId: 'clients', cascadeDelete: true, maxSelect: 1 }
                    },
                    {
                        name: 'gallery',
                        type: 'relation',
                        required: true,
                        options: { collectionId: 'private_galleries', cascadeDelete: true, maxSelect: 1 }
                    },
                    { name: 'selected_images', type: 'json' }
                ]
            });
            console.log('✅ Created "client_favorites" collection');
        } catch (e) {
            console.log('ℹ️ "client_favorites" collection might already exist');
        }

    } catch (error) {
        console.error('❌ Error creating schema:', error);
    }
}

createClientSchema();

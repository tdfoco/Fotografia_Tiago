import PocketBase from 'pocketbase';

// Localhost on VPS
const pb = new PocketBase('http://127.0.0.1:8090');

async function createTestimonialsSchema() {
    try {
        // Authenticate as Admin
        await pb.admins.authWithPassword('admin@tdfoco.cloud', 'Tiago123!@#');
        console.log('✅ Authenticated as Admin');

        // Create Testimonials Collection
        try {
            await pb.collections.create({
                name: 'testimonials',
                type: 'base',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'role', type: 'text' },
                    { name: 'content', type: 'text', required: true },
                    {
                        name: 'avatar',
                        type: 'file',
                        options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/*'] }
                    },
                    {
                        name: 'rating',
                        type: 'number',
                        min: 1,
                        max: 5
                    },
                    { name: 'featured', type: 'bool' },
                    { name: 'visible', type: 'bool' }
                ]
            });
            console.log('✅ Created "testimonials" collection');
        } catch (e) {
            console.log('ℹ️ "testimonials" collection might already exist');
        }

    } catch (error) {
        console.error('❌ Error creating schema:', error);
    }
}

createTestimonialsSchema();

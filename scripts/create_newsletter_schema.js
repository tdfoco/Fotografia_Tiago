import PocketBase from 'pocketbase';

// Localhost on VPS
const pb = new PocketBase('http://127.0.0.1:8090');

async function createNewsletterSchema() {
    try {
        // Authenticate as Admin
        await pb.admins.authWithPassword('admin@tdfoco.cloud', 'Tiago123!@#');
        console.log('✅ Authenticated as Admin');

        // Create Newsletter Subscribers Collection
        try {
            await pb.collections.create({
                name: 'newsletter_subscribers',
                type: 'base',
                schema: [
                    { name: 'email', type: 'email', required: true, unique: true },
                    { name: 'active', type: 'bool' }
                ]
            });
            console.log('✅ Created "newsletter_subscribers" collection');
        } catch (e) {
            console.log('ℹ️ "newsletter_subscribers" collection might already exist');
        }

    } catch (error) {
        console.error('❌ Error creating schema:', error);
    }
}

createNewsletterSchema();

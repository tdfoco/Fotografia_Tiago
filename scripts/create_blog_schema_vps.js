import PocketBase from 'pocketbase';

// Localhost on VPS
const pb = new PocketBase('http://127.0.0.1:8090');

async function createBlogSchema() {
    try {
        // Authenticate as Admin
        await pb.admins.authWithPassword('admin@tdfoco.cloud', 'Tiago123!@#');
        console.log('✅ Authenticated as Admin');

        // 1. Create Categories Collection
        try {
            await pb.collections.create({
                name: 'categories',
                type: 'base',
                schema: [
                    {
                        name: 'name',
                        type: 'text',
                        required: true,
                        unique: true
                    },
                    {
                        name: 'slug',
                        type: 'text',
                        required: true,
                        unique: true
                    }
                ]
            });
            console.log('✅ Created "categories" collection');
        } catch (e) {
            console.log('ℹ️ "categories" collection might already exist');
        }

        // 2. Create Posts Collection
        try {
            await pb.collections.create({
                name: 'posts',
                type: 'base',
                schema: [
                    {
                        name: 'title',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'slug',
                        type: 'text',
                        required: true,
                        unique: true
                    },
                    {
                        name: 'excerpt',
                        type: 'text'
                    },
                    {
                        name: 'content',
                        type: 'editor'
                    },
                    {
                        name: 'cover_image',
                        type: 'file',
                        options: {
                            maxSelect: 1,
                            maxSize: 5242880,
                            mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
                        }
                    },
                    {
                        name: 'published',
                        type: 'bool'
                    },
                    {
                        name: 'published_at',
                        type: 'date'
                    },
                    {
                        name: 'category',
                        type: 'relation',
                        options: {
                            collectionId: 'categories',
                            cascadeDelete: false,
                            maxSelect: 1
                        }
                    },
                    {
                        name: 'tags',
                        type: 'json'
                    },
                    {
                        name: 'views',
                        type: 'number'
                    }
                ]
            });
            console.log('✅ Created "posts" collection');
        } catch (e) {
            console.log('ℹ️ "posts" collection might already exist');
        }

    } catch (error) {
        console.error('❌ Error creating schema:', error);
    }
}

createBlogSchema();

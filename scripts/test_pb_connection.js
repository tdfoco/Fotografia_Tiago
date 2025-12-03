import PocketBase from 'pocketbase';

const PB_URL = 'http://148.230.76.195:8090';
const PB_ADMIN_EMAIL = 'td.foco@gmail.com';
const PB_ADMIN_PASS = 'luatd010101';

const pb = new PocketBase(PB_URL);

async function main() {
    try {
        console.log('Authenticating...');
        const authData = await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASS);
        console.log('Authenticated as:', authData.admin?.email || authData.record?.email);
        console.log('Token:', pb.authStore.token ? 'Present' : 'Missing');

        console.log('Listing collections...');
        const collections = await pb.collections.getFullList();
        console.log('Collections found:', collections.map(c => c.name));

        console.log('Attempting to create test collection...');
        try {
            const testCol = await pb.collections.create({
                name: 'test_col',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text' }
                ]
            });
            console.log('Created test_col:', testCol.id);
            // Clean up
            await pb.collections.delete(testCol.id);
            console.log('Deleted test_col');
        } catch (err) {
            console.error('Create failed:', err.status, err.message);
            if (err.response) console.error(err.response.data);
        }

    } catch (e) {
        console.error('Error:', e);
        if (e.response) {
            console.error('Response status:', e.response.status);
            console.error('Response data:', e.response.data);
        }
    }
}

main();

import PocketBase from 'pocketbase';

const PB_URL = 'http://148.230.76.195:8090';
const PB_ADMIN_EMAIL = 'td.foco@gmail.com';
const PB_ADMIN_PASS = 'luatd010101';

const pb = new PocketBase(PB_URL);

async function main() {
    try {
        await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASS);
        console.log('Authenticated');

        try {
            await pb.collections.create({
                name: 'favorites',
                type: 'base',
                schema: [
                    { name: 'user', type: 'relation', collectionId: '_pb_users_auth_', cascadeDelete: true, maxSelect: 1 },
                    { name: 'photo', type: 'relation', collectionId: 'photography', cascadeDelete: true, maxSelect: 1 },
                    { name: 'project', type: 'relation', collectionId: 'design_projects', cascadeDelete: true, maxSelect: 1 }
                ],
                listRule: '@request.auth.id = user.id',
                viewRule: '@request.auth.id = user.id',
                createRule: '@request.auth.id != "" && @request.auth.id = @request.data.user',
                updateRule: '@request.auth.id = user.id',
                deleteRule: '@request.auth.id = user.id',
            });
            console.log('Created favorites collection');
        } catch (e) {
            console.log('Collection might already exist:', e.message);
        }

    } catch (e) {
        console.error('Fatal:', e);
    }
}

main();

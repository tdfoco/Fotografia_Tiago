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
                name: 'site_content',
                type: 'base',
                schema: [
                    { name: 'key', type: 'text', required: true },
                    { name: 'value', type: 'text' },
                    { name: 'lang', type: 'text' }
                ]
            });
            console.log('Created site_content collection');
        } catch (e) {
            console.log('Collection might already exist:', e.message);
        }

    } catch (e) {
        console.error('Fatal:', e);
    }
}

main();

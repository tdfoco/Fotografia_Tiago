import PocketBase from 'pocketbase';

const PB_URL = 'http://148.230.76.195:8090';
const PB_ADMIN_EMAIL = 'td.foco@gmail.com';
const PB_ADMIN_PASS = 'luatd010101';

const pb = new PocketBase(PB_URL);

async function main() {
    try {
        await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASS);
        console.log('Authenticated');

        // 1. Minimal
        console.log('Attempt 1: Minimal Schema');
        try {
            const col = await pb.collections.create({
                name: 'photography_debug',
                type: 'base',
                schema: [{ name: 'title', type: 'text' }]
            });
            console.log('Success 1');
            await pb.collections.delete(col.id);
        } catch (e) { console.error('Fail 1', e.status, e.message); }

        // 2. With Select
        console.log('Attempt 2: With Select');
        try {
            const col = await pb.collections.create({
                name: 'photography_debug_2',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text' },
                    { name: 'category', type: 'select', options: { values: ['a', 'b'] } }
                ]
            });
            console.log('Success 2');
            await pb.collections.delete(col.id);
        } catch (e) { console.error('Fail 2', e.status, e.message); }

        // 3. Full Photography Schema
        console.log('Attempt 3: Full Photography Schema');
        try {
            const col = await pb.collections.create({
                name: 'photography_debug_full',
                type: 'base',
                schema: [
                    { name: 'title', type: 'text' },
                    { name: 'category', type: 'select', options: { maxSelect: 1, values: ['portraits', 'urban', 'nature', 'art', 'events'] } },
                    { name: 'image', type: 'file', options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
                    { name: 'description', type: 'text' },
                    { name: 'year', type: 'number' },
                    { name: 'event_name', type: 'text' },
                    { name: 'event_date', type: 'date' },
                    { name: 'tags', type: 'json' },
                    // EXIF
                    { name: 'camera_make', type: 'text' },
                    { name: 'camera_model', type: 'text' },
                    { name: 'lens_model', type: 'text' },
                    { name: 'iso', type: 'number' },
                    { name: 'aperture', type: 'text' },
                    { name: 'shutter_speed', type: 'text' },
                    { name: 'focal_length', type: 'text' },
                    { name: 'capture_date', type: 'date' },
                    { name: 'likes_count', type: 'number' },
                    { name: 'comments_count', type: 'number' },
                    { name: 'shares_count', type: 'number' },
                ]
            });
            console.log('Success 3: Created full schema');
            await pb.collections.delete(col.id);
        } catch (e) {
            console.error('Fail 3', e.status, e.message);
            if (e.response) console.error(JSON.stringify(e.response.data, null, 2));
        }

    } catch (e) {
        console.error('Fatal:', e);
    }
}

main();

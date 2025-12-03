import PocketBase from 'pocketbase';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Configuration
const PB_URL = 'http://148.230.76.195:8090';
const PB_ADMIN_EMAIL = 'td.foco@gmail.com';
const PB_ADMIN_PASS = 'luatd010101';

// Supabase Config (from .env)
// Note: You need to ensure these are available or hardcode them temporarily if running outside vite context
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://sgzngykokmddmmqiilma.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnem5neWtva21kZG1tcWlpbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODY5NTUsImV4cCI6MjA3OTk2Mjk1NX0.lyUIhagcIGbfPl_rYr2H8UJ0EL_aofPr7WLzENY82Vk';

const pb = new PocketBase(PB_URL);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, 'temp_images');

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(TEMP_DIR, filename);
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function createCollections() {
    console.log('Creating collections...');

    // Photography Collection
    try {
        await pb.collections.create({
            name: 'photography',
            type: 'base',
            schema: [
                { name: 'title', type: 'text' },
                { name: 'category', type: 'select', options: { maxSelect: 1, values: ['portraits', 'urban', 'nature', 'art', 'events'] } },
                { name: 'image', type: 'file', options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
                { name: 'description', type: 'text' },
                { name: 'year', type: 'number' },
                { name: 'event_name', type: 'text' },
                { name: 'event_date', type: 'date' },
                // { name: 'tags', type: 'json' },
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
        console.log('Created photography collection');
    } catch (e) {
        console.log('Photography collection might already exist:', e.message);
    }

    // Design Projects Collection
    try {
        await pb.collections.create({
            name: 'design_projects',
            type: 'base',
            schema: [
                { name: 'title', type: 'text' },
                { name: 'category', type: 'select', options: { maxSelect: 1, values: ['branding', 'editorial', 'web', 'illustration', 'packaging'] } },
                { name: 'description', type: 'text' },
                { name: 'images', type: 'file', options: { maxSelect: 10, maxSize: 52428800, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
                { name: 'client', type: 'text' },
                { name: 'year', type: 'number' },
                { name: 'link', type: 'url' },
                // { name: 'tags', type: 'json' },
                { name: 'likes_count', type: 'number' },
                { name: 'comments_count', type: 'number' },
                { name: 'shares_count', type: 'number' },
            ]
        });
        console.log('Created design_projects collection');
    } catch (e) {
        console.log('Design Projects collection might already exist:', e.message);
    }

    // Hero Images Collection
    try {
        await pb.collections.create({
            name: 'hero_images',
            type: 'base',
            schema: [
                { name: 'title', type: 'text' },
                { name: 'image', type: 'file', options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
                { name: 'active', type: 'bool' },
                { name: 'page', type: 'text' },
            ]
        });
        console.log('Created hero_images collection');
    } catch (e) {
        console.log('Hero Images collection might already exist:', e.message);
    }
}

async function migratePhotography() {
    console.log('Migrating Photography...');
    const { data: photos, error } = await supabase.from('photography').select('*');
    if (error) {
        console.error('Error fetching photos:', error);
        return;
    }

    for (const photo of photos) {
        console.log(`Processing photo: ${photo.title}`);
        try {
            // Download image
            // Assuming photo.url is a full URL or a path. If it's a path, construct full URL.
            // Supabase public URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
            let imageUrl = photo.url;
            if (!imageUrl.startsWith('http')) {
                imageUrl = `${SUPABASE_URL}/storage/v1/object/public/photography/${photo.url}`;
            }

            const filename = `photo_${photo.id}_${Date.now()}.jpg`;
            const localPath = await downloadImage(imageUrl, filename);

            // Upload to PocketBase
            const formData = new FormData();
            formData.append('title', photo.title || '');
            formData.append('category', photo.category || 'portraits');
            formData.append('description', photo.description || '');
            formData.append('year', photo.year?.toString() || '');
            formData.append('image', new Blob([fs.readFileSync(localPath)]), filename);

            // EXIF
            if (photo.camera_make) formData.append('camera_make', photo.camera_make);
            if (photo.camera_model) formData.append('camera_model', photo.camera_model);
            if (photo.iso) formData.append('iso', photo.iso.toString());

            await pb.collection('photography').create(formData);

            // Cleanup
            fs.unlinkSync(localPath);
            console.log(`Migrated: ${photo.title}`);
        } catch (e) {
            console.error(`Failed to migrate ${photo.title}:`, e);
        }
    }
}

async function main() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASS);
        console.log('Authenticated!');

        await createCollections();
        await migratePhotography();

        console.log('Migration Complete!');
    } catch (e) {
        console.error('Migration failed:', e);
    }
}

main();

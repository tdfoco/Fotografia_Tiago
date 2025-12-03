import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POCKETBASE_URL = 'http://148.230.76.195:8090';
const SITE_URL = 'https://tdfoco.cloud';

async function fetchRecords(collection) {
    try {
        const response = await fetch(`${POCKETBASE_URL}/api/collections/${collection}/records?perPage=500`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error(`Error fetching ${collection}:`, error);
        return [];
    }
}

async function generateSitemap() {
    console.log('Generating sitemap...');

    const photos = await fetchRecords('photography');
    const projects = await fetchRecords('design_projects');

    const staticPages = [
        '',
        '/photography',
        '/design',
        '/about',
        '/services',
        '/contact',
        '/ranking',
        '/favorites'
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Static Pages
    staticPages.forEach(page => {
        sitemap += `  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    // Dynamic Photos (if they have individual pages, assuming /photography/:id)
    // If not, we can just list them as images in the main gallery page, but sitemap usually links to pages.
    // Assuming we might have a detail page or modal. If modal, maybe not needed as separate URL unless we have deep linking.
    // Let's assume deep linking exists or will exist.

    // For now, let's just add them if we had a route like /photo/:id
    // But looking at App.tsx, we don't have detail routes yet.
    // So I will skip adding individual photo URLs for now, but I will add the code commented out for future use.

    /*
    photos.forEach(photo => {
        sitemap += `  <url>
    <loc>${SITE_URL}/photography/${photo.id}</loc>
    <lastmod>${photo.updated.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });
    */

    sitemap += `</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap();

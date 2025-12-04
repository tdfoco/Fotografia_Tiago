import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRS = [
    path.join(__dirname, '../src/assets'),
    path.join(__dirname, '../public')
];

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImages() {
    console.log('🚀 Starting image optimization...');

    for (const dir of TARGET_DIRS) {
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir);

        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png)$/i)) {
                const filePath = path.join(dir, file);
                const filename = path.parse(file).name;
                const webpPath = path.join(dir, `${filename}.webp`);

                // Skip if WebP already exists and is newer
                if (fs.existsSync(webpPath)) {
                    const originalStats = fs.statSync(filePath);
                    const webpStats = fs.statSync(webpPath);
                    if (webpStats.mtime > originalStats.mtime) {
                        console.log(`⏭️  Skipping ${file} (WebP already up to date)`);
                        continue;
                    }
                }

                try {
                    const image = sharp(filePath);
                    const metadata = await image.metadata();

                    if (metadata.width && metadata.width > MAX_WIDTH) {
                        await image
                            .resize(MAX_WIDTH)
                            .webp({ quality: QUALITY })
                            .toFile(webpPath);
                        console.log(`✅ Resized & Converted: ${file} -> ${filename}.webp`);
                    } else {
                        await image
                            .webp({ quality: QUALITY })
                            .toFile(webpPath);
                        console.log(`✅ Converted: ${file} -> ${filename}.webp`);
                    }

                    // Optional: Delete original if you want to enforce WebP (be careful!)
                    // fs.unlinkSync(filePath); 

                } catch (error) {
                    console.error(`❌ Error processing ${file}:`, error);
                }
            }
        }
    }

    console.log('✨ Image optimization complete!');
}

optimizeImages();

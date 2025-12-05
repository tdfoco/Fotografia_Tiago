#!/usr/bin/env node

/**
 * Image Optimization Script
 * Optimize images using Sharp library
 * Generates WebP, handles compression, creates multiple sizes
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SIZES = [320, 640, 768, 1024, 1280, 1920];
const QUALITY = {
    jpeg: 85,
    webp: 90,
    png: 90
};

// Parse command line arguments
const args = process.argv.slice(2);
const config = {
    input: args.find(arg => arg.startsWith('--input='))?.split('=')[1] || 'public/images',
    output: args.find(arg => arg.startsWith('--output='))?.split('=')[1] || 'public/optimized',
    formats: args.find(arg => arg.startsWith('--formats='))?.split('=')[1]?.split(',') || ['webp', 'jpg'],
    sizes: args.find(arg => arg.startsWith('--sizes='))?.split('=')[1]?.split(',').map(Number) || SIZES,
    quality: parseInt(args.find(arg => arg.startsWith('--quality='))?.split('=')[1]) || 85,
};

// Show help
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📸 Image Optimization Script

Usage:
  node scripts/optimize_images.mjs [options]

Options:
  --input=<path>      Input directory (default: public/images)
  --output=<path>     Output directory (default: public/optimized)
  --formats=<list>    Output formats, comma-separated (default: webp,jpg)
  --sizes=<list>      Image sizes, comma-separated (default: 320,640,768,1024,1280,1920)
  --quality=<num>     JPEG quality 1-100 (default: 85)
  --help, -h          Show this help message

Examples:
  node scripts/optimize_images.mjs
  node scripts/optimize_images.mjs --input=./photos --output=./public/optimized
  node scripts/optimize_images.mjs --formats=webp --quality=90
    `);
    process.exit(0);
}

/**
 * Get all image files from a directory recursively
 */
async function getImageFiles(dir) {
    const files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            const subFiles = await getImageFiles(fullPath);
            files.push(...subFiles);
        } else if (/\.(jpe?g|png|gif|bmp|tiff)$/i.test(item.name)) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath, outputDir) {
    try {
        const filename = path.basename(inputPath, path.extname(inputPath));
        const relativeDir = path.relative(config.input, path.dirname(inputPath));
        const targetDir = path.join(outputDir, relativeDir);

        // Create output directory if it doesn't exist
        await fs.mkdir(targetDir, { recursive: true });

        // Get image metadata
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        console.log(`\n📷 Processing: ${path.relative(process.cwd(), inputPath)}`);
        console.log(`   Original size: ${metadata.width}x${metadata.height}, Format: ${metadata.format}`);

        let processedCount = 0;

        // Generate sizes
        for (const size of config.sizes) {
            // Skip if original is smaller
            if (metadata.width < size) continue;

            for (const format of config.formats) {
                const outputFilename = `${filename}_${size}.${format}`;
                const outputPath = path.join(targetDir, outputFilename);

                // Resize and optimize
                await sharp(inputPath)
                    .resize(size, null, {
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                [format === 'jpg' ? 'jpeg' : format]({
                    quality: QUALITY[format === 'jpg' ? 'jpeg' : format] || config.quality,
                    progressive: true
                })
                    .toFile(outputPath);

                const stats = await fs.stat(outputPath);
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

                console.log(`   ✓ ${outputFilename} (${sizeMB} MB)`);
                processedCount++;
            }
        }

        return processedCount;
    } catch (error) {
        console.error(`   ✗ Error processing ${inputPath}:`, error.message);
        return 0;
    }
}

/**
 * Generate blur placeholder
 */
async function generateBlurPlaceholder(inputPath, outputDir) {
    try {
        const filename = path.basename(inputPath, path.extname(inputPath));
        const relativeDir = path.relative(config.input, path.dirname(inputPath));
        const targetDir = path.join(outputDir, relativeDir);
        const outputPath = path.join(targetDir, `${filename}_blur.jpg`);

        await sharp(inputPath)
            .resize(20, 20, { fit: 'inside' })
            .blur(5)
            .jpeg({ quality: 50 })
            .toFile(outputPath);

        // Generate base64 data URL
        const buffer = await fs.readFile(outputPath);
        const base64 = buffer.toString('base64');
        const dataURL = `data:image/jpeg;base64,${base64}`;

        return { path: outputPath, dataURL };
    } catch (error) {
        console.error(`   ✗ Error generating blur placeholder:`, error.message);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Starting image optimization...\n');
    console.log(`📁 Input:  ${path.resolve(config.input)}`);
    console.log(`📁 Output: ${path.resolve(config.output)}`);
    console.log(`📐 Sizes:  ${config.sizes.join(', ')}`);
    console.log(`🎨 Formats: ${config.formats.join(', ')}`);
    console.log(`💎 Quality: ${config.quality}`);

    // Check if input directory exists
    try {
        await fs.access(config.input);
    } catch (error) {
        console.error(`\n❌ Error: Input directory '${config.input}' does not exist.`);
        process.exit(1);
    }

    // Create output directory
    await fs.mkdir(config.output, { recursive: true });

    // Get all images
    console.log('\n🔍 Scanning for images...');
    const imageFiles = await getImageFiles(config.input);
    console.log(`📸 Found ${imageFiles.length} images to process\n`);

    if (imageFiles.length === 0) {
        console.log('⚠️  No images found in the input directory.');
        process.exit(0);
    }

    // Process all images
    let totalProcessed = 0;
    const startTime = Date.now();

    for (const imagePath of imageFiles) {
        const count = await optimizeImage(imagePath, config.output);
        totalProcessed += count;

        // Generate blur placeholder
        if (config.formats.includes('jpg') || config.formats.includes('jpeg')) {
            await generateBlurPlaceholder(imagePath, config.output);
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n✅ Optimization complete!`);
    console.log(`   Processed: ${imageFiles.length} images`);
    console.log(`   Generated: ${totalProcessed} optimized versions`);
    console.log(`   Duration: ${duration}s`);
    console.log(`   Output: ${path.resolve(config.output)}\n`);
}

// Run the script
main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});

import exifr from 'exifr';
import { generateAltTextFromEXIF, generateDescription, suggestTags } from './aiHelpers';

export interface ExifData {
    camera_make?: string;
    camera_model?: string;
    lens_model?: string;
    iso?: number;
    aperture?: string;
    shutter_speed?: string;
    focal_length?: string;
    capture_date?: Date;
}

export interface ExifDataWithAI extends ExifData {
    suggested_alt_text?: string;
    suggested_description?: string;
    suggested_tags?: string[];
}

/**
 * Extract EXIF metadata from an image file
 * @param file Image file to extract EXIF from
 * @returns ExifData object with camera settings and metadata
 */
export async function extractExifData(file: File): Promise<ExifData> {
    try {
        const exif = await exifr.parse(file, {
            tiff: true,
            exif: true,
            gps: false, // Disable GPS for privacy
        });

        if (!exif) {
            console.log('No EXIF data found in image');
            return {};
        }

        return {
            camera_make: exif.Make?.trim(),
            camera_model: exif.Model?.trim(),
            lens_model: exif.LensModel?.trim() || exif.Lens?.trim(),
            iso: exif.ISO || exif.ISOSpeedRatings,
            aperture: formatAperture(exif.FNumber || exif.ApertureValue),
            shutter_speed: formatShutterSpeed(exif.ExposureTime || exif.ShutterSpeedValue),
            focal_length: formatFocalLength(exif.FocalLength),
            capture_date: exif.DateTimeOriginal || exif.DateTime || exif.CreateDate,
        };
    } catch (error) {
        console.warn('Failed to extract EXIF data:', error);
        return {};
    }
}

/**
 * Format aperture value as f-number string
 */
function formatAperture(value?: number): string | undefined {
    if (!value) return undefined;
    return `f/${value.toFixed(1)}`;
}

/**
 * Format shutter speed for display
 */
function formatShutterSpeed(exposureTime?: number): string | undefined {
    if (!exposureTime) return undefined;

    if (exposureTime >= 1) {
        return `${exposureTime}s`;
    } else {
        const denominator = Math.round(1 / exposureTime);
        return `1/${denominator}s`;
    }
}

/**
 * Format focal length as millimeters
 */
function formatFocalLength(focalLength?: number): string | undefined {
    if (!focalLength) return undefined;
    return `${Math.round(focalLength)}mm`;
}

/**
 * Format date for input field (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string | undefined): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Format EXIF data as a readable text description
 * This creates a nicely formatted text with camera settings
 */
export function formatExifAsDescription(exifData: ExifData): string {
    const parts: string[] = [];

    // Camera info
    if (exifData.camera_make || exifData.camera_model) {
        const camera = [exifData.camera_make, exifData.camera_model]
            .filter(Boolean)
            .join(' ');
        parts.push(`📷 ${camera}`);
    }

    // Lens
    if (exifData.lens_model) {
        parts.push(`🔍 ${exifData.lens_model}`);
    }

    // Technical settings in one line
    const technical: string[] = [];
    if (exifData.focal_length) technical.push(exifData.focal_length);
    if (exifData.aperture) technical.push(exifData.aperture);
    if (exifData.shutter_speed) technical.push(exifData.shutter_speed);
    if (exifData.iso) technical.push(`ISO ${exifData.iso}`);

    if (technical.length > 0) {
        parts.push(`⚙️ ${technical.join(' • ')}`);
    }

    return parts.join('\n');
}

/**
 * Extract EXIF data with AI-powered suggestions
 * @param file Image file to extract EXIF from
 * @param title Optional title for context
 * @param category Optional category for context
 * @returns ExifDataWithAI object with camera settings and AI suggestions
 */
export async function extractExifDataWithAI(
    file: File,
    title?: string,
    category?: string
): Promise<ExifDataWithAI> {
    const exifData = await extractExifData(file);

    // Gerar sugestões de IA baseadas nos dados EXIF
    const suggested_alt_text = generateAltTextFromEXIF(exifData, title, category);
    const suggested_description = generateDescription(title || file.name, exifData, category);
    const suggested_tags = suggestTags(title || file.name, suggested_description, category, exifData);

    return {
        ...exifData,
        suggested_alt_text,
        suggested_description,
        suggested_tags,
    };
}

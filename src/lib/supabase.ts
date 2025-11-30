import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket names
export const PHOTOGRAPHY_BUCKET = 'photography';
export const DESIGN_BUCKET = 'design';
export const HERO_BUCKET = 'hero';

// TypeScript types
export interface PhotographyItem {
    id: string;
    title: string;
    category: 'portraits' | 'urban' | 'nature' | 'art' | 'events';
    url: string;
    description?: string;
    year?: number;
    event_name?: string;
    event_date?: string;
    tags?: string[];
    // EXIF metadata
    camera_make?: string;
    camera_model?: string;
    lens_model?: string;
    iso?: number;
    aperture?: string;
    shutter_speed?: string;
    focal_length?: string;
    capture_date?: string;
    created_at: string;
    updated_at?: string;
    likes_count?: number;
    comments_count?: number;
    shares_count?: number;
}

export interface DesignProject {
    id: string;
    title: string;
    category: 'branding' | 'editorial' | 'web' | 'illustration' | 'packaging';
    description: string;
    images: string[];
    client?: string;
    year?: number;
    link?: string;
    event_name?: string;
    event_date?: string;
    tags?: string[];
    created_at: string;
    updated_at?: string;
    likes_count?: number;
    comments_count?: number;
    shares_count?: number;
}

export interface HeroImage {
    id: string;
    created_at: string;
    url: string;
    title: string;
    active: boolean;
    page?: string;
}

// Helper function to upload image
export async function uploadImage(bucket: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}

// Helper function to delete image
export async function deleteImage(bucket: string, url: string): Promise<{ error: string | null }> {
    const fileName = url.split('/').pop()?.split('?')[0];
    if (!fileName) return { error: 'Invalid file URL' };

    const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

    return { error: error?.message || null };
}

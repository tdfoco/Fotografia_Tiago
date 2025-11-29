import { createClient } from '@supabase/supabase-js'

// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface PhotographyItem {
    id: string
    url: string
    category: 'portraits' | 'urban' | 'nature' | 'art' | 'events'
    title: string
    description: string
    year: number
    created_at: string
}

export interface DesignProject {
    id: string
    images: string[]
    category: 'logos' | 'visual_identity' | 'social_media' | 'posters' | 'special'
    title: string
    description: string
    year: number
    client?: string
    created_at: string
}

// Storage bucket names
export const PHOTOGRAPHY_BUCKET = 'photography'
export const DESIGN_BUCKET = 'design'

// Helper functions
export const uploadImage = async (bucket: string, file: File, path?: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = path || `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return publicUrl
}

export const deleteImage = async (bucket: string, url: string) => {
    const path = url.split(`/${bucket}/`)[1]
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

    if (error) throw error
}

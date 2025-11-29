-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_images
CREATE POLICY "Public can view active hero images" ON hero_images
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert hero images" ON hero_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hero images" ON hero_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete hero images" ON hero_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create hero storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero', 'hero', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hero bucket
CREATE POLICY "Public Access Hero" ON storage.objects
    FOR SELECT USING (bucket_id = 'hero');

CREATE POLICY "Auth Upload Hero" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'hero' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Auth Delete Hero" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'hero' AND 
        auth.role() = 'authenticated'
    );

# Supabase Setup Guide

This guide will help you set up Supabase for your hybrid photography + design portfolio.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Choose an organization (or create one)
4. Fill in project details:
   - **Name**: `tiago-portfolio` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your users
5. Click **"Create new project"** and wait ~2 minutes

## Step 2: Create Database Tables

1. Go to the **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Paste the following SQL and click **"Run"**:

```sql
-- Create photography table
CREATE TABLE photography (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('portraits', 'urban', 'nature', 'art', 'events')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create design_projects table
CREATE TABLE design_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  images TEXT[] NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('logos', 'visual_identity', 'social_media', 'posters', 'special')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  client TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Public can view photography"
  ON photography FOR SELECT
  USING (true);

CREATE POLICY "Public can view design projects"
  ON design_projects FOR SELECT
  USING (true);

-- Create policies to allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert photography"
  ON photography FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update photography"
  ON photography FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete photography"
  ON photography FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert design projects"
  ON design_projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update design projects"
  ON design_projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete design projects"
  ON design_projects FOR DELETE
  USING (auth.role() = 'authenticated');
```

## Step 3: Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Click **"Create a new bucket"**
3. Create the first bucket:
   - **Name**: `photography`
   - **Public bucket**: ✅ Yes (check this)
   - Click **"Create bucket"**
4. Create the second bucket:
   - **Name**: `design`
   - **Public bucket**: ✅ Yes (check this)
   - Click **"Create bucket"**

## Step 4: Create Admin User

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: Your admin email (e.g., `admin@tiago.com`)
   - **Password**: Create a strong password (you'll use this to login to /admin)
   - Leave **Auto Confirm User** checked
4. Click **"Create user"**

## Step 5: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Under **Project API keys**, you'll see:
   - **Project URL**: Copy this (starts with `https://xxx.supabase.co`)
   - **anon/public key**: Copy this (long string starting with `eyJ...`)

## Step 6: Configure Your Project

1. In your project folder, create a file named `.env` (copy from `.env.example`)
2. Paste your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 7: Start Your Development Server

```bash
npm run dev
```

Your portfolio should now be running! Visit:
- **Homepage**: `http://localhost:5173`
- **Admin Panel**: `http://localhost:5173/admin`

## Using the Admin Panel

1. Navigate to `/admin`
2. Login with the email and password you created in Step 4
3. You can now:
   - **Photography Tab**: Upload photos, select category, add title/description/year
   - **Design Tab**: Upload projects (multiple images), select category, add details
   - **Delete**: Remove any photo or project

## Storage Policies (Important!)

The storage buckets are public by default. If you need to restrict access:

1. Go to **Storage** → Select bucket → **Policies**
2. You can create custom policies for read/write access

## Troubleshooting

**Images not loading?**
- Make sure buckets are set to **public**
- Check that the storage policies allow public SELECT

**Can't login to admin?**
- Verify your admin user email/password in Supabase Authentication
- Check that `.env` file has correct credentials
- Make sure to restart dev server after changing `.env`

**Upload failing?**
- Check storage policies allow authenticated INSERT
- Verify file size isn't too large (default limit: 50MB)

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Build the project: `npm run build`
3. Deploy the `dist` folder

---

**Need help?** Check the [Supabase Documentation](https://supabase.com/docs)

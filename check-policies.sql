-- Script to check all existing policies and add missing DELETE permissions
-- Run this in your Supabase SQL Editor

-- First, let's see all existing policies for our tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('photography', 'design_projects', 'hero_images')
ORDER BY tablename, policyname;

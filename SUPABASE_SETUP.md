# Supabase Setup Guide for Casanova Food Menu App

This guide will help you set up Supabase for your food menu application.

## 1. Create a Supabase Account

1. Go to [https://supabase.com/](https://supabase.com/) and sign up for a free account.
2. Create a new project and note down your project URL and anon key.

## 2. Configure Environment Variables

1. Open the `.env` file in the root of your project.
2. Replace the placeholder values with your actual Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Create Database Tables

Run the following SQL in the Supabase SQL Editor to create the necessary tables:

```sql
-- Create categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  is_popular BOOLEAN DEFAULT false,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access to categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow anonymous read access to menu_items"
  ON menu_items FOR SELECT
  USING (true);

-- Allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated insert to categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete from categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert to menu_items"
  ON menu_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update to menu_items"
  ON menu_items FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete from menu_items"
  ON menu_items FOR DELETE
  USING (auth.role() = 'authenticated');
```

## 4. Seed Initial Data

Run the following SQL to seed your database with initial categories:

```sql
-- Insert default categories
INSERT INTO categories (id, name, "order") VALUES
  ('plats', 'Plats', 1),
  ('sandwichs', 'Sandwichs', 2),
  ('boissons', 'Eaux & Boissons', 3),
  ('desserts', 'Desserts', 4);
```

## 5. Create an Admin User

1. Go to the Authentication section in your Supabase dashboard.
2. Click on "Users" and then "Add User".
3. Enter an email and password for your admin user.
4. Alternatively, you can enable email/password sign-up in your app and create a user through the app.

## 6. Enable Realtime

1. Go to the Database section in your Supabase dashboard.
2. Click on "Replication" in the sidebar.
3. Enable realtime for both the `categories` and `menu_items` tables.

## 7. Storage Setup (Optional)

If you want to upload images directly to Supabase:

1. Go to the Storage section in your Supabase dashboard.
2. Create a new bucket called `menu-images`.
3. Set the bucket's privacy to "Public".
4. Add the following policy to allow authenticated users to upload files:

```sql
CREATE POLICY "Allow authenticated uploads to menu-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id = 'menu-images'
  );
```

## 8. Restart Your Application

After completing all the steps above, restart your application to apply the changes:

```
npm run dev
```

Your food menu app should now be connected to Supabase for online data storage and synchronization!

# Database Update Required

The admin panel isn't working because the database schema needs to be updated. Please follow these steps:

## Option 1: Update via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Run these SQL commands:

```sql
-- Disable Row Level Security to allow admin operations
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Remove the model_url column if it still exists
ALTER TABLE products DROP COLUMN IF EXISTS model_url;
```

## Option 2: Re-run the entire schema

1. Go to "SQL Editor" in Supabase dashboard
2. Delete all existing data (if you want to start fresh):
```sql
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
```

3. Copy and paste the entire content from `supabase-schema.sql` file and run it

## After running the SQL commands:

The admin panel should work correctly and allow you to:
- Create new products
- Edit existing products  
- Manage product images and colors
- View contact submissions

Note: In production, you would want to re-enable RLS with proper authentication policies.
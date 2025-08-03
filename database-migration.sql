-- Database migration to remove technical specifications and add customizable feature
-- Run this in Supabase SQL Editor

-- First, add the customizable column if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS customizable INTEGER DEFAULT 0 CHECK (customizable IN (0, 1));

-- Remove technical specification columns
ALTER TABLE products DROP COLUMN IF EXISTS material;
ALTER TABLE products DROP COLUMN IF EXISTS dimensions;
ALTER TABLE products DROP COLUMN IF EXISTS weight;
ALTER TABLE products DROP COLUMN IF EXISTS print_time;

-- Add custom_name column to order_items if it doesn't exist
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS custom_name TEXT;

-- Update some existing products to be customizable (keychains, nameplates, etc.)
UPDATE products SET customizable = 1 WHERE name ILIKE '%keychain%' OR name ILIKE '%nameplate%' OR name ILIKE '%custom%' OR name ILIKE '%personalized%';

-- Add some sample customizable products if they don't exist
INSERT INTO products (name, description, price, sale_price, category, colors, images, featured, customizable) 
SELECT * FROM (VALUES 
  ('Personalized Keychain', 'Custom license plate style keychain with your name or text. Perfect for gifts, promotional items, or personal use.', 899.00, 799.00, 'functional', ARRAY['White', 'Black', 'Blue', 'Red', 'Green', 'Yellow'], ARRAY['https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 1, 1),
  ('Custom Name Plate', 'Personalized nameplate for desk, door, or office. Add your name, title, or custom message.', 1299.00, 999.00, 'functional', ARRAY['White', 'Black', 'Blue', 'Gold', 'Silver'], ARRAY['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0, 1)
) AS new_products(name, description, price, sale_price, category, colors, images, featured, customizable)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.name = new_products.name
);

-- Verify the changes
SELECT name, customizable FROM products WHERE customizable = 1;
-- ============================================================================
-- COMPLETE DATABASE SCHEMA FOR 3D PRINTING SHOWCASE WEBSITE
-- ============================================================================
-- 
-- INSTRUCTIONS FOR EXECUTION:
-- 1. Copy the entire content of this file
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run the complete script
-- 4. This will create all necessary tables and sample data
-- 
-- TABLES CREATED:
-- - products: Main product catalog with customizable field
-- - contacts: Contact form submissions
-- - orders: Customer orders with coupon support
-- - order_items: Individual items in orders with custom names
-- - site_settings: Admin configuration settings
-- - reviews: Customer reviews with product_purchased field
-- - users: Admin authentication
-- - banners: Promotional banners system
-- - coupons: Discount codes and promotional coupons
-- - custom_sections: Enhanced category management
-- - section_products: Product-to-section relationships
-- 
-- FIXES APPLIED:
-- ✅ Added missing product_purchased field to reviews table
-- ✅ Added all promotional and coupon functionality
-- ✅ Added custom sections for enhanced category management
-- ✅ Updated orders table with discount and coupon support
-- ✅ Disabled Row Level Security for simplified admin operations
-- ============================================================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2), -- Sale price (optional)
  category TEXT NOT NULL CHECK (category IN ('functional', 'artistic', 'prototypes')),
  colors TEXT[] NOT NULL DEFAULT '{}',
  disabled_colors TEXT[] NOT NULL DEFAULT '{}', -- Colors that are out of stock
  images TEXT[] NOT NULL DEFAULT '{}',
  featured INTEGER DEFAULT 0 CHECK (featured IN (0, 1, 2)),
  customizable INTEGER DEFAULT 0 CHECK (customizable IN (0, 1)), -- 0 = not customizable, 1 = customizable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products with sale prices (some customizable)
INSERT INTO products (name, description, price, sale_price, category, colors, images, featured, customizable) VALUES
('Geometric Lattice Vase', 'Modern decorative vase with intricate geometric patterns that create beautiful shadow play when lit. Perfect for both functional use and decorative display.', 3500.00, 2999.00, 'artistic', ARRAY['White', 'Black', 'Blue', 'Red'], ARRAY['https://pixabay.com/get/g91df56c451c16430f30821c54b2eebab574cb7f869eec3915326c0f78e0320f27d3bb7e65df398bd69a3e9d059314764a2f97e92f96d1d36c6844b4c58158f9b_1280.jpg', 'https://images.unsplash.com/photo-1583692647055-5d3e37d6b36a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 1, 0),

('Ergonomic Phone Stand', 'Adjustable stand for optimal viewing angles with sleek modern design that complements any workspace.', 1999.00, 1499.00, 'functional', ARRAY['Black', 'White', 'Gray'], ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', 'https://images.unsplash.com/photo-1583692647055-5d3e37d6b36a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0, 0),

('Flow Sculpture', 'Abstract art piece with organic flowing forms that captures movement in static material.', 6500.00, NULL, 'artistic', ARRAY['White', 'Gold', 'Silver'], ARRAY['https://pixabay.com/get/g7eb5694e2468ac83eb39631519459ee81a0fbd0bc6aeccddc9aa475dd614d79ac6d93a42a7e6ed9993ee0c180dcc128a3c17630a1eac2d7b25c455d9bca72270_1280.jpg'], 0, 0),

('Modular Desk Organizer', 'Customizable compartments for office supplies with modular design that adapts to your needs.', 2800.00, 2299.00, 'functional', ARRAY['Black', 'White', 'Blue', 'Green'], ARRAY['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 2, 0),

('Custom Figurine', 'Highly detailed collectible figurine with intricate features and premium finish.', 4999.00, 3999.00, 'artistic', ARRAY['Natural', 'Painted'], ARRAY['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0, 0),

('Personalized Keychain', 'Custom license plate style keychain with your name or text. Perfect for gifts, promotional items, or personal use.', 899.00, 799.00, 'functional', ARRAY['White', 'Black', 'Blue', 'Red', 'Green', 'Yellow'], ARRAY['https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 1, 1),

('Geometric Lamp Shade', 'Modern lighting with unique shadow patterns that transform any space with ambient lighting.', 4200.00, NULL, 'functional', ARRAY['White', 'Black', 'Translucent'], ARRAY['https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0, 0),

('Architectural Model', 'Precise scale model for presentations with detailed structural elements and professional finish.', 9200.00, 7999.00, 'prototypes', ARRAY['White', 'Gray'], ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0, 0),

('Custom Name Plate', 'Personalized nameplate for desk, door, or office. Add your name, title, or custom message.', 1299.00, 999.00, 'functional', ARRAY['White', 'Black', 'Blue', 'Gold', 'Silver'], ARRAY['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0, 1);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  coupon_code TEXT, -- Applied coupon code
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'upi')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'cancelled')),
  order_status TEXT NOT NULL DEFAULT 'placed' CHECK (order_status IN ('placed', 'confirmed', 'ready', 'completed', 'cancelled')),
  shipping_address TEXT NOT NULL DEFAULT 'Pickup from A Level Classroom at Don Bosco International School',
  notes TEXT,
  email_sent_placed BOOLEAN DEFAULT FALSE, -- Tracks if "Order Placed" email was sent
  email_sent_confirmed BOOLEAN DEFAULT FALSE, -- Tracks if "Order Confirmed" email was sent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  selected_color TEXT NOT NULL,
  custom_name TEXT, -- For customizable products
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table for admin configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('upi_qr_code', 'https://via.placeholder.com/300x300/000000/FFFFFF?text=QR+CODE'),
('categories', '["functional", "artistic", "prototypes"]'),
('currency_symbol', '₹'),
('order_confirmation_hours', '24');

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  product_purchased TEXT, -- Which product they bought
  profile_picture_url TEXT, -- Optional profile picture
  is_approved BOOLEAN DEFAULT FALSE, -- Admin approval required
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample approved reviews
INSERT INTO reviews (customer_name, customer_email, rating, review_text, product_purchased, profile_picture_url, is_approved) VALUES
('Arjun Sharma', 'arjun@example.com', 5, 'Amazing quality! The geometric vase I ordered exceeded my expectations. The detail and finish are incredible.', 'Geometric Lattice Vase', NULL, TRUE),
('Priya Patel', 'priya@example.com', 5, 'Love my custom phone stand! Perfect for video calls and the design is so sleek. Will definitely order again.', 'Ergonomic Phone Stand', NULL, TRUE),
('Rahul Kumar', 'rahul@example.com', 4, 'Great work on the desk organizer. Really helps keep my workspace tidy. Fast delivery too!', 'Modular Desk Organizer', NULL, TRUE),
('Sneha Gupta', 'sneha@example.com', 5, 'The architectural model was exactly what we needed for our presentation. Highly professional quality.', 'Architectural Model', NULL, TRUE);

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotional banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT, -- Optional button text
  button_link TEXT, -- Optional button link
  background_color TEXT NOT NULL DEFAULT '#3B82F6', -- Hex color
  text_color TEXT NOT NULL DEFAULT '#FFFFFF', -- Hex color
  is_active INTEGER NOT NULL DEFAULT 1, -- 0 = inactive, 1 = active
  priority INTEGER NOT NULL DEFAULT 0, -- Higher number = higher priority
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE, -- Optional end date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')), -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2), -- Optional minimum order
  max_uses INTEGER, -- Optional usage limit
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1, -- 0 = inactive, 1 = active
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE, -- Optional end date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample coupon data
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES
('WELCOME10', '10% off for new customers', 'percentage', 10.00, 1000.00, 100, 1),
('SAVE50', '₹50 off on orders above ₹2000', 'fixed', 50.00, 2000.00, 50, 1),
('STUDENT20', '20% student discount', 'percentage', 20.00, 500.00, NULL, 1);

-- Insert sample banner data
INSERT INTO banners (title, description, button_text, button_link, background_color, text_color, is_active, priority) VALUES
('New Year Special!', 'Get 20% off on all 3D printed items', 'Shop Now', '/products', '#E11D48', '#FFFFFF', 1, 10),
('Custom Keychains Available', 'Personalize your keychains with custom text', 'Customize', '/products?category=functional', '#059669', '#FFFFFF', 1, 5);

-- Create custom_sections table for enhanced category management
CREATE TABLE IF NOT EXISTS custom_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1, -- 0 = inactive, 1 = active
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create section_products table for linking products to custom sections
CREATE TABLE IF NOT EXISTS section_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES custom_sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, product_id) -- Prevent duplicate product assignments
);

-- Insert sample custom sections
INSERT INTO custom_sections (name, slug, description, is_active, display_order) VALUES
('Featured Items', 'featured', 'Our most popular and recommended products', 1, 10),
('New Arrivals', 'new-arrivals', 'Latest additions to our 3D printing catalog', 1, 20),
('Custom Products', 'custom', 'Personalized items that can be customized with your text', 1, 30);

-- Disable Row Level Security for simplified admin functionality
-- (In production, you would want proper RLS with authentication)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE custom_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_products DISABLE ROW LEVEL SECURITY;
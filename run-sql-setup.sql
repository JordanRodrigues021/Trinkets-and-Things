-- Promotional Banner and Coupon System Setup for Supabase
-- Run this script in your Supabase SQL Editor

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  background_color TEXT NOT NULL DEFAULT '#3B82F6',
  text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  is_active INTEGER NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Update orders table to include coupon information
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- Update existing orders with subtotal data
UPDATE orders SET subtotal_amount = total_amount, discount_amount = 0.00 WHERE subtotal_amount IS NULL;

-- Insert sample promotional banner for Diwali
INSERT INTO banners (title, description, button_text, button_link, background_color, text_color, priority)
VALUES 
('🪔 Diwali Special Sale! 🪔', 'Get 25% off on all 3D printed items! Perfect for Diwali decorations and gifts.', 'Shop Diwali Collection', '#products', '#8B5CF6', '#FFFFFF', 100)
ON CONFLICT (id) DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, max_uses)
VALUES 
('DIWALI25', '25% off for Diwali celebration', 'percentage', 25.00, 100),
('SAVE50', 'Flat ₹50 off on orders above ₹200', 'fixed', 50.00, 50)
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security (optional - can be disabled for simpler admin management)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to active banners" ON banners FOR SELECT USING (is_active = 1);
CREATE POLICY "Allow public read access to active coupons" ON coupons FOR SELECT USING (is_active = 1);

-- Allow authenticated users to manage banners and coupons (for admin panel)
CREATE POLICY "Allow authenticated users to manage banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage coupons" ON coupons FOR ALL USING (auth.role() = 'authenticated');

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  product_purchased TEXT,
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Grant necessary permissions
GRANT ALL ON banners TO authenticated;
GRANT ALL ON coupons TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT SELECT ON banners TO anon;
GRANT SELECT ON coupons TO anon;
GRANT SELECT ON reviews TO anon;

-- Enable Row Level Security for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Allow public read access to approved reviews" ON reviews FOR SELECT USING (is_approved = 1);
CREATE POLICY "Allow public insert for new reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');

-- Create custom sections table
CREATE TABLE IF NOT EXISTS custom_sections (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create section products junction table
CREATE TABLE IF NOT EXISTS section_products (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (section_id) REFERENCES custom_sections(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(section_id, product_id)
);

-- Grant permissions for custom sections
GRANT ALL ON custom_sections TO authenticated;
GRANT ALL ON section_products TO authenticated;
GRANT SELECT ON custom_sections TO anon;
GRANT SELECT ON section_products TO anon;

-- Enable RLS for custom sections
ALTER TABLE custom_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_products ENABLE ROW LEVEL SECURITY;

-- Create policies for custom sections
CREATE POLICY "Allow public read access to active sections" ON custom_sections FOR SELECT USING (is_active = 1);
CREATE POLICY "Allow authenticated users to manage sections" ON custom_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow public read access to section products" ON section_products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage section products" ON section_products FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample custom sections
INSERT INTO custom_sections (name, slug, description, display_order)
VALUES 
('Featured Products', 'featured', 'Our handpicked selection of premium 3D printed items', 1),
('New Arrivals', 'new-arrivals', 'Latest additions to our 3D printing collection', 2),
('Best Sellers', 'best-sellers', 'Most popular items loved by our customers', 3)
ON CONFLICT (slug) DO NOTHING;
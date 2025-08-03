import { supabase } from './supabase';

export async function setupDatabase() {
  try {
    // Check if critical fields exist by testing them
    const { error: reviewFieldError } = await supabase
      .from('reviews')
      .select('product_purchased')
      .limit(1);

    const { error: bannerCheckError } = await supabase
      .from('banners')
      .select('id')
      .limit(1);

    const { error: customSectionError } = await supabase
      .from('custom_sections')
      .select('id')
      .limit(1);

    // If all queries succeed, database is fully set up
    if (!reviewFieldError && !bannerCheckError && !customSectionError) {
      console.log('✅ Database is fully configured');
      return { success: true, message: 'Database is fully configured' };
    }

    // Missing database components detected
    console.log('❌ Database missing some required components');
    
    return {
      success: false,
      message: 'Missing database components detected. Please run the SQL commands below.',
      sqlCommands: `-- ============================================================================
-- MISSING DATABASE COMPONENTS - ADD ONLY WHAT'S NEEDED
-- ============================================================================

-- 1. Add missing product_purchased field to reviews table (if missing)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS product_purchased TEXT;

-- 2. Create custom_sections table for enhanced category management (if missing)
CREATE TABLE IF NOT EXISTS custom_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create section_products table for linking products to sections (if missing)
CREATE TABLE IF NOT EXISTS section_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES custom_sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, product_id)
);

-- 4. Create banners table for promotional banners (if missing)
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  background_color TEXT NOT NULL DEFAULT '#3B82F6',
  text_color TEXT NOT NULL DEFAULT '#FFFFFF',
  is_active INTEGER NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create coupons table for discount codes (if missing)
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Add missing coupon fields to orders table (if missing)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- 7. Update existing orders to have subtotal amounts (only if needed)
UPDATE orders SET subtotal_amount = total_amount WHERE subtotal_amount IS NULL;
UPDATE orders SET discount_amount = 0.00 WHERE discount_amount IS NULL;

-- 8. Disable RLS for new tables (if they exist)
ALTER TABLE custom_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE section_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;

-- 9. Insert sample data for new features (optional)
INSERT INTO custom_sections (name, slug, description, display_order) VALUES
('Featured Items', 'featured', 'Our most popular products', 10),
('New Arrivals', 'new-arrivals', 'Latest additions', 20)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO banners (title, description, button_text, button_link, background_color, text_color, priority) VALUES
('New Year Special!', 'Get 20% off on all 3D printed items', 'Shop Now', '/products', '#E11D48', '#FFFFFF', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO coupons (code, description, discount_type, discount_value, max_uses) VALUES
('WELCOME10', '10% off for new customers', 'percentage', 10.00, 100),
('SAVE50', '₹50 off on orders above ₹2000', 'fixed', 50.00, 50)
ON CONFLICT (code) DO NOTHING;
`
    };

  } catch (error: any) {
    console.error('Database setup error:', error);
    return {
      success: false,
      message: 'Failed to check database status',
      error: error.message
    };
  }
}

export async function createSampleData() {
  try {
    // Create sample banner
    const { error: bannerError } = await supabase
      .from('banners')
      .upsert({
        id: '550e8400-e29b-41d4-a716-446655440000', // Fixed UUID for consistency
        title: '🪔 Diwali Special Sale! 🪔',
        description: 'Get 25% off on all 3D printed items! Perfect for Diwali decorations and gifts.',
        button_text: 'Shop Diwali Collection',
        button_link: '#products',
        background_color: '#8B5CF6',
        text_color: '#FFFFFF',
        priority: 100
      });

    if (bannerError && bannerError.code !== '42P01') {
      console.error('Banner creation error:', bannerError);
    }

    // Create sample coupons
    const { error: coupon1Error } = await supabase
      .from('coupons')
      .upsert({
        id: '550e8400-e29b-41d4-a716-446655440001',
        code: 'DIWALI25',
        description: '25% off for Diwali celebration',
        discount_type: 'percentage',
        discount_value: '25.00',
        max_uses: 100
      });

    if (coupon1Error && coupon1Error.code !== '42P01') {
      console.error('Coupon 1 creation error:', coupon1Error);
    }

    const { error: coupon2Error } = await supabase
      .from('coupons')
      .upsert({
        id: '550e8400-e29b-41d4-a716-446655440002',
        code: 'SAVE50',
        description: 'Flat ₹50 off on orders above ₹200',
        discount_type: 'fixed',
        discount_value: '50.00',
        min_order_amount: '200.00',
        max_uses: 50
      });

    if (coupon2Error && coupon2Error.code !== '42P01') {
      console.error('Coupon 2 creation error:', coupon2Error);
    }

    return { success: true, message: 'Sample data created successfully' };
  } catch (error: any) {
    console.error('Sample data creation error:', error);
    return { success: false, message: 'Failed to create sample data', error: error.message };
  }
}
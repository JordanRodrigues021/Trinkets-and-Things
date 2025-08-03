import { supabase } from './supabase';

export async function setupDatabase() {
  try {
    // First try to check if tables exist by querying them
    const { error: bannerCheckError } = await supabase
      .from('banners')
      .select('id')
      .limit(1);

    const { error: couponCheckError } = await supabase
      .from('coupons')
      .select('id')
      .limit(1);

    // If both queries succeed, tables exist
    if (!bannerCheckError && !couponCheckError) {
      console.log('✅ Database tables already exist');
      return { success: true, message: 'Database tables already exist' };
    }

    // Tables don't exist, we need to create them via SQL
    console.log('❌ Database tables need to be created');
    
    return {
      success: false,
      message: 'Database tables need to be created. Please run the SQL commands in your Supabase dashboard.',
      sqlCommands: `
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

-- Update existing orders
UPDATE orders SET subtotal_amount = total_amount, discount_amount = 0.00 WHERE subtotal_amount IS NULL;

-- Insert sample promotional banner
INSERT INTO banners (title, description, button_text, button_link, background_color, text_color, priority)
VALUES 
('🪔 Diwali Special Sale! 🪔', 'Get 25% off on all 3D printed items! Perfect for Diwali decorations and gifts.', 'Shop Diwali Collection', '#products', '#8B5CF6', '#FFFFFF', 100);

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, max_uses)
VALUES 
('DIWALI25', '25% off for Diwali celebration', 'percentage', 25.00, 100),
('SAVE50', 'Flat ₹50 off on orders above ₹200', 'fixed', 50.00, 50);
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
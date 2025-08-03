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

-- Update the total_amount calculation logic will be handled in the application
UPDATE orders SET subtotal_amount = total_amount, discount_amount = 0.00 WHERE subtotal_amount IS NULL;

-- Create sample banner for testing
INSERT INTO banners (title, description, button_text, button_link, background_color, text_color, priority)
VALUES 
('🪔 Diwali Special Sale! 🪔', 'Get 25% off on all 3D printed items! Perfect for Diwali decorations and gifts.', 'Shop Diwali Collection', '#products', '#8B5CF6', '#FFFFFF', 100)
ON CONFLICT (id) DO NOTHING;

-- Create sample coupon for testing
INSERT INTO coupons (code, description, discount_type, discount_value, max_uses)
VALUES 
('DIWALI25', '25% off for Diwali celebration', 'percentage', 25.00, 100),
('SAVE50', 'Flat ₹50 off on orders above ₹200', 'fixed', 50.00, 50)
ON CONFLICT (code) DO NOTHING;
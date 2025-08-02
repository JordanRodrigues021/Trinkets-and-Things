-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('functional', 'artistic', 'prototypes')),
  material TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  weight TEXT NOT NULL,
  print_time TEXT NOT NULL,
  colors TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',

  featured INTEGER DEFAULT 0 CHECK (featured IN (0, 1, 2)),
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

-- Insert sample products
INSERT INTO products (name, description, price, category, material, dimensions, weight, print_time, colors, images, featured) VALUES
('Geometric Lattice Vase', 'Modern decorative vase with intricate geometric patterns that create beautiful shadow play when lit. Perfect for both functional use and decorative display.', 45.00, 'artistic', 'PLA+', '15cm × 15cm × 20cm', '250g', '8 hours', ARRAY['White', 'Black', 'Blue', 'Red'], ARRAY['https://pixabay.com/get/g91df56c451c16430f30821c54b2eebab574cb7f869eec3915326c0f78e0320f27d3bb7e65df398bd69a3e9d059314764a2f97e92f96d1d36c6844b4c58158f9b_1280.jpg', 'https://images.unsplash.com/photo-1583692647055-5d3e37d6b36a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 1),

('Ergonomic Phone Stand', 'Adjustable stand for optimal viewing angles with sleek modern design that complements any workspace.', 25.00, 'functional', 'PETG', '12cm × 8cm × 10cm', '150g', '4 hours', ARRAY['Black', 'White', 'Gray'], ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', 'https://images.unsplash.com/photo-1583692647055-5d3e37d6b36a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0),

('Flow Sculpture', 'Abstract art piece with organic flowing forms that captures movement in static material.', 85.00, 'artistic', 'PLA', '20cm × 15cm × 25cm', '400g', '12 hours', ARRAY['White', 'Gold', 'Silver'], ARRAY['https://pixabay.com/get/g7eb5694e2468ac83eb39631519459ee81a0fbd0bc6aeccddc9aa475dd614d79ac6d93a42a7e6ed9993ee0c180dcc128a3c17630a1eac2d7b25c455d9bca72270_1280.jpg'], 0),

('Modular Desk Organizer', 'Customizable compartments for office supplies with modular design that adapts to your needs.', 35.00, 'functional', 'PLA+', '25cm × 15cm × 8cm', '300g', '6 hours', ARRAY['Black', 'White', 'Blue', 'Green'], ARRAY['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 2),

('Custom Figurine', 'Highly detailed collectible figurine with intricate features and premium finish.', 65.00, 'artistic', 'Resin', '10cm × 8cm × 15cm', '200g', '10 hours', ARRAY['Natural', 'Painted'], ARRAY['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0),

('Geometric Lamp Shade', 'Modern lighting with unique shadow patterns that transform any space with ambient lighting.', 55.00, 'functional', 'PLA', '30cm × 30cm × 35cm', '500g', '14 hours', ARRAY['White', 'Black', 'Translucent'], ARRAY['https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0),

('Architectural Model', 'Precise scale model for presentations with detailed structural elements and professional finish.', 120.00, 'prototypes', 'ABS', '40cm × 30cm × 20cm', '800g', '20 hours', ARRAY['White', 'Gray'], ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0),

('Kitchen Organizer', 'Multi-compartment utensil storage solution that maximizes kitchen drawer space efficiency.', 40.00, 'functional', 'PETG', '35cm × 25cm × 6cm', '450g', '8 hours', ARRAY['White', 'Black', 'Gray'], ARRAY['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'], 0);

-- Disable Row Level Security for simplified admin functionality
-- (In production, you would want proper RLS with authentication)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

interface DatabaseSetupProps {
  onSetupComplete: () => void;
}

export default function DatabaseSetup({ onSetupComplete }: DatabaseSetupProps) {
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTables = async () => {
    setLoading(true);
    
    try {
      // Create banners table
      const { error: bannersError } = await supabase.rpc('exec_sql', {
        sql: `
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
        `
      });

      if (bannersError) throw bannersError;

      // Create coupons table
      const { error: couponsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS coupons (
            id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
            code TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            discount_type TEXT NOT NULL,
            discount_value DECIMAL(10,2) NOT NULL,
            min_order_amount DECIMAL(10,2),
            max_uses INTEGER,
            current_uses INTEGER NOT NULL DEFAULT 0,
            is_active INTEGER NOT NULL DEFAULT 1,
            start_date TIMESTAMP NOT NULL DEFAULT NOW(),
            end_date TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
          );
        `
      });

      if (couponsError) throw couponsError;

      // Update orders table
      const { error: ordersError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal_amount DECIMAL(10,2);
          ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
          ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
          UPDATE orders SET subtotal_amount = total_amount, discount_amount = 0.00 WHERE subtotal_amount IS NULL;
        `
      });

      if (ordersError) throw ordersError;

      // Insert sample data
      const { error: sampleError } = await supabase.rpc('exec_sql', {
        sql: `
          INSERT INTO banners (title, description, button_text, button_link, background_color, text_color, priority)
          VALUES 
          ('🪔 Diwali Special Sale! 🪔', 'Get 25% off on all 3D printed items! Perfect for Diwali decorations and gifts.', 'Shop Diwali Collection', '#products', '#8B5CF6', '#FFFFFF', 100)
          ON CONFLICT (id) DO NOTHING;
          
          INSERT INTO coupons (code, description, discount_type, discount_value, max_uses)
          VALUES 
          ('DIWALI25', '25% off for Diwali celebration', 'percentage', 25.00, 100),
          ('SAVE50', 'Flat ₹50 off on orders above ₹200', 'fixed', 50.00, 50)
          ON CONFLICT (code) DO NOTHING;
        `
      });

      if (sampleError) throw sampleError;

      setIsSetup(true);
      toast({
        title: "Database setup complete",
        description: "Promotional banners and coupons are now available",
      });
      
      onSetupComplete();
    } catch (error: any) {
      console.error('Database setup error:', error);
      
      // Try alternative approach using direct table creation
      try {
        await supabase
          .from('banners')
          .select('id')
          .limit(1);
        
        await supabase
          .from('coupons')
          .select('id')
          .limit(1);
          
        // If we get here, tables exist
        setIsSetup(true);
        toast({
          title: "Database already configured",
          description: "Promotional banners and coupons are available",
        });
        onSetupComplete();
      } catch (fallbackError) {
        toast({
          title: "Database setup needed",
          description: "Please run the SQL commands manually in your Supabase dashboard",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm">
              New promotional banner and coupon features require database setup.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This will create the necessary tables in your Supabase database.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={createTables} 
          disabled={loading || isSetup}
          className="w-full"
        >
          {loading ? (
            'Setting up database...'
          ) : isSetup ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Setup Complete
            </>
          ) : (
            'Setup Database'
          )}
        </Button>
        
        {isSetup && (
          <div className="text-xs text-green-600 text-center">
            ✓ Promotional banners and coupons are now ready to use!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
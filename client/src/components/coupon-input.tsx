import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Tag, X, Copy, Check } from 'lucide-react';
import type { Database } from '@/types/database';

type Coupon = Database['public']['Tables']['coupons']['Row'];

interface CouponInputProps {
  orderTotal: number;
  onCouponApplied: (coupon: Coupon, discountAmount: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: Coupon | null;
}

export default function CouponInput({ 
  orderTotal, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon 
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const validateAndApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter coupon code",
        description: "Please enter a coupon code to apply",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Fetch coupon details
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', 1)
        .single();

      if (error || !coupon) {
        if (error?.code === '42P01') {
          toast({
            title: "Coupon system not available",
            description: "The coupon system is not yet set up. Please contact support.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Invalid coupon code",
            description: "The coupon code you entered is not valid",
            variant: "destructive",
          });
        }
        return;
      }

      // Check if coupon is expired
      if (coupon.end_date && new Date(coupon.end_date) < new Date()) {
        toast({
          title: "Coupon expired",
          description: "This coupon has expired",
          variant: "destructive",
        });
        return;
      }

      // Check if coupon hasn't started yet
      if (new Date(coupon.start_date) > new Date()) {
        toast({
          title: "Coupon not yet active",
          description: "This coupon is not yet active",
          variant: "destructive",
        });
        return;
      }

      // Check usage limits
      if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        toast({
          title: "Coupon usage limit reached",
          description: "This coupon has reached its usage limit",
          variant: "destructive",
        });
        return;
      }

      // Check minimum order amount
      if (coupon.min_order_amount && orderTotal < parseFloat(coupon.min_order_amount)) {
        toast({
          title: "Minimum order not met",
          description: `This coupon requires a minimum order of ₹${coupon.min_order_amount}`,
          variant: "destructive",
        });
        return;
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (orderTotal * parseFloat(coupon.discount_value)) / 100;
      } else {
        discountAmount = parseFloat(coupon.discount_value);
      }

      // Ensure discount doesn't exceed order total
      discountAmount = Math.min(discountAmount, orderTotal);

      onCouponApplied(coupon, discountAmount);
      setCouponCode('');
      
      toast({
        title: "Coupon applied!",
        description: `You saved ₹${discountAmount.toFixed(2)} with code ${coupon.code}`,
      });

    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error applying coupon",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemoved();
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order",
    });
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: `Coupon code ${code} copied to clipboard`,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <Label className="text-sm font-medium">Have a coupon code?</Label>
          </div>

          {!appliedCoupon ? (
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && validateAndApplyCoupon()}
              />
              <Button 
                onClick={validateAndApplyCoupon}
                disabled={loading || !couponCode.trim()}
                size="sm"
              >
                {loading ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {appliedCoupon.code}
                  </Badge>
                  <span className="text-sm text-green-700 dark:text-green-300">
                    {appliedCoupon.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => copyCouponCode(appliedCoupon.code)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                  <Button
                    onClick={removeCoupon}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
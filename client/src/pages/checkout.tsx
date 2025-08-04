import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { supabase } from '@/lib/supabase';
import { sendOrderEmail, formatCartItemsForEmail, calculateCartTotal } from '@/lib/email-service';
import { ArrowLeft, CreditCard, Truck, QrCode } from 'lucide-react';
import PriceDisplay from '@/components/price-display';
import CouponInput from '@/components/coupon-input';
import type { Database } from '@/types/database';

type Coupon = Database['public']['Tables']['coupons']['Row'];

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number'),
  paymentMethod: z.enum(['cash', 'upi']),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [upiQrCode, setUpiQrCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      paymentMethod: 'cash',
      notes: '',
    },
  });

  // Load UPI QR code on mount
  useState(() => {
    const loadUpiQrCode = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'upi_qr_code')
          .single();
        
        if (data) {
          setUpiQrCode(data.setting_value);
        }
      } catch (error) {
        console.error('Error loading UPI QR code:', error);
      }
    };
    loadUpiQrCode();
  });

  const handleCouponApplied = (coupon: Coupon, discount: number) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const subtotalAmount = getTotalPrice();
  const finalTotalAmount = subtotalAmount - discountAmount;

  const onSubmit = async (data: CheckoutForm) => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const subtotalAmount = getTotalPrice();
      const finalTotalAmount = subtotalAmount - discountAmount;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone,
          subtotal_amount: subtotalAmount.toString(),
          discount_amount: discountAmount.toString(),
          total_amount: finalTotalAmount.toString(),
          coupon_code: appliedCoupon?.code || null,
          payment_method: data.paymentMethod,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        product_price: (item.salePrice || item.price).toString(),
        selected_color: item.selectedColor,
        custom_name: item.customName || null,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update coupon usage count if coupon was applied
      if (appliedCoupon) {
        await supabase
          .from('coupons')
          .update({ 
            current_uses: appliedCoupon.current_uses + 1 
          })
          .eq('id', appliedCoupon.id);
      }

      // Send email notification to customer
      try {
        const emailSuccess = await sendOrderEmail({
          to_email: data.customerEmail,
          customer_name: data.customerName,
          order_id: order.id,
          order_items: formatCartItemsForEmail(cart.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.salePrice || item.price
          }))),
          order_total: finalTotalAmount.toString(),
          order_status: 'placed'
        });

        if (emailSuccess) {
          toast({
            title: "Order confirmation sent!",
            description: "Check your email for order details.",
            duration: 3000,
          });
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Continue with order completion even if email fails
      }

      // Send WhatsApp notification to owner
      try {
        console.log('🔔 Preparing WhatsApp notification...');
        const orderDetails = {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          total: finalTotalAmount.toFixed(2),
          items: cart.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            price: (item.salePrice || item.price).toFixed(2)
          })),
          shippingAddress: data.customerName, // You can enhance this with actual address fields
          paymentMethod: data.paymentMethod,
          orderId: order.id
        };

        console.log('📱 Sending WhatsApp notification for order:', order.id);
        console.log('Order details:', orderDetails);

        const whatsappResponse = await fetch('/.netlify/functions/send-whatsapp-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderDetails })
        });

        console.log('WhatsApp response status:', whatsappResponse.status);
        const whatsappResult = await whatsappResponse.json();
        console.log('WhatsApp response data:', whatsappResult);

        if (whatsappResponse.ok) {
          console.log('✅ WhatsApp notification sent successfully!');
          toast({
            title: "WhatsApp notification sent!",
            description: "You'll receive an order notification on WhatsApp shortly.",
            duration: 3000,
          });
        } else {
          console.error('❌ WhatsApp notification failed:', whatsappResult);
          if (whatsappResult.missing && whatsappResult.missing.length > 0) {
            console.warn('⚠️ WhatsApp setup incomplete. Missing environment variables:', whatsappResult.missing);
            toast({
              title: "WhatsApp setup needed",
              description: "Order created successfully, but WhatsApp notifications need setup. Check the console for details.",
              variant: "destructive",
              duration: 5000,
            });
          } else {
            toast({
              title: "WhatsApp notification issue",
              description: whatsappResult.error || "WhatsApp notification failed, but order was created successfully.",
              variant: "destructive",
              duration: 5000,
            });
          }
        }
        
        // Note: We don't throw errors for WhatsApp notification failures
        // to avoid disrupting the order flow
      } catch (whatsappError) {
        console.error('🚨 WhatsApp notification error:', whatsappError);
        // Continue with order completion even if WhatsApp fails
      }

      // Clear cart and redirect
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: data.paymentMethod === 'upi' 
          ? "Please complete UPI payment. Your order will be confirmed within 24 hours."
          : "Your order has been placed and will be confirmed soon.",
      });

      setLocation(`/order-confirmation/${order.id}`);

    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to your cart before checkout</p>
            <Button onClick={() => setLocation('/')}>Continue Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.selectedColor}`} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.imageUrl || '/placeholder-image.jpg'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <PriceDisplay 
                        price={item.price.toString()} 
                        salePrice={item.salePrice?.toString()} 
                        className="text-sm mt-1"
                      />
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span>₹{subtotalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{finalTotalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <Truck className="w-4 h-4 inline mr-1" />
                    Free pickup from A Level Classroom at Don Bosco International School
                  </p>
                </div>

                {/* Coupon Input Section */}
                <div className="border-t pt-4">
                  <CouponInput
                    orderTotal={subtotalAmount}
                    onCouponApplied={handleCouponApplied}
                    onCouponRemoved={handleCouponRemoved}
                    appliedCoupon={appliedCoupon}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Checkout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Checkout Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      {...form.register('customerName')}
                      placeholder="Enter your full name"
                    />
                    {form.formState.errors.customerName && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      {...form.register('customerEmail')}
                      placeholder="Enter your email"
                    />
                    {form.formState.errors.customerEmail && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.customerEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      {...form.register('customerPhone')}
                      placeholder="Enter your phone number"
                    />
                    {form.formState.errors.customerPhone && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.customerPhone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Payment Method *</Label>
                    <RadioGroup
                      value={form.watch('paymentMethod')}
                      onValueChange={(value) => form.setValue('paymentMethod', value as 'cash' | 'upi')}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="w-4 h-4" />
                          Cash on Delivery (Free)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                          <QrCode className="w-4 h-4" />
                          UPI Payment (Pay Now)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {form.watch('paymentMethod') === 'upi' && upiQrCode && (
                    <div className="p-4 border rounded-lg bg-muted">
                      <h4 className="font-medium mb-2">UPI Payment</h4>
                      <div className="text-center">
                        <img src={upiQrCode} alt="UPI QR Code" className="mx-auto mb-2 max-w-48" />
                        <p className="text-sm text-muted-foreground">
                          Scan to pay ₹{getTotalPrice().toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Order will be confirmed within 24 hours after payment verification
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      {...form.register('notes')}
                      placeholder="Any special requests or notes..."
                    />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full" size="lg">
                    {submitting ? 'Placing Order...' : 
                     form.watch('paymentMethod') === 'upi' ? 'Place Order & Pay' : 'Place Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
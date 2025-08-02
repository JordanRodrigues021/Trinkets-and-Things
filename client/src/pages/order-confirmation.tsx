import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Clock, Truck, CreditCard } from 'lucide-react';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

interface OrderConfirmationProps {
  params: { orderId: string };
}

export default function OrderConfirmation({ params }: OrderConfirmationProps) {
  const [, setLocation] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Load order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.orderId)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);

        // Load order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', params.orderId);

        if (itemsError) throw itemsError;
        setOrderItems(itemsData || []);

      } catch (error) {
        console.error('Error loading order:', error);
        setLocation('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.orderId, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <Button onClick={() => setLocation('/')}>Return to Shop</Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
      case 'ready':
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. Here are your order details:
            </p>
          </div>

          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.order_status)}
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Placed on: {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.order_status)}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">
                      {order.payment_method === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <Badge className={
                      order.payment_status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {order.payment_method === 'upi' && order.payment_status === 'pending' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <Clock className="w-4 h-4 inline mr-1" />
                      UPI payment verification in progress. Your order will be confirmed within 24 hours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Pickup Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium">Pickup Location:</p>
                    <p className="text-muted-foreground">{order.shipping_address}</p>
                  </div>
                  <div>
                    <p className="font-medium">Customer Details:</p>
                    <p className="text-muted-foreground">{order.customer_name}</p>
                    <p className="text-muted-foreground">{order.customer_email}</p>
                    <p className="text-muted-foreground">{order.customer_phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Color: {item.selected_color} • Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{parseFloat(item.product_price).toLocaleString('en-IN')}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            ₹{(parseFloat(item.product_price) * item.quantity).toLocaleString('en-IN')} total
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              <Button onClick={() => setLocation('/')} size="lg">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { sendOrderEmail } from '@/lib/email-service';
import { Mail, Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: string;
  payment_method: string;
  order_status: string;
  created_at: string;
  email_sent_placed?: boolean;
  email_sent_confirmed?: boolean;
  order_items: Array<{
    product_name: string;
    quantity: number;
    product_price: string;
  }>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_name,
            quantity,
            product_price
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error loading orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, order_status: newStatus } : order
      ));

      toast({
        title: "Order status updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendStatusEmail = async (order: Order, status: 'placed' | 'confirmed', updateStatus: boolean = true) => {
    setSendingEmail(order.id);
    
    try {
      const orderItems = order.order_items.map(item => 
        `${item.product_name} (Qty: ${item.quantity}) - ₹${item.product_price}`
      ).join('\n');

      const emailSuccess = await sendOrderEmail({
        to_email: order.customer_email,
        customer_name: order.customer_name,
        order_id: order.id,
        order_items: orderItems,
        order_total: order.total_amount,
        order_status: status,
      });

      if (emailSuccess) {
        // Update email tracking
        const emailField = status === 'placed' ? 'email_sent_placed' : 'email_sent_confirmed';
        await supabase
          .from('orders')
          .update({ [emailField]: true })
          .eq('id', order.id);

        // Update order status if requested
        if (updateStatus && status === 'confirmed') {
          await updateOrderStatus(order.id, status);
        }
        
        // Update local state
        setOrders(orders.map(o => 
          o.id === order.id 
            ? { ...o, [emailField]: true, ...(updateStatus && status === 'confirmed' ? { order_status: status } : {}) }
            : o
        ));
        
        toast({
          title: "Email sent successfully!",
          description: `${status === 'placed' ? 'Order confirmation' : 'Order confirmed'} email sent to ${order.customer_email}`,
        });
      } else {
        toast({
          title: "Email not configured",
          description: "EmailJS is not set up. Check EMAIL_SETUP_GUIDE.md",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="text-gray-600">Manage orders and send email notifications</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getStatusColor(order.order_status)}>
                      {getStatusIcon(order.order_status)}
                      <span className="ml-1">{order.order_status?.toUpperCase() || 'PENDING'}</span>
                    </Badge>
                    <Badge variant="outline">
                      {order.payment_method?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{order.total_amount}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {order.customer_name}</div>
                    <div><strong>Email:</strong> {order.customer_email}</div>
                    <div><strong>Phone:</strong> {order.customer_phone}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-1 text-sm">
                    {order.order_items.map((item, index) => (
                      <div key={index}>
                        {item.product_name} (Qty: {item.quantity}) - ₹{item.product_price}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Auto-confirm order with email */}
                {order.order_status === 'placed' && (
                  <Button
                    size="sm"
                    onClick={() => sendStatusEmail(order, 'confirmed')}
                    disabled={sendingEmail === order.id}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {sendingEmail === order.id ? 'Sending...' : 'Confirm Order'}
                  </Button>
                )}

                {/* Mark as completed */}
                {order.order_status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Completed
                  </Button>
                )}

                {/* Manual email sending buttons */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendStatusEmail(order, 'placed', false)}
                    disabled={sendingEmail === order.id}
                    className={order.email_sent_placed ? 'bg-green-50 border-green-200' : ''}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {order.email_sent_placed ? 'Resend' : 'Send'} Order Email
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendStatusEmail(order, 'confirmed', false)}
                    disabled={sendingEmail === order.id}
                    className={order.email_sent_confirmed ? 'bg-green-50 border-green-200' : ''}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {order.email_sent_confirmed ? 'Resend' : 'Send'} Confirmed Email
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => console.log('View order details:', order)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here once customers start placing them.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
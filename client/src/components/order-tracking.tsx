import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Package, Search, CheckCircle, Clock, Truck, X } from 'lucide-react';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

const trackingSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Invalid phone number'),
});

type TrackingForm = z.infer<typeof trackingSchema>;

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

interface OrderTrackingProps {
  children: React.ReactNode;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'placed':
      return <Clock className="w-4 h-4" />;
    case 'confirmed':
      return <CheckCircle className="w-4 h-4" />;
    case 'ready':
      return <Package className="w-4 h-4" />;
    case 'completed':
      return <Truck className="w-4 h-4" />;
    case 'cancelled':
      return <X className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'placed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'confirmed':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'ready':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function OrderTracking({ children }: OrderTrackingProps) {
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const { toast } = useToast();

  const form = useForm<TrackingForm>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: TrackingForm) => {
    setSearching(true);
    try {
      // Search for orders with matching email and phone
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('customer_email', data.email)
        .eq('customer_phone', data.phone)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!ordersData || ordersData.length === 0) {
        toast({
          title: "No orders found",
          description: "No orders found with the provided email and phone number.",
          variant: "destructive",
        });
        setOrders([]);
        return;
      }

      setOrders(ordersData as OrderWithItems[]);
      toast({
        title: "Orders found!",
        description: `Found ${ordersData.length} order(s) for your account.`,
      });
    } catch (error) {
      console.error('Error searching orders:', error);
      toast({
        title: "Error",
        description: "Failed to search orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Track Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+91 98765 43210" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={searching}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                {searching ? 'Searching...' : 'Track Orders'}
              </Button>
            </form>
          </Form>

          {orders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Orders</h3>
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <Badge className={getStatusColor(order.order_status)}>
                        {getStatusIcon(order.order_status)}
                        <span className="ml-1 capitalize">{order.order_status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Items:</h4>
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.product_name} ({item.selected_color}) × {item.quantity}
                          </span>
                          <span>₹{parseFloat(item.product_price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-3 flex justify-between font-medium">
                      <span>Total Amount:</span>
                      <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Payment:</strong> {order.payment_method.toUpperCase()} - {order.payment_status}</p>
                      <p><strong>Delivery:</strong> {order.shipping_address}</p>
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
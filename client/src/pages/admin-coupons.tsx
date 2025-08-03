import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff, Copy, Percent, IndianRupee } from 'lucide-react';
import type { Database } from '@/types/database';

type Coupon = Database['public']['Tables']['coupons']['Row'];

const couponSchema = z.object({
  code: z.string().min(1, "Code is required").max(20, "Code must be 20 characters or less"),
  description: z.string().min(1, "Description is required"),
  discount_type: z.enum(['percentage', 'fixed'], {
    required_error: "Please select a discount type",
  }),
  discount_value: z.string().regex(/^\d+\.?\d{0,2}$/, "Please enter a valid discount value"),
  min_order_amount: z.string().optional(),
  max_uses: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

export default function AdminCoupons() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      max_uses: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
    },
  });

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      setLocation('/admin');
      return;
    }
  }, [setLocation]);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      toast({
        title: "Error loading coupons",
        description: "Failed to fetch coupons from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CouponFormData) => {
    try {
      const couponData = {
        ...data,
        code: data.code.toUpperCase(),
        min_order_amount: data.min_order_amount || null,
        max_uses: data.max_uses ? parseInt(data.max_uses) : null,
        end_date: data.end_date || null,
        is_active: 1,
        current_uses: 0,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) throw error;

        toast({
          title: "Coupon updated",
          description: "Coupon has been successfully updated",
        });
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);

        if (error) {
          if (error.code === '23505') {
            toast({
              title: "Coupon code already exists",
              description: "Please use a different coupon code",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }

        toast({
          title: "Coupon created",
          description: "New coupon has been successfully created",
        });
      }

      form.reset();
      setEditingCoupon(null);
      setShowForm(false);
      loadCoupons();
    } catch (error: any) {
      toast({
        title: "Error saving coupon",
        description: "Failed to save coupon details",
        variant: "destructive",
      });
    }
  };

  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    form.reset({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type as 'percentage' | 'fixed',
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || '',
      max_uses: coupon.max_uses?.toString() || '',
      start_date: coupon.start_date.split('T')[0],
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const toggleCouponStatus = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: coupon.is_active ? 0 : 1 })
        .eq('id', coupon.id);

      if (error) throw error;

      toast({
        title: coupon.is_active ? "Coupon deactivated" : "Coupon activated",
        description: `Coupon has been ${coupon.is_active ? 'deactivated' : 'activated'}`,
      });

      loadCoupons();
    } catch (error) {
      toast({
        title: "Error updating coupon",
        description: "Failed to update coupon status",
        variant: "destructive",
      });
    }
  };

  const deleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) throw error;

      toast({
        title: "Coupon deleted",
        description: "Coupon has been successfully deleted",
      });

      loadCoupons();
    } catch (error) {
      toast({
        title: "Error deleting coupon",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Coupon code ${code} copied to clipboard`,
    });
  };

  const cancelEdit = () => {
    setEditingCoupon(null);
    setShowForm(false);
    form.reset();
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue('code', result);
  };

  if (loading) {
    return <div className="p-8">Loading coupons...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Discount Coupons</h1>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="code" 
                      {...form.register('code')} 
                      placeholder="e.g., SAVE20"
                      style={{ textTransform: 'uppercase' }}
                      onChange={(e) => form.setValue('code', e.target.value.toUpperCase())}
                    />
                    <Button type="button" variant="outline" onClick={generateRandomCode}>
                      Generate
                    </Button>
                  </div>
                  {form.formState.errors.code && (
                    <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type *</Label>
                  <Select value={form.watch('discount_type')} onValueChange={(value) => form.setValue('discount_type', value as 'percentage' | 'fixed')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.discount_type && (
                    <p className="text-sm text-destructive">{form.formState.errors.discount_type.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" {...form.register('description')} placeholder="e.g., Get 20% off on all products" />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Discount Value * {form.watch('discount_type') === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input 
                    id="discount_value" 
                    type="number" 
                    step="0.01"
                    {...form.register('discount_value')} 
                    placeholder={form.watch('discount_type') === 'percentage' ? '20' : '100'}
                  />
                  {form.formState.errors.discount_value && (
                    <p className="text-sm text-destructive">{form.formState.errors.discount_value.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_order_amount">Minimum Order Amount (₹)</Label>
                  <Input 
                    id="min_order_amount" 
                    type="number" 
                    step="0.01"
                    {...form.register('min_order_amount')} 
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Maximum Uses</Label>
                  <Input 
                    id="max_uses" 
                    type="number" 
                    {...form.register('max_uses')} 
                    placeholder="e.g., 100 (leave empty for unlimited)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input id="start_date" type="date" {...form.register('start_date')} />
                  {form.formState.errors.start_date && (
                    <p className="text-sm text-destructive">{form.formState.errors.start_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input id="end_date" type="date" {...form.register('end_date')} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {coupons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No coupons created yet. Create your first discount coupon!</p>
            </CardContent>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-lg font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {coupon.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCouponCode(coupon.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <Badge variant={coupon.is_active ? "default" : "secondary"}>
                        {coupon.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {coupon.discount_type === 'percentage' ? <Percent className="w-3 h-3" /> : <IndianRupee className="w-3 h-3" />}
                        {coupon.discount_value}{coupon.discount_type === 'percentage' ? '%' : ' off'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Uses: {coupon.current_uses}{coupon.max_uses ? `/${coupon.max_uses}` : ''}</span>
                      {coupon.min_order_amount && (
                        <span>Min Order: ₹{coupon.min_order_amount}</span>
                      )}
                      <span>Start: {new Date(coupon.start_date).toLocaleDateString()}</span>
                      {coupon.end_date && (
                        <span>End: {new Date(coupon.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCouponStatus(coupon)}
                    >
                      {coupon.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editCoupon(coupon)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Search, Edit, Trash2, LogOut, Package, Users, Download, Upload, FileText, ShoppingCart, Settings, Check, X, Eye, Copy, CheckSquare, Square, Megaphone, Tag, Database as DatabaseIcon, Star } from 'lucide-react';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];
type Contact = Database['public']['Tables']['contacts']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'contacts' | 'reviews' | 'banners' | 'coupons' | 'settings'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [importing, setImporting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      setLocation('/admin');
      return;
    }
  }, [setLocation]);

  // Load data
  useEffect(() => {
    loadOrders();
    loadProducts();
    loadContacts();
    loadSettings();
    loadReviews();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "Error loading products",
        description: "Failed to fetch products from database",
        variant: "destructive",
      });
    }
  };

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      toast({
        title: "Error loading contacts",
        description: "Failed to fetch contacts from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      toast({
        title: "Error loading reviews",
        description: "Failed to fetch reviews from database",
        variant: "destructive",
      });
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review approved",
        description: "Review has been approved and will appear on the website",
      });

      loadReviews(); // Refresh reviews
    } catch (error) {
      toast({
        title: "Error approving review",
        description: "Failed to approve review",
        variant: "destructive",
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Review deleted",
        description: "Review has been deleted successfully",
      });

      loadReviews(); // Refresh reviews
    } catch (error) {
      toast({
        title: "Error deleting review",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = async (orderId: string, updates: { payment_status?: string; order_status?: string }) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Order updated",
        description: "Order status has been updated successfully",
      });

      loadOrders(); // Refresh orders
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      toast({
        title: "Setting updated",
        description: "Site setting has been updated successfully",
      });

      loadSettings(); // Refresh settings
    } catch (error) {
      toast({
        title: "Error updating setting",
        description: "Failed to update site setting",
        variant: "destructive",
      });
    }
  };

  const loadOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Load order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*');

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);
    } catch (error) {
      toast({
        title: "Error loading orders",
        description: "Failed to fetch orders from database",
        variant: "destructive",
      });
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      toast({
        title: "Error loading settings",
        description: "Failed to fetch settings from database",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    localStorage.removeItem('admin-email');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setLocation('/admin');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const toggleColorDisability = async (productId: string, color: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const currentDisabled = product.disabled_colors || [];
      const newDisabled = currentDisabled.includes(color)
        ? currentDisabled.filter(c => c !== color)
        : [...currentDisabled, color];

      const { error } = await supabase
        .from('products')
        .update({ disabled_colors: newDisabled })
        .eq('id', productId);

      if (error) throw error;

      // Update local state
      setProducts(products.map(p => 
        p.id === productId 
          ? { ...p, disabled_colors: newDisabled }
          : p
      ));

      toast({
        title: "Color updated",
        description: `${color} has been ${currentDisabled.includes(color) ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error updating color",
        description: "Failed to update color availability",
        variant: "destructive",
      });
    }
  };

  const duplicateProduct = async (productId: string) => {
    try {
      const originalProduct = products.find(p => p.id === productId);
      if (!originalProduct) return;

      const { id, created_at, ...productData } = originalProduct;
      const duplicatedProduct = {
        ...productData,
        name: `${originalProduct.name} (Copy)`,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([duplicatedProduct])
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      toast({
        title: "Product duplicated",
        description: `${originalProduct.name} has been duplicated`,
      });
    } catch (error) {
      toast({
        title: "Error duplicating product",
        description: "Failed to duplicate product",
        variant: "destructive",
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const batchDeleteProducts = async () => {
    if (selectedProducts.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);

      if (error) throw error;

      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      toast({
        title: "Products deleted",
        description: `${selectedProducts.length} products have been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error deleting products",
        description: "Failed to delete selected products",
        variant: "destructive",
      });
    }
  };

  const batchDisableColor = async (color: string) => {
    if (selectedProducts.length === 0) return;

    try {
      const updates = selectedProducts.map(async (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const currentDisabled = product.disabled_colors || [];
        if (currentDisabled.includes(color)) return; // Already disabled

        const newDisabled = [...currentDisabled, color];
        return supabase
          .from('products')
          .update({ disabled_colors: newDisabled })
          .eq('id', productId);
      });

      await Promise.all(updates);

      // Update local state
      setProducts(products.map(p => 
        selectedProducts.includes(p.id)
          ? { ...p, disabled_colors: [...(p.disabled_colors || []), color].filter((c, i, arr) => arr.indexOf(c) === i) }
          : p
      ));

      setSelectedProducts([]);
      toast({
        title: "Color disabled",
        description: `${color} has been disabled for ${selectedProducts.length} products`,
      });
    } catch (error) {
      toast({
        title: "Error disabling color",
        description: "Failed to disable color for selected products",
        variant: "destructive",
      });
    }
  };

  const batchEnableColor = async (color: string) => {
    if (selectedProducts.length === 0) return;

    try {
      const updates = selectedProducts.map(async (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const currentDisabled = product.disabled_colors || [];
        const newDisabled = currentDisabled.filter(c => c !== color);
        
        return supabase
          .from('products')
          .update({ disabled_colors: newDisabled })
          .eq('id', productId);
      });

      await Promise.all(updates);

      // Update local state
      setProducts(products.map(p => 
        selectedProducts.includes(p.id)
          ? { ...p, disabled_colors: (p.disabled_colors || []).filter(c => c !== color) }
          : p
      ));

      setSelectedProducts([]);
      toast({
        title: "Color enabled",
        description: `${color} has been enabled for ${selectedProducts.length} products`,
      });
    } catch (error) {
      toast({
        title: "Error enabling color",
        description: "Failed to enable color for selected products",
        variant: "destructive",
      });
    }
  };

  const handleExportProducts = () => {
    const csvHeaders = 'name,description,price,category,colors,disabled_colors,images,featured\n';
    const csvData = products.map(product => {
      const colors = product.colors.join(';');
      const disabledColors = (product.disabled_colors || []).join(';');
      const images = product.images.join(';');
      return `"${product.name}","${product.description}",${product.price},${product.category},"${colors}","${disabledColors}","${images}",${product.featured}`;
    }).join('\n');

    const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${products.length} products to CSV`,
    });
  };

  const handleImportProducts = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
      const products: any[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV line with proper handling of quoted values
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        if (values.length !== headers.length) continue;

        const product: any = {};
        headers.forEach((header, index) => {
          const value = values[index]?.replace(/"/g, '') || '';
          switch (header.trim()) {
            case 'name':
            case 'description':
            case 'category':
            case 'material':
            case 'dimensions':
            case 'weight':
            case 'print_time':
              product[header.trim()] = value;
              break;
            case 'price':
              product.price = value;
              break;
            case 'colors':
              product.colors = value ? value.split(';').map(c => c.trim()) : [];
              break;
            case 'images':
              product.images = value ? value.split(';').map(i => i.trim()) : [];
              break;
            case 'featured':
              product.featured = parseInt(value) || 0;
              break;
          }
        });

        if (product.name && product.description) {
          products.push(product);
        }
      }

      if (products.length === 0) {
        toast({
          title: "No valid products found",
          description: "The CSV file contains no valid product data",
          variant: "destructive",
        });
        return;
      }

      // Import products to database
      const { error } = await supabase
        .from('products')
        .insert(products);

      if (error) throw error;

      // Reload products
      await loadProducts();

      toast({
        title: "Import successful",
        description: `Imported ${products.length} products from CSV`,
      });

    } catch (error: any) {
      toast({
        title: "Import failed",
        description: `Failed to import products: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(review =>
    review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">3D Printing Admin</h1>
              <p className="text-muted-foreground">Manage products and customer inquiries</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold">{products.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Customer Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-green-500" />
                <span className="text-2xl font-bold">{contacts.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  ⭐
                </div>
                <span className="text-2xl font-bold">{products.filter(p => p.featured > 0).length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders ({orders.length})
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('products')}
            >
              <Package className="w-4 h-4 mr-2" />
              Products ({products.length})
            </Button>
            <Button
              variant={activeTab === 'contacts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('contacts')}
            >
              <Users className="w-4 h-4 mr-2" />
              Contacts ({contacts.length})
            </Button>
            <Button
              variant={activeTab === 'reviews' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('reviews')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Reviews ({reviews.length})
            </Button>
            <Button
              variant={activeTab === 'banners' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocation('/admin/banners')}
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Banners
            </Button>
            <Button
              variant={activeTab === 'coupons' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocation('/admin/coupons')}
            >
              <Tag className="w-4 h-4 mr-2" />
              Coupons
            </Button>
            <Button
              variant={activeTab === 'reviews' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocation('/admin/reviews')}
            >
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/database-setup')}
            >
              <DatabaseIcon className="w-4 h-4 mr-2" />
              Setup DB
            </Button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === 'products' && (
            <div className="flex gap-2">
              <Button onClick={() => setLocation('/admin/products/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleExportProducts}
                disabled={products.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportProducts}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={importing}
                />
                <Button variant="outline" disabled={importing}>
                  {importing ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV
                    </>
                  )}
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/sample-products.csv';
                  link.download = 'sample-products.csv';
                  link.click();
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Sample CSV
              </Button>
            </div>
          )}
        </div>

        {/* Batch Actions */}
        {activeTab === 'products' && selectedProducts.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{selectedProducts.length} products selected</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProducts([])}
                  >
                    Clear Selection
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={batchDeleteProducts}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                  <div className="flex gap-1">
                    {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'].map(color => (
                      <div key={color} className="flex">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2"
                          onClick={() => batchDisableColor(color)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          {color}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs px-2 ml-1"
                          onClick={() => batchEnableColor(color)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {color}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {activeTab === 'products' && filteredProducts.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                >
                  {selectedProducts.length === filteredProducts.length ? (
                    <CheckSquare className="w-4 h-4 mr-2" />
                  ) : (
                    <Square className="w-4 h-4 mr-2" />
                  )}
                  {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedProducts.length} of {filteredProducts.length} selected
                </span>
              </div>
            )}
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      onClick={() => toggleSelectProduct(product.id)}
                    >
                      {selectedProducts.includes(product.id) ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {product.category}
                            </Badge>
                            <Badge variant="secondary">
                              ${parseFloat(product.price).toFixed(2)}
                            </Badge>
                            {product.featured > 0 && (
                              <Badge variant="default">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-2">Color Availability:</h4>
                            <div className="flex flex-wrap gap-1">
                              {product.colors.map((color) => {
                                const isDisabled = product.disabled_colors?.includes(color);
                                return (
                                  <Button
                                    key={color}
                                    variant={isDisabled ? "outline" : "default"}
                                    size="sm"
                                    className={`text-xs ${
                                      isDisabled 
                                        ? 'opacity-50 hover:opacity-75' 
                                        : ''
                                    }`}
                                    onClick={() => toggleColorDisability(product.id, color)}
                                  >
                                    {isDisabled ? <X className="w-3 h-3 mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                                    {color}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>{product.images.length} images</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => duplicateProduct(product.id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/admin/products/${product.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first product'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setLocation('/admin/products/new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          {contact.first_name} {contact.last_name}
                        </h3>
                        <Badge variant="outline">{contact.email}</Badge>
                      </div>
                      <h4 className="font-medium mb-2">{contact.subject}</h4>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                        {contact.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Received {new Date(contact.created_at).toLocaleDateString()} at{' '}
                        {new Date(contact.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredContacts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No customer inquiries yet'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{review.customer_name}</h3>
                        <Badge variant="outline">{review.customer_email}</Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            >
                              ⭐
                            </div>
                          ))}
                        </div>
                        <Badge
                          variant={review.is_approved ? 'default' : 'secondary'}
                        >
                          {review.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                        "{review.review_text}"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {new Date(review.created_at).toLocaleDateString()} at{' '}
                        {new Date(review.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {!review.is_approved && (
                        <Button
                          size="sm"
                          onClick={() => approveReview(review.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteReview(review.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredReviews.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search criteria' : 'No customer reviews yet'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = orderItems.filter(item => item.order_id === order.id);
              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.customer_name} • {order.customer_email} • {order.customer_phone}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          order.payment_status === 'confirmed' ? 'default' :
                          order.payment_status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {order.payment_status}
                        </Badge>
                        <Badge variant={
                          order.order_status === 'completed' ? 'default' :
                          order.order_status === 'ready' ? 'secondary' :
                          order.order_status === 'confirmed' ? 'outline' : 'destructive'
                        }>
                          {order.order_status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 mb-4 bg-muted/50">
                      <h4 className="font-medium mb-2">Order Items:</h4>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-1">
                          <span className="text-sm">
                            {item.product_name} ({item.selected_color}) x{item.quantity}
                          </span>
                          <span className="text-sm font-medium">₹{parseFloat(item.product_price).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Payment:</span>
                      <Badge variant="outline">{order.payment_method.toUpperCase()}</Badge>
                      {order.payment_method === 'upi' && order.payment_status === 'pending' && (
                        <span className="text-xs text-muted-foreground">
                          (24h confirmation window)
                        </span>
                      )}
                    </div>
                    
                    {order.notes && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm"><strong>Notes:</strong> {order.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      {order.payment_status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, { payment_status: 'confirmed' })}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Confirm Payment
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateOrderStatus(order.id, { payment_status: 'cancelled' })}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Payment
                          </Button>
                        </>
                      )}
                      
                      {order.payment_status === 'confirmed' && order.order_status === 'placed' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, { order_status: 'confirmed' })}
                        >
                          Confirm Order
                        </Button>
                      )}
                      
                      {order.order_status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, { order_status: 'ready' })}
                        >
                          Mark Ready
                        </Button>
                      )}
                      
                      {order.order_status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, { order_status: 'completed' })}
                        >
                          Complete Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {orders.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Orders will appear here when customers make purchases
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">
                        {setting.setting_key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {setting.setting_value}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newValue = prompt(`Enter new value for ${setting.setting_key}:`, setting.setting_value);
                        if (newValue !== null) {
                          updateSetting(setting.setting_key, newValue);
                        }
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
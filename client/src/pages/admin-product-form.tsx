import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
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
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().regex(/^\d+\.?\d{0,2}$/, "Please enter a valid price"),
  category: z.enum(['functional', 'artistic', 'prototypes'], {
    required_error: "Please select a category",
  }),
  material: z.string().min(1, "Material is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  weight: z.string().min(1, "Weight is required"),
  print_time: z.string().min(1, "Print time is required"),
  featured: z.number().min(0).max(2),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [, setProduct] = useState<Product | null>(null);

  const isEditing = params.id !== 'new';
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: 'functional',
      material: '',
      dimensions: '',
      weight: '',
      print_time: '',
      featured: 0,
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

  // Load product for editing
  useEffect(() => {
    if (isEditing && params.id) {
      loadProduct(params.id);
    }
  }, [isEditing, params.id]);

  const loadProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProduct(data);
      setImageUrls(data.images || []);
      setColors(data.colors || []);
      
      // Populate form
      form.reset({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category as 'functional' | 'artistic' | 'prototypes',
        material: data.material,
        dimensions: data.dimensions,
        weight: data.weight,
        print_time: data.print_time,
        featured: data.featured,
      });
    } catch (error) {
      toast({
        title: "Error loading product",
        description: "Failed to load product details",
        variant: "destructive",
      });
      setLocation('/admin/dashboard');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);

    try {
      const productData = {
        ...data,
        colors,
        images: imageUrls,
      };

      if (isEditing && params.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', params.id);

        if (error) throw error;

        toast({
          title: "Product updated",
          description: "Product has been successfully updated",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Product created",
          description: "New product has been successfully created",
        });
      }

      setLocation('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Error saving product",
        description: "Failed to save product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/admin/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update product information' : 'Create a new 3D printed product'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Enter product name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    {...form.register('price')}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Detailed product description"
                  rows={4}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={form.watch('category')}
                    onValueChange={(value) => form.setValue('category', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="functional">Functional</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="prototypes">Prototypes</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Featured Status</Label>
                  <Select
                    value={form.watch('featured').toString()}
                    onValueChange={(value) => form.setValue('featured', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Not Featured</SelectItem>
                      <SelectItem value="1">Featured</SelectItem>
                      <SelectItem value="2">Highly Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material *</Label>
                  <Input
                    id="material"
                    {...form.register('material')}
                    placeholder="e.g., PLA, ABS, PETG"
                  />
                  {form.formState.errors.material && (
                    <p className="text-sm text-destructive">{form.formState.errors.material.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions *</Label>
                  <Input
                    id="dimensions"
                    {...form.register('dimensions')}
                    placeholder="e.g., 15cm × 15cm × 20cm"
                  />
                  {form.formState.errors.dimensions && (
                    <p className="text-sm text-destructive">{form.formState.errors.dimensions.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight *</Label>
                  <Input
                    id="weight"
                    {...form.register('weight')}
                    placeholder="e.g., 250g"
                  />
                  {form.formState.errors.weight && (
                    <p className="text-sm text-destructive">{form.formState.errors.weight.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="print_time">Print Time *</Label>
                  <Input
                    id="print_time"
                    {...form.register('print_time')}
                    placeholder="e.g., 8 hours"
                  />
                  {form.formState.errors.print_time && (
                    <p className="text-sm text-destructive">{form.formState.errors.print_time.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add color (e.g., White, Black, Blue)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                />
                <Button type="button" onClick={addColor} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Add image URL (supports .jpg, .png, .gif)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                />
                <Button type="button" onClick={addImageUrl} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDOTQuNDc3MiA3MCA5MCA3NC40NzcyIDkwIDgwQzkwIDg1LjUyMjggOTQuNDc3MiA5MCAxMDAgOTBDMTA1LjUyMyA5MCA1MTAgODUuNTIyOCAxMTAgODBDMTEwIDc0LjQ3NzIgMTA1LjUyMyA3MCAxMDAgNzBaIiBmaWxsPSIjOTlBM0FGII8+CjxwYXRoIGQ9Ik04MCA2MEM4MCA1NC40NzcyIDg0LjQ3NzIgNTAgOTAgNTBIMTEwQzExNS41MjMgNTAgMTIwIDU0LjQ3NzIgMTIwIDYwVjE0MEMxMjAgMTQ1LjUyMyAxMTUuNTIzIDE1MCAxMTAgMTUwSDkwQzg0LjQ3NzIgMTUwIDgwIDE0NS41MjMgODAgMTQwVjYwWiIgZmlsbD0iIzE1OEhGNyI+PC9wYXRoPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImageUrl(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {imageUrls.length === 0 && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No images added yet</p>
                  <p className="text-xs text-muted-foreground">Add image URLs to showcase your product</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/admin/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Product' : 'Create Product')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
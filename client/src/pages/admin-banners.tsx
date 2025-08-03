import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { Database } from '@/types/database';

type Banner = Database['public']['Tables']['banners']['Row'];

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
  background_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  text_color: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  priority: z.number().min(0).max(100),
  start_date: z.string(),
  end_date: z.string().optional(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export default function AdminBanners() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      description: '',
      button_text: '',
      button_link: '',
      background_color: '#3B82F6',
      text_color: '#FFFFFF',
      priority: 0,
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
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      toast({
        title: "Error loading banners",
        description: "Failed to fetch banners from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BannerFormData) => {
    try {
      const bannerData = {
        ...data,
        button_text: data.button_text || null,
        button_link: data.button_link || null,
        end_date: data.end_date || null,
        is_active: 1,
      };

      if (editingBanner) {
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingBanner.id);

        if (error) throw error;

        toast({
          title: "Banner updated",
          description: "Banner has been successfully updated",
        });
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);

        if (error) throw error;

        toast({
          title: "Banner created",
          description: "New banner has been successfully created",
        });
      }

      form.reset();
      setEditingBanner(null);
      setShowForm(false);
      loadBanners();
    } catch (error: any) {
      toast({
        title: "Error saving banner",
        description: "Failed to save banner details",
        variant: "destructive",
      });
    }
  };

  const editBanner = (banner: Banner) => {
    setEditingBanner(banner);
    form.reset({
      title: banner.title,
      description: banner.description,
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      background_color: banner.background_color,
      text_color: banner.text_color,
      priority: banner.priority,
      start_date: banner.start_date.split('T')[0],
      end_date: banner.end_date ? banner.end_date.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: banner.is_active ? 0 : 1 })
        .eq('id', banner.id);

      if (error) throw error;

      toast({
        title: banner.is_active ? "Banner deactivated" : "Banner activated",
        description: `Banner has been ${banner.is_active ? 'deactivated' : 'activated'}`,
      });

      loadBanners();
    } catch (error) {
      toast({
        title: "Error updating banner",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', bannerId);

      if (error) throw error;

      toast({
        title: "Banner deleted",
        description: "Banner has been successfully deleted",
      });

      loadBanners();
    } catch (error) {
      toast({
        title: "Error deleting banner",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditingBanner(null);
    setShowForm(false);
    form.reset();
  };

  if (loading) {
    return <div className="p-8">Loading banners...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Promotional Banners</h1>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingBanner ? 'Edit Banner' : 'Create New Banner'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" {...form.register('title')} />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (0-100)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="100"
                    {...form.register('priority', { valueAsNumber: true })}
                  />
                  {form.formState.errors.priority && (
                    <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" {...form.register('description')} />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button_text">Button Text (Optional)</Label>
                  <Input id="button_text" {...form.register('button_text')} placeholder="e.g., Shop Now" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button_link">Button Link (Optional)</Label>
                  <Input id="button_link" {...form.register('button_link')} placeholder="e.g., #products or /sale" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="background_color">Background Color</Label>
                  <Input id="background_color" type="color" {...form.register('background_color')} />
                  {form.formState.errors.background_color && (
                    <p className="text-sm text-destructive">{form.formState.errors.background_color.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text_color">Text Color</Label>
                  <Input id="text_color" type="color" {...form.register('text_color')} />
                  {form.formState.errors.text_color && (
                    <p className="text-sm text-destructive">{form.formState.errors.text_color.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
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
        {banners.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No banners created yet. Create your first promotional banner!</p>
            </CardContent>
          </Card>
        ) : (
          banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{banner.title}</h3>
                      <Badge variant={banner.is_active ? "default" : "secondary"}>
                        {banner.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">Priority: {banner.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>
                    {banner.button_text && (
                      <p className="text-xs text-muted-foreground">
                        Button: "{banner.button_text}" → {banner.button_link || 'No link'}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Start: {new Date(banner.start_date).toLocaleDateString()}</span>
                      {banner.end_date && (
                        <span>End: {new Date(banner.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBannerStatus(banner)}
                    >
                      {banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editBanner(banner)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBanner(banner.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Preview */}
                <div 
                  className="mt-3 p-3 rounded text-center text-sm"
                  style={{
                    backgroundColor: banner.background_color,
                    color: banner.text_color,
                  }}
                >
                  <div className="font-semibold">{banner.title}</div>
                  <div className="opacity-90">{banner.description}</div>
                  {banner.button_text && (
                    <div className="mt-2">
                      <span 
                        className="inline-block px-3 py-1 rounded text-xs"
                        style={{
                          backgroundColor: banner.text_color,
                          color: banner.background_color,
                        }}
                      >
                        {banner.button_text}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
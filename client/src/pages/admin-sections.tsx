import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Layers, Package } from 'lucide-react';
import type { Database } from '@/types/database';

type CustomSection = Database['public']['Tables']['custom_sections']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type SectionProduct = Database['public']['Tables']['section_products']['Row'];

interface SectionFormData {
  name: string;
  slug: string;
  description: string;
}

export default function AdminSections() {
  const [, setLocation] = useLocation();
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sectionProducts, setSectionProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [managingSection, setManagingSection] = useState<CustomSection | null>(null);
  const [formData, setFormData] = useState<SectionFormData>({
    name: '',
    slug: '',
    description: ''
  });
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      setLocation('/admin');
      return;
    }
  }, [setLocation]);

  useEffect(() => {
    loadSections();
    loadProducts();
  }, []);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_sections')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSections(data || []);
      
      // Load products for each section
      if (data && data.length > 0) {
        loadSectionProducts(data);
      }
    } catch (error: any) {
      if (error.code === '42P01') {
        toast({
          title: "Database setup required",
          description: "Custom sections tables need to be created. Go to Database Setup.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error loading sections",
          description: error.message || "Failed to fetch sections",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error loading products:', error);
    }
  };

  const loadSectionProducts = async (sectionsData: CustomSection[]) => {
    try {
      const sectionProductsMap: Record<string, Product[]> = {};

      for (const section of sectionsData) {
        const { data, error } = await supabase
          .from('section_products')
          .select(`
            product_id,
            display_order,
            products!inner(*)
          `)
          .eq('section_id', section.id)
          .order('display_order', { ascending: true });

        if (error) throw error;
        
        sectionProductsMap[section.id] = data?.map((sp: any) => sp.products) || [];
      }

      setSectionProducts(sectionProductsMap);
    } catch (error: any) {
      console.error('Error loading section products:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a section name",
        variant: "destructive",
      });
      return;
    }

    try {
      const sectionData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description.trim() || null,
        is_active: 1,
      };

      if (editingSection) {
        const { error } = await supabase
          .from('custom_sections')
          .update(sectionData)
          .eq('id', editingSection.id);

        if (error) throw error;

        toast({
          title: "Section updated",
          description: "Section has been successfully updated",
        });
      } else {
        const { error } = await supabase
          .from('custom_sections')
          .insert([sectionData]);

        if (error) throw error;

        toast({
          title: "Section created",
          description: "New section has been successfully created",
        });
      }

      setFormData({ name: '', slug: '', description: '' });
      setEditingSection(null);
      setShowForm(false);
      loadSections();
    } catch (error: any) {
      console.error('Section save error:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Duplicate slug",
          description: "A section with this slug already exists. Please use a different name.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error saving section",
          description: error.message || "Failed to save section",
          variant: "destructive",
        });
      }
    }
  };

  const editSection = (section: CustomSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      slug: section.slug,
      description: section.description || ''
    });
    setShowForm(true);
  };

  const toggleSectionStatus = async (sectionId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_sections')
        .update({ is_active: isActive ? 1 : 0 })
        .eq('id', sectionId);

      if (error) throw error;

      toast({
        title: isActive ? "Section activated" : "Section deactivated",
        description: isActive 
          ? "Section is now visible to customers"
          : "Section is now hidden from customers",
      });

      loadSections();
    } catch (error: any) {
      toast({
        title: "Error updating section",
        description: error.message || "Failed to update section status",
        variant: "destructive",
      });
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section? This will also remove all product associations.')) return;

    try {
      const { error } = await supabase
        .from('custom_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      toast({
        title: "Section deleted",
        description: "Section has been permanently removed",
      });

      loadSections();
    } catch (error: any) {
      toast({
        title: "Error deleting section",
        description: error.message || "Failed to delete section",
        variant: "destructive",
      });
    }
  };

  const addProductToSection = async (sectionId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('section_products')
        .insert([{
          section_id: sectionId,
          product_id: productId,
          display_order: (sectionProducts[sectionId]?.length || 0) + 1
        }]);

      if (error) throw error;

      toast({
        title: "Product added",
        description: "Product has been added to the section",
      });

      loadSections();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Product already in section",
          description: "This product is already in the selected section",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error adding product",
          description: error.message || "Failed to add product to section",
          variant: "destructive",
        });
      }
    }
  };

  const removeProductFromSection = async (sectionId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('section_products')
        .delete()
        .eq('section_id', sectionId)
        .eq('product_id', productId);

      if (error) throw error;

      toast({
        title: "Product removed",
        description: "Product has been removed from the section",
      });

      loadSections();
    } catch (error: any) {
      toast({
        title: "Error removing product",
        description: error.message || "Failed to remove product from section",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation('/admin/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Custom Sections</h1>
              <p className="text-muted-foreground">Manage product sections and categories</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>

          {/* Section Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingSection ? 'Edit Section' : 'Create New Section'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Section Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData(prev => ({ 
                            ...prev, 
                            name,
                            slug: !editingSection ? generateSlug(name) : prev.slug
                          }));
                        }}
                        placeholder="Featured Products"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="featured-products"
                        pattern="[a-z0-9-]+"
                        title="Only lowercase letters, numbers, and hyphens allowed"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this section..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingSection ? 'Update Section' : 'Create Section'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingSection(null);
                        setFormData({ name: '', slug: '', description: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Sections List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : sections.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Layers className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first custom section to organize products
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{section.name}</CardTitle>
                          <Badge variant={section.is_active ? 'secondary' : 'outline'}>
                            {section.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Slug: /{section.slug} • {sectionProducts[section.id]?.length || 0} products
                        </p>
                        {section.description && (
                          <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSectionStatus(section.id, !section.is_active)}
                        >
                          {section.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editSection(section)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setManagingSection(managingSection?.id === section.id ? null : section)}
                        >
                          <Package className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {managingSection?.id === section.id && (
                    <CardContent className="border-t">
                      <div className="space-y-4">
                        <h4 className="font-medium">Manage Products</h4>
                        
                        {/* Current Products */}
                        {sectionProducts[section.id]?.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium mb-2">Current Products:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {sectionProducts[section.id].map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">{product.name}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeProductFromSection(section.id, product.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add Products */}
                        <div>
                          <h5 className="text-sm font-medium mb-2">Add Products:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            {products
                              .filter(product => !sectionProducts[section.id]?.some(sp => sp.id === product.id))
                              .map((product) => (
                              <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">{product.name}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addProductToSection(section.id, product.id)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
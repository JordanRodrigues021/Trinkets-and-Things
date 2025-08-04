import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Gift, Star, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MysteryBox {
  id: string;
  name: string;
  price: number;
  description: string;
  contents: string;
  rarity: string;
  features: string[];
  is_active: number;
  display_order: number;
  created_at: string;
}

interface MysteryBoxFormData {
  name: string;
  price: string;
  description: string;
  contents: string;
  rarity: string;
  features: string[];
  is_active: number;
  display_order: string;
}

export default function AdminMysteryBoxes() {
  const [, setLocation] = useLocation();
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBox, setEditingBox] = useState<MysteryBox | null>(null);
  const [formData, setFormData] = useState<MysteryBoxFormData>({
    name: '',
    price: '',
    description: '',
    contents: '',
    rarity: 'uncommon',
    features: [],
    is_active: 1,
    display_order: '0'
  });
  const [featureInput, setFeatureInput] = useState('');
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
    loadMysteryBoxes();
  }, []);

  const loadMysteryBoxes = async () => {
    try {
      const { data, error } = await supabase
        .from('mystery_boxes')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMysteryBoxes(data || []);
    } catch (error: any) {
      if (error.code === '42P01') {
        toast({
          title: "Database setup required",
          description: "Mystery boxes table needs to be created. Go to Database Setup.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error loading mystery boxes",
          description: error.message || "Failed to fetch mystery boxes",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const mysteryBoxData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        contents: formData.contents,
        rarity: formData.rarity,
        features: formData.features,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order) || 0,
      };

      if (editingBox) {
        const { error } = await supabase
          .from('mystery_boxes')
          .update(mysteryBoxData)
          .eq('id', editingBox.id);

        if (error) throw error;

        toast({
          title: "Mystery box updated",
          description: "Mystery box has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('mystery_boxes')
          .insert([mysteryBoxData]);

        if (error) throw error;

        toast({
          title: "Mystery box created",
          description: "Mystery box has been created successfully",
        });
      }

      resetForm();
      loadMysteryBoxes();
    } catch (error: any) {
      toast({
        title: "Error saving mystery box",
        description: error.message || "Failed to save mystery box",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (box: MysteryBox) => {
    setEditingBox(box);
    setFormData({
      name: box.name,
      price: box.price.toString(),
      description: box.description,
      contents: box.contents,
      rarity: box.rarity,
      features: box.features || [],
      is_active: box.is_active,
      display_order: box.display_order.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mystery box?')) return;

    try {
      const { error } = await supabase
        .from('mystery_boxes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Mystery box deleted",
        description: "Mystery box has been deleted successfully",
      });

      loadMysteryBoxes();
    } catch (error: any) {
      toast({
        title: "Error deleting mystery box",
        description: error.message || "Failed to delete mystery box",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      contents: '',
      rarity: 'uncommon',
      features: [],
      is_active: 1,
      display_order: '0'
    });
    setFeatureInput('');
    setEditingBox(null);
    setShowForm(false);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'uncommon': return <Gift className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      case 'super-rare': return <Zap className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'uncommon': return 'bg-blue-100 text-blue-800';
      case 'rare': return 'bg-purple-100 text-purple-800';
      case 'super-rare': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mystery Boxes Management</h1>
            <p className="text-gray-600 mt-2">Create and manage mystery box offerings</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setLocation('/admin/dashboard')}
              variant="outline"
            >
              Back to Dashboard
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Mystery Box
            </Button>
          </div>
        </div>

        {/* Mystery Box Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingBox ? 'Edit Mystery Box' : 'Add New Mystery Box'}
              </CardTitle>
              <CardDescription>
                Configure mystery box details and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Mystery Box Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Starter Mystery Box"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="299.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rarity">Rarity Level</Label>
                    <Select value={formData.rarity} onValueChange={(value) => setFormData({ ...formData, rarity: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uncommon">Uncommon</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="super-rare">Super Rare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the mystery box"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contents">Contents Description *</Label>
                  <Input
                    id="contents"
                    value={formData.contents}
                    onChange={(e) => setFormData({ ...formData, contents: e.target.value })}
                    placeholder="e.g., 1 Uncommon Item"
                    required
                  />
                </div>

                {/* Features Management */}
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active === 1}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  />
                  <Label htmlFor="is_active">Active (visible on website)</Label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit">
                    {editingBox ? 'Update Mystery Box' : 'Create Mystery Box'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Mystery Boxes List */}
        {loading ? (
          <div className="text-center py-8">Loading mystery boxes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mysteryBoxes.map((box) => (
              <Card key={box.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{box.name}</CardTitle>
                    <Badge className={`${getRarityColor(box.rarity)} flex items-center gap-1`}>
                      {getRarityIcon(box.rarity)}
                      {box.rarity.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>{box.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{box.price}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>Contents:</strong> {box.contents}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {box.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={box.is_active ? "default" : "secondary"}>
                        {box.is_active ? "Active" : "Inactive"}
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(box)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(box.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {mysteryBoxes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mystery boxes yet</h3>
            <p className="text-gray-500 mb-4">Create your first mystery box to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Mystery Box
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
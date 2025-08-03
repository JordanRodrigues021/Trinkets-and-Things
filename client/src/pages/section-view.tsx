import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import ProductModal from '@/components/product-modal';
import PriceDisplay from '@/components/price-display';
import { ArrowLeft, Package, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'wouter';
import type { Database } from '@/types/database';

// Simple cart functionality
const useCart = () => {
  const addToCart = (item: any) => {
    console.log('Added to cart:', item);
    // Cart functionality can be implemented here
  };
  return { addToCart };
};

type CustomSection = Database['public']['Tables']['custom_sections']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export default function SectionView() {
  const [, params] = useRoute('/section/:slug');
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  
  const [section, setSection] = useState<CustomSection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (params?.slug) {
      loadSection(params.slug);
    }
  }, [params?.slug]);

  const loadSection = async (slug: string) => {
    try {
      // Load section details
      const { data: sectionData, error: sectionError } = await supabase
        .from('custom_sections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', 1)
        .single();

      if (sectionError) throw sectionError;
      setSection(sectionData);

      // Load section products
      const { data: sectionProducts, error: productsError } = await supabase
        .from('section_products')
        .select(`
          display_order,
          products!inner(*)
        `)
        .eq('section_id', sectionData.id)
        .order('display_order', { ascending: true });

      if (productsError) throw productsError;
      
      const productsData = sectionProducts?.map((sp: any) => sp.products) || [];
      setProducts(productsData);
      
    } catch (error: any) {
      console.error('Error loading section:', error);
      if (error.code === 'PGRST116') {
        // Section not found
        setLocation('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, selectedColor: string) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: parseFloat(product.price),
      salePrice: product.sale_price ? parseFloat(product.sale_price) : undefined,
      selectedColor,
      image: product.images?.[0] || '/placeholder-product.jpg',
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Section Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The section you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {section.name}
          </h1>
          {section.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {section.description}
            </p>
          )}
          <Badge variant="secondary" className="mt-4">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </Badge>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground">
              Products will appear here when they're added to this section.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <PriceDisplay 
                      price={product.price} 
                      salePrice={product.sale_price}
                      className="text-sm"
                    />
                    {product.is_customizable && (
                      <Badge variant="outline" className="text-xs">
                        Customizable
                      </Badge>
                    )}
                  </div>

                  {product.available_colors && product.available_colors.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.available_colors.slice(0, 5).map((color) => (
                          <div
                            key={color}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                        {product.available_colors.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.available_colors.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      const defaultColor = product.available_colors?.[0] || 'Default';
                      handleAddToCart(product, defaultColor);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
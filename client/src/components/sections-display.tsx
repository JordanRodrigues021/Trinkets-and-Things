import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronRight } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";
import PriceDisplay from "@/components/price-display";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Product = Database['public']['Tables']['products']['Row'];
type CustomSection = Database['public']['Tables']['custom_sections']['Row'];

// Type adapter for compatibility with AddToCartButton
interface CompatibleProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  sale_price: string | null;
  category: string;
  available_colors: string[];
  disabled_colors: string[];
  is_customizable: number;
  images: string[];
  featured: number;
  customizable: number;
  created_at: string;
}

const adaptProduct = (product: Product): CompatibleProduct => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  sale_price: product.sale_price,
  category: product.category,
  available_colors: product.colors || [],
  disabled_colors: product.disabled_colors || [],
  is_customizable: product.customizable || 0,
  images: product.images || [],
  featured: product.featured || 0,
  customizable: product.customizable || 0,
  created_at: product.created_at || new Date().toISOString(),
});

interface SectionsDisplayProps {
  onProductSelect?: (product: Product) => void;
}

interface SectionWithProducts extends CustomSection {
  products: Product[];
}

export default function SectionsDisplay({ onProductSelect }: SectionsDisplayProps) {
  const [sections, setSections] = useState<SectionWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get all products for "Our Products" section
  const { data: allProducts, isLoading: productsLoading } = useProducts({});

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      // Get active custom sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('custom_sections')
        .select('*')
        .eq('is_active', 1)
        .order('display_order', { ascending: true });

      if (sectionsError) throw sectionsError;

      // Load products for each section
      const sectionsWithProducts: SectionWithProducts[] = [];
      
      for (const section of sectionsData || []) {
        const { data: sectionProducts, error: productsError } = await supabase
          .from('section_products')
          .select(`
            products!inner(*)
          `)
          .eq('section_id', section.id)
          .order('display_order', { ascending: true });

        if (productsError) {
          console.error('Error loading section products:', productsError);
          continue;
        }

        const products = sectionProducts?.map((sp: any) => sp.products) || [];
        
        if (products.length > 0) {
          sectionsWithProducts.push({
            ...section,
            products
          });
        }
      }

      setSections(sectionsWithProducts);
    } catch (error: any) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeText = (featured: number) => {
    switch (featured) {
      case 1: return "Featured";
      case 2: return "Popular";
      default: return null;
    }
  };

  const getBadgeVariant = (featured: number) => {
    switch (featured) {
      case 1: return "default";
      case 2: return "secondary";
      default: return "outline";
    }
  };

  const handleProductClick = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
    window.dispatchEvent(new CustomEvent('openProductModal', { detail: product }));
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const adaptedProduct = adaptProduct(product);
    return (
    <div 
      key={product.id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer"
      onClick={() => handleProductClick(product)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {getBadgeText(product.featured) && (
          <div className="absolute top-2 right-2">
            <Badge 
              variant={getBadgeVariant(product.featured) as any}
              className="text-xs"
            >
              {getBadgeText(product.featured)}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mb-2 sm:mb-3">
          <PriceDisplay 
            price={product.price} 
            salePrice={product.sale_price}

          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <AddToCartButton product={adaptedProduct} />
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick(product);
            }}
            className="w-full h-8 text-xs sm:text-sm"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            View
          </Button>
        </div>
      </div>
    </div>
    );
  };

  if (loading || productsLoading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-40 sm:h-48 bg-gray-300"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* All Products Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Our Products
          </h2>
          <div className="text-sm text-gray-500">
            {allProducts?.length || 0} items
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {allProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {allProducts?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No products available.</p>
          </div>
        )}
      </section>

      {/* Custom Sections */}
      {sections.map((section) => (
        <section key={section.id} className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                {section.name}
              </h2>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            <div className="text-sm text-gray-500">
              {section.products.length} items
            </div>
          </div>
          
          {section.description && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl">
              {section.description}
            </p>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {section.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
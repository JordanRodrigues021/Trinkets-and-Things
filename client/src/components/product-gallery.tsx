import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";
import PriceDisplay from "@/components/price-display";
import type { Database } from "@/types/database";

type Product = Database['public']['Tables']['products']['Row'];

interface ProductGalleryProps {
  onProductSelect?: (product: Product) => void;
}

export default function ProductGallery({ onProductSelect }: ProductGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data: products, isLoading } = useProducts({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchQuery || undefined,
  });

  // Listen for search events from navigation
  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener('search', handleSearch as EventListener);

    return () => {
      window.removeEventListener('search', handleSearch as EventListener);
    };
  }, []);

  const sortedProducts = products ? [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'popular':
        return b.featured - a.featured;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  }) : [];

  const getBadgeText = (featured: number) => {
    switch (featured) {
      case 1:
        return "Featured";
      case 2:
        return "Popular";
      default:
        return null;
    }
  };

  const getBadgeVariant = (featured: number) => {
    switch (featured) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleProductClick = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
    // Dispatch event for modal to listen to
    window.dispatchEvent(new CustomEvent('openProductModal', { detail: product }));
  };

  if (isLoading) {
    return (
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-16 bg-gray-300 rounded"></div>
                    <div className="h-10 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-8 sm:py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Discover our collection of premium 3D printed products, each crafted with precision and attention to detail.
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="functional">Functional</SelectItem>
              <SelectItem value="artistic">Artistic</SelectItem>
              <SelectItem value="prototypes">Prototypes</SelectItem>
              <SelectItem value="miniatures">Miniatures</SelectItem>
              <SelectItem value="jewelry">Jewelry</SelectItem>
              <SelectItem value="home-decor">Home Decor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {sortedProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {getBadgeText(product.featured) && (
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={getBadgeVariant(product.featured) as any}
                      className="text-white bg-accent"
                    >
                      {getBadgeText(product.featured)}
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">{product.name}</h3>
                  {getBadgeText(product.featured) && (
                    <Badge variant={getBadgeVariant(product.featured)}>
                      {getBadgeText(product.featured)}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
                
                <div className="mb-4">
                  <PriceDisplay 
                    price={product.price} 
                    salePrice={product.sale_price}
                  />
                </div>

                <div className="space-y-2">
                  <AddToCartButton product={product} />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                    className="w-full flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}

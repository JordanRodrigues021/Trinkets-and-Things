import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Product3DViewer from "@/components/product-3d-viewer";
import AddToCartButton from "@/components/add-to-cart-button";
import PriceDisplay from "@/components/price-display";
import { getColorClasses } from "@/lib/colors";
import type { Database } from "@/types/database";

type Product = Database['public']['Tables']['products']['Row'];

export default function ProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      const product = event.detail as Product;
      setSelectedProduct(product);
      setSelectedColor(product.colors[0] || "");
      setIsOpen(true);
    };

    window.addEventListener('openProductModal', handleOpenModal as EventListener);

    return () => {
      window.removeEventListener('openProductModal', handleOpenModal as EventListener);
    };
  }, []);



  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist!",
      description: `${selectedProduct?.name} has been added to your wishlist.`,
    });
  };

  // Using unified color system from lib/colors.ts

  if (!selectedProduct) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">
            {selectedProduct.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 pb-6">
          <div>
            <Product3DViewer 
              product={{
                id: selectedProduct.id,
                name: selectedProduct.name,
                images: selectedProduct.images || [],
                category: selectedProduct.category,
                material: selectedProduct.material,
                dimensions: selectedProduct.dimensions
              }}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-3xl font-bold text-secondary">{selectedProduct.name}</h3>
                {selectedProduct.featured > 0 && (
                  <Badge variant="secondary" className="bg-accent text-white">
                    {selectedProduct.featured === 1 ? 'Featured' : 'Popular'}
                  </Badge>
                )}
              </div>
              <div className="mb-4">
                <PriceDisplay 
                  price={selectedProduct.price} 
                  salePrice={selectedProduct.sale_price}
                />
              </div>
              <p className="text-gray-600 text-lg">{selectedProduct.description}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-secondary mb-3">Specifications</h4>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Material:</strong> {selectedProduct.material}</li>
                <li><strong>Dimensions:</strong> {selectedProduct.dimensions}</li>
                <li><strong>Weight:</strong> {selectedProduct.weight}</li>
                <li><strong>Print Time:</strong> {selectedProduct.print_time}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-secondary mb-3">Available Colors</h4>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.colors.filter(color => 
                  !(selectedProduct.disabled_colors || []).includes(color)
                ).map((color: string) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 hover:border-primary transition-colors ${
                      getColorClasses(color)
                    } ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
              )}
              {(selectedProduct.disabled_colors || []).length > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  Out of stock: {(selectedProduct.disabled_colors || []).join(', ')}
                </p>
              )}
            </div>
            
            <div className="space-y-4">
              <AddToCartButton 
                product={selectedProduct} 
                className="w-full"
                onAddToCart={() => setIsOpen(false)}
              />
              
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

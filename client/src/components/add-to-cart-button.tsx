import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Palette } from 'lucide-react';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addItem } = useCart();
  const { toast } = useToast();

  const availableColors = product.colors.filter(color => 
    !(product.disabled_colors || []).includes(color)
  );

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        description: "You need to choose a color before adding to cart",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(product.price);
    const salePrice = product.sale_price ? parseFloat(product.sale_price) : undefined;

    addItem({
      productId: product.id,
      productName: product.name,
      price,
      salePrice,
      selectedColor,
      image: product.images[0] || '',
    });

    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedColor}) has been added to your cart.`,
    });

    // Reset color selection for next add
    setSelectedColor('');
  };

  if (availableColors.length === 0) {
    return (
      <Button disabled className={className}>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="flex-1">
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger>
            <SelectValue placeholder="Select color">
              {selectedColor && (
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {selectedColor}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableColors.map((color) => (
              <SelectItem key={color} value={color}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                     color.toLowerCase() === 'black' ? '#000000' :
                                     color.toLowerCase() === 'red' ? '#ef4444' :
                                     color.toLowerCase() === 'blue' ? '#3b82f6' :
                                     color.toLowerCase() === 'green' ? '#22c55e' :
                                     color.toLowerCase() === 'yellow' ? '#eab308' :
                                     color.toLowerCase() === 'gray' || color.toLowerCase() === 'grey' ? '#6b7280' :
                                     color.toLowerCase() === 'silver' ? '#c0c0c0' :
                                     color.toLowerCase() === 'gold' ? '#ffd700' :
                                     color.toLowerCase() === 'translucent' ? 'rgba(255,255,255,0.5)' :
                                     '#94a3b8'
                    }}
                  />
                  {color}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleAddToCart} disabled={!selectedColor}>
        <ShoppingCart className="w-4 h-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  );
}
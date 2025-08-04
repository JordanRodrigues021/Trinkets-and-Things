import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';
import { ShoppingCart, Palette } from 'lucide-react';
import { getColorHex } from '@/lib/colors';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  onAddToCart?: () => void;
}

export default function AddToCartButton({ product, className = '', onAddToCart }: AddToCartButtonProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const { addItem } = useCart();
  const { toast } = useToast();



  const availableColors = (product.available_colors || product.colors || []).filter(color => 
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

    // Check if product is customizable and requires custom name
    if (product.customizable === 1 && !customName.trim()) {
      toast({
        title: "Please enter custom text",
        description: "This item requires custom text to be added",
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
      customName: product.customizable === 1 ? customName.trim() : undefined,
      imageUrl: product.images[0] || '',
    });

    const customText = product.customizable === 1 && customName.trim() ? ` with "${customName.trim()}"` : '';
    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedColor})${customText} has been added to your cart.`,
    });

    // Reset selections for next add
    setSelectedColor('');
    setCustomName('');
    
    // Call the onAddToCart callback if provided (to close modal)
    if (onAddToCart) {
      onAddToCart();
    }
  };

  if (availableColors.length === 0) {
    return (
      <Button disabled className={className}>
        Out of Stock
      </Button>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Color Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Choose Color *</Label>
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
                      backgroundColor: getColorHex(color)
                    }}
                  />
                  {color}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom name input for customizable products */}
      {product.customizable === 1 && (
        <div className="space-y-2">
          <Label htmlFor="customName" className="text-sm font-medium">
            Enter custom text for this item *
          </Label>
          <Input
            id="customName"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g., Your name, message, etc."
            className="w-full"
          />
        </div>
      )}
      
      {/* Add to Cart Button */}
      <Button 
        onClick={handleAddToCart} 
        disabled={!selectedColor || (product.customizable === 1 && !customName.trim())}
        className="w-full"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  );
}
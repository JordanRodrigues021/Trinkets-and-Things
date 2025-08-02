import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/cart-context';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import PriceDisplay from './price-display';

interface CartSidebarProps {
  children: React.ReactNode;
}

export default function CartSidebar({ children }: CartSidebarProps) {
  const { cart, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
    setLocation('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {getTotalItems()}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.selectedColor}-${item.customName || 'default'}`} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">Color: {item.selectedColor}</p>
                      {item.customName && (
                        <p className="text-sm text-primary font-medium">Custom: "{item.customName}"</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <PriceDisplay 
                          price={item.price.toString()} 
                          salePrice={item.salePrice?.toString()} 
                          className="text-sm"
                        />
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.selectedColor, item.customName, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.selectedColor, item.customName, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.productId, item.selectedColor, item.customName)}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
              </div>
              
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  salePrice?: number;
  selectedColor: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(
        cartItem => 
          cartItem.productId === item.productId && 
          cartItem.selectedColor === item.selectedColor
      );

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const newCart = [...currentCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        // New item, add to cart
        return [...currentCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (productId: string, selectedColor: string) => {
    setCart(currentCart => 
      currentCart.filter(item => 
        !(item.productId === productId && item.selectedColor === selectedColor)
      )
    );
  };

  const updateQuantity = (productId: string, selectedColor: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, selectedColor);
      return;
    }

    setCart(currentCart =>
      currentCart.map(item =>
        item.productId === productId && item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { CartItem, CartSummary, getCartSummary } from '@/lib/cart';
// import { useAuth } from './AuthContext';

// interface CartContextType {
//   cart: CartSummary;
//   loading: boolean;
//   refreshCart: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType>({
//   cart: { items: [], totalItems: 0, totalPrice: 0 },
//   loading: true,
//   refreshCart: async () => {}
// });

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading: authLoading } = useAuth();
//   const [cart, setCart] = useState<CartSummary>({ items: [], totalItems: 0, totalPrice: 0 });
//   const [loading, setLoading] = useState(true);

//   const refreshCart = async () => {
//     if (!user) {
//       setCart({ items: [], totalItems: 0, totalPrice: 0 });
//       setLoading(false);
//       return;
//     }

//     try {
//       const cartSummary = await getCartSummary(user.id);
//       setCart(cartSummary);
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       setCart({ items: [], totalItems: 0, totalPrice: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!authLoading) {
//       refreshCart();
//     }
//   }, [user, authLoading]);

//   return (
//     <CartContext.Provider value={{ cart, loading, refreshCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };



// ------------------------------------------------------------------------


'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// TypeScript interfaces
interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category?: string;
  size: string;
  color: string;
  quantity: number;
  added_at: string;
}

interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface AddToCartItem {
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category?: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  cart: Cart;
  addToCart: (item: AddToCartItem) => Promise<boolean>;
  updateCartItemQuantity: (itemId: string, newQuantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<boolean>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = () => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart_guest');
        if (savedCart) {
          const cartData: Cart = JSON.parse(savedCart);
          setCart(cartData);
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = (cartData: Cart) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart_guest', JSON.stringify(cartData));
      }
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const calculateCartTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  const addToCart = async (item: AddToCartItem): Promise<boolean> => {
    try {
      console.log('Adding item to cart:', item);

      // Validate required fields
      if (!item.product_id || !item.product_name || !item.product_price) {
        throw new Error('Missing required product information');
      }

      // Generate unique ID for cart item
      const cartItem: CartItem = {
        id: `${item.product_id}_${item.size}_${item.color}_${Date.now()}`,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: Number(item.product_price),
        product_image: item.product_image || '',
        product_category: item.product_category || 'General',
        size: item.size || 'One Size',
        color: item.color || 'Default',
        quantity: Number(item.quantity) || 1,
        added_at: new Date().toISOString()
      };

      setCart(prevCart => {
        // Check if same product with same size/color already exists
        const existingItemIndex = prevCart.items.findIndex(
          existingItem => 
            existingItem.product_id === item.product_id &&
            existingItem.size === item.size &&
            existingItem.color === item.color
        );

        let newItems: CartItem[];
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          newItems = [...prevCart.items];
          newItems[existingItemIndex].quantity += cartItem.quantity;
        } else {
          // Add new item
          newItems = [...prevCart.items, cartItem];
        }

        const { totalItems, totalPrice } = calculateCartTotals(newItems);
        const newCart: Cart = {
          items: newItems,
          totalItems,
          totalPrice
        };

        // Save to localStorage
        saveCartToStorage(newCart);
        
        console.log('Cart updated successfully:', newCart);
        return newCart;
      });

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error(`Failed to add product to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateCartItemQuantity = async (itemId: string, newQuantity: number): Promise<boolean> => {
    try {
      if (newQuantity < 1) {
        return await removeFromCart(itemId);
      }

      setCart(prevCart => {
        const newItems = prevCart.items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        const { totalItems, totalPrice } = calculateCartTotals(newItems);
        const newCart: Cart = {
          items: newItems,
          totalItems,
          totalPrice
        };

        saveCartToStorage(newCart);
        return newCart;
      });

      return true;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
    try {
      setCart(prevCart => {
        const newItems = prevCart.items.filter(item => item.id !== itemId);
        const { totalItems, totalPrice } = calculateCartTotals(newItems);
        const newCart: Cart = {
          items: newItems,
          totalItems,
          totalPrice
        };

        saveCartToStorage(newCart);
        return newCart;
      });

      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      const emptyCart: Cart = {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };

      setCart(emptyCart);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart_guest');
      }

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const refreshCart = async (): Promise<boolean> => {
    try {
      // Recalculate totals based on current items
      const { totalItems, totalPrice } = calculateCartTotals(cart.items);
      const updatedCart: Cart = {
        ...cart,
        totalItems,
        totalPrice
      };

      setCart(updatedCart);
      saveCartToStorage(updatedCart);
      return true;
    } catch (error) {
      console.error('Error refreshing cart:', error);
      throw error;
    }
  };

  const getCartItemCount = (): number => {
    return cart.totalItems;
  };

  const getCartTotal = (): number => {
    return cart.totalPrice;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartItemCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
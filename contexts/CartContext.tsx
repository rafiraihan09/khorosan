'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CartSummary, getCartSummary } from '@/lib/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartSummary;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: { items: [], totalItems: 0, totalPrice: 0 },
  loading: true,
  refreshCart: async () => {}
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartSummary>({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    if (!user) {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      setLoading(false);
      return;
    }

    try {
      const cartSummary = await getCartSummary(user.id);
      setCart(cartSummary);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      refreshCart();
    }
  }, [user, authLoading]);

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
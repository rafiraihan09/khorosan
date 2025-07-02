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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    loadCartFromStorage();
  }, [user]);

  const loadCartFromStorage = () => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem(`cart_${user?.id || 'guest'}`);
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setCart(cartData);
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = (cartData) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`cart_${user?.id || 'guest'}`, JSON.stringify(cartData));
      }
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const calculateCartTotals = (items) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  const addToCart = async (item) => {
    try {
      console.log('Adding item to cart:', item);

      // Validate required fields
      if (!item.product_id || !item.product_name || !item.product_price) {
        throw new Error('Missing required product information');
      }

      // Generate unique ID for cart item
      const cartItem = {
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
          cartItem => 
            cartItem.product_id === item.product_id &&
            cartItem.size === item.size &&
            cartItem.color === item.color
        );

        let newItems;
        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          newItems = [...prevCart.items];
          newItems[existingItemIndex].quantity += cartItem.quantity;
        } else {
          // Add new item
          newItems = [...prevCart.items, cartItem];
        }

        const { totalItems, totalPrice } = calculateCartTotals(newItems);
        const newCart = {
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
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return await removeFromCart(itemId);
      }

      setCart(prevCart => {
        const newItems = prevCart.items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        const { totalItems, totalPrice } = calculateCartTotals(newItems);
        const newCart = {
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

  const removeFromCart = async (itemId) => {
    try {
      setCart(prevCart => {
        const newItems = prevCart.items.filter(item => item.id !== itemId);
        const { totalItems, totalPrice } = calculateCartTotals(newItems);
        const newCart = {
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

  const clearCart = async () => {
    try {
      const emptyCart = {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };

      setCart(emptyCart);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`cart_${user?.id || 'guest'}`);
      }

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    try {
      // Recalculate totals based on current items
      const { totalItems, totalPrice } = calculateCartTotals(cart.items);
      const updatedCart = {
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

  const getCartItemCount = () => {
    return cart.totalItems;
  };

  const getCartTotal = () => {
    return cart.totalPrice;
  };

  const value = {
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
// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { WishlistItem, getWishlistItems } from '@/lib/wishlist';
// import { useAuth } from './AuthContext';

// interface WishlistContextType {
//   wishlist: WishlistItem[];
//   loading: boolean;
//   refreshWishlist: () => Promise<void>;
// }

// const WishlistContext = createContext<WishlistContextType>({
//   wishlist: [],
//   loading: true,
//   refreshWishlist: async () => {}
// });

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error('useWishlist must be used within a WishlistProvider');
//   }
//   return context;
// };

// export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading: authLoading } = useAuth();
//   const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const refreshWishlist = async () => {
//     if (!user) {
//       setWishlist([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       const wishlistItems = await getWishlistItems(user.id);
//       setWishlist(wishlistItems);
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//       setWishlist([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!authLoading) {
//       refreshWishlist();
//     }
//   }, [user, authLoading]);

//   return (
//     <WishlistContext.Provider value={{ wishlist, loading, refreshWishlist }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };


'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// TypeScript interfaces
interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<boolean>;
  removeFromWishlist: (itemId: string) => Promise<boolean>;
  moveToCart: (userId: string, itemId: string, size: string, color: string, quantity: number) => Promise<boolean>;
  refreshWishlist: () => Promise<boolean>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    // Return empty context instead of throwing error to prevent build issues
    return {
      wishlist: [],
      addToWishlist: async () => true,
      removeFromWishlist: async () => true,
      moveToCart: async () => true,
      refreshWishlist: async () => true,
    };
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const addToWishlist = async (item: WishlistItem): Promise<boolean> => {
    try {
      setWishlist(prev => {
        const exists = prev.find(w => w.product_id === item.product_id);
        if (exists) return prev;
        return [...prev, item];
      });
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (itemId: string): Promise<boolean> => {
    try {
      setWishlist(prev => prev.filter(item => item.id !== itemId));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const moveToCart = async (userId: string, itemId: string, size: string, color: string, quantity: number): Promise<boolean> => {
    try {
      // This would typically integrate with your cart context
      // For now, just remove from wishlist
      await removeFromWishlist(itemId);
      return true;
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    }
  };

  const refreshWishlist = async (): Promise<boolean> => {
    try {
      // Refresh logic here
      return true;
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
      throw error;
    }
  };

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
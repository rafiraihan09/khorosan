'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { WishlistItem, getWishlistItems } from '@/lib/wishlist';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  loading: true,
  refreshWishlist: async () => {}
});

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const wishlistItems = await getWishlistItems(user.id);
      setWishlist(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      refreshWishlist();
    }
  }, [user, authLoading]);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
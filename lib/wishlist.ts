import { supabase } from './auth';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category: string;
  created_at: string;
}

// Wishlist functions
export const addToWishlist = async (
  userId: string,
  productId: string,
  productName: string,
  productPrice: number,
  productImage: string,
  productCategory: string
) => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([{
        user_id: userId,
        product_id: productId,
        product_name: productName,
        product_price: productPrice,
        product_image: productImage,
        product_category: productCategory
      }])
      .select()
      .single();
    
    if (error) {
      // If it's a duplicate error, just return success
      if (error.code === '23505') {
        return { success: true, message: 'Item already in wishlist' };
      }
      throw error;
    }
    return { success: true, data };
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const getWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error getting wishlist items:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const removeFromWishlist = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return !!data;
  } catch (error: any) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

export const moveToCart = async (
  userId: string,
  wishlistItemId: string,
  size: string,
  color: string,
  quantity: number = 1
) => {
  try {
    // Get wishlist item details
    const { data: wishlistItem, error: wishlistError } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('id', wishlistItemId)
      .single();
    
    if (wishlistError) throw wishlistError;
    
    // Add to cart (import addToCart from cart.ts)
    const { addToCart } = await import('./cart');
    await addToCart(
      userId,
      wishlistItem.product_id,
      wishlistItem.product_name,
      wishlistItem.product_price,
      wishlistItem.product_image,
      wishlistItem.product_category,
      size,
      color,
      quantity
    );
    
    // Remove from wishlist
    await removeFromWishlist(wishlistItemId);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error moving to cart:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};
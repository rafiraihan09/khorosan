import { supabase } from './auth';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category: string;
  size: string;
  color: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Cart functions with improved error handling
export const addToCart = async (
  userId: string,
  productId: string,
  productName: string,
  productPrice: number,
  productImage: string,
  productCategory: string,
  size: string,
  color: string,
  quantity: number = 1
) => {
  try {
    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingItem) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Add new item to cart
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          user_id: userId,
          product_id: productId,
          product_name: productName,
          product_price: productPrice,
          product_image: productImage,
          product_category: productCategory,
          size,
          color,
          quantity
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error getting cart items:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  try {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating cart item quantity:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const removeFromCart = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const clearCart = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const getCartSummary = async (userId: string): Promise<CartSummary> => {
  try {
    const items = await getCartItems(userId);
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalPrice
    };
  } catch (error: any) {
    console.error('Error getting cart summary:', error);
    // Return empty cart on error to prevent app crashes
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
  }
};
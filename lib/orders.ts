import { supabase } from './auth';

export interface OrderData {
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  billing_address: any;
  payment_method: string;
  card_last_four: string;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  items: any[];
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  billing_address: any;
  payment_method: string;
  card_last_four: string;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
}

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KH${timestamp.slice(-6)}${random}`;
};

// Create a new order
export const createOrder = async (orderData: OrderData) => {
  try {
    const orderNumber = generateOrderNumber();
    
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        user_id: orderData.user_id,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        payment_method: orderData.payment_method,
        card_last_four: orderData.card_last_four,
        total_amount: orderData.total_amount,
        tax_amount: orderData.tax_amount,
        shipping_amount: orderData.shipping_amount,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      product_image: item.product_image,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      subtotal: item.product_price * item.quantity
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return order;
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Get order by order number
export const getOrderByNumber = async (orderNumber: string) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();
    
    if (orderError) throw orderError;
    
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    
    if (itemsError) throw itemsError;
    
    return { ...order, items };
  } catch (error: any) {
    console.error('Error getting order:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Get orders for a user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error getting user orders:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Get all orders (admin only)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error getting all orders:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Get order items for an order
export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error getting order items:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error updating order status:', error);
    if (error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};
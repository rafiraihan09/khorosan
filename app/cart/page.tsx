'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Heart, ShoppingCart, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { updateCartItemQuantity, removeFromCart } from '@/lib/cart';
import { removeFromWishlist, moveToCart } from '@/lib/wishlist';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const { wishlist, refreshWishlist } = useWishlist();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [movingToCart, setMovingToCart] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await removeFromCart(itemId);
      await refreshCart();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await removeFromWishlist(itemId);
      await refreshWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleMoveToCart = async (wishlistItemId: string) => {
    const size = selectedSizes[wishlistItemId];
    const color = selectedColors[wishlistItemId];
    
    if (!size || !color) {
      alert('Please select size and color before adding to cart');
      return;
    }

    setMovingToCart(prev => new Set(prev).add(wishlistItemId));
    
    try {
      await moveToCart(user!.id, wishlistItemId, size, color, 1);
      await refreshCart();
      await refreshWishlist();
      alert('Item moved to cart!');
    } catch (error) {
      console.error('Error moving to cart:', error);
      alert('Failed to move item to cart. Please try again.');
    } finally {
      setMovingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(wishlistItemId);
        return newSet;
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
          <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
            SIGN IN REQUIRED
          </h1>
          <p className="text-gray-300 mb-8">
            Please sign in to view your cart and wishlist.
          </p>
          <div className="space-y-4">
            <Link href="/auth">
              <Button className="btn-primary w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="btn-secondary w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/shop" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          
          <div className="text-center">
            <h1 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
              YOUR CART
            </h1>
            <p className="text-gray-300">
              {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h2 className="overspray-title text-white text-2xl lg:text-3xl mb-4">
              YOUR CART IS EMPTY
            </h2>
            <p className="text-gray-300 mb-8">
              Discover our premium collections and add items to your cart.
            </p>
            <Link href="/shop">
              <Button className="btn-primary">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-700 rounded-lg overflow-hidden bg-black"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="w-full sm:w-48 h-48 flex-shrink-0">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 p-6 bg-black">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2 text-xs">
                            {item.product_category}
                          </Badge>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {item.product_name}
                          </h3>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p>Size: {item.size}</p>
                            <p>Color: {item.color}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updatingItems.has(item.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={updatingItems.has(item.id) || item.quantity <= 1}
                            className="w-8 h-8 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-white font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                            className="w-8 h-8 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            ${(item.product_price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">
                            ${item.product_price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-700 rounded-lg p-6 sticky top-24 bg-black">
                <h2 className="overspray-title text-white text-xl mb-6">
                  ORDER SUMMARY
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${(cart.totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${(cart.totalPrice * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full btn-primary mb-4">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link href="/shop">
                  <Button variant="outline" className="w-full btn-secondary">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Section */}
        {wishlist.length > 0 && (
          <div className="mt-16 border-t border-gray-800 pt-16">
            <div className="text-center mb-12">
              <h2 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
                YOUR WISHLIST
              </h2>
              <p className="text-gray-300">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-700 rounded-lg overflow-hidden bg-black group hover:border-gray-500 transition-colors"
                >
                  {/* Product Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={updatingItems.has(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-4">
                    <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2 text-xs">
                      {item.product_category}
                    </Badge>
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
                      {item.product_name}
                    </h3>
                    <div className="text-lg font-bold text-white mb-4">
                      ${item.product_price}
                    </div>

                    {/* Size Selection */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-400 mb-1">Size</label>
                      <select
                        value={selectedSizes[item.id] || ''}
                        onChange={(e) => setSelectedSizes(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded"
                      >
                        <option value="">Select Size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-400 mb-1">Color</label>
                      <select
                        value={selectedColors[item.id] || ''}
                        onChange={(e) => setSelectedColors(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded"
                      >
                        <option value="">Select Color</option>
                        <option value="Black">Black</option>
                        <option value="Navy">Navy</option>
                        <option value="Gray">Gray</option>
                        <option value="White">White</option>
                        <option value="Olive">Olive</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full btn-primary text-xs"
                        onClick={() => handleMoveToCart(item.id)}
                        disabled={movingToCart.has(item.id) || !selectedSizes[item.id] || !selectedColors[item.id]}
                      >
                        <ShoppingCart className="h-3 w-3 mr-2" />
                        {movingToCart.has(item.id) ? 'Adding...' : 'Add to Cart'}
                      </Button>
                      <Link href={`/product/${item.product_id}`}>
                        <Button size="sm" variant="outline" className="w-full btn-secondary text-xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
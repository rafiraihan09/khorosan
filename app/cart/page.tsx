// // 'use client';

// // import { useState } from 'react';
// // import Link from 'next/link';
// // import { Button } from '@/components/ui/button';
// // import { Badge } from '@/components/ui/badge';
// // import { Input } from '@/components/ui/input';
// // import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Heart, ShoppingCart, X } from 'lucide-react';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { useCart } from '@/contexts/CartContext';
// // import { useWishlist } from '@/contexts/WishlistContext';
// // import { updateCartItemQuantity, removeFromCart } from '@/lib/cart';
// // import { removeFromWishlist, moveToCart } from '@/lib/wishlist';

// // export default function CartPage() {
// //   const { user } = useAuth();
// //   const { cart, refreshCart } = useCart();
// //   const { wishlist, refreshWishlist } = useWishlist();
// //   const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
// //   const [movingToCart, setMovingToCart] = useState<Set<string>>(new Set());
// //   const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
// //   const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});

// //   const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
// //     setUpdatingItems(prev => new Set(prev).add(itemId));
    
// //     try {
// //       await updateCartItemQuantity(itemId, newQuantity);
// //       await refreshCart();
// //     } catch (error) {
// //       console.error('Error updating quantity:', error);
// //       alert('Failed to update quantity. Please try again.');
// //     } finally {
// //       setUpdatingItems(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(itemId);
// //         return newSet;
// //       });
// //     }
// //   };

// //   const handleRemoveItem = async (itemId: string) => {
// //     setUpdatingItems(prev => new Set(prev).add(itemId));
    
// //     try {
// //       await removeFromCart(itemId);
// //       await refreshCart();
// //     } catch (error) {
// //       console.error('Error removing item:', error);
// //       alert('Failed to remove item. Please try again.');
// //     } finally {
// //       setUpdatingItems(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(itemId);
// //         return newSet;
// //       });
// //     }
// //   };

// //   const handleRemoveFromWishlist = async (itemId: string) => {
// //     setUpdatingItems(prev => new Set(prev).add(itemId));
    
// //     try {
// //       await removeFromWishlist(itemId);
// //       await refreshWishlist();
// //     } catch (error) {
// //       console.error('Error removing from wishlist:', error);
// //       alert('Failed to remove from wishlist. Please try again.');
// //     } finally {
// //       setUpdatingItems(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(itemId);
// //         return newSet;
// //       });
// //     }
// //   };

// //   const handleMoveToCart = async (wishlistItemId: string) => {
// //     const size = selectedSizes[wishlistItemId];
// //     const color = selectedColors[wishlistItemId];
    
// //     if (!size || !color) {
// //       alert('Please select size and color before adding to cart');
// //       return;
// //     }

// //     setMovingToCart(prev => new Set(prev).add(wishlistItemId));
    
// //     try {
// //       await moveToCart(user!.id, wishlistItemId, size, color, 1);
// //       await refreshCart();
// //       await refreshWishlist();
// //       alert('Item moved to cart!');
// //     } catch (error) {
// //       console.error('Error moving to cart:', error);
// //       alert('Failed to move item to cart. Please try again.');
// //     } finally {
// //       setMovingToCart(prev => {
// //         const newSet = new Set(prev);
// //         newSet.delete(wishlistItemId);
// //         return newSet;
// //       });
// //     }
// //   };

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen bg-black text-white flex items-center justify-center">
// //         <div className="text-center max-w-md px-4">
// //           <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
// //           <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
// //             SIGN IN REQUIRED
// //           </h1>
// //           <p className="text-gray-300 mb-8">
// //             Please sign in to view your cart and wishlist.
// //           </p>
// //           <div className="space-y-4">
// //             <Link href="/auth">
// //               <Button className="btn-primary w-full">
// //                 Sign In
// //               </Button>
// //             </Link>
// //             <Link href="/shop">
// //               <Button variant="outline" className="btn-secondary w-full">
// //                 Continue Shopping
// //               </Button>
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-black text-white">
// //       {/* Header */}
// //       <div className="pt-20 pb-8">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <Link href="/shop" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8">
// //             <ArrowLeft className="h-4 w-4 mr-2" />
// //             Continue Shopping
// //           </Link>
          
// //           <div className="text-center">
// //             <h1 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
// //               YOUR CART
// //             </h1>
// //             <p className="text-gray-300">
// //               {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
// //         {cart.items.length === 0 ? (
// //           /* Empty Cart */
// //           <div className="text-center py-16">
// //             <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
// //             <h2 className="overspray-title text-white text-2xl lg:text-3xl mb-4">
// //               YOUR CART IS EMPTY
// //             </h2>
// //             <p className="text-gray-300 mb-8">
// //               Discover our premium collections and add items to your cart.
// //             </p>
// //             <Link href="/shop">
// //               <Button className="btn-primary">
// //                 Start Shopping
// //               </Button>
// //             </Link>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
// //             {/* Cart Items */}
// //             <div className="lg:col-span-2 space-y-6">
// //               {cart.items.map((item) => (
// //                 <div
// //                   key={item.id}
// //                   className="border border-gray-700 rounded-lg overflow-hidden bg-black"
// //                 >
// //                   <div className="flex flex-col sm:flex-row">
// //                     {/* Product Image */}
// //                     <div className="w-full sm:w-48 h-48 flex-shrink-0">
// //                       <img
// //                         src={item.product_image}
// //                         alt={item.product_name}
// //                         className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
// //                       />
// //                     </div>
                    
// //                     {/* Product Details */}
// //                     <div className="flex-1 p-6 bg-black">
// //                       <div className="flex justify-between items-start mb-4">
// //                         <div>
// //                           <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2 text-xs">
// //                             {item.product_category}
// //                           </Badge>
// //                           <h3 className="text-lg font-semibold text-white mb-2">
// //                             {item.product_name}
// //                           </h3>
// //                           <div className="text-sm text-gray-300 space-y-1">
// //                             <p>Size: {item.size}</p>
// //                             <p>Color: {item.color}</p>
// //                           </div>
// //                         </div>
// //                         <button
// //                           onClick={() => handleRemoveItem(item.id)}
// //                           disabled={updatingItems.has(item.id)}
// //                           className="text-gray-400 hover:text-red-400 transition-colors p-2"
// //                         >
// //                           <Trash2 className="h-4 w-4" />
// //                         </button>
// //                       </div>
                      
// //                       {/* Quantity and Price */}
// //                       <div className="flex items-center justify-between">
// //                         <div className="flex items-center space-x-3">
// //                           <button
// //                             onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
// //                             disabled={updatingItems.has(item.id) || item.quantity <= 1}
// //                             className="w-8 h-8 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
// //                           >
// //                             <Minus className="h-3 w-3" />
// //                           </button>
// //                           <span className="text-white font-medium min-w-[2rem] text-center">
// //                             {item.quantity}
// //                           </span>
// //                           <button
// //                             onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
// //                             disabled={updatingItems.has(item.id)}
// //                             className="w-8 h-8 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
// //                           >
// //                             <Plus className="h-3 w-3" />
// //                           </button>
// //                         </div>
                        
// //                         <div className="text-right">
// //                           <div className="text-lg font-bold text-white">
// //                             ${(item.product_price * item.quantity).toFixed(2)}
// //                           </div>
// //                           <div className="text-sm text-gray-400">
// //                             ${item.product_price} each
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Order Summary */}
// //             <div className="lg:col-span-1">
// //               <div className="border border-gray-700 rounded-lg p-6 sticky top-24 bg-black">
// //                 <h2 className="overspray-title text-white text-xl mb-6">
// //                   ORDER SUMMARY
// //                 </h2>
                
// //                 <div className="space-y-4 mb-6">
// //                   <div className="flex justify-between text-gray-300">
// //                     <span>Subtotal ({cart.totalItems} items)</span>
// //                     <span>${cart.totalPrice.toFixed(2)}</span>
// //                   </div>
// //                   <div className="flex justify-between text-gray-300">
// //                     <span>Shipping</span>
// //                     <span>Free</span>
// //                   </div>
// //                   <div className="flex justify-between text-gray-300">
// //                     <span>Tax</span>
// //                     <span>${(cart.totalPrice * 0.08).toFixed(2)}</span>
// //                   </div>
// //                   <div className="border-t border-gray-600 pt-4">
// //                     <div className="flex justify-between text-white font-bold text-lg">
// //                       <span>Total</span>
// //                       <span>${(cart.totalPrice * 1.08).toFixed(2)}</span>
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 <Link href="/checkout">
// //                   <Button className="w-full btn-primary mb-4">
// //                     Proceed to Checkout
// //                   </Button>
// //                 </Link>
                
// //                 <Link href="/shop">
// //                   <Button variant="outline" className="w-full btn-secondary">
// //                     Continue Shopping
// //                   </Button>
// //                 </Link>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Wishlist Section */}
// //         {wishlist.length > 0 && (
// //           <div className="mt-16 border-t border-gray-800 pt-16">
// //             <div className="text-center mb-12">
// //               <h2 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
// //                 YOUR WISHLIST
// //               </h2>
// //               <p className="text-gray-300">
// //                 {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
// //               </p>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //               {wishlist.map((item) => (
// //                 <div
// //                   key={item.id}
// //                   className="border border-gray-700 rounded-lg overflow-hidden bg-black group hover:border-gray-500 transition-colors"
// //                 >
// //                   {/* Product Image */}
// //                   <div className="aspect-square relative overflow-hidden">
// //                     <img
// //                       src={item.product_image}
// //                       alt={item.product_name}
// //                       className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
// //                     />
// //                     <button
// //                       onClick={() => handleRemoveFromWishlist(item.id)}
// //                       disabled={updatingItems.has(item.id)}
// //                       className="absolute top-2 right-2 w-8 h-8 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
// //                     >
// //                       <X className="h-4 w-4 text-white" />
// //                     </button>
// //                   </div>
                  
// //                   {/* Product Details */}
// //                   <div className="p-4">
// //                     <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2 text-xs">
// //                       {item.product_category}
// //                     </Badge>
// //                     <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
// //                       {item.product_name}
// //                     </h3>
// //                     <div className="text-lg font-bold text-white mb-4">
// //                       ${item.product_price}
// //                     </div>

// //                     {/* Size Selection */}
// //                     <div className="mb-3">
// //                       <label className="block text-xs text-gray-400 mb-1">Size</label>
// //                       <select
// //                         value={selectedSizes[item.id] || ''}
// //                         onChange={(e) => setSelectedSizes(prev => ({ ...prev, [item.id]: e.target.value }))}
// //                         className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded"
// //                       >
// //                         <option value="">Select Size</option>
// //                         <option value="XS">XS</option>
// //                         <option value="S">S</option>
// //                         <option value="M">M</option>
// //                         <option value="L">L</option>
// //                         <option value="XL">XL</option>
// //                         <option value="XXL">XXL</option>
// //                       </select>
// //                     </div>

// //                     {/* Color Selection */}
// //                     <div className="mb-4">
// //                       <label className="block text-xs text-gray-400 mb-1">Color</label>
// //                       <select
// //                         value={selectedColors[item.id] || ''}
// //                         onChange={(e) => setSelectedColors(prev => ({ ...prev, [item.id]: e.target.value }))}
// //                         className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded"
// //                       >
// //                         <option value="">Select Color</option>
// //                         <option value="Black">Black</option>
// //                         <option value="Navy">Navy</option>
// //                         <option value="Gray">Gray</option>
// //                         <option value="White">White</option>
// //                         <option value="Olive">Olive</option>
// //                       </select>
// //                     </div>
                    
// //                     <div className="space-y-2">
// //                       <Button
// //                         size="sm"
// //                         className="w-full btn-primary text-xs"
// //                         onClick={() => handleMoveToCart(item.id)}
// //                         disabled={movingToCart.has(item.id) || !selectedSizes[item.id] || !selectedColors[item.id]}
// //                       >
// //                         <ShoppingCart className="h-3 w-3 mr-2" />
// //                         {movingToCart.has(item.id) ? 'Adding...' : 'Add to Cart'}
// //                       </Button>
// //                       <Link href={`/product/${item.product_id}`}>
// //                         <Button size="sm" variant="outline" className="w-full btn-secondary text-xs">
// //                           View Details
// //                         </Button>
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




// // ---------------------------------------------------------------------------------------



// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Heart, ShoppingCart, X, Globe, MapPin, CreditCard } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useCart } from '@/contexts/CartContext';
// import { useWishlist } from '@/contexts/WishlistContext';

// export default function CartPage() {
//   const { user } = useAuth();
//   const { cart, updateCartItemQuantity, removeFromCart, refreshCart, clearCart } = useCart();
//   const { wishlist, removeFromWishlist, moveToCart, refreshWishlist } = useWishlist();
//   const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
//   const [movingToCart, setMovingToCart] = useState<Set<string>>(new Set());
//   const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
//   const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
//   const [customerCountry, setCustomerCountry] = useState('GB');
//   const [detectedLocation, setDetectedLocation] = useState('');

//   // Detect customer's country for pricing display
//   useEffect(() => {
//     const detectCountry = async () => {
//       try {
//         const response = await fetch('https://ipapi.co/json/');
//         const data = await response.json();
//         const countryCode = data.country_code || 'GB';
//         setCustomerCountry(countryCode);
//         setDetectedLocation(`${data.city}, ${data.country_name}`);
//       } catch (error) {
//         console.error('Location detection failed:', error);
//         setCustomerCountry('GB');
//       }
//     };

//     detectCountry();
//   }, []);

//   // Currency and shipping info based on country
//   const getLocalInfo = (country: string) => {
//     const info: Record<string, any> = {
//       'GB': { currency: 'GBP', symbol: '£', shipping: 5.00, name: 'United Kingdom', flag: '🇬🇧' },
//       'US': { currency: 'USD', symbol: '$', shipping: 15.00, name: 'United States', flag: '🇺🇸' },
//       'AU': { currency: 'AUD', symbol: 'A$', shipping: 20.00, name: 'Australia', flag: '🇦🇺' },
//       'CA': { currency: 'CAD', symbol: 'C$', shipping: 18.00, name: 'Canada', flag: '🇨🇦' },
//       'DE': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Germany', flag: '🇩🇪' },
//       'FR': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'France', flag: '🇫🇷' },
//       'NZ': { currency: 'NZD', symbol: 'NZ$', shipping: 22.00, name: 'New Zealand', flag: '🇳🇿' },
//       'NL': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Netherlands', flag: '🇳🇱' },
//       'BE': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Belgium', flag: '🇧🇪' },
//       'IT': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Italy', flag: '🇮🇹' },
//       'ES': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Spain', flag: '🇪🇸' },
//       'SE': { currency: 'SEK', symbol: 'kr', shipping: 120.00, name: 'Sweden', flag: '🇸🇪' },
//       'NO': { currency: 'NOK', symbol: 'kr', shipping: 130.00, name: 'Norway', flag: '🇳🇴' },
//       'DK': { currency: 'DKK', symbol: 'kr', shipping: 90.00, name: 'Denmark', flag: '🇩🇰' },
//       'CH': { currency: 'CHF', symbol: 'Fr', shipping: 15.00, name: 'Switzerland', flag: '🇨🇭' },
//       'JP': { currency: 'JPY', symbol: '¥', shipping: 1800, name: 'Japan', flag: '🇯🇵' },
//       'SG': { currency: 'SGD', symbol: 'S$', shipping: 25.00, name: 'Singapore', flag: '🇸🇬' },
//       'HK': { currency: 'HKD', symbol: 'HK$', shipping: 120.00, name: 'Hong Kong', flag: '🇭🇰' },
//     };
    
//     return info[country] || { currency: 'GBP', symbol: '£', shipping: 15.00, name: 'International', flag: '🌍' };
//   };

//   const localInfo = getLocalInfo(customerCountry);

//   // Convert prices to local currency for display
//   const convertPrice = (priceUSD: number, targetCurrency: string) => {
//     const exchangeRates: Record<string, number> = {
//       'gbp': 0.79,
//       'eur': 0.92,
//       'aud': 1.52,
//       'cad': 1.36,
//       'sek': 10.50,
//       'nok': 10.80,
//       'dkk': 6.80,
//       'chf': 0.91,
//       'jpy': 150,
//       'sgd': 1.35,
//       'hkd': 7.80,
//       'nzd': 1.65,
//       'usd': 1.00
//     };
    
//     return priceUSD * (exchangeRates[targetCurrency.toLowerCase()] || 1);
//   };

//   // Calculate totals
//   const cartTotalUSD = cart.items?.reduce((total, item) => total + (item.product_price * item.quantity), 0) || 0;
//   const cartTotalLocal = convertPrice(cartTotalUSD, localInfo.currency);
//   const shippingCost = cartTotalLocal > 100 ? 0 : localInfo.shipping;
//   const taxRate = 0.08;
//   const taxAmount = cartTotalLocal * taxRate;
//   const totalAmount = cartTotalLocal + taxAmount + shippingCost;

//   const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
//     if (newQuantity < 1) return;
    
//     setUpdatingItems(prev => new Set(prev).add(itemId));
    
//     try {
//       await updateCartItemQuantity(itemId, newQuantity);
//       await refreshCart();
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       alert('Failed to update quantity. Please try again.');
//     } finally {
//       setUpdatingItems(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(itemId);
//         return newSet;
//       });
//     }
//   };

//   const handleRemoveItem = async (itemId: string) => {
//     setUpdatingItems(prev => new Set(prev).add(itemId));
    
//     try {
//       await removeFromCart(itemId);
//       await refreshCart();
//     } catch (error) {
//       console.error('Error removing item:', error);
//       alert('Failed to remove item. Please try again.');
//     } finally {
//       setUpdatingItems(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(itemId);
//         return newSet;
//       });
//     }
//   };

//   const handleRemoveFromWishlist = async (itemId: string) => {
//     setUpdatingItems(prev => new Set(prev).add(itemId));
    
//     try {
//       await removeFromWishlist(itemId);
//       await refreshWishlist();
//     } catch (error) {
//       console.error('Error removing from wishlist:', error);
//       alert('Failed to remove from wishlist. Please try again.');
//     } finally {
//       setUpdatingItems(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(itemId);
//         return newSet;
//       });
//     }
//   };

//   const handleMoveToCart = async (wishlistItemId: string) => {
//     const size = selectedSizes[wishlistItemId];
//     const color = selectedColors[wishlistItemId];
    
//     if (!size || !color) {
//       alert('Please select size and color before adding to cart');
//       return;
//     }

//     setMovingToCart(prev => new Set(prev).add(wishlistItemId));
    
//     try {
//       await moveToCart(user!.id, wishlistItemId, size, color, 1);
//       await refreshCart();
//       await refreshWishlist();
//       alert('Item moved to cart!');
//     } catch (error) {
//       console.error('Error moving to cart:', error);
//       alert('Failed to move item to cart. Please try again.');
//     } finally {
//       setMovingToCart(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(wishlistItemId);
//         return newSet;
//       });
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center max-w-md px-4">
//           <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
//           <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
//             SIGN IN REQUIRED
//           </h1>
//           <p className="text-gray-300 mb-8">
//             Please sign in to view your cart and wishlist.
//           </p>
//           <div className="space-y-4">
//             <Link href="/auth">
//               <Button className="btn-primary w-full">
//                 Sign In
//               </Button>
//             </Link>
//             <Link href="/shop">
//               <Button variant="outline" className="btn-secondary w-full">
//                 Continue Shopping
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Header */}
//       <div className="pt-20 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Link href="/shop" className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Continue Shopping
//           </Link>
          
//           <div className="text-center">
//             <h1 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
//               YOUR CART
//             </h1>
//             <p className="text-gray-300">
//               {cart.items?.length || 0} {(cart.items?.length || 0) === 1 ? 'item' : 'items'} in your cart
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
//         {/* Location Detection Banner */}
//         {detectedLocation && (
//           <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4 mb-8">
//             <div className="flex items-center space-x-2">
//               <MapPin className="h-5 w-5 text-blue-400" />
//               <span className="text-blue-300">
//                 Shopping from: {detectedLocation} • Prices shown in {localInfo.currency} • Payment via PayPal in USD
//               </span>
//             </div>
//           </div>
//         )}

//         {!cart.items || cart.items.length === 0 ? (
//           /* Empty Cart */
//           <div className="text-center py-16">
//             <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-6" />
//             <h2 className="overspray-title text-white text-2xl lg:text-3xl mb-4">
//               YOUR CART IS EMPTY
//             </h2>
//             <p className="text-gray-300 mb-8">
//               Discover our premium collections and add items to your cart.
//             </p>
//             <Link href="/shop">
//               <Button className="btn-primary">
//                 Start Shopping
//               </Button>
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-6">
//               {cart.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="border border-gray-700 rounded-lg overflow-hidden bg-black"
//                 >
//                   <div className="flex flex-col sm:flex-row">
//                     {/* Product Image */}
//                     <div className="w-full sm:w-48 h-48 flex-shrink-0">
//                       <img
//                         src={item.product_image}
//                         alt={item.product_name}
//                         className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
//                       />
//                     </div>
                    
//                     {/* Product Details */}
//                     <div className="flex-1 p-6 bg-black">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2 text-xs">
//                             {item.product_category || 'Fashion'}
//                           </Badge>
//                           <h3 className="text-lg font-semibold text-white mb-2">
//                             {item.product_name}
//                           </h3>
//                           <div className="text-sm text-gray-300 space-y-1">
//                             <p>Size: {item.size}</p>
//                             <p>Color: {item.color}</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveItem(item.id)}
//                           disabled={updatingItems.has(item.id)}
//                           className="text-gray-400 hover:text-red-400 transition-colors p-2 disabled:opacity-50"
//                         >
//                           {updatingItems.has(item.id) ? (
//                             <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//                           ) : (
//                             <Trash2 className="h-4 w-4" />
//                           )}
//                         </button>
//                       </div>
                      
//                       {/* Quantity and Price */}
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <button
//                             onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
//                             disabled={updatingItems.has(item.id) || item.quantity <= 1}
//                             className="w-8 h-8 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Minus className="h-3 w-3" />
//                           </button>
//                           <span className="text-white font-medium min-w-[2rem] text-center">
//                             {updatingItems.has(item.id) ? (
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
//                             ) : (
//                               item.quantity
//                             )}
//                           </span>
//                           <button
//                             onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
//                             disabled={updatingItems.has(item.id)}
//                             className="w-8 h-8 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
//                           >
//                             <Plus className="h-3 w-3" />
//                           </button>
//                         </div>
                        
//                         <div className="text-right">
//                           <div className="text-lg font-bold text-white">
//                             {localInfo.symbol}{convertPrice(item.product_price * item.quantity, localInfo.currency).toFixed(2)}
//                           </div>
//                           <div className="text-sm text-gray-400">
//                             {localInfo.symbol}{convertPrice(item.product_price, localInfo.currency).toFixed(2)} each
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             ${(item.product_price * item.quantity).toFixed(2)} USD
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="border border-gray-700 rounded-lg p-6 sticky top-24 bg-black">
//                 <h2 className="overspray-title text-white text-xl mb-6">
//                   ORDER SUMMARY
//                 </h2>
                
//                 <div className="space-y-4 mb-6">
//                   <div className="flex justify-between text-gray-300">
//                     <span>Subtotal ({cart.items?.length || 0} items)</span>
//                     <div className="text-right">
//                       <div>{localInfo.symbol}{cartTotalLocal.toFixed(2)}</div>
//                       <div className="text-xs text-gray-500">${cartTotalUSD.toFixed(2)} USD</div>
//                     </div>
//                   </div>
//                   <div className="flex justify-between text-gray-300">
//                     <span>Shipping to {localInfo.name}</span>
//                     <div className="text-right">
//                       <div>{shippingCost === 0 ? 'Free' : `${localInfo.symbol}${shippingCost.toFixed(2)}`}</div>
//                       {shippingCost > 0 && (
//                         <div className="text-xs text-gray-500">
//                           Free shipping on orders over {localInfo.symbol}100
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex justify-between text-gray-300">
//                     <span>Estimated Tax</span>
//                     <div className="text-right">
//                       <div>{localInfo.symbol}{taxAmount.toFixed(2)}</div>
//                     </div>
//                   </div>
//                   <div className="border-t border-gray-600 pt-4">
//                     <div className="flex justify-between text-white font-bold text-lg">
//                       <span>Total ({localInfo.currency})</span>
//                       <div className="text-right">
//                         <div>{localInfo.symbol}{totalAmount.toFixed(2)}</div>
//                         <div className="text-sm text-gray-400 font-normal">
//                           ≈ ${(cartTotalUSD + (cartTotalUSD * 0.08) + (shippingCost > 0 ? 15 : 0)).toFixed(2)} USD
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <Link href="/checkout">
//                     <Button className="w-full btn-primary">
//                       <CreditCard className="h-4 w-4 mr-2" />
//                       Secure Checkout with PayPal
//                     </Button>
//                   </Link>
                  
//                   <Link href="/shop">
//                     <Button variant="outline" className="w-full btn-secondary">
//                       Continue Shopping
//                     </Button>
//                   </Link>
//                 </div>

//                 {/* PayPal Info */}
//                 <div className="mt-6 p-3 bg-blue-900/30 border border-blue-700 rounded text-center">
//                   <div className="flex items-center justify-center space-x-2 mb-2">
//                     <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#0070ba">
//                       <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.028 9.028 0 0 1-.408 2.188c-1.59 8.175-7.677 8.894-11.58 8.894l-1.085 6.905h4.606c.46 0 .85-.334.926-.787l.038-.204.73-4.63.047-.254c.077-.453.467-.787.926-.787h.584c3.596 0 6.412-1.461 7.23-5.687.341-1.764.166-3.24-.698-4.256a3.67 3.67 0 0 0-.316-.268z"/>
//                     </svg>
//                     <span className="text-blue-400 font-medium text-sm">Secure PayPal Payment</span>
//                   </div>
//                   <p className="text-xs text-gray-400">
//                     Pay with PayPal balance, bank account, or card • Buyer Protection included
//                   </p>
//                 </div>

//                 {/* Palestine Donation Notice */}
//                 <div className="mt-4 bg-white text-black p-3 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-1">
//                     <Heart className="h-3 w-3 text-red-500" />
//                     <h3 className="overspray-title text-sm">Supporting Palestine 🇵🇸</h3>
//                   </div>
//                   <p className="text-xs">
//                     25% of your purchase will be donated to Palestinian humanitarian aid.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Wishlist Section */}
//         {wishlist && wishlist.length > 0 && (
//           <div className="mt-16 border-t border-gray-800 pt-16">
//             <div className="text-center mb-12">
//               <h2 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
//                 YOUR WISHLIST
//               </h2>
//               <p className="text-gray-300">
//                 {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {wishlist.map((item) => (
//                 <div
//                   key={item.id}
//                   className="border border-gray-700 rounded-lg overflow-hidden bg-black group hover:border-gray-500 transition-colors"
//                 >
//                   {/* Product Image */}
//                   <div className="aspect-square relative overflow-hidden">
//                     <img
//                       src={item.product_image}
//                       alt={item.product_name}
//                       className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
//                     />
//                     <button
//                       onClick={() => handleRemoveFromWishlist(item.id)}
//                       disabled={updatingItems.has(item.id)}
//                       className="absolute top-2 right-2 w-8 h-8 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
//                     >
//                       {updatingItems.has(item.id) ? (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       ) : (
//                         <X className="h-4 w-4 text-white" />
//                       )}
//                     </button>
//                   </div>
                  
//                   {/* Product Details */}
//                   <div className="p-4">
//                     <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2 text-xs">
//                       {item.product_category || 'Fashion'}
//                     </Badge>
//                     <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
//                       {item.product_name}
//                     </h3>
//                     <div className="mb-4">
//                       <div className="text-lg font-bold text-white">
//                         {localInfo.symbol}{convertPrice(item.product_price, localInfo.currency).toFixed(2)}
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         ${item.product_price} USD
//                       </div>
//                     </div>

//                     {/* Size Selection */}
//                     <div className="mb-3">
//                       <label className="block text-xs text-gray-400 mb-1">Size</label>
//                       <select
//                         value={selectedSizes[item.id] || ''}
//                         onChange={(e) => setSelectedSizes(prev => ({ ...prev, [item.id]: e.target.value }))}
//                         className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded focus:border-gray-400 outline-none"
//                       >
//                         <option value="">Select Size</option>
//                         <option value="XS">XS</option>
//                         <option value="S">S</option>
//                         <option value="M">M</option>
//                         <option value="L">L</option>
//                         <option value="XL">XL</option>
//                         <option value="XXL">XXL</option>
//                       </select>
//                     </div>

//                     {/* Color Selection */}
//                     <div className="mb-4">
//                       <label className="block text-xs text-gray-400 mb-1">Color</label>
//                       <select
//                         value={selectedColors[item.id] || ''}
//                         onChange={(e) => setSelectedColors(prev => ({ ...prev, [item.id]: e.target.value }))}
//                         className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded focus:border-gray-400 outline-none"
//                       >
//                         <option value="">Select Color</option>
//                         <option value="Black">Black</option>
//                         <option value="Navy">Navy</option>
//                         <option value="Gray">Gray</option>
//                         <option value="White">White</option>
//                         <option value="Olive">Olive</option>
//                       </select>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Button
//                         size="sm"
//                         className="w-full btn-primary text-xs"
//                         onClick={() => handleMoveToCart(item.id)}
//                         disabled={movingToCart.has(item.id) || !selectedSizes[item.id] || !selectedColors[item.id]}
//                       >
//                         {movingToCart.has(item.id) ? (
//                           <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         ) : (
//                           <ShoppingCart className="h-3 w-3 mr-2" />
//                         )}
//                         {movingToCart.has(item.id) ? 'Adding...' : 'Add to Cart'}
//                       </Button>
//                       <Link href={`/product/${item.product_id}`}>
//                         <Button size="sm" variant="outline" className="w-full btn-secondary text-xs">
//                           View Details
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Heart, ShoppingCart, X, Globe, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateCartItemQuantity, removeFromCart, refreshCart, clearCart } = useCart();
  const { wishlist, removeFromWishlist, moveToCart, refreshWishlist } = useWishlist();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [movingToCart, setMovingToCart] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
  const [customerCountry, setCustomerCountry] = useState('GB');
  const [detectedLocation, setDetectedLocation] = useState('');

  // Detect customer's country for pricing display
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code || 'GB';
        setCustomerCountry(countryCode);
        setDetectedLocation(`${data.city}, ${data.country_name}`);
      } catch (error) {
        console.error('Location detection failed:', error);
        setCustomerCountry('GB');
      }
    };

    detectCountry();
  }, []);

  // Currency and shipping info based on country
  const getLocalInfo = (country: string) => {
    const info: Record<string, any> = {
      'GB': { currency: 'GBP', symbol: '£', shipping: 5.00, name: 'United Kingdom', flag: '🇬🇧' },
      'US': { currency: 'USD', symbol: '$', shipping: 15.00, name: 'United States', flag: '🇺🇸' },
      'AU': { currency: 'AUD', symbol: 'A$', shipping: 20.00, name: 'Australia', flag: '🇦🇺' },
      'CA': { currency: 'CAD', symbol: 'C$', shipping: 18.00, name: 'Canada', flag: '🇨🇦' },
      'DE': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Germany', flag: '🇩🇪' },
      'FR': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'France', flag: '🇫🇷' },
      'NZ': { currency: 'NZD', symbol: 'NZ$', shipping: 22.00, name: 'New Zealand', flag: '🇳🇿' },
      'NL': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Netherlands', flag: '🇳🇱' },
      'BE': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Belgium', flag: '🇧🇪' },
      'IT': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Italy', flag: '🇮🇹' },
      'ES': { currency: 'EUR', symbol: '€', shipping: 12.00, name: 'Spain', flag: '🇪🇸' },
      'SE': { currency: 'SEK', symbol: 'kr', shipping: 120.00, name: 'Sweden', flag: '🇸🇪' },
      'NO': { currency: 'NOK', symbol: 'kr', shipping: 130.00, name: 'Norway', flag: '🇳🇴' },
      'DK': { currency: 'DKK', symbol: 'kr', shipping: 90.00, name: 'Denmark', flag: '🇩🇰' },
      'CH': { currency: 'CHF', symbol: 'Fr', shipping: 15.00, name: 'Switzerland', flag: '🇨🇭' },
      'JP': { currency: 'JPY', symbol: '¥', shipping: 1800, name: 'Japan', flag: '🇯🇵' },
      'SG': { currency: 'SGD', symbol: 'S$', shipping: 25.00, name: 'Singapore', flag: '🇸🇬' },
      'HK': { currency: 'HKD', symbol: 'HK$', shipping: 120.00, name: 'Hong Kong', flag: '🇭🇰' },
    };
    
    return info[country] || { currency: 'GBP', symbol: '£', shipping: 15.00, name: 'International', flag: '🌍' };
  };

  const localInfo = getLocalInfo(customerCountry);

  // Convert prices to local currency for display
  const convertPrice = (priceUSD: number, targetCurrency: string) => {
    const exchangeRates: Record<string, number> = {
      'gbp': 0.79,
      'eur': 0.92,
      'aud': 1.52,
      'cad': 1.36,
      'sek': 10.50,
      'nok': 10.80,
      'dkk': 6.80,
      'chf': 0.91,
      'jpy': 150,
      'sgd': 1.35,
      'hkd': 7.80,
      'nzd': 1.65,
      'usd': 1.00
    };
    
    return priceUSD * (exchangeRates[targetCurrency.toLowerCase()] || 1);
  };

  // Calculate totals
  const cartTotalUSD = cart.items?.reduce((total, item) => total + (item.product_price * item.quantity), 0) || 0;
  const cartTotalLocal = convertPrice(cartTotalUSD, localInfo.currency);
  const shippingCost = cartTotalLocal > 100 ? 0 : localInfo.shipping;
  const taxRate = 0.08;
  const taxAmount = cartTotalLocal * taxRate;
  const totalAmount = cartTotalLocal + taxAmount + shippingCost;

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
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
              {cart.items?.length || 0} {(cart.items?.length || 0) === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Location Detection Banner */}
        {detectedLocation && (
          <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300">
                Shopping from: {detectedLocation} • Prices shown in {localInfo.currency} • Payment via PayPal in USD
              </span>
            </div>
          </div>
        )}

        {!cart.items || cart.items.length === 0 ? (
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
                            {item.product_category || 'Fashion'}
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
                          className="text-gray-400 hover:text-red-400 transition-colors p-2 disabled:opacity-50"
                        >
                          {updatingItems.has(item.id) ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={updatingItems.has(item.id) || item.quantity <= 1}
                            className="w-8 h-8 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-white font-medium min-w-[2rem] text-center">
                            {updatingItems.has(item.id) ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                            ) : (
                              item.quantity
                            )}
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
                            {localInfo.symbol}{convertPrice(item.product_price * item.quantity, localInfo.currency).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {localInfo.symbol}{convertPrice(item.product_price, localInfo.currency).toFixed(2)} each
                          </div>
                          <div className="text-xs text-gray-500">
                            ${(item.product_price * item.quantity).toFixed(2)} USD
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
                    <span>Subtotal ({cart.items?.length || 0} items)</span>
                    <div className="text-right">
                      <div>{localInfo.symbol}{cartTotalLocal.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">${cartTotalUSD.toFixed(2)} USD</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping to {localInfo.name}</span>
                    <div className="text-right">
                      <div>{shippingCost === 0 ? 'Free' : `${localInfo.symbol}${shippingCost.toFixed(2)}`}</div>
                      {shippingCost > 0 && (
                        <div className="text-xs text-gray-500">
                          Free shipping on orders over {localInfo.symbol}100
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Estimated Tax</span>
                    <div className="text-right">
                      <div>{localInfo.symbol}{taxAmount.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total ({localInfo.currency})</span>
                      <div className="text-right">
                        <div>{localInfo.symbol}{totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-gray-400 font-normal">
                          ≈ ${(cartTotalUSD + (cartTotalUSD * 0.08) + (shippingCost > 0 ? 15 : 0)).toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full btn-primary">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Secure Checkout with PayPal
                    </Button>
                  </Link>
                  
                  <Link href="/shop">
                    <Button variant="outline" className="w-full btn-secondary">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* PayPal Info */}
                <div className="mt-6 p-3 bg-blue-900/30 border border-blue-700 rounded text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#0070ba">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.028 9.028 0 0 1-.408 2.188c-1.59 8.175-7.677 8.894-11.58 8.894l-1.085 6.905h4.606c.46 0 .85-.334.926-.787l.038-.204.73-4.63.047-.254c.077-.453.467-.787.926-.787h.584c3.596 0 6.412-1.461 7.23-5.687.341-1.764.166-3.24-.698-4.256a3.67 3.67 0 0 0-.316-.268z"/>
                    </svg>
                    <span className="text-blue-400 font-medium text-sm">Secure PayPal Payment</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Pay with PayPal balance, bank account, or card • Buyer Protection included
                  </p>
                </div>

                {/* Palestine Donation Notice */}
                <div className="mt-4 bg-white text-black p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <h3 className="overspray-title text-sm">Supporting Palestine 🇵🇸</h3>
                  </div>
                  <p className="text-xs">
                    25% of your purchase will be donated to Palestinian humanitarian aid.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Section */}
        {wishlist && wishlist.length > 0 && (
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
                      className="absolute top-2 right-2 w-8 h-8 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {updatingItems.has(item.id) ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <X className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-4">
                    <Badge variant="outline" className="border-gray-600 text-gray-300 mb-2 text-xs">
                      {item.product_category || 'Fashion'}
                    </Badge>
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
                      {item.product_name}
                    </h3>
                    <div className="mb-4">
                      <div className="text-lg font-bold text-white">
                        {localInfo.symbol}{convertPrice(item.product_price, localInfo.currency).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        ${item.product_price} USD
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-400 mb-1">Size</label>
                      <select
                        value={selectedSizes[item.id] || ''}
                        onChange={(e) => setSelectedSizes(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded focus:border-gray-400 outline-none"
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
                        className="w-full bg-black border border-gray-600 text-white text-xs px-2 py-1 rounded focus:border-gray-400 outline-none"
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
                        {movingToCart.has(item.id) ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <ShoppingCart className="h-3 w-3 mr-2" />
                        )}
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
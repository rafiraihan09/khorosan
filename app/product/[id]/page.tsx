// // import Link from 'next/link';
// // import { Button } from '@/components/ui/button';
// // import ProductClient from './ProductClient';
// // import { getProduct } from '@/lib/products';

// // export async function generateStaticParams() {
// //   // Generate static params for known product IDs
// //   return [
// //     { id: '1' },
// //     { id: '2' },
// //     { id: '3' },
// //     { id: '4' },
// //     { id: '5' },
// //     { id: '6' },
// //     { id: '7' }
// //   ];
// // }

// // export default function ProductPage({ params }: { params: { id: string } }) {
// //   const { id } = params;
  
// //   // This will be handled client-side to get the most up-to-date data
// //   return <ProductClient productId={id} />;
// // }



// // --------------------------------------------------------------------------------------------------------------

// client';

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










// //---------------------------------------------------------------------------------------



// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
// import { useCart } from '@/contexts/CartContext';
// import { useAuth } from '@/contexts/AuthContext';

// // Generate static params for all product IDs
// export async function generateStaticParams() {
//   // Define all the product IDs you want to pre-generate
//   // You can expand this list as you add more products
//   const productIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  
//   return productIds.map((id) => ({
//     id: id,
//   }));
// }

// export default function ProductPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { addToCart } = useCart();
//   const { user } = useAuth();
  
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [mainImage, setMainImage] = useState(0);
//   const [addingToCart, setAddingToCart] = useState(false);

//   // Fetch product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         // Try multiple API endpoints that might exist
//         let response;
//         let productData = null;

//         // Try different possible API routes
//         const possibleRoutes = [
//           `/api/products/${id}`,
//           `/api/product/${id}`,
//           `/api/products/get/${id}`,
//           `/api/get-product/${id}`
//         ];

//         for (const route of possibleRoutes) {
//           try {
//             response = await fetch(route);
//             if (response.ok) {
//               productData = await response.json();
//               break;
//             }
//           } catch (error) {
//             console.log(`Failed to fetch from ${route}:`, error);
//             continue;
//           }
//         }

//         // If no API works, create mock data based on ID for testing
//         if (!productData) {
//           console.log('No API endpoint found, using mock data for testing');
//           productData = createMockProduct(id);
//         }

//         setProduct(productData);
        
//         // Set default selections if available
//         if (productData.sizes && productData.sizes.length > 0) {
//           setSelectedSize(productData.sizes[0]);
//         } else {
//           setSelectedSize('M'); // Default size
//         }
        
//         if (productData.colors && productData.colors.length > 0) {
//           setSelectedColor(productData.colors[0]);
//         } else {
//           setSelectedColor('Black'); // Default color
//         }

//       } catch (error) {
//         console.error('Error fetching product:', error);
//         // Create fallback product data
//         const fallbackProduct = createMockProduct(id);
//         setProduct(fallbackProduct);
//         setSelectedSize('M');
//         setSelectedColor('Black');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   // Create mock product data for testing
//   const createMockProduct = (productId) => {
//     const mockProducts = {
//       '1': {
//         id: '1',
//         name: 'Alpine Explorer Jacket',
//         price: 299,
//         originalPrice: 349,
//         description: 'Premium weather-resistant jacket for mountain adventures. Features advanced breathable technology and durable construction.',
//         image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//         images: [
//           'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//           'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
//         ],
//         sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
//         colors: ['Black', 'Navy', 'Gray', 'Olive'],
//         category: 'Mountain Range',
//         badge: 'BESTSELLER',
//         rating: 4.8,
//         reviews: 124,
//         details: {
//           material: 'Gore-Tex Pro',
//           weight: '580g',
//           waterproof: '20,000mm',
//           breathability: '20,000g/m²/24hr'
//         }
//       },
//       '2': {
//         id: '2',
//         name: 'Combat Ready Vest',
//         price: 219,
//         description: 'Multi-functional tactical vest designed for versatility and durability.',
//         image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//         images: [
//           'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
//         ],
//         sizes: ['S', 'M', 'L', 'XL'],
//         colors: ['Black', 'Olive', 'Tan'],
//         category: 'Artillery Range',
//         rating: 4.6,
//         reviews: 89
//       },
//       '3': {
//         id: '3',
//         name: 'Peak Performance Hoodie',
//         price: 149,
//         description: 'Comfortable hoodie for casual mountain wear.',
//         image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//         images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
//         sizes: ['S', 'M', 'L', 'XL', 'XXL'],
//         colors: ['Black', 'Gray', 'Navy'],
//         category: 'Mountain Range',
//         rating: 4.5,
//         reviews: 67
//       },
//       '4': {
//         id: '4',
//         name: 'Summit Trail Shirt',
//         price: 89,
//         description: 'Lightweight shirt perfect for hiking.',
//         image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//         images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
//         sizes: ['S', 'M', 'L', 'XL'],
//         colors: ['White', 'Gray', 'Green'],
//         category: 'Mountain Range',
//         rating: 4.3,
//         reviews: 45
//       }
//     };

//     return mockProducts[productId] || {
//       id: productId,
//       name: `Product ${productId}`,
//       price: 99,
//       description: 'High-quality product for your needs.',
//       image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
//       sizes: ['S', 'M', 'L', 'XL'],
//       colors: ['Black', 'White', 'Gray'],
//       category: 'General',
//       rating: 4.5,
//       reviews: 25
//     };
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       router.push('/auth');
//       return;
//     }

//     // Validate selections
//     if (product.sizes && product.sizes.length > 0 && !selectedSize) {
//       alert('Please select a size');
//       return;
//     }

//     if (product.colors && product.colors.length > 0 && !selectedColor) {
//       alert('Please select a color');
//       return;
//     }

//     setAddingToCart(true);

//     try {
//       // Call addToCart with the correct parameters
//       await addToCart({
//         product_id: product.id,
//         product_name: product.name,
//         product_price: product.price,
//         product_image: product.images ? product.images[0] : product.image,
//         product_category: product.category || 'General',
//         size: selectedSize || 'One Size',
//         color: selectedColor || 'Default',
//         quantity: quantity
//       });

//       alert('Product added to cart!');
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       alert('Failed to add product to cart. Please try again.');
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
//           <h1 className="overspray-title text-white text-2xl">Loading Product...</h1>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="overspray-title text-white text-3xl mb-4">Product Not Found</h1>
//           <p className="text-gray-300 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
//           <div className="space-x-4">
//             <Link href="/shop">
//               <Button className="btn-primary">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Shop
//               </Button>
//             </Link>
//             <Link href="/">
//               <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
//                 Go Home
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
//             Back to Shop
//           </Link>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Product Images */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
//               <img
//                 src={product.images ? product.images[mainImage] : product.image}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   // Fallback image if the main image fails to load
//                   e.target.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
//                 }}
//               />
//             </div>
            
//             {/* Thumbnail Images */}
//             {product.images && product.images.length > 1 && (
//               <div className="grid grid-cols-4 gap-2">
//                 {product.images.map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setMainImage(index)}
//                     className={`aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 transition-colors ${
//                       mainImage === index ? 'border-white' : 'border-transparent hover:border-gray-600'
//                     }`}
//                   >
//                     <img
//                       src={image}
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
//                       }}
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             <div>
//               {product.category && (
//                 <Badge variant="outline" className="border-gray-600 text-gray-300 mb-4">
//                   {product.category}
//                 </Badge>
//               )}
              
//               <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
//                 {product.name}
//               </h1>
              
//               <div className="flex items-center space-x-4 mb-4">
//                 <span className="text-2xl font-bold text-white">
//                   ${product.price ? product.price.toFixed(2) : '0.00'}
//                 </span>
//                 {product.originalPrice && product.originalPrice > product.price && (
//                   <span className="text-lg text-gray-400 line-through">
//                     ${product.originalPrice.toFixed(2)}
//                   </span>
//                 )}
//                 {product.badge && (
//                   <Badge variant="destructive" className="bg-red-600">
//                     {product.badge}
//                   </Badge>
//                 )}
//               </div>

//               {/* Rating */}
//               {product.rating && (
//                 <div className="flex items-center space-x-2 mb-4">
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-4 w-4 ${
//                           i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <span className="text-sm text-gray-400">
//                     ({product.rating}) • {product.reviews || 0} reviews
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Description */}
//             {product.description && (
//               <div>
//                 <p className="text-gray-300 leading-relaxed">
//                   {product.description}
//                 </p>
//               </div>
//             )}

//             {/* Size Selection */}
//             {product.sizes && product.sizes.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-medium text-white mb-3">Size</h3>
//                 <div className="grid grid-cols-4 gap-2">
//                   {product.sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`p-3 border rounded-lg text-center transition-colors ${
//                         selectedSize === size
//                           ? 'border-white bg-white text-black'
//                           : 'border-gray-600 text-gray-300 hover:border-gray-400'
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Color Selection */}
//             {product.colors && product.colors.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-medium text-white mb-3">Color</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {product.colors.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => setSelectedColor(color)}
//                       className={`px-4 py-2 border rounded-lg transition-colors ${
//                         selectedColor === color
//                           ? 'border-white bg-white text-black'
//                           : 'border-gray-600 text-gray-300 hover:border-gray-400'
//                       }`}
//                     >
//                       {color}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quantity */}
//             <div>
//               <h3 className="text-lg font-medium text-white mb-3">Quantity</h3>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 border border-gray-600 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
//                 >
//                   -
//                 </button>
//                 <span className="text-lg font-medium text-white w-8 text-center">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-10 h-10 border border-gray-600 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Add to Cart Button */}
//             <div className="space-y-4">
//               <Button
//                 onClick={handleAddToCart}
//                 disabled={addingToCart}
//                 className="w-full btn-primary text-lg py-3"
//               >
//                 <ShoppingCart className="h-5 w-5 mr-2" />
//                 {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-full border-gray-600 text-white hover:bg-gray-800"
//               >
//                 <Heart className="h-5 w-5 mr-2" />
//                 Add to Wishlist
//               </Button>
//             </div>

//             {/* Product Features */}
//             <div className="border-t border-gray-700 pt-6 space-y-4">
//               <div className="flex items-center space-x-3 text-gray-300">
//                 <Truck className="h-5 w-5" />
//                 <span>Free shipping on orders over $100</span>
//               </div>
//               <div className="flex items-center space-x-3 text-gray-300">
//                 <RotateCcw className="h-5 w-5" />
//                 <span>30-day return policy</span>
//               </div>
//               <div className="flex items-center space-x-3 text-gray-300">
//                 <Shield className="h-5 w-5" />
//                 <span>2-year warranty included</span>
//               </div>
//             </div>

//             {/* Product Details */}
//             {product.details && (
//               <div className="border-t border-gray-700 pt-6">
//                 <h3 className="text-lg font-medium text-white mb-4">Product Details</h3>
//                 <div className="space-y-2 text-gray-300">
//                   {Object.entries(product.details).map(([key, value]) => (
//                     <div key={key} className="flex justify-between">
//                       <span className="capitalize">{key}:</span>
//                       <span>{value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/product/[id]/page.tsx (Server Component)
import ProductClient from './ProductClient';

// Generate static params for all product IDs
export async function generateStaticParams() {
  // Define all the product IDs you want to pre-generate
  const productIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  
  return productIds.map((id) => ({
    id: id,
  }));
}

// Server component that renders the client component
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductClient id={params.id} />;
}
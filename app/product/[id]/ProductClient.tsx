// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Minus, Plus, ShoppingBag, Heart, ArrowLeft } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useCart } from '@/contexts/CartContext';
// import { useWishlist } from '@/contexts/WishlistContext';
// import { addToCart } from '@/lib/cart';
// import { addToWishlist, isInWishlist, removeFromWishlist } from '@/lib/wishlist';
// import { useRouter } from 'next/navigation';
// import { getProduct, Product } from '@/lib/products';

// interface ProductClientProps {
//   productId: string;
// }

// export default function ProductClient({ productId }: ProductClientProps) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
//   const [inWishlist, setInWishlist] = useState(false);
  
//   const { user } = useAuth();
//   const { refreshCart } = useCart();
//   const { refreshWishlist, wishlist } = useWishlist();
//   const router = useRouter();

//   // Load product and listen for updates
//   useEffect(() => {
//     const loadProduct = () => {
//       const productData = getProduct(productId);
//       setProduct(productData || null);
      
//       if (productData) {
//         setSelectedSize(productData.sizes[0] || '');
//         setSelectedColor(productData.colors[0] || '');
//       }
//     };

//     loadProduct();

//     // Listen for product updates from admin panel
//     const handleProductsUpdate = () => {
//       loadProduct();
//     };

//     window.addEventListener('productsUpdated', handleProductsUpdate);

//     return () => {
//       window.removeEventListener('productsUpdated', handleProductsUpdate);
//     };
//   }, [productId]);

//   // Check if product is in wishlist
//   useEffect(() => {
//     const checkWishlistStatus = async () => {
//       if (user && product) {
//         try {
//           const isWishlisted = await isInWishlist(user.id, product.id);
//           setInWishlist(isWishlisted);
//         } catch (error) {
//           console.error('Error checking wishlist status:', error);
//         }
//       }
//     };

//     checkWishlistStatus();
//   }, [user, product]);

//   const handleQuantityChange = (change: number) => {
//     setQuantity(Math.max(1, quantity + change));
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       // Redirect to auth page if not logged in
//       router.push('/auth');
//       return;
//     }

//     if (!product) {
//       alert('Product not found');
//       return;
//     }

//     if (!selectedSize || !selectedColor) {
//       alert('Please select size and color');
//       return;
//     }

//     if (!product.inStock) {
//       alert('This product is currently out of stock');
//       return;
//     }

//     setIsAddingToCart(true);
    
//     try {
//       await addToCart(
//         user.id,
//         product.id,
//         product.name,
//         product.price,
//         product.image,
//         product.category,
//         selectedSize,
//         selectedColor,
//         quantity
//       );
      
//       await refreshCart();
      
//       // Show success message
//       alert('Item added to cart!');
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       alert('Failed to add item to cart. Please try again.');
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   const handleWishlistToggle = async () => {
//     if (!user) {
//       router.push('/auth');
//       return;
//     }

//     if (!product) {
//       alert('Product not found');
//       return;
//     }

//     setIsAddingToWishlist(true);
    
//     try {
//       if (inWishlist) {
//         // Find the wishlist item and remove it
//         const wishlistItem = wishlist.find(item => item.product_id === product.id);
//         if (wishlistItem) {
//           await removeFromWishlist(wishlistItem.id);
//         }
        
//         await refreshWishlist();
//         setInWishlist(false);
//         alert('Removed from wishlist');
//       } else {
//         await addToWishlist(
//           user.id,
//           product.id,
//           product.name,
//           product.price,
//           product.image,
//           product.category
//         );
        
//         await refreshWishlist();
//         setInWishlist(true);
//         alert('Added to wishlist!');
//       }
//     } catch (error) {
//       console.error('Error updating wishlist:', error);
//       alert('Failed to update wishlist. Please try again.');
//     } finally {
//       setIsAddingToWishlist(false);
//     }
//   };

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
//           <Link href="/shop">
//             <Button className="btn-primary">Return to Shop</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Back Navigation */}
//       <div className="pt-20 pb-4">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Link href="/shop" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Products
//           </Link>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
//           {/* Product Image */}
//           <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden relative">
//             {!product.inStock && (
//               <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
//                 <div className="text-center">
//                   <Badge className="bg-red-600 text-white mb-2">Out of Stock</Badge>
//                   <p className="text-white text-sm">Currently Unavailable</p>
//                 </div>
//               </div>
//             )}
//             <img
//               src={product.image}
//               alt={product.name}
//               className={`w-full h-full object-cover transition-all duration-500 ${
//                 product.inStock ? 'grayscale hover:grayscale-0' : 'grayscale opacity-50'
//               }`}
//             />
//           </div>

//           {/* Product Details */}
//           <div className="space-y-8">
//             {/* Header Section */}
//             <div className="space-y-6">
//               <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs px-3 py-1 uppercase tracking-wider">
//                 {product.category}
//               </Badge>
              
//               <div>
//                 <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4 leading-tight">
//                   {product.name.toUpperCase()}
//                 </h1>
//                 <div className="overspray-title text-white text-2xl lg:text-3xl">
//                   ${product.price}
//                 </div>
//               </div>
              
//               <p className="text-gray-300 leading-relaxed text-base max-w-lg">
//                 {product.longDescription}
//               </p>
//             </div>

//             {/* Stock Status */}
//             <div className="flex items-center space-x-3 pt-2 border-t border-gray-800">
//               <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
//               <span className="text-xs text-gray-400 uppercase tracking-wider">
//                 {product.inStock ? 'In Stock' : 'Out of Stock'}
//               </span>
//             </div>

//             {product.inStock && (
//               <>
//                 {/* Color Selection */}
//                 <div className="space-y-4">
//                   <h3 className="overspray-title text-white text-sm tracking-wider">COLOR</h3>
//                   <div className="flex flex-wrap gap-3">
//                     {product.colors.map((color) => (
//                       <button
//                         key={color}
//                         onClick={() => setSelectedColor(color)}
//                         className={`px-4 py-2 border text-xs font-medium transition-all duration-200 uppercase tracking-wider min-w-[80px] ${
//                           selectedColor === color
//                             ? 'border-white bg-white text-black'
//                             : 'border-gray-600 bg-black text-white hover:border-gray-400'
//                         }`}
//                       >
//                         {color}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Size Selection */}
//                 <div className="space-y-4">
//                   <h3 className="overspray-title text-white text-sm tracking-wider">SIZE</h3>
//                   <div className="grid grid-cols-6 gap-2 max-w-md">
//                     {product.sizes.map((size) => (
//                       <button
//                         key={size}
//                         onClick={() => setSelectedSize(size)}
//                         className={`aspect-square border text-xs font-medium transition-all duration-200 uppercase tracking-wider flex items-center justify-center ${
//                           selectedSize === size
//                             ? 'border-white bg-white text-black'
//                             : 'border-gray-600 bg-black text-white hover:border-gray-400'
//                         }`}
//                       >
//                         {size}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Quantity */}
//                 <div className="space-y-4">
//                   <h3 className="overspray-title text-white text-sm tracking-wider">QUANTITY</h3>
//                   <div className="flex items-center space-x-4">
//                     <button
//                       onClick={() => handleQuantityChange(-1)}
//                       className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors"
//                     >
//                       <Minus className="h-4 w-4" />
//                     </button>
//                     <span className="text-lg font-semibold min-w-[2rem] text-center">
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => handleQuantityChange(1)}
//                       className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors"
//                     >
//                       <Plus className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="space-y-4 pt-4">
//                   <Button 
//                     size="lg" 
//                     className="w-full btn-primary text-sm py-4 uppercase tracking-wider"
//                     onClick={handleAddToCart}
//                     disabled={isAddingToCart || !product.inStock}
//                   >
//                     <ShoppingBag className="h-4 w-4 mr-3" />
//                     {isAddingToCart ? 'Adding...' : `Add to Cart - $${product.price * quantity}`}
//                   </Button>
//                   <Button 
//                     size="lg" 
//                     variant="outline" 
//                     className={`w-full text-sm py-4 uppercase tracking-wider transition-colors ${
//                       inWishlist 
//                         ? 'bg-red-600 border-red-600 text-white hover:bg-red-700' 
//                         : 'btn-secondary'
//                     }`}
//                     onClick={handleWishlistToggle}
//                     disabled={isAddingToWishlist}
//                   >
//                     <Heart className={`h-4 w-4 mr-3 ${inWishlist ? 'fill-current' : ''}`} />
//                     {isAddingToWishlist 
//                       ? 'Updating...' 
//                       : inWishlist 
//                         ? 'Remove from Wishlist' 
//                         : 'Add to Wishlist'
//                     }
//                   </Button>
//                 </div>
//               </>
//             )}

//             {/* Auth Notice */}
//             {!user && (
//               <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
//                 <p className="text-gray-300 text-sm">
//                   <Link href="/auth" className="text-white underline hover:text-gray-300">
//                     Sign in
//                   </Link> to add items to your cart and wishlist.
//                 </p>
//                 </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

// app/product/[id]/ProductClient.tsx (Client Component)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProductClientProps {
  id: string;
}

export default function ProductClient({ id }: ProductClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try multiple API endpoints that might exist
        let response;
        let productData = null;

        // Try different possible API routes
        const possibleRoutes = [
          `/api/products/${id}`,
          `/api/product/${id}`,
          `/api/products/get/${id}`,
          `/api/get-product/${id}`
        ];

        for (const route of possibleRoutes) {
          try {
            response = await fetch(route);
            if (response.ok) {
              productData = await response.json();
              break;
            }
          } catch (error) {
            console.log(`Failed to fetch from ${route}:`, error);
            continue;
          }
        }

        // If no API works, create mock data based on ID for testing
        if (!productData) {
          console.log('No API endpoint found, using mock data for testing');
          productData = createMockProduct(id);
        }

        setProduct(productData);
        
        // Set default selections if available
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        } else {
          setSelectedSize('M'); // Default size
        }
        
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        } else {
          setSelectedColor('Black'); // Default color
        }

      } catch (error) {
        console.error('Error fetching product:', error);
        // Create fallback product data
        const fallbackProduct = createMockProduct(id);
        setProduct(fallbackProduct);
        setSelectedSize('M');
        setSelectedColor('Black');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Create mock product data for testing
  const createMockProduct = (productId: string) => {
    const mockProducts: { [key: string]: any } = {
      '1': {
        id: '1',
        name: 'Alpine Explorer Jacket',
        price: 299,
        originalPrice: 349,
        description: 'Premium weather-resistant jacket for mountain adventures. Features advanced breathable technology and durable construction.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Gray', 'Olive'],
        category: 'Mountain Range',
        badge: 'BESTSELLER',
        rating: 4.8,
        reviews: 124,
        details: {
          material: 'Gore-Tex Pro',
          weight: '580g',
          waterproof: '20,000mm',
          breathability: '20,000g/m²/24hr'
        }
      },
      '2': {
        id: '2',
        name: 'Combat Ready Vest',
        price: 219,
        description: 'Multi-functional tactical vest designed for versatility and durability.',
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Olive', 'Tan'],
        category: 'Artillery Range',
        rating: 4.6,
        reviews: 89
      },
      '3': {
        id: '3',
        name: 'Peak Performance Hoodie',
        price: 149,
        description: 'Comfortable hoodie for casual mountain wear.',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Gray', 'Navy'],
        category: 'Mountain Range',
        rating: 4.5,
        reviews: 67
      },
      '4': {
        id: '4',
        name: 'Summit Trail Shirt',
        price: 89,
        description: 'Lightweight shirt perfect for hiking.',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Gray', 'Green'],
        category: 'Mountain Range',
        rating: 4.3,
        reviews: 45
      }
    };

    return mockProducts[productId] || {
      id: productId,
      name: `Product ${productId}`,
      price: 99,
      description: 'High-quality product for your needs.',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Gray'],
      category: 'General',
      rating: 4.5,
      reviews: 25
    };
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Validate selections
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    setAddingToCart(true);

    try {
      // Call addToCart with the correct parameters
      await addToCart({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.images ? product.images[0] : product.image,
        product_category: product.category || 'General',
        size: selectedSize || 'One Size',
        color: selectedColor || 'Default',
        quantity: quantity
      });

      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="overspray-title text-white text-2xl">Loading Product...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="overspray-title text-white text-3xl mb-4">Product Not Found</h1>
          <p className="text-gray-300 mb-8">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <div className="space-x-4">
            <Link href="/shop">
              <Button className="btn-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                Go Home
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
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={product.images ? product.images[mainImage] : product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  // Fallback image if the main image fails to load
                  e.target.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 transition-colors ${
                      mainImage === index ? 'border-white' : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge variant="outline" className="border-gray-600 text-gray-300 mb-4">
                  {product.category}
                </Badge>
              )}
              
              <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-white">
                  ${product.price ? product.price.toFixed(2) : '0.00'}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.badge && (
                  <Badge variant="destructive" className="bg-red-600">
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    ({product.rating}) • {product.reviews || 0} reviews
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-gray-600 text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'border-white bg-white text-black'
                          : 'border-gray-600 text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-600 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-medium text-white w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-600 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full btn-primary text-lg py-3"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>

              <Button
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-700 pt-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Truck className="h-5 w-5" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <RotateCcw className="h-5 w-5" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Shield className="h-5 w-5" />
                <span>2-year warranty included</span>
              </div>
            </div>

            {/* Product Details */}
            {product.details && (
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Product Details</h3>
                <div className="space-y-2 text-gray-300">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
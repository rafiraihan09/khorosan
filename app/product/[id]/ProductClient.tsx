'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingBag, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { addToCart } from '@/lib/cart';
import { addToWishlist, isInWishlist, removeFromWishlist } from '@/lib/wishlist';
import { useRouter } from 'next/navigation';
import { getProduct, Product } from '@/lib/products';

interface ProductClientProps {
  productId: string;
}

export default function ProductClient({ productId }: ProductClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { refreshWishlist, wishlist } = useWishlist();
  const router = useRouter();

  // Load product and listen for updates
  useEffect(() => {
    const loadProduct = () => {
      const productData = getProduct(productId);
      setProduct(productData || null);
      
      if (productData) {
        setSelectedSize(productData.sizes[0] || '');
        setSelectedColor(productData.colors[0] || '');
      }
    };

    loadProduct();

    // Listen for product updates from admin panel
    const handleProductsUpdate = () => {
      loadProduct();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [productId]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && product) {
        try {
          const isWishlisted = await isInWishlist(user.id, product.id);
          setInWishlist(isWishlisted);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [user, product]);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to auth page if not logged in
      router.push('/auth');
      return;
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      await addToCart(
        user.id,
        product.id,
        product.name,
        product.price,
        product.image,
        product.category,
        selectedSize,
        selectedColor,
        quantity
      );
      
      await refreshCart();
      
      // Show success message
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    setIsAddingToWishlist(true);
    
    try {
      if (inWishlist) {
        // Find the wishlist item and remove it
        const wishlistItem = wishlist.find(item => item.product_id === product.id);
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
        }
        
        await refreshWishlist();
        setInWishlist(false);
        alert('Removed from wishlist');
      } else {
        await addToWishlist(
          user.id,
          product.id,
          product.name,
          product.price,
          product.image,
          product.category
        );
        
        await refreshWishlist();
        setInWishlist(true);
        alert('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button className="btn-primary">Return to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Navigation */}
      <div className="pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/shop" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Product Image */}
          <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden relative">
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                <div className="text-center">
                  <Badge className="bg-red-600 text-white mb-2">Out of Stock</Badge>
                  <p className="text-white text-sm">Currently Unavailable</p>
                </div>
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                product.inStock ? 'grayscale hover:grayscale-0' : 'grayscale opacity-50'
              }`}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs px-3 py-1 uppercase tracking-wider">
                {product.category}
              </Badge>
              
              <div>
                <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4 leading-tight">
                  {product.name.toUpperCase()}
                </h1>
                <div className="overspray-title text-white text-2xl lg:text-3xl">
                  ${product.price}
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed text-base max-w-lg">
                {product.longDescription}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3 pt-2 border-t border-gray-800">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.inStock && (
              <>
                {/* Color Selection */}
                <div className="space-y-4">
                  <h3 className="overspray-title text-white text-sm tracking-wider">COLOR</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border text-xs font-medium transition-all duration-200 uppercase tracking-wider min-w-[80px] ${
                          selectedColor === color
                            ? 'border-white bg-white text-black'
                            : 'border-gray-600 bg-black text-white hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-4">
                  <h3 className="overspray-title text-white text-sm tracking-wider">SIZE</h3>
                  <div className="grid grid-cols-6 gap-2 max-w-md">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`aspect-square border text-xs font-medium transition-all duration-200 uppercase tracking-wider flex items-center justify-center ${
                          selectedSize === size
                            ? 'border-white bg-white text-black'
                            : 'border-gray-600 bg-black text-white hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-4">
                  <h3 className="overspray-title text-white text-sm tracking-wider">QUANTITY</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-semibold min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <Button 
                    size="lg" 
                    className="w-full btn-primary text-sm py-4 uppercase tracking-wider"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.inStock}
                  >
                    <ShoppingBag className="h-4 w-4 mr-3" />
                    {isAddingToCart ? 'Adding...' : `Add to Cart - $${product.price * quantity}`}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className={`w-full text-sm py-4 uppercase tracking-wider transition-colors ${
                      inWishlist 
                        ? 'bg-red-600 border-red-600 text-white hover:bg-red-700' 
                        : 'btn-secondary'
                    }`}
                    onClick={handleWishlistToggle}
                    disabled={isAddingToWishlist}
                  >
                    <Heart className={`h-4 w-4 mr-3 ${inWishlist ? 'fill-current' : ''}`} />
                    {isAddingToWishlist 
                      ? 'Updating...' 
                      : inWishlist 
                        ? 'Remove from Wishlist' 
                        : 'Add to Wishlist'
                    }
                  </Button>
                </div>
              </>
            )}

            {/* Auth Notice */}
            {!user && (
              <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 text-sm">
                  <Link href="/auth" className="text-white underline hover:text-gray-300">
                    Sign in
                  </Link> to add items to your cart and wishlist.
                </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProducts, Product } from '@/lib/products';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products and listen for updates
  useEffect(() => {
    const loadProducts = () => {
      const allProducts = getProducts();
      // Show first 4 products as featured
      setProducts(allProducts.slice(0, 4));
    };

    loadProducts();

    // Listen for product updates from admin panel
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  return (
    <section className="py-24 bg-black w-screen overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="overspray-title text-white text-4xl lg:text-6xl mb-4">
            FEATURED PRODUCTS
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Handpicked essentials from our latest collections
          </p>
        </div>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="product-card group cursor-pointer relative"
              >
                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center">
                      <Badge className="bg-red-600 text-white mb-2">Out of Stock</Badge>
                      <p className="text-white text-sm">Currently Unavailable</p>
                    </div>
                  </div>
                )}

                <div className="aspect-w-1 aspect-h-1 relative h-80 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                      product.inStock ? 'grayscale group-hover:grayscale-0' : 'grayscale opacity-50'
                    }`}
                  />
                </div>
                
                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      ${product.price}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity border-white text-white hover:bg-white hover:text-black"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the Link navigation
                        window.location.href = `/product/${product.id}`;
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/shop">
            <Button size="lg" className="btn-primary">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
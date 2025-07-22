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
          <h2 className="overspray-title text-white text-8xl lg:text-8xl mb-4">
            PRE-ORDER
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            These high quality products are made to order
          </p>
        </div>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden border border-gray-700 hover:border-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #ffffff 100%)'
                }}
              >
                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Badge className="bg-red-600 text-white mb-2">Out of Stock</Badge>
                      <p className="text-white text-sm">Currently Unavailable</p>
                    </div>
                  </div>
                )}

                <div className="aspect-w-16 aspect-h-12 relative h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      product.inStock 
                        ? 'grayscale group-hover:grayscale-0' 
                        : 'grayscale opacity-50'
                    }`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
                
                <div 
                  className="p-8"
                  style={{
                    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #ffffff 100%)'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-sm text-gray-400 uppercase tracking-wide mr-3">
                      {product.category}
                    </div>
                  </div>
                  
                  <h3 className="overspray-title text-2xl  text-white mb-4">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <span className="overspray-title text-2xl text-white">
                      ${product.price}
                    </span>
                  </div>
                  
                  <Link href={`/product/${product.id}`}>
                    <Button variant="outline" className="btn-secondary w-full overspray-title">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
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
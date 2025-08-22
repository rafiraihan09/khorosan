'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Grid, List } from 'lucide-react';
import { getProductsByCategory, Product } from '@/lib/products';

interface CategoryProductDisplayProps {
  categoryName: string;
}

export default function CategoryProductDisplay({ categoryName }: CategoryProductDisplayProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);

  // Load products and listen for updates
  useEffect(() => {
    const loadProducts = () => {
      const categoryProducts = getProductsByCategory(categoryName);
      setProducts(categoryProducts);
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
  }, [categoryName]);

  return (
    <div className="w-full">
      {/* Filters and View Toggle - Centered */}
      <div className="flex justify-between items-center mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-800">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <span className="text-sm text-gray-300">
            {products.length} products
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-white text-black' : 'border-gray-600 text-white hover:bg-gray-800'}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-white text-black' : 'border-gray-600 text-white hover:bg-gray-800'}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid - Perfectly Centered and Evenly Spaced */}
      <div className="w-full flex justify-center">
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl' 
            : 'flex flex-col space-y-8 max-w-4xl'
        } px-4 sm:px-6 lg:px-8`}>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className={`group cursor-pointer border border-gray-700 hover:border-white transition-all duration-300 hover:shadow-lg overflow-hidden relative ${
                viewMode === 'list' ? 'flex space-x-6' : ''
              }`}
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

              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-64 h-64 flex-shrink-0' : 'aspect-square'
              }`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
                    product.inStock ? 'grayscale group-hover:grayscale-0' : 'grayscale opacity-50'
                  }`}
                />
              </div>
              
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl text-white mb-3 group-hover:text-gray-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    ${product.price}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* No Products Message */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <h3 className="overspray-title text-white text-2xl mb-4">NO PRODUCTS FOUND</h3>
          <p className="text-gray-300 mb-6">No products available in this category at the moment.</p>
          <Link href="/shop">
            <Button className="btn-primary">Browse All Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
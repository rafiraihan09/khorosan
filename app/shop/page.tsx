'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  getProducts, 
  searchProducts, 
  sortProducts, 
  filterProductsByStock,
  Product 
} from '@/lib/products';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const categories = ['all', 'Mountain Range', 'Artillery Range', 'Urban Wear'];

  // Load products and listen for updates
  useEffect(() => {
    const loadProducts = () => {
      const productsData = getProducts();
      setProducts(productsData);
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

  // Filter and sort products when dependencies change
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = searchProducts(searchTerm).filter(product => 
        selectedCategory === 'all' || product.category === selectedCategory
      );
    }

    // Filter by stock status
    filtered = filterProductsByStock(filtered, showInStockOnly);

    // Sort products
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy, showInStockOnly]);

  return (
    <div className="min-h-screen bg-black text-white w-screen overflow-x-hidden">
      {/* Hero Section with OVERSPRAY Font */}
      <div className="w-screen pt-32 pb-16">
        <div className="w-full flex justify-center items-center">
          <h1 className="overspray-title text-white text-6xl lg:text-8xl text-center">
            SHOP ALL
          </h1>
        </div>
        <div className="w-full flex justify-center items-center mt-6">
          <p className="text-xl text-gray-300 text-center max-w-2xl px-4">
            Discover our complete collection of premium clothing across all categories
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 border text-sm font-medium transition-all duration-200 uppercase tracking-wider ${
                  selectedCategory === category
                    ? 'border-white bg-white text-black'
                    : 'border-gray-600 bg-black text-white hover:border-gray-400'
                }`}
              >
                {category === 'all' ? 'All Products' : category}
              </button>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                {filteredProducts.length} products
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black border border-gray-600 text-white text-sm px-3 py-2 rounded"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStockOnly"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="inStockOnly" className="text-sm text-gray-300">
                  In stock only
                </label>
              </div>
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
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full flex justify-center pb-24">
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl' 
            : 'flex flex-col space-y-8 max-w-4xl'
        } px-4 sm:px-6 lg:px-8`}>
          {filteredProducts.map((product) => (
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
                  <Badge variant="outline" className="border-gray-600 text-gray-300 mb-3 text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors">
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

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="overspray-title text-white text-2xl mb-4">NO PRODUCTS FOUND</h3>
          <p className="text-gray-300 mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setShowInStockOnly(false);
          }} className="btn-primary">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
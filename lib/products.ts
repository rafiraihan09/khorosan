// Product data management with localStorage persistence
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  longDescription: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  image: string;
}

// Initial sample products data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Alpine Explorer Jacket',
    price: 299,
    category: 'Mountain Range',
    description: 'Premium weather-resistant jacket for mountain adventures',
    longDescription: 'Crafted from high-performance materials, this jacket combines durability with comfort. Features include waterproof zippers, reinforced shoulders, and breathable mesh lining. Perfect for hiking, climbing, and outdoor exploration.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Forest Green'],
    inStock: true,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '2',
    name: 'Tactical Field Pants',
    price: 189,
    category: 'Artillery Range',
    description: 'Durable tactical pants with reinforced construction',
    longDescription: 'Military-grade construction meets everyday comfort. These pants feature reinforced knees and seat, multiple cargo pockets, and rip-resistant fabric. Ideal for tactical training and outdoor activities.',
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    colors: ['Black', 'Khaki', 'Olive Drab'],
    inStock: true,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    name: 'Urban Shield Coat',
    price: 399,
    category: 'Urban Wear',
    description: 'Sophisticated protection for city life',
    longDescription: 'The perfect blend of style and function for urban environments. Features include water-resistant coating, insulated lining, and sophisticated tailoring. Designed for the modern professional who demands both style and protection.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal', 'Navy'],
    inStock: true,
    image: 'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    name: 'Peak Performance Hoodie',
    price: 149,
    category: 'Mountain Range',
    description: 'Comfortable hoodie for casual mountain wear',
    longDescription: 'Soft cotton blend with moisture-wicking properties. Perfect for layering or wearing alone during moderate weather conditions.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gray', 'Black', 'Navy'],
    inStock: true,
    image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    name: 'Summit Trail Shirt',
    price: 89,
    category: 'Mountain Range',
    description: 'Lightweight shirt perfect for hiking',
    longDescription: 'Quick-dry fabric with UPF protection. Designed for long days on the trail with comfort and performance in mind.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Gray', 'Olive'],
    inStock: true,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '6',
    name: 'Combat Ready Vest',
    price: 219,
    category: 'Artillery Range',
    description: 'Multi-functional tactical vest',
    longDescription: 'Modular vest system with MOLLE compatibility. Features multiple attachment points and adjustable fit for maximum versatility.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Tan', 'Olive Drab'],
    inStock: false, // This one starts as out of stock
    image: 'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '7',
    name: 'Weather Guard Jacket',
    price: 259,
    category: 'Urban Wear',
    description: 'All-weather protection with style',
    longDescription: 'Versatile jacket suitable for various weather conditions. Features sealed seams, adjustable hood, and modern cut.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray'],
    inStock: true,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

// Storage key for localStorage
const PRODUCTS_STORAGE_KEY = 'khorosan_products';

// Get products from localStorage or return initial data
export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') {
    return initialProducts; // Server-side rendering fallback
  }
  
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
  }
  
  // If no stored data or error, save initial data and return it
  saveProducts(initialProducts);
  return initialProducts;
};

// Save products to localStorage
export const saveProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products } 
    }));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

// Get a single product by ID
export const getProduct = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  const products = getProducts();
  return products.filter(p => p.category === category);
};

// Update a product
export const updateProduct = (updatedProduct: Product): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  
  if (index !== -1) {
    products[index] = updatedProduct;
    saveProducts(products);
  }
};

// Add a new product
export const addProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};

// Delete a product
export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  saveProducts(filteredProducts);
};

// Toggle stock status
export const toggleProductStock = (id: string): void => {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  
  if (product) {
    product.inStock = !product.inStock;
    saveProducts(products);
  }
};

// Search products
export const searchProducts = (query: string): Product[] => {
  const products = getProducts();
  const lowercaseQuery = query.toLowerCase();
  
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Sort products
export const sortProducts = (products: Product[], sortBy: 'name' | 'price-low' | 'price-high'): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
};

// Filter products by stock status
export const filterProductsByStock = (products: Product[], inStockOnly: boolean): Product[] => {
  if (!inStockOnly) return products;
  return products.filter(p => p.inStock);
};

// Get available categories
export const getCategories = (): string[] => {
  const products = getProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));
  return categories.sort();
};

// Reset products to initial state (useful for testing)
export const resetProducts = (): void => {
  saveProducts(initialProducts);
};
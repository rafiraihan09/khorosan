// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Plus, Edit, Trash2, Eye, Lock, User, Upload, X, Image as ImageIcon, Package, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { getAllOrders, getOrderItems, updateOrderStatus } from '@/lib/orders';
// import { 
//   getProducts, 
//   addProduct, 
//   updateProduct, 
//   deleteProduct, 
//   toggleProductStock,
//   Product 
// } from '@/lib/products';

// interface Order {
//   id: string;
//   order_number: string;
//   user_id: string;
//   customer_name: string;
//   customer_email: string;
//   customer_phone: string;
//   shipping_address: any;
//   billing_address: any;
//   payment_method: string;
//   card_last_four: string;
//   total_amount: number;
//   tax_amount: number;
//   shipping_amount: number;
//   status: string;
//   created_at: string;
//   updated_at: string;
// }

// // Admin credentials - in production, this would be in environment variables
// const ADMIN_EMAIL = 'admin@khorosan.com';
// const ADMIN_PASSWORD = 'admin123';

// // Available categories
// const CATEGORIES = [
//   'Mountain Range',
//   'Artillery Range',
//   'Urban Wear'
// ];

// export default function AdminPage() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loginForm, setLoginForm] = useState({ email: '', password: '' });
//   const [loginError, setLoginError] = useState('');
//   const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [orderItems, setOrderItems] = useState<any[]>([]);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: '',
//     category: 'Mountain Range',
//     description: '',
//     longDescription: '',
//     sizes: 'XS,S,M,L,XL,XXL',
//     colors: 'Black,Navy,Gray',
//     image: ''
//   });

//   // Load products from shared data source
//   useEffect(() => {
//     const loadProducts = () => {
//       const productsData = getProducts();
//       setProducts(productsData);
//     };

//     loadProducts();

//     // Listen for product updates from other components
//     const handleProductsUpdate = () => {
//       loadProducts();
//     };

//     window.addEventListener('productsUpdated', handleProductsUpdate);
    
//     if (isAuthenticated) {
//       loadOrders();
//     }

//     return () => {
//       window.removeEventListener('productsUpdated', handleProductsUpdate);
//     };
//   }, [isAuthenticated]);

//   const loadOrders = async () => {
//     try {
//       const ordersData = await getAllOrders();
//       setOrders(ordersData);
//     } catch (error) {
//       console.error('Error loading orders:', error);
//     }
//   };

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
//       setIsAuthenticated(true);
//       setLoginError('');
//     } else {
//       setLoginError('Invalid admin credentials');
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         alert('Please select a valid image file');
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size must be less than 5MB');
//         return;
//       }

//       setImageFile(file);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadImageToCloudinary = async (file: File): Promise<string> => {
//     // In a real application, you would upload to Cloudinary, AWS S3, or your preferred service
//     // For this demo, we'll simulate an upload and return a placeholder URL
//     setUploadingImage(true);
    
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         setUploadingImage(false);
//         // Return a placeholder URL - in production, this would be the actual uploaded image URL
//         resolve('https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800');
//       }, 2000);
//     });
//   };

//   const handleAddProduct = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     let imageUrl = newProduct.image;
    
//     // Upload image if file is selected
//     if (imageFile) {
//       try {
//         imageUrl = await uploadImageToCloudinary(imageFile);
//       } catch (error) {
//         alert('Failed to upload image. Please try again.');
//         return;
//       }
//     }

//     const product: Product = {
//       id: Date.now().toString(),
//       name: newProduct.name,
//       price: parseFloat(newProduct.price),
//       category: newProduct.category,
//       description: newProduct.description,
//       longDescription: newProduct.longDescription,
//       sizes: newProduct.sizes.split(',').map(s => s.trim()),
//       colors: newProduct.colors.split(',').map(c => c.trim()),
//       inStock: true,
//       image: imageUrl || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'
//     };
    
//     // Use shared data management
//     addProduct(product);
    
//     // Refresh local state
//     setProducts(getProducts());
    
//     resetForm();
//     alert('Product added successfully!');
//   };

//   const handleEditProduct = (product: Product) => {
//     setEditingProduct(product);
//     setNewProduct({
//       name: product.name,
//       price: product.price.toString(),
//       category: product.category,
//       description: product.description,
//       longDescription: product.longDescription,
//       sizes: product.sizes.join(', '),
//       colors: product.colors.join(', '),
//       image: product.image
//     });
//     setImagePreview(product.image);
//     setShowAddProduct(true);
//   };

//   const handleUpdateProduct = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingProduct) return;

//     let imageUrl = newProduct.image;
    
//     // Upload new image if file is selected
//     if (imageFile) {
//       try {
//         imageUrl = await uploadImageToCloudinary(imageFile);
//       } catch (error) {
//         alert('Failed to upload image. Please try again.');
//         return;
//       }
//     }

//     const updatedProduct: Product = {
//       ...editingProduct,
//       name: newProduct.name,
//       price: parseFloat(newProduct.price),
//       category: newProduct.category,
//       description: newProduct.description,
//       longDescription: newProduct.longDescription,
//       sizes: newProduct.sizes.split(',').map(s => s.trim()),
//       colors: newProduct.colors.split(',').map(c => c.trim()),
//       image: imageUrl || editingProduct.image
//     };

//     // Use shared data management
//     updateProduct(updatedProduct);
    
//     // Refresh local state
//     setProducts(getProducts());
    
//     resetForm();
//     alert('Product updated successfully!');
//   };

//   const handleDeleteProduct = (id: string) => {
//     if (confirm('Are you sure you want to delete this product?')) {
//       // Use shared data management
//       deleteProduct(id);
      
//       // Refresh local state
//       setProducts(getProducts());
      
//       alert('Product deleted successfully!');
//     }
//   };

//   const handleToggleStock = (id: string) => {
//     // Use shared data management
//     toggleProductStock(id);
    
//     // Refresh local state
//     setProducts(getProducts());
//   };

//   const resetForm = () => {
//     setEditingProduct(null);
//     setNewProduct({ 
//       name: '', 
//       price: '', 
//       category: 'Mountain Range', 
//       description: '', 
//       longDescription: '',
//       sizes: 'XS,S,M,L,XL,XXL',
//       colors: 'Black,Navy,Gray',
//       image: ''
//     });
//     setImageFile(null);
//     setImagePreview('');
//     setShowAddProduct(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setImagePreview('');
//     setNewProduct({ ...newProduct, image: '' });
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleViewOrder = async (order: Order) => {
//     try {
//       const items = await getOrderItems(order.id);
//       setOrderItems(items);
//       setSelectedOrder(order);
//     } catch (error) {
//       console.error('Error loading order items:', error);
//       alert('Failed to load order details');
//     }
//   };

//   const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
//     try {
//       await updateOrderStatus(orderId, newStatus);
//       await loadOrders();
//       if (selectedOrder && selectedOrder.id === orderId) {
//         setSelectedOrder({ ...selectedOrder, status: newStatus });
//       }
//       alert('Order status updated successfully!');
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       alert('Failed to update order status');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-600';
//       case 'processing': return 'bg-blue-600';
//       case 'shipped': return 'bg-purple-600';
//       case 'delivered': return 'bg-green-600';
//       case 'cancelled': return 'bg-red-600';
//       default: return 'bg-gray-600';
//     }
//   };

//   // Admin Login Screen
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
//         <div className="w-full max-w-md px-4">
//           <div className="p-8 border border-gray-700 rounded-lg bg-black">
//             <div className="text-center mb-8">
//               <Lock className="h-12 w-12 text-white mx-auto mb-4" />
//               <h1 className="overspray-title text-white text-3xl mb-4">
//                 ADMIN ACCESS
//               </h1>
//               <p className="text-gray-300 overspray-text">
//                 Enter admin credentials to access the dashboard
//               </p>
//             </div>

//             {loginError && (
//               <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm overspray-text">
//                 {loginError}
//               </div>
//             )}

//             <form onSubmit={handleLogin} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                   Admin Email
//                 </label>
//                 <Input
//                   type="email"
//                   value={loginForm.email}
//                   onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
//                   required
//                   className="bg-black border-gray-600 text-white overspray-text"
//                   placeholder="Enter admin email"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                   Password
//                 </label>
//                 <Input
//                   type="password"
//                   value={loginForm.password}
//                   onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//                   required
//                   className="bg-black border-gray-600 text-white overspray-text"
//                   placeholder="Enter admin password"
//                 />
//               </div>

//               <Button type="submit" className="w-full btn-primary">
//                 <User className="h-4 w-4 mr-2" />
//                 Sign In as Admin
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white pt-16">
//       {/* Fixed Header */}
//       <div className="sticky top-16 z-40 bg-black border-b border-gray-700">
//         <div className="px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-2">ADMIN DASHBOARD</h1>
//               <p className="text-gray-300 overspray-text">Manage your Khorosan store</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="border-b border-gray-700">
//           <nav className="flex space-x-8 px-4 sm:px-6 lg:px-8">
//             {['products', 'categories', 'orders'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab as any)}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm capitalize overspray-text ${
//                   activeTab === tab
//                     ? 'border-white text-white'
//                     : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="h-[calc(100vh-280px)] overflow-y-auto">
//         <div className="px-4 sm:px-6 lg:px-8 py-8">
//           {/* Products Tab */}
//           {activeTab === 'products' && (
//             <div className="space-y-8">
//               <div className="flex justify-between items-center">
//                 <h2 className="overspray-title text-white text-2xl">Products ({products.length})</h2>
//                 <Button onClick={() => {
//                   setEditingProduct(null);
//                   setShowAddProduct(true);
//                 }} className="btn-primary">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Product
//                 </Button>
//               </div>

//               {/* Add/Edit Product Form */}
//               {showAddProduct && (
//                 <div className="p-6 rounded-lg border border-gray-700 mb-6 bg-black">
//                   <h3 className="overspray-title text-white text-lg mb-4">
//                     {editingProduct ? 'Edit Product' : 'Add New Product'}
//                   </h3>
//                   <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
//                     {/* Image Upload Section */}
//                     <div className="space-y-4">
//                       <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                         Product Image
//                       </label>
                      
//                       {/* Image Preview */}
//                       {imagePreview && (
//                         <div className="relative inline-block">
//                           <img
//                             src={imagePreview}
//                             alt="Product preview"
//                             className="w-32 h-32 object-cover rounded border border-gray-600"
//                           />
//                           <button
//                             type="button"
//                             onClick={removeImage}
//                             className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </div>
//                       )}
                      
//                       {/* Upload Button */}
//                       <div className="flex items-center space-x-4">
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => fileInputRef.current?.click()}
//                           className="border-gray-600 text-white hover:bg-gray-800"
//                           disabled={uploadingImage}
//                         >
//                           <Upload className="h-4 w-4 mr-2" />
//                           {uploadingImage ? 'Uploading...' : 'Upload Image'}
//                         </Button>
                        
//                         {!imagePreview && (
//                           <div className="text-sm text-gray-400">
//                             Or enter image URL below
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Image URL Input */}
//                       {!imageFile && (
//                         <Input
//                           type="url"
//                           placeholder="https://example.com/image.jpg"
//                           value={newProduct.image}
//                           onChange={(e) => {
//                             setNewProduct({ ...newProduct, image: e.target.value });
//                             setImagePreview(e.target.value);
//                           }}
//                           className="bg-black border-gray-600 text-white overspray-text"
//                         />
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                           Product Name *
//                         </label>
//                         <Input
//                           type="text"
//                           value={newProduct.name}
//                           onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                           required
//                           className="bg-black border-gray-600 text-white overspray-text"
//                           placeholder="Enter product name"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                           Price ($) *
//                         </label>
//                         <Input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           value={newProduct.price}
//                           onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//                           required
//                           className="bg-black border-gray-600 text-white overspray-text"
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                         Category *
//                       </label>
//                       <select
//                         value={newProduct.category}
//                         onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//                         className="w-full border border-gray-600 rounded-md px-3 py-2 bg-black text-white overspray-text"
//                         required
//                       >
//                         {CATEGORIES.map((category) => (
//                           <option key={category} value={category}>
//                             {category}
//                           </option>
//                         ))}
//                       </select>
//                       <p className="text-xs text-gray-400 mt-1">
//                         Select the appropriate category for this product
//                       </p>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                         Short Description *
//                       </label>
//                       <Textarea
//                         value={newProduct.description}
//                         onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//                         required
//                         className="bg-black border-gray-600 text-white overspray-text"
//                         rows={2}
//                         placeholder="Brief description for product listings"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                         Long Description *
//                       </label>
//                       <Textarea
//                         value={newProduct.longDescription}
//                         onChange={(e) => setNewProduct({ ...newProduct, longDescription: e.target.value })}
//                         required
//                         className="bg-black border-gray-600 text-white overspray-text"
//                         rows={4}
//                         placeholder="Detailed description for product page"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                           Available Sizes *
//                         </label>
//                         <Input
//                           type="text"
//                           value={newProduct.sizes}
//                           onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
//                           required
//                           className="bg-black border-gray-600 text-white overspray-text"
//                           placeholder="XS, S, M, L, XL, XXL"
//                         />
//                         <p className="text-xs text-gray-400 mt-1">
//                           Separate sizes with commas
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2 overspray-text">
//                           Available Colors *
//                         </label>
//                         <Input
//                           type="text"
//                           value={newProduct.colors}
//                           onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
//                           required
//                           className="bg-black border-gray-600 text-white overspray-text"
//                           placeholder="Black, Navy, Gray"
//                         />
//                         <p className="text-xs text-gray-400 mt-1">
//                           Separate colors with commas
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex space-x-4 pt-4">
//                       <Button 
//                         type="submit" 
//                         className="btn-primary"
//                         disabled={uploadingImage}
//                       >
//                         {uploadingImage ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
//                       </Button>
//                       <Button 
//                         type="button" 
//                         variant="outline" 
//                         onClick={resetForm}
//                         className="border-gray-600 text-white hover:bg-gray-800"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {/* Products Table */}
//               <div className="rounded-lg border border-gray-700 overflow-hidden bg-black">
//                 <div className="overflow-x-auto">
//                   <table className="w-full divide-y divide-gray-700" style={{ minWidth: '1200px' }}>
//                     <thead className="bg-gray-900">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '300px' }}>
//                           Product
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '150px' }}>
//                           Category
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '100px' }}>
//                           Price
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '150px' }}>
//                           Sizes
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '150px' }}>
//                           Colors
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '120px' }}>
//                           Stock
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '180px' }}>
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-700">
//                       {products.map((product) => (
//                         <tr key={product.id} className="hover:bg-gray-900">
//                           <td className="px-4 py-4" style={{ width: '300px' }}>
//                             <div className="flex items-center">
//                               <img 
//                                 src={product.image} 
//                                 alt={product.name}
//                                 className="h-12 w-12 object-cover rounded mr-4 flex-shrink-0"
//                               />
//                               <div className="min-w-0 flex-1">
//                                 <div className="text-sm font-medium text-white overspray-text truncate">
//                                   {product.name}
//                                 </div>
//                                 <div className="text-sm text-gray-400 truncate overspray-text">
//                                   {product.description}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap" style={{ width: '150px' }}>
//                             <Badge variant="outline" className="border-gray-600 text-gray-300 overspray-text text-xs">
//                               {product.category}
//                             </Badge>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-medium overspray-text" style={{ width: '100px' }}>
//                             ${product.price}
//                           </td>
//                           <td className="px-4 py-4" style={{ width: '150px' }}>
//                             <div className="text-sm text-gray-300 overspray-text">
//                               {product.sizes.join(', ')}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4" style={{ width: '150px' }}>
//                             <div className="text-sm text-gray-300 overspray-text">
//                               {product.colors.join(', ')}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap" style={{ width: '120px' }}>
//                             <button
//                               onClick={() => handleToggleStock(product.id)}
//                               className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium overspray-text transition-colors duration-200 ${
//                                 product.inStock
//                                   ? 'bg-green-600 text-white hover:bg-green-700'
//                                   : 'bg-red-600 text-white hover:bg-red-700'
//                               }`}
//                             >
//                               {product.inStock ? 'In Stock' : 'Out of Stock'}
//                             </button>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" style={{ width: '180px' }}>
//                             <div className="flex space-x-2 justify-start">
//                               <Button 
//                                 size="sm" 
//                                 variant="outline" 
//                                 className="border-gray-600 text-white hover:bg-gray-800 p-2 w-10 h-10 flex items-center justify-center"
//                                 onClick={() => router.push(`/product/${product.id}`)}
//                                 title="View Product"
//                               >
//                                 <Eye className="h-4 w-4" />
//                               </Button>
//                               <Button 
//                                 size="sm" 
//                                 variant="outline" 
//                                 className="border-gray-600 text-white hover:bg-gray-800 p-2 w-10 h-10 flex items-center justify-center"
//                                 onClick={() => handleEditProduct(product)}
//                                 title="Edit Product"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                               <Button 
//                                 size="sm" 
//                                 variant="outline"
//                                 onClick={() => handleDeleteProduct(product.id)}
//                                 className="border-gray-600 text-white hover:bg-gray-800 p-2 w-10 h-10 flex items-center justify-center"
//                                 title="Delete Product"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Categories Tab */}
//           {activeTab === 'categories' && (
//             <div>
//               <h2 className="overspray-title text-white text-2xl mb-6">Categories</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {CATEGORIES.map((category) => {
//                   const categoryProducts = products.filter(p => p.category === category);
//                   return (
//                     <div key={category} className="p-6 rounded-lg border border-gray-700 bg-black">
//                       <h3 className="overspray-title text-white text-lg mb-2">{category}</h3>
//                       <p className="text-gray-300 text-sm mb-4">
//                         {categoryProducts.length} products in this category
//                       </p>
//                       <div className="space-y-2">
//                         <div className="text-sm text-gray-400">
//                           In Stock: {categoryProducts.filter(p => p.inStock).length}
//                         </div>
//                         <div className="text-sm text-gray-400">
//                           Out of Stock: {categoryProducts.filter(p => !p.inStock).length}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Orders Tab */}
//           {activeTab === 'orders' && (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="overspray-title text-white text-2xl">Orders ({orders.length})</h2>
//                 <Button onClick={loadOrders} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
//                   Refresh Orders
//                 </Button>
//               </div>

//               {/* Order Details Modal */}
//               {selectedOrder && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                   <div className="bg-black border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//                     <div className="p-6">
//                       <div className="flex justify-between items-center mb-6">
//                         <h3 className="overspray-title text-white text-xl">
//                           Order #{selectedOrder.order_number}
//                         </h3>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedOrder(null)}
//                           className="border-gray-600 text-white hover:bg-gray-800"
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>

//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {/* Customer Information */}
//                         <div className="space-y-4">
//                           <div className="border border-gray-700 rounded-lg p-4">
//                             <h4 className="overspray-title text-white text-lg mb-3">Customer Information</h4>
//                             <div className="space-y-2 text-gray-300">
//                               <div className="flex items-center space-x-2">
//                                 <User className="h-4 w-4" />
//                                 <span>{selectedOrder.customer_name}</span>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <Mail className="h-4 w-4" />
//                                 <span>{selectedOrder.customer_email}</span>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <Phone className="h-4 w-4" />
//                                 <span>{selectedOrder.customer_phone}</span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="border border-gray-700 rounded-lg p-4">
//                             <h4 className="overspray-title text-white text-lg mb-3">Shipping Address</h4>
//                             <div className="flex items-start space-x-2 text-gray-300">
//                               <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
//                               <div>
//                                 <p>{selectedOrder.shipping_address.street}</p>
//                                 <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}</p>
//                                 <p>{selectedOrder.shipping_address.country}</p>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="border border-gray-700 rounded-lg p-4">
//                             <h4 className="overspray-title text-white text-lg mb-3">Payment Information</h4>
//                             <div className="space-y-2 text-gray-300">
//                               <div className="flex items-center space-x-2">
//                                 <CreditCard className="h-4 w-4" />
//                                 <span>{selectedOrder.payment_method} ending in {selectedOrder.card_last_four}</span>
//                               </div>
//                               <div className="text-sm">
//                                 Total: ${selectedOrder.total_amount.toFixed(2)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Order Items */}
//                         <div className="border border-gray-700 rounded-lg p-4">
//                           <h4 className="overspray-title text-white text-lg mb-3">Order Items</h4>
//                           <div className="space-y-3 max-h-64 overflow-y-auto">
//                             {orderItems.map((item) => (
//                               <div key={item.id} className="flex items-center space-x-3 p-2 border border-gray-800 rounded">
//                                 <img
//                                   src={item.product_image}
//                                   alt={item.product_name}
//                                   className="w-12 h-12 object-cover rounded"
//                                 />
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-sm font-medium text-white truncate">{item.product_name}</p>
//                                   <p className="text-xs text-gray-400">{item.size} • {item.color}</p>
//                                   <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
//                                 </div>
//                                 <p className="text-sm font-medium text-white">${item.subtotal.toFixed(2)}</p>
//                               </div>
//                             ))}
//                           </div>
                          
//                           <div className="border-t border-gray-700 mt-4 pt-3 space-y-1">
//                             <div className="flex justify-between text-sm text-gray-300">
//                               <span>Subtotal:</span>
//                               <span>${(selectedOrder.total_amount - selectedOrder.tax_amount - selectedOrder.shipping_amount).toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-sm text-gray-300">
//                               <span>Shipping:</span>
//                               <span>${selectedOrder.shipping_amount.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-sm text-gray-300">
//                               <span>Tax:</span>
//                               <span>${selectedOrder.tax_amount.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-2">
//                               <span>Total:</span>
//                               <span>${selectedOrder.total_amount.toFixed(2)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Order Status Update */}
//                       <div className="mt-6 border-t border-gray-700 pt-4">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <span className="text-gray-300 mr-3">Current Status:</span>
//                             <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
//                               {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
//                             </Badge>
//                           </div>
//                           <div className="flex space-x-2">
//                             {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
//                               <Button
//                                 key={status}
//                                 size="sm"
//                                 variant={selectedOrder.status === status ? 'default' : 'outline'}
//                                 onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)}
//                                 className={selectedOrder.status === status 
//                                   ? `${getStatusColor(status)} text-white` 
//                                   : 'border-gray-600 text-white hover:bg-gray-800'
//                                 }
//                               >
//                                 {status.charAt(0).toUpperCase() + status.slice(1)}
//                               </Button>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Orders Table */}
//               <div className="rounded-lg border border-gray-700 overflow-hidden bg-black">
//                 <div className="overflow-x-auto">
//                   <table className="w-full divide-y divide-gray-700">
//                     <thead className="bg-gray-900">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
//                           Order #
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
//                           Customer
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
//                           Date
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
//                           Total
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
//                           Status
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-700">
//                       {orders.map((order) => (
//                         <tr key={order.id} className="hover:bg-gray-900">
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
//                             #{order.order_number}
//                           </td>
//                           <td className="px-4 py-4">
//                             <div>
//                               <div className="text-sm font-medium text-white">{order.customer_name}</div>
//                               <div className="text-sm text-gray-400">{order.customer_email}</div>
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
//                             {new Date(order.created_at).toLocaleDateString()}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
//                             ${order.total_amount.toFixed(2)}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap">
//                             <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
//                               {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                             </Badge>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleViewOrder(order)}
//                               className="border-gray-600 text-white hover:bg-gray-800"
//                             >
//                               <Eye className="h-4 w-4 mr-1" />
//                               View
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {orders.length === 0 && (
//                 <div className="text-center py-8">
//                   <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
//                   <h3 className="overspray-title text-white text-lg mb-2">No Orders Yet</h3>
//                   <p className="text-gray-400">Orders will appear here once customers start purchasing</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Lock, User, Upload, X, Image as ImageIcon, Package, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllOrders, getOrderItems, updateOrderStatus } from '@/lib/orders';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProductStock,
  Product 
} from '@/lib/products';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  billing_address: any;
  payment_method: string;
  card_last_four: string;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Admin credentials - in production, this would be in environment variables
const ADMIN_EMAIL = 'admin@khorosan.com';
const ADMIN_PASSWORD = 'admin123';

// Available categories
const CATEGORIES = [
  'Mountain Range',
  'Artillery Range',
  'Urban Wear'
];

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Mountain Range',
    description: '',
    longDescription: '',
    sizes: 'XS,S,M,L,XL,XXL',
    colors: 'Black,Navy,Gray',
    image: ''
  });

  // Load products from shared data source
  useEffect(() => {
    const loadProducts = () => {
      const productsData = getProducts();
      setProducts(productsData);
    };

    loadProducts();

    // Listen for product updates from other components
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    if (isAuthenticated) {
      loadOrders();
    }

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid admin credentials');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fixed image upload function
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    setUploadingImage(true);
    
    try {
      // For development, create a blob URL for immediate use
      const blobUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadingImage(false);
      
      // Return the blob URL - in production, this would be your uploaded image URL
      return blobUrl;
      
    } catch (error) {
      setUploadingImage(false);
      throw new Error('Failed to upload image');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = newProduct.image;
    
    // Upload image if file is selected
    if (imageFile) {
      try {
        imageUrl = await uploadImageToCloudinary(imageFile);
      } catch (error) {
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const product: Product = {
      id: `product-${Date.now()}`, // Fixed ID generation for dynamic routing
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      longDescription: newProduct.longDescription,
      sizes: newProduct.sizes.split(',').map(s => s.trim()),
      colors: newProduct.colors.split(',').map(c => c.trim()),
      inStock: true,
      image: imageUrl || 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    
    // Use shared data management
    addProduct(product);
    
    // Refresh local state
    setProducts(getProducts());
    
    // Trigger update event for other components
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    
    resetForm();
    alert('Product added successfully!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      longDescription: product.longDescription,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      image: product.image
    });
    setImagePreview(product.image);
    setShowAddProduct(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let imageUrl = newProduct.image;
    
    // Upload new image if file is selected
    if (imageFile) {
      try {
        imageUrl = await uploadImageToCloudinary(imageFile);
      } catch (error) {
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      longDescription: newProduct.longDescription,
      sizes: newProduct.sizes.split(',').map(s => s.trim()),
      colors: newProduct.colors.split(',').map(c => c.trim()),
      image: imageUrl || editingProduct.image
    };

    // Use shared data management
    updateProduct(updatedProduct);
    
    // Refresh local state
    setProducts(getProducts());
    
    // Trigger update event for other components
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    
    resetForm();
    alert('Product updated successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // Use shared data management
      deleteProduct(id);
      
      // Refresh local state
      setProducts(getProducts());
      
      // Trigger update event for other components
      window.dispatchEvent(new CustomEvent('productsUpdated'));
      
      alert('Product deleted successfully!');
    }
  };

  const handleToggleStock = (id: string) => {
    // Use shared data management
    toggleProductStock(id);
    
    // Refresh local state
    setProducts(getProducts());
    
    // Trigger update event for other components
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  };

  const resetForm = () => {
    setEditingProduct(null);
    setNewProduct({ 
      name: '', 
      price: '', 
      category: 'Mountain Range', 
      description: '', 
      longDescription: '',
      sizes: 'XS,S,M,L,XL,XXL',
      colors: 'Black,Navy,Gray',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
    setShowAddProduct(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setNewProduct({ ...newProduct, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const items = await getOrderItems(order.id);
      setOrderItems(items);
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error loading order items:', error);
      alert('Failed to load order details');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'processing': return 'bg-blue-600';
      case 'shipped': return 'bg-purple-600';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  // Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
        <div className="w-full max-w-md px-4">
          <div className="p-8 border border-gray-700 rounded-lg bg-black">
            <div className="text-center mb-8">
              <Lock className="h-12 w-12 text-white mx-auto mb-4" />
              <h1 className="overspray-title text-white text-3xl mb-4">
                ADMIN ACCESS
              </h1>
              <p className="text-gray-300 overspray-text">
                Enter admin credentials to access the dashboard
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm overspray-text">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2 overspray-text">
                  Admin Email
                </label>
                <Input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  className="bg-black border-gray-600 text-white overspray-text"
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 overspray-text">
                  Password
                </label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  className="bg-black border-gray-600 text-white overspray-text"
                  placeholder="Enter admin password"
                />
              </div>

              <Button type="submit" className="w-full btn-primary">
                <User className="h-4 w-4 mr-2" />
                Sign In as Admin
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {/* Fixed Header */}
      <div className="sticky top-16 z-40 bg-black border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-2">ADMIN DASHBOARD</h1>
              <p className="text-gray-300 overspray-text">Manage your Khorosan store</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-4 sm:px-6 lg:px-8">
            {['products', 'categories', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize overspray-text ${
                  activeTab === tab
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="h-[calc(100vh-280px)] overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="overspray-title text-white text-2xl">Products ({products.length})</h2>
                <Button onClick={() => {
                  setEditingProduct(null);
                  setShowAddProduct(true);
                }} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Add/Edit Product Form */}
              {showAddProduct && (
                <div className="p-6 rounded-lg border border-gray-700 mb-6 bg-black">
                  <h3 className="overspray-title text-white text-lg mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-white mb-2 overspray-text">
                        Product Image
                      </label>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-32 h-32 object-cover rounded border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <div className="flex items-center space-x-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-gray-600 text-white hover:bg-gray-800"
                          disabled={uploadingImage}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </Button>
                        
                        {!imagePreview && (
                          <div className="text-sm text-gray-400">
                            Or enter image URL below
                          </div>
                        )}
                      </div>
                      
                      {/* Image URL Input */}
                      {!imageFile && (
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={newProduct.image}
                          onChange={(e) => {
                            setNewProduct({ ...newProduct, image: e.target.value });
                            setImagePreview(e.target.value);
                          }}
                          className="bg-black border-gray-600 text-white overspray-text"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 overspray-text">
                          Product Name *
                        </label>
                        <Input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          required
                          className="bg-black border-gray-600 text-white overspray-text"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 overspray-text">
                          Price ($) *
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          required
                          className="bg-black border-gray-600 text-white overspray-text"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 overspray-text">
                        Category *
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full border border-gray-600 rounded-md px-3 py-2 bg-black text-white overspray-text"
                        required
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        Select the appropriate category for this product
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 overspray-text">
                        Short Description *
                      </label>
                      <Textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        required
                        className="bg-black border-gray-600 text-white overspray-text"
                        rows={2}
                        placeholder="Brief description for product listings"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2 overspray-text">
                        Long Description *
                      </label>
                      <Textarea
                        value={newProduct.longDescription}
                        onChange={(e) => setNewProduct({ ...newProduct, longDescription: e.target.value })}
                        required
                        className="bg-black border-gray-600 text-white overspray-text"
                        rows={4}
                        placeholder="Detailed description for product page"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 overspray-text">
                          Available Sizes *
                        </label>
                        <Input
                          type="text"
                          value={newProduct.sizes}
                          onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                          required
                          className="bg-black border-gray-600 text-white overspray-text"
                          placeholder="XS, S, M, L, XL, XXL"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Separate sizes with commas
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2 overspray-text">
                          Available Colors *
                        </label>
                        <Input
                          type="text"
                          value={newProduct.colors}
                          onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                          required
                          className="bg-black border-gray-600 text-white overspray-text"
                          placeholder="Black, Navy, Gray"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Separate colors with commas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                      <Button 
                        type="submit" 
                        className="btn-primary"
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? 'Processing...' : editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetForm}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="rounded-lg border border-gray-700 overflow-hidden bg-black">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-700" style={{ minWidth: '1200px' }}>
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '300px' }}>
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '150px' }}>
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '100px' }}>
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '150px' }}>
                          Sizes
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '150px' }}>
                          Colors
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '120px' }}>
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text" style={{ width: '180px' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-900">
                          <td className="px-4 py-4" style={{ width: '300px' }}>
                            <div className="flex items-center">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded mr-4 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-white overspray-text truncate">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-400 truncate overspray-text">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap" style={{ width: '150px' }}>
                            <Badge variant="outline" className="border-gray-600 text-gray-300 overspray-text text-xs">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-medium overspray-text" style={{ width: '100px' }}>
                            ${product.price}
                          </td>
                          <td className="px-4 py-4" style={{ width: '150px' }}>
                            <div className="text-sm text-gray-300 overspray-text">
                              {product.sizes.join(', ')}
                            </div>
                          </td>
                          <td className="px-4 py-4" style={{ width: '150px' }}>
                            <div className="text-sm text-gray-300 overspray-text">
                              {product.colors.join(', ')}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap" style={{ width: '120px' }}>
                            <button
                              onClick={() => handleToggleStock(product.id)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium overspray-text transition-colors duration-200 ${
                                product.inStock
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" style={{ width: '180px' }}>
                            <div className="flex space-x-2 justify-start">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-gray-600 text-white hover:bg-gray-800 p-2 w-10 h-10 flex items-center justify-center"
                                onClick={() => router.push(`/product/${product.id}`)}
                                title="View Product"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-gray-600 text-white hover:bg-gray-800 p-2 w-10 h-10 flex items-center justify-center"
                                onClick={() => handleEditProduct(product)}
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="border-gray-600 text-white hover:bg-gray-800 p-2 w-10 h-10 flex items-center justify-center"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div>
              <h2 className="overspray-title text-white text-2xl mb-6">Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CATEGORIES.map((category) => {
                  const categoryProducts = products.filter(p => p.category === category);
                  return (
                    <div key={category} className="p-6 rounded-lg border border-gray-700 bg-black">
                      <h3 className="overspray-title text-white text-lg mb-2">{category}</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {categoryProducts.length} products in this category
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">
                          In Stock: {categoryProducts.filter(p => p.inStock).length}
                        </div>
                        <div className="text-sm text-gray-400">
                          Out of Stock: {categoryProducts.filter(p => !p.inStock).length}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="overspray-title text-white text-2xl">Orders ({orders.length})</h2>
                <Button onClick={loadOrders} variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Refresh Orders
                </Button>
              </div>

              {/* Order Details Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-black border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="overspray-title text-white text-xl">
                          Order #{selectedOrder.order_number}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(null)}
                          className="border-gray-600 text-white hover:bg-gray-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="space-y-4">
                          <div className="border border-gray-700 rounded-lg p-4">
                            <h4 className="overspray-title text-white text-lg mb-3">Customer Information</h4>
                            <div className="space-y-2 text-gray-300">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{selectedOrder.customer_name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>{selectedOrder.customer_email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{selectedOrder.customer_phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-700 rounded-lg p-4">
                            <h4 className="overspray-title text-white text-lg mb-3">Shipping Address</h4>
                            <div className="flex items-start space-x-2 text-gray-300">
                              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                              <div>
                                <p>{selectedOrder.shipping_address.street}</p>
                                <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}</p>
                                <p>{selectedOrder.shipping_address.country}</p>
                              </div>
                            </div>
                          </div>

                          <div className="border border-gray-700 rounded-lg p-4">
                            <h4 className="overspray-title text-white text-lg mb-3">Payment Information</h4>
                            <div className="space-y-2 text-gray-300">
                              <div className="flex items-center space-x-2">
                                <CreditCard className="h-4 w-4" />
                                <span>{selectedOrder.payment_method} ending in {selectedOrder.card_last_four}</span>
                              </div>
                              <div className="text-sm">
                                Total: ${selectedOrder.total_amount.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border border-gray-700 rounded-lg p-4">
                          <h4 className="overspray-title text-white text-lg mb-3">Order Items</h4>
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {orderItems.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 p-2 border border-gray-800 rounded">
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">{item.product_name}</p>
                                  <p className="text-xs text-gray-400">{item.size} • {item.color}</p>
                                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-white">${item.subtotal.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-gray-700 mt-4 pt-3 space-y-1">
                            <div className="flex justify-between text-sm text-gray-300">
                              <span>Subtotal:</span>
                              <span>${(selectedOrder.total_amount - selectedOrder.tax_amount - selectedOrder.shipping_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                              <span>Shipping:</span>
                              <span>${selectedOrder.shipping_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                              <span>Tax:</span>
                              <span>${selectedOrder.tax_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white border-t border-gray-700 pt-2">
                              <span>Total:</span>
                              <span>${selectedOrder.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Status Update */}
                      <div className="mt-6 border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-300 mr-3">Current Status:</span>
                            <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                              {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={selectedOrder.status === status ? 'default' : 'outline'}
                                onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)}
                                className={selectedOrder.status === status 
                                  ? `${getStatusColor(status)} text-white` 
                                  : 'border-gray-600 text-white hover:bg-gray-800'
                                }
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Table */}
              <div className="rounded-lg border border-gray-700 overflow-hidden bg-black">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
                          Order #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider overspray-text">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-900">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                            #{order.order_number}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <div className="text-sm font-medium text-white">{order.customer_name}</div>
                              <div className="text-sm text-gray-400">{order.customer_email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                            ${order.total_amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewOrder(order)}
                              className="border-gray-600 text-white hover:bg-gray-800"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {orders.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="overspray-title text-white text-lg mb-2">No Orders Yet</h3>
                  <p className="text-gray-400">Orders will appear here once customers start purchasing</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
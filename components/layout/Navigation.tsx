'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, User, Home, Mountain, Target, Shield, Store, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'Mountain Range', href: '/category/mountain-range', icon: Mountain },
    { name: 'Artillery Range', href: '/category/artillery-range', icon: Target },
    { name: 'Urban Wear', href: '/category/urban-wear', icon: Shield },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      setShowAdminMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@khorosan.com';

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setShowAdminMenu(false);
      }
    };

    if (showUserMenu || showAdminMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showAdminMenu]);

  // Close menus when route changes
  useEffect(() => {
    setShowUserMenu(false);
    setShowAdminMenu(false);
  }, []);

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800 fixed top-0 w-full z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Home Logo - Left */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Home className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-lg tracking-wider hidden sm:block">KHOROSAN</span>
            </Link>
          </div>

          {/* Center Navigation - Categories with Icons + Shop All */}
          <div className="hidden lg:flex items-center justify-center space-x-8 flex-1">
            <Link
              href="/shop"
              className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap group"
            >
              <Store className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Shop All</span>
            </Link>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap group"
                >
                  <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Navigation */}
          <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
            <Link
              href="/about"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Contact
            </Link>
            
            <div className="flex items-center space-x-3 ml-4 border-l border-gray-700 pl-4">
              {/* User Section */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-md hover:bg-gray-800"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{getUserDisplayName()}</span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-gray-300">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Orders
                      </Link>
                      {/* Show sign out for all users in user dropdown */}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-gray-800 p-2">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-gray-800 p-2 relative">
                  <ShoppingBag className="h-4 w-4" />
                  {cart.totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-black">
                      {cart.totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Admin Dropdown */}
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="border border-gray-600 text-gray-300 hover:bg-white hover:text-black transition-colors text-xs px-3 py-1 rounded"
                >
                  Admin
                </button>

                {/* Admin Dropdown Menu */}
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg py-2 z-50">
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                    {/* Show sign out option for all logged-in users in admin dropdown */}
                    {user && (
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-gray-800 ml-4"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-black/95 backdrop-blur-sm">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link
                href="/shop"
                className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-3 text-base font-medium border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Store className="h-5 w-5" />
                <span>Shop All</span>
              </Link>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-3 text-base font-medium border-b border-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{category.name}</span>
                  </Link>
                );
              })}
              <Link
                href="/about"
                className="text-gray-300 hover:text-white block px-3 py-3 text-base font-medium border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white block px-3 py-3 text-base font-medium border-b border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t border-gray-800 mt-4">
                {/* Mobile User Section */}
                {user ? (
                  <div className="space-y-3">
                    <div className="px-3 py-2 bg-gray-900 rounded">
                      <p className="text-sm text-gray-300">Signed in as</p>
                      <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-3 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-3 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Orders</span>
                    </Link>
                    
                    {/* Mobile Admin Section */}
                    <Link
                      href="/admin"
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-3 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-3 text-base font-medium w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 p-3 w-full justify-start">
                      <User className="h-5 w-5 mr-3" />
                      Sign In
                    </Button>
                  </Link>
                )}

                {/* Mobile Cart */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-800 mt-4">
                  <Link href="/cart">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 p-3 relative">
                      <ShoppingBag className="h-5 w-5" />
                      {cart.totalItems > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-black">
                          {cart.totalItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8">
        
        {/* Main KHOROSAN Logo */}
        <div className="mb-6 mt-20">
          <img 
            src="/Screenshot 2025-06-11 005118.png" 
            alt="KHOROSAN" 
            className="w-full h-auto object-contain"
            style={{ 
              maxHeight: '750px',
              minHeight: '300px'
            }}
          />
        </div>

        {/* Color Bar */}
        <div className="mb-6">
          <div className="w-20 h-1.5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 mx-auto"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/shop">
            <Button 
              size="lg" 
              className="bg-white text-black px-8 py-3 text-sm font-medium tracking-wide"
            >
              SHOP NOW →
            </Button>
          </Link>
          <Link href="/about">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white hover:border-gray-400 hover:bg-transparent px-8 py-3 text-sm font-medium tracking-wide"
            >
              OUR STORY
            </Button>
          </Link>
        </div>

        {/* Palestine Support Message */}
        <div className="mb-12">
          <div className="bg-black text-white p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-center">
              <h2 className="overspray-title text-2xl sm:text-3xl lg:text-4xl font-white tracking-wider text-center">
                25% OF ALL PROFITS GO TO PALESTINE
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
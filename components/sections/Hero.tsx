'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8">
        
        {/* MATW Logo - Small and positioned top center
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <img 
            src="/matw-logo.png" 
            alt="MATW Project" 
            className="h-16 w-auto"
          />
        // </div> */}

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

        {/* Subtitle - Made Wider */}
        <div className="mb-12 max-w-5xl mx-auto">
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Discover our curated collection of premium clothing designed for the modern adventurer. From mountain peaks to urban landscapes.
          </p>
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
            <div className="flex items-center justify-center space-x-4 mb-4">
              <h2 className="overspray-title text-8xl sm:text-8xl lg:text-4xl font-white tracking-wider text-center max-w-5xl mx-auto">
                25% OF ALL PROFITS GO TO PALESTINE
              </h2>
            </div>
            <div className="flex justify-center mt-6">
              <img 
                src="/matw-logo.png" 
                alt="MATW Project" 
                className="h-350 w-350"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
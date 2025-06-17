import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Centered Logo using actual image */}
        <div className="mb-12">
          <div className="mb-6">
            <img 
              src="/Screenshot 2025-06-11 005118.png" 
              alt="KHOROSAN" 
              className="mx-auto max-w-full h-auto"
              style={{ maxHeight: '450px' }}
            />
          </div>
          <div className="glitch-underline w-32 h-1 bg-white mx-auto mb-8"></div>
        </div>

        {/* Subtitle and Description with subtle effects */}
        <div className="space-y-8 relative">
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Discover our curated collection of premium clothing designed for the modern adventurer. 
            From mountain peaks to urban landscapes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="btn-primary group">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="btn-secondary">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
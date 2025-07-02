import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mountain, Target, Shield } from 'lucide-react';

const CategoryShowcase = () => {
  const categories = [
    {
      name: 'Mountain Range',
      description: 'Built for adventure and exploration',
      icon: Mountain,
      href: '/category/mountain-range',
      image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      name: 'Artillery Range',
      description: 'Tactical precision meets modern style',
      icon: Target,
      href: '/category/artillery-range',
      image: 'arabic.jpg'
    },
    {
      name: 'Urban Wear',
      description: 'Protection without compromise',
      icon: Shield,
      href: '/category/urban-wear',
      image: 'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <section className="py-24 bg-black w-screen overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="overspray-title text-white text-8xl lg:text-8xl mb-4">
            OUR COLLECTIONS
          </h2>
          <p className="text-xl text-gray-300 max-w-8xl mx-auto">
            Three distinct lines designed for different adventures and lifestyles
          </p>
        </div>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl w-full">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  className="group relative overflow-hidden border border-gray-700 hover:border-white transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #000000 0%, #333333 50%, #ffffff 100%)'
                  }}
                >
                  <div className="aspect-w-16 aspect-h-12 relative h-64">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
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
                      <IconComponent className="h-8 w-8 text-white mr-3" />
                      <h3 className="text-2xl text-white">
                        {category.name}
                      </h3>
                    </div>
                    
                    <p className="text-white-300 mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <Link href={category.href}>
                      <Button variant="outline" className="btn-secondary w-full">
                        Explore Collection
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
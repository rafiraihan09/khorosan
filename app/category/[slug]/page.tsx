import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CategoryProductDisplay from '@/components/category/CategoryProductDisplay';

const categoryData = {
  'mountain-range': {
    title: 'MOUNTAIN RANGE',
    description: 'Built for adventure and exploration in the great outdoors',
    category: 'Mountain Range'
  },
  'artillery-range': {
    title: 'ARTILLERY RANGE',
    description: 'Tactical precision meets modern style and functionality',
    category: 'Artillery Range'
  },
  'urban-wear': {
    title: 'URBAN WEAR',
    description: 'Protection without compromise for urban and outdoor environments',
    category: 'Urban Wear'
  }
};

export async function generateStaticParams() {
  return [
    { slug: 'mountain-range' },
    { slug: 'artillery-range' },
    { slug: 'urban-wear' }
  ];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Fetch category data directly in the server component
  const category = categoryData[slug as keyof typeof categoryData];

  if (!category) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
          <Link href="/">
            <Button className="btn-primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white w-screen overflow-x-hidden">
      {/* OVERSPRAY Font Category Header - Absolutely Full Width */}
      <div className="w-screen pt-32 pb-16">
        <div className="w-full flex justify-center items-center">
          <h1 className="overspray-title text-white text-6xl lg:text-8xl text-center">
            {category.title}
          </h1>
        </div>
        <div className="w-full flex justify-center items-center mt-6">
          <p className="text-xl text-gray-300 text-center max-w-2xl px-4">
            {category.description}
          </p>
        </div>
      </div>

      {/* Products Section - Absolutely Full Width */}
      <CategoryProductDisplay categoryName={category.category} />
    </div>
  );
}
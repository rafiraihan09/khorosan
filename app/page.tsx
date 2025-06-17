import Hero from '@/components/sections/Hero';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CategoryShowcase from '@/components/sections/CategoryShowcase';
import Newsletter from '@/components/sections/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}
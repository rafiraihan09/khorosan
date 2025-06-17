import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductClient from './ProductClient';
import { getProduct } from '@/lib/products';

export async function generateStaticParams() {
  // Generate static params for known product IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' }
  ];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // This will be handled client-side to get the most up-to-date data
  return <ProductClient productId={id} />;
}
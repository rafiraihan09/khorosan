// app/product/[id]/page.tsx (Server Component)
import ProductClient from './ProductClient';

// Generate static params for all product IDs
export async function generateStaticParams() {
  // Define all the product IDs you want to pre-generate
  const productIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  
  return productIds.map((id) => ({
    id: id,
  }));
}

// Server component that renders the client component
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductClient id={params.id} />;
}
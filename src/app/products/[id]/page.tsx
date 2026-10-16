export const instant = false;

import AddToCartButton from './AddToCartButton';
import FavoriteButton from './FavoriteButton';
import { notFound } from 'next/navigation';


type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const response = await fetch(
  'http://localhost:3000/api/products',
);

  if (response.status === 404) {
  notFound();
}

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const products: Product[] = await response.json();

const product = products.find(
  (item) => item.id === Number(id),
);

if (!product) {
  notFound();
}

  return (
    <main>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <FavoriteButton />
      <br />
      <AddToCartButton productName={product.title} />
    </main>
  );
}
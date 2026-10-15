export const instant = false;

import AddToCartButton from './AddToCartButton';
import FavoriteButton from './FavoriteButton';

type Product = {
  id: number;
  title: string;
  price: number;
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const product: Product = await response.json();

  return (
    <main>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
<FavoriteButton />
<br></br>
<AddToCartButton productName={product.title} />
    </main>
  );
}
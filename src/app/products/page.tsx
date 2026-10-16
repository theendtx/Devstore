
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    'https://dummyjson.com/products?limit=20'
  );

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  const data: ProductsResponse = await response.json();

  return data.products;
}

export default function ProductsPage() {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <main>
        <h1>Products</h1>
        <p>Loading products...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <h1>Products</h1>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>
          Try again
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>Products</h1>

      <button
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? 'Refreshing...' : 'Refresh products'}
      </button>

      {(products ?? []).length === 0 ? (
        <p>No products found.</p>
      ) : (
        (products ?? []).map((product) => (
          <div key={product.id}>
            <Link href={`/products/${product.id}`}>
              <img
                src={product.thumbnail}
                alt={product.title}
                width={100}
                height={100}
              />
              <h2>{product.title}</h2>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
            </Link>
          </div>
        ))
      )}
    </main>
  );
}

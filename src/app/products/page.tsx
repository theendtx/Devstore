
'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
};

async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    'https://dummyjson.com/products?limit=100'
  );

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(urlSearch);

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // URL өзгерсе, іздеу өрісін синхрондау
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Жазу тоқтағаннан кейін 300 мс күту
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set('search', search.trim());
      } else {
        params.delete('search');
      }

      const query = params.toString();
      const nextUrl = query ? `/products?${query}` : '/products';

      if (nextUrl !== `/products?${searchParams.toString()}`) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, router, searchParams]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(urlSearch.toLowerCase())
  );

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <main>
      <h1>Products</h1>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products..."
      />

      <p>Found: {filteredProducts.length}</p>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product.id}>
            <Link href={`/products/${product.id}`}>
              <h2>{product.title}</h2>
              <p>${product.price}</p>
            </Link>
          </div>
        ))
      )}
    </main>
  );
}

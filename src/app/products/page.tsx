
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
  total: number;
  skip: number;
  limit: number;
};

async function getProducts(): Promise<Product[]> {
  const response = await fetch('https://dummyjson.com/products?limit=100');

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const sort = searchParams.get('sort') ?? 'default';
  const requestedPage = Number(searchParams.get('page') ?? '1');
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;

  const [search, setSearch] = useState(urlSearch);

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // URL өзгерсе, іздеу өрісін синхрондау
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Іздеу мәтінін 300 мс өткен соң URL-ге жазу
 

useEffect(() => {
  const value = search.trim();

  if (value === urlSearch) return;

  const timer = setTimeout(() => {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    params.delete('page');

    const query = params.toString();

    router.replace(query ? `/products?${query}` : '/products', {
      scroll: false,
    });
  }, 300);

  return () => clearTimeout(timer);
}, [search, urlSearch, router]);


 function updateParam(key: string, value: string) {
  const params = new URLSearchParams(searchParams.toString());

  if (value && value !== 'all' && value !== 'default') {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  // Категория немесе сұрыптау өзгерсе, бірінші бетке қайту
  if (key !== 'page') {
    params.delete('page');
  }

  const query = params.toString();

  router.push(query ? `/products?${query}` : '/products', {
    scroll: false,
  });
}

  const categories = [...new Set(products.map((product) => product.category))];

  // 1. Іздеу
  let filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(urlSearch.trim().toLowerCase())
  );

  // 2. Категория бойынша сүзу
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  // 3. Баға бойынша сұрыптау
  if (sort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'title-asc') {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  // 4. Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE
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

      <select
        value={category}
        onChange={(event) => updateParam('category', event.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(event) => updateParam('sort', event.target.value)}
      >
        <option value="default">Default order</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="title-asc">Name: A–Z</option>
      </select>

      <p>Found: {filteredProducts.length}</p>

      {visibleProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        visibleProducts.map((product) => (
          <div key={product.id}>
            <Link href={`/products/${product.id}`}>
              <h2>{product.title}</h2>
              <p>${product.price}</p>
            </Link>
          </div>
        ))
      )}

      <div>
  <button
    disabled={currentPage <= 1}
    onClick={() => updateParam('page', String(currentPage - 1))}
  >
    Previous
  </button>

  <span> Page {currentPage} of {totalPages} </span>

  <button
    disabled={currentPage >= totalPages}
    onClick={() => updateParam('page', String(currentPage + 1))}
  >
    Next
  </button>
</div>
    </main>
  );
}

import Link from "next/link";

const products = [
    { id: '1', name: 'Product 1' },
  { id: '2', name: 'Product 2' },
  { id: '3', name: 'Product 3' },
]

export default function ProductsPage() {
    return (
        <main>
            <h1>Products</h1>

            {products.map((product) => (
                <div key={product.id}>
                    <Link href={`/products/${product.id}`}>
                        {product.name}
                    </Link>
                </div>
            ))}
        </main>
    )
}
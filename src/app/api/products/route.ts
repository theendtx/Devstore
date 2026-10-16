
import { NextResponse } from 'next/server';

type Product = {
  id: number;
  name: string;
  price: number;
};

let products: Product[] = [
  { id: 1, name: 'iPhone', price: 999 },
  { id: 2, name: 'MacBook', price: 1999 },
  { id: 3, name: 'AirPods', price: 249 },
];

// GET — өнімдерді алу
export async function GET() {
  return NextResponse.json(products);
}

// POST — жаңа өнім қосу
export async function POST(request: Request) {
  const body = await request.json();

  const newProduct: Product = {
    id: Date.now(),
    name: body.name,
    price: body.price,
  };

  products.push(newProduct);

  return NextResponse.json(newProduct, { status: 201 });
}

// PUT — өнімді жаңарту
export async function PUT(request: Request) {
  const body = await request.json();

  products = products.map((product) =>
    product.id === body.id
      ? { ...product, name: body.name, price: body.price }
      : product
  );

  return NextResponse.json(products);
}

// DELETE — өнімді жою
export async function DELETE(request: Request) {
  const body = await request.json();

  products = products.filter((product) => product.id !== body.id);

  return NextResponse.json(products);
}

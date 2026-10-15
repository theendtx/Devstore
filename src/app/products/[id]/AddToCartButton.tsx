
'use client';

import { useState } from 'react';

type Props = {
  productName: string;
};

export default function AddToCartButton({ productName }: Props) {
  const [added, setAdded] = useState(false);

  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Added to cart ❤️' : `Add ${productName} to cart`}
    </button>
  );
}

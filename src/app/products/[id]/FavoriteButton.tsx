
'use client';

import { useState } from 'react';

export default function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button onClick={() => setIsFavorite(!isFavorite)}>
      {isFavorite ? 'Added to favorites ❤️' : 'Add to favorites'}
    </button>
  );
}

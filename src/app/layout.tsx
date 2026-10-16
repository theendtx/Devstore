import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'DevStore',
  description: 'Product marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
  <h1>DevStore</h1>
  <nav>
    <Link href="/">Home</Link>
    {' | '}
    <Link href="/products">Products</Link>
    {' | '}
    <Link href="/about">About</Link>
  </nav>
</header>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
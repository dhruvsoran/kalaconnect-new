import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join कलाConnect — Register as Buyer or Artisan',
  description: 'Create your free account on कलाConnect. Join as a buyer to discover authentic Indian art, or as an artisan to sell your handcrafted creations worldwide.',
  openGraph: {
    title: 'Join कलाConnect — Register',
    description: 'Create your free account to buy or sell authentic Indian art.',
    url: 'https://kalaconnect.me/register',
    type: 'website',
  },
  alternates: {
    canonical: '/register',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}

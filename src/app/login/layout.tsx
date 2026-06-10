import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login to कलाConnect — Access Your Account',
  description: 'Sign in to your कलाConnect account to manage orders, track shipments, or manage your artisan shop.',
  openGraph: {
    title: 'Login | कलाConnect',
    description: 'Sign in to your कलाConnect account.',
    url: 'https://kalaconnect.me/login',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kalaconnect.me/login',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | कलाConnect',
  description: 'Learn about how कलाConnect uses cookies for session management, analytics, and personalization. You can manage your cookie preferences.',
  openGraph: {
    title: 'Cookie Policy | कलाConnect',
    description: 'Cookie Policy for कलाConnect Indian Art Marketplace',
    url: 'https://kalaconnect.me/cookies',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kalaconnect.me/cookies',
  },
};

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
      <p className="mb-4">We use necessary cookies for session management. Optional cookies are used for analytics and personalization. You can opt out in the cookie consent banner.</p>
      <section>
        <h2 className="text-xl font-semibold">Essential Cookies</h2>
        <p>These keep you logged in and remember cart state.</p>
      </section>
    </main>
  );
}
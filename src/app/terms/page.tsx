import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | कलाConnect',
  description: 'Read the Terms & Conditions for using कलाConnect - the Indian art marketplace connecting artisans with art lovers worldwide.',
  openGraph: {
    title: 'Terms & Conditions | कलाConnect',
    description: 'Terms & Conditions for कलाConnect Indian Art Marketplace',
    url: 'https://kalaconnect.me/terms',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kalaconnect.me/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p className="mb-4">Welcome to कलाConnect. By using this site you agree to these Terms & Conditions. This page contains a short summary; consult your legal counsel to expand for production.</p>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <p>Users are responsible for maintaining account security. Do not share credentials.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Content and Conduct</h2>
        <p>Users must only post content they own or have right to share. Harassment and hate speech are prohibited.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Liability</h2>
        <p>Artisan products are sold as-is. KalaConnect limits liability to the extent permitted by law.</p>
      </section>
      <p className="text-sm text-muted-foreground">For a comprehensive legal document, consult a lawyer before production deployment.</p>
    </main>
  );
}
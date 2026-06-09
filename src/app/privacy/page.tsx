import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | कलाConnect',
  description: 'Learn how कलाConnect collects, uses, and protects your personal data. We collect minimal data necessary to operate the marketplace.',
  openGraph: {
    title: 'Privacy Policy | कलाConnect',
    description: 'Privacy Policy for कलाConnect Indian Art Marketplace',
    url: 'https://kalaconnect.me/privacy',
    type: 'website',
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">We collect minimal personal data necessary to operate the marketplace (name, email, shipping). Data is stored securely and not shared except as required to fulfill orders.</p>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">User Data</h2>
        <p>User profiles expose only public fields (name, avatar). Sensitive fields like email are private unless you are the owner or an admin.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold">Cookies</h2>
        <p>We use cookies for session and basic analytics. You can decline non-essential cookies.</p>
      </section>
      <p className="text-sm text-muted-foreground">Contact privacy@kalaconnect.example for requests.</p>
    </main>
  );
}
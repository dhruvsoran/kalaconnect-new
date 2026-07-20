import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with कलाConnect (KalaConnect). Questions about Indian art, our artisans, orders, or joining as a seller? Contact us by email at support@kalaconnect.me or phone at +91 7818093944.',
  alternates: { canonical: 'https://www.kalaconnect.me/contact' },
  openGraph: {
    title: 'Contact Us | कलाConnect',
    description: 'Contact KalaConnect — questions about Indian art, orders, artisan partnerships, or platform support.',
    url: 'https://www.kalaconnect.me/contact',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}

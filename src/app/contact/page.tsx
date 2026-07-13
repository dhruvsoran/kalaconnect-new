import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with कलाConnect. Have questions about Indian art, our artisans, or your orders? We\'re here to help.',
  alternates: { canonical: 'https://kalaconnect.me/contact' },
  openGraph: {
    title: 'Contact Us | कलाConnect',
    description: 'Get in touch with कलाConnect. Have questions about Indian art? We\'re here to help.',
    url: 'https://kalaconnect.me/contact',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
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
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-headline font-bold mb-2">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using the कलाConnect platform (&quot;Service&quot;), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">2. Eligibility</h2>
        <p className="text-muted-foreground leading-relaxed">
          You must be at least 13 years old to use the Service. By creating an account, you represent that you meet this age requirement and have the legal capacity to enter into these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">3. Accounts</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You are responsible for all activities that occur under your account</li>
          <li>You must notify us immediately of any unauthorized use of your account</li>
          <li>One person may not maintain more than one account</li>
          <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">4. For Buyers</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>All purchases are subject to availability</li>
          <li>Prices are set by individual artisans and may change without notice</li>
          <li>Payment must be completed before order processing begins</li>
          <li>You are responsible for providing accurate shipping information</li>
          <li>Artworks are handmade — slight variations from photos are normal and part of the charm</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">5. For Artisans</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>You must be the original creator or authorized seller of all listed artworks</li>
          <li>Product descriptions and images must be accurate and honest</li>
          <li>Orders must be fulfilled within the stated timeframe</li>
          <li>You are responsible for safely packaging and shipping your products</li>
          <li>You retain ownership of your intellectual property; by listing, you grant us a license to display your work on the Service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">6. Orders & Payments</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>All orders are subject to acceptance by the artisan</li>
          <li>Payment is processed securely through our third-party payment providers</li>
          <li>We do not store your credit card or banking information</li>
          <li>Prices are listed in Indian Rupees (INR) unless otherwise stated</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">7. Shipping & Delivery</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>Shipping times vary based on artisan location and destination</li>
          <li>Artisans are responsible for shipping products within the stated timeframe</li>
          <li>Risk of loss and title for items pass to you upon delivery</li>
          <li>International shipments may be subject to customs duties and taxes, which are the buyer&apos;s responsibility</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">8. Returns & Refunds</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>Since artworks are handmade and unique, returns are accepted only for items that arrive damaged or significantly different from the listing</li>
          <li>Return requests must be made within 7 days of delivery with photographic evidence</li>
          <li>Refunds are processed to the original payment method within 10 business days of approval</li>
          <li>Shipping costs are non-refundable unless the return is due to our error</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">9. Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          All content on the Service — including text, graphics, logos, and software — is the property of कलाConnect or its content suppliers and is protected by copyright law.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Artisan artworks remain the intellectual property of the artisans. Artisans grant कलाConnect a non-exclusive license to display, promote, and market their artworks on the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">10. Prohibited Conduct</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">You agree not to:</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>Use the Service for any unlawful purpose</li>
          <li>Post false, misleading, or fraudulent content</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Attempt to gain unauthorized access to other accounts or systems</li>
          <li>Use automated tools to access or scrape the Service</li>
          <li>Infringe on the intellectual property rights of others</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">11. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          To the maximum extent permitted by law, कलाConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">12. Indemnification</h2>
        <p className="text-muted-foreground leading-relaxed">
          You agree to indemnify and hold harmless कलाConnect and its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses arising from your use of the Service or violation of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">13. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Meerut, Uttar Pradesh, India.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">14. Changes to These Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to modify these Terms at any time. Changes will be effective upon posting to the Service. Your continued use after changes constitutes acceptance of the modified terms. We will notify you of significant changes via email or a notice on the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">15. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about these Terms, please contact us:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
          <li>Email: <a href="mailto:support@kalaconnect.me" className="text-primary underline">support@kalaconnect.me</a></li>
          <li>Phone: +91 7818093944</li>
          <li>Address: Meerut, Uttar Pradesh, India</li>
        </ul>
      </section>
    </main>
  );
}

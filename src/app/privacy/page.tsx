import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how कलाConnect collects, uses, and protects your personal data. We are committed to transparency about our data practices.',
  openGraph: {
    title: 'Privacy Policy | कलाConnect',
    description: 'Privacy Policy for कलाConnect Indian Art Marketplace',
    url: 'https://kalaconnect.me/privacy',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kalaconnect.me/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-headline font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">1. Introduction</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Welcome to कलाConnect (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate the website{' '}
          <Link href="/" className="text-primary underline">kalaconnect.me</Link> (the &quot;Service&quot;),
          an online marketplace connecting Indian artisans with art lovers worldwide.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">2. Information We Collect</h2>
        <h3 className="text-lg font-bold mb-2">Account Information</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>Name and email address (required for account creation)</li>
          <li>Password (stored securely as a hash — we never see your password)</li>
          <li>Profile avatar and bio (optional, for artisans)</li>
          <li>Role (buyer, artisan, or admin)</li>
        </ul>

        <h3 className="text-lg font-bold mb-2">Transaction Information</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>Shipping address and phone number (for order delivery)</li>
          <li>Order history and purchase details</li>
          <li>Payment is processed through secure third-party payment providers — we do not store credit card numbers</li>
        </ul>

        <h3 className="text-lg font-bold mb-2">Automatically Collected Information</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>IP address and browser type (for security and rate limiting)</li>
          <li>Pages visited and time spent on the Service</li>
          <li>Device information and operating system</li>
        </ul>

        <h3 className="text-lg font-bold mb-2">Information from Third Parties</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>If you sign in with Google, we receive your name, email, and profile picture from Google OAuth</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>To provide, maintain, and improve the Service</li>
          <li>To process transactions and send related information (order confirmations, delivery updates)</li>
          <li>To create and manage your account</li>
          <li>To communicate with you about products, services, and promotions</li>
          <li>To detect, prevent, and address technical issues and fraud</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">4. How We Share Your Information</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We do not sell your personal information. We share information only in the following circumstances:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>With artisans:</strong> When you place an order, the artisan receives your name and shipping address to fulfill the order</li>
          <li><strong>With payment processors:</strong> Payment information is shared with our secure payment provider to process transactions</li>
          <li><strong>With hosting providers:</strong> Our data is stored on secure cloud infrastructure (MongoDB Atlas, Vercel)</li>
          <li><strong>For legal compliance:</strong> When required by law, regulation, or valid legal process</li>
          <li><strong>With your consent:</strong> When you explicitly agree to share information for a specific purpose</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">5. Data Retention</h2>
        <p className="text-muted-foreground leading-relaxed">
          We retain your account information for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days, except where we need to retain certain information for legal or legitimate business purposes (such as order records for tax compliance).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">6. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We implement appropriate technical and organizational security measures to protect your personal information, including encryption in transit (HTTPS), secure password hashing, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">7. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Depending on your location, you may have the following rights:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate data</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data</li>
          <li><strong>Objection:</strong> Object to processing of your personal data</li>
          <li><strong>Data Portability:</strong> Request transfer of your data in a machine-readable format</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:privacy@kalaconnect.me" className="text-primary underline">privacy@kalaconnect.me</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">8. Children&apos;s Privacy</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">9. Cookies and Tracking</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We use cookies and similar tracking technologies to maintain your session and remember your preferences. We also use third-party advertising services (such as Google AdSense) that may use cookies to serve personalized advertisements.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>Essential cookies:</strong> Required for the Service to function (authentication, session management)</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with the Service</li>
          <li><strong>Advertising cookies:</strong> Used by third-party ad networks to serve relevant advertisements</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You can control cookie preferences through your browser settings and our cookie consent banner.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">10. Third-Party Services</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of every website you visit.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Third-party services we use include: Google OAuth (authentication), Google AdSense (advertising), MongoDB Atlas (database hosting), Vercel (hosting), and Resend (transactional emails).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">11. Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">12. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
          <li>Email: <a href="mailto:privacy@kalaconnect.me" className="text-primary underline">privacy@kalaconnect.me</a></li>
          <li>Phone: +91 7818093944</li>
          <li>Address: Meerut, Uttar Pradesh, India</li>
        </ul>
      </section>
    </main>
  );
}

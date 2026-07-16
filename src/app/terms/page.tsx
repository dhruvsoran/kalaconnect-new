import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for कलाConnect (KalaConnect) Indian Art Marketplace. Read our terms and conditions for buyers, artisans, platform usage, orders, payments, and intellectual property.',
  alternates: { canonical: 'https://kalaconnect.me/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-6">
            <span className="font-headline">कलाConnect</span>
          </Link>
          <h1 className="text-4xl font-headline font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using कलाConnect (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                कलाConnect is a digital marketplace connecting Indian artisans with art lovers worldwide. These terms govern your use of our website, services, and any related applications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">2. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your password and account</li>
                <li>Promptly update your account information if it changes</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">3. For Artisans</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you register as an artisan, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>List only authentic, handcrafted products that you have created</li>
                <li>Provide accurate descriptions and images of your products</li>
                <li>Fulfill orders in a timely manner and maintain quality standards</li>
                <li>Respond to customer inquiries within 48 hours</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Accept that कलाConnect charges a commission on sales (currently 0% during launch)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">4. For Buyers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you use कलाConnect as a buyer, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Pay for products you order through our payment system</li>
                <li>Provide accurate shipping information</li>
                <li>Inspect products upon delivery and report any issues promptly</li>
                <li>Leave honest reviews and feedback for artisans</li>
                <li>Understand that all sales of handcrafted items are final (unless defective)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">5. Products and Pricing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All products on कलाConnect are handcrafted and unique. Please note:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Product images are for illustrative purposes; actual items may vary slightly</li>
                <li>Prices are set by artisans and include all applicable taxes</li>
                <li>कलाConnect reserves the right to modify prices with notice</li>
                <li>Product availability is subject to change without notice</li>
                <li>We do not guarantee the authenticity of products listed by third-party sellers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">6. Orders and Payment</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you place an order:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Your order constitutes an offer to purchase the product</li>
                <li>We reserve the right to accept or reject any order</li>
                <li>Payment must be received before order processing</li>
                <li>Cash on Delivery (COD) is available for select areas</li>
                <li>Refunds are processed according to our Return Policy</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All content on कलाConnect, including text, graphics, logos, and software, is the property of कलाConnect or its content suppliers and is protected by Indian and international copyright laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Artisans retain ownership of their product designs and images. By listing products on कलाConnect, artisans grant us a non-exclusive license to display and promote their products on our Platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                कलाConnect acts as an intermediary between artisans and buyers. We are not responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>The quality, safety, or legality of products listed</li>
                <li>The accuracy of product descriptions or images</li>
                <li>The ability of artisans to complete transactions</li>
                <li>The ability of buyers to pay for products</li>
                <li>Any disputes between artisans and buyers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">9. Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of कलाConnect is also governed by our{' '}
                <Link href="/privacy" className="underline text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding your personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the Platform. Your continued use of कलाConnect after any changes constitutes acceptance of the new Terms. We encourage you to review these Terms periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> support@kalaconnect.me</p>
                <p><strong>Phone:</strong> +91 7818093944</p>
                <p><strong>Address:</strong> Meerut, Uttar Pradesh, India</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

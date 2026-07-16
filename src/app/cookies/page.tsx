import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for कलाConnect (KalaConnect) Indian Art Marketplace. Learn about essential cookies, analytics cookies, and advertising cookies used on our platform and how to manage your preferences.',
  openGraph: {
    title: 'Cookie Policy | कलाConnect',
    description: 'Cookie Policy for KalaConnect Indian Art Marketplace — learn about cookie usage and manage your preferences.',
    url: 'https://kalaconnect.me/cookies',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kalaconnect.me/cookies',
  },
};

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-headline font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">1. What Are Cookies</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about how visitors interact with their site.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Cookies help us understand your preferences based on your previous or current activity, which enables us to provide you with improved services. They also help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">2. How We Use Cookies</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          We use cookies for several reasons on कलाConnect. Some cookies are necessary for the website to function properly, while others help us understand how you use our platform and improve your experience. Below we explain the different types of cookies we use and their purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">3. Types of Cookies We Use</h2>

        <h3 className="text-lg font-bold mb-2">Essential Cookies</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          These cookies are strictly necessary for the Service to function and cannot be switched off. They are set in response to your actions such as logging in, adding items to your cart, or setting your privacy preferences. You can set your browser to block these cookies, but some parts of the site will not work.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li><strong>Session cookies:</strong> Keep you logged in as you navigate between pages</li>
          <li><strong>Authentication cookies:</strong> Verify your identity when you log in to your account</li>
          <li><strong>Security cookies:</strong> Help protect against fraudulent activity and support security features</li>
          <li><strong>Load balancing cookies:</strong> Distribute traffic across servers to ensure the website remains responsive</li>
          <li><strong>Cart cookies:</strong> Remember the items you have added to your shopping cart</li>
          <li><strong>CSRF tokens:</strong> Protect against cross-site request forgery attacks</li>
        </ul>

        <h3 className="text-lg font-bold mb-2">Analytics Cookies</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular and see how visitors move around the site.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li><strong>Google Analytics cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously</li>
          <li><strong>Performance cookies:</strong> Collect information about how you use our website, such as which pages you visit most often</li>
        </ul>

        <h3 className="text-lg font-bold mb-2">Functionality Cookies</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li><strong>Preference cookies:</strong> Remember your settings and preferences (such as language, theme, or region)</li>
          <li><strong>Social media cookies:</strong> Allow you to share content from our site to your social media accounts</li>
        </ul>

        <h3 className="text-lg font-bold mb-2">Advertising Cookies</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device.
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li><strong>Google AdSense cookies:</strong> Used to serve personalized advertisements based on your interests and browsing history</li>
          <li><strong>Remarketing cookies:</strong> Allow us to show you ads for products you have previously viewed on our site</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">4. Third-Party Cookies</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>Google Analytics:</strong> One of the most widespread and trusted analytics solutions on the web. Google Analytics helps us understand how you use the site and ways to improve your experience. These cookies may track things such as how long you spend on the site and the pages you visit. For more information on Google Analytics cookies, see the official Google Analytics page.</li>
          <li><strong>Google AdSense:</strong> Google uses advertising cookies to serve ads that are relevant to your interests. Google&apos;s advertising cookies enable the ad serving and reporting features. For more information, visit the Google Privacy &amp; Terms page.</li>
          <li><strong>Google OAuth:</strong> If you sign in with Google, Google may set cookies to facilitate the authentication process and maintain your session.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">5. Managing Your Cookie Preferences</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          You have several options for managing cookies:
        </p>

        <h3 className="text-lg font-bold mb-2">Cookie Consent Banner</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          When you first visit our site, you will see a cookie consent banner that allows you to accept or decline non-essential cookies. You can change your preferences at any time by clearing your browser cookies and revisiting the site.
        </p>

        <h3 className="text-lg font-bold mb-2">Browser Settings</h3>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Most web browsers allow you to control cookies through their settings. You can set your browser to:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
          <li>Block all cookies</li>
          <li>Accept all cookies</li>
          <li>Notify you when a cookie is set</li>
          <li>Delete cookies at the end of each browsing session</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Please note that blocking or deleting cookies may affect the functionality of this website and your ability to access certain features. For instructions on managing cookies in popular browsers, visit:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary underline">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary underline">Microsoft Edge</a></li>
        </ul>

        <h3 className="text-lg font-bold mb-2 mt-4">Opting Out of Google Analytics</h3>
        <p className="text-muted-foreground leading-relaxed">
          To opt out of Google Analytics tracking, you can install the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">6. Cookie Retention</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          The length of time a cookie remains on your device depends on its type:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>Session cookies:</strong> These are temporary cookies that are deleted from your device when you close your web browser</li>
          <li><strong>Persistent cookies:</strong> These remain on your device for a set period of time or until you delete them manually. They are used to remember your preferences for future visits</li>
          <li><strong>Third-party cookies:</strong> These are managed by third-party services and have their own retention periods as defined by those services</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">7. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Under applicable data protection laws, you have rights regarding your personal data, including data collected through cookies. These rights include:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li><strong>Right to access:</strong> Request information about what cookies are used and what data they collect</li>
          <li><strong>Right to object:</strong> Object to the use of certain types of cookies, particularly advertising cookies</li>
          <li><strong>Right to withdraw consent:</strong> Withdraw your consent to non-essential cookies at any time</li>
          <li><strong>Right to deletion:</strong> Request deletion of data collected through cookies</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          To exercise these rights, please contact us at{' '}
          <a href="mailto:privacy@kalaconnect.me" className="text-primary underline">privacy@kalaconnect.me</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">8. Changes to This Cookie Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. When we make changes, we will update the &quot;Last updated&quot; date at the top of this page. We encourage you to review this policy periodically to stay informed about how we use cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-headline font-bold mb-3">9. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          If you have any questions about our use of cookies or other technologies, please contact us:
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

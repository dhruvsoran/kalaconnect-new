import Link from 'next/link';

export function SiteFooter() {
    return (
        <footer className="bg-card border-t">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
                    <div>
                        <h3 className="font-headline font-bold text-lg mb-4">कलाConnect</h3>
                        <p className="text-sm text-muted-foreground">
                            Empowering Indian artisans in the digital marketplace.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Marketplace</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/explore" className="hover:text-foreground transition-colors">Explore Art</Link></li>
                            <li><Link href="/blog" className="hover:text-foreground transition-colors">Art &amp; Culture Blog</Link></li>
                            <li><Link href="/register?role=artisan" className="hover:text-foreground transition-colors">Sell on KalaConnect</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Account</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/login" className="hover:text-foreground transition-colors">Log In</Link></li>
                            <li><Link href="/register" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                            <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} कलाConnect. All rights reserved.</p>
                    <p className="mt-2">Founded by <span className="font-semibold">Dhruv Soran</span></p>
                </div>
            </div>
        </footer>
    );
}

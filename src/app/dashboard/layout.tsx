'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Bot,
  BarChart,
  Brush,
  User,
  ShoppingCart,
  Heart,
  ListOrdered,
  Loader2,
  Telescope
} from 'lucide-react';
import { KalaConnectIcon } from '@/components/icons';
import { UserMenu } from '@/components/user-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser, useDoc, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { user, loading: authLoading } = useUser();
    const { firestore } = useFirebase();
    const router = useRouter();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: profile, loading: docLoading } = useDoc(userDocRef);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading || docLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    const userRole = profile?.role || 'buyer';

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <KalaConnectIcon className="h-6 w-6 text-primary" />
              <span className="font-headline">कलाConnect</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
              {userRole === 'artisan' ? (
                <>
                    <NavItem icon={<LayoutDashboard className="h-4 w-4" />} href="/dashboard">
                        Artisan Workspace
                    </NavItem>
                    <NavItem icon={<Package className="h-4 w-4" />} href="/dashboard/products">
                        My Products
                    </NavItem>
                    <NavItem icon={<Brush className="h-4 w-4" />} href="/dashboard/marketing">
                        AI Marketing
                    </NavItem>
                    <NavItem icon={<BarChart className="h-4 w-4" />} href="/dashboard/analytics">
                        Analytics
                    </NavItem>
                    <NavItem icon={<Bot className="h-4 w-4" />} href="/dashboard/chatbot">
                        Shop Assistant
                    </NavItem>
                    <NavItem icon={<User className="h-4 w-4" />} href="/dashboard/profile">
                        Artisan Profile
                    </NavItem>
                </>
              ) : (
                 <>
                    <NavItem icon={<LayoutDashboard className="h-4 w-4" />} href="/dashboard">
                        Buyer Feed
                    </NavItem>
                     <NavItem icon={<Telescope className="h-4 w-4" />} href="/explore">
                        Discover Art
                    </NavItem>
                    <NavItem icon={<ShoppingCart className="h-4 w-4" />} href="/cart">
                        My Cart
                    </NavItem>
                     <NavItem icon={<Heart className="h-4 w-4" />} href="/wishlist">
                        Wishlist
                    </NavItem>
                     <NavItem icon={<ListOrdered className="h-4 w-4" />} href="/dashboard/orders">
                        Purchase History
                    </NavItem>
                     <NavItem icon={<User className="h-4 w-4" />} href="/dashboard/profile">
                        Account Settings
                    </NavItem>
                 </>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1" />
          <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserMenu />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            }`}
        >
            {icon}
            {children}
        </Link>
    );
}
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, CreditCard, BarChart3, MessageSquare, Megaphone, Settings, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?returnTo=/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) return null;

  const isArtisan = user.role === 'artisan';
  const isAdmin = user.role === 'admin';

  const buyerLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'My Orders', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const artisanLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'My Products', icon: Package },
    { href: '/dashboard/orders', label: 'Orders', icon: CreditCard },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/chatbot', label: 'AI Assistant', icon: MessageSquare },
    { href: '/dashboard/marketing', label: 'Marketing', icon: Megaphone },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin', label: 'Admin Panel', icon: Settings },
    { href: '/dashboard/orders', label: 'Orders', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : isArtisan ? artisanLinks : buyerLinks;

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-0 left-0 z-50 m-2 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-14 md:pt-0">
          <div className="p-4 border-b">
            <Link href="/dashboard" className="font-headline font-bold text-lg" onClick={() => setSidebarOpen(false)}>
              कलाConnect
            </Link>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role} Account</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}

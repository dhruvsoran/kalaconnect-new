'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import CookieConsent from '@/components/cookie-consent';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith('/dashboard');

  return (
    <FirebaseClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="fixed inset-0 -z-50 liquid-background" />
        <div className="fixed inset-0 -z-40 liquid-overlay backdrop-blur-[60px]" />
        
        <div className={cn(
          "relative z-10 flex flex-col min-h-screen",
          !isDashboardPage && "bg-transparent"
        )}>
          {!isDashboardPage && <SiteHeader />}
          <main className="flex-grow">{children}</main>
          {!isDashboardPage && <SiteFooter />}
          <CookieConsent />
        </div>
        <Toaster />
      </ThemeProvider>
    </FirebaseClientProvider>
  );
}

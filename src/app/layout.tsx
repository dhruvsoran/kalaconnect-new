
"use client";

import { PT_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-headline',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning className={cn(ptSans.variable, playfair.variable)}>
      <head>
        <title>कलाConnect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Empowering Indian Artisans in the Digital Marketplace" />
      </head>
      <body className="font-body antialiased min-h-screen relative">
        <FirebaseClientProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
            {/* Site-wide Fixed Liquid Background */}
            <div className="fixed inset-0 -z-50 liquid-background" />
            <div className="fixed inset-0 -z-40 liquid-overlay backdrop-blur-[60px]" />
            
            <div className={cn(
              "relative z-10 flex flex-col min-h-screen",
              !isDashboardPage && "bg-transparent"
            )}>
              {!isDashboardPage && <SiteHeader />}
              <main className="flex-grow">{children}</main>
              {!isDashboardPage && <SiteFooter />}
            </div>
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

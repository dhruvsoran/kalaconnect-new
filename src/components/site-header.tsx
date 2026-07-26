
"use client";

import Link from "next/link";
import { KalaConnectIcon } from "@/components/icons";
import { HomeHeaderActions } from "@/components/home-header-actions";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Menu, Palette, HelpCircle, Store, LayoutDashboard, LogOut, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { useUser } from "@/auth";

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { user, loading } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: "/explore", label: "Explore", icon: <Palette className="h-4 w-4" /> },
        { href: "/blog", label: "Blog", icon: <BookOpen className="h-4 w-4" /> },
        { href: "/register?role=artisan", label: "Sell on KalaConnect", icon: <Store className="h-4 w-4" /> },
    ];

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            isScrolled && "shadow-sm"
        )}>
            <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
                <Link href="/" className="mr-auto flex items-center gap-2 font-bold text-xl font-headline transition-colors active:text-accent active:animate-pop">
                    <KalaConnectIcon className="h-7 w-7 text-primary" />
                    <span>कलाConnect</span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href + link.label}
                            href={link.href}
                            className={cn(
                                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                pathname === link.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <span className="flex items-center gap-1.5">
                                {link.icon}
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 ml-4">
                    <ThemeToggle />
                    <HomeHeaderActions />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] max-w-sm">
                            <div className="grid gap-6 py-6">
                                <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline" onClick={() => setOpen(false)}>
                                    <KalaConnectIcon className="h-7 w-7 text-primary" />
                                    कलाConnect
                                </Link>
                                <div className="grid gap-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href + link.label}
                                            href={link.href}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted"
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="border-t pt-4 grid gap-2">
                                    {user ? (
                                        <>
                                            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted" onClick={() => setOpen(false)}>
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                            <Button variant="ghost" className="justify-start gap-3 px-3 py-2.5" onClick={() => {
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('isLoggedIn');
                                                localStorage.removeItem('userRole');
                                                localStorage.removeItem('userId');
                                                window.dispatchEvent(new Event('auth-change'));
                                                setOpen(false);
                                                router.push('/');
                                            }}>
                                                <LogOut className="h-4 w-4" />
                                                Log Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted" onClick={() => setOpen(false)}>
                                                <HelpCircle className="h-4 w-4" />
                                                Log In
                                            </Link>
                                            <Button asChild className="w-full" onClick={() => setOpen(false)}>
                                                <Link href="/register" className="font-headline">Sign Up Free</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

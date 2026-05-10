
"use client";

import Link from "next/link";
import { KalaConnectIcon } from "@/components/icons";
import { HomeHeaderActions } from "@/components/home-header-actions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        )}>
            <div className="flex h-20 items-center px-4 sm:px-6 lg:px-8">
                <Link href="/" className="mr-auto flex items-center gap-2 font-bold text-2xl font-headline transition-colors active:text-accent active:animate-pop">
                    <KalaConnectIcon className="h-8 w-8 text-primary" />
                    कलाConnect
                </Link>
                <div className="flex items-center justify-end gap-6">
                    <nav className="hidden md:flex gap-6">
                        <Link href="/#features" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                        Features
                        </Link>
                        <Link href="/#about" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                        About
                        </Link>
                        <Link href="/explore" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                        Explore
                        </Link>
                    </nav>
                     <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <HomeHeaderActions />
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                 <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="grid gap-6 py-6">
                                     <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-headline" onClick={() => setOpen(false)}>
                                        <KalaConnectIcon className="h-8 w-8 text-primary" />
                                        कलाConnect
                                    </Link>
                                    <Link href="/#features" className="text-lg font-semibold" onClick={() => setOpen(false)}>
                                        Features
                                    </Link>
                                    <Link href="/#about" className="text-lg font-semibold" onClick={() => setOpen(false)}>
                                        About
                                    </Link>
                                    <Link href="/explore" className="text-lg font-semibold" onClick={() => setOpen(false)}>
                                        Explore
                                    </Link>
                                    <div className="flex flex-col gap-4 mt-6">
                                         <Link href="/login" className="text-lg font-semibold font-headline" onClick={() => setOpen(false)}>Log In</Link>
                                         <Button asChild onClick={() => setOpen(false)}><Link href="/register" className="font-headline">Sign Up</Link></Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

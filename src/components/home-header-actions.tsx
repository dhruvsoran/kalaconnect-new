
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/auth';

export function HomeHeaderActions() {
    const { user, loading } = useUser();
    
    const router = useRouter();
    
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                let storedWishlist: unknown[] = [];
                try {
                    storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                } catch {
                    storedWishlist = [];
                }
                setWishlistCount(Array.isArray(storedWishlist) ? storedWishlist.length : 0);

                const token = localStorage.getItem('token');
                if (!token) {
                    setCartCount(0);
                    return;
                }
                const cartRes = await fetch('/api/db/carts', { headers: { Authorization: `Bearer ${token}` } });
                const cartJson = await cartRes.json();
                setCartCount((cartJson.data?.items || []).length);
            } catch (e) {
                console.error('Failed to fetch counts', e);
            }
        };

        fetchCounts();
        window.addEventListener('cartUpdated', fetchCounts);
        window.addEventListener('wishlistUpdated', fetchCounts);

        return () => {
            window.removeEventListener('cartUpdated', fetchCounts);
            window.removeEventListener('wishlistUpdated', fetchCounts);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch { /* ignore */ }
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('cart');
            localStorage.removeItem('wishlist');
            window.dispatchEvent(new Event('auth-change'));
            window.dispatchEvent(new Event('cartUpdated'));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }
        router.push('/');
    };

    if (loading) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }

    if (user) {
        const isBuyer = user.role === 'buyer';
        return (
            <div className="flex items-center gap-2">
                {isBuyer && (
                    <>
                        <Button variant="ghost" size="icon" asChild>
                             <Link href="/wishlist" className="relative">
                                <Heart className="h-5 w-5" />
                                {wishlistCount > 0 && (
                                    <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">{wishlistCount}</Badge>
                                )}
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                             <Link href="/cart" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">{cartCount}</Badge>
                                )}
                            </Link>
                        </Button>
                    </>
                )}
                <div className="hidden sm:flex items-center gap-2">
                    <Button asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Sign Up</Link>
            </Button>
        </div>
    );
}

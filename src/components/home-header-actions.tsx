
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function HomeHeaderActions() {
    const { user, loading } = useUser();
    const auth = useAuth();
    const router = useRouter();
    
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        const updateCounts = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setWishlistCount(wishlist.length);
        };
        
        updateCounts();
        window.addEventListener('storage', updateCounts);
        window.addEventListener('cartUpdated', updateCounts);
        window.addEventListener('wishlistUpdated', updateCounts);

        return () => {
            window.removeEventListener('storage', updateCounts);
            window.removeEventListener('cartUpdated', updateCounts);
            window.removeEventListener('wishlistUpdated', updateCounts);
        };
    }, []);

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push('/');
    };

    if (loading) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }

    if (user) {
        return (
            <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">{cartCount}</Badge>
                    )}
                </Link>
            </Button>
            <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                    <Link href="/register">Sign Up</Link>
                </Button>
            </div>
        </div>
    );
}

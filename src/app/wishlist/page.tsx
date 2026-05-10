
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getProducts, Product } from '@/lib/db';
import { Heart, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(storedWishlist);
        
        const handleWishlistUpdate = () => {
            const updatedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setWishlist(updatedWishlist);
        };
        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        setIsLoading(false);

        return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    }, [router]);

    const removeFromWishlist = (productName: string) => {
        const newWishlist = wishlist.filter(item => item.name !== productName);
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        window.dispatchEvent(new Event('wishlistUpdated'));
        toast({
            title: "Item removed",
            description: `${productName} has been removed from your wishlist.`,
        });
    };
    
    const handleAddToCart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const isProductInCart = cart.some((item: Product) => item.name === product.name);

        if (isProductInCart) {
             toast({
                variant: "destructive",
                title: "Already in Cart",
                description: `${product.name} is already in your shopping cart.`,
            });
            return;
        }

        const newCart = [...cart, product];
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));

        toast({
            title: "Added to Cart!",
            description: `Successfully added ${product.name} to your cart.`,
        });
        
        // Remove from wishlist after adding to cart
        removeFromWishlist(product.name);
    };

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-80 w-full" />
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                        <Heart className="h-8 w-8 text-destructive" /> Your Wishlist
                    </CardTitle>
                    <CardDescription>Your favorite handcrafted items, all in one place.</CardDescription>
                </CardHeader>
                <CardContent>
                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {wishlist.map(product => (
                                <Card key={product.name} className="overflow-hidden flex flex-col group">
                                     <CardHeader className="p-0 relative">
                                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 z-10 bg-white/50 backdrop-blur-sm rounded-full" onClick={() => removeFromWishlist(product.name)}>
                                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                        </Button>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={600}
                                            height={600}
                                            className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </CardHeader>
                                    <CardContent className="p-4 flex-grow">
                                        <h3 className="font-bold text-lg font-headline">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                                    </CardContent>
                                    <CardContent className="p-4 pt-0 flex justify-between items-center">
                                        <p className="font-semibold text-lg">{product.price}</p>
                                        <Button size="sm" onClick={() => handleAddToCart(product)}>
                                            <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">Your wishlist is empty.</p>
                            <p className="text-muted-foreground">Add items you love by clicking the heart icon.</p>
                            <Button asChild className="mt-4">
                                <Link href="/explore">Start Exploring</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}

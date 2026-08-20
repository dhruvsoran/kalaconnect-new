
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Product } from '@/lib/db';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';


export default function CartPage() {
    const [cart, setCart] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        let cancelled = false;
        async function fetchCart() {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const res = await fetch('/api/db/carts', { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
                const json = await res.json();
                if (cancelled) return;
                const items = json.data?.items || [];
                setCart(items);
            } catch (e) {
                console.error('Failed to load cart', e);
            }
            setIsLoading(false);
        }

        fetchCart();

        const handleCartUpdate = () => {
            fetchCart();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);

    }, [router]);

    const removeFromCart = async (productName: string) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch('/api/db/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ action: 'remove', productName }),
            });
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            // refresh cart
            const updatedRes = await fetch('/api/db/carts', { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
            const updatedJson = await updatedRes.json();
            setCart(updatedJson.data?.items || []);
            window.dispatchEvent(new Event('cartUpdated'));
            toast({ title: 'Item removed', description: `${productName} has been removed from your cart.` });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Failed to remove item' });
        }
    };

    const getSubtotal = () => {
        return cart.reduce((total, item) => {
             const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]+/g, "")) || 0;
             return total + price;
        }, 0);
    };

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-72" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FadeIn direction="up">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline flex items-center gap-3">
                            <ShoppingCart className="h-8 w-8" /> Your Shopping Cart
                        </CardTitle>
                        <CardDescription>Review your items and proceed to checkout.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {cart.length > 0 ? (
                            <>
                            <div className="hidden sm:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Product</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cart.map((item, index) => (
                                        <motion.tr
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <TableCell>
                                                <Image src={item.image} alt={item.name} width={100} height={100} className="rounded-md object-cover" />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                    <motion.div whileTap={{ scale: 0.95 }}>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently remove
                                                        "{item.name}" from your cart.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => removeFromCart(item.name)}>
                                                        Remove
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-right font-bold text-lg">Subtotal</TableCell>
                                        <TableCell className="font-bold text-lg">₹{getSubtotal().toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button asChild size="lg">
                                                    <Link href="/checkout">Proceed to Checkout</Link>
                                                </Button>
                                            </motion.div>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            </div>
                            <div className="sm:hidden space-y-3">
                                {cart.map((item) => (
                                    <div key={item.name} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                                        <Image src={item.image} alt={item.name} width={64} height={64} className="h-16 w-16 shrink-0 rounded-md object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">₹{item.price}</p>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" aria-label={`Remove ${item.name} from cart`}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently remove
                                                        "{item.name}" from your cart.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => removeFromCart(item.name)}>
                                                        Remove
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                    <span className="font-bold text-lg">Subtotal</span>
                                    <span className="font-bold text-lg">₹{getSubtotal().toFixed(2)}</span>
                                </div>
                                <motion.div whileTap={{ scale: 0.98 }}>
                                    <Button asChild size="lg" className="w-full">
                                        <Link href="/checkout">Proceed to Checkout</Link>
                                    </Button>
                                </motion.div>
                            </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">Your cart is empty.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/explore">Start Shopping</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </FadeIn>
        </main>
    );
}

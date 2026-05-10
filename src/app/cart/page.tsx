
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { getProducts, Product } from '@/lib/db';
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
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        async function fetchProducts() {
            const allProducts = await getProducts();
            setProducts(allProducts);
        }
        fetchProducts();

        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
        
        const handleCartUpdate = () => {
            const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCart(updatedCart);
        };
        window.addEventListener('cartUpdated', handleCartUpdate);
        setIsLoading(false);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);

    }, [router]);

    const removeFromCart = (productName: string) => {
        const newCart = cart.filter(item => item.name !== productName);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
        toast({
            title: "Item removed",
            description: `${productName} has been removed from your cart.`,
        });
    };

    const getSubtotal = () => {
        return cart.reduce((total, item) => {
             const priceString = item.price.replace(/[^0-9.]+/g, "");
             const price = parseFloat(priceString);
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline flex items-center gap-3">
                        <ShoppingCart className="h-8 w-8" /> Your Shopping Cart
                    </CardTitle>
                    <CardDescription>Review your items and proceed to checkout.</CardDescription>
                </CardHeader>
                <CardContent>
                    {cart.length > 0 ? (
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
                                {cart.map(item => (
                                    <TableRow key={item.name}>
                                        <TableCell>
                                            <Image src={item.image} alt={item.name} width={100} height={100} className="rounded-md object-cover" />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="text-right font-bold text-lg">Subtotal</TableCell>
                                    <TableCell className="font-bold text-lg">₹{getSubtotal().toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild size="lg">
                                            <Link href="/checkout">Proceed to Checkout</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
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
        </main>
    );
}

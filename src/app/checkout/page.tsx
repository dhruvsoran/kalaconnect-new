
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/db";
import { Separator } from "@/components/ui/separator";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  paymentMethod: z.literal("cod"),
});


export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        router.push('/login');
        return;
    }

    let cancelled = false;
    async function loadCart() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/db/carts', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (cancelled) return;
        const items = json.data?.items || [];
        if (items.length === 0) {
          toast({
            title: "Your cart is empty",
            description: "Redirecting you to start shopping.",
          });
          router.push('/explore');
          return;
        }
        setCart(items);
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to load cart', e);
        toast({
          title: "Error loading cart",
          description: "Please try again.",
        });
        router.push('/explore');
      }
    }
    loadCart();
    return () => { cancelled = true; };
  }, [router, toast]);

  const subtotal = cart.reduce((total, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]+/g, "")) || 0;
        return total + price;
  }, 0);

  const total = subtotal;


  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      pincode: "",
      paymentMethod: "cod",
    },
  });

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log("Simulating payment with:", values);

    // Create the new order
    const newOrder = {
        orderId: `#KC${Math.floor(Math.random() * 9000) + 1000}`,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        total: total,
        subtotal: subtotal,
        status: 'Processing' as const,
        trackingNumber: `AWB${Math.floor(Math.random() * 90000000) + 10000000}`,
        items: cart.map(item => ({
          productId: (item as any).id || '',
          productName: item.name,
          artisanId: item.artisanId || '',
          artisanName: item.artisanName || 'Unknown Artisan',
          image: item.image,
          price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]+/g, '')) || 0,
          quantity: 1,
        })),
    };

        // Persist order to server
        let orderSuccess = false;
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch('/api/db/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: JSON.stringify({
                        ...newOrder,
                        rawTotals: { subtotal, total },
                        shipping: { name: values.name, address: values.address, city: values.city, pincode: values.pincode },
                        paymentMethod: values.paymentMethod,
                    }),
                });
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            orderSuccess = true;
        } catch (e) {
            console.error('Failed to persist order', e);
            toast({ variant: 'destructive', title: 'Order Failed', description: 'Could not place your order. Please try again.' });
            setIsLoading(false);
            return;
        }

    // Only clear cart if order succeeded
    if (orderSuccess) {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          await fetch('/api/db/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ action: 'clear' }),
          });
        } catch (e) {
          console.error('Failed to clear server cart', e);
        }
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('ordersUpdated'));
    }


        toast({
            title: "Order Placed (Cash on Delivery)",
            description: "Your order is placed. Please pay in cash when your order is delivered.",
        });

    router.push("/order-confirmation");
  }

  if (isLoading) {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-start">
             <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-96" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card>
                         <CardHeader>
                            <Skeleton className="h-8 w-32" />
                        </CardHeader>
                         <CardContent className="grid gap-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                             <Skeleton className="h-px w-full" />
                            <Skeleton className="h-6 w-full" />
                         </CardContent>
                         <CardFooter>
                            <Skeleton className="h-11 w-full" />
                         </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    )
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-start">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Checkout</CardTitle>
                        <CardDescription>Please enter your shipping and payment details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FadeIn direction="left" delay={0.1}>
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4 font-headline">Shipping Address</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="name" render={({ field }) => (
                                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="Your Name" /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="address" render={({ field }) => (
                                                <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} placeholder="Street Address" /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="city" render={({ field }) => (
                                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} placeholder="Your City" /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="pincode" render={({ field }) => (
                                                <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} placeholder="e.g. 110001" /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    </section>
                                </FadeIn>
                                
                                 <FadeIn direction="right" delay={0.2}>
                                     <FormField
                                         control={form.control}
                                         name="paymentMethod"
                                         render={({ field }) => (
                                         <FormItem>
                                             <h2 className="text-xl font-semibold mb-4 font-headline">Payment Method</h2>
                                             <FormControl>
                                                 <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                                                     <Info className="h-5 w-5 text-primary shrink-0" />
                                                     <div>
                                                         <p className="font-medium">Cash on Delivery</p>
                                                         <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered.</p>
                                                     </div>
                                                     <input type="hidden" {...field} value="cod" />
                                                 </div>
                                             </FormControl>
                                         </FormItem>
                                     )} />
                                 </FadeIn>
                                {/* The submit button is now in the order summary card */}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
             <div className="sticky top-8">
                <FadeIn direction="up" delay={0.3}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full"
                            >
                                <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="w-full">
                                    Place Order (Simulated)
                                </Button>
                            </motion.div>
                            <p className="text-xs text-muted-foreground text-center">
                                By placing this order, you agree to our Terms of Service.
                            </p>
                        </CardFooter>
                    </Card>
                </FadeIn>
            </div>
        </div>
    </main>
  );
}

    


"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Landmark, QrCode, Info } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  paymentMethod: z.enum(["card", "upi", "netbanking"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  upiId: z.string().optional(),
  bank: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'card') {
        return (
            !!data.cardName && data.cardName.length >= 2 &&
            !!data.cardNumber && data.cardNumber.length === 16 &&
            !!data.cardExpiry && /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry) &&
            !!data.cardCvc && data.cardCvc.length === 3
        );
    }
    return true;
}, {
    message: "Complete all card details",
    path: ["cardName"], 
}).refine(data => {
     if (data.paymentMethod === 'upi') {
        return !!data.upiId && data.upiId.includes('@');
     }
     return true;
}, {
    message: "Please enter a valid UPI ID",
    path: ["upiId"],
}).refine(data => {
    if (data.paymentMethod === 'netbanking') {
        return !!data.bank && data.bank.length > 0;
    }
    return true;
}, {
    message: "Please select a bank",
    path: ["bank"],
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
    
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (storedCart.length === 0) {
        toast({
            title: "Your cart is empty",
            description: "Redirecting you to start shopping.",
        });
        router.push('/explore');
        return;
    }

    setCart(storedCart);
    setIsLoading(false);

  }, [router, toast]);

  const subtotal = cart.reduce((total, item) => {
        const priceString = item.price.replace(/[^0-9.]+/g, "");
        const price = parseFloat(priceString);
        return total + price;
  }, 0);

  const transactionFee = subtotal * 0.025;
  const total = subtotal + transactionFee;


  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
        name: "",
        address: "",
        city: "",
        pincode: "",
        paymentMethod: "card",
        cardName: "",
        cardNumber: "",
        cardExpiry: "",
        cardCvc: "",
        upiId: "",
        bank: "",
    },
  });

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log("Simulating payment with:", values);

    // Create the new order
    const newOrder = {
        id: `#KC${Math.floor(Math.random() * 9000) + 1000}`,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        total: `₹${total.toFixed(2)}`,
        status: 'Processing' as const,
        trackingNumber: `AWB${Math.floor(Math.random() * 90000000) + 10000000}`,
        items: cart.map(item => ({ name: item.name, image: item.image })),
    };

    // Get existing orders and add the new one
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Clear cart and notify other components
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('ordersUpdated'));


    toast({
      title: "Payment Successful!",
      description: "Your order is being processed.",
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
                                
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                    <FormItem>
                                        <h2 className="text-xl font-semibold mb-4 font-headline">Payment Method</h2>
                                        <FormControl>
                                            <Tabs defaultValue={field.value} onValueChange={field.onChange} className="w-full">
                                                <TabsList className="grid w-full grid-cols-3">
                                                    <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/>Card</TabsTrigger>
                                                    <TabsTrigger value="upi"><QrCode className="mr-2 h-4 w-4"/>UPI/QR</TabsTrigger>
                                                    <TabsTrigger value="netbanking"><Landmark className="mr-2 h-4 w-4"/>Net Banking</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="card" className="pt-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField control={form.control} name="cardName" render={({ field }) => (
                                                            <FormItem className="md:col-span-2"><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} placeholder="Name as it appears on your card" /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                                            <FormItem className="md:col-span-2"><FormLabel>Card Number</FormLabel><FormControl><Input {...field} placeholder="0000 0000 0000 0000" /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                        <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                                                            <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input {...field} placeholder="MM/YY" /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                        <FormField control={form.control} name="cardCvc" render={({ field }) => (
                                                            <FormItem><FormLabel>CVC</FormLabel><FormControl><Input {...field} placeholder="123" /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="upi" className="pt-6">
                                                    <div className="space-y-4 text-center">
                                                        <p className="text-muted-foreground">Scan the QR or enter your UPI ID.</p>
                                                        <div className="flex justify-center">
                                                            <Image src="https://picsum.photos/seed/qr-code/200/200" alt="Sample QR Code" width={200} height={200} data-ai-hint="qr code" />
                                                        </div>
                                                        <FormField control={form.control} name="upiId" render={({ field }) => (
                                                            <FormItem><FormLabel>UPI ID</FormLabel><FormControl><Input {...field} placeholder="yourname@bank" /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="netbanking" className="pt-6">
                                                    <FormField control={form.control} name="bank" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Select Bank</FormLabel>
                                                            <FormControl>
                                                                <Input list="banks" placeholder="Choose your bank" {...field} />
                                                            </FormControl>
                                                            <datalist id="banks">
                                                                <option value="State Bank of India" />
                                                                <option value="HDFC Bank" />
                                                                <option value="ICICI Bank" />
                                                                <option value="Axis Bank" />
                                                                <option value="Kotak Mahindra Bank" />
                                                            </datalist>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                </TabsContent>
                                            </Tabs>
                                        </FormControl>
                                    </FormItem>
                                )} />
                                {/* The submit button is now in the order summary card */}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
             <div className="sticky top-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Transaction Fee (2.5%)</span>
                            <span>₹{transactionFee.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                         <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="w-full">
                            Place Order (Simulated)
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            By placing this order, you agree to our Terms of Service.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </main>
  );
}

    
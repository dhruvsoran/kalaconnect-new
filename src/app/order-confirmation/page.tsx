
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ShoppingCart, ListOrdered } from 'lucide-react';


export default function OrderConfirmationPage() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center flex-grow">
            <FadeIn direction="up">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader className="items-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        >
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                        </motion.div>
                        <CardTitle className="text-3xl font-headline">Thank You for Your Order!</CardTitle>
                        <CardDescription className="pt-2">
                            Your order has been placed successfully. You will receive a confirmation shortly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                            <p>You can track your order status from the <strong>My Orders</strong> section in your dashboard.</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button asChild>
                                    <Link href="/explore"><ShoppingCart className="mr-2 h-4 w-4" />Continue Shopping</Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/orders"><ListOrdered className="mr-2 h-4 w-4" />View Orders</Link>
                                </Button>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </FadeIn>
        </main>
    );
}

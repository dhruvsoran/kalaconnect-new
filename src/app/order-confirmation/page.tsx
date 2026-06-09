
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ShoppingCart, ListOrdered, Package, Truck, MapPin, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type OrderItem = {
  productName: string;
  artisanName: string;
  image: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  orderId?: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  status: string;
  trackingNumber?: string;
  shipping?: { name: string; address: string; city: string; pincode: string };
  paymentMethod?: string;
  createdAt: string;
};

export default function OrderConfirmationPage() {
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/db/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        const orders = json.data || [];
        if (orders.length > 0) {
          setLastOrder(orders[0]);
        }
      } catch (e) {
        console.error('Failed to fetch order', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLastOrder();
  }, []);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center flex-grow">
      <FadeIn direction="up">
        <Card className="w-full max-w-2xl text-center">
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
              Your order has been placed successfully. Pay cash on delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {lastOrder && (
              <div className="text-left space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <span className="font-mono font-medium">{lastOrder.orderId || lastOrder.id?.slice(-8)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="secondary">{lastOrder.status}</Badge>
                  </div>
                  {lastOrder.trackingNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tracking</span>
                      <span className="font-mono text-sm">{lastOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Order Items
                  </h3>
                  <div className="space-y-2">
                    {lastOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-2">
                        <Image src={item.image} alt={item.productName} width={40} height={40} className="rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">by {item.artisanName}</p>
                        </div>
                        <p className="text-sm font-medium">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {lastOrder.shipping && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Shipping Address
                    </h3>
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      <p>{lastOrder.shipping.name}</p>
                      <p className="text-muted-foreground">{lastOrder.shipping.address}, {lastOrder.shipping.city} - {lastOrder.shipping.pincode}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Payment
                  </h3>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    <p>Cash on Delivery</p>
                    <p className="text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{lastOrder.total}</span>
                </div>
              </div>
            )}

            <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
              <p>You can track your order status from the <strong>My Orders</strong> section in your dashboard.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button asChild>
                  <Link href="/explore"><ShoppingCart className="mr-2 h-4 w-4" />Continue Shopping</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="outline" asChild>
                  <Link href="/dashboard"><ListOrdered className="mr-2 h-4 w-4" />View Orders</Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </main>
  );
}
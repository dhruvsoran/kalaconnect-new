
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ListOrdered, Package, Truck, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

type Order = {
    id: string;
    date: string;
    total: string;
    status: 'Processing' | 'Shipped' | 'Delivered';
    trackingNumber: string;
    items: { name: string; image: string }[];
};

const mockOrders: Order[] = [
    {
        id: '#KC3021',
        date: 'June 28, 2024',
        total: '₹16,250.00',
        status: 'Shipped',
        trackingNumber: 'AWB73920481',
        items: [
            { name: 'Pashmina Shawl with Sozni Embroidery', image: 'https://picsum.photos/seed/shawl/800/800' },
            { name: 'Warli Art Coasters (Set of 4)', image: 'https://picsum.photos/seed/coasters/800/800' }
        ]
    },
    {
        id: '#KC2955',
        date: 'May 12, 2024',
        total: '₹4,200.00',
        status: 'Delivered',
        trackingNumber: 'AWB62849103',
        items: [
            { name: 'Blue Pottery Ceramic Vase', image: 'https://picsum.photos/seed/vase/800/800' }
        ]
    },
];

const statusConfig = {
    Processing: { icon: Package, progress: 25, color: 'bg-yellow-500' },
    Shipped: { icon: Truck, progress: 65, color: 'bg-blue-500' },
    Delivered: { icon: CheckCircle, progress: 100, color: 'bg-green-500' },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

     useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        const fetchOrders = () => {
             const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
             // To ensure we have some data to show initially, we can merge mock data if local storage is empty
             if (storedOrders.length === 0) {
                 setOrders(mockOrders);
                 localStorage.setItem('orders', JSON.stringify(mockOrders));
             } else {
                 setOrders(storedOrders);
             }
             setIsLoading(false);
        };

        fetchOrders();
        
        const handleOrdersUpdate = () => {
             const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
             setOrders(updatedOrders);
        }
        window.addEventListener('ordersUpdated', handleOrdersUpdate);


        return () => window.removeEventListener('ordersUpdated', handleOrdersUpdate);
    }, [router]);


    if (isLoading) {
        return (
             <div className="grid flex-1 auto-rows-max gap-4">
                 <div className="flex items-center">
                    <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2"><ListOrdered /> My Orders</h1>
                </div>
                 <Skeleton className="h-48 w-full" />
                 <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    return (
        <div className="grid flex-1 auto-rows-max gap-4">
             <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2"><ListOrdered /> My Orders</h1>
            </div>

            {orders.length > 0 ? (
                orders.map(order => (
                     <Card key={order.id}>
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                             <div>
                                <CardTitle className="font-headline">Order {order.id}</CardTitle>
                                <CardDescription>Date: {order.date} | Total: {order.total}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                                 {order.status !== 'Delivered' && (
                                     <Button variant="outline" size="sm">Track Order</Button>
                                 )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                               <p className="text-sm font-medium mb-2">Items</p>
                                <div className="flex space-x-4 overflow-x-auto pb-2">
                                    {order.items.map(item => (
                                        <div key={item.name} className="flex flex-col items-center gap-2 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                                            <span className="text-xs text-center w-20 truncate">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Order Status</p>
                                 <div className="relative h-2 rounded-full bg-muted">
                                    <div 
                                        className={`absolute h-2 rounded-full ${statusConfig[order.status].color} transition-all duration-500`}
                                        style={{ width: `${statusConfig[order.status].progress}%`}}
                                    ></div>
                                </div>
                                <div className="grid grid-cols-3 mt-2 text-xs text-muted-foreground">
                                    <span className="text-left">Processing</span>
                                    <span className="text-center">Shipped</span>
                                    <span className="text-right">Delivered</span>
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter>
                            <p className="text-sm text-muted-foreground">Tracking Number: <span className="font-medium text-foreground">{order.trackingNumber}</span></p>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-lg text-muted-foreground">You haven't placed any orders yet.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

    
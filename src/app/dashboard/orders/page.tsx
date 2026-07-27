'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListOrdered, Package, Truck, CheckCircle, Clock, XCircle, Loader2, Eye, XCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

type OrderItem = {
  productName: string;
  artisanName: string;
  image: string;
  price: number;
};

type StatusHistory = {
  status: string;
  timestamp: string;
  updatedBy: string;
  updatedByRole: string;
  note?: string;
};

type Order = {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  total: number;
  status: string;
  trackingNumber?: string;
  shipping?: { name: string; address: string; city: string; pincode: string };
  statusHistory?: StatusHistory[];
  createdAt: string;
};

const statusConfig: Record<string, { icon: any; color: string; progress: number }> = {
  Processing: { icon: Package, color: 'bg-yellow-500', progress: 15 },
  Confirmed: { icon: CheckCircle, color: 'bg-blue-500', progress: 35 },
  Shipped: { icon: Truck, color: 'bg-indigo-500', progress: 65 },
  Delivered: { icon: CheckCircle, color: 'bg-green-500', progress: 100 },
  Cancelled: { icon: XCircle, color: 'bg-red-500', progress: 0 },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/db/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('auth-change'));
        router.push('/login');
        return;
      }
      const json = await res.json();
      setOrders(json.data || []);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
    window.addEventListener('ordersUpdated', fetchOrders);
    return () => window.removeEventListener('ordersUpdated', fetchOrders);
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2"><ListOrdered /> My Orders</h1>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2"><ListOrdered /> My Orders</h1>
      </div>

      {orders.length > 0 ? (
        orders.map(order => {
          const cfg = statusConfig[order.status] || statusConfig.Processing;
          return (
            <Card key={order.id}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="font-headline text-base md:text-lg">Order {order.id?.slice(-8) || 'N/A'}</CardTitle>
                  <CardDescription>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'} · Total: ₹{order.total}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                    {order.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                    <Eye className="h-4 w-4 mr-1" /> Track
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Items</p>
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                        <img src={item.image || '/placeholder.svg'} alt={item.productName} className="h-16 w-16 rounded-md object-cover" />
                        <span className="text-xs text-center w-20 truncate">{item.productName}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Order Status</p>
                  <div className="relative h-2 rounded-full bg-muted">
                    <div
                      className={`absolute h-2 rounded-full ${cfg.color} transition-all duration-500`}
                      style={{ width: `${cfg.progress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 mt-2 text-xs text-muted-foreground">
                    <span>Processing</span>
                    <span className="text-center">Confirmed</span>
                    <span className="text-center">Shipped</span>
                    <span className="text-right">Delivered</span>
                  </div>
                </div>
                {order.trackingNumber && (
                  <p className="text-sm text-muted-foreground">Tracking: <span className="font-mono font-medium text-foreground">{order.trackingNumber}</span></p>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ListOrdered className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-lg text-muted-foreground">You haven&apos;t placed any orders yet.</p>
            <Button asChild className="mt-4">
              <a href="/explore">Start Shopping</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Order Tracking Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} role="dialog" aria-modal="true" aria-label="Order Tracking">
          <div className="bg-background rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-headline">Track Order {selectedOrder.id?.slice(-8)}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} aria-label="Close"><XCircleIcon className="h-5 w-5" /></Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Order Progress</p>
              <div className="relative h-2 rounded-full bg-muted">
                <div
                  className={`absolute h-2 rounded-full ${(statusConfig[selectedOrder.status] || statusConfig.Processing).color} transition-all duration-500`}
                  style={{ width: `${(statusConfig[selectedOrder.status] || statusConfig.Processing).progress}%` }}
                />
              </div>
              <div className="grid grid-cols-4 mt-2 text-xs text-muted-foreground">
                <span>Processing</span>
                <span className="text-center">Confirmed</span>
                <span className="text-center">Shipped</span>
                <span className="text-right">Delivered</span>
              </div>
            </div>

            {selectedOrder.trackingNumber && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono font-medium">{selectedOrder.trackingNumber}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Status History</p>
              <div className="space-y-3">
                {selectedOrder.statusHistory?.map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="font-medium">{s.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.timestamp).toLocaleString()}
                        {s.note && ` — ${s.note}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.shipping && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Shipping To</p>
                <p className="text-sm">{selectedOrder.shipping.name}, {selectedOrder.shipping.address}, {selectedOrder.shipping.city} - {selectedOrder.shipping.pincode}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Items</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-2">
                    <Image src={item.image} alt={item.productName} width={40} height={40} className="rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">by {item.artisanName}</p>
                    </div>
                    <p className="text-sm font-medium">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

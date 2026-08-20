'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Users,
  Loader2,
  Eye,
  XCircle,
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BrandLoading } from '@/components/brand-loading';
import { useUser } from '@/auth';
import { updateOrderStatusAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import ImageNext from 'next/image';

type ArtisanProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  status: string;
  stock: number;
  createdAt: string;
};

type ArtisanOrder = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  items: Array<{
    productName: string;
    image: string;
    price: number | string;
    quantity: number;
  }>;
  total: number | string;
  status: string;
  trackingNumber?: string;
  shipping?: { name: string; address: string; city: string; pincode: string };
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    updatedByRole: string;
    note?: string;
  }>;
  createdAt: string;
};

type BuyerOrder = {
  id: string;
  items: Array<{
    productName: string;
    artisanName: string;
    image: string;
    price: number | string;
  }>;
  total: number | string;
  status: string;
  trackingNumber?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
};

type BuyerProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  artisanName: string;
};

function ArtisanDashboard({ userId }: { userId: string }) {
  const [products, setProducts] = useState<ArtisanProduct[]>([]);
  const [orders, setOrders] = useState<ArtisanOrder[]>([]);
  const [stats, setStats] = useState({ productCount: 0, orderCount: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ArtisanOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/db/products', { headers }),
        fetch('/api/db/orders', { headers }),
      ]);

      const [productsJson, ordersJson] = await Promise.all([
        productsRes.json(),
        ordersRes.json(),
      ]);

      const allProducts = (productsJson.data || []).filter((p: any) => p.artisanId === userId);
      const allOrders = (ordersJson.data || []).filter((o: any) =>
        o.items?.some((item: any) => item.artisanId === userId)
      );

      setProducts(allProducts);
      setOrders(allOrders);
      setStats({
        productCount: allProducts.length,
        orderCount: allOrders.length,
        revenue: allOrders.reduce((sum: number, o: any) => {
          const raw = o.total;
          let num = 0;
          if (typeof raw === 'number') num = raw;
          else if (typeof raw === 'string') num = parseFloat(raw.replace(/[^0-9.]+/g, '')) || 0;
          return sum + num;
        }, 0),
      });
    } catch (e) {
      console.error('Failed to load artisan data', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const result = await updateOrderStatusAction(
        orderId,
        newStatus as any,
        userId,
        'artisan',
        `Status updated by artisan`,
        typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined
      );
      if ('success' in result && result.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        toast({ title: 'Order Updated', description: `Order status changed to ${newStatus}.` });
      } else {
        toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update order status.' });
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusConfig: Record<string, { icon: any; color: string; progress: number }> = {
    Processing: { icon: Clock, color: 'bg-yellow-500', progress: 15 },
    Confirmed: { icon: CheckCircle, color: 'bg-blue-500', progress: 35 },
    Shipped: { icon: Truck, color: 'bg-indigo-500', progress: 65 },
    Delivered: { icon: CheckCircle, color: 'bg-green-500', progress: 100 },
    Cancelled: { icon: XCircle, color: 'bg-red-500', progress: 0 },
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold font-headline">Artisan Workspace</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/products/new">Add Painting</Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<Package />} title="Products" value={stats.productCount} />
        <StatsCard icon={<ShoppingCart />} title="Orders" value={stats.orderCount} />
        <StatsCard icon={<DollarSign />} title="Revenue" value={`₹${stats.revenue.toFixed(2)}`} />
        <StatsCard icon={<Users />} title="Pending" value={orders.filter(o => o.status === 'Processing').length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Manage your orders and update tracking status</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => {
                const cfg = statusConfig[order.status] || statusConfig.Processing;
                return (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {order.items?.slice(0, 2).map((item, i) => (
                        <ImageNext
                          key={i}
                          src={item.image}
                          alt={item.productName}
                          width={40}
                          height={40}
                          className="rounded object-cover shrink-0"
                        />
                      ))}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{order.items?.map(i => i.productName).join(', ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.buyerName} · ₹{order.total} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                        {order.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4 mr-1" /> Track
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No orders yet. Your paintings will appear here once buyers purchase them.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Products ({products.length})</CardTitle>
          <CardDescription>All your uploaded paintings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="rounded-lg border overflow-hidden">
                <ImageNext src={product.image} alt={product.name} width={200} height={200} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold">₹{product.price}</span>
                    <Badge variant={product.status === 'Active' ? 'default' : 'secondary'} className="text-[10px]">{product.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No products yet. <Link href="/dashboard/products/new" className="text-primary underline">Upload your first painting</Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Tracking Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} role="dialog" aria-modal="true" aria-label="Order Tracking">
          <div className="bg-background rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-headline">Order Tracking</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} aria-label="Close"><XCircle className="h-5 w-5" /></Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Buyer: <span className="text-foreground font-medium">{selectedOrder.buyerName}</span>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Order Progress</p>
              <div className="relative h-2 rounded-full bg-muted">
                <div
                  className={`absolute h-2 rounded-full ${(statusConfig[selectedOrder.status] || statusConfig.Processing).color} transition-all duration-500`}
                  style={{ width: `${(statusConfig[selectedOrder.status] || statusConfig.Processing).progress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 mt-2 text-xs text-muted-foreground">
                <span>Processing</span>
                <span className="sm:text-center">Confirmed</span>
                <span className="sm:text-center">Shipped</span>
                <span className="sm:text-right">Delivered</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {['Processing', 'Confirmed', 'Shipped', 'Delivered'].map(status => (
                  <Button
                    key={status}
                    variant={selectedOrder.status === status ? 'default' : 'outline'}
                    size="sm"
                    disabled={updatingStatus || selectedOrder.status === status}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, status)}
                  >
                    {status}
                  </Button>
                ))}
                <Button
                  variant="destructive"
                  size="sm"
                  className="col-span-2"
                  disabled={updatingStatus || selectedOrder.status === 'Cancelled'}
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Cancelled')}
                >
                  Cancel Order
                </Button>
              </div>
              {updatingStatus && <Loader2 className="h-4 w-4 animate-spin mt-2" />}
            </div>

            {selectedOrder.trackingNumber && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono font-medium">{selectedOrder.trackingNumber}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Status History</p>
              <div className="space-y-2">
                {selectedOrder.statusHistory?.map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="font-medium">{s.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.timestamp).toLocaleString()} by {s.updatedByRole}
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
          </div>
        </div>
      )}
    </div>
  );
}

function BuyerDashboard({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [products, setProducts] = useState<BuyerProduct[]>([]);
  const [wishlist, setWishlist] = useState<BuyerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'recommended'>('overview');
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/db/orders', { headers }),
        fetch('/api/db/products', { headers }),
      ]);

      const [ordersJson, productsJson] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
      ]);

      setOrders(ordersJson.data || []);
      setProducts((productsJson.data || []).filter((p: any) => p.status === 'Active'));

      let storedWishlist: BuyerProduct[] = [];
      try { storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { storedWishlist = []; }
      setWishlist(storedWishlist);
    } catch (e) {
      console.error('Failed to load buyer data', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      let storedWishlist: BuyerProduct[] = [];
      try { storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { storedWishlist = []; }
      setWishlist(storedWishlist);
    };
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const removeFromWishlist = (productName: string) => {
    const newWishlist = wishlist.filter(item => item.name !== productName);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
    toast({ title: "Removed from wishlist" });
  };

  const addToCart = async (product: BuyerProduct) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch('/api/db/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ action: 'add', product }),
    });
    const json = await res.json();
    if (!json.error) {
      window.dispatchEvent(new Event('cartUpdated'));
      toast({ title: 'Added to Cart!', description: `${product.name} added to your cart.` });
    }
  };

  const statusConfig: Record<string, { icon: any; color: string; progress: number }> = {
    Processing: { icon: Clock, color: 'bg-yellow-500', progress: 15 },
    Confirmed: { icon: CheckCircle, color: 'bg-blue-500', progress: 35 },
    Shipped: { icon: Truck, color: 'bg-indigo-500', progress: 65 },
    Delivered: { icon: CheckCircle, color: 'bg-green-500', progress: 100 },
    Cancelled: { icon: XCircle, color: 'bg-red-500', progress: 0 },
  };

  const totalSpent = orders.reduce((sum, o) => {
    const raw = o.total;
    let num = 0;
    if (typeof raw === 'number') num = raw;
    else if (typeof raw === 'string') num = parseFloat(raw.replace(/[^0-9.]+/g, '')) || 0;
    return sum + num;
  }, 0);

  const pendingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed' || o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  const purchasedProductNames = orders.flatMap(o => o.items?.map(i => i.productName) || []);
  const recommendedProducts = products.filter(p => !purchasedProductNames.includes(p.name)).slice(0, 8);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold font-headline">My Gallery</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/explore">Discover More</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/profile">My Profile</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<Package />} title="Total Orders" value={orders.length} />
        <StatsCard icon={<Truck />} title="In Transit" value={pendingOrders} />
        <StatsCard icon={<CheckCircle />} title="Delivered" value={deliveredOrders} />
        <StatsCard icon={<DollarSign />} title="Total Spent" value={`₹${totalSpent.toFixed(2)}`} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['overview', 'orders', 'wishlist', 'recommended'] as const).map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize whitespace-nowrap"
          >
            {tab === 'recommended' ? 'For You' : tab}
            {tab === 'wishlist' && wishlist.length > 0 && ` (${wishlist.length})`}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {orders.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-headline">Recent Orders</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>View All</Button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => {
                  const cfg = statusConfig[order.status] || statusConfig.Processing;
                  return (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-2">
                            {order.items?.slice(0, 3).map((item, i) => (
                              <ImageNext key={i} src={item.image} alt={item.productName} width={48} height={48} className="rounded object-cover" />
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{order.items?.map(i => i.productName).join(', ')}</p>
                            <p className="text-sm text-muted-foreground">Total: ₹{order.total} · {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                              {order.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>Track</Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="relative h-1.5 rounded-full bg-muted">
                            <div className={`absolute h-1.5 rounded-full ${cfg.color}`} style={{ width: `${cfg.progress}%` }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-headline">Quick Links</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/orders" className="block">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-sm">My Orders</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/wishlist" className="block">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <p className="font-medium text-sm">Wishlist ({wishlist.length})</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/cart" className="block">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-sm">My Cart</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/profile" className="block">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-sm">Profile</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'orders' && (
        <section>
          <h2 className="text-xl font-bold font-headline mb-4">All Orders ({orders.length})</h2>
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map(order => {
                const cfg = statusConfig[order.status] || statusConfig.Processing;
                return (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <ImageNext key={i} src={item.image} alt={item.productName} width={48} height={48} className="rounded object-cover" />
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{order.items?.map(i => i.productName).join(', ')}</p>
                          <p className="text-sm text-muted-foreground">Total: ₹{order.total} · {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}>
                            {order.status}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>Track</Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="relative h-1.5 rounded-full bg-muted">
                          <div className={`absolute h-1.5 rounded-full ${cfg.color}`} style={{ width: `${cfg.progress}%` }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No orders yet. Start exploring art!</p>
                <Button asChild className="mt-4"><Link href="/explore">Browse Art</Link></Button>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {activeTab === 'wishlist' && (
        <section>
          <h2 className="text-xl font-bold font-headline mb-4">My Wishlist ({wishlist.length})</h2>
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlist.map(product => (
                <Card key={product.name} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <ImageNext src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm" onClick={() => removeFromWishlist(product.name)}>
                      <Activity className="h-4 w-4 fill-destructive text-destructive" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">by {product.artisanName}</p>
                    <p className="text-sm font-semibold mt-1">₹{product.price}</p>
                    <Button size="sm" className="w-full mt-2" onClick={() => addToCart(product)}>
                      <ShoppingCart className="mr-2 h-3 w-3" /> Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Your wishlist is empty.</p>
                <Button asChild className="mt-4"><Link href="/explore">Discover Art</Link></Button>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {activeTab === 'recommended' && (
        <section>
          <h2 className="text-xl font-bold font-headline mb-4">Recommended For You</h2>
          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedProducts.map(product => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <ImageNext src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">by {product.artisanName}</p>
                    <p className="text-sm font-semibold mt-1">₹{product.price}</p>
                    <Button size="sm" className="w-full mt-2" onClick={() => addToCart(product)}>
                      <ShoppingCart className="mr-2 h-3 w-3" /> Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>You&apos;ve explored all our artworks!</p>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} role="dialog" aria-modal="true" aria-label="Track Your Order">
          <div className="bg-background rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-headline">Track Your Order</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} aria-label="Close"><XCircle className="h-5 w-5" /></Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Order Progress</p>
              <div className="relative h-2 rounded-full bg-muted">
                <div
                  className={`absolute h-2 rounded-full ${(statusConfig[selectedOrder.status] || statusConfig.Processing).color} transition-all duration-500`}
                  style={{ width: `${(statusConfig[selectedOrder.status] || statusConfig.Processing).progress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 mt-2 text-xs text-muted-foreground">
                <span>Processing</span>
                <span className="sm:text-center">Confirmed</span>
                <span className="sm:text-center">Shipped</span>
                <span className="sm:text-right">Delivered</span>
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
              <div className="space-y-2">
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
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ icon, title, value }: { icon: any; title: string; value: string | number }) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      fetch('/api/auth/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        .then(r => r.json())
        .then(json => {
          setProfile(json.user);
          setProfileLoading(false);
          if (json.user?.role === 'admin') {
            router.push('/admin');
          }
        })
        .catch(() => {
          setProfileLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || profileLoading) {
    return <BrandLoading />;
  }

  if (!user) return null;
  if (profile?.role === 'admin') return null;

  return profile?.role === 'artisan' ? (
    <ArtisanDashboard userId={user.id} />
  ) : (
    <BuyerDashboard userId={user.id} />
  );
}

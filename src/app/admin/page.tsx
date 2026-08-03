'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/auth';
import { useRouter } from 'next/navigation';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Search,
  SearchX,
  Trash2,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Image as ImageIcon,
  UserCheck,
  Mail,
  MailOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { deleteProductAction, updateOrderStatusAction } from '@/lib/actions';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AdminUser = { id: string; name: string; email: string; role: string; avatar?: string };
type AdminProduct = {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  artisanId: string;
  artisanName: string;
  category?: string;
  createdAt: string;
};
type AdminOrder = {
  id: string;
  _id?: string;
  orderId?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    artisanId: string;
    artisanName: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  shipping?: { name: string; address: string; city: string; pincode: string };
  paymentMethod: string;
  subtotal: number;
  transactionFee: number;
  total: number | string;
  status: string;
  trackingNumber?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    updatedByRole: string;
    note?: string;
  }>;
  createdAt: string;
};
type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};
type SystemLogEntry = {
  id: string;
  level: 'info' | 'warn' | 'error' | 'success';
  category: string;
  message: string;
  details?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  createdAt: string;
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [usersRes, productsRes, ordersRes, messagesRes, logsRes] = await Promise.all([
        fetch('/api/db/users', { headers }),
        fetch('/api/db/products', { headers }),
        fetch('/api/db/orders', { headers }),
        fetch('/api/db/contactMessages', { headers }),
        fetch('/api/db/systemLogs?limit=200', { headers }),
      ]);

      const [usersJson, productsJson, ordersJson, messagesJson, logsJson] = await Promise.all([
        usersRes.json(),
        productsRes.json(),
        ordersRes.json(),
        messagesRes.json(),
        logsRes.json(),
      ]);

      setUsers(usersJson.data || []);
      setProducts(productsJson.data || []);
      setOrders(ordersJson.data || []);
      setMessages(messagesJson.data || []);
      setLogs(logsJson.data || []);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (!authLoading && user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user?.role === 'admin') fetchData();
  }, [user, authLoading, router, fetchData]);

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const result = await deleteProductAction(productId);
    if ('success' in result && result.success) {
      setProducts(products.filter(p => p.id !== productId));
      toast({ title: 'Product Deleted', description: `"${productName}" has been removed.` });
    } else {
      toast({ variant: 'destructive', title: 'Delete Failed', description: 'Could not delete the product.' });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const result = await updateOrderStatusAction(
        orderId,
        newStatus as any,
        user?.id || '',
        'admin',
        `Status updated by admin`
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

  if (authLoading || loading) {
    return <AdminSkeleton />;
  }

  const artisans = users.filter(u => u.role === 'artisan');
  const buyers = users.filter(u => u.role === 'buyer');

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.artisanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasActiveSearch = searchTerm.trim() !== '';
  const filteredBuyers = filteredUsers.filter(u => u.role === 'buyer');
  const filteredArtisans = filteredUsers.filter(u => u.role === 'artisan');

  const totalRevenue = orders.reduce((sum, o) => {
    const raw = o.total;
    let num = 0;
    if (typeof raw === 'number') {
      num = raw;
    } else if (typeof raw === 'string') {
      num = parseFloat(raw.replace(/[^0-9.]+/g, '')) || 0;
    }
    return sum + num;
  }, 0);

  const statusConfig: Record<string, { icon: any; color: string; progress: number }> = {
    Processing: { icon: Clock, color: 'bg-yellow-500', progress: 15 },
    Confirmed: { icon: CheckCircle, color: 'bg-blue-500', progress: 35 },
    Shipped: { icon: Truck, color: 'bg-indigo-500', progress: 65 },
    Delivered: { icon: CheckCircle, color: 'bg-green-500', progress: 100 },
    Cancelled: { icon: XCircle, color: 'bg-red-500', progress: 0 },
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold flex items-center gap-3">
            <ShieldCheck className="text-primary h-8 w-8 md:h-10 md:w-10" /> Admin Command Center
          </h1>
          <p className="text-muted-foreground mt-2">Managing कलाConnect Ecosystem</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users or orders..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        <StatsCard icon={<Users />} title="Total Users" value={users.length} />
        <StatsCard icon={<UserCheck />} title="Artisans" value={artisans.length} />
        <StatsCard icon={<Package />} title="Total Products" value={products.length} />
        <StatsCard icon={<TrendingUp />} title="Revenue" value={`₹${totalRevenue.toFixed(2)}`} />
        <StatsCard icon={<Mail />} title="Messages" value={messages.filter(m => !m.read).length || messages.length} />
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 max-w-xl">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Buyers</TabsTrigger>
          <TabsTrigger value="artisans">Artisans</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>All Products ({filteredProducts.length})</CardTitle>
                  <CardDescription>Manage all paintings on the platform</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Artisan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Price</TableHead>
                      <TableHead className="hidden md:table-cell">Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded-md object-cover aspect-square"
                          />
                        </TableCell>
                        <TableCell className="font-medium max-w-[150px] truncate">{product.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{product.artisanName}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>{product.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">₹{product.price}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          {hasActiveSearch ? (
                            <EmptySearchState searchTerm={searchTerm} onClear={() => setSearchTerm('')} />
                          ) : (
                            <div className="h-24 flex items-center justify-center">No products on the platform yet.</div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
              <CardDescription>Track and manage all platform orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead className="hidden md:table-cell">Buyer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id?.slice(-8) || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">{order.buyerName}</div>
                          <div className="text-xs text-muted-foreground">{order.buyerEmail}</div>
                        </TableCell>
                        <TableCell>{order.items?.length || 0}</TableCell>
                        <TableCell className="font-medium">₹{order.total}</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'Delivered' ? 'default' :
                            order.status === 'Cancelled' ? 'destructive' : 'secondary'
                          }>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          {hasActiveSearch ? (
                            <EmptySearchState searchTerm={searchTerm} onClear={() => setSearchTerm('')} />
                          ) : (
                            <div className="h-24 flex items-center justify-center">No orders yet.</div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Buyers ({filteredBuyers.length})</CardTitle>
              <CardDescription>View all registered buyers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuyers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatar} />
                            <AvatarFallback>{u.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{u.name || 'Unknown'}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{u.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBuyers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          {hasActiveSearch ? (
                            <EmptySearchState searchTerm={searchTerm} onClear={() => setSearchTerm('')} />
                          ) : (
                            <div className="h-24 flex items-center justify-center">No buyers registered yet.</div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artisans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredArtisans.map(artisan => (
              <Card key={artisan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={artisan.avatar} />
                    <AvatarFallback>{artisan.name?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-headline">{artisan.name || 'Unknown Artisan'}</CardTitle>
                    <CardDescription className="text-xs">{artisan.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Products: <strong className="text-foreground">{products.filter(p => p.artisanId === artisan.id).length}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredArtisans.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {hasActiveSearch ? (
                  <EmptySearchState searchTerm={searchTerm} onClear={() => setSearchTerm('')} />
                ) : (
                  <div className="py-4">No artisans registered yet.</div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages ({messages.length})</CardTitle>
              <CardDescription>Messages from users who want to connect with us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.length > 0 ? messages.map((msg) => (
                      <TableRow key={msg.id} className={msg.read ? '' : 'bg-primary/5'}>
                        <TableCell>
                          {msg.read ? (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Mail className="h-4 w-4 text-primary" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{msg.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{msg.email}</TableCell>
                        <TableCell>{msg.subject}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(msg)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                          No messages yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>System Logs ({logs.length})</CardTitle>
                  <CardDescription>Activity logs, errors, and system events</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600">
                    {logs.filter(l => l.level === 'success').length} success
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                    {logs.filter(l => l.level === 'info').length} info
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                    {logs.filter(l => l.level === 'warn').length} warnings
                  </Badge>
                  <Badge variant="outline" className="bg-red-500/10 text-red-600">
                    {logs.filter(l => l.level === 'error').length} errors
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Level</TableHead>
                      <TableHead className="w-24">Category</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="hidden md:table-cell w-32">Path</TableHead>
                      <TableHead className="hidden md:table-cell w-40">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length > 0 ? logs.map((log) => (
                      <TableRow key={log.id} className={
                        log.level === 'error' ? 'bg-red-500/5' :
                        log.level === 'warn' ? 'bg-yellow-500/5' : ''
                      }>
                        <TableCell>
                          <Badge variant={
                            log.level === 'error' ? 'destructive' :
                            log.level === 'warn' ? 'secondary' :
                            log.level === 'success' ? 'default' : 'outline'
                          } className="text-xs">
                            {log.level === 'error' ? 'ERROR' :
                             log.level === 'warn' ? 'WARN' :
                             log.level === 'success' ? 'OK' : 'INFO'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground uppercase">
                          {log.category}
                        </TableCell>
                        <TableCell className="text-sm max-w-[300px] truncate">
                          {log.message}
                          {log.details && (
                            <span className="block text-xs text-muted-foreground mt-0.5 truncate">
                              {log.details}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                          {log.method && <span className="font-bold">{log.method}</span>}
                          {log.path}
                          {log.statusCode ? ` ${log.statusCode}` : ''}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                          No logs yet. Activity will appear here as users interact with the site.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline">Order Details</DialogTitle>
            <DialogDescription>Order ID: {selectedOrder?.id}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Buyer</p>
                  <p className="font-medium">{selectedOrder.buyerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.buyerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">₹{selectedOrder.total}</p>
                </div>
              </div>

              {selectedOrder.shipping && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                  <p className="text-sm">{selectedOrder.shipping.name}, {selectedOrder.shipping.address}, {selectedOrder.shipping.city} - {selectedOrder.shipping.pincode}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg p-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">by {item.artisanName}</p>
                      </div>
                      <p className="text-sm font-medium">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Status Timeline</p>
                <div className="space-y-2">
                  {selectedOrder.statusHistory?.map((s, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <p className="font-medium">{s.status}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(s.timestamp).toLocaleString()} by {s.updatedByRole}
                          {s.note && ` — ${s.note}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) => handleUpdateOrderStatus(selectedOrder.id, val)}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {updatingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>From {selectedMessage?.name} ({selectedMessage?.email})</DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              {selectedMessage.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedMessage.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatsCard({ icon, title, value }: { icon: any; title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function AdminSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <Skeleton className="h-12 w-96" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

function EmptySearchState({ searchTerm, onClear }: { searchTerm: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <SearchX className="h-8 w-8 text-muted-foreground/60" />
      <div>
        <p className="font-medium text-foreground">No Results Found</p>
        <p className="text-sm text-muted-foreground mt-1">
          No matches for &ldquo;{searchTerm}&rdquo;. Try a different search term.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear Search
      </Button>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useUser, useDoc, useFirebase, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  ShieldCheck,
  Search,
  MoreVertical,
  Mail,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const usersRef = firestore ? collection(firestore, 'users') : null;
  const { data: users, loading: usersLoading } = useCollection(usersRef);

  const profileRef = (firestore && user) ? doc(firestore, 'users', user.uid) : null;
  const { data: profile, loading: profileLoading } = useDoc(profileRef);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    // Safety check for Admin Identity
    if (!profileLoading && profile) {
        const isAdmin = profile.role === 'admin' || profile.name.trim() === 'Dhruv';
        if (!isAdmin) {
            router.push('/dashboard');
        }
    }
  }, [user, authLoading, profile, profileLoading, router]);

  if (authLoading || profileLoading || usersLoading) {
    return <AdminSkeleton />;
  }

  const artisans = users?.filter(u => u.role === 'artisan') || [];
  const buyers = users?.filter(u => u.role === 'buyer') || [];
  
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold flex items-center gap-3">
            <ShieldCheck className="text-primary h-10 w-10" /> Admin Command Center
          </h1>
          <p className="text-muted-foreground mt-2">Managing कलाConnect Ecosystem | Welcome, Dhruv</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={<Users />} title="Total Users" value={users?.length || 0} trend="+12%" />
        <StatsCard icon={<UserCheck />} title="Artisans" value={artisans.length} trend="+5%" />
        <StatsCard icon={<Package />} title="Total Products" value="1,284" trend="+8%" />
        <StatsCard icon={<TrendingUp />} title="Revenue" value="₹2,45,000" trend="+15%" />
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="users">Buyers</TabsTrigger>
          <TabsTrigger value="artisans">Artisans</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Buyers</CardTitle>
              <CardDescription>View and manage all registered buyers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyers.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.avatar} />
                          <AvatarFallback>{u.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">Jan 12, 2024</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artisans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map(artisan => (
              <Card key={artisan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={artisan.avatar} />
                    <AvatarFallback>{artisan.name?.[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-headline">{artisan.name}</CardTitle>
                    <CardDescription>{artisan.location || 'Jaipur, Rajasthan'}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-muted-foreground">Products: <strong className="text-foreground">12</strong></span>
                    <span className="text-muted-foreground">Followers: <strong className="text-foreground">452</strong></span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs line-clamp-2 italic text-muted-foreground">"{artisan.story || 'A master of traditional crafts...'}"</p>
                  </div>
                </CardContent>
                <CardContent className="pt-0 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full">View Shop</Button>
                  <Button variant="secondary" size="sm" className="w-full"><Mail className="h-3 w-3 mr-2" />Contact</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Sales History</CardTitle>
              <CardDescription>Track every transaction across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Loading global transaction data...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({ icon, title, value, trend }: { icon: any, title: string, value: string | number, trend: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-green-500 font-medium mt-1">{trend} <span className="text-muted-foreground font-normal">from last month</span></p>
      </CardContent>
    </Card>
  );
}

function AdminSkeleton() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <Skeleton className="h-12 w-96" />
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
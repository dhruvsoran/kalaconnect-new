"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
  Sparkles,
  Zap,
  TrendingUp,
  Heart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getProducts, Product } from '@/lib/db';
import { Skeleton } from '@/components/ui/skeleton';
import { receiveProductRecommendations } from '@/ai/flows/receive-product-recommendations';
import { useUser, useDoc, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

function ArtisanDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Artisan Workspace</h1>
        <Badge variant="secondary" className="px-3 py-1">Top 5% Creator</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<DollarSign />} title="Total Revenue" value="₹45,231.89" sub="20% vs last mo." />
        <StatsCard icon={<CreditCard />} title="Total Sales" value="+12,234" sub="19% vs last mo." />
        <StatsCard icon={<Users />} title="Followers" value="+2,450" sub="180% vs last mo." />
        <StatsCard icon={<Activity />} title="Profile Views" value="+5,873" sub="Active now" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Activity</CardTitle>
              <CardDescription>Recent interactions with your heritage pieces.</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="text-xs text-muted-foreground">London, UK</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">Purchase</Badge></TableCell>
                  <TableCell className="text-right">₹12,250</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Priya Sharma</div>
                    <div className="text-xs text-muted-foreground">Mumbai, IN</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">Like</Badge></TableCell>
                  <TableCell className="text-right">--</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-primary">Market Opportunity</p>
                <p className="text-xs text-muted-foreground mt-1">Terracotta statues are trending in Western markets. Consider listing 3 more items.</p>
             </div>
             <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <p className="text-sm font-semibold text-green-600">Pricing Optimization</p>
                <p className="text-xs text-muted-foreground mt-1">Similar Madhubani pieces are selling for 15% more. Try adjusting your prices.</p>
             </div>
             <Button variant="outline" className="w-full" asChild><Link href="/dashboard/marketing">Generate Marketing Kit</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ icon, title, value, sub }: { icon: any, title: string, value: string, sub: string }) {
    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
        </Card>
    )
}

function BuyerDashboard() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const allProducts = await getProducts();
      const active = allProducts.filter(p => p.status === 'Active');
      
      try {
        const result = await receiveProductRecommendations({
            customerPreferences: "Interested in traditional Indian heritage art and paintings",
            browsingHistory: "Recently explored Madhubani and Warli art sections"
        });
        // For simulation, we take a few active products
        setRecommendations(active.slice(0, 4));
      } catch (e) {
        setRecommendations(active.slice(0, 4));
      }
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">My Gallery Feed</h1>
        <Button variant="outline" size="sm" asChild><Link href="/explore">Discover More Art</Link></Button>
      </div>

      <section>
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-xl font-bold font-headline">AI Curated Picks</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map(p => <SmallProductCard key={p.name} product={p} />)}
            </div>
          )}
      </section>

      <section className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="card-3d">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline"><Heart className="h-5 w-5 text-red-500" /> Community Buzz</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground">The artisan "Ravi Kumar" just posted a new Pattachitra mural. Many buyers from your circle liked it!</p>
                  <Button variant="link" className="p-0 mt-2 h-auto" asChild><Link href="/explore">View Interaction</Link></Button>
              </CardContent>
          </Card>
          <Card className="card-3d">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline"><TrendingUp className="h-5 w-5" /> Market Pulse</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground">Traditional Tanjore art is seeing a resurgence in global collections this season.</p>
                  <Button variant="link" className="p-0 mt-2 h-auto" asChild><Link href="/explore">Explore Tanjore</Link></Button>
              </CardContent>
          </Card>
      </section>
    </div>
  );
}

function SmallProductCard({ product }: { product: Product }) {
    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-0 border-b relative">
                 <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="aspect-square object-cover w-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" asChild><Link href="/explore">View Details</Link></Button>
                </div>
            </CardHeader>
            <CardContent className="p-3">
                <h3 className="font-bold text-sm truncate font-headline">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{product.price}</p>
            </CardContent>
        </Card>
    )
}

export default function Dashboard() {
    const { user, loading: authLoading } = useUser();
    const { firestore } = useFirebase();

    const profileRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: profile, loading: docLoading } = useDoc(profileRef);

    if (authLoading || docLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
    
    return profile?.role === 'artisan' ? <ArtisanDashboard /> : <BuyerDashboard />;
}
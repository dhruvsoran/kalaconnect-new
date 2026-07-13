'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingCart,
  MessageCircle,
  Share2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion-wrapper';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { TTSButton } from '@/components/ui/tts-button';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  artisanName: string;
  status: string;
  category?: string;
  tags?: string[];
};

const categories = ['All', 'Paintings', 'Sculptures', 'Textiles', 'Pottery', 'Jewelry', 'Other'];

export default function ExploreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/db/products?select=id,name,description,price,image,artisanName,status,category,tags');
        if (!res.ok) throw new Error('Failed to load products');
        const json = await res.json();
        setProducts(json.data || []);
      } catch (e) {
        console.error('Failed to load products', e);
        setError('Something went wrong loading products. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'All' ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <FadeIn direction="down">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">Discovery Center</h1>
        </FadeIn>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Connect with Indian heritage and the souls behind the art.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artworks, artisans, or styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-1" />
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="rounded-lg border bg-card animate-pulse h-[400px]" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.06}>
          {filteredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      ) : error ? (
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Unable to Load Products</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {searchQuery || selectedCategory !== 'All' ? 'No Results Found' : 'Marketplace Coming Soon'}
            </CardTitle>
            <CardDescription>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters to find what you are looking for.'
                : 'Our artisans are busy creating! Check back soon to see their beautiful products.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(searchQuery || selectedCategory !== 'All') ? (
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4">
                Clear Filters
              </Button>
            ) : (
              <Button asChild className="mt-4">
                <Link href="/">Back to Home</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<{ user: string; text: string; id?: string }[]>([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadInteractions() {
      try {
        const token = localStorage.getItem('token');
        const resLikes = await fetch(`/api/db/likes?productId=${encodeURIComponent(product.name)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const likesJson = await resLikes.json();
        if (cancelled) return;
        setLikes(likesJson.data?.count || 0);
        setIsLiked(likesJson.data?.isLiked || false);

        const resComments = await fetch(`/api/db/comments?productId=${encodeURIComponent(product.name)}`);
        const commentsJson = await resComments.json();
        if (cancelled) return;
        setComments((commentsJson.data || []).reverse());
      } catch (e) {
        console.error('Failed to load interactions', e);
      }
    }
    loadInteractions();
    return () => { cancelled = true; };
  }, [product.name]);

  const handleAuthAction = (callback: () => void) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Join the community to interact with art.",
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
            Login
          </Button>
        ),
      });
      return;
    }
    callback();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.description, url: window.location.href });
      } catch (err) { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const handleLike = async () => {
    handleAuthAction(async () => {
      const token = localStorage.getItem('token');
      if (!isLiked) {
        const res = await fetch('/api/db/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ productId: product.name, action: 'add' }),
        });
        const json = await res.json();
        if (!json.error) {
          setIsLiked(true);
          setLikes(prev => prev + 1);
        }
      } else {
        const res = await fetch('/api/db/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ productId: product.name, action: 'remove' }),
        });
        const json = await res.json();
        if (!json.error) {
          setIsLiked(false);
          setLikes(prev => Math.max(0, prev - 1));
        }
      }
    });
  };

  const handleAddToCart = async () => {
    handleAuthAction(async () => {
      const role = localStorage.getItem('userRole');
      if (role === 'artisan' || role === 'admin') {
        toast({ variant: 'destructive', title: 'Not allowed', description: 'Artists/Admins cannot add to cart.' });
        return;
      }
      const token = localStorage.getItem('token');
      const res = await fetch('/api/db/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ action: 'add', product }),
      });
      const json = await res.json();
      if (json.error) {
        toast({ variant: 'destructive', title: 'Failed to add to cart' });
        return;
      }
      window.dispatchEvent(new Event('cartUpdated'));
      toast({ title: 'Added to Cart!', description: `${product.name} added to your cart.` });
    });
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    handleAuthAction(async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/db/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ productId: product.name, text: commentText }),
      });
      const json = await res.json();
      if (!json.error) {
        const name = user?.name || 'You';
        setComments(prev => [{ user: name, text: commentText, id: json.id }, ...prev]);
        setCommentText("");
        toast({ title: "Comment posted!" });
      }
    });
  };

  return (
    <div>
      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.image}
        price={product.price}
        brand={product.artisanName}
        sku={product.id}
      />
      <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Card className="overflow-hidden flex flex-col group transition-all duration-300" itemScope itemType="https://schema.org/Product">
        <CardHeader className="p-0 relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.85 }}>
              <Button size="icon" variant="ghost" className="bg-white/50 backdrop-blur-sm rounded-full" onClick={handleLike}>
                <Heart className={cn("h-5 w-5 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-gray-500")} />
              </Button>
            </motion.div>
            <Button size="icon" variant="ghost" className="bg-white/50 backdrop-blur-sm rounded-full" onClick={handleShare}>
              <Share2 className="h-5 w-5 text-gray-500" />
            </Button>
            <TTSButton text={`${product.name}. Created by ${product.artisanName}. ${product.description}`} />
          </div>
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
              itemProp="image"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
            />
          </Link>
        </CardHeader>
        <CardContent className="p-4 flex-grow space-y-2">
          <div className="flex items-center justify-between">
            <Link href={`/product/${product.id}`} className="hover:underline">
              <h3 itemProp="name" className="font-bold text-lg font-headline truncate">{product.name}</h3>
            </Link>
            <Badge variant="secondary" className="text-[10px] h-5 shrink-0" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span itemProp="priceCurrency" content="INR" />₹<span itemProp="price">{product.price}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span itemProp="brand" itemScope itemType="https://schema.org/Brand">by <span itemProp="name">{product.artisanName}</span></span>
          </div>
          <p itemProp="description" className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
            <span className="flex items-center gap-1"><Heart className="h-3 w-3 fill-red-500 text-red-500" /> {likes}</span>
            <Dialog>
              <DialogTrigger asChild>
                <span className="flex items-center gap-1 cursor-pointer hover:text-primary"><MessageCircle className="h-3 w-3" /> {comments.length}</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                  <DialogDescription>Share your thoughts with the artisan.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                    {comments.length > 0 ? comments.map((c, i) => (
                      <div key={i} className="flex gap-2">
                        <Avatar className="h-8 w-8"><AvatarFallback>U</AvatarFallback></Avatar>
                        <div className="bg-muted p-2 rounded-lg text-sm">
                          <p className="font-bold">{c.user}</p>
                          <p>{c.text}</p>
                        </div>
                      </div>
                    )) : <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <Button onClick={handleAddComment}>Post</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <div className="p-4 pt-0">
          <motion.div whileTap={{ scale: 0.95 }} className="w-full">
            <Button className="w-full" size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
    </div>
  );
}

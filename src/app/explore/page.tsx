
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts, Product } from '@/lib/db';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingCart, 
  MessageCircle, 
  Share2, 
  UserPlus,
  ArrowRight
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ExplorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        async function fetchProducts() {
            const allProducts = await getProducts();
            setProducts(allProducts.filter(p => p.status === 'Active'));
        }
        fetchProducts();
    }, []);
    

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline animate-fade-in-down">Discovery Center</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground animate-fade-in-up">
                    Connect with Indian heritage and the souls behind the art.
                </p>
            </div>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                       <ProductCard key={product.name} product={product} />
                    ))}
                </div>
            ) : (
                <Card className="m-4">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Marketplace Coming Soon</CardTitle>
                        <CardDescription>
                            Our artisans are busy creating! Check back soon to see their beautiful products.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild className="mt-4">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}


function ProductCard({ product }: { product: Product }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<{user: string, text: string}[]>([]);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);
    
    const handleAuthAction = (callback: () => void) => {
         if (!isLoggedIn) {
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
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link copied to clipboard!" });
        }
    }

    const handleLike = () => {
        handleAuthAction(() => {
            setIsLiked(!isLiked);
            setLikes(prev => isLiked ? prev - 1 : prev + 1);
        });
    }

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        setComments([...comments, { user: "Me", text: commentText }]);
        setCommentText("");
        toast({ title: "Comment posted!" });
    }

    return (
        <Card className="overflow-hidden flex flex-col group transition-all duration-300 card-3d">
            <CardHeader className="p-0 relative">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="bg-white/50 backdrop-blur-sm rounded-full" 
                        onClick={handleLike}
                    >
                        <Heart className={cn("h-5 w-5 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-gray-500")} />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="bg-white/50 backdrop-blur-sm rounded-full" 
                        onClick={handleShare}
                    >
                        <Share2 className="h-5 w-5 text-gray-500" />
                    </Button>
                </div>
                <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                />
            </CardHeader>
            <CardContent className="p-4 flex-grow space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg font-headline truncate">{product.name}</h3>
                    <Badge variant="secondary" className="text-[10px] h-5">₹{product.price}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-5 w-5">
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <span>By Heritage Artisan</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] ml-auto hover:bg-primary/10 hover:text-primary">
                        <UserPlus className="h-3 w-3 mr-1" /> Follow
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3 fill-red-500 text-red-500" /> {likes} Likes</span>
                    <Dialog>
                        <DialogTrigger asChild>
                            <span className="flex items-center gap-1 cursor-pointer hover:text-primary"><MessageCircle className="h-3 w-3" /> {comments.length} Comments</span>
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
            <CardFooter className="p-4 pt-0">
                <Button className="w-full" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}

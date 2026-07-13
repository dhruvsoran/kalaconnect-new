'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailClientProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    artisanId: string;
    artisanName: string;
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please login to add items to your cart.',
      });
      router.push('/login');
      return;
    }

    const role = localStorage.getItem('userRole');
    if (role === 'artisan' || role === 'admin') {
      toast({
        variant: 'destructive',
        title: 'Not Allowed',
        description: 'Artists/Admins cannot add to cart.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/db/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: 'add',
          product: {
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            artisanId: product.artisanId,
            artisanName: product.artisanName,
          },
        }),
      });
      const json = await res.json();
      if (json.error) {
        toast({ variant: 'destructive', title: 'Failed to add to cart' });
        return;
      }
      window.dispatchEvent(new Event('cartUpdated'));
      toast({
        title: 'Added to Cart!',
        description: `${product.name} added to your cart.`,
      });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to add to cart' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please login to add items to your wishlist.',
      });
      router.push('/login');
      return;
    }

    try {
      const stored = localStorage.getItem('wishlist');
      const wishlist = stored ? JSON.parse(stored) : [];
      const exists = wishlist.some((item: any) => item.name === product.name);
      
      if (exists) {
        toast({ title: 'Already in wishlist' });
        return;
      }

      wishlist.push({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        artisanId: product.artisanId,
        artisanName: product.artisanName,
      });
      
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      toast({
        title: 'Added to Wishlist!',
        description: `${product.name} added to your wishlist.`,
      });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to add to wishlist' });
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={handleAddToWishlist}
      >
        <Heart className="h-5 w-5" />
      </Button>
    </div>
  );
}

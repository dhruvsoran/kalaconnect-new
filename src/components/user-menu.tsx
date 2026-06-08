"use client";

import { useRouter } from 'next/navigation';
import { User, LogOut, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { Skeleton } from './ui/skeleton';

export function UserMenu() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      fetch('/api/auth/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        .then(r => r.json())
        .then(json => setProfile(json.user))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      window.dispatchEvent(new Event('auth-change'));
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
    router.push('/');
  };

  if (authLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar} alt={profile?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{profile?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-headline font-bold">
          {profile?.name || 'User'}
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{profile?.role || 'buyer'}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/wishlist')}>
          <Heart className="mr-2 h-4 w-4" /> Favorites
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem className="text-primary font-bold" onClick={() => router.push('/admin')}>
            <ShieldCheck className="mr-2 h-4 w-4" /> Admin Console
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

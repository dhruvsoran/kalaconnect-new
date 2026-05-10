"use client";

import { useRouter } from 'next/navigation';
import { User, LogOut, ShieldCheck, Settings, Heart } from 'lucide-react';
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
import { useUser, useDoc, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function UserMenu() {
    const router = useRouter();
    const { user, loading: authLoading } = useUser();
    const { firestore } = useFirebase();
    const auth = useAuth();

    const profileRef = (firestore && user) ? doc(firestore, 'users', user.uid) : null;
    const { data: profile, loading: docLoading } = useDoc(profileRef);

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('cart');
            localStorage.removeItem('wishlist');
            window.dispatchEvent(new Event('cartUpdated'));
            window.dispatchEvent(new Event('wishlistUpdated'));
        }
        router.push('/');
    };

    if (authLoading || docLoading) {
        return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    const isAdmin = profile?.role === 'admin' || profile?.name.trim() === 'Dhruv';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                 <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar} alt={profile?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{profile?.name?.[0].toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-headline font-bold">
                {profile?.name}
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{profile?.role}</div>
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
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
    );
}
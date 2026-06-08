
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Using JWT auth via API
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KalaConnectIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion-wrapper';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      if (typeof window !== 'undefined' && json.token) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('isLoggedIn', 'true');
        if (json.user?.role) localStorage.setItem('userRole', json.user.role);
        if (json.user?.id) localStorage.setItem('userId', json.user.id);
        window.dispatchEvent(new Event('auth-change'));
      }
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      router.push(json.user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      <FadeIn direction="up" className="w-full">
        <Card className="mx-auto max-w-sm w-full shadow-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
               <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
                <KalaConnectIcon className="h-8 w-8 text-primary" />
                <span className="font-headline">कलाConnect</span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Access your secure कलाConnect account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
                </Button>
              </motion.div>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

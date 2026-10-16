'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KalaConnectIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion-wrapper';
import { BrandLoading } from '@/components/brand-loading';
import { Suspense } from 'react';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'artisan'>('buyer');
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast({
        title: 'Email verified!',
        description: 'Your email has been verified. You can now log in.',
      });
    }
    if (searchParams.get('error')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: searchParams.get('error'),
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Read CSRF token from cookie
    const csrfCookie = document.cookie.split(';').find(c => c.trim().startsWith('_csrf='));
    if (csrfCookie) {
      setCsrfToken(csrfCookie.split('=')[1].trim());
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('google-login') === 'success') {
      // Try to get token from httpOnly auth_token cookie via fetch to /api/auth/me
      // Since auth_token is httpOnly, we need to fetch the me endpoint
      fetch('/api/auth/me', {
        credentials: 'include', // send httpOnly cookies
      }).then(async (res) => {
        const json = await res.json();
        if (json.user) {
          localStorage.setItem('token', json.token || ''); // token from me endpoint
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', json.user.id);
          localStorage.setItem('userEmail', json.user.email);
          localStorage.setItem('userName', json.user.name || '');
          localStorage.setItem('userRole', json.user.role);
          window.dispatchEvent(new Event('auth-change'));

          toast({
            title: 'Welcome!',
            description: 'You have successfully signed in with Google.',
          });
          router.push(json.user.role === 'admin' ? '/admin' : '/dashboard');
        }
      }).catch((e) => {
        console.error('Failed to fetch user info after Google login', e);
      });
    }
  }, [router, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (json.needsVerification) {
        setNeedsVerification(true);
        setVerifyEmail(json.email || email);
        toast({
          variant: 'destructive',
          title: 'Email not verified',
          description: 'Please verify your email before logging in.',
        });
        setIsLoading(false);
        return;
      }

      if (json.error) throw new Error(json.error);

      if (json.requiresRoleSelection) {
        setShowRoleSelection(true);
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined' && json.token) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('isLoggedIn', 'true');
        if (json.user?.role) localStorage.setItem('userRole', json.user.role);
        if (json.user?.id) localStorage.setItem('userId', json.user.id);
        window.dispatchEvent(new Event('auth-change'));
      }
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      router.push(json.user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail }),
      });
      const json = await res.json();
      toast({
        title: 'Email sent',
        description: json.message || json.error || 'Check your inbox.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to resend verification email.',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (needsVerification) {
    return (
      <Card className="mx-auto max-w-sm w-full shadow-2xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <KalaConnectIcon className="h-8 w-8 text-primary" />
              <span className="font-headline">कलाConnect</span>
            </Link>
          </div>
          <div className="flex justify-center mb-2">
            <Mail className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We sent a verification link to <strong>{verifyEmail}</strong>. Please check your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Resend Verification Email
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              setNeedsVerification(false);
              setVerifyEmail('');
            }}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
        <div className="grid gap-4">
          <a href="/api/auth/google">
            <Button variant="outline" className="w-full" type="button">
              <GoogleIcon />
              <span className="ml-2">Sign in with Google</span>
            </Button>
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

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
        </div>
        {showRoleSelection && json?.user && (
          <p className="text-xs text-muted-foreground mb-4">
            Current role: <strong className="font-medium">{json.user.role}</strong>
          </p>
        )}
        {showRoleSelection && (
          <div className="mt-4 p-4 rounded-lg border border-primary/20">
            <h3 className="font-headline text-primary mb-4">Select Your Role</h3>
            <p className="text-muted-foreground mb-4">
              Please select your account type to continue.
            </p>
            <div className="grid gap-3 mb-4">
              <label
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setSelectedRole('buyer')}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={selectedRole === 'buyer'}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Buyer</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setSelectedRole('artisan')}
              >
                <input
                  type="radio"
                  name="role"
                  value="artisan"
                  checked={selectedRole === 'artisan'}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Artisan</span>
              </label>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleSelection(false);
                  toast({
                    title: 'Cancelled',
                    description: 'Login cancelled.',
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Update user role in DB and login
                  fetch('/api/auth/select-role', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: json.user.id, role: selectedRole }),
                  }).then(async (res) => {
                    const result = await res.json();
                    if (result.success) {
                      localStorage.setItem('token', json.token);
                      localStorage.setItem('isLoggedIn', 'true');
                      localStorage.setItem('userRole', selectedRole);
                      localStorage.setItem('userId', json.user.id);
                      window.dispatchEvent(new Event('auth-change'));
                      toast({
                        title: 'Role selected!',
                        description: 'Your role has been updated.',
                      });
                      router.push(selectedRole === 'admin' ? '/admin' : '/dashboard');
                    } else {
                      toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: result.error || 'Failed to update role.',
                      });
                    }
                  });
                  setShowRoleSelection(false);
                }}
              >
                Continue as {selectedRole}
              </Button>
            </div>
          )}
        )}
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      <FadeIn direction="up" className="w-full">
        <Suspense fallback={<BrandLoading fullScreen />}>
          <LoginForm />
        </Suspense>
      </FadeIn>
    </div>
  );
}

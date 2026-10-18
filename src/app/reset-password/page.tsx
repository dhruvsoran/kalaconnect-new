'use client';

import { useMemo, useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KalaConnectIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, X } from 'lucide-react';
import { validatePassword } from '@/lib/password-validation';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/motion-wrapper';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordValidation = useMemo(() => validatePassword(password), [password]);

  useEffect(() => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Invalid reset link',
        description: 'This reset link is missing or broken. Please request a new one.',
      });
    }
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please make sure both fields are identical.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast({
        title: 'Password updated!',
        description: 'You can now log in with your new password.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: error.message || 'The link may have expired. Please request a new reset email.',
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
            <CardTitle className="text-2xl font-headline">Set a New Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {token ? (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                  />
                  {password.length > 0 && (
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {[
                        { label: '8+ characters', met: password.length >= 8 },
                        { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
                        { label: 'Lowercase letter', met: /[a-z]/.test(password) },
                        { label: 'Number', met: /[0-9]/.test(password) },
                        { label: 'Special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
                      ].map((req) => (
                        <div key={req.label} className="flex items-center gap-1 text-xs">
                          {req.met ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                  />
                  {confirmPassword.length > 0 && password.length > 0 && (
                    <p className={cn('text-xs', confirmPassword === password ? 'text-green-500' : 'text-red-500')}>
                      {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !passwordValidation.valid || password !== confirmPassword}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Password'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/forgot-password">Request New Link</Link>
                </Button>
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="underline">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen font-headline">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KalaConnectIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { FadeIn } from '@/components/motion-wrapper';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setSentTo(email);
      toast({
        title: 'Email sent',
        description: json.message || "If an account exists, we've sent a reset link.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not send reset email.',
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
        {sentTo ? (
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
              <CardTitle className="text-2xl font-headline text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                We&apos;ve sent a password reset link to <strong>{sentTo}</strong>. The link expires in 60 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Didn&apos;t receive the email? Check your spam folder.
              </p>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Resend Email
              </Button>
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="mx-auto max-w-sm w-full shadow-2xl">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
                  <KalaConnectIcon className="h-8 w-8 text-primary" />
                  <span className="font-headline">कलाConnect</span>
                </Link>
              </div>
              <CardTitle className="text-2xl font-headline">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your account email and we&apos;ll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Remembered it?{' '}
                <Link href="/login" className="underline">
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </FadeIn>
    </div>
  );
}

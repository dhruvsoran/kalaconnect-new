'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KalaConnectIcon } from '@/components/icons';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  if (success) {
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
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-headline text-center">Email Verified!</CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified. You can now log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/login?verified=true">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (error) {
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
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-headline text-center">Verification Failed</CardTitle>
          <CardDescription className="text-center">
            {decodeURIComponent(error)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login">
            <Button className="w-full" variant="outline">Back to Login</Button>
          </Link>
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
        <div className="flex justify-center mb-2">
          <Mail className="h-16 w-16 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline text-center">Check Your Email</CardTitle>
        <CardDescription className="text-center">
          Click the verification link in the email we sent you.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          If you didn&apos;t receive the email, check your spam folder or go back to login.
        </p>
        <Link href="/login">
          <Button className="w-full" variant="outline">Back to Login</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

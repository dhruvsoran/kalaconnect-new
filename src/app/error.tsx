'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
          <CardContent className="p-8 md:p-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex p-4 rounded-2xl bg-destructive/10 mb-6"
            >
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-7xl md:text-8xl font-bold font-headline text-destructive/20 mb-2">
                500
              </h1>
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">
                Something Went Wrong
              </h2>
              <p className="text-muted-foreground mb-2 leading-relaxed">
                Our servers hit a snag while processing your request.
                Don&apos;t worry — our team has been notified.
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground/50 mb-6 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button size="lg" onClick={reset}>
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              If this keeps happening,{' '}
              <a href="mailto:support@kalaconnect.in" className="text-primary hover:underline">
                contact our support team
              </a>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Home, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Unauthorized() {
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
              className="inline-flex p-4 rounded-2xl bg-amber-500/10 mb-6"
            >
              <Lock className="h-12 w-12 text-amber-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-7xl md:text-8xl font-bold font-headline text-amber-500/20 mb-2">
                403
              </h1>
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">
                Access Denied
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                You don&apos;t have permission to view this page.
                Please log in with the correct account or contact an administrator.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button asChild size="lg">
                <Link href="/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Log In
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

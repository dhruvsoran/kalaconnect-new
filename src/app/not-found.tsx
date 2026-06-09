import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold font-headline text-primary">404</CardTitle>
          <CardDescription className="text-xl mt-2">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/explore">Explore Art</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

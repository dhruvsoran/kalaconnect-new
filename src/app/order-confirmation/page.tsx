
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';


export default function OrderConfirmationPage() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center flex-grow">
            <Card className="w-full max-w-lg text-center">
                <CardHeader className="items-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                    <CardTitle className="text-3xl font-headline">Thank You for Your Order!</CardTitle>
                    <CardDescription className="pt-2">
                        Your payment was successful and your order is being processed.
                        You will receive a confirmation email shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 justify-center">
                        <Button asChild>
                            <Link href="/explore">Continue Shopping</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}


"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDescriptionForm } from "@/components/product-description-form";
import { getProducts, Product } from "@/lib/db";
import { useEffect, useState, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditProductPage({ params }: { params: { name: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Correctly unwrap the params promise using React.use()
    const { name: encodedName } = use(params);
    
    useEffect(() => {
        async function fetchProduct() {
            if (!encodedName) {
                setLoading(false);
                setError("Product name not found in URL.");
                return;
            };

            try {
                const products = await getProducts();
                const productName = decodeURIComponent(encodedName);
                const foundProduct = products.find(p => p.name === productName);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError("Product not found.");
                }
            } catch (err) {
                setError("Failed to load product data.");
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [encodedName]);


    return (
        <div className="grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/dashboard/products">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
                    Edit Product
                </h1>
            </div>
            {loading && (
                <Card>
                    <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                    <CardContent><Skeleton className="h-64 w-full" /></CardContent>
                </Card>
            )}
            {error && <Card><CardHeader><CardContent>{error}</CardContent></CardHeader></Card>}
            {product && <ProductDescriptionForm product={product} />}
        </div>
    );
}

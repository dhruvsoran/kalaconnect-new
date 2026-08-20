'use client';

import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDescriptionForm } from "@/components/product-description-form";
import { BrandLoading } from "@/components/brand-loading";
import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  artisanId: string;
  artisanName: string;
};

export default function EditProductPage({ params }: { params: Promise<{ name: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { name: encodedProductId } = use(params);

  useEffect(() => {
    async function fetchProduct() {
      if (!encodedProductId) {
        setLoading(false);
        setError("Product ID not found.");
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const productId = decodeURIComponent(encodedProductId);
        const res = await fetch(`/api/db/products/${productId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.data) {
          setProduct(json.data);
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
  }, [encodedProductId]);

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
      {loading && <BrandLoading />}
      {error && (
        <Card>
          <CardHeader>
            <CardContent className="text-center py-8 text-muted-foreground">{error}</CardContent>
          </CardHeader>
        </Card>
      )}
      {product && <ProductDescriptionForm product={product} />}
    </div>
  );
}

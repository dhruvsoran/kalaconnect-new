import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDescriptionForm } from "@/components/product-description-form";

export default function NewProductPage() {
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
                    AI Product Storyteller
                </h1>
            </div>
            <ProductDescriptionForm />
        </div>
    );
}



"use client";

import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProducts, Product } from "@/lib/db"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { deleteProductAction } from "@/lib/actions";


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const prods = await getProducts();
      setProducts(prods);
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productName: string) => {
    const result = await deleteProductAction(productName);
    if (result.success) {
      setProducts(products.filter(p => p.name !== productName));
      toast({
        title: "Product Deleted",
        description: `"${productName}" has been successfully deleted.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: result.error || "Could not delete the product. Please try again.",
      });
    }
  };
  
  const filteredProducts = (status: string) => {
    if (status === 'all') return products;
    return products.filter(p => p.status.toLowerCase() === status);
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Products</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" asChild>
                <Link href="/dashboard/products/new">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                    </span>
                </Link>
            </Button>
        </div>
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
        </div>
        {(['all', 'active', 'draft', 'archived']).map(status => (
          <TabsContent key={status} value={status}>
            <ProductTable
              products={filteredProducts(status)}
              onDelete={handleDeleteProduct}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ProductTable({ products, onDelete }: { products: Product[], onDelete: (name: string) => void }) {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Stock
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? products.map((product) => (
                <TableRow key={product.name}>
                    <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.image || "https://placehold.co/64x64/e5e5e5/a3a3a3/png?text=No+Image"}
                      width="64"
                      data-ai-hint={product.aiHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'Archived' ? 'secondary' : 'outline'}>{product.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{product.price}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(product.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/edit/${encodeURIComponent(product.name)}`}>Edit</Link>
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product "{product.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => onDelete(product.name)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No products found in this category.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
          </div>
        </CardFooter>
      </Card>
  )
}

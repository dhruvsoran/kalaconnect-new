'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/auth';
import { useRouter } from 'next/navigation';

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
  category?: string;
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const res = await fetch('/api/db/products', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      const all = json.data || [];
      const myProducts = user ? all.filter((p: Product) => p.artisanId === user.id) : [];
      setProducts(myProducts);
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    try {
      const res = await fetch(`/api/db/products/${productId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.ok) {
        setProducts(products.filter(p => p.id !== productId));
        toast({
          title: 'Product Deleted',
          description: `"${productName}" has been successfully deleted.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Deletion Failed',
          description: json.error || 'Could not delete the product.',
        });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: 'An error occurred.' });
    }
  };

  const filteredProducts = (status: string) => {
    if (status === 'all') return products;
    return products.filter(p => p.status.toLowerCase() === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">My Products</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/dashboard/products/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Painting</span>
            </Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="mt-4">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">Archived</TabsTrigger>
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
  );
}

function ProductTable({ products, onDelete }: { products: Product[]; onDelete: (id: string, name: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your paintings and view their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height={64}
                      src={product.image || 'https://placehold.co/64x64/e5e5e5/a3a3a3/png?text=No+Image'}
                      width={64}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'Active' ? 'default' : product.status === 'Archived' ? 'secondary' : 'outline'}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">₹{product.price}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/edit/${encodeURIComponent(product.id)}`}>Edit</Link>
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
                            This action cannot be undone. This will permanently delete &quot;{product.name}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => onDelete(product.id, product.name)}
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
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No products found. Add your first painting!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{products.length}</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}

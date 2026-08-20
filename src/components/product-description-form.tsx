"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2, Sparkles, Save, Mic, Waves, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateProductDescriptionAction, saveProductAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from "@/auth";

const formSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters."),
  artisanCulture: z.string().min(3, "Cultural context is required."),
  craftTechniques: z.string().min(3, "Please describe the techniques used."),
  productMaterials: z.string().min(3, "Please list the materials."),
  productDimensions: z.string().min(2, "Dimensions are required."),
  productRegion: z.string().min(2, "Region is required."),
  productImage: z.any().refine(file => file instanceof File || typeof file === 'string', "Product image is required."),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative."),
  status: z.enum(['Active', 'Draft', 'Archived']),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductDescriptionFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: string;
    image: string;
    artisanId: string;
    artisanName: string;
  } | null;
}

export function ProductDescriptionForm({ product }: ProductDescriptionFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState(product?.description || "");
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();

  const isEditMode = !!product;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: product?.name || "",
      artisanCulture: "",
      craftTechniques: "",
      productMaterials: "",
      productDimensions: "",
      productRegion: "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      productImage: product?.image || undefined,
      status: (product?.status as any) || 'Active',
    },
  });

  useEffect(() => {
    if (product) {
      setGeneratedDescription(product.description);
      setImagePreview(product.image);
    }
  }, [product]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("productImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onGenerate(data: FormValues) {
    setIsGenerating(true);
    setGeneratedDescription("");

    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "Image Error",
        description: "Please upload an image before generating a description.",
      });
      setIsGenerating(false);
      return;
    }

    try {
      const result = await generateProductDescriptionAction({
        productName: data.productName,
        artisanCulture: data.artisanCulture,
        craftTechniques: data.craftTechniques,
        productMaterials: data.productMaterials,
        productDimensions: data.productDimensions,
        productRegion: data.productRegion,
        productImageUri: imagePreview,
      });
      if (result.error) {
        throw new Error(result.error);
      }
      const description = result.productDescription ?? "";
      setGeneratedDescription(description);
      toast({
        title: "Success!",
        description: "Your new product description is ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate product description. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const handleSaveProduct = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill out all required fields before saving.",
      });
      return;
    }

    const data = form.getValues();

    const description = (generatedDescription || product?.description || '').trim();
    if (description.length < 10) {
      toast({
        variant: "destructive",
        title: "Description Required",
        description: "Please write a product description (at least 10 characters) or use AI to generate one.",
      });
      return;
    }

    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "Image Missing",
        description: "Please upload an image for the product.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const meRes = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const meJson = await meRes.json();
      const profile = meJson.user;

      const result = await saveProductAction({
        name: data.productName,
        description,
        price: data.price,
        stock: data.stock,
        status: data.status,
        image: imagePreview,
        artisanId: profile?.id || user?.id || '',
        artisanName: profile?.name || user?.name || 'Unknown Artisan',
        category: data.productMaterials,
        tags: [data.craftTechniques, data.productRegion],
        isEditing: isEditMode,
        productId: product?.id,
        authToken: token || undefined,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: `Product ${isEditMode ? 'Updated' : 'Saved'}!`,
        description: `"${data.productName}" has been successfully ${isEditMode ? 'updated' : 'added'}.`,
      });

      router.push('/dashboard/products');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onGenerate)} className="grid gap-4 md:grid-cols-2 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Tell us about your creation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField control={form.control} name="productName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Hand-Painted Madhubani Painting" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="artisanCulture" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cultural Heritage</FormLabel>
                  <FormControl><Input placeholder="e.g., Mithila region of Bihar" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="craftTechniques" render={({ field }) => (
                <FormItem>
                  <FormLabel>Craft Techniques</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Natural dyes, intricate line work..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="productMaterials" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materials</FormLabel>
                    <FormControl><Input placeholder="e.g., Canvas, Natural Dyes" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="productDimensions" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl><Input placeholder="e.g., 24x36 inches" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (INR)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 4500" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="stock" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Heads Up!</AlertTitle>
                <AlertDescription>
                  KalaConnect applies a 2.5% transaction fee on the final sale price. Please price your items accordingly.
                </AlertDescription>
              </Alert>
              <FormField control={form.control} name="productRegion" render={({ field }) => (
                <FormItem>
                  <FormLabel>Region of Origin</FormLabel>
                  <FormControl><Input placeholder="e.g., Bihar, India" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active (Published)</SelectItem>
                      <SelectItem value="Draft">Draft (Hidden)</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
              <CardDescription>A good picture is worth a thousand words.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="productImage" render={() => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <label htmlFor="product-image-upload" className="cursor-pointer">
                        <Image
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover border-2 border-dashed"
                          height="300"
                          src={imagePreview || "https://placehold.co/300x300/e5e5e5/a3a3a3/png?text=Upload+Image"}
                          width="300"
                        />
                      </label>
                      <div className="flex items-center gap-2">
                        <Input id="product-image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('product-image-upload')?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
              <CardDescription>Write your own product story, or use AI to generate one and edit it before saving.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe your artwork — materials, technique, cultural significance, and what makes it special..."
                value={generatedDescription}
                onChange={(e) => setGeneratedDescription(e.target.value)}
                rows={10}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
          <div className="flex items-center justify-end gap-2">
            <Button type="submit" size="lg" disabled={isGenerating || isSaving} className="w-full sm:w-auto">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Description
                </>
              )}
            </Button>
            <Button variant="default" type="button" size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700" onClick={handleSaveProduct} disabled={isSaving || isGenerating}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Product</>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

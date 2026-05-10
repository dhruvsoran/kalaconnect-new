
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
import type { Product } from "@/lib/db";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
    productName: z.string().min(3, "Product name must be at least 3 characters."),
    artisanCulture: z.string().min(3, "Cultural context is required."),
    craftTechniques: z.string().min(3, "Please describe the techniques used."),
    productMaterials: z.string().min(3, "Please list the materials."),
    productDimensions: z.string().min(2, "Dimensions are required."),
    productRegion: z.string().min(2, "Region is required."),
    productImage: z.any().refine(file => file instanceof File || typeof file === 'string', "Product image is required."),
    price: z.string().min(1, "Price is required."),
    stock: z.coerce.number().min(0, "Stock cannot be negative."),
    status: z.enum(['Active', 'Draft', 'Archived']),
});

type FormValues = z.infer<typeof formSchema>;

type VoiceInputState = {
    isListening: boolean;
    transcript: string;
    targetField: keyof FormValues | "price";
};

interface ProductDescriptionFormProps {
  product?: Product | null;
}

export function ProductDescriptionForm({ product }: ProductDescriptionFormProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedDescription, setGeneratedDescription] = useState(product?.description || "");
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
    const [currency, setCurrency] = useState("₹");
    const [amount, setAmount] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const [voiceState, setVoiceState] = useState<VoiceInputState>({
        isListening: false,
        transcript: "",
        targetField: null,
    });
    const recognitionRef = useRef<any>(null);

    const isEditMode = !!product;


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: product?.name || "",
            artisanCulture: "", // These fields are not in the product model
            craftTechniques: product?.aiHint.split(' ')[1] || "",
            productMaterials: product?.aiHint.split(' ')[0] || "",
            productDimensions: "",
            productRegion: "",
            price: product?.price || "",
            stock: product?.stock || 0,
            productImage: product?.image || undefined,
            status: product?.status || 'Draft',
        },
    });

     useEffect(() => {
        if (product) {
            setGeneratedDescription(product.description);
            setImagePreview(product.image);

            const priceMatch = product.price.match(/([₹$€])(\d+\.?\d*)/);
            if (priceMatch) {
                setCurrency(priceMatch[1]);
                setAmount(priceMatch[2]);
            } else {
                setAmount(product.price.replace(/[^0-9.]+/g, ""));
            }
        }
    }, [product]);

    
    const handlePriceChange = (newAmount: string) => {
        setAmount(newAmount);
        form.setValue("price", `${currency}${newAmount}`);
    };

    const handleCurrencyChange = (newCurrency: string) => {
        setCurrency(newCurrency);
        form.setValue("price", `${newCurrency}${amount}`);
    };


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
            const result = await generateProductDescriptionAction({ ...data, productImageUri: imagePreview });
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

        if(!isEditMode && !generatedDescription) {
             toast({
                variant: "destructive",
                title: "Cannot Save",
                description: "Please generate a description before saving.",
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
            const result = await saveProductAction({
                name: data.productName,
                description: generatedDescription || product?.description || '',
                price: data.price,
                stock: data.stock,
                status: data.status,
                image: imagePreview,
                aiHint: `${data.productMaterials} ${data.craftTechniques}`.toLowerCase(),
                isEditing: isEditMode,
                originalName: product?.name,
            });

            if (result.error) {
                throw new Error(result.error);
            }

            toast({
                title: `Product ${isEditMode ? 'Updated' : 'Saved'}!`,
                description: `"${data.productName}" has been successfully ${isEditMode ? 'updated' : 'added'}.`,
            });
            
            router.push('/dashboard/products');

        } catch(error) {
             toast({
                variant: "destructive",
                title: "Save Failed",
                description: "An unexpected error occurred while saving.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleVoiceInput = (fieldName: keyof FormValues | "price") => {
        if (!('webkitSpeechRecognition' in window)) {
            toast({ variant: "destructive", title: "Browser not supported", description: "Your browser does not support voice input." });
            return;
        }

        if (voiceState.isListening) {
            recognitionRef.current?.stop();
            setVoiceState({ isListening: false, transcript: "", targetField: null });
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // This can be changed for different languages

        recognition.onstart = () => {
            setVoiceState({ isListening: true, transcript: "", targetField: fieldName });
        };

        recognition.onend = () => {
            setVoiceState({ isListening: false, transcript: "", targetField: null });
        };
        
        recognition.onerror = (event: any) => {
            if (event.error === 'network') {
                toast({
                    variant: "destructive",
                    title: "Voice Recognition Error",
                    description: "Network issue. Please check your internet connection or browser permissions."
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Voice Recognition Error",
                    description: `An unexpected error occurred: ${event.error}`
                });
            }
            console.error("Speech recognition error", event.error);
            setVoiceState({ isListening: false, transcript: "", targetField: null });
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                if(fieldName === "price") {
                    handlePriceChange(finalTranscript);
                } else {
                    const currentVal = form.getValues(fieldName) as string;
                    const newVal = (currentVal ? currentVal + " " : "") + finalTranscript;
                    form.setValue(fieldName, newVal.trim() as any);
                }
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };


    const renderMicButton = (fieldName: keyof FormValues | "price") => {
        const isListeningToField = voiceState.isListening && voiceState.targetField === fieldName;
        return (
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={cn("absolute right-1 top-1 h-8 w-8", isListeningToField && "text-destructive")}
                onClick={() => handleVoiceInput(fieldName)}
            >
                {isListeningToField ? <Waves className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onGenerate)} className="grid gap-4 md:grid-cols-2 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                            <CardDescription>Tell us about your creation. The more details you provide, the better your AI-generated story will be.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <FormField control={form.control} name="productName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl><div className="relative"><Input placeholder="e.g., Hand-Painted Madhubani Saree" {...field} />{renderMicButton("productName")}</div></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="artisanCulture" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cultural Heritage</FormLabel>
                                    <FormControl><div className="relative"><Input placeholder="e.g., Mithila region of Bihar" {...field} />{renderMicButton("artisanCulture")}</div></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="craftTechniques" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Craft Techniques</FormLabel>
                                    <FormControl><div className="relative"><Textarea placeholder="e.g., Natural dyes, intricate line work..." {...field} />{renderMicButton("craftTechniques")}</div></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="productMaterials" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Materials</FormLabel>
                                        <FormControl><div className="relative"><Input placeholder="e.g., Tussar Silk" {...field} />{renderMicButton("productMaterials")}</div></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="productDimensions" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dimensions</FormLabel>
                                        <FormControl><div className="relative"><Input placeholder="e.g., 5.5m x 1.2m" {...field} />{renderMicButton("productDimensions")}</div></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="price" render={() => (
                                     <FormItem>
                                        <FormLabel>Your Price</FormLabel>
                                        <div className="flex gap-2">
                                            <Select value={currency} onValueChange={handleCurrencyChange}>
                                                <SelectTrigger className="w-[80px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="₹">INR</SelectItem>
                                                    <SelectItem value="$">USD</SelectItem>
                                                    <SelectItem value="€">EUR</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormControl>
                                                <div className="relative flex-1">
                                                    <Input type="number" placeholder="e.g., 2999" value={amount} onChange={(e) => handlePriceChange(e.target.value)} />
                                                    {renderMicButton("price")}
                                                </div>
                                            </FormControl>
                                        </div>
                                        <FormMessage>{form.formState.errors.price?.message}</FormMessage>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="stock" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Heads Up!</AlertTitle>
                                <AlertDescription>
                                    KalaConnect applies a 15% commission on the final sale price. Please price your items accordingly.
                                </AlertDescription>
                            </Alert>
                            <FormField control={form.control} name="productRegion" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Region of Origin</FormLabel>
                                    <FormControl><div className="relative"><Input placeholder="e.g., Bihar, India" {...field} />{renderMicButton("productRegion")}</div></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             {isEditMode && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                <SelectValue placeholder="Select product status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Draft">Draft</SelectItem>
                                                <SelectItem value="Archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                            <CardDescription>A good picture is worth a thousand words. And a great AI description.</CardDescription>
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
                                            data-ai-hint="placeholder"
                                        />
                                        </label>
                                        <div className="grid grid-cols-1 items-start gap-4">
                                            <div className="flex items-center gap-2">
                                                <Input id="product-image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('product-image-upload')?.click()}>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload Image
                                                </Button>
                                            </div>
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
                            <CardTitle>Generated Description</CardTitle>
                            <CardDescription>Your AI-crafted product story. You can edit it before saving.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Textarea
                                    placeholder="Your generated description will appear here..."
                                    value={generatedDescription}
                                    onChange={(e) => setGeneratedDescription(e.target.value)}
                                    rows={10}
                                    className="min-h-[200px]"
                                />
                            </div>
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


"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Copy, Send, Mail, Mic, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createMarketingContentAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    productName: z.string().min(1, "Please select a product."),
    productDescription: z.string().min(10, "Description must be at least 10 characters."),
    artisanName: z.string().min(2, "Artisan name is required."),
    cultureHeritage: z.string().min(10, "Cultural heritage is required."),
    targetAudience: z.string().min(5, "Target audience is required."),
});

type FormValues = z.infer<typeof formSchema>;

type VoiceInputState = {
    isListening: boolean;
    transcript: string;
    targetField: keyof FormValues | null;
};

const products = [
    { name: "Hand-painted Madhubani Saree", description: "A beautiful Tussar silk saree, hand-painted with traditional Madhubani motifs depicting tales of nature and mythology.", culture: "Mithila region of Bihar" },
    { name: "Terracotta Horse Statue", description: "A rustic terracotta horse, symbolizing power and grace, handcrafted by artisans from Panchmura village.", culture: "Bankura district of West Bengal" },
];

export function MarketingContentForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [socialMediaPost, setSocialMediaPost] = useState("");
    const [emailCampaign, setEmailCampaign] = useState("");
    const { toast } = useToast();
    
    const [voiceState, setVoiceState] = useState<VoiceInputState>({
        isListening: false,
        transcript: "",
        targetField: null,
    });
    const recognitionRef = useRef<any>(null);


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            productDescription: "",
            artisanName: "Ravi Kumar",
            cultureHeritage: "",
            targetAudience: "Art lovers, people interested in Indian culture",
        },
    });
    
    const handleProductChange = (productName: string) => {
        const product = products.find(p => p.name === productName);
        if (product) {
            form.setValue("productName", product.name);
            form.setValue("productDescription", product.description);
            form.setValue("cultureHeritage", product.culture);
        }
    };

    async function onSubmit(data: FormValues) {
        setIsLoading(true);
        setSocialMediaPost("");
        setEmailCampaign("");
        try {
            const result = await createMarketingContentAction(data);
            if (result.error) throw new Error(result.error);
            
            setSocialMediaPost(result.socialMediaPost || "");
            setEmailCampaign(result.emailCampaign || "");

            toast({
                title: "Content Generated!",
                description: "Your new marketing materials are ready.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Could not generate marketing content. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `Copied ${type} to clipboard!` });
    };

    const handleVoiceInput = (fieldName: keyof FormValues) => {
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
        recognition.lang = 'en-US';

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
                const currentVal = form.getValues(fieldName);
                const newVal = (currentVal ? currentVal + " " : "") + finalTranscript;
                form.setValue(fieldName, newVal.trim());
            }
        };
        
        recognition.start();
        recognitionRef.current = recognition;
    };
    
    const renderMicButton = (fieldName: keyof FormValues) => {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2 lg:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Content Details</CardTitle>
                        <CardDescription>Select a product and provide a few details to generate marketing content.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <FormField control={form.control} name="productName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product</FormLabel>
                                <Select onValueChange={handleProductChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a product to market" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {products.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="productDescription" render={({ field }) => (
                            <FormItem><FormLabel>Product Description</FormLabel><FormControl><div className="relative"><Textarea placeholder="Description of the product" {...field} rows={4} />{renderMicButton("productDescription")}</div></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="artisanName" render={({ field }) => (
                            <FormItem><FormLabel>Artisan Name</FormLabel><FormControl><div className="relative"><Input placeholder="Your name" {...field} />{renderMicButton("artisanName")}</div></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="cultureHeritage" render={({ field }) => (
                            <FormItem><FormLabel>Cultural Heritage</FormLabel><FormControl><div className="relative"><Input placeholder="e.g., Mithila, Bihar" {...field} />{renderMicButton("cultureHeritage")}</div></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="targetAudience" render={({ field }) => (
                            <FormItem><FormLabel>Target Audience</FormLabel><FormControl><div className="relative"><Input placeholder="e.g., Art lovers, tourists" {...field} />{renderMicButton("targetAudience")}</div></FormControl><FormMessage /></FormItem>
                        )} />
                         <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Content</>}
                        </Button>
                    </CardContent>
                </Card>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5"/> Social Media Post</CardTitle>
                                <CardDescription>A short post for platforms like Instagram or Facebook.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(socialMediaPost, "Social Post")} disabled={!socialMediaPost}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Generated social media post will appear here..." value={socialMediaPost} readOnly rows={8} className="bg-muted" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                             <div>
                                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5"/> Email Campaign</CardTitle>
                                <CardDescription>A longer-form email to send to your mailing list.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(emailCampaign, "Email Content")} disabled={!emailCampaign}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Generated email campaign will appear here..." value={emailCampaign} readOnly rows={12} className="bg-muted"/>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </Form>
    );
}

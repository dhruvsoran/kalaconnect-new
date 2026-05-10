
"use server";

import { generateProductDescription, GenerateProductDescriptionInput } from "@/ai/flows/generate-product-descriptions";
import { createMarketingContent, CreateMarketingContentInput } from "@/ai/flows/create-marketing-content";
import { getChatbotAssistance, GetChatbotAssistanceInput } from "@/ai/flows/get-chatbot-assistance";
import { addProduct, deleteProduct as deleteProductDb, Profile, Product, saveProfile as saveProfileDb, updateProduct } from "@/lib/db";
import { revalidatePath } from "next/cache";

type GenerateProductDescriptionActionInput = Omit<GenerateProductDescriptionInput, "productImageUri"> & {
    productImageUri: string;
};

export async function generateProductDescriptionAction(input: GenerateProductDescriptionActionInput) {
    try {
        const result = await generateProductDescription(input);
        return { productDescription: result.productDescription };
    } catch (error) {
        console.error("Error in generateProductDescriptionAction:", error);
        return { error: "Failed to generate description. Please check the server logs." };
    }
}

export async function createMarketingContentAction(input: CreateMarketingContentInput) {
    try {
        const result = await createMarketingContent(input);
        return { socialMediaPost: result.socialMediaPost, emailCampaign: result.emailCampaign };
    } catch (error) {
        console.error("Error in createMarketingContentAction:", error);
        return { error: "Failed to generate marketing content. Please check the server logs." };
    }
}


export async function getChatbotAssistanceAction(input: GetChatbotAssistanceInput) {
    try {
        const result = await getChatbotAssistance(input);
        return { response: result.response };
    } catch (error) {
        console.error("Error in getChatbotAssistanceAction:", error);
        return { error: "Sorry, I am having trouble connecting. Please try again later." };
    }
}

export async function saveProductAction(productData: {
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
    aiHint: string;
    status: Product['status'];
    isEditing: boolean;
    originalName?: string;
}) {
    try {
        const { isEditing, originalName, ...newProductData } = productData;
        
        let savedProduct;

        if (isEditing) {
            if (!originalName) {
                 return { error: "Original product name is required for editing." };
            }
            const productToUpdate: Omit<Product, 'date'> = { ...newProductData };
            savedProduct = await updateProduct(originalName, productToUpdate);
        } else {
            const productToAdd: Omit<Product, 'date'> = { ...newProductData };
            savedProduct = await addProduct(productToAdd);
        }
        
        revalidatePath('/dashboard/products');
        return { success: true, product: savedProduct };
    } catch (error) {
        console.error("Error in saveProductAction:", error);
        return { error: "Failed to save the product." };
    }
}

export async function deleteProductAction(productName: string) {
    try {
        const result = await deleteProductDb(productName);
        revalidatePath('/dashboard/products');
        return result;
    } catch (error) {
        console.error("Error in deleteProductAction:", error);
        return { error: "Failed to delete the product." };
    }
}


export async function saveProfileAction(profileData: Profile) {
    try {
        const updatedProfile = await saveProfileDb(profileData);
        revalidatePath('/dashboard/profile');
        return { success: true, profile: updatedProfile };
    } catch (error) {
        console.error("Error in saveProfileAction:", error);
        return { error: "Failed to save profile." };
    }
}


"use server";

import { generateProductDescription, GenerateProductDescriptionInput } from "@/ai/flows/generate-product-descriptions";
import { createMarketingContent, CreateMarketingContentInput } from "@/ai/flows/create-marketing-content";
import { getChatbotAssistance, GetChatbotAssistanceInput } from "@/ai/flows/get-chatbot-assistance";
import { 
  addProduct, 
  deleteProduct as deleteProductDb, 
  Product, 
  updateProduct, 
  getUserProfileByUserId,
  createOrUpdateUserProfile,
  UserProfile,
  getArtisanStats,
  getArtisanOrders,
  getAllOrders,
  getProducts,
  updateOrderStatus,
  getOrderById
} from "@/lib/db";
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
    price: number;
    stock: number;
    image: string;
    category?: string;
    tags?: string[];
    status: Product['status'];
    artisanId: string;
    artisanName: string;
    isEditing: boolean;
    productId?: string;
}) {
    try {
        const { isEditing, productId, artisanId, artisanName, ...newProductData } = productData;
        
        let savedProduct;

        if (isEditing && productId) {
            const productToUpdate: Partial<Product> = { ...newProductData };
            savedProduct = await updateProduct(productId, productToUpdate);
        } else {
            const productToAdd: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = { 
              ...newProductData, 
              artisanId, 
              artisanName 
            };
            savedProduct = await addProduct(productToAdd);
        }
        
        revalidatePath('/dashboard/products');
        revalidatePath('/explore');
        revalidatePath('/');
        return { success: true, product: savedProduct };
    } catch (error) {
        console.error("Error in saveProductAction:", error);
        return { error: "Failed to save the product." };
    }
}

export async function deleteProductAction(productId: string) {
    try {
        const result = await deleteProductDb(productId);
        revalidatePath('/dashboard/products');
        revalidatePath('/explore');
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: result };
    } catch (error) {
        console.error("Error in deleteProductAction:", error);
        return { error: "Failed to delete the product." };
    }
}

export async function saveUserProfileAction(profileData: Omit<UserProfile, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
        const updatedProfile = await createOrUpdateUserProfile(profileData);
        revalidatePath('/dashboard/profile');
        return { success: true, profile: updatedProfile };
    } catch (error) {
        console.error("Error in saveUserProfileAction:", error);
        return { error: "Failed to save profile." };
    }
}

export async function getArtisanDashboardStats(artisanId: string) {
    try {
        const stats = await getArtisanStats(artisanId);
        return { success: true, stats };
    } catch (error) {
        console.error("Error in getArtisanDashboardStats:", error);
        return { error: "Failed to fetch artisan stats." };
    }
}

export async function getArtisanOrdersAction(artisanId: string) {
    try {
        const orders = await getArtisanOrders(artisanId);
        return { success: true, orders };
    } catch (error) {
        console.error("Error in getArtisanOrdersAction:", error);
        return { error: "Failed to fetch artisan orders." };
    }
}

export async function getAllOrdersAction() {
    try {
        const orders = await getAllOrders();
        return { success: true, orders };
    } catch (error) {
        console.error("Error in getAllOrdersAction:", error);
        return { error: "Failed to fetch all orders." };
    }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled',
  updatedBy: string,
  updatedByRole: 'buyer' | 'artisan' | 'admin' | 'system',
  note?: string
) {
    try {
        const order = await updateOrderStatus(orderId, status, updatedBy, updatedByRole, note);
        revalidatePath('/dashboard/orders');
        revalidatePath('/admin');
        revalidatePath(`/dashboard/orders/${orderId}`);
        return { success: true, order };
    } catch (error) {
        console.error("Error in updateOrderStatusAction:", error);
        return { error: "Failed to update order status." };
    }
}

export async function getOrderDetailsAction(orderId: string) {
    try {
        const order = await getOrderById(orderId);
        return { success: true, order };
    } catch (error) {
        console.error("Error in getOrderDetailsAction:", error);
        return { error: "Failed to fetch order details." };
    }
}

export async function getProductsForExplore() {
    try {
        const products = await getProducts({ status: 'Active' });
        return { success: true, products };
    } catch (error) {
        console.error("Error in getProductsForExplore:", error);
        return { error: "Failed to fetch products." };
    }
}

"use server";

import { cookies } from 'next/headers';
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
import { verifyToken } from "@/lib/jwt";
import { notifyUrlUpdate, notifyUrlRemoval } from "@/lib/indexnow";

type GenerateProductDescriptionActionInput = {
  productImageUri: string;
  productName: string;
  artisanCulture: string;
  craftTechniques: string;
  productMaterials: string;
  productDimensions: string;
  productRegion: string;
};

async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    return payload?.sub || null;
  } catch {
    return null;
  }
}

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
        const userId = await getCurrentUserId();
        if (!userId) {
            return { error: "Authentication required." };
        }

        const { isEditing, productId, artisanId, artisanName, ...newProductData } = productData;

        if (isEditing && productId) {
            const existingProduct = await getProductByIdForAction(productId);
            if (!existingProduct || existingProduct.artisanId !== userId) {
                return { error: "You can only edit your own products." };
            }
            const productToUpdate: Partial<Product> = { ...newProductData };
            await updateProduct(productId, productToUpdate);
            await notifyUrlUpdate([`https://www.kalaconnect.me/product/${productId}`]);
        } else {
            if (artisanId !== userId) {
                return { error: "You can only create products for your own account." };
            }
            const productToAdd: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = { 
              ...newProductData, 
              artisanId, 
              artisanName 
            };
            const savedProduct = await addProduct(productToAdd);
            await notifyUrlUpdate([`https://www.kalaconnect.me/product/${savedProduct._id}`]);
        }
        
        revalidatePath('/dashboard/products');
        revalidatePath('/explore');
        revalidatePath('/');
        
        return { success: true, product: null };
    } catch (error) {
        console.error("Error in saveProductAction:", error);
        return { error: "Failed to save the product." };
    }
}

async function getProductByIdForAction(id: string) {
    try {
        const { getDb } = await import('@/lib/mongodb');
        const { ObjectId } = await import('mongodb');
        const db = await getDb();
        return await db.collection('products').findOne({ _id: new ObjectId(id) });
    } catch {
        return null;
    }
}

export async function deleteProductAction(productId: string) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return { error: "Authentication required." };
        }

        const product = await getProductByIdForAction(productId);
        if (!product) {
            return { error: "Product not found." };
        }
        if (product.artisanId !== userId) {
            return { error: "You can only delete your own products." };
        }

        const result = await deleteProductDb(productId);
        await notifyUrlRemoval([`https://www.kalaconnect.me/product/${productId}`]);
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

export async function updateOrderStatusAction(
  orderId: string,
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled',
  updatedBy: string,
  updatedByRole: 'buyer' | 'artisan' | 'admin' | 'system',
  note?: string
) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return { error: "Authentication required." };
        }

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



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

async function getCurrentUser(authToken?: string): Promise<{ userId: string; role: string; name: string; email: string } | null> {
  try {
    let token = authToken;
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value || cookieStore.get('auth_token')?.value;
    }
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload?.sub || !payload?.email) return null;
    const { getDb } = await import('@/lib/mongodb');
    const db = await getDb();
    const user = await db.collection('users').findOne({ email: payload.email });
    if (!user) return null;
    return {
      userId: user._id.toString(),
      role: user.role || 'buyer',
      name: user.name || 'User',
      email: user.email,
    };
  } catch {
    return null;
  }
}

// Simple per-user throttle for AI endpoints (10 calls / 5 minutes)
const aiThrottle = new Map<string, { count: number; resetAt: number }>();
function checkAiThrottle(userKey: string, max = 10): boolean {
  const now = Date.now();
  const entry = aiThrottle.get(userKey);
  if (!entry || now > entry.resetAt) {
    aiThrottle.set(userKey, { count: 1, resetAt: now + 5 * 60 * 1000 });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export async function generateProductDescriptionAction(input: GenerateProductDescriptionActionInput) {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'artisan' && user.role !== 'admin')) {
        return { error: "Authentication required." };
    }
    if (!checkAiThrottle(user.userId)) {
        return { error: "AI limit reached. Please try again in a few minutes." };
    }
    try {
        const result = await generateProductDescription(input);
        return { productDescription: result.productDescription };
    } catch (error) {
        console.error("Error in generateProductDescriptionAction:", error);
        return { error: "Failed to generate description. Please check the server logs." };
    }
}

export async function createMarketingContentAction(input: CreateMarketingContentInput) {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'artisan' && user.role !== 'admin')) {
        return { error: "Authentication required." };
    }
    if (!checkAiThrottle(user.userId)) {
        return { error: "AI limit reached. Please try again in a few minutes." };
    }
    try {
        const result = await createMarketingContent(input);
        return { socialMediaPost: result.socialMediaPost, emailCampaign: result.emailCampaign };
    } catch (error) {
        console.error("Error in createMarketingContentAction:", error);
        return { error: "Failed to generate marketing content. Please check the server logs." };
    }
}

export async function getChatbotAssistanceAction(input: GetChatbotAssistanceInput) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: "Authentication required." };
    }
    if (!checkAiThrottle(user.userId)) {
        return { error: "AI limit reached. Please try again in a few minutes." };
    }
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
    authToken?: string;
}) {
    try {
        const { isEditing, productId, artisanId, artisanName, authToken, ...newProductData } = productData;
        const user = await getCurrentUser(authToken);
        if (!user) {
            return { error: "Authentication required." };
        }
        if (user.role !== 'artisan' && user.role !== 'admin') {
            return { error: "Only artisans can sell products." };
        }

        if (isEditing && productId) {
            const existingProduct = await getProductByIdForAction(productId);
            if (!existingProduct || (user.role !== 'admin' && existingProduct.artisanId !== user.userId)) {
                return { error: "You can only edit your own products." };
            }
            const productToUpdate: Partial<Product> = { ...newProductData };
            await updateProduct(productId, productToUpdate);
            await notifyUrlUpdate([`https://www.kalaconnect.me/product/${productId}`]);
        } else {
            if (user.role !== 'admin' && artisanId !== user.userId) {
                return { error: "You can only create products for your own account." };
            }
            const productToAdd: Omit<Product, '_id' | 'createdAt' | 'updatedAt'> = {
              ...newProductData,
              artisanId: user.role === 'admin' ? artisanId : user.userId,
              artisanName: artisanName || user.name,
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

export async function deleteProductAction(productId: string, authToken?: string) {
    try {
        const user = await getCurrentUser(authToken);
        if (!user) {
            return { error: "Authentication required." };
        }
        if (user.role !== 'artisan' && user.role !== 'admin') {
            return { error: "Only artisans can delete products." };
        }

        const product = await getProductByIdForAction(productId);
        if (!product) {
            return { error: "Product not found." };
        }
        if (user.role !== 'admin' && product.artisanId !== user.userId) {
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
  note?: string,
  authToken?: string
) {
    try {
        const user = await getCurrentUser(authToken);
        if (!user) {
            return { error: "Authentication required." };
        }
        if (user.role !== 'artisan' && user.role !== 'admin') {
            return { error: "Forbidden." };
        }

        // Ownership: artisans may only progress orders that contain their own items
        if (user.role === 'artisan') {
            const order = await getOrderById(orderId);
            if (!order) {
                return { error: "Order not found." };
            }
            const items = (order as any).items || [];
            const hasOwnItem = items.some((item: any) => item.artisanId === user.userId);
            if (!hasOwnItem) {
                return { error: "You can only update orders containing your own products." };
            }
        }

        // Identity in the audit trail is derived server-side — client-provided
        // updatedBy/updatedByRole are ignored by design
        const order = await updateOrderStatus(orderId, status, user.name || user.email, user.role as any, note);
        revalidatePath('/dashboard/orders');
        revalidatePath('/admin');
        revalidatePath(`/dashboard/orders/${orderId}`);
        return { success: true, order };
    } catch (error) {
        console.error("Error in updateOrderStatusAction:", error);
        return { error: "Failed to update order status." };
    }
}



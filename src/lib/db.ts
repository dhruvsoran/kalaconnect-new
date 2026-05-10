
'use server';

import fs from 'fs/promises';
import path from 'path';

// Define the path to the JSON file for marketplace data
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

export interface Product {
    name: string;
    description: string;
    status: 'Active' | 'Draft' | 'Archived';
    price: string;
    stock: number;
    date: string;
    image: string;
    aiHint: string;
}

export interface Profile {
    name: string;
    location: string;
    story: string;
    heritage: string;
    avatar?: string;
    email?: string;
    role?: 'buyer' | 'artisan';
}

interface DbData {
  products: Product[];
  profile: Profile; // This is kept for legacy/initial fallback, but we use Firestore now
}

const initialData: DbData = {
    products: [
        {
            name: "Hand-painted Madhubani Saree",
            description: "A beautiful Tussar silk saree, hand-painted with traditional Madhubani motifs depicting tales of nature and mythology.",
            status: "Active",
            price: "₹8,999",
            stock: 25,
            date: "2023-07-12T10:42:00Z",
            image: "https://picsum.photos/seed/saree/800/800",
            aiHint: "painted saree"
        },
        {
            name: "Terracotta Horse Statue",
            description: "A rustic terracotta horse, symbolizing power and grace, handcrafted by artisans from Panchmura village.",
            status: "Active",
            price: "₹3,499",
            stock: 8,
            date: "2023-10-18T15:21:00Z",
            image: "https://picsum.photos/seed/horse/800/800",
            aiHint: "terracotta statue"
        },
        {
            name: "Warli Art Coasters (Set of 4)",
            description: "Set of four wooden coasters, hand-painted with intricate Warli art, perfect for adding a touch of ethnic charm to your home.",
            status: "Active",
            price: "₹999",
            stock: 100,
            date: "2024-01-05T09:12:00Z",
            image: "https://picsum.photos/seed/coasters/800/800",
            aiHint: "art coasters"
        }
    ],
    profile: {
        name: "Ravi Kumar",
        location: "Jaipur, Rajasthan",
        story: "I am a third-generation block-printer from Jaipur...",
        heritage: "Sanganeri block-printing is a traditional art form from Rajasthan.",
        avatar: "https://picsum.photos/seed/artisan-profile/200/200"
    }
};

async function readDb(): Promise<DbData> {
    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
    }
}

async function writeDb(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getProducts(): Promise<Product[]> {
    const db = await readDb();
    return [...db.products].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addProduct(product: Omit<Product, 'date'>): Promise<Product> {
    const db = await readDb();
    const newProduct: Product = { ...product, date: new Date().toISOString() };
    db.products.unshift(newProduct);
    await writeDb(db);
    return newProduct;
}

export async function updateProduct(originalName: string, productUpdate: Omit<Product, 'date'>): Promise<Product> {
    const db = await readDb();
    const index = db.products.findIndex(p => p.name === originalName);
    if (index === -1) throw new Error("Product not found");
    const updated = { ...db.products[index], ...productUpdate };
    db.products[index] = updated;
    await writeDb(db);
    return updated;
}

export async function deleteProduct(productName: string): Promise<{ success: boolean }> {
    const db = await readDb();
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.name !== productName);
    if (db.products.length < initialLength) {
        await writeDb(db);
        return { success: true };
    }
    return { success: false };
}

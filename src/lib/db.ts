'use server';

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft' | 'Archived';
  price: number;
  stock: number;
  artisanId: string;
  artisanName: string;
  image: string;
  images?: string[];
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  location?: string;
  story?: string;
  heritage?: string;
  avatar?: string;
  role: 'buyer' | 'artisan' | 'admin';
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id?: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentMethod: string;
  subtotal: number;
  transactionFee: number;
  total: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  statusHistory: StatusUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  artisanId: string;
  artisanName: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  pincode: string;
  phone?: string;
}

export interface StatusUpdate {
  status: string;
  timestamp: Date;
  updatedBy: string;
  updatedByRole: 'buyer' | 'artisan' | 'admin' | 'system';
  note?: string;
}

const PRODUCTS_COLLECTION = 'products';
const USERS_COLLECTION = 'users';
const ORDERS_COLLECTION = 'orders';
const CONTACT_MESSAGES_COLLECTION = 'contactMessages';
const SYSTEM_LOGS_COLLECTION = 'systemLogs';

async function getProductsCollection() {
  const db = await getDb();
  return db.collection('products');
}

async function getUsersCollection() {
  const db = await getDb();
  return db.collection('users');
}

async function getOrdersCollection() {
  const db = await getDb();
  return db.collection('orders');
}

export async function getProducts(filters?: { status?: string; artisanId?: string; search?: string }): Promise<Product[]> {
  const col = await getProductsCollection();
  const query: any = {};
  
  if (filters?.status) {
    query.status = filters.status;
  }
  if (filters?.artisanId) {
    query.artisanId = filters.artisanId;
  }
  if (filters?.search) {
    const escapedSearch = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: escapedSearch, $options: 'i' } },
      { description: { $regex: escapedSearch, $options: 'i' } },
      { tags: { $in: [new RegExp(escapedSearch, 'i')] } },
    ];
  }
  
  const products = await col.find(query).sort({ createdAt: -1 }).toArray();
  return products.map(p => ({ ...p, _id: p._id!.toString() } as Product));
}

export async function addProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const col = await getProductsCollection();
  const now = new Date();
  const newProduct = { ...product, createdAt: now, updatedAt: now };
  const result = await col.insertOne(newProduct);
  return { ...newProduct, _id: result.insertedId.toString() } as Product;
}

export async function updateProduct(id: string, update: Partial<Omit<Product, '_id' | 'createdAt' | 'artisanId'>>): Promise<Product | null> {
  const col = await getProductsCollection();
  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...update, updatedAt: new Date() } as any },
    { returnDocument: 'after' }
  );
  return result ? { ...result, _id: result._id.toString() } as Product : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const col = await getProductsCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getUserProfileByUserId(userId: string): Promise<UserProfile | null> {
  const col = await getUsersCollection();
  const profile = await col.findOne({ userId });
  return profile ? { ...profile, _id: profile._id!.toString() } as UserProfile : null;
}

export async function createOrUpdateUserProfile(profile: Omit<UserProfile, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
  const col = await getUsersCollection();
  const now = new Date();
  const result = await col.findOneAndUpdate(
    { userId: profile.userId },
    { $set: { ...profile, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true, returnDocument: 'after' }
  );
  return { ...result!, _id: result!._id.toString() } as UserProfile;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const col = await getOrdersCollection();
  const order = await col.findOne({ _id: new ObjectId(id) });
  return order ? { ...order, _id: order._id.toString() } as Order : null;
}

export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'], 
  updatedBy: string, 
  updatedByRole: 'buyer' | 'artisan' | 'admin' | 'system',
  note?: string
): Promise<Order | null> {
  const col = await getOrdersCollection();
  const now = new Date();
  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(orderId) },
    { 
      $set: { status, updatedAt: now },
      $push: { statusHistory: { status, timestamp: now, updatedBy, updatedByRole, note } } as any
    },
    { returnDocument: 'after' }
  );
  return result ? { ...result, _id: result._id.toString() } as Order : null;
}

export async function getArtisanOrders(artisanId: string): Promise<Order[]> {
  const col = await getOrdersCollection();
  const orders = await col.find({ 'items.artisanId': artisanId }).sort({ createdAt: -1 }).toArray();
  return orders.map(o => ({ ...o, _id: o._id!.toString() } as Order));
}

export async function getArtisanStats(artisanId: string): Promise<{ productCount: number; orderCount: number; revenue: number }> {
  const productsCol = await getProductsCollection();
  const ordersCol = await getOrdersCollection();
  
  const productCount = await productsCol.countDocuments({ artisanId });
  const orders = await ordersCol.find({ 'items.artisanId': artisanId }).toArray();
  const orderCount = orders.length;
  const revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  
  return { productCount, orderCount, revenue };
}

export async function getAllOrders(): Promise<Order[]> {
  const col = await getOrdersCollection();
  const orders = await col.find({}).sort({ createdAt: -1 }).toArray();
  return orders.map(o => ({ ...o, _id: o._id!.toString() } as Order));
}

export async function getPlatformStats(): Promise<{ productCount: number; artisanCount: number; buyerCount: number; orderCount: number }> {
  const db = await getDb();
  const productsCol = db.collection('products');
  const usersCol = db.collection('users');
  const ordersCol = db.collection('orders');

  const [productCount, artisanCount, buyerCount, orderCount] = await Promise.all([
    productsCol.countDocuments({ status: 'Active' }),
    usersCol.countDocuments({ role: 'artisan' }),
    usersCol.countDocuments({ role: 'buyer' }),
    ordersCol.countDocuments(),
  ]);

  return { productCount, artisanCount, buyerCount, orderCount };
}


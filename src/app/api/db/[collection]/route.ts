import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { sanitizeInput } from '@/lib/validation';

const ALLOWED_COLLECTIONS = ['users', 'orders', 'products', 'carts', 'likes', 'comments', 'contactMessages', 'systemLogs'];

const ALLOWED_PRODUCT_FIELDS = ['name', 'description', 'price', 'stock', 'image', 'images', 'category', 'tags', 'status'];
const ALLOWED_COMMENT_FIELDS = ['productId', 'text'];
const ALLOWED_CONTACT_FIELDS = ['name', 'email', 'phone', 'subject', 'message'];

function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return sanitizeInput(value);
}

function sanitizeQueryParams(url: URL): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (typeof value === 'string' && !value.startsWith('$')) {
      safe[key] = sanitizeString(value);
    }
  }
  return safe;
}

async function logToDB(level: string, category: string, message: string, details?: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({
      level, category, message, details: details || '', ...extra, createdAt: new Date(),
    });
  } catch { }
}

async function getRequester(req: Request) {
  const auth = req.headers.get('authorization') || '';
  let token = auth?.replace('Bearer ', '') || null;
  if (!token) {
    const cookie = req.headers.get('cookie') || '';
    token = cookie.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1] || null;
  }
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.email) return null;
  const db = await getDb();
  return await db.collection('users').findOne({ email: payload.email }) || null;
}

function sanitizeObject(obj: Record<string, any>, allowedFields: string[]): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const key of allowedFields) {
    if (obj[key] !== undefined) {
      sanitized[key] = typeof obj[key] === 'string' ? sanitizeInput(obj[key]) : obj[key];
    }
  }
  return sanitized;
}

function mapItems(items: any[]) {
  return items.map((it: any) => ({ id: it._id?.toString?.(), ...it, _id: undefined }));
}

// --- GET handlers ---

async function handleGetUsers(col: any, requester: any) {
  if (!requester || requester.role !== 'admin') return NextResponse.json({ data: [] });
  const items = await col.find({}).toArray();
  const data = items.map((it: any) => ({
    id: it._id?.toString?.(),
    email: it.email, name: it.name || null, role: it.role || 'buyer', avatar: it.avatar || null,
  }));
  return NextResponse.json({ data });
}

async function handleGetOrders(col: any, requester: any) {
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let query: any = {};
  if (requester.role === 'admin') query = {};
  else if (requester.role === 'artisan') query = { 'items.artisanId': requester._id?.toString?.() };
  else query = { buyerId: requester._id?.toString?.() };
  const items = await col.find(query).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ data: mapItems(items) });
}

async function handleGetCarts(col: any, requester: any) {
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const cart = await col.findOne({ userId: requester._id?.toString?.() });
  return NextResponse.json({ data: cart ? { id: cart._id?.toString?.(), ...cart, _id: undefined } : { items: [] } });
}

async function handleGetProducts(col: any, requester: any, url: URL) {
  const params = sanitizeQueryParams(url);
  const limitParam = params.limit;
  const limit = Math.min(Math.max(parseInt(limitParam || '0') || 0, 0), 200);
  const selectFields = params.select;

  let query: any = { status: 'Active' };
  if (requester?.role === 'admin') query = {};
  else if (requester?.role === 'artisan') query = { $or: [{ artisanId: requester._id?.toString?.() }, { status: 'Active' }] };

  let cursor = col.find(query).sort({ createdAt: -1 });
  if (limit > 0) cursor = cursor.limit(limit);
  if (selectFields) {
    const fields = selectFields.split(',').map(f => f.trim()).filter(f => /^[a-zA-Z0-9_]+$/.test(f));
    if (fields.length > 0) {
      const projection: Record<string, 1> = {};
      fields.forEach(f => { projection[f] = 1; });
      cursor = cursor.project(projection);
    }
  }
  const items = await cursor.toArray();
  return NextResponse.json({ data: mapItems(items) });
}

async function handleGetComments(col: any, url: URL) {
  const params = sanitizeQueryParams(url);
  const productId = params.productId;
  const query: any = productId ? { productId } : {};
  const items = await col.find(query).sort({ createdAt: -1 }).toArray();
  const data = items.map((it: any) => ({
    id: it._id?.toString?.(),
    productId: it.productId, userId: it.userId,
    userName: it.userName || 'User', text: it.text, createdAt: it.createdAt,
  }));
  return NextResponse.json({ data });
}

async function handleGetLikes(col: any, requester: any, url: URL) {
  const params = sanitizeQueryParams(url);
  const productId = params.productId;
  if (!productId) return NextResponse.json({ data: [] });

  const count = await col.countDocuments({ productId });
  let isLiked = false;
  if (requester) {
    const existing = await col.findOne({ productId, userId: requester._id?.toString?.() });
    isLiked = !!existing;
  }
  return NextResponse.json({ data: { count, isLiked } });
}

async function handleGetLogs(col: any, requester: any, url: URL) {
  if (!requester || requester.role !== 'admin') return NextResponse.json({ data: [] });
  const params = sanitizeQueryParams(url);
  const limit = Math.min(Math.max(parseInt(params.limit || '100') || 100, 1), 500);
  const query: any = {};
  if (params.level) query.level = params.level;
  if (params.category) query.category = params.category;
  const items = await col.find(query).sort({ createdAt: -1 }).limit(limit).toArray();
  return NextResponse.json({ data: mapItems(items) });
}

// --- POST handlers ---

async function handlePostOrders(col: any, requester: any, body: any) {
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const now = new Date();
  const res = await col.insertOne({
    ...body, buyerId: requester._id?.toString?.(),
    buyerName: body.buyerName || requester.name || 'Unknown',
    buyerEmail: body.buyerEmail || requester.email || '',
    status: 'Processing',
    statusHistory: [{ status: 'Processing', timestamp: now, updatedBy: 'system', updatedByRole: 'system', note: 'Order placed' }],
    createdAt: now, updatedAt: now,
  });
  const orderId = res.insertedId?.toString?.() || null;
  logToDB('success', 'order', `New order placed: ${body.orderId || orderId}`,
    `Buyer: ${requester.name || requester.email}, Total: ₹${body.total || 0}`,
    { userId: requester._id?.toString?.(), userEmail: requester.email, userRole: requester.role });
  return NextResponse.json({ id: orderId });
}

async function handlePostProducts(col: any, requester: any, body: any) {
  if (!requester || (requester.role !== 'artisan' && requester.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const sanitized = sanitizeObject(body, ALLOWED_PRODUCT_FIELDS);
  const res = await col.insertOne({
    ...sanitized, artisanId: requester._id?.toString?.(),
    status: body.status || 'Draft', createdAt: new Date(),
  });
  const productId = res.insertedId?.toString?.() || null;
  logToDB('success', 'product', `New product created: ${sanitized.name}`,
    `Artisan: ${requester.name || requester.email}, Price: ₹${body.price || 0}`,
    { userId: requester._id?.toString?.(), userEmail: requester.email, userRole: requester.role });
  return NextResponse.json({ id: productId });
}

async function handlePostLikes(col: any, requester: any, body: any) {
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const productId = sanitizeString(body.productId);
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });
  const userId = requester._id?.toString?.();
  const action = body.action || 'add';
  if (action === 'remove') {
    await col.deleteOne({ productId, userId });
    return NextResponse.json({ ok: true });
  }
  const existing = await col.findOne({ productId, userId });
  if (existing) return NextResponse.json({ id: existing._id?.toString?.() || null });
  const res = await col.insertOne({ productId, userId, createdAt: new Date() });
  return NextResponse.json({ id: res.insertedId?.toString?.() || null });
}

async function handlePostComments(col: any, requester: any, body: any) {
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sanitized = sanitizeObject(body, ALLOWED_COMMENT_FIELDS);
  const res = await col.insertOne({
    productId: sanitized.productId, userId: requester._id?.toString?.(),
    userName: requester.name || 'User', text: sanitized.text || '', createdAt: new Date(),
  });
  return NextResponse.json({ id: res.insertedId?.toString?.() || null });
}

async function handlePostCarts(col: any, requester: any, body: any) {
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const action = body.action || null;
  const userId = requester._id?.toString?.();

  if (action === 'add' && body.product) {
    const allowed = ['id', 'name', 'price', 'image', 'artisanName', 'description', 'category', 'tags', 'stock', 'status'];
    const safeProduct = sanitizeObject(body.product, allowed);
    safeProduct.name = sanitizeString(body.product.name || '');
    safeProduct.price = typeof body.product.price === 'number' ? body.product.price : 0;
    safeProduct.image = sanitizeString(body.product.image || '');
    await col.findOneAndUpdate(
      { userId },
      { $addToSet: { items: safeProduct }, $setOnInsert: { userId, createdAt: new Date() } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true });
  }

  if (action === 'remove' && body.productName) {
    await col.updateOne({ userId }, { $pull: { items: { name: sanitizeString(body.productName) } } as any });
    return NextResponse.json({ ok: true });
  }

  if (action === 'clear') {
    await col.updateOne({ userId }, { $set: { items: [] } }, { upsert: true });
    return NextResponse.json({ ok: true });
  }

  if (Array.isArray(body.items)) {
    const sanitizedItems = body.items.map((item: any) => ({
      productId: sanitizeString(item.productId),
      productName: sanitizeString(item.productName),
      price: typeof item.price === 'number' ? item.price : 0,
      quantity: typeof item.quantity === 'number' ? Math.max(1, Math.min(99, item.quantity)) : 1,
      image: sanitizeString(item.image),
    }));
    await col.updateOne({ userId }, { $set: { items: sanitizedItems } }, { upsert: true });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid cart action' }, { status: 400 });
}

function handlePostContact(col: any, body: any) {
  if (!body.name || !body.email || !body.subject || !body.message) {
    return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
  }
  const sanitized = sanitizeObject(body, ALLOWED_CONTACT_FIELDS);
  return col.insertOne({
    name: sanitized.name, email: sanitized.email, phone: sanitized.phone || '',
    subject: sanitized.subject, message: sanitized.message, read: false, createdAt: new Date(),
  }).then((res: any) => NextResponse.json({ id: res.insertedId?.toString?.() || null }));
}

async function handlePostLogs(col: any, requester: any, body: any) {
  if (!requester || requester.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const res = await col.insertOne({
    level: body.level || 'info', category: body.category || 'system',
    message: sanitizeString(body.message), details: sanitizeString(body.details),
    userId: requester._id?.toString?.() || '', userEmail: requester.email || '',
    userRole: requester.role || '', ip: sanitizeString(body.ip), path: sanitizeString(body.path),
    method: sanitizeString(body.method), statusCode: body.statusCode || 0,
    duration: body.duration || 0, createdAt: new Date(),
  });
  return NextResponse.json({ id: res.insertedId?.toString?.() || null });
}

// --- Route handlers ---

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
  }
  const db = await getDb();
  const col = db.collection(collection);
  const requester = await getRequester(req);
  const url = new URL(req.url);

  switch (collection) {
    case 'users': return handleGetUsers(col, requester);
    case 'orders': return handleGetOrders(col, requester);
    case 'carts': return handleGetCarts(col, requester);
    case 'products': return handleGetProducts(col, requester, url);
    case 'comments': return handleGetComments(col, url);
    case 'likes': return handleGetLikes(col, requester, url);
    case 'systemLogs': return handleGetLogs(col, requester, url);
    default: return NextResponse.json({ data: mapItems(await col.find({}).toArray()) });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
  }
  const body = await req.json();
  const db = await getDb();
  const col = db.collection(collection);
  const requester = await getRequester(req);

  switch (collection) {
    case 'orders': return handlePostOrders(col, requester, body);
    case 'products': return handlePostProducts(col, requester, body);
    case 'likes': return handlePostLikes(col, requester, body);
    case 'comments': return handlePostComments(col, requester, body);
    case 'carts': return handlePostCarts(col, requester, body);
    case 'contactMessages': return handlePostContact(col, body);
    case 'systemLogs': return handlePostLogs(col, requester, body);
    default: return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
  }
}

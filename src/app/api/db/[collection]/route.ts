import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { sanitizeInput } from '@/lib/validation';

async function logToDB(level: string, category: string, message: string, details?: string, extra?: Record<string, any>) {
  try {
    const db = await getDb();
    await db.collection('systemLogs').insertOne({
      level,
      category,
      message,
      details: details || '',
      ...extra,
      createdAt: new Date(),
    });
  } catch (e) {
    // Silently fail
  }
}

async function getRequester(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth?.replace('Bearer ', '') || null;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload?.email) return null;
  const db = await getDb();
  const users = db.collection('users');
  const user = await users.findOne({ email: payload.email });
  return user || null;
}

const ALLOWED_PRODUCT_FIELDS = ['name', 'description', 'price', 'stock', 'image', 'images', 'category', 'tags', 'status'];
const ALLOWED_COMMENT_FIELDS = ['productId', 'text'];
const ALLOWED_CONTACT_FIELDS = ['name', 'email', 'phone', 'subject', 'message'];

function sanitizeObject(obj: Record<string, any>, allowedFields: string[]): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const key of allowedFields) {
    if (obj[key] !== undefined) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeInput(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }
  return sanitized;
}

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const db = await getDb();
  const col = db.collection(collection);

  const requester = await getRequester(req);

  if (collection === 'users') {
    if (!requester || requester.role !== 'admin') {
      return NextResponse.json({ data: [] });
    }
    const items = await col.find({}).toArray();
    const data = items.map((it: any) => ({
      id: it._id?.toString?.(),
      email: it.email,
      name: it.name || null,
      role: it.role || 'buyer',
      avatar: it.avatar || null,
    }));
    return NextResponse.json({ data });
  }

  if (collection === 'orders') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let query: any = {};
    if (requester.role === 'admin') {
      query = {};
    } else if (requester.role === 'artisan') {
      query = { 'items.artisanId': requester._id?.toString?.() };
    } else {
      query = { buyerId: requester._id?.toString?.() };
    }

    const items = await col.find(query).sort({ createdAt: -1 }).toArray();
    const data = items.map((it: any) => {
      const { _id, ...rest } = it;
      return { id: _id?.toString?.(), ...rest };
    });
    return NextResponse.json({ data });
  }

  if (collection === 'carts') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const cart = await col.findOne({ userId: requester._id?.toString?.() });
    return NextResponse.json({ data: cart ? { id: cart._id?.toString?.(), ...cart, _id: undefined } : { items: [] } });
  }

  if (collection === 'contactMessages') {
    if (!requester || requester.role !== 'admin') {
      return NextResponse.json({ data: [] });
    }
    const items = await col.find({}).sort({ createdAt: -1 }).toArray();
    const data = items.map((it: any) => ({ id: it._id?.toString?.(), ...it, _id: undefined }));
    return NextResponse.json({ data });
  }

  if (collection === 'systemLogs') {
    if (!requester || requester.role !== 'admin') {
      return NextResponse.json({ data: [] });
    }
    const url = new URL(req.url);
    const level = url.searchParams.get('level') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const limitParam = url.searchParams.get('limit');
    const limit = Math.min(Math.max(parseInt(limitParam || '100') || 100, 1), 500);
    const query: any = {};
    if (level) query.level = level;
    if (category) query.category = category;
    const items = await col.find(query).sort({ createdAt: -1 }).limit(limit).toArray();
    const data = items.map((it: any) => ({ id: it._id?.toString?.(), ...it, _id: undefined }));
    return NextResponse.json({ data });
  }

  if (collection === 'products') {
    const url = new URL(req.url);
    const selectFields = url.searchParams.get('select');
    const limitParam = url.searchParams.get('limit');
    const limit = Math.min(Math.max(parseInt(limitParam || '0') || 0, 0), 200);

    let query: any = {};
    if (!requester || requester.role === 'buyer') {
      query = { status: 'Active' };
    } else if (requester.role === 'artisan') {
      query = { $or: [{ artisanId: requester._id?.toString?.() }, { status: 'Active' }] };
    }

    let cursor = col.find(query).sort({ createdAt: -1 });
    if (limit > 0) cursor = cursor.limit(limit) as any;
    if (selectFields) {
      const fields = selectFields.split(',').map(f => f.trim()).filter(f => /^[a-zA-Z0-9_]+$/.test(f));
      if (fields.length > 0) {
        const projection: Record<string, 1> = {};
        fields.forEach(f => { projection[f] = 1; });
        cursor = cursor.project(projection) as any;
      }
    }
    const items = await cursor.toArray();
    const data = items.map((it: any) => ({ id: it._id?.toString?.(), ...it, _id: undefined }));
    return NextResponse.json({ data });
  }

  if (collection === 'comments') {
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');
    const query: any = productId ? { productId } : {};
    const items = await col.find(query).sort({ createdAt: -1 }).toArray();
    const data = items.map((it: any) => ({
      id: it._id?.toString?.(),
      productId: it.productId,
      userId: it.userId,
      userName: it.userName || 'User',
      text: it.text,
      createdAt: it.createdAt,
    }));
    return NextResponse.json({ data });
  }

  if (collection === 'likes') {
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');

    if (productId && requester) {
      const existing = await col.findOne({ productId, userId: requester._id?.toString?.() });
      const count = await col.countDocuments({ productId });
      return NextResponse.json({ data: { count, isLiked: !!existing } });
    }

    if (productId) {
      const count = await col.countDocuments({ productId });
      return NextResponse.json({ data: { count, isLiked: false } });
    }

    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
}

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const body = await req.json();
  const db = await getDb();
  const col = db.collection(collection);

  const requester = await getRequester(req);

  // Orders
  if (collection === 'orders') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const now = new Date();
    const res = await col.insertOne({
      ...body,
      buyerId: requester._id?.toString?.(),
      buyerName: body.buyerName || requester.name || 'Unknown',
      buyerEmail: body.buyerEmail || requester.email || '',
      status: 'Processing',
      statusHistory: [{ status: 'Processing', timestamp: now, updatedBy: 'system', updatedByRole: 'system', note: 'Order placed' }],
      createdAt: now,
      updatedAt: now,
    });
    const orderId = res.insertedId?.toString?.() || null;

    logToDB('success', 'order', `New order placed: ${body.orderId || orderId}`, 
      `Buyer: ${requester.name || requester.email}, Total: ₹${body.total || 0}`,
      { userId: requester._id?.toString?.(), userEmail: requester.email, userRole: requester.role }
    );

    return NextResponse.json({ id: orderId });
  }

  // Products
  if (collection === 'products') {
    if (!requester || (requester.role !== 'artisan' && requester.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const sanitized = sanitizeObject(body, ALLOWED_PRODUCT_FIELDS);
    const res = await col.insertOne({ ...sanitized, artisanId: requester._id?.toString?.(), status: body.status || 'Draft', createdAt: new Date() });
    const productId = res.insertedId?.toString?.() || null;

    logToDB('success', 'product', `New product created: ${sanitized.name}`,
      `Artisan: ${requester.name || requester.email}, Price: ₹${body.price || 0}`,
      { userId: requester._id?.toString?.(), userEmail: requester.email, userRole: requester.role }
    );

    return NextResponse.json({ id: productId });
  }

  // Likes
  if (collection === 'likes') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const action = body.action || 'add';

    if (action === 'remove') {
      await col.deleteOne({ productId: body.productId, userId: requester._id?.toString?.() });
      return NextResponse.json({ ok: true });
    }

    const existing = await col.findOne({ productId: body.productId, userId: requester._id?.toString?.() });
    if (existing) {
      return NextResponse.json({ id: existing._id?.toString?.() || null });
    }
    const res = await col.insertOne({ productId: body.productId, userId: requester._id?.toString?.(), createdAt: new Date() });
    return NextResponse.json({ id: res.insertedId?.toString?.() || null });
  }

  // Comments
  if (collection === 'comments') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sanitized = sanitizeObject(body, ALLOWED_COMMENT_FIELDS);
    const userName = requester.name || 'User';
    const res = await col.insertOne({
      productId: sanitized.productId,
      userId: requester._id?.toString?.(),
      userName,
      text: sanitized.text || '',
      createdAt: new Date()
    });
    return NextResponse.json({ id: res.insertedId?.toString?.() || null });
  }

  // Carts
  if (collection === 'carts') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const action = body.action || null;
    if (action === 'add' && body.product) {
      await col.findOneAndUpdate(
        { userId: requester._id?.toString?.() },
        { $addToSet: { items: body.product }, $setOnInsert: { userId: requester._id?.toString?.(), createdAt: new Date() } },
        { upsert: true }
      );
      return NextResponse.json({ ok: true });
    }
    if (action === 'remove' && body.productName) {
      await col.updateOne(
        { userId: requester._id?.toString?.() },
        { $pull: { items: { name: body.productName } } as any }
      );
      return NextResponse.json({ ok: true });
    }
    if (action === 'clear') {
      await col.updateOne({ userId: requester._id?.toString?.() }, { $set: { items: [] } }, { upsert: true });
      return NextResponse.json({ ok: true });
    }
    if (Array.isArray(body.items)) {
      const sanitizedItems = body.items.map((item: any) => ({
        productId: item.productId,
        productName: sanitizeInput(item.productName || ''),
        price: typeof item.price === 'number' ? item.price : 0,
        quantity: typeof item.quantity === 'number' ? Math.max(1, Math.min(99, item.quantity)) : 1,
        image: item.image || '',
      }));
      await col.updateOne({ userId: requester._id?.toString?.() }, { $set: { items: sanitizedItems } }, { upsert: true });
      return NextResponse.json({ ok: true });
    }
  }

  // Contact Messages
  if (collection === 'contactMessages') {
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
    }
    const sanitized = sanitizeObject(body, ALLOWED_CONTACT_FIELDS);
    const res = await col.insertOne({
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone || '',
      subject: sanitized.subject,
      message: sanitized.message,
      read: false,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: res.insertedId?.toString?.() || null });
  }

  // System Logs: restrict to admin only for client-originated writes
  if (collection === 'systemLogs') {
    if (!requester || requester.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const res = await col.insertOne({
      level: body.level || 'info',
      category: body.category || 'system',
      message: body.message ? sanitizeInput(body.message) : '',
      details: body.details ? sanitizeInput(body.details) : '',
      userId: requester._id?.toString?.() || '',
      userEmail: requester.email || '',
      userRole: requester.role || '',
      ip: body.ip || '',
      path: body.path || '',
      method: body.method || '',
      statusCode: body.statusCode || 0,
      duration: body.duration || 0,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: res.insertedId?.toString?.() || null });
  }

  return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
}

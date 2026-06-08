import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

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

export async function GET(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const db = await getDb();
  const col = db.collection(collection);

  const requester = await getRequester(req);

  // User collection: sanitize unless admin
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

  // Orders: buyer sees only their orders; artisan sees orders containing their products; admin sees all
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

  // Carts: only return the requester's cart
  if (collection === 'carts') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const cart = await col.findOne({ userId: requester._id?.toString?.() });
    return NextResponse.json({ data: cart ? { id: cart._id?.toString?.(), ...cart, _id: undefined } : { items: [] } });
  }

  // Contact Messages: only admin can view
  if (collection === 'contactMessages') {
    if (!requester || requester.role !== 'admin') {
      return NextResponse.json({ data: [] });
    }
    const items = await col.find({}).sort({ createdAt: -1 }).toArray();
    const data = items.map((it: any) => ({ id: it._id?.toString?.(), ...it, _id: undefined }));
    return NextResponse.json({ data });
  }

  // System Logs: only admin can view
  if (collection === 'systemLogs') {
    if (!requester || requester.role !== 'admin') {
      return NextResponse.json({ data: [] });
    }
    const url = new URL(req.url);
    const level = url.searchParams.get('level') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const query: any = {};
    if (level) query.level = level;
    if (category) query.category = category;
    const items = await col.find(query).sort({ createdAt: -1 }).limit(limit).toArray();
    const data = items.map((it: any) => ({ id: it._id?.toString?.(), ...it, _id: undefined }));
    return NextResponse.json({ data });
  }

  // Products: return all active products for public, all for admin/artisan
  if (collection === 'products') {
    let query: any = {};
    if (!requester || requester.role === 'buyer') {
      query = { status: 'Active' };
    } else if (requester.role === 'artisan') {
      query = { $or: [{ artisanId: requester._id?.toString?.() }, { status: 'Active' }] };
    }
    // admin sees all

    const items = await col.find(query).sort({ createdAt: -1 }).toArray();
    const data = items.map((it: any) => ({ id: it._id?.toString?.(), ...it, _id: undefined }));
    return NextResponse.json({ data });
  }

  // Default: no access to unknown collections
  return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
}

export async function POST(req: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const body = await req.json();
  const db = await getDb();
  const col = db.collection(collection);

  const requester = await getRequester(req);

  // Only authenticated users can create orders
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

    // Log the order
    logToDB('success', 'order', `New order placed: ${body.orderId || orderId}`, 
      `Buyer: ${requester.name || requester.email}, Total: ₹${body.total || 0}`,
      { userId: requester._id?.toString?.(), userEmail: requester.email, userRole: requester.role }
    );

    return NextResponse.json({ id: orderId });
  }

  // Only artisans or admin can create products
  if (collection === 'products') {
    if (!requester || (requester.role !== 'artisan' && requester.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const res = await col.insertOne({ ...body, artisanId: requester._id?.toString?.(), createdAt: new Date() });
    const productId = res.insertedId?.toString?.() || null;

    logToDB('success', 'product', `New product created: ${body.name}`,
      `Artisan: ${requester.name || requester.email}, Price: ₹${body.price || 0}`,
      { userId: requester._id?.toString?.(), userEmail: requester.email, userRole: requester.role }
    );

    return NextResponse.json({ id: productId });
  }

  // Likes
  if (collection === 'likes') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const userName = requester.name || 'User';
    const res = await col.insertOne({
      productId: body.productId,
      userId: requester._id?.toString?.(),
      userName,
      text: body.text || '',
      createdAt: new Date()
    });
    return NextResponse.json({ id: res.insertedId?.toString?.() || null });
  }

  // Carts: per-user cart
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
        { $pull: { items: { name: body.productName } as any } }
      );
      return NextResponse.json({ ok: true });
    }
    if (action === 'clear') {
      await col.updateOne({ userId: requester._id?.toString?.() }, { $set: { items: [] } }, { upsert: true });
      return NextResponse.json({ ok: true });
    }
    if (Array.isArray(body.items)) {
      await col.updateOne({ userId: requester._id?.toString?.() }, { $set: { items: body.items } }, { upsert: true });
      return NextResponse.json({ ok: true });
    }
  }

  // Contact Messages: anyone can send, must have name, email, subject, message
  if (collection === 'contactMessages') {
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'Name, email, subject, and message are required' }, { status: 400 });
    }
    const res = await col.insertOne({
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject,
      message: body.message,
      read: false,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: res.insertedId?.toString?.() || null });
  }

  // System Logs: only authenticated users can write (for client logging), admin can manage
  if (collection === 'systemLogs') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const res = await col.insertOne({
      level: body.level || 'info',
      category: body.category || 'system',
      message: body.message || '',
      details: body.details || '',
      userId: body.userId || '',
      userEmail: body.userEmail || '',
      userRole: body.userRole || '',
      ip: body.ip || '',
      path: body.path || '',
      method: body.method || '',
      statusCode: body.statusCode || 0,
      duration: body.duration || 0,
      createdAt: new Date(),
    });
    return NextResponse.json({ id: res.insertedId?.toString?.() || null });
  }

  // Default: no writes to unknown collections
  return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
}

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/jwt';
import { sanitizeInput } from '@/lib/validation';

function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
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
  const users = db.collection('users');
  const user = await users.findOne({ email: payload.email });
  return user || null;
}

const ALLOWED_COLLECTIONS = ['users', 'orders', 'products', 'carts', 'likes', 'comments', 'contactMessages', 'systemLogs'];

const ALLOWED_PRODUCT_FIELDS = ['name', 'description', 'price', 'stock', 'image', 'images', 'category', 'tags', 'status'];
const ALLOWED_ORDER_STATUS_FIELDS = ['status'];

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

export async function GET(req: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
  }
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ data: null }, { status: 404 });

  const requester = await getRequester(req);
  const item = await col.findOne({ _id: oid });
  if (!item) return NextResponse.json({ data: null }, { status: 404 });

  if (collection === 'users') {
    const ownerId = item._id?.toString?.();
    if (!requester) {
      return NextResponse.json({ data: { id: ownerId, name: item.name || null, avatar: item.avatar || null } });
    }
    if (requester.role === 'admin' || requester._id?.toString?.() === ownerId) {
      return NextResponse.json({ data: { id: ownerId, email: item.email, role: item.role || 'buyer', name: item.name || null, avatar: item.avatar || null } });
    }
    return NextResponse.json({ data: { id: ownerId, name: item.name || null, avatar: item.avatar || null } });
  }

  if (collection === 'orders') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (requester.role !== 'admin') {
      if (requester.role === 'artisan') {
        const hasOwnProduct = item.items?.some((i: any) => i.artisanId === requester._id?.toString?.());
        if (!hasOwnProduct) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      } else {
        if (item.buyerId !== requester._id?.toString?.()) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
    }
  }

  if (collection === 'products') {
    if (item.status !== 'Active' && (!requester || (requester.role !== 'admin' && requester._id?.toString?.() !== item.artisanId))) {
      return NextResponse.json({ data: null }, { status: 404 });
    }
  }

  return NextResponse.json({ data: { id: item._id?.toString?.(), ...item, _id: undefined } });
}

export async function PUT(req: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
  }
  const body = await req.json();
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const requester = await getRequester(req);
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (collection === 'users') {
    if (requester.role !== 'admin' && requester._id?.toString?.() !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (requester.role !== 'admin') {
      delete body.role;
    }
  }

  if (collection === 'products') {
    const item = await col.findOne({ _id: oid });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (requester.role !== 'admin' && item.artisanId !== requester._id?.toString?.()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const sanitized = sanitizeObject(body, ALLOWED_PRODUCT_FIELDS);
    await col.updateOne({ _id: oid }, { $set: sanitized });
    return NextResponse.json({ ok: true });
  }

  if (collection === 'orders') {
    if (requester.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  await col.updateOne({ _id: oid }, { $set: body });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
  }
  const body = await req.json();
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const requester = await getRequester(req);
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (collection === 'orders') {
    const item = await col.findOne({ _id: oid });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (requester.role !== 'admin' && requester.role !== 'artisan') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (requester.role === 'artisan') {
      const hasOwnProduct = item.items?.some((i: any) => i.artisanId === requester._id?.toString?.());
      if (!hasOwnProduct) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const sanitized = sanitizeObject(body, ALLOWED_ORDER_STATUS_FIELDS);
    const status = sanitized.status || item.status;

    await col.updateOne(
      { _id: oid },
      {
        $set: { status, updatedAt: now },
        $push: { statusHistory: { status, timestamp: now, updatedBy: requester._id?.toString?.() || '', updatedByRole: requester.role, note: body.note ? sanitizeInput(body.note).slice(0, 200) : '' } } as any
      }
    );

    try {
      const logDb = await getDb();
      await logDb.collection('systemLogs').insertOne({
        level: status === 'Cancelled' ? 'warn' : 'info',
        category: 'order',
        message: `Order status updated to ${status}`,
        details: `Order ID: ${item.orderId || id}, Updated by: ${requester.name || requester.email} (${requester.role})`,
        userId: requester._id?.toString?.(),
        userEmail: requester.email,
        userRole: requester.role,
        createdAt: new Date(),
      });
    } catch (e) { /* silent */ }

    return NextResponse.json({ ok: true });
  }

  if (collection === 'products') {
    const item = await col.findOne({ _id: oid });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (requester.role !== 'admin' && item.artisanId !== requester._id?.toString?.()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const sanitized = sanitizeObject(body, ALLOWED_PRODUCT_FIELDS);
    await col.updateOne({ _id: oid }, { $set: sanitized });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Collection not accessible' }, { status: 403 });
  }
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const requester = await getRequester(req);
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (requester.role !== 'admin') {
    if (collection === 'products') {
      const prod = await col.findOne({ _id: oid });
      if (!prod || prod.artisanId !== requester._id?.toString?.()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else if (collection === 'likes' || collection === 'comments') {
      const item = await col.findOne({ _id: oid });
      if (!item || item.userId !== requester._id?.toString?.()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const deletedItem = await col.findOne({ _id: oid });
  await col.deleteOne({ _id: oid });

  if (collection === 'products' || collection === 'orders') {
    try {
      const logDb = await getDb();
      await logDb.collection('systemLogs').insertOne({
        level: 'warn',
        category: collection === 'products' ? 'product' : 'order',
        message: `${collection.slice(0, -1)} deleted: ${deletedItem?.name || deletedItem?.orderId || id}`,
        details: `Deleted by: ${requester.name || requester.email} (${requester.role})`,
        userId: requester._id?.toString?.(),
        userEmail: requester.email,
        userRole: requester.role,
        createdAt: new Date(),
      });
    } catch (e) { /* silent */ }
  }

  return NextResponse.json({ ok: true });
}

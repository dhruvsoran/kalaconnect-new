import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/jwt';

function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
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

export async function GET(req: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ data: null }, { status: 404 });

  const requester = await getRequester(req);
  const item = await col.findOne({ _id: oid });
  if (!item) return NextResponse.json({ data: null }, { status: 404 });

  // Users: restrict visibility
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

  // Orders: buyer can only see their own, artisan can see orders with their products, admin sees all
  if (collection === 'orders') {
    if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (requester.role === 'admin') {
      // ok
    } else if (requester.role === 'artisan') {
      const hasOwnProduct = item.items?.some((i: any) => i.artisanId === requester._id?.toString?.());
      if (!hasOwnProduct) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } else {
      if (item.buyerId !== requester._id?.toString?.()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  }

  // Products: check ownership for non-admin
  if (collection === 'products') {
    if (item.status !== 'Active' && (!requester || (requester.role !== 'admin' && requester._id?.toString?.() !== item.artisanId))) {
      return NextResponse.json({ data: null }, { status: 404 });
    }
  }

  return NextResponse.json({ data: { id: item._id?.toString?.(), ...item, _id: undefined } });
}

export async function PUT(req: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  const body = await req.json();
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const requester = await getRequester(req);
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Users: only owner or admin; non-admins cannot change role
  if (collection === 'users') {
    if (requester.role !== 'admin' && requester._id?.toString?.() !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Prevent role escalation
    if (requester.role !== 'admin') {
      delete body.role;
    }
  }

  // Products: only owner artisan or admin
  if (collection === 'products') {
    const item = await col.findOne({ _id: oid });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (requester.role !== 'admin' && item.artisanId !== requester._id?.toString?.()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Orders: only admin can update directly (artisans use the updateOrderStatus action)
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
  const body = await req.json();
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const requester = await getRequester(req);
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Orders: artisan (owner of product in order) or admin can update status
  if (collection === 'orders') {
    const item = await col.findOne({ _id: oid });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (requester.role === 'admin') {
      // admin can update anything
    } else if (requester.role === 'artisan') {
      const hasOwnProduct = item.items?.some((i: any) => i.artisanId === requester._id?.toString?.());
      if (!hasOwnProduct) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const status = body.status;
    const updatedBy = body.updatedBy || requester._id?.toString?.() || '';
    const updatedByRole = body.updatedByRole || requester.role || 'system';
    const note = body.note || '';

    await col.updateOne(
      { _id: oid },
      {
        $set: { status, updatedAt: now },
        $push: { statusHistory: { status, timestamp: now, updatedBy, updatedByRole, note } } as any
      }
    );

    // Log status update
    try {
      const db = await getDb();
      await db.collection('systemLogs').insertOne({
        level: status === 'Cancelled' ? 'warn' : 'info',
        category: 'order',
        message: `Order status updated to ${status}`,
        details: `Order ID: ${item.orderId || id}, Updated by: ${requester.name || requester.email} (${updatedByRole})${note ? ', Note: ' + note : ''}`,
        userId: requester._id?.toString?.(),
        userEmail: requester.email,
        userRole: requester.role,
        createdAt: new Date(),
      });
    } catch (e) { /* silent */ }

    return NextResponse.json({ ok: true });
  }

  // Default: partial update
  await col.updateOne({ _id: oid }, { $set: body });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  const db = await getDb();
  const col = db.collection(collection);
  const oid = toObjectId(id);
  if (!oid) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const requester = await getRequester(req);
  if (!requester) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only admin can delete arbitrary records; owners can delete their own products
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

  // Log deletion
  if (collection === 'products' || collection === 'orders') {
    try {
      const db = await getDb();
      await db.collection('systemLogs').insertOne({
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

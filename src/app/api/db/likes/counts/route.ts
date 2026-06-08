import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId');
  const db = await getDb();
  const col = db.collection('likes');

  if (productId) {
    const count = await col.countDocuments({ productId });
    return NextResponse.json({ productId, count });
  }

  // aggregate top counts per product
  const pipeline = [
    { $group: { _id: '$productId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 100 },
    { $project: { productId: '$_id', count: 1, _id: 0 } },
  ];

  const results = await col.aggregate(pipeline).toArray();
  return NextResponse.json({ data: results });
}

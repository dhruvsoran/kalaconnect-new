import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
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

    return NextResponse.json({ productCount, artisanCount, buyerCount, orderCount });
  } catch (e) {
    return NextResponse.json({ productCount: 0, artisanCount: 0, buyerCount: 0, orderCount: 0 });
  }
}

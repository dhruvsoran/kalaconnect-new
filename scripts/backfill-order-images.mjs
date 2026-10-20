#!/usr/bin/env node
// Backfills missing product images on existing order items (and cart rows)
// from the products collection, matching by productId/productName.
//
// Usage:
//   node scripts/backfill-order-images.mjs
// Requires MONGODB_URI (and optional MONGODB_DB_NAME) in .env.local / .env

import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set (add it to .env.local)');
  process.exit(1);
}
const dbName = process.env.MONGODB_DB_NAME || 'kalaconnect';

const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const products = db.collection('products');
  const orders = db.collection('orders');
  const carts = db.collection('carts');

  const productCache = new Map();
  const lookupProduct = async (id, name) => {
    const key = id || name;
    if (!key || productCache.has(key)) return productCache.get(key);
    let doc = null;
    try {
      if (id) {
        const { ObjectId } = await import('mongodb');
        if (ObjectId.isValid(id)) doc = await products.findOne({ _id: new ObjectId(id) });
      }
      if (!doc && id) doc = await products.findOne({ _id: String(id) });
      if (!doc && name) doc = await products.findOne({ name });
    } catch { /* ignore lookup errors */ }
    productCache.set(key, doc || false);
    return doc || null;
  };

  // Orders
  const orderCursor = orders.find({});
  let fixedOrders = 0;
  for await (const order of orderCursor) {
    if (!Array.isArray(order.items) || order.items.length === 0) continue;
    let changed = false;
    for (const item of order.items) {
      const product = await lookupProduct(item.productId, item.productName);
      if (product && product.image && item.image !== product.image) {
        item.image = product.image;
        changed = true;
      } else if (!item.image) {
        item.image = ''; // normalize missing vs empty
      }
    }
    if (changed) {
      await orders.updateOne({ _id: order._id }, { $set: { items: order.items } });
      fixedOrders++;
    }
  }

  // Carts
  const cartCursor = carts.find({});
  let fixedCarts = 0;
  for await (const cart of cartCursor) {
    if (!Array.isArray(cart.items) || cart.items.length === 0) continue;
    let changed = false;
    for (const item of cart.items) {
      const product = await lookupProduct(item.id, item.name);
      if (product && product.image && item.image !== product.image) {
        item.image = product.image;
        changed = true;
      }
    }
    if (changed) {
      await carts.updateOne({ _id: cart._id }, { $set: { items: cart.items } });
      fixedCarts++;
    }
  }

  console.log(`Backfilled images on ${fixedOrders} order(s) and ${fixedCarts} cart(s) in \`${dbName}\`.`);
}

main().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
}).finally(() => client.close());

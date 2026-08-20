import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || undefined;

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}

let cachedClient: MongoClient | null = null;
let indexesEnsured = false;

export async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

async function ensureIndexes(db: import('mongodb').Db) {
  if (indexesEnsured) return;
  try {
    await db.collection('users').createIndex(
      { email: 1 },
      { unique: true, collation: { locale: 'en', strength: 2 }, background: true }
    );
    indexesEnsured = true;
  } catch (e) {
    // If duplicates already exist, log and continue (app-level checks still apply)
    console.error('Failed to create unique index on users.email:', (e as Error).message);
  }
}

export async function getDb(dbNameOverride?: string) {
  const client = await getMongoClient();
  const db = client.db(dbNameOverride || dbName);
  await ensureIndexes(db);
  return db;
}

export default getMongoClient;

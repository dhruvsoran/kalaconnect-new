import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || undefined;

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set');
}

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDb(dbNameOverride?: string) {
  const client = await getMongoClient();
  return client.db(dbNameOverride || dbName);
}

export default getMongoClient;

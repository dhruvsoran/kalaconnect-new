/**
 * Read-only DB check. Run with your real URI (never commit it):
 *   MONGODB_URI="mongodb+srv://..." MONGODB_DB_NAME="your-db" node scripts/check-users.mjs your-email@example.com
 * Result is printed to console only — nothing is written to the DB.
 */
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Set MONGODB_URI env var first.');
  process.exit(1);
}

const emailArg = process.argv.find(
  (a, i) => i > 1 && a.includes('@') && !a.startsWith('--')
);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

function maskEmail(e) {
  return e ? e.replace(/(.{2})(.*)(@.*)/, '$1***$3') : e;
}

try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || undefined);

  console.log('\n=== DATABASES ===');
  const dbs = await client.db().admin().listDatabases();
  for (const d of dbs.databases) console.log(' -', d.name, `(${(d.sizeOnDisk / 1024 / 1024).toFixed(1)} MB)`);

  const dbNames = dbs.databases.map((d) => d.name);
  for (const name of dbNames) {
    const d = client.db(name);
    const cols = await d.listCollections().toArray();
    const usersCol = cols.find((c) => /user/i.test(c.name));
    if (!usersCol) continue;

    console.log(`\n=== DATABASE "${name}" -> collection "${usersCol.name}" ===`);

    const filter = emailArg ? { email: emailArg.toLowerCase() } : {};
    const users = await d.collection(usersCol.name).find(filter).limit(50).toArray();

    console.log(`Matching documents: ${users.length}\n`);
    for (const u of users) {
      console.log({
        email: maskEmail(u.email),
        _id: u._id?.toString?.(),
        role: u.role ?? null,
        roles: u.roles ?? null,
        name: u.name,
        emailVerified: u.emailVerified,
        authProvider: u.authProvider ?? null,
        hasPassword: !!u.password,
        createdAt: u.createdAt,
      });
    }

    const indexes = await d.collection(usersCol.name).indexes();
    console.log('\nIndexes:', JSON.stringify(indexes.map((i) => i.key), null, 2));
  }

  if (emailArg) {
    // case-insensitive double check
    for (const name of dbNames) {
      const d = client.db(name);
      const regex = new RegExp(`^${emailArg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      const n = await d.collection('users').countDocuments({ email: regex }).catch(() => 0);
      if (n > 0) console.log(`[ci-check] db "${name}": ${n} user doc(s) match email (case-insensitive)`);
    }
  }
  console.log('\nDone (read-only).');
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await client.close();
}

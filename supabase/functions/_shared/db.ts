import { MongoClient } from 'npm:mongodb@6.5.0';

const MONGODB_URI = Deno.env.get('MONGODB_URI');

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedDb: MongoClient | null = null;

export async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedDb = client;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}
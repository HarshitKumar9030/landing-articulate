import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & { articulatexMongo?: Promise<MongoClient> };

export function getDb() {
  if (!globalForMongo.articulatexMongo) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Contact submissions are not configured.");
    globalForMongo.articulatexMongo = new MongoClient(uri, { maxPoolSize: 10, minPoolSize: 1, serverSelectionTimeoutMS: 5_000 }).connect();
  }
  return globalForMongo.articulatexMongo.then((client) => client.db());
}

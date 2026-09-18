import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & { articulatexMongo?: Promise<MongoClient> };

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not configured.");

export const clientPromise = globalForMongo.articulatexMongo || new MongoClient(uri, { maxPoolSize: 10, minPoolSize: 1, serverSelectionTimeoutMS: 5_000 }).connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.articulatexMongo = clientPromise;
}

export function getDb() {
  return clientPromise.then((client) => client.db());
}

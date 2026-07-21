import mongoose from "mongoose";
import dns from "dns";

// Configure public DNS resolution for SRV record lookups on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if DNS override fails
}

const MONGODB_URI = process.env.MONGODB_URI || "";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects directly to MongoDB Atlas using Mongoose.
 * Reuses existing connection across hot reloads in Next.js development server.
 */
export async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is missing in .env.local");
    throw new Error("MONGODB_URI environment variable is missing in .env.local");
  }

  // If already connected, reuse connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✅ MongoDB Connected");
        console.log("Database Name:", m.connection.name);
        console.log("Host:", m.connection.host);
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB Atlas Connection Error:", err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;

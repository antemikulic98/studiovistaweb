import mongoose from 'mongoose';

// Extend global interface for mongoose caching
declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MongoDB connection error: MONGODB_URI environment variable not found');
  console.log('💡 Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Connecting to MongoDB...');
    console.log('🔗 Connection string format:', (MONGODB_URI as string).replace(/\/\/[^:]+:[^@]+@/, '//*****:*****@'));
    
    cached.promise = mongoose.connect(MONGODB_URI as string, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
    return cached.conn;
  } catch (e) {
    console.error('❌ MongoDB connection error:', e);
    console.log('💡 Make sure to:');
    console.log('   1. Set MONGODB_URI environment variable');
    console.log('   2. Check your MongoDB cluster is running');
    console.log('   3. Verify connection string is correct');
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;

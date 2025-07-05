import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova';
const MONGODB_DB = process.env.MONGODB_DB || 'neuronova';

// Connection options
const options = {
  serverSelectionTimeoutMS: 30000, // Increased to 30 seconds for Atlas
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
};

// Initialize MongoDB client promise
if (MONGODB_URI) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect();
  }
}

// Alias for connectMongoose to maintain backward compatibility
export const connectToDatabase = connectMongoose;

export async function connectMongoose(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState >= 1) {
      return true;
    }

    console.log('🔄 Connecting Mongoose to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      ...options,
    });
    
    console.log('✅ Mongoose connected to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('❌ Mongoose connection error:', error);
    return false;
  }
}

export function isMongoDBAvailable(): boolean {
  return mongoose.connection.readyState === 1 || !!clientPromise;
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    if (client) {
      await client.close();
      client = null;
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    console.log('🔌 Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB Atlas:', error);
  }
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db?.admin().ping();
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}

// Initialize database connection on startup
export async function initializeDatabase(): Promise<void> {
  try {
    await connectMongoose();
  } catch (error) {
    console.warn('⚠️ Running without database connection');
    console.log('💡 To set up MongoDB Atlas:');
    console.log('   1. Create a free cluster at https://cloud.mongodb.com');
    console.log('   2. Get your connection string from the cluster');
    console.log('   3. Set MONGODB_URI in your environment variables');
  }
}

// Helper function to get database
export async function getDatabase(): Promise<Db | null> {
  if (!clientPromise) {
    console.warn('MongoDB not configured - MONGODB_URI environment variable missing');
    return null;
  }
  
  try {
    const client = await clientPromise;
    return client.db(MONGODB_DB);
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    return null;
  }
}

// Helper function to get collections
export async function getCollection(name: string) {
  const db = await getDatabase();
  if (!db) {
    return null;
  }
  return db.collection(name);
}

// Export the client promise
export default clientPromise; 
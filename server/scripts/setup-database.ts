import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/database';

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

async function setupDatabase() {
  console.log('🚀 Setting up Neuronova Database...');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connection successful!');
    
    // Create indexes for better performance
    console.log('📝 Creating database indexes...');
    
    // User collection indexes
    const userCollection = mongoose.connection.collection('users');
    await userCollection.createIndex({ email: 1 }, { unique: true });
    await userCollection.createIndex({ role: 1 });
    console.log('✅ User indexes created');
    
    // Research collection indexes
    const researchCollection = mongoose.connection.collection('researches');
    await researchCollection.createIndex({ title: 'text', abstract: 'text', keywords: 'text' });
    await researchCollection.createIndex({ categories: 1 });
    await researchCollection.createIndex({ publicationDate: -1 });
    await researchCollection.createIndex({ trendingScore: -1 });
    await researchCollection.createIndex({ status: 1 });
    console.log('✅ Research indexes created');
    
    // Test basic operations
    console.log('🧪 Testing basic database operations...');
    
    // Test user creation
    const testUser = {
      name: 'Database Test User',
      email: 'test@neuronova.com',
      role: 'user',
      isVerified: true,
      preferences: {
        categories: ['neuroscience'],
        emailNotifications: true,
        darkMode: false,
      },
      badges: [],
      followedTopics: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActive: new Date(),
    };
    
    await userCollection.insertOne(testUser);
    console.log('✅ Test user created successfully');
    
    // Clean up test data
    await userCollection.deleteOne({ email: 'test@neuronova.com' });
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Database Statistics:');
    
    // Get collection stats
    if (mongoose.connection.db) {
      const stats = await mongoose.connection.db.stats();
      console.log(`   - Database Size: ${(stats['dataSize'] / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   - Collections: ${stats['collections']}`);
      console.log(`   - Indexes: ${stats['indexes']}`);
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase; 
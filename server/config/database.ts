import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/neuronova';
    
    console.log(`🔄 Attempting to connect to MongoDB at: ${mongoURI}`);
    
    const conn = await mongoose.connect(mongoURI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`📄 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    console.warn('⚠️ Running without database connection - some features may not work');
    console.log('💡 To install MongoDB:');
    console.log('   - Windows: Download from https://www.mongodb.com/try/download/community');
    console.log('   - macOS: brew install mongodb-community');
    console.log('   - Linux: sudo apt install mongodb');
    console.log('   - Or use MongoDB Atlas: https://cloud.mongodb.com/');
    
    // Don't exit in development, allow running without DB
    if (process.env['NODE_ENV'] === 'production') {
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
}; 
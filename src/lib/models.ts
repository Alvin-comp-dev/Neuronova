import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  name: String,
  likes: [String], // Array of article IDs
  bookmarks: [String],
  createdAt: { type: Date, default: Date.now }
});

// Research Schema
const researchSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  authors: [Object],
  categories: [String],
  tags: [String],
  keywords: [String],
  source: Object,
  doi: String,
  publicationDate: Date,
  citationCount: Number,
  viewCount: Number,
  bookmarkCount: Number,
  likeCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },
  trendingScore: Number,
  status: String,
  metrics: Object,
}, { timestamps: true });

// Share tracking schema
const shareSchema = new mongoose.Schema({
  articleId: { type: String, required: true },
  userId: String,
  shareType: { 
    type: String, 
    enum: ['link', 'email', 'twitter', 'linkedin', 'facebook', 'whatsapp'], 
    required: true 
  },
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ipAddress: String
});

// Export models with proper error handling
export const getUser = () => {
  try {
    return mongoose.model('User');
  } catch {
    return mongoose.model('User', userSchema);
  }
};

export const getResearch = () => {
  try {
    return mongoose.model('Research');
  } catch {
    return mongoose.model('Research', researchSchema);
  }
};

export const getShare = () => {
  try {
    return mongoose.model('Share');
  } catch {
    return mongoose.model('Share', shareSchema);
  }
};

// Database connection
export async function connectToMongoDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova';
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
} 
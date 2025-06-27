import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection
async function connectToMongoDB() {
  const mongoUri = 'mongodb+srv://neuronova-user:uW6YaOSchJCDPn48@neuronova-user.bjw3cre.mongodb.net/neuronova?retryWrites=true&w=majority&appName=neuronova-user';
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
}

// Research schema
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
  trendingScore: Number,
  status: String,
  metrics: Object,
}, { timestamps: true });

let Research: any;
try {
  Research = mongoose.model('Research');
} catch {
  Research = mongoose.model('Research', researchSchema);
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting research publication via /publish endpoint...');
    
    // Parse the request body
    const body = await request.json();
    console.log('📥 Received data:', JSON.stringify(body, null, 2));
    
    const { title, abstract, authors, keywords, category, files } = body;

    // Validate required fields
    if (!title || !abstract || !authors || !keywords || !category) {
      console.log('❌ Missing required fields');
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, abstract, authors, keywords, category'
      }, { status: 400 });
    }

    // Map frontend category to backend enum
    const categoryMap: { [key: string]: string } = {
      'Neuroscience': 'neuroscience',
      'Artificial Intelligence': 'ai',
      'Machine Learning': 'ai',
      'Computer Vision': 'ai',
      'Natural Language Processing': 'ai',
      'Robotics': 'ai',
      'Data Science': 'ai',
      'Bioinformatics': 'bioinformatics',
      'Computational Biology': 'bioinformatics',
      'Physics': 'neuroscience', // Map to closest available
      'Chemistry': 'biotech',
      'Mathematics': 'ai',
      'Medicine': 'healthcare',
      'Engineering': 'medical-devices'
    };

    const mappedCategory = categoryMap[category] || 'neuroscience';

    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await connectToMongoDB();
    console.log('✅ Connected to MongoDB for research publishing');

    // Create new research document with correct schema format
    const newResearch = {
      title,
      abstract,
      authors,
      categories: [mappedCategory], // Use mapped category
      keywords: keywords.map((k: string) => k.toLowerCase()),
      tags: keywords.map((k: string) => k.toLowerCase()),
      source: {
        name: 'Neuronova Community',
        url: 'https://neuronova.com',
        type: 'journal' // Use valid enum value
      },
      doi: `10.neuronova/${Date.now()}`,
      publicationDate: new Date(),
      citationCount: 0,
      viewCount: 0,
      bookmarkCount: 0,
      trendingScore: 0,
      status: 'published',
      language: 'en',
      metrics: {
        impactScore: 0,
        readabilityScore: 0,
        noveltyScore: 0
      },
      files: files || []
    };

    console.log('💾 Saving research to database with data:', JSON.stringify(newResearch, null, 2));
    
    // Save to database
    const savedResearch = await Research.create(newResearch);
    console.log('✅ Research published successfully:', savedResearch._id);

    return NextResponse.json({
      success: true,
      data: {
        id: savedResearch._id,
        message: 'Research published successfully',
        title: savedResearch.title
      }
    });

  } catch (error) {
    console.error('❌ Research publishing error:', error);
    console.error('❌ Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: `Failed to publish research: ${error.message}`
    }, { status: 500 });
  }
} 
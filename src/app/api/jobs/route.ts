import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Job model schema
const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Research', 'Engineering', 'Data Science', 'Healthcare', 'Neuroscience', 'Biotech'],
    default: 'Research'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    required: [true, 'Experience requirement is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: [{
    type: String,
    required: [true, 'At least one requirement is required']
  }],
  responsibilities: [{
    type: String,
    required: [true, 'At least one responsibility is required']
  }],
  qualifications: [{
    type: String,
    required: [true, 'At least one qualification is required']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Add text indexes for search
JobSchema.index({
  title: 'text',
  description: 'text',
  department: 'text',
  location: 'text'
});

// Add compound index for department and isActive
JobSchema.index({ department: 1, isActive: 1 });

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// GET /api/jobs - List active jobs
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const id = searchParams.get('id');
    
    if (id) {
      const job = await Job.findOne({ _id: id, isActive: true });
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json(job);
    }
    
    const query = {
      isActive: true,
      ...(department && department !== 'all' ? { department } : {})
    };
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// GET /api/jobs/[id] - Get single job
export async function HEAD(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const job = await Job.findOne({ _id: id, isActive: true });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
} 
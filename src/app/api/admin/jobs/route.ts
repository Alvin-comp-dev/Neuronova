import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Job from '../../../../../server/models/Job';
import { connectMongoose } from '@/lib/mongodb';

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

const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema);

// Verify admin access
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024') as { id: string, role: string };
    
    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
}

// GET handler for fetching jobs
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoose();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const department = searchParams.get('department');

    // If ID is provided, fetch single job
    if (id) {
      const job = await Job.findById(id);
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json(job);
    }

    // Build query for job listing
    const query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }
    if (department && department !== 'all') {
      query.department = department;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error in GET /api/admin/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST handler for creating new jobs
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoose();

    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'department', 'location', 'type', 'experience', 'description'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new job
    const job = new Job({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await job.save();
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// PATCH handler for updating jobs
export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoose();

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Update job
    const job = await Job.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error in PATCH /api/admin/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE handler for removing jobs
export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoose();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const job = await Job.findByIdAndDelete(id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/jobs:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

// Job posting data structure
interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // 'full-time', 'part-time', 'contract', 'intern'
  level: string; // 'entry', 'mid', 'senior', 'lead'
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary_range?: string;
  posted_date: string;
  application_deadline?: string;
  remote_ok: boolean;
  status: 'active' | 'paused' | 'closed';
  created_by: string;
  updated_at: string;
}

// Mock job postings data - In production this would be from database
let jobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'full-time',
    level: 'senior',
    description: 'Join our core engineering team to build the next generation of research discovery tools.',
    requirements: ['5+ years of full-stack development experience', 'Expert knowledge of TypeScript, React, Node.js'],
    responsibilities: ['Design and implement new features', 'Optimize application performance'],
    benefits: ['Competitive salary and equity package', 'Comprehensive health insurance'],
    salary_range: '$140,000 - $180,000',
    posted_date: '2024-01-15T00:00:00Z',
    remote_ok: true,
    status: 'active',
    created_by: 'admin@neuronova.com',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'AI Research Scientist',
    department: 'Research & AI',
    location: 'Remote',
    type: 'full-time',
    level: 'senior',
    description: 'Lead our AI research initiatives to improve academic paper discovery, relevance scoring, and knowledge extraction.',
    requirements: [
      'PhD in Computer Science, AI/ML, or related field',
      'Strong background in NLP and information retrieval',
      'Experience with large language models and embeddings',
      'Published research in top-tier conferences'
    ],
    responsibilities: [
      'Develop novel AI algorithms for research discovery',
      'Improve semantic search and ranking systems',
      'Research and implement state-of-the-art NLP techniques',
      'Publish research findings and represent NeuroNova at conferences'
    ],
    benefits: [
      'Competitive research scientist compensation',
      'Research publication support and conference budget',
      'Access to premium compute resources and datasets',
      'Collaboration opportunities with top universities'
    ],
    salary_range: '$160,000 - $220,000',
    posted_date: '2024-01-10T00:00:00Z',
    remote_ok: true,
    status: 'active',
    created_by: 'admin@neuronova.com',
    updated_at: '2024-01-10T00:00:00Z'
  }
];

// Authentication function for admin
function authenticateAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024'
    ) as { id: string, role?: string, email?: string };

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Admin authentication error:', error);
    return null;
  }
}

// GET /api/admin/job-management - Get job postings with filtering
export async function GET(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Authenticate admin
    const admin = authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const department = searchParams.get('department');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Filter job postings
    let filteredJobs = [...jobPostings];

    // Filter by status
    if (status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }

    // Filter by department
    if (department) {
      filteredJobs = filteredJobs.filter(job => 
        job.department.toLowerCase().includes(department.toLowerCase())
      );
    }

    // Filter by type
    if (type) {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.department.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      );
    }

    // Sort by updated date (newest first)
    filteredJobs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: jobPostings.length,
      active: jobPostings.filter(job => job.status === 'active').length,
      paused: jobPostings.filter(job => job.status === 'paused').length,
      closed: jobPostings.filter(job => job.status === 'closed').length,
      departments: [...new Set(jobPostings.map(job => job.department))],
      types: [...new Set(jobPostings.map(job => job.type))],
      levels: [...new Set(jobPostings.map(job => job.level))]
    };

    return NextResponse.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        pagination: {
          page,
          limit,
          total: filteredJobs.length,
          totalPages: Math.ceil(filteredJobs.length / limit),
          hasNext: page < Math.ceil(filteredJobs.length / limit),
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching job postings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job postings' },
      { status: 500 }
    );
  }
}

// POST /api/admin/job-management - Create or update job posting
export async function POST(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Authenticate admin
    const admin = authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, jobData, jobId } = body;

    if (action === 'create') {
      // Validate required fields
      const { title, department, location, type, level, description } = jobData;
      if (!title || !department || !location || !type || !level || !description) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Create new job posting
      const newJob: JobPosting = {
        id: `job_${Date.now()}`,
        title,
        department,
        location,
        type,
        level,
        description,
        requirements: jobData.requirements || [],
        responsibilities: jobData.responsibilities || [],
        benefits: jobData.benefits || [],
        salary_range: jobData.salary_range,
        posted_date: new Date().toISOString(),
        application_deadline: jobData.application_deadline,
        remote_ok: jobData.remote_ok || false,
        status: 'active',
        created_by: admin.email || admin.id,
        updated_at: new Date().toISOString()
      };

      jobPostings.push(newJob);

      console.log(`Job posting created: ${newJob.title} by ${admin.email}`);

      return NextResponse.json({
        success: true,
        message: 'Job posting created successfully',
        data: newJob
      });

    } else if (action === 'update') {
      if (!jobId) {
        return NextResponse.json(
          { success: false, error: 'Job ID is required for update' },
          { status: 400 }
        );
      }

      // Find and update job
      const jobIndex = jobPostings.findIndex(job => job.id === jobId);
      if (jobIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Job posting not found' },
          { status: 404 }
        );
      }

      const updatedJob = {
        ...jobPostings[jobIndex],
        ...jobData,
        updated_at: new Date().toISOString()
      };

      jobPostings[jobIndex] = updatedJob;

      console.log(`Job posting updated: ${updatedJob.title} by ${admin.email}`);

      return NextResponse.json({
        success: true,
        message: 'Job posting updated successfully',
        data: updatedJob
      });

    } else if (action === 'updateStatus') {
      if (!jobId || !jobData.status) {
        return NextResponse.json(
          { success: false, error: 'Job ID and status are required' },
          { status: 400 }
        );
      }

      const jobIndex = jobPostings.findIndex(job => job.id === jobId);
      if (jobIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Job posting not found' },
          { status: 404 }
        );
      }

      jobPostings[jobIndex].status = jobData.status;
      jobPostings[jobIndex].updated_at = new Date().toISOString();

      console.log(`Job status updated: ${jobPostings[jobIndex].title} -> ${jobData.status} by ${admin.email}`);

      return NextResponse.json({
        success: true,
        message: 'Job status updated successfully',
        data: jobPostings[jobIndex]
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error managing job posting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to manage job posting' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/job-management - Delete job posting
export async function DELETE(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Authenticate admin
    const admin = authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Find and remove job
    const jobIndex = jobPostings.findIndex(job => job.id === jobId);
    if (jobIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Job posting not found' },
        { status: 404 }
      );
    }

    const deletedJob = jobPostings.splice(jobIndex, 1)[0];

    console.log(`Job posting deleted: ${deletedJob.title} by ${admin.email}`);

    return NextResponse.json({
      success: true,
      message: 'Job posting deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting job posting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete job posting' },
      { status: 500 }
    );
  }
}

// Export job postings for frontend careers page
export { jobPostings }; 
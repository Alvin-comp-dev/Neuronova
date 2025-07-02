import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

// Job application data structure
interface JobApplication {
  _id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resume: string;
  coverLetter: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  score?: number;
  interview?: {
    scheduled: boolean;
    date?: string;
    type?: 'phone' | 'video' | 'in-person';
    interviewer?: string;
    notes?: string;
  };
}

// Mock job applications data - In production this would be from database
let jobApplications: JobApplication[] = [
  {
    _id: 'app_001',
    jobId: '1',
    jobTitle: 'Senior Full Stack Developer',
    applicantName: 'John Smith',
    applicantEmail: 'john.smith@email.com',
    applicantPhone: '+1-555-0123',
    resume: 'https://example.com/resume1.pdf',
    coverLetter: 'I am excited to apply for the Senior Full Stack Developer position...',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    portfolioUrl: 'https://johnsmith.dev',
    status: 'pending',
    submittedAt: '2024-01-16T10:30:00Z',
  },
  {
    _id: 'app_002',
    jobId: '2',
    jobTitle: 'AI Research Scientist',
    applicantName: 'Dr. Sarah Johnson',
    applicantEmail: 'sarah.johnson@university.edu',
    applicantPhone: '+1-555-0456',
    resume: 'https://example.com/resume2.pdf',
    coverLetter: 'With my PhD in Machine Learning and 5 years of research experience...',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    status: 'shortlisted',
    submittedAt: '2024-01-14T14:15:00Z',
    reviewedAt: '2024-01-15T09:00:00Z',
    reviewedBy: 'admin@neuronova.com',
    adminNotes: 'Excellent research background, strong publications',
    score: 9,
    interview: {
      scheduled: true,
      date: '2024-01-20T15:00:00Z',
      type: 'video',
      interviewer: 'Dr. Chen',
    },
  },
  {
    _id: 'app_003',
    jobId: '3',
    jobTitle: 'Product Designer',
    applicantName: 'Alex Rivera',
    applicantEmail: 'alex.rivera@design.com',
    applicantPhone: '+1-555-0789',
    resume: 'https://example.com/resume3.pdf',
    coverLetter: 'As a passionate product designer with expertise in UX research...',
    portfolioUrl: 'https://alexrivera.design',
    status: 'reviewed',
    submittedAt: '2024-01-18T11:45:00Z',
    reviewedAt: '2024-01-19T16:30:00Z',
    reviewedBy: 'admin@neuronova.com',
    adminNotes: 'Great portfolio, good design thinking',
    score: 7.5,
  },
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
    ) as { id: string, role?: string };

    // Check if user is admin
    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded.id;
  } catch (error) {
    console.error('Admin authentication error:', error);
    return null;
  }
}

// GET /api/admin/career-management - Get job applications with filtering
export async function GET(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Authenticate admin
    const adminId = authenticateAdmin(request);
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const jobId = searchParams.get('jobId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'submittedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Filter applications
    let filteredApplications = [...jobApplications];

    // Filter by status
    if (status !== 'all') {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }

    // Filter by job ID
    if (jobId) {
      filteredApplications = filteredApplications.filter(app => app.jobId === jobId);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredApplications = filteredApplications.filter(app =>
        app.applicantName.toLowerCase().includes(searchLower) ||
        app.applicantEmail.toLowerCase().includes(searchLower) ||
        app.jobTitle.toLowerCase().includes(searchLower)
      );
    }

    // Sort applications
    filteredApplications.sort((a, b) => {
      let aValue = a[sortBy as keyof JobApplication];
      let bValue = b[sortBy as keyof JobApplication];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
      
      return 0;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: jobApplications.length,
      pending: jobApplications.filter(app => app.status === 'pending').length,
      reviewed: jobApplications.filter(app => app.status === 'reviewed').length,
      shortlisted: jobApplications.filter(app => app.status === 'shortlisted').length,
      interviewed: jobApplications.filter(app => app.status === 'interviewed').length,
      hired: jobApplications.filter(app => app.status === 'hired').length,
      rejected: jobApplications.filter(app => app.status === 'rejected').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        applications: paginatedApplications,
        pagination: {
          page,
          limit,
          total: filteredApplications.length,
          totalPages: Math.ceil(filteredApplications.length / limit),
          hasNext: page < Math.ceil(filteredApplications.length / limit),
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job applications' },
      { status: 500 }
    );
  }
}

// POST /api/admin/career-management - Update application status or add notes
export async function POST(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Authenticate admin
    const adminId = authenticateAdmin(request);
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationId, action, data } = body;

    if (!applicationId || !action) {
      return NextResponse.json(
        { success: false, error: 'Application ID and action are required' },
        { status: 400 }
      );
    }

    // Find application
    const applicationIndex = jobApplications.findIndex(app => app._id === applicationId);
    if (applicationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    const application = jobApplications[applicationIndex];

    switch (action) {
      case 'updateStatus':
        if (!data.status) {
          return NextResponse.json(
            { success: false, error: 'Status is required' },
            { status: 400 }
          );
        }
        application.status = data.status;
        application.reviewedAt = new Date().toISOString();
        application.reviewedBy = adminId;
        if (data.adminNotes) application.adminNotes = data.adminNotes;
        if (data.score) application.score = data.score;
        break;

      case 'addNotes':
        application.adminNotes = data.notes;
        application.reviewedAt = new Date().toISOString();
        application.reviewedBy = adminId;
        break;

      case 'scheduleInterview':
        application.interview = {
          scheduled: true,
          date: data.date,
          type: data.type,
          interviewer: data.interviewer,
          notes: data.notes
        };
        application.status = 'interviewed';
        break;

      case 'updateScore':
        application.score = data.score;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    console.log(`Application ${applicationId} updated by admin ${adminId}: ${action}`);

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job application' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/career-management - Delete application
export async function DELETE(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Authenticate admin
    const adminId = authenticateAdmin(request);
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Find and remove application
    const applicationIndex = jobApplications.findIndex(app => app._id === applicationId);
    if (applicationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    jobApplications.splice(applicationIndex, 1);

    console.log(`Application ${applicationId} deleted by admin ${adminId}`);

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting job application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete job application' },
      { status: 500 }
    );
  }
} 
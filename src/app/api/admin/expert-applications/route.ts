import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { getExpertApplications, updateExpertApplication, debugStorage } from '@/lib/sharedStorage';

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

// GET /api/admin/expert-applications - Get all expert applications
export async function GET(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Authenticate admin
    const adminId = authenticateAdmin(request);
    if (!adminId) {
      console.log('Admin authentication failed');
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    console.log('Admin authenticated successfully:', adminId);
    
    // Debug storage state
    debugStorage();
    
    console.log('Total applications in memory:', getExpertApplications().length);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    console.log('Fetching applications with filters:', { status, page, limit, search });

    // Filter applications
    let filteredApplications = getExpertApplications();

    // Filter by status
    if (status !== 'all') {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredApplications = filteredApplications.filter(app =>
        app.userName.toLowerCase().includes(searchLower) ||
        app.userEmail.toLowerCase().includes(searchLower) ||
        app.specialization.toLowerCase().includes(searchLower) ||
        app.institution.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filteredApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    // Calculate pagination info
    const total = filteredApplications.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        applications: paginatedApplications,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching expert applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expert applications' },
      { status: 500 }
    );
  }
}

// POST /api/admin/expert-applications - Update application status
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
    const { applicationId, status, adminNotes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be approved, rejected, or pending' },
        { status: 400 }
      );
    }

    // Find and update application
    const applications = getExpertApplications();
    const applicationIndex = applications.findIndex(app => app._id === applicationId);
    if (applicationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update application
    const updatedApplication = updateExpertApplication(applicationId, {
      status,
      adminNotes,
      updatedAt: new Date()
    });

    if (!updatedApplication) {
      return NextResponse.json(
        { success: false, error: 'Failed to update application' },
        { status: 500 }
      );
    }

    console.log(`Expert application ${applicationId} ${status} by admin ${adminId}`);

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error updating expert application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update expert application' },
      { status: 500 }
    );
  }
} 
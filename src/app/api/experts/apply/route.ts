import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { addExpertApplication, expertApplications, debugStorage } from '@/lib/sharedStorage';

// Mock users data (same as in other routes)
const mockUsers = [
  {
    id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user' as const,
  },
  {
    id: '507f1f77bcf86cd799439012',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@neuronova.com',
    role: 'expert' as const,
  },
  {
    id: '507f1f77bcf86cd799439013',
    name: 'Admin User',
    email: 'admin@neuronova.com',
    role: 'admin' as const,
  },
  {
    id: '507f1f77bcf86cd799439014',
    name: 'Test User',
    email: 'ejialvtuke@gmail.com',
    role: 'user' as const,
  },
];

// Authentication function for mock users and real users
function authenticateUser(request: NextRequest) {
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
    ) as { id: string };

    return decoded.id;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongoose();
    
    // Get user from token
    const userId = authenticateUser(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      specialization,
      institution,
      location,
      bio,
      expertise,
      publications,
      citations,
      hIndex,
      linkedin,
      twitter,
      orcid
    } = body;

    // Validate required fields
    if (!specialization || !institution || !location || !bio) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user details
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has a pending application
    const existingApplication = expertApplications.find(
      app => app.userId === userId && app.status === 'pending'
    );
    
    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You already have a pending application' },
        { status: 400 }
      );
    }

    // Create new application
    const newApplication = {
      _id: `app_${Date.now()}`,
      userId,
      specialization,
      institution,
      location,
      bio,
      expertise,
      publications: parseInt(publications) || 0,
      citations: parseInt(citations) || 0,
      hIndex: parseInt(hIndex) || 0,
      socialLinks: {
        linkedin,
        twitter,
        orcid
      },
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to shared storage
    addExpertApplication(newApplication);
    
    // Debug storage state
    debugStorage();
    
    console.log('Expert application received:', newApplication);
    console.log('Total applications in memory:', expertApplications.length);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! We will review your application and get back to you soon.',
      data: {
        applicationId: newApplication._id,
        status: newApplication.status
      }
    });

  } catch (error) {
    console.error('Error processing expert application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 
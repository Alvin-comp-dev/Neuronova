import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserService } from '@/lib/models/User';

// Middleware to verify admin access
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024') as { id: string };
    
    const user = await UserService.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Fetch users
    const users = await UserService.findAll(limit);
    
    // Transform users for admin view
    const adminUsers = users.map(user => ({
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.isVerified ? 'active' : 'pending',
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastActive: user.lastActive.toISOString().split('T')[0],
      researchCount: user.stats?.articlesRead || 0,
      communitePosts: user.stats?.communitePosts || 0,
      achievements: user.stats?.achievements || 0,
      avatar: user.avatar,
      badges: user.badges,
      isVerified: user.isVerified,
    }));

    // Apply filters
    let filteredUsers = adminUsers;
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalUsers: filteredUsers.length,
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1,
      },
      stats: {
        totalUsers: adminUsers.length,
        activeUsers: adminUsers.filter(u => u.status === 'active').length,
        pendingUsers: adminUsers.filter(u => u.status === 'pending').length,
        adminUsers: adminUsers.filter(u => u.role === 'admin').length,
        expertUsers: adminUsers.filter(u => u.role === 'expert').length,
        regularUsers: adminUsers.filter(u => u.role === 'user').length,
      }
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const userData = await request.json();
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserService.findByEmail(userData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await UserService.create({
      name: userData.name.trim(),
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'user',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face`,
      isVerified: userData.isVerified || false,
      preferences: {
        categories: userData.categories || [],
        emailNotifications: true,
        darkMode: true,
      },
      badges: userData.badges || [],
      followedTopics: userData.followedTopics || [],
    });

    // Return created user (without sensitive data)
    const publicUser = UserService.toPublicUser(newUser);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: publicUser._id?.toString(),
        name: publicUser.name,
        email: publicUser.email,
        role: publicUser.role,
        status: publicUser.isVerified ? 'active' : 'pending',
        joinDate: publicUser.createdAt.toISOString().split('T')[0],
        avatar: publicUser.avatar,
        badges: publicUser.badges,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create user API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { userId, ...updateData } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await UserService.update(userId, updateData);
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user
    const publicUser = UserService.toPublicUser(updatedUser);

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: publicUser._id?.toString(),
        name: publicUser.name,
        email: publicUser.email,
        role: publicUser.role,
        status: publicUser.isVerified ? 'active' : 'pending',
        avatar: publicUser.avatar,
        badges: publicUser.badges,
      }
    });

  } catch (error) {
    console.error('Admin update user API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 
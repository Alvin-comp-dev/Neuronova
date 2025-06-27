import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Mock users data (same as in login route)
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    isVerified: true,
    preferences: {
      categories: ['neuroscience', 'healthcare'],
      emailNotifications: true,
      darkMode: true,
    },
  },
  {
    id: '2',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@neuronova.com',
    role: 'expert' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    isVerified: true,
    preferences: {
      categories: ['neuroscience', 'ai'],
      emailNotifications: true,
      darkMode: true,
    },
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@neuronova.com',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    isVerified: true,
    preferences: {
      categories: ['admin'],
      emailNotifications: true,
      darkMode: true,
    },
  },
  {
    id: '4',
    name: 'Test User',
    email: 'ejialvtuke@gmail.com',
    role: 'user' as const,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    isVerified: true,
    preferences: {
      categories: ['neuroscience', 'healthcare', 'ai'],
      emailNotifications: true,
      darkMode: true,
    },
    badges: ['early-adopter'],
    stats: {
      articlesPublished: 0,
      articlesRead: 25,
      citations: 0,
      followers: 5
    }
  },
];

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024'
    ) as { id: string };

    // Check if this is a mock user ID
    const mockUser = mockUsers.find(u => u.id === decoded.id);
    if (mockUser) {
      return NextResponse.json({
        success: true,
        data: mockUser,
      });
    }

    // If not a mock user, try to find in database
    // Connect to MongoDB
    const mongoUri = 'mongodb+srv://neuronova-user:uW6YaOSchJCDPn48@neuronova-user.bjw3cre.mongodb.net/neuronova?retryWrites=true&w=majority&appName=neuronova-user';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Use the same User schema as login
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isVerified: Boolean,
      preferences: Object,
      badges: [String],
      stats: Object,
      avatar: String,
      lastActive: Date,
    }, { timestamps: true });

    let User;
    try {
      User = mongoose.model('User');
    } catch {
      User = mongoose.model('User', userSchema);
    }

    // Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Return user data (without sensitive fields)
    return NextResponse.json({
      success: true,
      data: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        preferences: user.preferences,
        badges: user.badges,
        stats: user.stats,
      },
    });

  } catch (error) {
    console.error('Get user error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024'
    ) as { id: string };

    // Connect to MongoDB
    const mongoUri = 'mongodb+srv://neuronova-user:uW6YaOSchJCDPn48@neuronova-user.bjw3cre.mongodb.net/neuronova?retryWrites=true&w=majority&appName=neuronova-user';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Use the same User schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isVerified: Boolean,
      preferences: Object,
      badges: [String],
      stats: Object,
      avatar: String,
      lastActive: Date,
    }, { timestamps: true });

    let User;
    try {
      User = mongoose.model('User');
    } catch {
      User = mongoose.model('User', userSchema);
    }

    // Get update data
    const updateData = await request.json();
    
    // Remove sensitive fields
    const { password, _id, id, createdAt, updatedAt, ...allowedUpdates } = updateData;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id, 
      { ...allowedUpdates, lastActive: new Date() },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user data
    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser._id?.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        isVerified: updatedUser.isVerified,
        preferences: updatedUser.preferences,
        badges: updatedUser.badges,
        stats: updatedUser.stats,
      },
    });

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
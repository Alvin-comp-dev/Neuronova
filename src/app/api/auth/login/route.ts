import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Updated login route with MongoDB fallback - v2
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    console.log('Login attempt for:', email);

    // For external test users, check mock login first
    const mockTestUsers = ['ejialvtuke@gmail.com', 'john@example.com', 'test@example.com'];
    if (mockTestUsers.includes(email.toLowerCase())) {
      console.log('Using mock login for test user:', email);
      return handleMockLogin(email, password);
    }

    // Connect to the same MongoDB as the seeding script
    const mongoUri = 'mongodb+srv://neuronova-user:uW6YaOSchJCDPn48@neuronova-user.bjw3cre.mongodb.net/neuronova?retryWrites=true&w=majority&appName=neuronova-user';
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Use the same User model as the seeding script
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

    // Add password verification method
    userSchema.methods.matchPassword = async function(enteredPassword: string) {
      return await bcrypt.compare(enteredPassword, this.password);
    };

    let User;
    try {
      User = mongoose.model('User');
    } catch {
      User = mongoose.model('User', userSchema);
    }

    // Find user by email
    console.log('Searching for user with email:', email.toLowerCase());
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('User not found in database:', email);
      // Let's also check if the user exists in the database with different casing
      const userAnyCase = await User.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      }).select('+password');
      
      if (!userAnyCase) {
        console.log('User not found in database with any casing, trying mock login:', email);
        // Fall back to mock login for development
        return handleMockLogin(email, password);
      } else {
        console.log('Found user with different casing:', userAnyCase.email);
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }
    
    console.log('Found user:', user.email, 'Password hash length:', user.password ? user.password.length : 'no password');

    // Verify password using bcrypt directly
    console.log('Comparing password for user:', email);
    console.log('Provided password length:', password ? password.length : 'no password');
    console.log('Stored hash starts with $2:', user.password ? user.password.startsWith('$2') : 'no hash');
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id!.toString(), role: user.role },
      process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024',
      { expiresIn: '7d' }
    );

    // Return user data (without sensitive fields)
    console.log('Login successful for:', email);
    return NextResponse.json({
      success: true,
      token,
      user: {
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
    console.error('Login error, falling back to mock login:', error);
    // If there's any error with the database, fall back to mock login
    return handleMockLogin(email, password);
  }
}

// Fallback mock login for development without MongoDB
async function handleMockLogin(email: string, password: string) {
  console.log('Mock login attempt:', { email, password });
  
  const mockUsers = [
    {
      id: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId
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
      id: '507f1f77bcf86cd799439012', // Valid MongoDB ObjectId
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
      id: '507f1f77bcf86cd799439013', // Valid MongoDB ObjectId
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
      id: '507f1f77bcf86cd799439014', // Valid MongoDB ObjectId for ejialvtuke@gmail.com
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

  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  console.log('Mock login - Searching for email:', email);
  console.log('Mock login - Found user:', user ? user.email : 'none');
  console.log('Mock login - Password check:', password === 'password123');
  
  if (!user || password !== 'password123') {
    console.log('Login failed - invalid credentials');
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024',
    { expiresIn: '7d' }
  );

  console.log('Login successful for:', user.email);
  return NextResponse.json({
    success: true,
    token,
    user,
  });
} 
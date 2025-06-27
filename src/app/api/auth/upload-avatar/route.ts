import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${decoded.id}_${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create public URL
    const avatarUrl = `/uploads/avatars/${fileName}`;

    // Connect to MongoDB and update user
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

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { 
        avatar: avatarUrl,
        lastActive: new Date()
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'Profile picture updated successfully'
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    
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
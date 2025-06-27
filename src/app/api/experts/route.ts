import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectMongoose } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await connectMongoose();
    
    // Create user schema (same as in seeding script)
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
      isVerified: { type: Boolean, default: false },
      profile: {
        bio: { type: String },
        avatar: { type: String },
        specialization: { type: String },
        institution: { type: String },
        location: { type: String },
        expertise: [{ type: String }],
        publications: { type: Number, default: 0 },
        citations: { type: Number, default: 0 },
        hIndex: { type: Number, default: 0 },
        socialLinks: {
          linkedin: { type: String },
          twitter: { type: String },
          orcid: { type: String },
          github: { type: String }
        }
      },
      preferences: {
        categories: [{ type: String }],
        notifications: {
          email: { type: Boolean, default: true },
          push: { type: Boolean, default: false },
          weekly: { type: Boolean, default: true }
        }
      }
    }, {
      timestamps: true
    });

    // Create or get the model
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Get all expert users
    const experts = await User
      .find({ role: 'expert' })
      .select('-password') // Exclude password field
      .lean();

    // Convert to frontend format
    const publicExperts = experts.map((expert: any) => ({
      _id: expert._id.toString(),
      name: expert.name,
      email: expert.email,
      role: expert.role,
      profile: {
        bio: expert.profile?.bio || '',
        specialization: expert.profile?.specialization || '',
        institution: expert.profile?.institution || '',
        location: expert.profile?.location || '',
        expertise: expert.profile?.expertise || [],
        publications: expert.profile?.publications || 0,
        citations: expert.profile?.citations || 0,
        hIndex: expert.profile?.hIndex || 0,
        socialLinks: expert.profile?.socialLinks || {}
      }
    }));

    return NextResponse.json({
      success: true,
      data: publicExperts
    });

  } catch (error) {
    console.error('Experts API error:', error);
    
    // Return mock data as fallback
    const mockExperts = [
      {
        _id: '1',
        name: 'Dr. Elena Vasquez',
        email: 'elena.vasquez@stanford.edu',
        role: 'expert',
        profile: {
          bio: 'Professor of Neuroscience at Stanford University, specializing in brain-computer interfaces and neural signal processing.',
          specialization: 'Brain-Computer Interfaces',
          institution: 'Stanford University',
          location: 'Palo Alto, CA',
          expertise: ['brain-computer-interfaces', 'neural-signal-processing', 'motor-cortex'],
          publications: 127,
          citations: 8934,
          hIndex: 42,
          socialLinks: {
            linkedin: 'https://linkedin.com/in/elena-vasquez-phd',
            twitter: 'https://twitter.com/elenavasquezphd'
          }
        }
      },
      {
        _id: '2',
        name: 'Dr. Amanda Foster',
        email: 'afoster@mgh.harvard.edu',
        role: 'expert',
        profile: {
          bio: 'Director of AI in Medicine at Massachusetts General Hospital. Leading multi-center validation studies of large language models for clinical decision support.',
          specialization: 'AI in Clinical Decision Support',
          institution: 'Massachusetts General Hospital',
          location: 'Boston, MA',
          expertise: ['clinical-ai', 'large-language-models', 'diagnosis', 'healthcare-ai'],
          publications: 89,
          citations: 5432,
          hIndex: 38,
          socialLinks: {
            linkedin: 'https://linkedin.com/in/amanda-foster-md',
            twitter: 'https://twitter.com/amandafostermd'
          }
        }
      }
    ];
    
    return NextResponse.json({
      success: false,
      data: mockExperts,
      error: 'Database connection failed'
    });
  }
} 
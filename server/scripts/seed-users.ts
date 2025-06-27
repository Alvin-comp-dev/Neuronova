import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/database';
import User from '../models/User';

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

interface TestUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'expert' | 'admin';
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  preferences: {
    categories: string[];
    emailNotifications: boolean;
    darkMode: boolean;
  };
  badges: string[];
  followedTopics: string[];
}

const testUsers: TestUser[] = [
  // Admin Users
  {
    name: 'Admin User',
    email: 'admin@neuronova.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Platform administrator with full system access.',
    isVerified: true,
    preferences: {
      categories: ['neuroscience', 'healthcare', 'ai'],
      emailNotifications: true,
      darkMode: true,
    },
    badges: ['early-adopter'],
    followedTopics: ['platform-updates', 'system-announcements'],
  },
  
  // Expert Users
  {
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@neuronova.com',
    password: 'expert123',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Neuroscientist specializing in brain-computer interfaces. PhD from Stanford, 10+ years in neurotech research.',
    isVerified: true,
    preferences: {
      categories: ['neuroscience', 'biotech'],
      emailNotifications: true,
      darkMode: false,
    },
    badges: ['expert', 'researcher', 'thought-leader'],
    followedTopics: ['brain-computer-interfaces', 'neural-engineering', 'neurotech'],
  },
  
  {
    name: 'Prof. Michael Rodriguez',
    email: 'michael.rodriguez@neuronova.com',
    password: 'expert123',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Gene therapy expert at Johns Hopkins. Leading research in CRISPR applications for neurological disorders.',
    isVerified: true,
    preferences: {
      categories: ['genetics', 'pharmaceuticals'],
      emailNotifications: true,
      darkMode: true,
    },
    badges: ['expert', 'researcher'],
    followedTopics: ['gene-therapy', 'crispr', 'neurological-disorders'],
  },
  
  {
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@neuronova.com',
    password: 'expert123',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'AI Healthcare researcher at Google DeepMind. Focused on machine learning applications in medical diagnosis.',
    isVerified: true,
    preferences: {
      categories: ['ai', 'healthcare'],
      emailNotifications: true,
      darkMode: false,
    },
    badges: ['expert', 'thought-leader'],
    followedTopics: ['ai-healthcare', 'medical-ai', 'machine-learning'],
  },
  
  // Regular Users
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'user123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Medical student interested in the latest healthcare innovations.',
    isVerified: true,
    preferences: {
      categories: ['healthcare', 'neuroscience'],
      emailNotifications: true,
      darkMode: false,
    },
    badges: ['early-adopter'],
    followedTopics: ['medical-research', 'healthcare-innovation'],
  },
  
  {
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    password: 'user123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Biotech researcher passionate about breakthrough discoveries.',
    isVerified: true,
    preferences: {
      categories: ['biotech', 'genetics'],
      emailNotifications: false,
      darkMode: true,
    },
    badges: ['contributor'],
    followedTopics: ['biotech-innovations', 'genetic-research'],
  },
  
  // Test accounts for different scenarios
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    isVerified: false,
    preferences: {
      categories: ['neuroscience'],
      emailNotifications: true,
      darkMode: false,
    },
    badges: [],
    followedTopics: [],
  },
];

async function seedUsers() {
  console.log('🌱 Starting user seeding process...');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');
    
    // Clear existing users (in development only)
    if (process.env['NODE_ENV'] !== 'production') {
      await User.deleteMany({});
      console.log('🗑️ Cleared existing users');
    }
    
    console.log(`📝 Creating ${testUsers.length} test users...`);
    
    // Create users with proper password hashing
    const createdUsers = [];
    for (const userData of testUsers) {
      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const user = new User({
          ...userData,
          password: hashedPassword,
        });
        
        const savedUser = await user.save();
        createdUsers.push(savedUser);
        
        console.log(`✅ Created ${userData.role}: ${userData.name} (${userData.email})`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`⚠️ User already exists: ${userData.email}`);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }
    
    console.log(`🎉 Successfully created ${createdUsers.length} users!`);
    
    // Display summary
    console.log('\n📊 User Summary:');
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    usersByRole.forEach(role => {
      console.log(`   - ${role._id}: ${role.count} users`);
    });
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   Admin: admin@neuronova.com / admin123');
    console.log('   Expert: sarah.chen@neuronova.com / expert123');
    console.log('   User: john.doe@example.com / user123');
    
  } catch (error) {
    console.error('❌ User seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
if (require.main === module) {
  seedUsers();
}

export default seedUsers; 
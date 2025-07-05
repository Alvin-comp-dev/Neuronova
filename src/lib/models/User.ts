import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { isMongoDBAvailable, connectMongoose } from '../mongodb';

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'expert' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  preferences: {
    categories: string[];
    emailNotifications: boolean;
    darkMode: boolean;
  };
  badges: string[];
  followedTopics: string[];
  stats?: {
    articlesRead: number;
    communitePosts: number;
    achievements: number;
    joinDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  matchPassword?: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'expert', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  preferences: {
    categories: [{
      type: String,
      enum: ['neuroscience', 'healthcare', 'biotech', 'ai', 'genetics', 'pharmaceuticals'],
    }],
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  badges: [{
    type: String,
    enum: ['early-adopter', 'researcher', 'contributor', 'expert', 'thought-leader'],
  }],
  followedTopics: [{
    type: String,
  }],
  stats: {
    articlesRead: { type: Number, default: 0 },
    communitePosts: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now },
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update lastActive on each query
userSchema.pre(/^find/, function (next) {
  // Fix: Use proper query update method
  this.set({ lastActive: new Date() });
  next();
});

// Create model
let UserModel: Model<IUser>;

try {
  UserModel = mongoose.model<IUser>('User');
} catch {
  UserModel = mongoose.model<IUser>('User', userSchema);
}

// Export the User model
export const User = UserModel;

// Mock users for development
const mockUsers: IUser[] = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    isVerified: true,
    preferences: {
      categories: ['neuroscience', 'healthcare'],
      emailNotifications: true,
      darkMode: true,
    },
    badges: ['early-adopter'],
    followedTopics: ['BCI', 'Neural Networks'],
    stats: {
      articlesRead: 45,
      communitePosts: 12,
      achievements: 8,
      joinDate: new Date('2024-01-15'),
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    lastActive: new Date(),
  } as unknown as IUser,
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@neuronova.com',
    role: 'expert',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    isVerified: true,
    preferences: {
      categories: ['neuroscience', 'ai'],
      emailNotifications: true,
      darkMode: true,
    },
    badges: ['expert', 'researcher', 'thought-leader'],
    followedTopics: ['Neural Interfaces', 'AI Healthcare'],
    stats: {
      articlesRead: 234,
      communitePosts: 67,
      achievements: 23,
      joinDate: new Date('2023-11-01'),
    },
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date(),
    lastActive: new Date(),
  } as unknown as IUser,
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    name: 'Admin User',
    email: 'admin@neuronova.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    isVerified: true,
    preferences: {
      categories: ['admin'],
      emailNotifications: true,
      darkMode: true,
    },
    badges: ['admin'],
    followedTopics: [],
    stats: {
      articlesRead: 156,
      communitePosts: 34,
      achievements: 15,
      joinDate: new Date('2023-10-01'),
    },
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date(),
    lastActive: new Date(),
  } as unknown as IUser,
];

// User model with fallback to mock data
export const UserService = {
  // Find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    // Try to connect to database first
    if (!isMongoDBAvailable()) {
      await connectMongoose();
    }
    
    if (isMongoDBAvailable()) {
      try {
        return await User.findOne({ email }).select('+password');
      } catch (error) {
        console.error('Database error, falling back to mock data:', error);
      }
    }
    
    return mockUsers.find(user => user.email === email) || null;
  },

  // Find user by ID
  async findById(id: string): Promise<IUser | null> {
    if (isMongoDBAvailable()) {
      try {
        return await User.findById(id);
      } catch (error) {
        console.error('Database error, falling back to mock data:', error);
      }
    }
    
    return mockUsers.find(user => user._id?.toString() === id) || null;
  },

  // Create new user
  async create(userData: Partial<IUser>): Promise<IUser> {
    if (isMongoDBAvailable()) {
      try {
        const user = new User(userData);
        return await user.save();
      } catch (error) {
        console.error('Database error, creating mock user:', error);
      }
    }
    
    // Create mock user
    const newUser: IUser = {
      _id: new mongoose.Types.ObjectId(),
      name: userData.name!,
      email: userData.email!,
      role: userData.role || 'user',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face`,
      isVerified: false,
      preferences: {
        categories: [],
        emailNotifications: true,
        darkMode: true,
      },
      badges: [],
      followedTopics: [],
      stats: {
        articlesRead: 0,
        communitePosts: 0,
        achievements: 0,
        joinDate: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActive: new Date(),
    } as unknown as IUser;
    
    mockUsers.push(newUser);
    return newUser;
  },

  // Update user
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    if (isMongoDBAvailable()) {
      try {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
      } catch (error) {
        console.error('Database error, updating mock user:', error);
      }
    }
    
    const userIndex = mockUsers.findIndex(user => user._id?.toString() === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updateData, updatedAt: new Date() } as IUser;
      return mockUsers[userIndex];
    }
    
    return null;
  },

  // Verify password
  async verifyPassword(user: IUser, password: string): Promise<boolean> {
    if (user.matchPassword) {
      return await user.matchPassword(password);
    }
    
    // For mock users, check against common test passwords
    const testPasswords = ['password123', 'admin123', 'expert123', 'user123'];
    return testPasswords.includes(password);
  },

  // Update last active
  async updateLastActive(id: string): Promise<void> {
    if (isMongoDBAvailable()) {
      try {
        await User.findByIdAndUpdate(id, { lastActive: new Date() });
        return;
      } catch (error) {
        console.error('Database error, updating mock user last active:', error);
      }
    }
    
    const userIndex = mockUsers.findIndex(user => user._id?.toString() === id);
    if (userIndex !== -1) {
      mockUsers[userIndex].lastActive = new Date();
    }
  },

  // Get all users (admin function)
  async findAll(limit: number = 50): Promise<IUser[]> {
    if (isMongoDBAvailable()) {
      try {
        return await User.find().limit(limit).sort({ createdAt: -1 });
      } catch (error) {
        console.error('Database error, returning mock users:', error);
      }
    }
    
    return mockUsers;
  },

  // Additional methods needed by frontend auth routes
  async updateById(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return this.update(id, updateData);
  },

  async setResetToken(email: string, resetToken: string, resetTokenExpiry: Date): Promise<void> {
    if (await isMongoDBAvailable()) {
      try {
        await User.findOneAndUpdate(
          { email },
          { 
            resetPasswordToken: resetToken,
            resetPasswordExpire: resetTokenExpiry
          }
        );
        return;
      } catch (error) {
        console.error('Database error, updating mock user reset token:', error);
      }
    }
    
    // Mock implementation
    const userIndex = mockUsers.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      mockUsers[userIndex].resetPasswordToken = resetToken;
      mockUsers[userIndex].resetPasswordExpire = resetTokenExpiry;
    }
  },

  async findByResetToken(token: string): Promise<IUser | null> {
    if (await isMongoDBAvailable()) {
      try {
        return await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpire: { $gt: Date.now() }
        });
      } catch (error) {
        console.error('Database error, checking mock users:', error);
      }
    }
    
    // Mock implementation
    return mockUsers.find(u => 
      u.resetPasswordToken === token && 
      u.resetPasswordExpire && 
      u.resetPasswordExpire > new Date()
    ) || null;
  },

  async updatePassword(id: string, newPassword: string): Promise<void> {
    if (await isMongoDBAvailable()) {
      try {
        const user = await User.findById(id);
        if (user) {
          user.password = newPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save();
        }
        return;
      } catch (error) {
        console.error('Database error, updating mock user password:', error);
      }
    }
    
    // Mock implementation
    const userIndex = mockUsers.findIndex(u => u._id?.toString() === id);
    if (userIndex !== -1) {
      // In a real implementation, this would be hashed
      mockUsers[userIndex].password = newPassword;
      mockUsers[userIndex].resetPasswordToken = undefined;
      mockUsers[userIndex].resetPasswordExpire = undefined;
    }
  },

  // Convert to public user (remove sensitive data)
  toPublicUser(user: IUser): Omit<IUser, 'password' | 'verificationToken' | 'resetPasswordToken'> {
    const { password, verificationToken, resetPasswordToken, ...publicUser } = user;
    return publicUser as Omit<IUser, 'password' | 'verificationToken' | 'resetPasswordToken'>;
  },
};

export default User; 
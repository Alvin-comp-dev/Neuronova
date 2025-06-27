import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'expert' | 'admin';
  isVerified: boolean;
  expertise?: string[];
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
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
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
  expertise: [{
    type: String,
    enum: ['neuroscience', 'healthcare', 'biotech', 'ai', 'genetics', 'pharmaceuticals', 'research-methods', 'data-analysis'],
  }],
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

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods['matchPassword'] = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this['password']);
};

// Update lastActive on each query
userSchema.pre(/^find/, function (next) {
  // Fix: Use proper query update method
  this.set({ lastActive: new Date() });
  next();
});

export default mongoose.model<IUser>('User', userSchema); 
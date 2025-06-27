import mongoose, { Schema, Document } from 'mongoose';

export interface IPublication {
  title: string;
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  coAuthors: string[];
  citationCount?: number;
}

export interface IAchievement {
  type: 'first_post' | 'helpful_contributor' | 'expert_verified' | 'research_cited' | 'community_leader' | 'peer_reviewer';
  title: string;
  description: string;
  earnedAt: Date;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface IResearchInterest {
  field: string;
  subfields: string[];
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface IActivityStats {
  postsCount: number;
  discussionsStarted: number;
  helpfulReactions: number;
  articlesBookmarked: number;
  searchesPerformed: number;
  loginStreak: number;
  lastActiveDate: Date;
  joinDate: Date;
}

export interface IUserProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  // Basic Profile Information
  displayName?: string;
  bio: string;
  location?: string;
  website?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  
  // Research & Academic Information
  researchInterests: IResearchInterest[];
  publications: IPublication[];
  currentInstitution?: string;
  position?: string;
  academicDegrees: string[];
  orcidId?: string;
  googleScholarUrl?: string;
  researchGateUrl?: string;
  
  // Social Features
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  
  // Expert Verification
  isVerifiedExpert: boolean;
  expertiseAreas: string[];
  verificationDate?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  verificationDocuments?: string[];
  
  // Privacy & Preferences
  profileVisibility: 'public' | 'followers' | 'private';
  emailNotifications: {
    newFollower: boolean;
    discussionReply: boolean;
    researchUpdate: boolean;
    weeklyDigest: boolean;
    expertMention: boolean;
  };
  
  // Activity & Engagement
  activityStats: IActivityStats;
  achievements: IAchievement[];
  reputationScore: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastProfileUpdate: Date;
}

const PublicationSchema = new Schema<IPublication>({
  title: { type: String, required: true, maxlength: 300 },
  journal: { type: String, maxlength: 200 },
  year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
  doi: { type: String, maxlength: 100 },
  url: { type: String, maxlength: 500 },
  coAuthors: [{ type: String, maxlength: 100 }],
  citationCount: { type: Number, default: 0, min: 0 }
});

const AchievementSchema = new Schema<IAchievement>({
  type: {
    type: String,
    enum: ['first_post', 'helpful_contributor', 'expert_verified', 'research_cited', 'community_leader', 'peer_reviewer'],
    required: true
  },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 300 },
  earnedAt: { type: Date, default: Date.now },
  icon: { type: String, required: true, maxlength: 50 },
  level: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  }
});

const ResearchInterestSchema = new Schema<IResearchInterest>({
  field: { type: String, required: true, maxlength: 100 },
  subfields: [{ type: String, maxlength: 100 }],
  proficiencyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  yearsOfExperience: { type: Number, min: 0, max: 50 }
});

const ActivityStatsSchema = new Schema<IActivityStats>({
  postsCount: { type: Number, default: 0, min: 0 },
  discussionsStarted: { type: Number, default: 0, min: 0 },
  helpfulReactions: { type: Number, default: 0, min: 0 },
  articlesBookmarked: { type: Number, default: 0, min: 0 },
  searchesPerformed: { type: Number, default: 0, min: 0 },
  loginStreak: { type: Number, default: 0, min: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  joinDate: { type: Date, default: Date.now }
});

const UserProfileSchema = new Schema<IUserProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Basic Profile Information
  displayName: { type: String, maxlength: 100 },
  bio: { type: String, maxlength: 1000, default: '' },
  location: { type: String, maxlength: 100 },
  website: { type: String, maxlength: 200 },
  profileImageUrl: { type: String, maxlength: 500 },
  bannerImageUrl: { type: String, maxlength: 500 },
  
  // Research & Academic Information
  researchInterests: [ResearchInterestSchema],
  publications: [PublicationSchema],
  currentInstitution: { type: String, maxlength: 200 },
  position: { type: String, maxlength: 100 },
  academicDegrees: [{ type: String, maxlength: 100 }],
  orcidId: { type: String, maxlength: 19 }, // ORCID format: 0000-0000-0000-0000
  googleScholarUrl: { type: String, maxlength: 500 },
  researchGateUrl: { type: String, maxlength: 500 },
  
  // Social Features
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
  // Expert Verification
  isVerifiedExpert: { type: Boolean, default: false },
  expertiseAreas: [{ type: String, maxlength: 100 }],
  verificationDate: { type: Date },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verificationDocuments: [{ type: String, maxlength: 500 }],
  
  // Privacy & Preferences
  profileVisibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  emailNotifications: {
    newFollower: { type: Boolean, default: true },
    discussionReply: { type: Boolean, default: true },
    researchUpdate: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: true },
    expertMention: { type: Boolean, default: true }
  },
  
  // Activity & Engagement
  activityStats: { type: ActivityStatsSchema, default: () => ({}) },
  achievements: [AchievementSchema],
  reputationScore: { type: Number, default: 0, min: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastProfileUpdate: { type: Date, default: Date.now }
});

// Indexes for performance
UserProfileSchema.index({ userId: 1 });
UserProfileSchema.index({ isVerifiedExpert: 1, reputationScore: -1 });
UserProfileSchema.index({ 'researchInterests.field': 1 });
UserProfileSchema.index({ following: 1 });
UserProfileSchema.index({ followers: 1 });
UserProfileSchema.index({ expertiseAreas: 1 });
UserProfileSchema.index({ 'activityStats.lastActiveDate': -1 });

// Middleware to update timestamps
UserProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified() && !this.isNew) {
    this.lastProfileUpdate = new Date();
  }
  next();
});

// Virtual for follower count
UserProfileSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

// Virtual for following count
UserProfileSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

// Virtual for profile completion percentage
UserProfileSchema.virtual('profileCompletionPercentage').get(function() {
  let completed = 0;
  let total = 10;
  
  if (this.displayName) completed++;
  if (this.bio && this.bio.length > 20) completed++;
  if (this.profileImageUrl) completed++;
  if (this.currentInstitution) completed++;
  if (this.position) completed++;
  if (this.researchInterests && this.researchInterests.length > 0) completed++;
  if (this.academicDegrees && this.academicDegrees.length > 0) completed++;
  if (this.publications && this.publications.length > 0) completed++;
  if (this.website || this.orcidId || this.googleScholarUrl) completed++;
  if (this.location) completed++;
  
  return Math.round((completed / total) * 100);
});

// Method to check if user can follow another user
UserProfileSchema.methods.canFollow = function(targetUserId: mongoose.Types.ObjectId) {
  return !this.following.includes(targetUserId) && 
         !this.blockedUsers.includes(targetUserId) &&
         !this.userId.equals(targetUserId);
};

// Method to add achievement
UserProfileSchema.methods.addAchievement = function(achievementData: Partial<IAchievement>) {
  const existingAchievement = this.achievements.find(a => a.type === achievementData.type);
  if (!existingAchievement) {
    this.achievements.push(achievementData as IAchievement);
    this.reputationScore += this.getAchievementPoints(achievementData.level || 'bronze');
  }
};

// Method to calculate reputation points for achievements
UserProfileSchema.methods.getAchievementPoints = function(level: string) {
  const points = { bronze: 10, silver: 25, gold: 50, platinum: 100 };
  return points[level as keyof typeof points] || 0;
};

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema); 
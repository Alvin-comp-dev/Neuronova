import mongoose, { Schema, Document } from 'mongoose';

export interface IReaction {
  userId: mongoose.Types.ObjectId;
  type: 'like' | 'love' | 'insightful' | 'disagree' | 'question';
  createdAt: Date;
}

export interface IPost {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId; // For threading (reply to post)
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  moderationStatus: 'approved' | 'pending' | 'flagged' | 'removed';
}

export interface IDiscussion extends Document {
  _id: mongoose.Types.ObjectId;
  articleId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  author: mongoose.Types.ObjectId;
  posts: IPost[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isExpertModerated: boolean;
  moderators: mongoose.Types.ObjectId[];
  isPinned: boolean;
  isLocked: boolean;
  lockedReason?: string;
  lockedBy?: mongoose.Types.ObjectId;
  lastActivity: Date;
  participantCount: number;
  totalPosts: number;
  views: number;
  category: 'general' | 'peer-review' | 'methodology' | 'results' | 'implications' | 'questions';
}

const ReactionSchema = new Schema<IReaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['like', 'love', 'insightful', 'disagree', 'question'],
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema<IPost>({
  content: { type: String, required: true, maxlength: 5000 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
  reactions: [ReactionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  moderationStatus: { 
    type: String, 
    enum: ['approved', 'pending', 'flagged', 'removed'],
    default: 'approved'
  }
});

const DiscussionSchema = new Schema<IDiscussion>({
  articleId: { type: Schema.Types.ObjectId, ref: 'Research', required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  posts: [PostSchema],
  tags: [{ type: String, maxlength: 50 }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isExpertModerated: { type: Boolean, default: false },
  moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  lockedReason: { type: String },
  lockedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastActivity: { type: Date, default: Date.now },
  participantCount: { type: Number, default: 1 },
  totalPosts: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['general', 'peer-review', 'methodology', 'results', 'implications', 'questions'],
    default: 'general'
  }
});

// Indexes for performance
DiscussionSchema.index({ articleId: 1, createdAt: -1 });
DiscussionSchema.index({ author: 1, createdAt: -1 });
DiscussionSchema.index({ tags: 1, lastActivity: -1 });
DiscussionSchema.index({ category: 1, isPinned: -1, lastActivity: -1 });
DiscussionSchema.index({ 'posts.author': 1 });

// Middleware to update timestamps and counts
DiscussionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  this.totalPosts = this.posts.length;
  
  // Update last activity when posts are added
  if (this.posts.length > 0) {
    this.lastActivity = new Date();
  }
  
  // Count unique participants
  const participants = new Set();
  participants.add(this.author.toString());
  this.posts.forEach(post => {
    if (!post.isDeleted) {
      participants.add(post.author.toString());
    }
  });
  this.participantCount = participants.size;
  
  next();
});

// Virtual for getting active posts (not deleted)
DiscussionSchema.virtual('activePosts').get(function() {
  return this.posts.filter(post => !post.isDeleted);
});

// Virtual for getting top-level posts (not replies)
DiscussionSchema.virtual('topLevelPosts').get(function() {
  return this.posts.filter(post => !post.isDeleted && !post.parentId);
});

export default mongoose.models.Discussion || mongoose.model<IDiscussion>('Discussion', DiscussionSchema); 
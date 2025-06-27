import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
  _id: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'announcement' | 'poll';
  category: string;
  tags: string[];
  author: {
    _id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    expertise: string[];
    verified: boolean;
  };
  replies: {
    _id: mongoose.Types.ObjectId;
    content: string;
    author: {
      _id: mongoose.Types.ObjectId;
      name: string;
      avatar?: string;
      expertise: string[];
      verified: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    likedBy: mongoose.Types.ObjectId[];
    isAcceptedAnswer?: boolean;
  }[];
  views: number;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  bookmarks: number;
  bookmarkedBy: mongoose.Types.ObjectId[];
  status: 'open' | 'closed' | 'solved' | 'pinned';
  isPinned: boolean;
  isFeatured: boolean;
  acceptedAnswer?: mongoose.Types.ObjectId;
  relatedResearch: mongoose.Types.ObjectId[];
  poll?: {
    question: string;
    options: {
      text: string;
      votes: number;
      voters: mongoose.Types.ObjectId[];
    }[];
    multipleChoice: boolean;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const discussionSchema = new Schema<IDiscussion>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: 'text',
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters'],
    index: 'text',
  },
  type: {
    type: String,
    enum: ['discussion', 'question', 'announcement', 'poll'],
    default: 'discussion',
    index: true,
  },
  category: {
    type: String,
    enum: [
      'general',
      'neuroscience',
      'healthcare',
      'biotech',
      'ai',
      'genetics',
      'pharmaceuticals',
      'career',
      'research-methods',
      'funding',
      'collaboration',
      'tools-resources',
    ],
    required: true,
    index: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true,
  }],
  author: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: String,
    expertise: [String],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  replies: [{
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    content: {
      type: String,
      required: true,
      maxlength: [5000, 'Reply cannot exceed 5000 characters'],
    },
    author: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: String,
      avatar: String,
      expertise: [String],
      verified: Boolean,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
  }],
  views: {
    type: Number,
    default: 0,
    index: true,
  },
  likes: {
    type: Number,
    default: 0,
    index: true,
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  bookmarks: {
    type: Number,
    default: 0,
  },
  bookmarkedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'solved', 'pinned'],
    default: 'open',
    index: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
    index: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  acceptedAnswer: {
    type: Schema.Types.ObjectId,
  },
  relatedResearch: [{
    type: Schema.Types.ObjectId,
    ref: 'Research',
  }],
  poll: {
    question: String,
    options: [{
      text: String,
      votes: {
        type: Number,
        default: 0,
      },
      voters: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
    }],
    multipleChoice: {
      type: Boolean,
      default: false,
    },
    endDate: Date,
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
discussionSchema.index({ title: 'text', content: 'text', tags: 'text' });
discussionSchema.index({ category: 1, createdAt: -1 });
discussionSchema.index({ type: 1, status: 1, createdAt: -1 });
discussionSchema.index({ views: -1 });
discussionSchema.index({ likes: -1 });
discussionSchema.index({ isPinned: -1, isFeatured: -1, createdAt: -1 });

// Virtual for reply count
discussionSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Static methods
discussionSchema.statics.findByCategory = function(category: string) {
  return this.find({ category }).sort({ isPinned: -1, createdAt: -1 });
};

discussionSchema.statics.findTrending = function(limit: number = 20) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.find({ 
    createdAt: { $gte: oneDayAgo },
    status: { $ne: 'closed' }
  })
    .sort({ views: -1, likes: -1, replyCount: -1 })
    .limit(limit);
};

discussionSchema.statics.search = function(query: string, options: any = {}) {
  const {
    categories = [],
    types = [],
    status = 'open',
    sortBy = 'relevance',
    limit = 20,
    skip = 0,
  } = options;

  let searchQuery: any = {
    $text: { $search: query },
  };

  if (categories.length > 0) {
    searchQuery.category = { $in: categories };
  }

  if (types.length > 0) {
    searchQuery.type = { $in: types };
  }

  if (status !== 'all') {
    searchQuery.status = status;
  }

  let sortOptions: any = {};
  switch (sortBy) {
    case 'date':
      sortOptions = { createdAt: -1 };
      break;
    case 'views':
      sortOptions = { views: -1 };
      break;
    case 'likes':
      sortOptions = { likes: -1 };
      break;
    case 'replies':
      sortOptions = { 'replies.length': -1 };
      break;
    default:
      sortOptions = { score: { $meta: 'textScore' }, createdAt: -1 };
  }

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
};

// Pre-save middleware to update reply timestamps
discussionSchema.pre('save', function(next) {
  if (this.isModified('replies')) {
    this.replies.forEach(reply => {
      if (!reply.createdAt) {
        reply.createdAt = new Date();
      }
      reply.updatedAt = new Date();
    });
  }
  next();
});

export default mongoose.model<IDiscussion>('Discussion', discussionSchema); 
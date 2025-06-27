import mongoose, { Document, Schema } from 'mongoose';

export interface IExpert extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  isVerified: boolean;
  verificationDate?: Date;
  expertise: {
    primary: string[];
    secondary: string[];
    keywords: string[];
  };
  credentials: {
    degrees: {
      degree: string;
      field: string;
      institution: string;
      year: number;
    }[];
    certifications: {
      name: string;
      issuer: string;
      year: number;
      url?: string;
    }[];
  };
  affiliations: {
    current: {
      institution: string;
      department?: string;
      position: string;
      startDate: Date;
      endDate?: Date;
      isPrimary: boolean;
    }[];
    previous: {
      institution: string;
      department?: string;
      position: string;
      startDate: Date;
      endDate: Date;
    }[];
  };
  research: {
    publications: mongoose.Types.ObjectId[];
    citationCount: number;
    hIndex: number;
    areas: string[];
    currentProjects: {
      title: string;
      description: string;
      status: 'planning' | 'active' | 'completed' | 'on-hold';
      startDate: Date;
      expectedEndDate?: Date;
      collaborators?: string[];
    }[];
  };
  achievements: {
    awards: {
      name: string;
      year: number;
      issuer: string;
      description?: string;
    }[];
    grants: {
      title: string;
      amount: number;
      currency: string;
      funder: string;
      year: number;
      status: 'awarded' | 'completed' | 'ongoing';
    }[];
  };
  engagement: {
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: number;
    answers: number;
    likes: number;
    views: number;
    reputation: number;
  };
  availability: {
    mentoring: boolean;
    collaboration: boolean;
    speaking: boolean;
    consulting: boolean;
    reviewing: boolean;
  };
  contact: {
    website?: string;
    linkedIn?: string;
    orcid?: string;
    googleScholar?: string;
    researchGate?: string;
    twitter?: string;
  };
  insights: {
    _id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    type: 'insight' | 'prediction' | 'analysis' | 'opinion';
    category: string;
    tags: string[];
    likes: number;
    views: number;
    createdAt: Date;
  }[];
  stats: {
    profileViews: number;
    monthlyViews: number;
    yearlyViews: number;
    engagementRate: number;
    responseRate: number;
    averageResponseTime: number;
  };
  preferences: {
    publicProfile: boolean;
    showEmail: boolean;
    showAffiliation: boolean;
    allowMessages: boolean;
    allowCollaboration: boolean;
    notificationSettings: {
      mentions: boolean;
      follows: boolean;
      messages: boolean;
      collaborationRequests: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const expertSchema = new Schema<IExpert>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true,
  },
  verificationDate: Date,
  expertise: {
    primary: [{
      type: String,
      enum: [
        'neuroscience',
        'healthcare',
        'biotech',
        'ai',
        'genetics',
        'pharmaceuticals',
        'medical-devices',
        'brain-computer-interface',
        'neuroimaging',
        'computational-neuroscience',
        'clinical-trials',
        'bioinformatics',
      ],
    }],
    secondary: [String],
    keywords: [{
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    }],
  },
  credentials: {
    degrees: [{
      degree: {
        type: String,
        required: true,
        enum: ['BS', 'BA', 'MS', 'MA', 'PhD', 'MD', 'PharmD', 'DVM', 'Other'],
      },
      field: {
        type: String,
        required: true,
      },
      institution: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
    }],
    certifications: [{
      name: String,
      issuer: String,
      year: Number,
      url: String,
    }],
  },
  affiliations: {
    current: [{
      institution: {
        type: String,
        required: true,
      },
      department: String,
      position: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: Date,
      isPrimary: {
        type: Boolean,
        default: false,
      },
    }],
    previous: [{
      institution: String,
      department: String,
      position: String,
      startDate: Date,
      endDate: Date,
    }],
  },
  research: {
    publications: [{
      type: Schema.Types.ObjectId,
      ref: 'Research',
    }],
    citationCount: {
      type: Number,
      default: 0,
      index: true,
    },
    hIndex: {
      type: Number,
      default: 0,
      index: true,
    },
    areas: [String],
    currentProjects: [{
      title: {
        type: String,
        required: true,
      },
      description: String,
      status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'on-hold'],
        default: 'planning',
      },
      startDate: Date,
      expectedEndDate: Date,
      collaborators: [String],
    }],
  },
  achievements: {
    awards: [{
      name: String,
      year: Number,
      issuer: String,
      description: String,
    }],
    grants: [{
      title: String,
      amount: Number,
      currency: {
        type: String,
        default: 'USD',
      },
      funder: String,
      year: Number,
      status: {
        type: String,
        enum: ['awarded', 'completed', 'ongoing'],
        default: 'awarded',
      },
    }],
  },
  engagement: {
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    posts: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    reputation: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  availability: {
    mentoring: {
      type: Boolean,
      default: false,
    },
    collaboration: {
      type: Boolean,
      default: false,
    },
    speaking: {
      type: Boolean,
      default: false,
    },
    consulting: {
      type: Boolean,
      default: false,
    },
    reviewing: {
      type: Boolean,
      default: false,
    },
  },
  contact: {
    website: String,
    linkedIn: String,
    orcid: String,
    googleScholar: String,
    researchGate: String,
    twitter: String,
  },
  insights: [{
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ['insight', 'prediction', 'analysis', 'opinion'],
      default: 'insight',
    },
    category: String,
    tags: [String],
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  stats: {
    profileViews: {
      type: Number,
      default: 0,
    },
    monthlyViews: {
      type: Number,
      default: 0,
    },
    yearlyViews: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
    responseRate: {
      type: Number,
      default: 0,
    },
    averageResponseTime: {
      type: Number,
      default: 24,
    },
  },
  preferences: {
    publicProfile: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    showAffiliation: {
      type: Boolean,
      default: true,
    },
    allowMessages: {
      type: Boolean,
      default: true,
    },
    allowCollaboration: {
      type: Boolean,
      default: false,
    },
    notificationSettings: {
      mentions: {
        type: Boolean,
        default: true,
      },
      follows: {
        type: Boolean,
        default: true,
      },
      messages: {
        type: Boolean,
        default: true,
      },
      collaborationRequests: {
        type: Boolean,
        default: true,
      },
    },
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
expertSchema.index({ 'expertise.primary': 1, isVerified: 1 });
expertSchema.index({ 'research.citationCount': -1 });
expertSchema.index({ 'engagement.reputation': -1 });
expertSchema.index({ 'expertise.keywords': 1 });
expertSchema.index({ 'affiliations.current.institution': 1 });

// Virtual properties
expertSchema.virtual('followerCount').get(function() {
  return this.engagement.followers.length;
});

expertSchema.virtual('followingCount').get(function() {
  return this.engagement.following.length;
});

expertSchema.virtual('totalInsights').get(function() {
  return this.insights.length;
});

// Static methods
expertSchema.statics.findByExpertise = function(expertise: string) {
  return this.find({ 
    'expertise.primary': expertise,
    isVerified: true,
    'preferences.publicProfile': true
  }).sort({ 'engagement.reputation': -1 });
};

expertSchema.statics.findTopExperts = function(limit: number = 20) {
  return this.find({ 
    isVerified: true,
    'preferences.publicProfile': true
  })
    .sort({ 'engagement.reputation': -1, 'research.citationCount': -1 })
    .limit(limit);
};

export default mongoose.model<IExpert>('Expert', expertSchema); 
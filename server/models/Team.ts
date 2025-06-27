import { Schema, model, Document, models } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  organization: Schema.Types.ObjectId;
  department?: Schema.Types.ObjectId;
  type: 'research_team' | 'project_group' | 'department' | 'lab' | 'working_group';
  visibility: 'public' | 'organization' | 'department' | 'private';
  leader: Schema.Types.ObjectId;
  members: [{
    user: Schema.Types.ObjectId;
    role: 'leader' | 'co_leader' | 'senior_researcher' | 'researcher' | 'student' | 'collaborator';
    permissions: string[];
    joinedAt: Date;
    invitedBy: Schema.Types.ObjectId;
  }];
  projects: [{
    id: Schema.Types.ObjectId;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
    startDate: Date;
    endDate?: Date;
    budget?: number;
    milestones: [{
      title: string;
      description: string;
      dueDate: Date;
      status: 'pending' | 'in_progress' | 'completed' | 'overdue';
      assignedTo: Schema.Types.ObjectId[];
      completedAt?: Date;
      completedBy?: Schema.Types.ObjectId;
    }];
    resources: [{
      type: 'document' | 'dataset' | 'code' | 'equipment' | 'publication';
      name: string;
      url?: string;
      description?: string;
      addedBy: Schema.Types.ObjectId;
      addedAt: Date;
    }];
  }];
  researchAreas: string[];
  tags: string[];
  sharedLibrary: {
    papers: Schema.Types.ObjectId[];
    datasets: Schema.Types.ObjectId[];
    notes: Schema.Types.ObjectId[];
    bookmarks: Schema.Types.ObjectId[];
  };
  collaboration: {
    allowInvites: boolean;
    requireApproval: boolean;
    externalCollaborators: boolean;
    maxMembers: number;
  };
  workspace: {
    channels: [{
      name: string;
      description: string;
      type: 'general' | 'research' | 'announcements' | 'social';
      isPrivate: boolean;
      members: Schema.Types.ObjectId[];
      lastActivity: Date;
    }];
    sharedFiles: [{
      name: string;
      type: string;
      size: number;
      url: string;
      uploadedBy: Schema.Types.ObjectId;
      uploadedAt: Date;
      permissions: {
        view: Schema.Types.ObjectId[];
        edit: Schema.Types.ObjectId[];
        admin: Schema.Types.ObjectId[];
      };
    }];
    integrations: {
      slack?: string;
      discord?: string;
      teams?: string;
      zoom?: string;
      calendar?: string;
    };
  };
  metrics: {
    totalMembers: number;
    activeMembers: number;
    totalProjects: number;
    completedProjects: number;
    publicationsCount: number;
    collaborationScore: number;
    lastActivity: Date;
  };
  settings: {
    notifications: {
      newMembers: boolean;
      projectUpdates: boolean;
      milestoneReminders: boolean;
      deadlineAlerts: boolean;
    };
    privacy: {
      memberList: 'public' | 'members' | 'leaders';
      projectList: 'public' | 'members' | 'leaders';
      activity: 'public' | 'members' | 'leaders';
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  type: { 
    type: String, 
    required: true,
    enum: ['research_team', 'project_group', 'department', 'lab', 'working_group']
  },
  visibility: { 
    type: String, 
    enum: ['public', 'organization', 'department', 'private'], 
    default: 'organization' 
  },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { 
      type: String, 
      enum: ['leader', 'co_leader', 'senior_researcher', 'researcher', 'student', 'collaborator'],
      default: 'researcher'
    },
    permissions: [{ type: String }],
    joinedAt: { type: Date, default: Date.now },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  projects: [{
    id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String },
    status: { 
      type: String, 
      enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'], 
      default: 'planning' 
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    budget: { type: Number },
    milestones: [{
      title: { type: String, required: true },
      description: { type: String },
      dueDate: { type: Date, required: true },
      status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed', 'overdue'], 
        default: 'pending' 
      },
      assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      completedAt: { type: Date },
      completedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    resources: [{
      type: { 
        type: String, 
        enum: ['document', 'dataset', 'code', 'equipment', 'publication'], 
        required: true 
      },
      name: { type: String, required: true },
      url: { type: String },
      description: { type: String },
      addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      addedAt: { type: Date, default: Date.now }
    }]
  }],
  researchAreas: [{ type: String }],
  tags: [{ type: String }],
  sharedLibrary: {
    papers: [{ type: Schema.Types.ObjectId, ref: 'Research' }],
    datasets: [{ type: Schema.Types.ObjectId }],
    notes: [{ type: Schema.Types.ObjectId }],
    bookmarks: [{ type: Schema.Types.ObjectId }]
  },
  collaboration: {
    allowInvites: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: true },
    externalCollaborators: { type: Boolean, default: false },
    maxMembers: { type: Number, default: 50 }
  },
  workspace: {
    channels: [{
      name: { type: String, required: true },
      description: { type: String },
      type: { 
        type: String, 
        enum: ['general', 'research', 'announcements', 'social'], 
        default: 'general' 
      },
      isPrivate: { type: Boolean, default: false },
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      lastActivity: { type: Date, default: Date.now }
    }],
    sharedFiles: [{
      name: { type: String, required: true },
      type: { type: String, required: true },
      size: { type: Number, required: true },
      url: { type: String, required: true },
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      uploadedAt: { type: Date, default: Date.now },
      permissions: {
        view: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        edit: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        admin: [{ type: Schema.Types.ObjectId, ref: 'User' }]
      }
    }],
    integrations: {
      slack: { type: String },
      discord: { type: String },
      teams: { type: String },
      zoom: { type: String },
      calendar: { type: String }
    }
  },
  metrics: {
    totalMembers: { type: Number, default: 0 },
    activeMembers: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    publicationsCount: { type: Number, default: 0 },
    collaborationScore: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  settings: {
    notifications: {
      newMembers: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      milestoneReminders: { type: Boolean, default: true },
      deadlineAlerts: { type: Boolean, default: true }
    },
    privacy: {
      memberList: { 
        type: String, 
        enum: ['public', 'members', 'leaders'], 
        default: 'members' 
      },
      projectList: { 
        type: String, 
        enum: ['public', 'members', 'leaders'], 
        default: 'members' 
      },
      activity: { 
        type: String, 
        enum: ['public', 'members', 'leaders'], 
        default: 'members' 
      }
    }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'teams'
});

// Indexes for performance
TeamSchema.index({ organization: 1 });
TeamSchema.index({ leader: 1 });
TeamSchema.index({ 'members.user': 1 });
TeamSchema.index({ type: 1, visibility: 1 });
TeamSchema.index({ researchAreas: 1 });
TeamSchema.index({ tags: 1 });
TeamSchema.index({ isActive: 1 });

export const Team = models.Team || model<ITeam>('Team', TeamSchema);
export default Team; 
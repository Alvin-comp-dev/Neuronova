import { Schema, model, Document, models } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  domain: string;
  type: 'university' | 'research_institute' | 'hospital' | 'corporation' | 'government' | 'non_profit';
  tier: 'basic' | 'professional' | 'enterprise' | 'academic';
  industry: string;
  country: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    primaryContact: {
      name: string;
      email: string;
      phone: string;
      title: string;
    };
    billingContact: {
      name: string;
      email: string;
      phone: string;
    };
    technicalContact: {
      name: string;
      email: string;
      phone: string;
    };
  };
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    customDomain?: string;
  };
  settings: {
    maxUsers: number;
    allowedDomains: string[];
    enforceSSO: boolean;
    require2FA: boolean;
    dataRetentionDays: number;
    allowExternalSharing: boolean;
    complianceLevel: 'standard' | 'hipaa' | 'gdpr' | 'sox';
  };
  subscription: {
    plan: string;
    status: 'active' | 'suspended' | 'trial' | 'cancelled';
    startDate: Date;
    endDate: Date;
    billingCycle: 'monthly' | 'yearly';
    seats: number;
    features: string[];
  };
  departments: [{
    name: string;
    code: string;
    description: string;
    head: Schema.Types.ObjectId;
    members: Schema.Types.ObjectId[];
    budget?: number;
    researchAreas: string[];
  }];
  analytics: {
    totalUsers: number;
    activeUsers: number;
    storageUsed: number;
    apiCalls: number;
    lastActivity: Date;
  };
  compliance: {
    gdprCompliant: boolean;
    hipaaCompliant: boolean;
    soc2Compliant: boolean;
    lastAudit: Date;
    certifications: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, trim: true },
  domain: { type: String, required: true, unique: true, lowercase: true },
  type: { 
    type: String, 
    required: true,
    enum: ['university', 'research_institute', 'hospital', 'corporation', 'government', 'non_profit']
  },
  tier: { 
    type: String, 
    required: true,
    enum: ['basic', 'professional', 'enterprise', 'academic'],
    default: 'basic'
  },
  industry: { type: String, required: true },
  country: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  contactInfo: {
    primaryContact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      title: { type: String, required: true }
    },
    billingContact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    technicalContact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    }
  },
  branding: {
    logo: { type: String, default: '' },
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#1E40AF' },
    customDomain: { type: String }
  },
  settings: {
    maxUsers: { type: Number, default: 100 },
    allowedDomains: [{ type: String }],
    enforceSSO: { type: Boolean, default: false },
    require2FA: { type: Boolean, default: false },
    dataRetentionDays: { type: Number, default: 365 },
    allowExternalSharing: { type: Boolean, default: true },
    complianceLevel: { 
      type: String, 
      enum: ['standard', 'hipaa', 'gdpr', 'sox'], 
      default: 'standard' 
    }
  },
  subscription: {
    plan: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['active', 'suspended', 'trial', 'cancelled'], 
      default: 'trial' 
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    seats: { type: Number, default: 10 },
    features: [{ type: String }]
  },
  departments: [{
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    head: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    budget: { type: Number },
    researchAreas: [{ type: String }]
  }],
  analytics: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    storageUsed: { type: Number, default: 0 },
    apiCalls: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  compliance: {
    gdprCompliant: { type: Boolean, default: false },
    hipaaCompliant: { type: Boolean, default: false },
    soc2Compliant: { type: Boolean, default: false },
    lastAudit: { type: Date },
    certifications: [{ type: String }]
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'organizations'
});

// Indexes for performance
OrganizationSchema.index({ domain: 1 });
OrganizationSchema.index({ type: 1, tier: 1 });
OrganizationSchema.index({ 'subscription.status': 1 });
OrganizationSchema.index({ country: 1 });
OrganizationSchema.index({ isActive: 1 });

export const Organization = models.Organization || model<IOrganization>('Organization', OrganizationSchema);
export default Organization; 
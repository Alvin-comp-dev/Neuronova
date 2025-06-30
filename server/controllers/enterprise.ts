import { Request, Response } from 'express';
import Organization from '../models/Organization';
import Team from '../models/Team';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// Utility function to verify admin/enterprise access
const verifyEnterpriseAccess = (req: Request): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication required');
  }
  
  const token = authHeader.substring(7);
  const user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
  
  if (!user.organizationId && user.role !== 'admin') {
    throw new Error('Enterprise access required');
  }
  
  return user;
};

// Organization Management
export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = verifyEnterpriseAccess(req);
    
    const {
      name,
      domain,
      type,
      tier,
      industry,
      country,
      address,
      contactInfo,
      branding,
      settings
    } = req.body;

    // Validate domain uniqueness
    const existingOrg = await Organization.findOne({ domain: domain.toLowerCase() });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        error: 'Organization domain already exists'
      });
    }

    const organization = new Organization({
      name,
      domain: domain.toLowerCase(),
      type,
      tier: tier || 'basic',
      industry,
      country,
      address,
      contactInfo,
      branding: {
        primaryColor: branding?.primaryColor || '#3B82F6',
        secondaryColor: branding?.secondaryColor || '#1E40AF',
        logo: branding?.logo || '',
        customDomain: branding?.customDomain
      },
      settings: {
        maxUsers: settings?.maxUsers || 100,
        allowedDomains: settings?.allowedDomains || [domain],
        enforceSSO: settings?.enforceSSO || false,
        require2FA: settings?.require2FA || false,
        dataRetentionDays: settings?.dataRetentionDays || 365,
        allowExternalSharing: settings?.allowExternalSharing !== false,
        complianceLevel: settings?.complianceLevel || 'standard'
      },
      subscription: {
        plan: tier || 'basic',
        status: 'trial',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
        billingCycle: 'monthly',
        seats: settings?.maxUsers || 10,
        features: getFeaturesByTier(tier || 'basic')
      }
    });

    await organization.save();

    res.status(201).json({
      success: true,
      data: organization,
      message: 'Organization created successfully'
    });

  } catch (error) {
    console.error('Create Organization Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create organization'
    });
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const user = verifyEnterpriseAccess(req);
    
    const { page = 1, limit = 20, type, tier, country, status } = req.query;
    
    const filter: any = {};
    if (type) filter.type = type;
    if (tier) filter.tier = tier;
    if (country) filter.country = country;
    if (status) filter['subscription.status'] = status;
    
    // Non-admin users can only see their own organization
    if (user.role !== 'admin') {
      filter._id = user.organizationId;
    }

    const organizations = await Organization.find(filter)
      .populate('departments.head', 'name email')
      .populate('departments.members', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Organization.countDocuments(filter);

    res.json({
      success: true,
      data: organizations,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: organizations.length
      }
    });

  } catch (error) {
    console.error('Get Organizations Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch organizations'
    });
  }
};

export const updateOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = verifyEnterpriseAccess(req);
    const { id } = req.params;
    const updates = req.body;

    // Verify user can update this organization
    if (user.role !== 'admin' && user.organizationId !== id) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to update this organization'
      });
    }

    const organization = await Organization.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.json({
      success: true,
      data: organization,
      message: 'Organization updated successfully'
    });

  } catch (error) {
    console.error('Update Organization Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update organization'
    });
  }
};

// Team Management
export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = verifyEnterpriseAccess(req);
    
    const {
      name,
      description,
      organization,
      department,
      type,
      visibility,
      researchAreas,
      tags
    } = req.body;

    // Verify user belongs to the organization
    if (user.organizationId !== organization && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Can only create teams within your organization'
      });
    }

    const team = new Team({
      name,
      description,
      organization,
      department,
      type: type || 'research_team',
      visibility: visibility || 'organization',
      leader: user.id,
      members: [{
        user: user.id,
        role: 'leader',
        permissions: ['all'],
        joinedAt: new Date(),
        invitedBy: user.id
      }],
      researchAreas: researchAreas || [],
      tags: tags || [],
      workspace: {
        channels: [{
          name: 'general',
          description: 'General team discussions',
          type: 'general',
          isPrivate: false,
          members: [user.id],
          lastActivity: new Date()
        }],
        sharedFiles: [],
        integrations: {}
      },
      collaboration: {
        allowInvites: true,
        requireApproval: true,
        externalCollaborators: false,
        maxMembers: 50
      },
      metrics: {
        totalMembers: 1,
        activeMembers: 1,
        totalProjects: 0,
        completedProjects: 0,
        publicationsCount: 0,
        collaborationScore: 0,
        lastActivity: new Date()
      }
    });

    await team.save();

    res.status(201).json({
      success: true,
      data: team,
      message: 'Team created successfully'
    });

  } catch (error) {
    console.error('Create Team Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create team'
    });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const user = verifyEnterpriseAccess(req);
    
    const { page = 1, limit = 20, organization, type, visibility } = req.query;
    
    const filter: any = {};
    
    // Filter by organization
    if (organization) {
      filter.organization = organization;
    } else if (user.organizationId) {
      filter.organization = user.organizationId;
    }
    
    if (type) filter.type = type;
    if (visibility) filter.visibility = visibility;
    
    // Filter based on user permissions
    if (user.role !== 'admin') {
      filter.$or = [
        { visibility: 'public' },
        { visibility: 'organization', organization: user.organizationId },
        { 'members.user': user.id },
        { leader: user.id }
      ];
    }

    const teams = await Team.find(filter)
      .populate('leader', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate('organization', 'name domain type')
      .sort({ 'metrics.lastActivity': -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Team.countDocuments(filter);

    res.json({
      success: true,
      data: teams,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: teams.length
      }
    });

  } catch (error) {
    console.error('Get Teams Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch teams'
    });
  }
};

export const joinTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = verifyEnterpriseAccess(req);
    const { teamId } = req.params;
    const { role = 'researcher' } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({
        success: false,
        error: 'Team not found'
      });
      return;
    }

    // Check if user is already a member
    const existingMember = team.members.find(member => 
      member.user.toString() === user.id
    );
    
    if (existingMember) {
      res.status(400).json({
        success: false,
        error: 'User is already a team member'
      });
      return;
    }

    // Check team capacity
    if (team.members.length >= team.collaboration.maxMembers) {
      res.status(400).json({
        success: false,
        error: 'Team has reached maximum capacity'
      });
      return;
    }

    // Add member to team
    team.members.push({
      user: user.id,
      role,
      permissions: getPermissionsByRole(role),
      joinedAt: new Date(),
      invitedBy: user.id
    });

    // Update metrics
    team.metrics.totalMembers = team.members.length;
    team.metrics.activeMembers += 1;
    team.metrics.lastActivity = new Date();

    await team.save();

    res.json({
      success: true,
      data: team,
      message: 'Successfully joined team'
    });

  } catch (error) {
    console.error('Join Team Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to join team'
    });
  }
};

// Utility functions
const getFeaturesByTier = (tier: string): string[] => {
  const features = {
    basic: ['basic_analytics', 'team_collaboration', 'file_sharing'],
    professional: ['advanced_analytics', 'unlimited_teams', 'api_access', 'priority_support'],
    enterprise: ['custom_branding', 'sso', 'advanced_security', 'dedicated_support', 'compliance_tools'],
    academic: ['research_tools', 'publication_tracking', 'grant_management', 'academic_discount']
  };
  
  return features[tier as keyof typeof features] || features.basic;
};

const getPermissionsByRole = (role: string): string[] => {
  const permissions = {
    leader: ['all'],
    co_leader: ['manage_projects', 'invite_members', 'edit_team', 'view_analytics'],
    senior_researcher: ['create_projects', 'edit_projects', 'invite_collaborators', 'view_team'],
    researcher: ['view_projects', 'comment', 'upload_files', 'view_team'],
    student: ['view_projects', 'comment', 'view_team'],
    collaborator: ['view_projects', 'comment']
  };
  
  return permissions[role as keyof typeof permissions] || permissions.collaborator;
}; 
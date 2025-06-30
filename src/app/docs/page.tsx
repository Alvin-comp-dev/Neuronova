'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import { 
  BookOpen, 
  Code, 
  Database, 
  Lock,
  Settings,
  Users,
  Search,
  MessageSquare,
  Bell,
  FileText,
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function DocumentationPage() {
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: BookOpen
    },
    {
      id: 'api-reference',
      name: 'API Reference',
      icon: Code
    },
    {
      id: 'data-management',
      name: 'Data Management',
      icon: Database
    },
    {
      id: 'security',
      name: 'Security',
      icon: Lock
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: Settings
    }
  ];

  const documentation = {
    'getting-started': {
      title: 'Getting Started',
      description: 'Essential guides to begin using Neuronova',
      sections: [
        {
          title: 'Quick Start Guide',
          content: `
### Welcome to Neuronova

Neuronova is a comprehensive platform for discovering and sharing breakthrough research in neuroscience and healthcare. This guide will help you get started with the platform's core features.

### 1. Account Setup

1. Create an account using your email or institutional credentials
2. Complete your profile with professional information
3. Set up your research interests and preferences
4. Configure notification settings

### 2. Basic Navigation

- **Research Feed**: Your personalized feed of latest research
- **Trending**: Most impactful recent breakthroughs
- **Experts**: Connect with leading researchers
- **Community**: Participate in discussions

### 3. First Steps

1. Follow at least 5 experts in your field
2. Save interesting articles to your library
3. Join relevant research communities
4. Set up custom search alerts
`
        },
        {
          title: 'Platform Features',
          content: `
### Core Features

1. **Research Discovery**
   - Advanced semantic search
   - Personalized recommendations
   - Citation tracking
   - Impact metrics

2. **Collaboration Tools**
   - Discussion threads
   - Expert connections
   - Research groups
   - Direct messaging

3. **Content Management**
   - Personal library
   - Reading lists
   - Notes and annotations
   - Citation export

4. **Analytics**
   - Research trends
   - Field metrics
   - Personal impact tracking
   - Community insights
`
        }
      ]
    },
    'api-reference': {
      title: 'API Reference',
      description: 'Complete documentation of the Neuronova API',
      sections: [
        {
          title: 'Authentication',
          content: `
### Authentication

All API requests must be authenticated using JWT tokens.

\`\`\`typescript
// Example API authentication
const response = await fetch('/api/research', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});
\`\`\`

### Endpoints

#### Research API

\`\`\`typescript
GET /api/research
GET /api/research/:id
POST /api/research
PUT /api/research/:id
DELETE /api/research/:id
\`\`\`

#### User API

\`\`\`typescript
GET /api/users/me
PUT /api/users/profile
POST /api/users/preferences
\`\`\`
`
        },
        {
          title: 'Rate Limits',
          content: `
### Rate Limiting

The API implements rate limiting to ensure fair usage:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- 1000 requests per day per API key

### Error Handling

\`\`\`typescript
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded",
    "details": {
      "reset_at": "2024-02-20T15:00:00Z",
      "limit": 100,
      "remaining": 0
    }
  }
}
\`\`\`
`
        }
      ]
    },
    'data-management': {
      title: 'Data Management',
      description: 'Guidelines for managing research data',
      sections: [
        {
          title: 'Data Models',
          content: `
### Research Article Schema

\`\`\`typescript
interface ResearchArticle {
  id: string;
  title: string;
  authors: Author[];
  abstract: string;
  content: string;
  publicationDate: Date;
  categories: string[];
  tags: string[];
  metrics: {
    views: number;
    citations: number;
    impact: number;
  };
}
\`\`\`

### User Profile Schema

\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  expertise: string[];
  publications: string[];
  metrics: {
    followers: number;
    publications: number;
    citations: number;
  };
}
\`\`\`
`
        },
        {
          title: 'Data Security',
          content: `
### Data Protection

1. All data is encrypted at rest using AES-256
2. Personal information is stored separately
3. Regular security audits are performed
4. Compliance with GDPR and CCPA

### Backup Policy

- Automated daily backups
- 30-day retention period
- Point-in-time recovery
- Geographic redundancy
`
        }
      ]
    },
    'security': {
      title: 'Security',
      description: 'Security features and best practices',
      sections: [
        {
          title: 'Security Features',
          content: `
### Authentication Methods

1. **Email/Password**
   - Strong password requirements
   - Password history enforcement
   - Brute force protection

2. **OAuth Providers**
   - Google
   - Microsoft
   - ORCID
   - Institution SSO

3. **Two-Factor Authentication**
   - TOTP (Google Authenticator)
   - SMS backup
   - Recovery codes

### Session Management

- Secure session handling
- Automatic timeout
- Device tracking
- Concurrent session limits
`
        },
        {
          title: 'Privacy Controls',
          content: `
### Privacy Settings

1. **Profile Privacy**
   - Public/Private profile
   - Selective information sharing
   - Activity visibility

2. **Data Usage**
   - Usage tracking options
   - Analytics preferences
   - Marketing communications

3. **Export & Deletion**
   - Data export formats
   - Account deletion process
   - Data retention policy
`
        }
      ]
    },
    'integrations': {
      title: 'Integrations',
      description: 'Available integrations and setup guides',
      sections: [
        {
          title: 'Available Integrations',
          content: `
### Citation Management

- Zotero
- Mendeley
- EndNote
- RefWorks

### Academic Databases

- PubMed
- Web of Science
- Scopus
- Google Scholar

### Institutional

- University repositories
- Library systems
- Learning management systems
`
        },
        {
          title: 'Integration Setup',
          content: `
### Setup Process

1. **API Key Generation**
   - Navigate to Settings > Integrations
   - Generate new API key
   - Set permissions and scope

2. **Configuration**
   - Add API endpoint
   - Configure authentication
   - Test connection
   - Monitor usage

3. **Maintenance**
   - Regular key rotation
   - Usage monitoring
   - Error tracking
   - Updates handling
`
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/help"
              className="flex items-center text-blue-100 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Help Center
            </Link>
          </div>
          <div className="mt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Documentation
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl">
              Comprehensive guides and technical documentation for Neuronova platform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <category.icon className="h-5 w-5 mr-3" />
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold text-white mb-2">
                {documentation[selectedCategory].title}
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                {documentation[selectedCategory].description}
              </p>

              {documentation[selectedCategory].sections.map((section, index) => (
                <div key={index} className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {section.title}
                  </h3>
                  <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: marked(section.content) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
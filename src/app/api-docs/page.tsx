'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  example: {
    request?: string;
    response: string;
  };
  headers?: {
    name: string;
    value: string;
    description: string;
  }[];
}

const API_ENDPOINTS: { [category: string]: APIEndpoint[] } = {
  Authentication: [
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate user and receive access token',
      parameters: [
        { name: 'email', type: 'string', required: true, description: 'User email address' },
        { name: 'password', type: 'string', required: true, description: 'User password' }
      ],
      example: {
        request: JSON.stringify({ email: "user@example.com", password: "password123" }, null, 2),
        response: JSON.stringify({
          success: true,
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: { id: "12345", email: "user@example.com", name: "John Doe" }
        }, null, 2)
      }
    },
    {
      method: 'POST',
      path: '/api/auth/register',
      description: 'Create new user account',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'User full name' },
        { name: 'email', type: 'string', required: true, description: 'User email address' },
        { name: 'password', type: 'string', required: true, description: 'User password (min 8 characters)' }
      ],
      example: {
        request: JSON.stringify({
          name: "John Doe",
          email: "user@example.com",
          password: "password123"
        }, null, 2),
        response: JSON.stringify({
          success: true,
          message: "Account created successfully",
          user: { id: "12345", email: "user@example.com", name: "John Doe" }
        }, null, 2)
      }
    }
  ],
  Research: [
    {
      method: 'GET',
      path: '/api/research',
      description: 'Get research articles with optional filtering',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of results (default: 20, max: 100)' },
        { name: 'offset', type: 'number', required: false, description: 'Number of results to skip (default: 0)' },
        { name: 'sortBy', type: 'string', required: false, description: 'Sort by: date, relevance, citations, trending' },
        { name: 'category', type: 'string', required: false, description: 'Filter by category' },
        { name: 'author', type: 'string', required: false, description: 'Filter by author name' }
      ],
      example: {
        response: JSON.stringify({
          success: true,
          articles: [
            {
              id: "67890",
              title: "Advances in Neural Network Architecture",
              authors: ["Dr. Jane Smith", "Dr. John Doe"],
              abstract: "This paper explores novel approaches to neural network design...",
              published_date: "2024-01-15",
              category: "Artificial Intelligence",
              citations: 45,
              doi: "10.1000/182"
            }
          ],
          total: 150,
          pagination: { limit: 20, offset: 0, hasNext: true }
        }, null, 2)
      }
    },
    {
      method: 'GET',
      path: '/api/research/{id}',
      description: 'Get detailed information about a specific research article',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Research article ID' }
      ],
      example: {
        response: JSON.stringify({
          success: true,
          article: {
            id: "67890",
            title: "Advances in Neural Network Architecture",
            authors: ["Dr. Jane Smith", "Dr. John Doe"],
            abstract: "This paper explores novel approaches to neural network design...",
            full_text: "Full paper content...",
            published_date: "2024-01-15",
            category: "Artificial Intelligence",
            keywords: ["neural networks", "deep learning", "AI"],
            citations: 45,
            doi: "10.1000/182",
            external_links: ["https://arxiv.org/abs/2401.12345"],
            related_articles: ["67891", "67892"]
          }
        }, null, 2)
      }
    }
  ],
  Search: [
    {
      method: 'GET',
      path: '/api/search',
      description: 'Search across research articles and expert content',
      parameters: [
        { name: 'q', type: 'string', required: true, description: 'Search query' },
        { name: 'type', type: 'string', required: false, description: 'Content type: articles, experts, all' },
        { name: 'limit', type: 'number', required: false, description: 'Number of results (default: 20)' },
        { name: 'filters', type: 'object', required: false, description: 'Additional filters (date, category, etc.)' }
      ],
      example: {
        response: JSON.stringify({
          success: true,
          results: {
            articles: [
              {
                id: "67890",
                title: "Machine Learning in Healthcare",
                relevance_score: 0.95,
                highlight: "...applications of <em>machine learning</em> in medical diagnosis..."
              }
            ],
            experts: [
              {
                id: "expert123",
                name: "Dr. Sarah Wilson",
                expertise: ["Machine Learning", "Healthcare AI"],
                institution: "MIT"
              }
            ]
          },
          total: 45,
          query_time: "0.12s"
        }, null, 2)
      }
    },
    {
      method: 'POST',
      path: '/api/search/external',
      description: 'Search external research databases and get comprehensive insights',
      headers: [
        { name: 'Authorization', value: 'Bearer {token}', description: 'Required for authenticated requests' }
      ],
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Research topic or keywords' },
        { name: 'sources', type: 'string[]', required: false, description: 'Specific sources to search (arxiv, pubmed, etc.)' },
        { name: 'max_results', type: 'number', required: false, description: 'Maximum results per source (default: 10)' }
      ],
      example: {
        request: JSON.stringify({
          query: "quantum computing algorithms",
          sources: ["arxiv", "semantic_scholar"],
          max_results: 5
        }, null, 2),
        response: JSON.stringify({
          success: true,
          insights: {
            papers: [
              {
                title: "Quantum Algorithm Design Patterns",
                authors: ["Alice Quantum", "Bob Entangle"],
                source: "arXiv",
                url: "https://arxiv.org/abs/2401.12345",
                abstract: "This paper presents novel design patterns...",
                citation_count: 23
              }
            ],
            related_topics: ["quantum supremacy", "quantum error correction"],
            key_authors: ["Peter Shor", "Lov Grover"],
            trending_papers: [],
            expert_content: []
          },
          sources_searched: ["arxiv", "semantic_scholar"],
          total_results: 127
        }, null, 2)
      }
    }
  ],
  System: [
    {
      method: 'GET',
      path: '/api/health',
      description: 'Check API health and status',
      example: {
        response: JSON.stringify({
          status: "healthy",
          timestamp: "2024-01-20T10:30:00Z",
          version: "1.0.0",
          services: {
            database: "connected",
            external_apis: "operational",
            search_index: "ready"
          }
        }, null, 2)
      }
    },
    {
      method: 'GET',
      path: '/api/system/status',
      description: 'Get detailed system status and metrics',
      headers: [
        { name: 'Authorization', value: 'Bearer {admin_token}', description: 'Admin access required' }
      ],
      example: {
        response: JSON.stringify({
          uptime: "99.97%",
          response_time: "45ms",
          active_users: 1247,
          api_calls_today: 45893,
          error_rate: "0.02%",
          database_connections: 12,
          cache_hit_rate: "94.5%"
        }, null, 2)
      }
    }
  ]
};

function EndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedRequest, setCopiedRequest] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const copyToClipboard = (text: string, type: 'request' | 'response') => {
    navigator.clipboard.writeText(text);
    if (type === 'request') {
      setCopiedRequest(true);
      setTimeout(() => setCopiedRequest(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-600';
      case 'POST': return 'bg-blue-600';
      case 'PUT': return 'bg-orange-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-750 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded text-white text-sm font-medium ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <code className="text-blue-400 font-mono">{endpoint.path}</code>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <p className="text-slate-300 mb-4">{endpoint.description}</p>

          {/* Headers */}
          {endpoint.headers && (
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2">Headers</h4>
              <div className="bg-slate-900 rounded-lg p-4">
                {endpoint.headers.map((header, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <code className="text-blue-400">{header.name}</code>
                    <span className="text-slate-400 mx-2">:</span>
                    <code className="text-green-400">{header.value}</code>
                    <p className="text-slate-400 text-sm mt-1">{header.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parameters */}
          {endpoint.parameters && (
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2">Parameters</h4>
              <div className="bg-slate-900 rounded-lg p-4">
                {endpoint.parameters.map((param, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex items-center space-x-2">
                      <code className="text-blue-400">{param.name}</code>
                      <span className="text-slate-500">({param.type})</span>
                      {param.required && (
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">required</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{param.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="space-y-4">
            {endpoint.example.request && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Request Example</h4>
                  <button
                    onClick={() => copyToClipboard(endpoint.example.request!, 'request')}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                    <span className="text-sm">{copiedRequest ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{endpoint.example.request}</code>
                  </pre>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Response Example</h4>
                <button
                  onClick={() => copyToClipboard(endpoint.example.response, 'response')}
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  <span className="text-sm">{copiedResponse ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-blue-400 text-sm">
                  <code>{endpoint.example.response}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function APIDocsPage() {
  const [activeSection, setActiveSection] = useState('Authentication');

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Complete reference for the NeuroNova API. Build powerful research discovery applications 
            with our comprehensive endpoints and real-time data access.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-slate-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Base URL</h3>
              <div className="bg-slate-900 rounded-lg p-4">
                <code className="text-blue-400">https://api.neuronova.com/v1</code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Authentication</h3>
              <div className="bg-slate-900 rounded-lg p-4">
                <code className="text-green-400">Authorization: Bearer YOUR_TOKEN</code>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Rate Limits</h3>
            <ul className="text-slate-300 space-y-1">
              <li>• Free tier: 100 requests/hour</li>
              <li>• Pro tier: 1,000 requests/hour</li>
              <li>• Enterprise: Custom limits</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Endpoints</h3>
              <nav className="space-y-2">
                {Object.keys(API_ENDPOINTS).map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </nav>

              <div className="mt-8">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  SDKs & Libraries
                </h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-blue-400 hover:text-blue-300">JavaScript SDK</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">Python SDK</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">REST API</a>
                  <a href="#" className="block text-blue-400 hover:text-blue-300">GraphQL</a>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">{activeSection}</h2>
              <div className="space-y-4">
                {API_ENDPOINTS[activeSection]?.map((endpoint, index) => (
                  <EndpointCard key={index} endpoint={endpoint} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Codes */}
        <div className="mt-16 bg-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Error Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <code className="text-red-400 font-semibold">400 Bad Request</code>
                <p className="text-slate-300 text-sm mt-1">Invalid request parameters or malformed JSON</p>
              </div>
              <div>
                <code className="text-red-400 font-semibold">401 Unauthorized</code>
                <p className="text-slate-300 text-sm mt-1">Missing or invalid authentication token</p>
              </div>
              <div>
                <code className="text-red-400 font-semibold">403 Forbidden</code>
                <p className="text-slate-300 text-sm mt-1">Insufficient permissions for the requested resource</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <code className="text-red-400 font-semibold">404 Not Found</code>
                <p className="text-slate-300 text-sm mt-1">The requested resource does not exist</p>
              </div>
              <div>
                <code className="text-red-400 font-semibold">429 Too Many Requests</code>
                <p className="text-slate-300 text-sm mt-1">Rate limit exceeded, please slow down</p>
              </div>
              <div>
                <code className="text-red-400 font-semibold">500 Internal Server Error</code>
                <p className="text-slate-300 text-sm mt-1">Unexpected server error, please try again</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
          <p className="text-slate-400 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
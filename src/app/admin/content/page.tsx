'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Flag,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'research' | 'comment' | 'discussion';
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  flagReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export default function ContentModeration() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      // Mock data for demonstration
      setContent([
        {
          id: '1',
          title: 'Novel Approach to Quantum Computing',
          type: 'research',
          author: 'Dr. Sarah Johnson',
          content: 'This research paper explores a novel approach to quantum computing using...',
          status: 'pending',
          flagReason: 'Potential copyright issues',
          submittedAt: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          title: 'Discussion on AI Ethics',
          type: 'discussion',
          author: 'John Smith',
          content: 'I believe we need to consider the ethical implications of AI development...',
          status: 'approved',
          submittedAt: '2024-01-19T15:45:00Z',
          reviewedAt: '2024-01-19T16:00:00Z',
          reviewedBy: 'Admin User'
        },
        {
          id: '3',
          title: 'Comment on Machine Learning Paper',
          type: 'comment',
          author: 'Dr. Michael Chen',
          content: 'This paper has some interesting insights, but I disagree with the methodology...',
          status: 'pending',
          flagReason: 'Inappropriate language',
          submittedAt: '2024-01-18T09:15:00Z'
        },
        {
          id: '4',
          title: 'Climate Change Research Data',
          type: 'research',
          author: 'Dr. Emily Davis',
          content: 'Our latest research on climate change patterns shows significant...',
          status: 'rejected',
          flagReason: 'Insufficient peer review',
          submittedAt: '2024-01-17T14:20:00Z',
          reviewedAt: '2024-01-17T16:30:00Z',
          reviewedBy: 'Admin User'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    try {
      // In a real implementation, this would make API calls
      console.log(`${action} items:`, selectedItems);
      setSelectedItems([]);
      // Refresh content
      fetchContent();
    } catch (error) {
      console.error(`Failed to ${action} content:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'discussion': return 'bg-purple-100 text-purple-800';
      case 'comment': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Review and moderate user-generated content
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {content.filter(item => item.status === 'pending').length} pending
                </span>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Flag className="w-4 h-4 mr-2" />
                  Review Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="research">Research</option>
                  <option value="discussion">Discussion</option>
                  <option value="comment">Comment</option>
                </select>
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-lg p-4">
                <span className="text-sm text-blue-700">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleBulkAction('approve')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Approve
                  </button>
                  <button 
                    onClick={() => handleBulkAction('reject')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                onChange={handleSelectAll}
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Select all ({filteredContent.length} items)
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredContent.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">{item.author}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {item.content}
                    </p>
                    
                    {item.flagReason && (
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <Flag className="w-4 h-4 mr-1" />
                        <span>Flagged: {item.flagReason}</span>
                      </div>
                    )}
                    
                    {item.reviewedAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Reviewed by {item.reviewedBy} on {new Date(item.reviewedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-5 h-5" />
                    </button>
                    {item.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-900">
                          <Check className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
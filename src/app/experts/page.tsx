'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  ExternalLink,
  MapPin,
  Users,
  Star,
  CheckCircle,
  Filter,
  Search,
  Eye,
  ThumbsUp,
  Share2,
  Building,
  Mail,
  Quote,
  X,
  Plus
} from 'lucide-react';

interface Expert {
  _id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    bio: string;
    specialization: string;
    institution: string;
    location: string;
    expertise: string[];
    publications?: number;
    citations?: number;
    hIndex?: number;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      orcid?: string;
      github?: string;
    };
  };
}

interface Insight {
  _id: string;
  title: string;
  content: string;
  author: Expert;
  category: string;
  tags: string[];
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  type: 'analysis' | 'prediction' | 'commentary' | 'review';
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'experts' | 'insights'>('experts');
  const [loading, setLoading] = useState(true);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [showBecomeExpertModal, setShowBecomeExpertModal] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    specialization: '',
    institution: '',
    location: '',
    bio: '',
    expertise: '',
    publications: '',
    citations: '',
    hIndex: '',
    linkedin: '',
    twitter: '',
    orcid: ''
  });

  // Mock expert data
  const mockExperts: Expert[] = [
    {
      _id: '1',
      name: 'Dr. Elena Vasquez',
      email: 'elena.vasquez@stanford.edu',
      role: 'expert',
      profile: {
        bio: 'Professor of Neuroscience at Stanford University, specializing in brain-computer interfaces and neural signal processing.',
        specialization: 'Brain-Computer Interfaces',
        institution: 'Stanford University',
        location: 'Palo Alto, CA',
        expertise: ['brain-computer-interfaces', 'neural-signal-processing', 'motor-cortex'],
        publications: 127,
        citations: 8934,
        hIndex: 42,
        socialLinks: {
          linkedin: 'https://linkedin.com/in/elena-vasquez-phd',
          twitter: 'https://twitter.com/elenavasquezphd'
        }
      }
    }
  ];

  // Mock insights data
  const mockInsights: Insight[] = [
    {
      _id: '1',
      title: 'The Future of Brain-Computer Interfaces: Beyond Motor Control',
      content: 'Recent advances in BCI technology are opening new possibilities beyond traditional motor control applications. We\'re seeing promising developments in cognitive enhancement, memory restoration, and even direct brain-to-brain communication...',
      author: mockExperts[0],
      category: 'Neurotech',
      tags: ['BCI', 'Future Tech', 'Neural Enhancement'],
      createdAt: '2024-06-15T14:30:00Z',
      views: 2340,
      likes: 89,
      comments: 23,
      featured: true,
      type: 'analysis'
    },
    {
      _id: '2',
      title: 'CRISPR 3.0: Why 99.7% Accuracy Changes Everything',
      content: 'The recent breakthrough in CRISPR precision isn\'t just an incremental improvement - it represents a fundamental shift in what\'s possible with gene editing. Here\'s why this matters for patients with genetic diseases...',
      author: mockExperts[0],
      category: 'Gene Therapy',
      tags: ['CRISPR', 'Gene Editing', 'Precision Medicine'],
      createdAt: '2024-06-14T09:15:00Z',
      views: 1890,
      likes: 67,
      comments: 31,
      featured: true,
      type: 'analysis'
    },
    {
      _id: '3',
      title: 'AI Diagnostic Accuracy: The 94% Threshold and What It Means',
      content: 'Achieving 94% accuracy in early Alzheimer\'s detection through retinal scans represents a critical milestone. This analysis explores the implications for healthcare systems and patient outcomes...',
      author: mockExperts[0],
      category: 'AI in Healthcare',
      tags: ['AI', 'Diagnostics', 'Healthcare Impact'],
      createdAt: '2024-06-13T16:45:00Z',
      views: 3100,
      likes: 124,
      comments: 45,
      featured: false,
      type: 'commentary'
    }
  ];

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    filterExperts();
  }, [experts, searchQuery, selectedSpecialization]);

  const fetchExperts = async () => {
    try {
      const response = await fetch('/api/experts');
      const data = await response.json();
      
      if (data.success) {
        setExperts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
      // Use mock data as fallback
      setExperts(mockExperts);
    } finally {
      setLoading(false);
    }
  };

  const filterExperts = () => {
    let filtered = experts;

    if (searchQuery) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.profile.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.profile.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.profile.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(expert =>
        expert.profile.expertise.some(exp => 
          exp.toLowerCase().includes(selectedSpecialization.toLowerCase())
        )
      );
    }

    setFilteredExperts(filtered);
  };

  const specializations = [
    'Brain-Computer Interfaces',
    'Optogenetics',
    'AI in Healthcare',
    'Federated Learning',
    'Gene Editing',
    'CRISPR',
    'Neural Signal Processing',
    'Clinical Decision Support'
  ];

  const handleBecomeExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationLoading(true);
    
    try {
      // Get the authentication token from localStorage or cookies
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('/api/experts/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(applicationForm),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Application submitted successfully! We will review your application and get back to you soon.');
        setShowBecomeExpertModal(false);
        setApplicationForm({
          specialization: '',
          institution: '',
          location: '',
          bio: '',
          expertise: '',
          publications: '',
          citations: '',
          hIndex: '',
          linkedin: '',
          twitter: '',
          orcid: ''
        });
      } else {
        alert('Error submitting application: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setApplicationLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setApplicationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-slate-700 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-slate-700 rounded w-16"></div>
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Research Experts
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            Connect with leading researchers and experts in neuroscience, AI in healthcare, 
            genetics, and cutting-edge medical technologies.
          </p>
          <button
            onClick={() => setShowBecomeExpertModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Become an Expert
          </button>
        </div>

        {/* Become Expert Modal */}
        {showBecomeExpertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Become an Expert</h2>
                  <button
                    onClick={() => setShowBecomeExpertModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleBecomeExpert} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Specialization *
                      </label>
                      <select
                        required
                        value={applicationForm.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicationForm.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        placeholder="Your institution"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationForm.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Bio *
                    </label>
                    <textarea
                      required
                      value={applicationForm.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about your research and expertise..."
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Areas of Expertise *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationForm.expertise}
                      onChange={(e) => handleInputChange('expertise', e.target.value)}
                      placeholder="e.g., brain-computer-interfaces, neural-signal-processing, motor-cortex"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Publications
                      </label>
                      <input
                        type="number"
                        value={applicationForm.publications}
                        onChange={(e) => handleInputChange('publications', e.target.value)}
                        placeholder="Number of publications"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Citations
                      </label>
                      <input
                        type="number"
                        value={applicationForm.citations}
                        onChange={(e) => handleInputChange('citations', e.target.value)}
                        placeholder="Total citations"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        h-index
                      </label>
                      <input
                        type="number"
                        value={applicationForm.hIndex}
                        onChange={(e) => handleInputChange('hIndex', e.target.value)}
                        placeholder="h-index"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={applicationForm.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="LinkedIn URL"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Twitter/X Profile
                      </label>
                      <input
                        type="url"
                        value={applicationForm.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        placeholder="Twitter/X URL"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        ORCID ID
                      </label>
                      <input
                        type="text"
                        value={applicationForm.orcid}
                        onChange={(e) => handleInputChange('orcid', e.target.value)}
                        placeholder="ORCID ID"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBecomeExpertModal(false)}
                      className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applicationLoading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                    >
                      {applicationLoading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search experts by name, specialization, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="lg:w-64">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-slate-400">
            {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Experts Grid */}
        {filteredExperts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <div key={expert._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200 hover:shadow-lg">
                {/* Expert Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-blue-400 font-medium mb-2">
                    {expert.profile.specialization}
                  </p>
                  
                  {/* Institution */}
                  <div className="flex items-center text-slate-400 text-sm mb-1">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{expert.profile.institution}</span>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-slate-400 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{expert.profile.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <p className="text-slate-300 text-sm line-clamp-3">
                    {expert.profile.bio}
                  </p>
                </div>

                {/* Metrics */}
                {expert.profile.publications && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-700 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">
                        {expert.profile.publications}
                      </div>
                      <div className="text-xs text-slate-400">Publications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">
                        {expert.profile.citations?.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">Citations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">
                        {expert.profile.hIndex}
                      </div>
                      <div className="text-xs text-slate-400">h-index</div>
                    </div>
                  </div>
                )}

                {/* Expertise Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {expert.profile.expertise.slice(0, 3).map((expertise) => (
                      <span
                        key={expertise}
                        className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full"
                      >
                        {expertise.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {expert.profile.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded-full">
                        +{expert.profile.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {expert.profile.socialLinks?.linkedin && (
                      <a
                        href={expert.profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                        title="LinkedIn"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {expert.profile.socialLinks?.twitter && (
                      <a
                        href={expert.profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"
                        title="Twitter"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No experts found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Expert Community Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {experts.length}
              </div>
              <div className="text-slate-400">Total Experts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {experts.reduce((sum, expert) => sum + (expert.profile.publications || 0), 0)}
              </div>
              <div className="text-slate-400">Publications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {experts.reduce((sum, expert) => sum + (expert.profile.citations || 0), 0).toLocaleString()}
              </div>
              <div className="text-slate-400">Citations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {new Set(experts.flatMap(expert => expert.profile.expertise)).size}
              </div>
              <div className="text-slate-400">Expertise Areas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

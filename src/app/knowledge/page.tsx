'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Book, 
  FileText, 
  Video, 
  Headphones, 
  Link, 
  Filter, 
  Tag, 
  Clock, 
  User, 
  TrendingUp, 
  Bookmark, 
  Share, 
  Download,
  Brain,
  Lightbulb,
  Microscope,
  Heart,
  Cpu,
  Dna,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import Fuse from 'fuse.js';

interface KnowledgeItem {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: 'article' | 'video' | 'podcast' | 'document' | 'tool' | 'dataset';
  category: string;
  tags: string[];
  author: string;
  publishedDate: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  views: number;
  bookmarks: number;
  rating: number;
  url?: string;
  thumbnail?: string;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'popular' | 'rating'>('relevance');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock categories data
  const mockCategories: Category[] = [
    {
      id: 'neurotech',
      name: 'Neurotech',
      description: 'Brain-computer interfaces and neural engineering',
      icon: 'Brain',
      color: 'blue',
      count: 156
    },
    {
      id: 'ai-healthcare',
      name: 'AI Healthcare',
      description: 'Artificial intelligence in medical applications',
      icon: 'Cpu',
      color: 'green',
      count: 203
    },
    {
      id: 'gene-therapy',
      name: 'Gene Therapy',
      description: 'Genetic engineering and CRISPR technologies',
      icon: 'Dna',
      color: 'purple',
      count: 128
    },
    {
      id: 'regenerative-medicine',
      name: 'Regenerative Medicine',
      description: 'Tissue engineering and stem cell research',
      icon: 'Heart',
      color: 'red',
      count: 94
    },
    {
      id: 'drug-discovery',
      name: 'Drug Discovery',
      description: 'Pharmaceutical research and development',
      icon: 'Microscope',
      color: 'amber',
      count: 87
    },
    {
      id: 'medical-devices',
      name: 'Medical Devices',
      description: 'Biomedical engineering and device innovation',
      icon: 'Zap',
      color: 'cyan',
      count: 76
    },
    {
      id: 'public-health',
      name: 'Public Health',
      description: 'Epidemiology and population health research',
      icon: 'Shield',
      color: 'emerald',
      count: 112
    },
    {
      id: 'biotech',
      name: 'Biotech',
      description: 'Biotechnology and bioengineering advances',
      icon: 'Lightbulb',
      color: 'orange',
      count: 145
    }
  ];

  // Mock knowledge items data
  const mockKnowledgeItems: KnowledgeItem[] = [
    {
      _id: '1',
      title: 'Brain-Computer Interface Fundamentals',
      description: 'Comprehensive guide to understanding BCI technology, neural signal processing, and current applications in medical and consumer devices.',
      content: 'Brain-computer interfaces represent a revolutionary technology that enables direct communication between the brain and external devices...',
      type: 'article',
      category: 'neurotech',
      tags: ['BCI', 'neural-signals', 'medical-devices', 'neuroscience'],
      author: 'Dr. Sarah Chen',
      publishedDate: '2024-06-15',
      readTime: 12,
      difficulty: 'intermediate',
      views: 2340,
      bookmarks: 187,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      featured: true
    },
    {
      _id: '2',
      title: 'CRISPR-Cas9 Gene Editing Tutorial',
      description: 'Step-by-step video tutorial on CRISPR gene editing techniques, including practical laboratory protocols and safety considerations.',
      content: 'This comprehensive tutorial covers the molecular mechanisms of CRISPR-Cas9 gene editing...',
      type: 'video',
      category: 'gene-therapy',
      tags: ['CRISPR', 'gene-editing', 'molecular-biology', 'laboratory-techniques'],
      author: 'Prof. Michael Rodriguez',
      publishedDate: '2024-06-10',
      readTime: 45,
      difficulty: 'advanced',
      views: 1890,
      bookmarks: 234,
      rating: 4.9,
      url: 'https://example.com/crispr-tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&h=200&fit=crop',
      featured: true
    },
    {
      _id: '3',
      title: 'AI in Medical Imaging Dataset',
      description: 'Large-scale dataset of medical images with AI annotations for training machine learning models in diagnostic applications.',
      content: 'This dataset contains over 100,000 medical images across multiple modalities...',
      type: 'dataset',
      category: 'ai-healthcare',
      tags: ['medical-imaging', 'machine-learning', 'diagnostics', 'dataset'],
      author: 'Dr. Lisa Wang',
      publishedDate: '2024-06-08',
      readTime: 5,
      difficulty: 'expert',
      views: 1456,
      bookmarks: 89,
      rating: 4.6,
      url: 'https://example.com/medical-dataset',
      thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
      featured: false
    },
    {
      _id: '4',
      title: 'Regenerative Medicine Podcast Series',
      description: 'Weekly podcast discussing latest breakthroughs in stem cell research, tissue engineering, and regenerative therapies.',
      content: 'Join leading researchers as they discuss cutting-edge developments in regenerative medicine...',
      type: 'podcast',
      category: 'regenerative-medicine',
      tags: ['stem-cells', 'tissue-engineering', 'regenerative-therapy', 'research-updates'],
      author: 'Dr. James Wilson',
      publishedDate: '2024-06-12',
      readTime: 60,
      difficulty: 'intermediate',
      views: 3200,
      bookmarks: 456,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      featured: false
    },
    {
      _id: '5',
      title: 'Drug Discovery Pipeline Tool',
      description: 'Interactive web tool for modeling drug discovery pipelines, including compound screening and optimization workflows.',
      content: 'This tool provides researchers with an intuitive interface for designing and analyzing drug discovery workflows...',
      type: 'tool',
      category: 'drug-discovery',
      tags: ['drug-development', 'pharmaceutical', 'screening', 'workflow-tool'],
      author: 'Dr. Emily Richardson',
      publishedDate: '2024-06-05',
      readTime: 15,
      difficulty: 'beginner',
      views: 987,
      bookmarks: 123,
      rating: 4.4,
      url: 'https://example.com/drug-pipeline-tool',
      thumbnail: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=200&fit=crop',
      featured: false
    },
    {
      _id: '6',
      title: 'Medical Device Regulation Guidelines',
      description: 'Comprehensive document covering FDA and international regulations for medical device development and approval.',
      content: 'Understanding regulatory pathways is crucial for successful medical device development...',
      type: 'document',
      category: 'medical-devices',
      tags: ['FDA', 'regulations', 'medical-devices', 'compliance'],
      author: 'Regulatory Affairs Team',
      publishedDate: '2024-06-01',
      readTime: 25,
      difficulty: 'intermediate',
      views: 1234,
      bookmarks: 167,
      rating: 4.5,
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      featured: false
    }
  ];

  // Initialize Fuse.js for semantic search
  const fuse = useMemo(() => {
    if (knowledgeItems.length === 0) return null;
    
    return new Fuse(knowledgeItems, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true
    });
  }, [knowledgeItems]);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setKnowledgeItems(mockKnowledgeItems);
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let items = knowledgeItems;

    // Apply category filter
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      items = items.filter(item => item.type === selectedType);
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      items = items.filter(item => item.difficulty === selectedDifficulty);
    }

    // Apply search
    if (searchQuery.trim() && fuse) {
      const searchResults = fuse.search(searchQuery);
      items = searchResults.map(result => result.item);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        break;
      case 'popular':
        items.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      default: // relevance
        break;
    }

    return items;
  }, [knowledgeItems, selectedCategory, selectedType, selectedDifficulty, searchQuery, sortBy, fuse]);

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      article: FileText,
      video: Video,
      podcast: Headphones,
      document: Book,
      tool: Link,
      dataset: Microscope
    };
    const IconComponent = icons[type] || FileText;
    return <IconComponent className="h-5 w-5" />;
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Brain, Cpu, Dna, Heart, Microscope, Zap, Shield, Lightbulb
    };
    const IconComponent = icons[iconName] || Book;
    return <IconComponent className="h-6 w-6" />;
  };

  const getCategoryColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-600/20 text-green-400 border-green-500/30',
      purple: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
      red: 'bg-red-600/20 text-red-400 border-red-500/30',
      amber: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
      cyan: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
      emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
      orange: 'bg-orange-600/20 text-orange-400 border-orange-500/30'
    };
    return colors[color] || 'bg-slate-600/20 text-slate-400 border-slate-500/30';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-600/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-600/20';
      case 'advanced': return 'text-orange-400 bg-orange-600/20';
      case 'expert': return 'text-red-400 bg-red-600/20';
      default: return 'text-slate-400 bg-slate-600/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Knowledge Base
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Comprehensive collection of research resources, tools, and educational content
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search knowledge base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Categories */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                      selectedCategory === category.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-1 rounded mr-2 ${getCategoryColor(category.color)}`}>
                        {getCategoryIcon(category.icon)}
                      </div>
                      {category.name}
                    </div>
                    <span className="text-xs bg-slate-600 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Content Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                  >
                    <option value="all">All Types</option>
                    <option value="article">Articles</option>
                    <option value="video">Videos</option>
                    <option value="podcast">Podcasts</option>
                    <option value="document">Documents</option>
                    <option value="tool">Tools</option>
                    <option value="dataset">Datasets</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-slate-400">
                  {filteredItems.length} results
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <div className="w-4 h-4 flex flex-col space-y-1">
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                    <div className="h-0.5 bg-current rounded"></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Featured Items */}
            {selectedCategory === 'all' && !searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Featured Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {knowledgeItems.filter(item => item.featured).slice(0, 2).map(item => (
                    <div key={item._id} className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg p-6 border border-indigo-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <span className="text-indigo-400 font-medium">{item.type}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-300 mb-4 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                        <span>By {item.author}</span>
                        <span>{item.readTime} min read</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {item.views.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Bookmark className="h-4 w-4 mr-1" />
                            {item.bookmarks}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-slate-400 hover:text-slate-300 transition-colors">
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-300 transition-colors">
                            <Share className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredItems.map(item => (
                <div key={item._id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors group">
                  {/* Thumbnail Image */}
                  {item.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <span className="bg-slate-900/70 text-white text-sm px-2 py-1 rounded capitalize backdrop-blur-sm">
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Header for items without thumbnails */}
                    {!item.thumbnail && (
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <span className="text-slate-400 text-sm capitalize">{item.type}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-indigo-400 cursor-pointer group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <span>By {item.author}</span>
                      <span>{new Date(item.publishedDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {item.readTime}m
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {item.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          {item.rating}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-slate-400 hover:text-slate-300 transition-colors">
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-300 transition-colors">
                          <Share className="h-4 w-4" />
                        </button>
                        {item.url && (
                          <button className="p-1 text-slate-400 hover:text-slate-300 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Book className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-400 mb-2">No results found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
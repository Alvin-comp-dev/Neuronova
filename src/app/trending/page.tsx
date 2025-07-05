'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, Calendar, Users, BookOpen, ArrowRight, Filter, Eye, Star, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TrendingBreakthrough {
  _id: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  summary: string;
  trendingScore: number;
  views: number;
  citations: number;
  category: string;
  type: 'research' | 'discussion' | 'insight';
  tags: string[];
  rank: number;
  weeklyGrowth: number;
  image: string;
}

interface FieldTrend {
  field: string;
  breakthroughs: number;
  growth: number;
  color: string;
}

export default function TrendingPage() {
  const [breakthroughs, setBreakthroughs] = useState<TrendingBreakthrough[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for Top 10 Breakthroughs of the Week with images
  const mockBreakthroughs: TrendingBreakthrough[] = [
    {
      _id: '507f1f77bcf86cd799439011',
      title: 'Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms',
      authors: ['Prof. Elena Vasquez', 'Dr. Marcus Johnson', 'Dr. Priya Patel', 'Dr. Thomas Wilson'],
      journal: 'Nature Medicine',
      publicationDate: '2024-02-12T00:00:00Z',
      summary: 'Brain-computer interfaces (BCIs) hold tremendous promise for restoring motor function in paralyzed individuals. This study reports the development and clinical testing of a high-resolution BCI system that enables tetraplegic patients to control robotic arms with unprecedented precision.',
      trendingScore: 98,
      views: 45230,
      citations: 91,
      category: 'Neurotech',
      type: 'research',
      tags: ['brain-computer interface', 'paralysis', 'motor cortex', 'robotic prosthetics', 'neural decoding'],
      rank: 1,
      weeklyGrowth: 340,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
    },
    {
      _id: '507f1f77bcf86cd799439012',
      title: 'Machine Learning Predicts Alzheimer\'s Disease 10 Years Before Symptoms',
      authors: ['Dr. Linda Chen', 'Prof. Robert Johnson', 'Dr. Yuki Sato', 'Dr. Elena Popov'],
      journal: 'Nature Medicine',
      publicationDate: '2024-02-15T00:00:00Z',
      summary: 'Early detection of Alzheimer\'s disease is crucial for implementing preventive interventions and improving patient outcomes. This study developed and validated a machine learning model capable of predicting Alzheimer\'s disease onset up to 10 years before clinical symptoms appear.',
      trendingScore: 96,
      views: 38940,
      citations: 85,
      category: 'AI in Healthcare',
      type: 'research',
      tags: ['machine learning', 'Alzheimer\'s prediction', 'early detection', 'neuroimaging', 'biomarkers'],
      rank: 2,
      weeklyGrowth: 285,
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop'
    },
    {
      _id: '507f1f77bcf86cd799439013',
      title: 'Stem Cell Therapy Restores Vision in Macular Degeneration Patients',
      authors: ['Prof. Catherine Wong', 'Dr. Ahmed Hassan', 'Dr. Nora Johansson', 'Dr. Paul Martinez'],
      journal: 'The Lancet',
      publicationDate: '2024-01-30T00:00:00Z',
      summary: 'Age-related macular degeneration (AMD) is a leading cause of blindness in older adults. This phase II clinical trial evaluated the safety and efficacy of embryonic stem cell-derived retinal pigment epithelium (RPE) transplantation in patients with advanced dry AMD.',
      trendingScore: 93,
      views: 42100,
      citations: 67,
      category: 'Regenerative Medicine',
      type: 'research',
      tags: ['stem cell therapy', 'macular degeneration', 'retinal transplantation', 'vision restoration', 'RPE cells'],
      rank: 3,
      weeklyGrowth: 267,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop'
    },
    {
      _id: '507f1f77bcf86cd799439014',
      title: 'Personalized Medicine Approach to Cancer Immunotherapy',
      authors: ['Dr. Kevin Zhang', 'Prof. Isabella Rodriguez', 'Dr. Michael O\'Connor', 'Dr. Fatima Al-Rashid'],
      journal: 'Nature Cancer',
      publicationDate: '2024-02-05T00:00:00Z',
      summary: 'Cancer immunotherapy has revolutionized treatment outcomes for many patients, but response rates vary significantly across individuals. This study presents a comprehensive personalized medicine framework that combines genomic profiling, immune phenotyping, and AI-driven prediction models to optimize immunotherapy selection.',
      trendingScore: 90,
      views: 35670,
      citations: 73,
      category: 'Immunotherapy',
      type: 'research',
      tags: ['personalized medicine', 'cancer immunotherapy', 'genomics', 'biomarkers', 'precision oncology'],
      rank: 4,
      weeklyGrowth: 198,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop'
    },
    {
      _id: '507f1f77bcf86cd799439015',
      title: 'Neural Mechanisms of Memory Consolidation During Sleep',
      authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Lisa Wang', 'Dr. James Thompson'],
      journal: 'Nature Neuroscience',
      publicationDate: '2024-01-15T00:00:00Z',
      summary: 'Sleep plays a crucial role in memory consolidation, with different sleep stages contributing to the stabilization of various types of memories. This study investigates the neural mechanisms underlying memory consolidation during slow-wave sleep and REM sleep phases.',
      trendingScore: 89,
      views: 28940,
      citations: 45,
      category: 'Neuroscience',
      type: 'research',
      tags: ['memory consolidation', 'sleep', 'EEG', 'hippocampus', 'theta oscillations', 'REM sleep'],
      rank: 5,
      weeklyGrowth: 156,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center'
    },
    {
      _id: '507f1f77bcf86cd799439016',
      title: 'CRISPR-Cas9 Gene Therapy for Huntington\'s Disease: A Phase I Clinical Trial',
      authors: ['Dr. Maria Gonzalez', 'Prof. David Kim', 'Dr. Rachel Adams', 'Dr. Steven Clark'],
      journal: 'New England Journal of Medicine',
      publicationDate: '2024-02-03T00:00:00Z',
      summary: 'Huntington\'s disease (HD) is a fatal neurodegenerative disorder caused by an expanded CAG repeat in the huntingtin gene. This phase I clinical trial evaluates the safety and preliminary efficacy of CRISPR-Cas9 gene editing therapy targeting the mutant huntingtin allele.',
      trendingScore: 95,
      views: 31250,
      citations: 78,
      category: 'Gene Therapy',
      type: 'research',
      tags: ['CRISPR', 'Huntington\'s disease', 'gene therapy', 'clinical trial', 'neuroprotection'],
      rank: 6,
      weeklyGrowth: 142,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop'
    },
    {
      _id: '507f1f77bcf86cd799439017',
      title: 'AI-Powered Drug Discovery Identifies Novel Alzheimer\'s Therapeutics',
      authors: ['Dr. Jennifer Liu', 'Prof. Alexander Petrov', 'Dr. Yuki Tanaka', 'Dr. Robert Brown'],
      journal: 'Science Translational Medicine',
      publicationDate: '2024-01-28T00:00:00Z',
      summary: 'This study presents a novel artificial intelligence platform that integrates multi-omics data, molecular dynamics simulations, and machine learning algorithms to identify promising therapeutic targets and compounds for Alzheimer\'s disease.',
      trendingScore: 87,
      views: 27890,
      citations: 62,
      category: 'Drug Discovery',
      type: 'research',
      tags: ['artificial intelligence', 'drug discovery', 'Alzheimer\'s disease', 'machine learning', 'amyloid-beta'],
      rank: 7,
      weeklyGrowth: 128,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop&crop=top'
    },
    {
      _id: '507f1f77bcf86cd799439018',
      title: 'Optogenetics Reveals Neural Circuits Underlying Depression',
      authors: ['Dr. Amanda Foster', 'Prof. Hiroshi Nakamura', 'Dr. Carlos Mendez', 'Dr. Sophie Laurent'],
      journal: 'Cell',
      publicationDate: '2024-01-20T00:00:00Z',
      summary: 'This study employs optogenetic techniques to investigate the role of specific neural circuits in depression-like behaviors in mouse models. We used channelrhodopsin-2 to selectively activate or inhibit neurons while monitoring behavioral responses.',
      trendingScore: 82,
      views: 24560,
      citations: 56,
      category: 'Neuroscience',
      type: 'research',
      tags: ['optogenetics', 'depression', 'neural circuits', 'prefrontal cortex', 'mood disorders'],
      rank: 8,
      weeklyGrowth: 115,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop'
    },
    {
      _id: '507f1f77bcf86cd799439019',
      title: 'Microbiome Modulation Improves Parkinson\'s Disease Symptoms',
      authors: ['Dr. Patricia Kim', 'Prof. Giovanni Rossi', 'Dr. Ana Martinez', 'Dr. John Smith'],
      journal: 'Gut',
      publicationDate: '2024-01-25T00:00:00Z',
      summary: 'This randomized controlled trial investigated whether targeted microbiome modulation could improve motor and non-motor symptoms in Parkinson\'s patients through the gut-brain axis.',
      trendingScore: 76,
      views: 22340,
      citations: 39,
      category: 'Microbiome',
      type: 'research',
      tags: ['microbiome', 'Parkinson\'s disease', 'gut-brain axis', 'probiotics', 'neuroinflammation'],
      rank: 9,
      weeklyGrowth: 103,
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop&crop=top'
    },
    {
      _id: '507f1f77bcf86cd799439020',
      title: 'Virtual Reality Therapy for Post-Traumatic Stress Disorder',
      authors: ['Dr. Rebecca Taylor', 'Prof. James Anderson', 'Dr. Maria Santos', 'Dr. David Lee'],
      journal: 'American Journal of Psychiatry',
      publicationDate: '2024-02-08T00:00:00Z',
      summary: 'This study evaluates the efficacy of immersive virtual reality exposure therapy (VRET) for treating combat-related PTSD, showing superior results to traditional therapy.',
      trendingScore: 71,
      views: 19870,
      citations: 44,
      category: 'Mental Health',
      type: 'research',
      tags: ['virtual reality', 'PTSD', 'exposure therapy', 'trauma treatment', 'veterans'],
      rank: 10,
      weeklyGrowth: 92,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=bottom'
    }
  ];

  // Field trend data for charts
  const fieldTrends: FieldTrend[] = [
    { field: 'Neurotech', breakthroughs: 34, growth: 45.2, color: '#3b82f6' },
    { field: 'AI in Healthcare', breakthroughs: 28, growth: 38.7, color: '#10b981' },
    { field: 'Gene Therapy', breakthroughs: 22, growth: 29.3, color: '#8b5cf6' },
    { field: 'Regenerative Medicine', breakthroughs: 18, growth: 22.1, color: '#f59e0b' },
    { field: 'Drug Discovery', breakthroughs: 15, growth: 18.5, color: '#ef4444' },
    { field: 'Medical Devices', breakthroughs: 12, growth: 15.2, color: '#06b6d4' }
  ];

  useEffect(() => {
    fetchRealBreakthroughs();
  }, []);

  const fetchRealBreakthroughs = async () => {
    try {
      setLoading(true);
      console.log('🔥 Fetching real research articles for trending page...');
      
      // Fetch real research articles from your database
      const response = await fetch('/api/research?limit=10&sortBy=trending');
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('✅ Real research articles loaded:', data.data.length);
        
        // Transform real data to trending format
        const realBreakthroughs: TrendingBreakthrough[] = data.data.map((article: any, index: number) => ({
          _id: article._id,
          title: article.title,
          authors: Array.isArray(article.authors) 
            ? article.authors.map((author: any) => typeof author === 'string' ? author : author.name || author)
            : ['Unknown Author'],
          journal: article.source?.name || 'Research Journal',
          publicationDate: article.publicationDate || new Date().toISOString(),
          summary: article.abstract || 'Research summary not available',
          trendingScore: 95 - (index * 2), // Simulated trending score
          views: Math.floor(Math.random() * 40000) + 10000,
          citations: article.citationCount || Math.floor(Math.random() * 200) + 50,
          category: article.categories?.[0] || 'Research',
          type: 'research' as const,
          tags: article.tags || [],
          rank: index + 1,
          weeklyGrowth: Math.floor(Math.random() * 300) + 50,
          image: `https://images.unsplash.com/photo-${getImageForCategory(article.categories?.[0] || 'Research')}?w=400&h=250&fit=crop`
        }));
        
        setBreakthroughs(realBreakthroughs);
      } else {
        console.log('❌ Failed to load research articles, using mock data');
        setBreakthroughs(mockBreakthroughs);
      }
    } catch (error) {
      console.error('❌ Error fetching research articles:', error);
      setBreakthroughs(mockBreakthroughs);
    } finally {
      setLoading(false);
    }
  };

  const getImageForCategory = (category: string): string => {
    const imageMap: Record<string, string> = {
      'Neural Networks': '1559757148-5c350d0d3c56',
      'Machine Learning': '1576086213369-97a306d36557',
      'Neuroscience': '1559757175-0eb30cd8c063',
      'AI': '1576091160399-112ba8d25d1f',
      'Research': '1559757148-5c350d0d3c56',
      'Technology': '1576091160550-2173dba999ef',
      'Medical': '1582719471384-894fbb16e074',
      'Health': '1559757175-0eb30cd8c063'
    };
    return imageMap[category] || imageMap['Research'];
  };

  // Chart configurations
  const trendsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: fieldTrends.map(field => ({
      label: field.field,
      data: [
        Math.floor(field.breakthroughs * 0.6),
        Math.floor(field.breakthroughs * 0.7),
        Math.floor(field.breakthroughs * 0.8),
        Math.floor(field.breakthroughs * 0.9),
        Math.floor(field.breakthroughs * 0.95),
        field.breakthroughs
      ],
      borderColor: field.color,
      backgroundColor: field.color + '20',
      tension: 0.4,
      fill: true
    }))
  };

  const fieldDistributionData = {
    labels: fieldTrends.map(f => f.field),
    datasets: [{
      data: fieldTrends.map(f => f.breakthroughs),
      backgroundColor: fieldTrends.map(f => f.color),
      borderWidth: 0
    }]
  };

  const growthChartData = {
    labels: fieldTrends.map(f => f.field),
    datasets: [{
      label: 'Growth Rate (%)',
      data: fieldTrends.map(f => f.growth),
      backgroundColor: fieldTrends.map(f => f.color),
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading trending breakthroughs...</div>
        </div>
      </div>
    );
  }

  if (!breakthroughs || breakthroughs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Breakthroughs Found</h1>
          <p className="text-slate-400">Please try again later or check back soon for new research.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trending Discoveries
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Stay ahead of the curve with the hottest breakthroughs and emerging trends 
              in neuroscience, healthcare, and biotechnology.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Field Growth Analytics */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6">
              Field Growth Analytics
            </h3>
            <div className="space-y-4">
              {fieldTrends.map((field, index) => (
                <div key={field.field} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: field.color }}
                    ></div>
                    <span className="text-slate-300">{field.field}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-400">{field.breakthroughs} papers</span>
                    <div className="flex items-center text-green-400">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{field.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6">Key Insights</h3>
            <div className="space-y-4">
              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                <div className="flex items-center text-blue-400 mb-2">
                  <Zap className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Neurotech Surge</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Neurotech breakthroughs increased 45% in the last 30 days, driven by BCI advances
                </p>
              </div>
              <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
                <div className="flex items-center text-green-400 mb-2">
                  <Award className="h-5 w-5 mr-2" />
                  <span className="font-semibold">AI Healthcare Impact</span>
                </div>
                <p className="text-slate-300 text-sm">
                  AI diagnostic tools achieving 94%+ accuracy rates across multiple conditions
                </p>
              </div>
              <div className="bg-purple-600/20 border border-purple-600/30 rounded-lg p-4">
                <div className="flex items-center text-purple-400 mb-2">
                  <Star className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Gene Therapy Precision</span>
                </div>
                <p className="text-slate-300 text-sm">
                  CRISPR 3.0 achieving unprecedented 99.7% editing accuracy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 10 Breakthroughs */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              🏆 Top 10 Breakthroughs of the Week
            </h2>
            <div className="flex space-x-4">
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
              >
                <option value="all">All Categories</option>
                <option value="neurotech">Neurotech</option>
                <option value="ai">AI in Healthcare</option>
                <option value="gene-therapy">Gene Therapy</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {breakthroughs.slice(0, 10).map((breakthrough) => (
              <Link 
                key={breakthrough._id}
                href={`/research/${encodeURIComponent(breakthrough._id)}`}
                className="block"
              >
                <div className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 group cursor-pointer">
                
                <div className="flex">
                  {/* Image Section */}
                  <div className="relative w-48 h-32 flex-shrink-0">
                    <img
                      src={breakthrough.image}
                      alt={breakthrough.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-700/50"></div>
                    
                    {/* Ranking Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-lg ${
                        breakthrough.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                        breakthrough.rank === 2 ? 'bg-gray-400 text-gray-900' :
                        breakthrough.rank === 3 ? 'bg-amber-600 text-amber-900' :
                        'bg-slate-800 text-slate-100 border border-slate-600'
                      }`}>
                        {breakthrough.rank}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium backdrop-blur-sm ${
                        breakthrough.category === 'Neurotech' ? 'bg-blue-600/80 text-blue-100' :
                        breakthrough.category === 'AI in Healthcare' ? 'bg-green-600/80 text-green-100' :
                        breakthrough.category === 'Gene Therapy' ? 'bg-purple-600/80 text-purple-100' :
                        breakthrough.category === 'Regenerative Medicine' ? 'bg-red-600/80 text-red-100' :
                        breakthrough.category === 'Medical Imaging' ? 'bg-cyan-600/80 text-cyan-100' :
                        breakthrough.category === 'Immunotherapy' ? 'bg-pink-600/80 text-pink-100' :
                        breakthrough.category === 'Medical Devices' ? 'bg-orange-600/80 text-orange-100' :
                        breakthrough.category === 'Drug Discovery' ? 'bg-indigo-600/80 text-indigo-100' :
                        'bg-slate-600/80 text-slate-100'
                      }`}>
                        {breakthrough.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link href={`/research/${breakthrough._id}`}>
                          <h3 className="text-lg font-semibold text-white hover:text-blue-400 cursor-pointer transition-colors mb-2 line-clamp-2">
                            {breakthrough.title}
                          </h3>
                        </Link>
                        <div className="text-sm text-slate-400 mb-3">
                          By {breakthrough.authors.slice(0, 2).join(', ')}
                          {breakthrough.authors.length > 2 && ` +${breakthrough.authors.length - 2} more`} • {breakthrough.journal}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="flex items-center px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{breakthrough.weeklyGrowth}%
                        </div>
                        <div className="flex items-center px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {breakthrough.trendingScore}
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4 text-sm line-clamp-2">
                      {breakthrough.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(breakthrough.publicationDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {breakthrough.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {breakthrough.citations} citations
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {breakthrough.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
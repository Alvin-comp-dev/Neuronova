'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, Calendar, Users, BookOpen, ArrowRight, Filter, Eye, Star, Award, Zap } from 'lucide-react';
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
      _id: '1',
      title: 'Revolutionary Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms',
      authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Lisa Johnson'],
      journal: 'Nature Neuroscience',
      publicationDate: '2024-06-15T00:00:00Z',
      summary: 'Breakthrough BCI technology allows direct neural control of robotic limbs with 96% accuracy',
      trendingScore: 98.5,
      views: 45230,
      citations: 234,
      category: 'Neurotech',
      type: 'research',
      tags: ['BCI', 'Neural Interface', 'Robotics'],
      rank: 1,
      weeklyGrowth: 340,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
    },
    {
      _id: '2',
      title: 'CRISPR 3.0 Achieves Unprecedented Precision in Gene Editing for Huntington\'s Disease',
      authors: ['Dr. James Wilson', 'Prof. Emily Richardson'],
      journal: 'Cell',
      publicationDate: '2024-06-14T00:00:00Z',
      summary: 'Next-generation CRISPR technology shows 99.7% accuracy in correcting Huntington\'s mutations',
      trendingScore: 95.2,
      views: 38940,
      citations: 189,
      category: 'Gene Therapy',
      type: 'research',
      tags: ['CRISPR', 'Gene Editing', 'Huntington\'s'],
      rank: 2,
      weeklyGrowth: 285,
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop'
    },
    {
      _id: '3',
      title: 'AI System Detects Alzheimer\'s 15 Years Before Symptoms with 94% Accuracy',
      authors: ['Dr. Maria Garcia', 'Dr. David Kim'],
      journal: 'Science Translational Medicine',
      publicationDate: '2024-06-13T00:00:00Z',
      summary: 'Machine learning model analyzes retinal scans to predict Alzheimer\'s decades in advance',
      trendingScore: 92.8,
      views: 42100,
      citations: 156,
      category: 'AI in Healthcare',
      type: 'research',
      tags: ['AI', 'Alzheimer\'s', 'Early Detection'],
      rank: 3,
      weeklyGrowth: 267,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop'
    },
    {
      _id: '4',
      title: 'Bioengineered Heart Tissue Successfully Regenerates After Heart Attack in Clinical Trial',
      authors: ['Prof. Robert Taylor', 'Dr. Anna Kowalski'],
      journal: 'The Lancet',
      publicationDate: '2024-06-12T00:00:00Z',
      summary: 'Lab-grown cardiac patches restore heart function in 78% of heart attack patients',
      trendingScore: 89.4,
      views: 35670,
      citations: 143,
      category: 'Regenerative Medicine',
      type: 'research',
      tags: ['Heart', 'Regeneration', 'Clinical Trial'],
      rank: 4,
      weeklyGrowth: 198,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop'
    },
    {
      _id: '5',
      title: 'Quantum-Enhanced MRI Reveals Brain Activity at Unprecedented Resolution',
      authors: ['Dr. Thomas Anderson', 'Prof. Jennifer Lee'],
      journal: 'Nature',
      publicationDate: '2024-06-11T00:00:00Z',
      summary: 'Quantum sensors enable real-time imaging of individual neurons in living brain tissue',
      trendingScore: 87.1,
      views: 28940,
      citations: 127,
      category: 'Medical Imaging',
      type: 'research',
      tags: ['Quantum', 'MRI', 'Brain Imaging'],
      rank: 5,
      weeklyGrowth: 156,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center'
    },
    {
      _id: '6',
      title: 'Breakthrough Immunotherapy Eliminates Solid Tumors in 89% of Patients',
      authors: ['Dr. Patricia Kim', 'Prof. Michael Chen'],
      journal: 'Nature Medicine',
      publicationDate: '2024-06-10T00:00:00Z',
      summary: 'Novel CAR-T cell therapy shows remarkable success against previously untreatable cancers',
      trendingScore: 84.7,
      views: 31250,
      citations: 118,
      category: 'Immunotherapy',
      type: 'research',
      tags: ['Cancer', 'CAR-T', 'Immunotherapy'],
      rank: 6,
      weeklyGrowth: 142,
      image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop'
    },
    {
      _id: '7',
      title: 'Lab-Grown Retinal Cells Restore Vision in Blind Patients',
      authors: ['Dr. Jennifer Martinez', 'Prof. David Wilson'],
      journal: 'Cell Stem Cell',
      publicationDate: '2024-06-09T00:00:00Z',
      summary: 'Stem cell-derived retinal patches successfully restore partial vision in clinical trials',
      trendingScore: 82.3,
      views: 27890,
      citations: 102,
      category: 'Regenerative Medicine',
      type: 'research',
      tags: ['Vision', 'Stem Cells', 'Retina'],
      rank: 7,
      weeklyGrowth: 128,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop&crop=top'
    },
    {
      _id: '8',
      title: 'Smart Contact Lenses Monitor Glucose Levels in Real-Time',
      authors: ['Dr. Alex Thompson', 'Prof. Sarah Lee'],
      journal: 'Science Advances',
      publicationDate: '2024-06-08T00:00:00Z',
      summary: 'Wireless biosensor contact lenses provide continuous glucose monitoring for diabetics',
      trendingScore: 79.8,
      views: 24560,
      citations: 94,
      category: 'Medical Devices',
      type: 'research',
      tags: ['Diabetes', 'Biosensors', 'Wearables'],
      rank: 8,
      weeklyGrowth: 115,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop'
    },
    {
      _id: '9',
      title: 'Nanotechnology Drug Delivery System Crosses Blood-Brain Barrier',
      authors: ['Dr. Rachel Green', 'Prof. Mark Johnson'],
      journal: 'Nature Nanotechnology',
      publicationDate: '2024-06-07T00:00:00Z',
      summary: 'Engineered nanoparticles successfully deliver Alzheimer\'s drugs directly to brain tissue',
      trendingScore: 77.5,
      views: 22340,
      citations: 87,
      category: 'Drug Discovery',
      type: 'research',
      tags: ['Nanotechnology', 'Drug Delivery', 'Alzheimer\'s'],
      rank: 9,
      weeklyGrowth: 103,
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop&crop=top'
    },
    {
      _id: '10',
      title: 'Artificial Synapses Enable Memory Restoration in Brain-Injured Patients',
      authors: ['Dr. Kevin Brown', 'Prof. Lisa Davis'],
      journal: 'Nature Biomedical Engineering',
      publicationDate: '2024-06-06T00:00:00Z',
      summary: 'Silicon-based neural implants successfully restore memory formation in traumatic brain injury patients',
      trendingScore: 75.2,
      views: 19870,
      citations: 79,
      category: 'Neurotech',
      type: 'research',
      tags: ['Memory', 'Neural Implants', 'TBI'],
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
                        <h3 className="text-lg font-semibold text-white hover:text-blue-400 cursor-pointer transition-colors mb-2 line-clamp-2">
                          {breakthrough.title}
                        </h3>
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
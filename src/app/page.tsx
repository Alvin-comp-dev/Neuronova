'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import DynamicBackground from '@/components/ui/DynamicBackground';
import BreakthroughTicker from '@/components/ui/BreakthroughTicker';
import LiveActivityFeed from '@/components/ui/LiveActivityFeed';
import { 
  ArrowRightIcon, 
  BeakerIcon, 
  BoltIcon, 
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  SparklesIcon,
  TrophyIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const [currentSlide, setCurrentSlide] = useState(0);

  console.log('HomePage - isDarkMode:', isDarkMode);

  // Featured content carousel
  const featuredContent = [
    {
      id: 1,
      title: "Revolutionary BCI Breakthrough",
      description: "Scientists achieve 96% accuracy in brain-computer interface for paralyzed patients",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      category: "Neurotech",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "CRISPR 3.0 Gene Editing Success",
      description: "New precision gene editing technique achieves 99.7% accuracy in treating genetic disorders",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop",
      category: "Gene Therapy",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "AI Detects Alzheimer's 15 Years Early",
      description: "Machine learning algorithm identifies early biomarkers with 94% accuracy",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop",
      category: "AI Healthcare",
      readTime: "6 min read"
    }
  ];

  // Research categories with icons and images
  const researchCategories = [
    {
      name: "Neurotech",
      description: "Brain-computer interfaces and neural engineering",
      icon: BeakerIcon,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      count: "1,234 articles",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "AI Healthcare",
      description: "Artificial intelligence in medical applications",
      icon: BoltIcon,
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&h=200&fit=crop",
      count: "987 articles",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Gene Therapy",
      description: "CRISPR and genetic engineering breakthroughs",
      icon: SparklesIcon,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop",
      count: "756 articles",
      color: "from-purple-500 to-violet-500"
    },
    {
      name: "Regenerative Medicine",
      description: "Stem cell research and tissue engineering",
      icon: HeartIcon,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
      count: "543 articles",
      color: "from-red-500 to-pink-500"
    }
  ];

  // Expert profiles with avatars
  const featuredExperts = [
    {
      name: "Dr. Sarah Chen",
      title: "Neurotech Pioneer",
      institution: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      specialization: "Brain-Computer Interfaces",
      followers: "12.5K",
      insights: 24
    },
    {
      name: "Prof. Michael Rodriguez",
      title: "Gene Therapy Expert",
      institution: "Johns Hopkins",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialization: "CRISPR Technology",
      followers: "8.9K",
      insights: 18
    },
    {
      name: "Dr. Lisa Wang",
      title: "AI Healthcare Lead",
      institution: "Google DeepMind",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      specialization: "Medical AI",
      followers: "15.2K",
      insights: 31
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <DynamicBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              The Future of{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Scientific Discovery
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-6">
              Curated. Centralized. Real-Time.
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              Access the latest research breakthroughs in neurotech and healthcare — all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/research"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
              >
                Explore Breakthroughs
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/community"
                className="group bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 border border-slate-600 hover:border-slate-500 flex items-center"
              >
                <UserGroupIcon className="mr-2 h-5 w-5" />
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Breakthrough Ticker */}
      <BreakthroughTicker />

      {/* Featured Content Carousel */}
      <section className="relative z-10 py-16 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest Breakthroughs
            </h2>
            <p className="text-xl text-slate-400">
              Discover the most impactful research from around the world
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredContent.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0">
                    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="md:flex">
                        <div className="md:w-1/2">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-64 md:h-96 object-cover"
                          />
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                          <div className="mb-4">
                            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            {item.title}
                          </h3>
                          <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">{item.readTime}</span>
                            <Link
                              href="/research"
                              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {featuredContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Categories */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Research Fields
            </h2>
            <p className="text-xl text-slate-400">
              Dive deep into cutting-edge research across multiple disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchCategories.map((category, index) => (
              <Link
                key={index}
                href="/research"
                className="group bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                  <div className="absolute top-4 left-4">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-slate-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{category.count}</span>
                    <ArrowRightIcon className="h-4 w-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="relative z-10 py-16 bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Leading Experts
            </h2>
            <p className="text-xl text-slate-400">
              Learn from the world's top researchers and thought leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredExperts.map((expert, index) => (
              <Link
                key={index}
                href="/experts"
                className="group bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="relative mb-6">
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                      <AcademicCapIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {expert.name}
                  </h3>
                  <p className="text-blue-400 font-medium mb-1">{expert.title}</p>
                  <p className="text-slate-400 text-sm mb-4">{expert.institution}</p>
                  <div className="bg-slate-700 rounded-lg p-3 mb-4">
                    <p className="text-slate-300 text-sm font-medium">{expert.specialization}</p>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>{expert.followers} followers</span>
                    <span>{expert.insights} insights</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Research Tools
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need for cutting-edge research discovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="bg-blue-500 rounded-lg p-3 w-fit mb-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced Search</h3>
              <p className="text-slate-300">
                AI-powered semantic search across millions of research papers with intelligent filtering and recommendations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="bg-purple-500 rounded-lg p-3 w-fit mb-4">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analytics Dashboard</h3>
              <p className="text-slate-300">
                Comprehensive analytics and insights into research trends, citation patterns, and field growth.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <div className="bg-green-500 rounded-lg p-3 w-fit mb-4">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Community Hub</h3>
              <p className="text-slate-300">
                Connect with researchers worldwide, participate in discussions, and collaborate on breakthrough discoveries.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
              <div className="bg-amber-500 rounded-lg p-3 w-fit mb-4">
                <BookOpenIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Knowledge Base</h3>
              <p className="text-slate-300">
                Curated collection of research resources, tutorials, datasets, and tools for every research need.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 rounded-xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
              <div className="bg-red-500 rounded-lg p-3 w-fit mb-4">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Achievements</h3>
              <p className="text-slate-300">
                Gamified learning experience with achievements, progress tracking, and recognition for research milestones.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
              <div className="bg-cyan-500 rounded-lg p-3 w-fit mb-4">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Network</h3>
              <p className="text-slate-300">
                Access research from top institutions worldwide with real-time updates and breakthrough notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed Section */}
      <section className="relative z-10 py-16 bg-slate-800/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Real-Time Research Activity
                </h2>
                <p className="text-xl text-slate-400">
                  Stay connected with the latest discussions, discoveries, and expert insights as they happen
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Live Stats */}
                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/20">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 rounded-full p-2 mr-3">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Live Discussions</h3>
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">42</div>
                  <p className="text-slate-400 text-sm">Active conversations right now</p>
                </div>

                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/20">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-500 rounded-full p-2 mr-3">
                      <UserGroupIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Online Experts</h3>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-1">18</div>
                  <p className="text-slate-400 text-sm">Verified experts online</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-500 rounded-full p-2 mr-3">
                      <BeakerIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">New Research</h3>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">7</div>
                  <p className="text-slate-400 text-sm">Published in the last hour</p>
                </div>

                <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-xl p-6 border border-amber-500/20">
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-500 rounded-full p-2 mr-3">
                      <TrophyIcon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Achievements</h3>
                  </div>
                  <div className="text-2xl font-bold text-amber-400 mb-1">156</div>
                  <p className="text-slate-400 text-sm">Earned today</p>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="lg:col-span-1">
              <LiveActivityFeed 
                className="h-full"
                limit={8}
                autoRefresh={true}
                showHeader={true}
              />
            </div>
          </div>

          {/* Join the Action CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl p-8 border border-slate-600/50">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join the Live Research Community
              </h3>
              <p className="text-slate-300 mb-6">
                Be part of real-time discussions, get instant notifications of breakthroughs, and connect with experts worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start Participating
                </Link>
                <Link
                  href="/community"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-slate-600 hover:border-slate-500"
                >
                  Explore Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Research?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of researchers already using Neuronova to discover, collaborate, and innovate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/about"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 border border-slate-600 hover:border-slate-500"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

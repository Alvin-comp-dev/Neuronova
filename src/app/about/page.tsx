'use client';

import { Brain, Users, Target, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About Neuronova
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            Revolutionizing how researchers, scientists, and healthcare professionals 
            discover, share, and collaborate on breakthrough research.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 mb-4">
              To accelerate scientific discovery by creating the world's most comprehensive, 
              real-time platform for neuroscience and healthcare research.
            </p>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              We believe that breakthrough discoveries happen faster when brilliant minds 
              can easily access, understand, and build upon each other's work.
            </p>
          </div>
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">The Future of Scientific Discovery</h3>
            <p className="text-blue-100">
              Curated. Centralized. Real-Time. We're building the platform that will 
              shape how healthcare and neurotech professionals consume information 
              for the next decade.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Curation
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Intelligent algorithms surface the most relevant breakthroughs for your research
            </p>
          </div>

          <div className="text-center">
            <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Expert Community
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Connect with leading researchers and scientists from around the world
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Precision Search
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Find exactly what you need with semantic search and smart filtering
            </p>
          </div>

          <div className="text-center">
            <div className="bg-amber-100 dark:bg-amber-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-Time Updates
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Stay ahead with instant notifications of the latest breakthroughs
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Shaping the Future of Research
          </h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto">
            We're not just building a website. We're creating a research engine + community + 
            think tank + academy + archive + marketplace — all tied up in an intuitive, 
            addictive, professional-grade UX.
          </p>
        </div>
      </div>
    </div>
  );
} 
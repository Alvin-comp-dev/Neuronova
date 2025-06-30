'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  BookOpen, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  Bell, 
  Settings,
  HelpCircle,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpSections = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner. Fill in your details including name, email, and password. Verify your email address through the link sent to your inbox.'
        },
        {
          question: 'What can I do on Neuronova?',
          answer: 'Neuronova allows you to discover research breakthroughs, connect with experts, participate in discussions, and stay updated on the latest developments in neuroscience and healthcare.'
        }
      ]
    },
    {
      title: 'Research & Discovery',
      icon: Search,
      items: [
        {
          question: 'How do I find research articles?',
          answer: 'Use the search bar at the top of the page or browse through categories. You can filter results by date, field, and more. The trending page shows popular recent breakthroughs.'
        },
        {
          question: 'How do I save articles for later?',
          answer: 'Click the bookmark icon on any article to save it to your library. Access your saved articles from your profile page.'
        }
      ]
    },
    {
      title: 'Community Features',
      icon: Users,
      items: [
        {
          question: 'How do I connect with experts?',
          answer: 'Visit the Experts page to find and follow leading researchers in your field. You can also participate in discussions and ask questions.'
        },
        {
          question: 'How do I join discussions?',
          answer: `Click on any article's discussion section to view or add comments. You can also start new discussions in the Community Hub.`
        }
      ]
    },
    {
      title: 'Account Management',
      icon: Settings,
      items: [
        {
          question: 'How do I update my profile?',
          answer: 'Go to your Profile page and click the Edit Profile button. You can update your photo, bio, and professional information.'
        },
        {
          question: 'How do I manage notifications?',
          answer: 'Access your notification preferences in Settings. You can choose which updates you want to receive and how.'
        }
      ]
    }
  ];

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? helpSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : helpSections;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Help Center
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Find answers to common questions and learn how to make the most of Neuronova
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-slate-400">
              Try adjusting your search terms or browse all help articles
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSections.map((section, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-8 border border-slate-700"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <section.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white ml-4">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-b border-slate-700 pb-6 last:border-0">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.question}
                      </h3>
                      <p className="text-slate-300">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Help Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/docs"
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors duration-300"
          >
            <FileText className="h-8 w-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Documentation
            </h3>
            <p className="text-slate-300">
              Detailed guides and technical documentation
            </p>
          </Link>

          <Link
            href="/community"
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-colors duration-300"
          >
            <MessageSquare className="h-8 w-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Community Support
            </h3>
            <p className="text-slate-300">
              Get help from the Neuronova community
            </p>
          </Link>

          <Link
            href="/contact"
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300"
          >
            <HelpCircle className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Contact Support
            </h3>
            <p className="text-slate-300">
              Reach out to our support team
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
} 
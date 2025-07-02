'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Sign up" in the top navigation bar. Fill out the registration form with your email, name, and password. You\'ll receive a confirmation email to verify your account.'
      },
      {
        question: 'What is NeuroNova?',
        answer: 'NeuroNova is a comprehensive research discovery platform that aggregates scientific papers, expert content, and educational resources from multiple academic sources worldwide.'
      },
      {
        question: 'How do I search for research papers?',
        answer: 'Use the search bar on the homepage or navigate to the Research page. You can search by keywords, authors, or topics. Our system searches across 6+ academic databases simultaneously.'
      }
    ]
  },
  {
    title: 'Research Discovery',
    items: [
      {
        question: 'Which databases does NeuroNova search?',
        answer: 'We search across arXiv, Semantic Scholar, CrossRef, PubMed, CORE, and OpenAlex, providing comprehensive coverage of academic literature.'
      },
      {
        question: 'How can I save papers for later?',
        answer: 'Click the bookmark icon on any research paper to save it to your personal library. Access your saved papers from your profile page.'
      },
      {
        question: 'What are external research insights?',
        answer: 'Our system provides comprehensive insights including related papers, expert courses, webinars, workshops, key authors, and trending topics related to your search.'
      }
    ]
  },
  {
    title: 'Expert Content',
    items: [
      {
        question: 'How do I access courses and webinars?',
        answer: 'Educational content appears automatically in search results. Look for the "Expert Content" section when viewing research details.'
      },
      {
        question: 'Can I apply to become an expert contributor?',
        answer: 'Yes! Visit the Experts page and click "Apply to be an Expert" to submit your application with credentials and expertise areas.'
      },
      {
        question: 'Are the courses free?',
        answer: 'Course availability and pricing depend on the platform provider (Coursera, edX, etc.). We provide direct links to the original course pages.'
      }
    ]
  },
  {
    title: 'Technical Support',
    items: [
      {
        question: 'The search is not returning results',
        answer: 'Try using different keywords, check your spelling, or broaden your search terms. If the issue persists, some sources may be temporarily unavailable.'
      },
      {
        question: 'How do I report a bug?',
        answer: 'Contact us through the Contact page or email support@neuronova.com with details about the issue, including your browser and steps to reproduce.'
      },
      {
        question: 'Can I use the API?',
        answer: 'Yes! Visit our API Documentation page for details on endpoints, authentication, and usage examples.'
      }
    ]
  }
];

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-700 rounded-lg mb-4">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-white">{question}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-slate-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of NeuroNova
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Getting Started Guide</h3>
            <p className="text-slate-400">Learn the basics of using NeuroNova</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">API Documentation</h3>
            <p className="text-slate-400">Integrate NeuroNova into your applications</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 text-center">
            <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Contact Support</h3>
            <p className="text-slate-400">Get help from our support team</p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {FAQ_SECTIONS.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <FAQItem 
                    key={itemIndex}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-slate-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
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
              href="/api-docs"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View API Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
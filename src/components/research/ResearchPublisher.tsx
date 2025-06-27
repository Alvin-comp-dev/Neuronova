'use client';

import React, { useState, useRef } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  CloudArrowUpIcon,
  UserPlusIcon,
  TagIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

interface Author {
  id: string;
  name: string;
  email: string;
  institution: string;
  orcid?: string;
  isCorresponding: boolean;
}

interface ResearchDraft {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  keywords: string[];
  category: string;
  status: 'draft' | 'review' | 'submitted' | 'published';
  lastModified: Date;
  collaborators: string[];
  files: File[];
}

const ResearchPublisher = () => {
  const [currentDraft, setCurrentDraft] = useState<ResearchDraft>({
    id: '',
    title: '',
    abstract: '',
    authors: [],
    keywords: [],
    category: '',
    status: 'draft',
    lastModified: new Date(),
    collaborators: [],
    files: []
  });

  const [drafts, setDrafts] = useState<ResearchDraft[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'format' | 'collaborate' | 'submit'>('write');
  const [showPreview, setShowPreview] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newAuthor, setNewAuthor] = useState<Partial<Author>>({
    name: '',
    email: '',
    institution: '',
    orcid: '',
    isCorresponding: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Neuroscience',
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Vision',
    'Natural Language Processing',
    'Robotics',
    'Data Science',
    'Bioinformatics',
    'Computational Biology',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Medicine',
    'Engineering'
  ];

  const addKeyword = () => {
    if (newKeyword.trim() && !currentDraft.keywords.includes(newKeyword.trim())) {
      setCurrentDraft(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setCurrentDraft(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addAuthor = () => {
    if (newAuthor.name && newAuthor.email && newAuthor.institution) {
      const author: Author = {
        id: Date.now().toString(),
        name: newAuthor.name,
        email: newAuthor.email,
        institution: newAuthor.institution,
        orcid: newAuthor.orcid,
        isCorresponding: newAuthor.isCorresponding || false
      };
      
      setCurrentDraft(prev => ({
        ...prev,
        authors: [...prev.authors, author]
      }));
      
      setNewAuthor({
        name: '',
        email: '',
        institution: '',
        orcid: '',
        isCorresponding: false
      });
    }
  };

  const removeAuthor = (authorId: string) => {
    setCurrentDraft(prev => ({
      ...prev,
      authors: prev.authors.filter(a => a.id !== authorId)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setCurrentDraft(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setCurrentDraft(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const saveDraft = () => {
    const updatedDraft = {
      ...currentDraft,
      id: currentDraft.id || Date.now().toString(),
      lastModified: new Date()
    };
    
    setDrafts(prev => {
      const existingIndex = prev.findIndex(d => d.id === updatedDraft.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedDraft;
        return updated;
      }
      return [...prev, updatedDraft];
    });
    
    setCurrentDraft(updatedDraft);
  };

  const submitForReview = () => {
    const updatedDraft = {
      ...currentDraft,
      status: 'review' as const,
      lastModified: new Date()
    };
    
    setCurrentDraft(updatedDraft);
    saveDraft();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const WriteTab = () => (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Research Title *
        </label>
        <input
          type="text"
          value={currentDraft.title}
          onChange={(e) => setCurrentDraft(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter your research title..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Research Category *
        </label>
        <select
          value={currentDraft.category}
          onChange={(e) => setCurrentDraft(prev => ({ ...prev, category: e.target.value }))}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Abstract */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Abstract *
        </label>
        <textarea
          value={currentDraft.abstract}
          onChange={(e) => setCurrentDraft(prev => ({ ...prev, abstract: e.target.value }))}
          placeholder="Write your research abstract..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          rows={8}
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {currentDraft.abstract.length}/2000 characters
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Keywords
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            placeholder="Add keyword..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={addKeyword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentDraft.keywords.map(keyword => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
            >
              {keyword}
              <button
                onClick={() => removeKeyword(keyword)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Research Files
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <CloudArrowUpIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Click to upload files or drag and drop
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            PDF, DOC, DOCX, TEX files up to 10MB each
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.tex"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {/* File List */}
        {currentDraft.files.length > 0 && (
          <div className="mt-4 space-y-2">
            {currentDraft.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const AuthorsTab = () => (
    <div className="space-y-6">
      {/* Add Author Form */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add Author
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newAuthor.name || ''}
            onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Full Name *"
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            value={newAuthor.email || ''}
            onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email Address *"
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            value={newAuthor.institution || ''}
            onChange={(e) => setNewAuthor(prev => ({ ...prev, institution: e.target.value }))}
            placeholder="Institution *"
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            value={newAuthor.orcid || ''}
            onChange={(e) => setNewAuthor(prev => ({ ...prev, orcid: e.target.value }))}
            placeholder="ORCID ID (optional)"
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="corresponding"
            checked={newAuthor.isCorresponding || false}
            onChange={(e) => setNewAuthor(prev => ({ ...prev, isCorresponding: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="corresponding" className="text-sm text-gray-700 dark:text-gray-300">
            Corresponding author
          </label>
        </div>
        <button
          onClick={addAuthor}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <UserPlusIcon className="w-4 h-4" />
          Add Author
        </button>
      </div>

      {/* Authors List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Authors ({currentDraft.authors.length})
        </h3>
        <div className="space-y-3">
          {currentDraft.authors.map((author, index) => (
            <div key={author.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {index + 1}. {author.name}
                    </h4>
                    {author.isCorresponding && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        Corresponding
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>📧 {author.email}</div>
                    <div>🏛️ {author.institution}</div>
                    {author.orcid && <div>🆔 ORCID: {author.orcid}</div>}
                  </div>
                </div>
                <button
                  onClick={() => removeAuthor(author.id)}
                  className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SubmitTab = () => (
    <div className="space-y-6">
      {/* Submission Checklist */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ClipboardDocumentIcon className="w-5 h-5" />
          Submission Checklist
        </h3>
        
        <div className="space-y-3">
          {[
            { label: 'Title provided', completed: !!currentDraft.title },
            { label: 'Abstract written', completed: !!currentDraft.abstract },
            { label: 'Category selected', completed: !!currentDraft.category },
            { label: 'At least one author added', completed: currentDraft.authors.length > 0 },
            { label: 'Keywords added', completed: currentDraft.keywords.length > 0 },
            { label: 'Research files uploaded', completed: currentDraft.files.length > 0 }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`${
                item.completed 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Options */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Publication Options
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="preprint"
              name="publication-type"
              className="text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="preprint" className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                Publish as Preprint
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Make your research immediately available to the community
              </div>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="journal"
              name="publication-type"
              className="text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="journal" className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                Submit to Journal
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Submit to a peer-reviewed journal for formal publication
              </div>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="conference"
              name="publication-type"
              className="text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="conference" className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                Submit to Conference
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Submit to an academic conference for presentation
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={saveDraft}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={submitForReview}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Submit for Review
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Research Publisher
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Publish and share your research with the global community
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentDraft.status)}`}>
                {currentDraft.status}
              </span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {[
              { id: 'write', label: 'Write', icon: DocumentTextIcon },
              { id: 'format', label: 'Authors', icon: UserPlusIcon },
              { id: 'collaborate', label: 'Collaborate', icon: ShareIcon },
              { id: 'submit', label: 'Submit', icon: CloudArrowUpIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'write' && <WriteTab />}
          {activeTab === 'format' && <AuthorsTab />}
          {activeTab === 'collaborate' && (
            <div className="text-center py-12">
              <ShareIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Collaboration Features
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Coming soon: Real-time collaboration, version control, and peer review
              </p>
            </div>
          )}
          {activeTab === 'submit' && <SubmitTab />}
        </div>
      </div>
    </div>
  );
};

export default ResearchPublisher; 
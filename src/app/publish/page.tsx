'use client';

import React, { useState, useRef, useCallback } from 'react';
import UserAuthGuard from '@/components/common/UserAuthGuard';
import {
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon,
  UserPlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
  ShareIcon
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
}

const PublishPage = () => {
  const [currentDraft, setCurrentDraft] = useState<ResearchDraft>({
    id: '',
    title: '',
    abstract: '',
    authors: [],
    keywords: [],
    category: '',
    status: 'draft',
    lastModified: new Date()
  });

  const [activeTab, setActiveTab] = useState<'write' | 'authors' | 'collaborate' | 'submit'>('write');
  const [newKeyword, setNewKeyword] = useState('');
  const [newAuthor, setNewAuthor] = useState<Partial<Author>>({
    name: '',
    email: '',
    institution: '',
    orcid: '',
    isCorresponding: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
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

  // Stable handlers using useCallback to prevent re-renders
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDraft(prev => ({ ...prev, title: e.target.value }));
  }, []);

  const handleAbstractChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentDraft(prev => ({ ...prev, abstract: e.target.value }));
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDraft(prev => ({ ...prev, category: e.target.value }));
  }, []);

  const addKeyword = useCallback(() => {
    if (newKeyword.trim() && !currentDraft.keywords.includes(newKeyword.trim())) {
      setCurrentDraft(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  }, [newKeyword, currentDraft.keywords]);

  const removeKeyword = useCallback((keyword: string) => {
    setCurrentDraft(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  }, []);

  const addAuthor = useCallback(() => {
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
  }, [newAuthor]);

  const removeAuthor = useCallback((authorId: string) => {
    setCurrentDraft(prev => ({
      ...prev,
      authors: prev.authors.filter(a => a.id !== authorId)
    }));
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const publishToGlobal = async () => {
    try {
      setIsUploading(true);
      setUploadError('');
      
      const researchData = {
        title: currentDraft.title,
        abstract: currentDraft.abstract,
        authors: currentDraft.authors,
        keywords: currentDraft.keywords,
        category: currentDraft.category,
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };

      console.log('📤 Publishing research:', researchData);

      const response = await fetch('/api/research/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(researchData)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`HTTP ${response.status}: Failed to publish`);
      }

      const result = await response.json();
      console.log('✅ Publication result:', result);

      if (result.success) {
        setCurrentDraft(prev => ({ ...prev, status: 'published' }));
        alert(`🎉 Research "${result.data.title}" successfully published to the global community!\n\nYour research is now visible in the research feed and can be discovered by other users.`);
      } else {
        throw new Error(result.error || 'Publication failed');
      }
      
    } catch (error) {
      console.error('Publication error:', error);
      setUploadError(`Failed to publish research: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isReadyToPublish = () => {
    return !!(
      currentDraft.title.trim() &&
      currentDraft.abstract.trim().length >= 100 &&
      currentDraft.authors.length >= 1 &&
      currentDraft.keywords.length >= 3 &&
      currentDraft.category &&
      files.length > 0
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100';
      case 'review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300';
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300';
      default: return 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100';
    }
  };

  return (
    <UserAuthGuard>
      <style jsx>{`
        select {
          color-scheme: dark;
        }
        select option {
          background-color: #1e293b !important;
          color: #ffffff !important;
        }
      `}</style>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <div className="border-b border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Research Publisher
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Publish and share your research with the global community
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentDraft.status)}`}>
                  {currentDraft.status}
                </span>
              </div>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="flex">
                {[
                  { id: 'write', label: 'Write', icon: DocumentTextIcon },
                  { id: 'authors', label: 'Authors', icon: UserPlusIcon },
                  { id: 'collaborate', label: 'Collaborate', icon: ShareIcon },
                  { id: 'submit', label: 'Submit', icon: CloudArrowUpIcon }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'write' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Research Title *
                    </label>
                    <input
                      type="text"
                      value={currentDraft.title}
                      onChange={handleTitleChange}
                      placeholder="Enter your research title..."
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Research Category *
                    </label>
                    <select
                      value={currentDraft.category}
                      onChange={handleCategoryChange}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      style={{
                        colorScheme: 'dark'
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Abstract *
                    </label>
                    <textarea
                      value={currentDraft.abstract}
                      onChange={handleAbstractChange}
                      placeholder="Write your research abstract..."
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white resize-none"
                      rows={8}
                    />
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {currentDraft.abstract.length} characters (minimum 100 required)
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Keywords * (minimum 3)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        placeholder="Add a keyword..."
                        className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      />
                      <button
                        onClick={addKeyword}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentDraft.keywords.map((keyword, index) => (
                        <span
                          key={`keyword-${index}`}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Research Files *
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <CloudArrowUpIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        Upload your research files (PDF, DOC, DOCX)
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Choose Files
                      </button>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div key={`file-${index}`} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <DocumentTextIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white">{file.name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
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
              )}

              {activeTab === 'authors' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Add Author
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newAuthor.name || ''}
                        onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Full Name *"
                        className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      />
                      <input
                        type="email"
                        value={newAuthor.email || ''}
                        onChange={(e) => setNewAuthor(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email Address *"
                        className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        value={newAuthor.institution || ''}
                        onChange={(e) => setNewAuthor(prev => ({ ...prev, institution: e.target.value }))}
                        placeholder="Institution/Affiliation *"
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={addAuthor}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <UserPlusIcon className="w-4 h-4" />
                      Add Author
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Authors ({currentDraft.authors.length})
                    </h3>
                    <div className="space-y-3">
                      {currentDraft.authors.map((author, index) => (
                        <div key={author.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {index + 1}. {author.name}
                              </h4>
                              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                                <div>📧 {author.email}</div>
                                <div>🏛️ {author.institution}</div>
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
              )}

              {activeTab === 'collaborate' && (
                <div className="text-center py-12">
                  <ShareIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Collaboration Features
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Coming soon: Real-time collaboration, version control, and peer review
                  </p>
                </div>
              )}

              {activeTab === 'submit' && (
                <div className="space-y-6">
                  {currentDraft.status === 'published' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          Research Published Successfully!
                        </span>
                      </div>
                      <p className="text-green-800 dark:text-green-200 mt-2">
                        Your research is now available to the global community and can be discovered through search.
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-900 dark:text-red-100">
                          Publication Error
                        </span>
                      </div>
                      <p className="text-red-800 dark:text-red-200 mt-2">{uploadError}</p>
                    </div>
                  )}

                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <ClipboardDocumentIcon className="w-5 h-5" />
                      Publication Checklist
                    </h3>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'Title provided', completed: !!currentDraft.title },
                        { label: 'Abstract written (min 100 chars)', completed: currentDraft.abstract.length >= 100 },
                        { label: 'Category selected', completed: !!currentDraft.category },
                        { label: 'At least one author added', completed: currentDraft.authors.length > 0 },
                        { label: 'Keywords added (min 3)', completed: currentDraft.keywords.length >= 3 },
                        { label: 'Research files uploaded', completed: files.length > 0 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {item.completed ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className={`${
                            item.completed 
                              ? 'text-slate-900 dark:text-white' 
                              : 'text-slate-600 dark:text-slate-400'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={publishToGlobal}
                      disabled={!isReadyToPublish() || isUploading || currentDraft.status === 'published'}
                      className={`flex-1 px-6 py-3 rounded-lg transition-colors font-semibold ${
                        isReadyToPublish() && currentDraft.status !== 'published'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Publishing...
                        </div>
                      ) : currentDraft.status === 'published' ? (
                        '✅ Published'
                      ) : (
                        '🌍 Publish to Global Community'
                      )}
                    </button>
                  </div>

                  {!isReadyToPublish() && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                      Complete all checklist items above to publish your research
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserAuthGuard>
  );
};

export default PublishPage; 
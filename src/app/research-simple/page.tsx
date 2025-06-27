'use client';

import { useState, useEffect } from 'react';

export default function SimpleResearchPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      console.log('🔬 Simple Research: Starting fetch...');
      try {
        const response = await fetch('/api/research?limit=12');
        const data = await response.json();
        
        console.log('🔬 Simple Research: API Response:', data);
        
        if (data.success && data.data) {
          console.log('🔬 Simple Research: Setting articles:', data.data.length);
          setArticles(data.data);
        }
      } catch (error) {
        console.error('🔬 Simple Research: Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  console.log('🔬 Simple Research: Rendering with articles.length:', articles.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-3xl mb-4">Simple Research Page</h1>
        <div className="text-yellow-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl mb-4">Simple Research Page</h1>
      
      <div className="mb-4 text-lg">
        Found {articles.length} articles
      </div>

      {articles.length === 0 ? (
        <div className="text-red-400 text-xl">❌ NO ARTICLES FOUND</div>
      ) : (
        <div className="space-y-4">
          <div className="text-green-400 text-xl">✅ ARTICLES FOUND: {articles.length}</div>
          {articles.map((article, index) => (
            <div key={article._id || index} className="bg-slate-800 p-4 rounded">
              <h3 className="font-bold text-lg text-blue-400">{article.title}</h3>
              <p className="text-slate-300 text-sm mt-2">
                {article.abstract?.substring(0, 200)}...
              </p>
              <div className="mt-2 text-xs text-slate-400">
                Categories: {article.categories?.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
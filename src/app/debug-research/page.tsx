'use client';

import { useState, useEffect } from 'react';

export default function DebugResearch() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('🐛 Debug: Starting fetch...');
      try {
        const url = '/api/research?limit=5';
        console.log('🐛 Debug: Fetching URL:', url);
        
        const response = await fetch(url);
        console.log('🐛 Debug: Response status:', response.status);
        console.log('🐛 Debug: Response ok:', response.ok);
        
        const data = await response.json();
        console.log('🐛 Debug: Raw response data:', data);
        
        setApiResponse(data);
        
        if (data.success && data.data) {
          console.log('🐛 Debug: Setting articles, count:', data.data.length);
          setArticles(data.data);
        } else {
          console.log('🐛 Debug: API success false or no data');
          setError('API returned success: false or no data');
        }
      } catch (err) {
        console.error('🐛 Debug: Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Research Page</h1>
      
      <div className="mb-6 p-4 bg-slate-800 rounded">
        <h2 className="text-xl mb-2">State:</h2>
        <div>Loading: {loading.toString()}</div>
        <div>Error: {error || 'None'}</div>
        <div>Articles Count: {articles.length}</div>
      </div>

      <div className="mb-6 p-4 bg-slate-800 rounded">
        <h2 className="text-xl mb-2">Raw API Response:</h2>
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl mb-4">Articles ({articles.length}):</h2>
        
        {loading && (
          <div className="text-yellow-400">Loading...</div>
        )}
        
        {error && (
          <div className="text-red-400">Error: {error}</div>
        )}
        
        {!loading && !error && articles.length === 0 && (
          <div className="text-red-400 text-lg">❌ NO ARTICLES FOUND</div>
        )}
        
        {articles.length > 0 && (
          <div className="space-y-4">
            <div className="text-green-400 text-lg">✅ ARTICLES FOUND: {articles.length}</div>
            {articles.map((article, index) => (
              <div key={article._id || index} className="bg-slate-700 p-4 rounded">
                <h3 className="font-bold text-lg text-blue-400">{article.title}</h3>
                <p className="text-slate-300 text-sm mt-2">
                  {article.abstract?.substring(0, 150)}...
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  ID: {article._id} | Categories: {article.categories?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
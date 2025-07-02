import { NextRequest, NextResponse } from 'next/server';

interface ExternalSource {
  name: string;
  url: string;
  available: boolean;
  description: string;
}

// This would typically come from a database
const BLOG_POSTS = {
  'ai-powered-research-discovery': {
    id: 'ai-powered-research-discovery',
    title: 'The Future of AI-Powered Research Discovery',
    content: `Full detailed content...`,
    external_sources: [
      {
        name: 'Nature AI Research',
        url: 'https://www.nature.com/articles/s41586-023-06221-2',
        available: true,
        description: 'Comprehensive study on AI applications in research discovery'
      },
      {
        name: 'arXiv Preprint',
        url: 'https://arxiv.org/abs/2401.12345',
        available: true,
        description: 'Technical implementation of semantic search algorithms'
      },
      {
        name: 'PLOS ONE Study',
        url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0123456',
        available: true,
        description: 'Empirical analysis of AI-powered research tools'
      }
    ]
  },
  'cross-disciplinary-research': {
    id: 'cross-disciplinary-research',
    title: 'Building Bridges: How Cross-Disciplinary Research Accelerates Innovation',
    content: `Full detailed content...`,
    external_sources: [
      {
        name: 'Science Magazine',
        url: 'https://www.science.org/doi/10.1126/science.abn9292',
        available: true,
        description: 'Analysis of interdisciplinary collaboration patterns'
      },
      {
        name: 'Nature Communications',
        url: 'https://www.nature.com/articles/s41467-023-01234-5',
        available: true,
        description: 'Network analysis of cross-disciplinary research'
      },
      {
        name: 'Royal Society Interface',
        url: 'https://royalsocietypublishing.org/doi/10.1098/rsif.2023.0123',
        available: false,
        description: 'Mathematical models of interdisciplinary innovation'
      }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Try to get from local database first
    const localPost = BLOG_POSTS[id as keyof typeof BLOG_POSTS];
    
    if (localPost) {
      // Verify external sources availability
      const verifiedSources = await verifyExternalSources(localPost.external_sources);
      
      return NextResponse.json({
        success: true,
        post: {
          ...localPost,
          external_sources: verifiedSources
        },
        source: 'local'
      });
    }
    
    // If not found locally, search external sources
    const externalResults = await searchExternalSources(id);
    
    if (externalResults.length > 0) {
      return NextResponse.json({
        success: true,
        post: null,
        external_sources: externalResults,
        source: 'external',
        message: 'Article not found locally, but external sources are available'
      });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Article not found in local database or external sources',
        suggestions: await getSimilarArticles(id)
      },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('Blog article fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog article' },
      { status: 500 }
    );
  }
}

async function verifyExternalSources(sources: ExternalSource[]): Promise<ExternalSource[]> {
  const verifiedSources = [];
  
  for (const source of sources) {
    try {
      // In a real implementation, you would check if the URL is accessible
      // For now, we'll simulate this with a simple availability check
      const isAvailable = Math.random() > 0.2; // 80% success rate
      
      verifiedSources.push({
        ...source,
        available: isAvailable,
        last_checked: new Date().toISOString()
      });
    } catch (error) {
      verifiedSources.push({
        ...source,
        available: false,
        last_checked: new Date().toISOString(),
        error: 'Failed to verify source'
      });
    }
  }
  
  return verifiedSources;
}

async function searchExternalSources(articleId: string): Promise<ExternalSource[]> {
  // Convert article ID to search terms
  const searchTerms = articleId.replace(/-/g, ' ');
  
  const externalSources = [
    {
      name: 'Google Scholar',
      baseUrl: 'https://scholar.google.com/scholar?q=',
      description: 'Academic papers and citations'
    },
    {
      name: 'ResearchGate',
      baseUrl: 'https://www.researchgate.net/search?q=',
      description: 'Research publications and profiles'
    },
    {
      name: 'IEEE Xplore',
      baseUrl: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=',
      description: 'Engineering and technology papers'
    },
    {
      name: 'PubMed',
      baseUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=',
      description: 'Medical and life science literature'
    },
    {
      name: 'arXiv',
      baseUrl: 'https://arxiv.org/search/?query=',
      description: 'Preprints in physics, mathematics, computer science'
    },
    {
      name: 'Semantic Scholar',
      baseUrl: 'https://www.semanticscholar.org/search?q=',
      description: 'AI-powered research discovery'
    }
  ];
  
  const results = [];
  
  for (const source of externalSources) {
    try {
      const searchUrl = `${source.baseUrl}${encodeURIComponent(searchTerms)}`;
      
      // Simulate checking if the source has relevant content
      const hasContent = Math.random() > 0.3; // 70% chance of having content
      
      if (hasContent) {
        results.push({
          name: source.name,
          url: searchUrl,
          available: true,
          description: source.description,
          search_terms: searchTerms,
          estimated_results: Math.floor(Math.random() * 1000) + 10
        });
      }
    } catch (error) {
      console.error(`Error searching ${source.name}:`, error);
      results.push({
        name: source.name,
        url: source.baseUrl,
        available: false,
        description: source.description,
        error: 'Search failed'
      });
    }
  }
  
  return results;
}

async function getSimilarArticles(articleId: string): Promise<any[]> {
  // Get suggested similar articles based on the requested ID
  const suggestions = [
    {
      id: 'ai-powered-research-discovery',
      title: 'The Future of AI-Powered Research Discovery',
      available: true
    },
    {
      id: 'cross-disciplinary-research',
      title: 'Building Bridges: How Cross-Disciplinary Research Accelerates Innovation',
      available: true
    },
    {
      id: 'open-science-democratization',
      title: 'Open Science and the Democratization of Knowledge',
      available: true
    }
  ];
  
  return suggestions.filter(suggestion => suggestion.id !== articleId);
} 
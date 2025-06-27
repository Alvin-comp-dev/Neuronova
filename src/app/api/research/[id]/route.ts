import { NextRequest, NextResponse } from 'next/server';
import { ExternalApiService } from '../../../../../server/services/externalApiService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log('🔍 Fetching individual research article:', id);
    
    // First try to fetch from the main research API (local database)
    const response = await fetch(`${request.nextUrl.origin}/api/research`);
    const data = await response.json();
    
    if (data.success && data.data) {
      // Find the specific article in main research data
      const article = data.data.find((article: any) => article._id === id || article.doi === id);
      
      if (article) {
        console.log('✅ Found article in main research API:', article.title);
        
        // Format the article for the detail view
        const formattedArticle = {
          _id: article._id,
          title: article.title,
          abstract: article.abstract,
          content: article.abstract, // Use abstract as content
          authors: article.authors || [],
          categories: article.categories || [],
          tags: article.tags || [],
          keywords: article.keywords || article.tags || [],
          source: article.source || { name: 'Unknown Source', url: '', type: 'journal' },
          doi: article.doi,
          publicationDate: article.publicationDate,
          citationCount: article.citationCount || 0,
          viewCount: (article.viewCount || 0) + 1,
          bookmarkCount: article.bookmarkCount || 0,
          trendingScore: article.trendingScore || 0,
          status: article.status || 'published',
          metrics: article.metrics || {
            impactScore: 0,
            readabilityScore: 0,
            noveltyScore: 0
          },
          isLocal: true
        };
        
        return NextResponse.json({
          success: true,
          data: formattedArticle
        });
      }
    }

    // If not found in local database, check if it's a DOI and try to fetch from external APIs
    console.log('🌐 Article not found locally, checking external APIs for DOI:', id);
    
    if (id.includes('.') || id.includes('/')) { // Basic DOI pattern check
      try {
        // For DOI lookups, create a mock article with the DOI information
        // This provides a consistent experience even when external APIs don't return results
        const mockExternalArticle = {
          _id: id,
          title: `Research Article (DOI: ${id})`,
          abstract: `This research article is available through its DOI: ${id}. Click the DOI link below to access the full article from the original publisher.`,
          content: `This is an external research article identified by DOI: ${id}. The full content is available through the publisher's website.`,
          authors: [{ name: 'External Authors', affiliation: '' }],
          categories: ['external'],
          tags: ['external-source'],
          keywords: ['research', 'external'],
          source: { 
            name: 'External Publisher', 
            url: `https://doi.org/${id}`, 
            type: 'journal' 
          },
          doi: id,
          publicationDate: new Date().toISOString(),
          citationCount: 0,
          viewCount: 0,
          bookmarkCount: 0,
          trendingScore: 0,
          status: 'published',
          metrics: {
            impactScore: 0,
            readabilityScore: 0,
            noveltyScore: 0
          },
          isLocal: false,
          isExternal: true
        };
        
        // Try to search external APIs for this specific DOI/identifier
        try {
          const searchResults = await ExternalApiService.enhancedSearch(id, {
            maxResults: 3,
            sources: ['pubmed', 'arxiv', 'biorxiv']
          });
          
          if (searchResults && searchResults.length > 0) {
            // Find the best match (exact DOI match or first result)
            const matchedArticle = searchResults.find(article => 
              article.doi === id || 
              article._id === id ||
              (article.doi && article.doi.includes(id)) ||
              (id.includes(article.doi) && article.doi.length > 5)
            ) || searchResults[0];
            
            if (matchedArticle) {
              console.log('✅ Found article in external APIs:', matchedArticle.title);
              
              const formattedExternalArticle = {
                _id: matchedArticle._id || id,
                title: matchedArticle.title,
                abstract: matchedArticle.abstract || mockExternalArticle.abstract,
                content: matchedArticle.abstract || mockExternalArticle.content,
                authors: matchedArticle.authors || mockExternalArticle.authors,
                categories: matchedArticle.categories || mockExternalArticle.categories,
                tags: matchedArticle.tags || mockExternalArticle.tags,
                keywords: matchedArticle.keywords || matchedArticle.tags || mockExternalArticle.keywords,
                source: matchedArticle.source || { name: 'External Source', url: `https://doi.org/${id}`, type: 'journal' },
                doi: matchedArticle.doi || id,
                publicationDate: matchedArticle.publicationDate || mockExternalArticle.publicationDate,
                citationCount: matchedArticle.citationCount || 0,
                viewCount: matchedArticle.viewCount || 0,
                bookmarkCount: matchedArticle.bookmarkCount || 0,
                trendingScore: matchedArticle.trendingScore || 0,
                status: matchedArticle.status || 'published',
                metrics: matchedArticle.metrics || {
                  impactScore: matchedArticle.impactScore || 0,
                  readabilityScore: matchedArticle.readabilityScore || 0,
                  noveltyScore: matchedArticle.noveltyScore || 0
                },
                isLocal: false,
                isExternal: true
              };
              
              return NextResponse.json({
                success: true,
                data: formattedExternalArticle
              });
            }
          }
        } catch (searchError) {
          console.warn('⚠️ External API search failed, using mock data:', searchError);
        }
        
        // If no external results found, return the mock article
        console.log('📄 Using mock article for DOI:', id);
        return NextResponse.json({
          success: true,
          data: mockExternalArticle
        });
        
      } catch (externalError) {
        console.warn('⚠️ Error handling external article:', externalError);
      }
    }
    
    // If not found in main research API, try recommendations API
    console.log('🔍 Article not found in main research API, checking recommendations...');
    
    try {
      const recommendationsResponse = await fetch(`${request.nextUrl.origin}/api/recommendations?limit=100&algorithm=hybrid&userId=user1`);
      const recommendationsData = await recommendationsResponse.json();
      
      if (recommendationsData.success && recommendationsData.data) {
        const recommendedArticle = recommendationsData.data.find((article: any) => article._id === id);
        
        if (recommendedArticle) {
          console.log('✅ Found article in recommendations API:', recommendedArticle.title);
          
          // Format the article for the detail view
          const formattedArticle = {
            _id: recommendedArticle._id,
            title: recommendedArticle.title,
            abstract: recommendedArticle.abstract,
            content: recommendedArticle.abstract, // Use abstract as content
            authors: recommendedArticle.authors || [],
            categories: recommendedArticle.categories || [],
            tags: recommendedArticle.tags || [],
            keywords: recommendedArticle.keywords || recommendedArticle.tags || [],
            source: recommendedArticle.source || { name: 'Unknown Source', url: '', type: 'journal' },
            doi: recommendedArticle.doi,
            publicationDate: recommendedArticle.publicationDate,
            citationCount: recommendedArticle.citationCount || 0,
            viewCount: (recommendedArticle.viewCount || 0) + 1,
            bookmarkCount: recommendedArticle.bookmarkCount || 0,
            trendingScore: recommendedArticle.trendingScore || 0,
            status: recommendedArticle.status || 'published',
            metrics: recommendedArticle.metrics || {
              impactScore: 0,
              readabilityScore: 0,
              noveltyScore: 0
            }
          };
          
          return NextResponse.json({
            success: true,
            data: formattedArticle
          });
        }
      }
    } catch (recommendationsError) {
      console.log('⚠️ Error checking recommendations API:', recommendationsError);
    }
    
    // Article not found in either source
    console.log('❌ Article not found:', id);
    return NextResponse.json({
      success: false,
      error: 'Research article not found'
    }, { status: 404 });
    
  } catch (error: any) {
    console.error('❌ Error fetching research article:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch research article'
    }, { status: 500 });
  }
}

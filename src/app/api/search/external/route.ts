import { NextRequest, NextResponse } from 'next/server';
import { externalResearchService } from '@/lib/services/externalResearchService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // 'papers', 'expert', 'all'
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 External search request: "${query}" (type: ${type}, limit: ${limit})`);

    let result;

    switch (type) {
      case 'papers':
        const papers = await externalResearchService.searchResearch(query, limit);
        result = { papers, expertContent: [], relatedTopics: [], keyAuthors: [] };
        break;
      
      case 'expert':
        const expertContent = await externalResearchService.searchExpertContent(query, limit);
        result = { papers: [], expertContent, relatedTopics: [], keyAuthors: [] };
        break;
      
      case 'insights':
        // Extract keywords from the query for more comprehensive search
        const keywords = query.split(' ').filter(word => word.length > 3);
        result = await externalResearchService.getResearchInsights(query, keywords);
        break;
      
      default: // 'all'
        result = await externalResearchService.getResearchInsights(query, []);
        break;
    }

    console.log(`✅ External search completed: ${result.papers.length} papers, ${result.expertContent.length} expert content`);

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        query,
        type,
        timestamp: new Date().toISOString(),
        resultCounts: {
          papers: result.papers.length,
          expertContent: result.expertContent.length,
          relatedTopics: result.relatedTopics.length,
          keyAuthors: result.keyAuthors.length
        }
      }
    });

  } catch (error) {
    console.error('❌ External search error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search external sources',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, keywords = [], categories = [], tags = [] } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Comprehensive research insights for: "${title}"`);

    // Combine all search terms
    const allKeywords = [...keywords, ...categories, ...tags].filter(Boolean);
    
    const insights = await externalResearchService.getResearchInsights(title, allKeywords);

    console.log(`✅ Research insights completed: ${insights.papers.length} papers, ${insights.expertContent.length} expert resources`);

    return NextResponse.json({
      success: true,
      data: insights,
      meta: {
        title,
        keywords: allKeywords,
        timestamp: new Date().toISOString(),
        resultCounts: {
          papers: insights.papers.length,
          expertContent: insights.expertContent.length,
          relatedTopics: insights.relatedTopics.length,
          keyAuthors: insights.keyAuthors.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Research insights error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get research insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
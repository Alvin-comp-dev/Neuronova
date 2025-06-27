import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import { ResearchModel } from '@/lib/models/Research';
import { ExternalApiService } from '../../../../server/services/externalApiService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all'; // 'local', 'external', 'all'
  const categories = searchParams.get('categories')?.split(',') || [];
  const sources = searchParams.get('sources')?.split(',') || [];
  const authors = searchParams.get('authors')?.split(',') || [];
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const minCitations = searchParams.get('minCitations');
  const maxCitations = searchParams.get('maxCitations');
  const minImpact = searchParams.get('minImpact');
  const maxImpact = searchParams.get('maxImpact');

  const skip = (page - 1) * limit;

  console.log('🔍 Search API called with parameters:', {
    query,
    type,
    categories,
    sources,
    authors,
    sortBy,
    limit,
    page
  });

  try {
    await connectMongoose();

    let localResults: any[] = [];
    let externalResults: any[] = [];

    // Search local database
    if (type === 'local' || type === 'all') {
      const searchOptions = {
        categories,
        sources,
        authors,
        dateRange: {
          from: dateFrom,
          to: dateTo
        },
        citationRange: {
          min: minCitations ? parseInt(minCitations) : undefined,
          max: maxCitations ? parseInt(maxCitations) : undefined
        },
        impactRange: {
          min: minImpact ? parseFloat(minImpact) : undefined,
          max: maxImpact ? parseFloat(maxImpact) : undefined
        },
        status: ['published', 'preprint'],
        limit,
        skip,
        sortBy
      };

      if (query) {
        localResults = await ResearchModel.fullTextSearch(query, searchOptions);
      } else {
        localResults = await ResearchModel.advancedSearch({
          ...searchOptions,
          query: null
        });
      }
    }

    // Search external APIs
    if (type === 'external' || type === 'all') {
      // Search external APIs if we have a query OR if we have categories (for category-based browsing)
      if (query || categories.length > 0) {
        try {
          // Use category name as search term if no query provided
          const searchTerm = query || (categories.length > 0 ? categories[0] : '');
          console.log('🌐 Searching external APIs with term:', searchTerm, 'categories:', categories);
          externalResults = await ExternalApiService.enhancedSearch(searchTerm, {
            sources: sources.length > 0 ? sources : ['pubmed', 'arxiv', 'biorxiv'],
            maxResults: limit,
            categories
          });
          console.log('📊 External search results:', externalResults.length, 'articles found');
        } catch (error) {
          console.error('External API search error:', error);
          // Continue with local results only
        }
      } else {
        console.log('⏭️ Skipping external search - no query or categories provided');
      }
    }

    // Combine and format results
    const allResults = [
      ...localResults.map((article: any) => ({
        _id: article._id.toString(),
        title: article.title,
        abstract: article.abstract,
        authors: article.authors || [],
        categories: article.categories || [],
        tags: article.tags || article.keywords || [],
        source: article.source || { name: 'Unknown Source', url: '', type: 'journal' },
        doi: article.doi,
        pmid: article.pmid,
        arxivId: article.arxivId,
        publicationDate: article.publicationDate,
        citationCount: article.citationCount || 0,
        viewCount: article.viewCount || 0,
        bookmarkCount: article.bookmarkCount || 0,
        trendingScore: article.trendingScore || 0,
        status: article.status || 'published',
        keywords: article.keywords || [],
        metrics: article.metrics || {
          impactScore: 0,
          readabilityScore: 0,
          noveltyScore: 0
        },
        searchScore: article.score || 0,
        isLocal: true
      })),
      ...externalResults.map((article: any) => ({
        ...article,
        _id: article.doi || article.pmid || article.arxivId || Math.random().toString(),
        searchScore: 0,
        isLocal: false
      }))
    ];

    // Sort combined results if needed
    if (sortBy === 'relevance' && query) {
      allResults.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
    }

    return NextResponse.json({
      success: true,
      data: allResults.slice(0, limit),
      pagination: {
        page,
        limit,
        total: allResults.length,
        hasMore: allResults.length > limit
      },
      meta: {
        query,
        localCount: localResults.length,
        externalCount: externalResults.length,
        totalCount: allResults.length
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      data: []
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      query, 
      filters = {},
      pagination = { page: 1, limit: 20 },
      sort = { by: 'relevance', order: 'desc' }
    } = body;

    await connectMongoose();

    const searchParams = {
      query,
      categories: filters.categories || [],
      authors: filters.authors || [],
      sources: filters.sources || [],
      dateRange: filters.dateRange || {},
      citationRange: filters.citationRange || {},
      impactRange: filters.impactRange || {},
      status: filters.status || ['published', 'preprint'],
      limit: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      sortBy: sort.by
    };

    const results = await ResearchModel.advancedSearch(searchParams);
    
    return NextResponse.json({
      success: true,
      data: results.map((article: any) => ({
        _id: article._id.toString(),
        title: article.title,
        abstract: article.abstract,
        authors: article.authors || [],
        categories: article.categories || [],
        tags: article.tags || article.keywords || [],
        source: article.source || { name: 'Unknown Source', url: '', type: 'journal' },
        doi: article.doi,
        publicationDate: article.publicationDate,
        citationCount: article.citationCount || 0,
        viewCount: article.viewCount || 0,
        bookmarkCount: article.bookmarkCount || 0,
        trendingScore: article.trendingScore || 0,
        status: article.status || 'published',
        keywords: article.keywords || [],
        metrics: article.metrics || {
          impactScore: 0,
          readabilityScore: 0,
          noveltyScore: 0
        },
        searchScore: article.score || 0
      })),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: results.length
      }
    });

  } catch (error) {
    console.error('Advanced search API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Advanced search failed',
      data: []
    }, { status: 500 });
  }
} 
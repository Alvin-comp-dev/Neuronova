import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Research from '@/lib/models/Research';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: []
      });
    }

    await connectToDatabase();

    // Create regex for case-insensitive partial matching
    const regex = new RegExp(query, 'i');

    // Get keyword suggestions from article titles, abstracts, and tags
    const keywordSuggestions = await Research.aggregate([
      {
        $match: {
          $or: [
            { title: regex },
            { abstract: regex },
            { tags: regex },
            { keywords: regex }
          ]
        }
      },
      {
        $project: {
          title: 1,
          tags: 1,
          keywords: 1
        }
      },
      { $limit: 10 }
    ]);

    // Get author suggestions
    const authorSuggestions = await Research.aggregate([
      { $unwind: '$authors' },
      {
        $match: {
          'authors.name': regex
        }
      },
      {
        $group: {
          _id: '$authors.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get category suggestions
    const categorySuggestions = await Research.aggregate([
      { $unwind: '$categories' },
      {
        $match: {
          categories: regex
        }
      },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Format suggestions
    const suggestions = [];

    // Add keyword suggestions
    const uniqueKeywords = new Set<string>();
    keywordSuggestions.forEach(article => {
      // Add matching keywords from keywords array
      article.keywords?.forEach((keyword: string) => {
        if (keyword.toLowerCase().includes(query.toLowerCase()) && !uniqueKeywords.has(keyword)) {
          uniqueKeywords.add(keyword);
          suggestions.push({
            id: `keyword-${keyword}`,
            text: keyword,
            type: 'keyword',
            count: 1
          });
        }
      });

      // Add matching tags
      article.tags?.forEach((tag: string) => {
        if (tag.toLowerCase().includes(query.toLowerCase()) && !uniqueKeywords.has(tag)) {
          uniqueKeywords.add(tag);
          suggestions.push({
            id: `keyword-${tag}`,
            text: tag,
            type: 'keyword',
            count: 1
          });
        }
      });

      // Add title-based suggestions
      if (article.title.toLowerCase().includes(query.toLowerCase())) {
        const words = article.title.split(' ').filter(word => 
          word.toLowerCase().includes(query.toLowerCase()) && 
          word.length > 3 &&
          !uniqueKeywords.has(word)
        );
        words.forEach(word => {
          uniqueKeywords.add(word);
          suggestions.push({
            id: `keyword-${word}`,
            text: word,
            type: 'keyword',
            count: 1
          });
        });
      }
    });

    // Add author suggestions
    authorSuggestions.forEach(author => {
      suggestions.push({
        id: `author-${author._id}`,
        text: author._id,
        type: 'author',
        count: author.count
      });
    });

    // Add category suggestions
    categorySuggestions.forEach(category => {
      suggestions.push({
        id: `category-${category._id}`,
        text: category._id,
        type: 'category',
        count: category.count
      });
    });

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.text.toLowerCase() === suggestion.text.toLowerCase())
      )
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      suggestions: uniqueSuggestions
    });

  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch search suggestions',
        suggestions: []
      },
      { status: 500 }
    );
  }
} 
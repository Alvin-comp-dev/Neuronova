import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function setupSearchIndexes() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const mongoUri = process.env['MONGODB_URI'];
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log('✅ Connected to MongoDB');

    // Import the Research model
    const { default: Research } = await import('../models/Research');

    console.log('🔄 Setting up search indexes...');

    // Check existing indexes first
    const existingIndexes = await Research.collection.listIndexes().toArray();
    const existingIndexNames = existingIndexes.map((idx: any) => idx.name);
    console.log('📋 Existing indexes:', existingIndexNames);

    // Drop old text index if exists to recreate with new weights
    const textIndexNames = ['title_text_abstract_text_keywords_text', 'research_text_search'];
    for (const indexName of textIndexNames) {
      if (existingIndexNames.includes(indexName)) {
        console.log(`🗑️ Dropping existing text index: ${indexName}`);
        try {
          await Research.collection.dropIndex(indexName);
        } catch (error) {
          console.log(`⚠️ Could not drop index ${indexName}:`, error);
        }
      }
    }

    // Create text indexes for full-text search
    console.log('Creating text search indexes...');
    try {
      await Research.collection.createIndex({
        title: 'text',
        abstract: 'text',
        keywords: 'text',
        content: 'text',
        'authors.name': 'text'
      }, {
        weights: {
          title: 10,
          keywords: 8,
          abstract: 5,
          'authors.name': 3,
          content: 1
        },
        name: 'research_text_search'
      });
      console.log('✅ Text search index created successfully');
    } catch (error) {
      console.log('⚠️ Text search index already exists or could not be created:', error.message);
    }

    // Create compound indexes for common query patterns
    console.log('Creating compound indexes...');
    
    const compoundIndexes = [
      { index: { categories: 1, publicationDate: -1 }, name: 'categories_date' },
      { index: { trendingScore: -1, publicationDate: -1 }, name: 'trending_date' },
      { index: { citationCount: -1, publicationDate: -1 }, name: 'citations_date' },
      { index: { status: 1, categories: 1, publicationDate: -1 }, name: 'status_categories_date' },
      { index: { 'metrics.impactScore': -1, publicationDate: -1 }, name: 'impact_date' },
      { index: { 'authors.name': 1, publicationDate: -1 }, name: 'authors_date' },
      { index: { 'source.name': 1, publicationDate: -1 }, name: 'source_date' },
      { index: { keywords: 1, trendingScore: -1 }, name: 'keywords_trending' }
    ];

    for (const { index, name } of compoundIndexes) {
      try {
        await Research.collection.createIndex(index, { name });
        console.log(`✅ Created compound index: ${name}`);
      } catch (error: any) {
        if (error.code === 85) {
          console.log(`⚠️ Index ${name} already exists with different options`);
        } else {
          console.log(`⚠️ Could not create index ${name}:`, error.message);
        }
      }
    }

    // Create single field indexes
    console.log('Creating single field indexes...');
    
    const singleIndexes = [
      { index: { doi: 1 }, options: { unique: true, sparse: true }, name: 'doi' },
      { index: { pmid: 1 }, options: { unique: true, sparse: true }, name: 'pmid' },
      { index: { arxivId: 1 }, options: { unique: true, sparse: true }, name: 'arxivId' },
      { index: { publicationDate: -1 }, options: {}, name: 'publicationDate' },
      { index: { citationCount: -1 }, options: {}, name: 'citationCount' },
      { index: { viewCount: -1 }, options: {}, name: 'viewCount' },
      { index: { bookmarkCount: -1 }, options: {}, name: 'bookmarkCount' },
      { index: { trendingScore: -1 }, options: {}, name: 'trendingScore' },
      { index: { status: 1 }, options: {}, name: 'status' },
      { index: { categories: 1 }, options: {}, name: 'categories' },
      { index: { keywords: 1 }, options: {}, name: 'keywords' },
      { index: { 'authors.name': 1 }, options: {}, name: 'authors.name' },
      { index: { 'source.name': 1 }, options: {}, name: 'source.name' },
      { index: { 'source.type': 1 }, options: {}, name: 'source.type' },
      { index: { 'metrics.impactScore': -1 }, options: {}, name: 'metrics.impactScore' }
    ];

    for (const { index, options, name } of singleIndexes) {
      try {
        await Research.collection.createIndex(index, options);
        console.log(`✅ Created single field index: ${name}`);
      } catch (error: any) {
        if (error.code === 85 || error.code === 11000) {
          console.log(`⚠️ Index ${name} already exists`);
        } else {
          console.log(`⚠️ Could not create index ${name}:`, error.message);
        }
      }
    }

    // List all indexes
    console.log('\n📋 Current indexes:');
    const indexes = await Research.collection.listIndexes().toArray();
    indexes.forEach((index: any) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Search indexes setup completed successfully!');
    
    // Test search performance
    console.log('\n🔄 Testing search performance...');
    
    const startTime = Date.now();
    const searchResult = await Research.find({
      $text: { $search: 'neural brain' }
    }).limit(10);
    const searchTime = Date.now() - startTime;
    
    console.log(`✅ Text search test completed in ${searchTime}ms`);
    console.log(`📊 Found ${searchResult.length} results`);

    // Test aggregation performance
    const aggStartTime = Date.now();
    const trendingKeywords = await Research.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$keywords' },
      {
        $group: {
          _id: '$keywords',
          count: { $sum: 1 },
          avgTrendingScore: { $avg: '$trendingScore' }
        }
      },
      { $sort: { avgTrendingScore: -1 } },
      { $limit: 5 }
    ]);
    const aggTime = Date.now() - aggStartTime;
    
    console.log(`✅ Aggregation test completed in ${aggTime}ms`);
    console.log(`📊 Top trending keywords:`, trendingKeywords.map((k: any) => k._id));

  } catch (error) {
    console.error('❌ Error setting up search indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

if (require.main === module) {
  setupSearchIndexes();
}

export default setupSearchIndexes; 
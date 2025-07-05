import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import { ResearchModel } from '@/lib/models/Research';
import { ExternalApiService } from '../../../../server/services/externalApiService';

// Add comprehensive mock data for all categories
const mockResearchData = [
  // Neuroscience
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms',
    abstract: 'Revolutionary BCI technology allows tetraplegic patients to control robotic limbs with unprecedented precision through advanced neural decoding algorithms.',
    authors: [
      { name: 'Prof. Elena Vasquez', affiliation: 'Stanford University' },
      { name: 'Dr. Marcus Johnson', affiliation: 'MIT' }
    ],
    institution: 'Stanford University',
    journal: 'Nature Medicine',
    publicationDate: '2024-02-12T00:00:00Z',
    categories: ['neuroscience', 'medicine'],
    tags: ['brain-computer interface', 'neural prosthetics', 'paralysis'],
    doi: '10.1038/nm.12345',
    viewCount: 45230,
    citationCount: 91,
    likeCount: 1250,
    bookmarkCount: 890,
    isLocal: true,
    source: {
      name: 'Nature Medicine',
      url: 'https://www.nature.com/articles/nm.12345',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38347123/'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    title: 'Deep Learning Models for Early Alzheimer\'s Detection Using Brain Imaging',
    abstract: 'Novel deep learning approach achieves 95% accuracy in detecting early-stage Alzheimer\'s disease using MRI and PET scan analysis.',
    authors: [
      { name: 'Dr. Sarah Chen', affiliation: 'Johns Hopkins University' },
      { name: 'Prof. Michael Rodriguez', affiliation: 'Harvard Medical School' }
    ],
    institution: 'Johns Hopkins University',
    journal: 'Nature Neuroscience',
    publicationDate: '2024-01-15T00:00:00Z',
    categories: ['neuroscience', 'ai-ml'],
    tags: ['alzheimers', 'deep learning', 'brain imaging', 'early detection'],
    doi: '10.1038/nn.2024.001',
    viewCount: 32100,
    citationCount: 67,
    likeCount: 890,
    bookmarkCount: 654,
    isLocal: true,
    source: {
      name: 'Nature Neuroscience',
      url: 'https://www.nature.com/articles/nn.2024.001',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38234567/'
  },

  // Biotechnology
  {
    _id: '507f1f77bcf86cd799439013',
    title: 'CRISPR-Cas9 Gene Editing Breakthrough for Inherited Blindness Treatment',
    abstract: 'First successful clinical trial using CRISPR gene editing to restore vision in patients with Leber congenital amaurosis shows promising results.',
    authors: [
      { name: 'Dr. Jennifer Liu', affiliation: 'University of Pennsylvania' },
      { name: 'Prof. Robert Kim', affiliation: 'Broad Institute' }
    ],
    institution: 'University of Pennsylvania',
    journal: 'Cell',
    publicationDate: '2024-03-08T00:00:00Z',
    categories: ['biotechnology', 'genetics', 'medicine'],
    tags: ['CRISPR', 'gene editing', 'inherited blindness', 'clinical trial'],
    doi: '10.1016/j.cell.2024.03.001',
    viewCount: 78450,
    citationCount: 134,
    likeCount: 2100,
    bookmarkCount: 1567,
    isLocal: false,
    source: {
      name: 'Cell',
      url: 'https://www.cell.com/cell/fulltext/S0092-8674(24)00001-X',
      type: 'journal'
    },
    externalUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11234567/'
  },
  {
    _id: '507f1f77bcf86cd799439014',
    title: 'Synthetic Biology Platform for Personalized Cancer Immunotherapy',
    abstract: 'Revolutionary synthetic biology approach creates personalized CAR-T cells with enhanced targeting capabilities for various cancer types.',
    authors: [
      { name: 'Dr. Amanda Foster', affiliation: 'MIT' },
      { name: 'Prof. David Park', affiliation: 'Stanford University' }
    ],
    institution: 'MIT',
    journal: 'Nature Biotechnology',
    publicationDate: '2024-02-20T00:00:00Z',
    categories: ['biotechnology', 'medicine'],
    tags: ['synthetic biology', 'CAR-T cells', 'immunotherapy', 'personalized medicine'],
    doi: '10.1038/nbt.2024.005',
    viewCount: 56780,
    citationCount: 89,
    likeCount: 1456,
    bookmarkCount: 1123,
    isLocal: true,
    source: {
      name: 'Nature Biotechnology',
      url: 'https://www.nature.com/articles/nbt.2024.005',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38456789/'
  },

  // Healthcare
  {
    _id: '507f1f77bcf86cd799439015',
    title: 'AI-Powered Diagnostic Tool Reduces Misdiagnosis Rates by 40%',
    abstract: 'Machine learning algorithm trained on millions of medical records significantly improves diagnostic accuracy across multiple medical specialties.',
    authors: [
      { name: 'Dr. Lisa Wang', affiliation: 'Google Health' },
      { name: 'Prof. James Thompson', affiliation: 'Mayo Clinic' }
    ],
    institution: 'Google Health',
    journal: 'The Lancet Digital Health',
    publicationDate: '2024-01-30T00:00:00Z',
    categories: ['healthcare', 'ai-ml'],
    tags: ['AI diagnosis', 'machine learning', 'medical accuracy', 'healthcare technology'],
    doi: '10.1016/S2589-7500(24)00001-2',
    viewCount: 92340,
    citationCount: 156,
    likeCount: 2890,
    bookmarkCount: 2234,
    isLocal: false,
    source: {
      name: 'The Lancet Digital Health',
      url: 'https://www.thelancet.com/journals/landig/article/PIIS2589-7500(24)00001-2/fulltext',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38567890/'
  },
  {
    _id: '507f1f77bcf86cd799439016',
    title: 'Telemedicine Platform Improves Rural Healthcare Access by 300%',
    abstract: 'Comprehensive telemedicine solution with AI triage capabilities dramatically increases healthcare accessibility in underserved rural communities.',
    authors: [
      { name: 'Dr. Maria Gonzalez', affiliation: 'Rural Health Institute' },
      { name: 'Prof. Kevin O\'Brien', affiliation: 'University of California' }
    ],
    institution: 'Rural Health Institute',
    journal: 'Health Affairs',
    publicationDate: '2024-02-05T00:00:00Z',
    categories: ['healthcare', 'technology'],
    tags: ['telemedicine', 'rural healthcare', 'healthcare access', 'digital health'],
    doi: '10.1377/hlthaff.2024.00123',
    viewCount: 43210,
    citationCount: 78,
    likeCount: 1234,
    bookmarkCount: 987,
    isLocal: true,
    source: {
      name: 'Health Affairs',
      url: 'https://www.healthaffairs.org/doi/10.1377/hlthaff.2024.00123',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38678901/'
  },

  // Pharmaceuticals
  {
    _id: '507f1f77bcf86cd799439017',
    title: 'Novel Drug Delivery System Increases Cancer Treatment Efficacy by 250%',
    abstract: 'Innovative nanoparticle-based drug delivery system precisely targets cancer cells while minimizing side effects in healthy tissue.',
    authors: [
      { name: 'Dr. Rachel Green', affiliation: 'Pfizer Research' },
      { name: 'Prof. Steven Lee', affiliation: 'Johns Hopkins University' }
    ],
    institution: 'Pfizer Research',
    journal: 'Nature Medicine',
    publicationDate: '2024-03-15T00:00:00Z',
    categories: ['pharmaceuticals', 'medicine'],
    tags: ['drug delivery', 'nanoparticles', 'cancer treatment', 'targeted therapy'],
    doi: '10.1038/nm.2024.078',
    viewCount: 67890,
    citationCount: 112,
    likeCount: 1789,
    bookmarkCount: 1345,
    isLocal: false,
    source: {
      name: 'Nature Medicine',
      url: 'https://www.nature.com/articles/nm.2024.078',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38789012/'
  },
  {
    _id: '507f1f77bcf86cd799439018',
    title: 'Breakthrough Alzheimer\'s Drug Shows 70% Cognitive Decline Reduction',
    abstract: 'Phase III clinical trial results demonstrate unprecedented efficacy of novel amyloid-targeting therapy in slowing Alzheimer\'s progression.',
    authors: [
      { name: 'Dr. Patricia Adams', affiliation: 'Biogen' },
      { name: 'Prof. Thomas Wilson', affiliation: 'Harvard Medical School' }
    ],
    institution: 'Biogen',
    journal: 'New England Journal of Medicine',
    publicationDate: '2024-01-22T00:00:00Z',
    categories: ['pharmaceuticals', 'neuroscience'],
    tags: ['Alzheimers treatment', 'clinical trial', 'amyloid therapy', 'cognitive decline'],
    doi: '10.1056/NEJMoa2024001',
    viewCount: 156780,
    citationCount: 234,
    likeCount: 4567,
    bookmarkCount: 3456,
    isLocal: true,
    source: {
      name: 'New England Journal of Medicine',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2024001',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38890123/'
  },

  // Medical Devices
  {
    _id: '507f1f77bcf86cd799439019',
    title: 'Smart Contact Lens Monitors Intraocular Pressure for Glaucoma Management',
    abstract: 'Wireless smart contact lens with embedded sensors provides continuous monitoring of eye pressure, revolutionizing glaucoma care.',
    authors: [
      { name: 'Dr. Emily Chen', affiliation: 'Google X' },
      { name: 'Prof. Michael Davis', affiliation: 'Stanford University' }
    ],
    institution: 'Google X',
    journal: 'Science Translational Medicine',
    publicationDate: '2024-02-28T00:00:00Z',
    categories: ['medical-devices', 'healthcare'],
    tags: ['smart contact lens', 'glaucoma', 'continuous monitoring', 'wearable technology'],
    doi: '10.1126/scitranslmed.2024.001',
    viewCount: 34560,
    citationCount: 56,
    likeCount: 987,
    bookmarkCount: 765,
    isLocal: false,
    source: {
      name: 'Science Translational Medicine',
      url: 'https://stm.sciencemag.org/content/16/734/eabcd1234',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38901234/'
  },

  // Genetics
  {
    _id: '507f1f77bcf86cd799439020',
    title: 'Whole Genome Sequencing Identifies 500 New Disease-Associated Variants',
    abstract: 'Largest genetic study to date reveals hundreds of previously unknown genetic variants linked to common diseases, opening new therapeutic targets.',
    authors: [
      { name: 'Dr. Jessica Martinez', affiliation: 'Broad Institute' },
      { name: 'Prof. Andrew Brown', affiliation: 'University of Oxford' }
    ],
    institution: 'Broad Institute',
    journal: 'Nature Genetics',
    publicationDate: '2024-03-10T00:00:00Z',
    categories: ['genetics', 'medicine'],
    tags: ['genome sequencing', 'genetic variants', 'disease association', 'precision medicine'],
    doi: '10.1038/ng.2024.045',
    viewCount: 89012,
    citationCount: 167,
    likeCount: 2345,
    bookmarkCount: 1876,
    isLocal: true,
    source: {
      name: 'Nature Genetics',
      url: 'https://www.nature.com/articles/ng.2024.045',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/39012345/'
  },

  // AI & Machine Learning
  {
    _id: '507f1f77bcf86cd799439021',
    title: 'Machine Learning Predicts Drug Interactions with 98% Accuracy',
    abstract: 'Advanced neural network models successfully predict dangerous drug interactions, potentially preventing millions of adverse reactions annually.',
    authors: [
      { name: 'Dr. Alex Chen', affiliation: 'DeepMind Health' },
      { name: 'Prof. Sarah Kim', affiliation: 'Stanford AI Lab' }
    ],
    institution: 'DeepMind Health',
    journal: 'Nature Machine Intelligence',
    publicationDate: '2024-02-18T00:00:00Z',
    categories: ['ai-ml', 'pharmaceuticals'],
    tags: ['machine learning', 'drug interactions', 'neural networks', 'medication safety'],
    doi: '10.1038/s42256-024-00123-4',
    viewCount: 76543,
    citationCount: 145,
    likeCount: 2876,
    bookmarkCount: 2234,
    isLocal: false,
    source: {
      name: 'Nature Machine Intelligence',
      url: 'https://www.nature.com/articles/s42256-024-00123-4',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/39123456/'
  },

  // Data Science
  {
    _id: '507f1f77bcf86cd799439022',
    title: 'Big Data Analytics Reveals Hidden Patterns in Global Health Trends',
    abstract: 'Comprehensive analysis of worldwide health data uncovers previously unknown correlations between environmental factors and disease prevalence.',
    authors: [
      { name: 'Dr. Maria Rodriguez', affiliation: 'WHO Data Analytics' },
      { name: 'Prof. James Wilson', affiliation: 'Harvard School of Public Health' }
    ],
    institution: 'WHO Data Analytics',
    journal: 'The Lancet Global Health',
    publicationDate: '2024-01-25T00:00:00Z',
    categories: ['data-science', 'healthcare'],
    tags: ['big data', 'health analytics', 'global health', 'environmental health'],
    doi: '10.1016/S2214-109X(24)00012-3',
    viewCount: 54321,
    citationCount: 89,
    likeCount: 1567,
    bookmarkCount: 1234,
    isLocal: true,
    source: {
      name: 'The Lancet Global Health',
      url: 'https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(24)00012-3/fulltext',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/39234567/'
  },

  // Biology
  {
    _id: '507f1f77bcf86cd799439023',
    title: 'Cellular Reprogramming Breakthrough Reverses Aging in Human Cells',
    abstract: 'Novel cellular reprogramming technique successfully reverses aging markers in human cells, opening new possibilities for longevity research.',
    authors: [
      { name: 'Dr. Elizabeth Thompson', affiliation: 'Salk Institute' },
      { name: 'Prof. David Lee', affiliation: 'University of California San Diego' }
    ],
    institution: 'Salk Institute',
    journal: 'Cell',
    publicationDate: '2024-03-22T00:00:00Z',
    categories: ['biology', 'medicine'],
    tags: ['cellular reprogramming', 'aging', 'longevity', 'regenerative medicine'],
    doi: '10.1016/j.cell.2024.03.015',
    viewCount: 98765,
    citationCount: 201,
    likeCount: 3456,
    bookmarkCount: 2789,
    isLocal: false,
    source: {
      name: 'Cell',
      url: 'https://www.cell.com/cell/fulltext/S0092-8674(24)00015-X',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/39345678/'
  },

  // Clinical Trials
  {
    _id: '507f1f77bcf86cd799439024',
    title: 'Revolutionary Cancer Immunotherapy Shows 85% Success Rate in Phase III Trial',
    abstract: 'Groundbreaking immunotherapy treatment demonstrates unprecedented success rates in treating advanced melanoma patients in large-scale clinical trial.',
    authors: [
      { name: 'Dr. Robert Johnson', affiliation: 'Memorial Sloan Kettering' },
      { name: 'Prof. Lisa Anderson', affiliation: 'MD Anderson Cancer Center' }
    ],
    institution: 'Memorial Sloan Kettering',
    journal: 'New England Journal of Medicine',
    publicationDate: '2024-02-14T00:00:00Z',
    categories: ['clinical-trials', 'medicine'],
    tags: ['immunotherapy', 'cancer treatment', 'clinical trial', 'melanoma'],
    doi: '10.1056/NEJMoa2024015',
    viewCount: 123456,
    citationCount: 278,
    likeCount: 4567,
    bookmarkCount: 3456,
    isLocal: true,
    source: {
      name: 'New England Journal of Medicine',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2024015',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/39456789/'
  },

  // Technology
  {
    _id: '507f1f77bcf86cd799439025',
    title: 'Quantum Computing Accelerates Drug Discovery by 1000x',
    abstract: 'Quantum computing algorithms dramatically reduce the time needed for molecular simulation and drug discovery, from years to days.',
    authors: [
      { name: 'Dr. Michael Chang', affiliation: 'IBM Quantum' },
      { name: 'Prof. Anna Petrov', affiliation: 'MIT' }
    ],
    institution: 'IBM Quantum',
    journal: 'Science',
    publicationDate: '2024-03-05T00:00:00Z',
    categories: ['technology', 'pharmaceuticals'],
    tags: ['quantum computing', 'drug discovery', 'molecular simulation', 'computational chemistry'],
    doi: '10.1126/science.2024.001',
    viewCount: 87654,
    citationCount: 156,
    likeCount: 2890,
    bookmarkCount: 2345,
    isLocal: false,
    source: {
      name: 'Science',
      url: 'https://www.science.org/doi/10.1126/science.2024.001',
      type: 'journal'
    },
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/39567890/'
  }
];

// Update the existing search logic to use this comprehensive data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const categories = searchParams.get('categories')?.split(',') || [];
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const limit = parseInt(searchParams.get('limit') || '20');

  console.log('🔍 Search API called with parameters:', {
    query,
    type,
    categories,
    sortBy,
    limit
  });

  try {
    // Connect to MongoDB first
    await connectMongoose();
    
    let results = [];
    
    // Try to get results from database first
    try {
      const mongoQuery: any = {};
      
      if (query) {
        mongoQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { abstract: { $regex: query, $options: 'i' } },
          { 'authors.name': { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ];
      }
      
      if (categories.length > 0 && !categories.includes('all')) {
        mongoQuery.categories = { $in: categories };
      }
      
      let dbResults = await ResearchModel.findMany({
        limit: limit,
        category: categories.length > 0 && !categories.includes('all') ? categories[0] : undefined,
        search: query || undefined,
        sortBy: sortBy === 'date' ? 'date' : sortBy === 'citations' ? 'citations' : 'date'
      });
      
      if (dbResults.length > 0) {
        results = dbResults.map(r => ({
          _id: r._id?.toString() || r.id,
          title: r.title,
          abstract: r.abstract,
          authors: Array.isArray(r.authors) ? r.authors.map(a => typeof a === 'string' ? { name: a } : a) : [],
          institution: '',
          journal: r.journal,
          publicationDate: r.publishedDate?.toISOString() || r.createdAt?.toISOString(),
          categories: r.categories,
          tags: r.tags,
          doi: r.doi,
          externalUrl: r.url,
          viewCount: r.readCount || 0,
          citationCount: r.citationCount || 0,
          likeCount: 0,
          bookmarkCount: r.bookmarkCount || 0,
          impactScore: r.impactScore || 0,
          readabilityScore: 0,
          noveltyScore: 0,
          isLocal: true,
          source: {
            name: r.journal || 'Internal',
            url: r.url || '',
            type: 'journal'
          }
        }));
        console.log(`✅ Found ${results.length} results from database`);
      } else {
        console.log('📝 No database results, using mock data');
        // Fallback to mock data
        results = mockResearchData;
        
        // Apply filters to mock data
        if (query) {
          const searchTerm = query.toLowerCase();
          results = results.filter(r => 
            r.title.toLowerCase().includes(searchTerm) ||
            r.abstract.toLowerCase().includes(searchTerm) ||
            r.authors.some(author => 
              (typeof author === 'string' ? author : author.name).toLowerCase().includes(searchTerm)
            ) ||
            r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }
        
        if (categories.length > 0 && !categories.includes('all')) {
          results = results.filter(r => 
            r.categories.some(cat => categories.includes(cat))
          );
        }
        
        console.log(`📊 Mock data filtered: ${results.length} results`);
      }
    } catch (dbError) {
      console.log('⚠️ Database query failed, using mock data:', dbError);
      results = mockResearchData;
      
      // Apply filters to mock data
      if (query) {
        const searchTerm = query.toLowerCase();
        results = results.filter(r => 
          r.title.toLowerCase().includes(searchTerm) ||
          r.abstract.toLowerCase().includes(searchTerm) ||
          r.authors.some(author => 
            (typeof author === 'string' ? author : author.name).toLowerCase().includes(searchTerm)
          ) ||
          r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (categories.length > 0 && !categories.includes('all')) {
        results = results.filter(r => 
          r.categories.some(cat => categories.includes(cat))
        );
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        results.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
        break;
      case 'citations':
        results.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0));
        break;
      case 'views':
        results.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      default:
        // Keep relevance order (default order)
        break;
    }

    // Limit results
    results = results.slice(0, limit);

    console.log(`📊 Returning ${results.length} search results`);

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      query: query || '',
      categories: categories,
      type
    });

  } catch (error) {
    console.error('❌ Search API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Search failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
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
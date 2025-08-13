import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import { ResearchModel } from '@/lib/models/Research';

// Mock articles database - maps IDs to specific articles
const mockArticlesDatabase = {
  '6861a3da375c3d7dfe433a5a': {
    _id: '6861a3da375c3d7dfe433a5a',
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
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38347123/',
    viewCount: 45230,
    citationCount: 91,
    likeCount: 1250,
    bookmarkCount: 890,
    impactScore: 87,
    readabilityScore: 82,
    noveltyScore: 94,
    isLocal: true,
    source: {
      name: 'Nature Medicine',
      url: 'https://www.nature.com/articles/nm.12345',
      type: 'journal'
    }
  },
  '6861a3da375c3d7dfe433a5b': {
    _id: '6861a3da375c3d7dfe433a5b',
    title: 'Machine Learning Predicts Alzheimer\'s Disease 10 Years Before Symptoms',
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
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38234567/',
    viewCount: 32100,
    citationCount: 67,
    likeCount: 890,
    bookmarkCount: 654,
    impactScore: 84,
    readabilityScore: 78,
    noveltyScore: 89,
    isLocal: true,
    source: {
      name: 'Nature Neuroscience',
      url: 'https://www.nature.com/articles/nn.2024.001',
      type: 'journal'
    }
  },
  '6861a3da375c3d7dfe433a5c': {
    _id: '6861a3da375c3d7dfe433a5c',
    title: 'Stem Cell Therapy Restores Vision in Macular Degeneration Patients',
    abstract: 'Age-related macular degeneration (AMD) is a leading cause of blindness in older adults. This phase II clinical trial evaluated the safety and efficacy of embryonic stem cell-derived retinal pigment epithelium (RPE) transplantation in patients with advanced dry AMD.',
    authors: [
      { name: 'Prof. Catherine Wong', affiliation: 'University of Pennsylvania' },
      { name: 'Dr. Ahmed Hassan', affiliation: 'Broad Institute' }
    ],
    institution: 'University of Pennsylvania',
    journal: 'The Lancet',
    publicationDate: '2024-01-30T00:00:00Z',
    categories: ['biotechnology', 'genetics', 'medicine'],
    tags: ['stem cell therapy', 'macular degeneration', 'retinal transplantation', 'vision restoration'],
    doi: '10.1016/j.cell.2024.03.001',
    externalUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11234567/',
    viewCount: 78450,
    citationCount: 134,
    likeCount: 2100,
    bookmarkCount: 1567,
    impactScore: 92,
    readabilityScore: 75,
    noveltyScore: 96,
    isLocal: false,
    source: {
      name: 'The Lancet',
      url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)00001-X/fulltext',
      type: 'journal'
    }
  },
  '6861a3da375c3d7dfe433a5d': {
    _id: '6861a3da375c3d7dfe433a5d',
    title: 'Personalized Medicine Approach to Cancer Immunotherapy',
    abstract: 'Cancer immunotherapy has revolutionized treatment outcomes for many patients, but response rates vary significantly across individuals. This study presents a comprehensive personalized medicine framework that combines genomic profiling, immune phenotyping, and AI-driven prediction models to optimize immunotherapy selection.',
    authors: [
      { name: 'Dr. Kevin Zhang', affiliation: 'MIT' },
      { name: 'Prof. Isabella Rodriguez', affiliation: 'Stanford University' }
    ],
    institution: 'MIT',
    journal: 'Nature Cancer',
    publicationDate: '2024-02-05T00:00:00Z',
    categories: ['biotechnology', 'medicine'],
    tags: ['personalized medicine', 'cancer immunotherapy', 'genomics', 'biomarkers'],
    doi: '10.1038/nbt.2024.005',
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38456789/',
    viewCount: 56780,
    citationCount: 89,
    likeCount: 1456,
    bookmarkCount: 1123,
    impactScore: 88,
    readabilityScore: 73,
    noveltyScore: 93,
    isLocal: true,
    source: {
      name: 'Nature Cancer',
      url: 'https://www.nature.com/articles/nbt.2024.005',
      type: 'journal'
    }
  },
  '6861a3da375c3d7dfe433a5e': {
    _id: '6861a3da375c3d7dfe433a5e',
    title: 'Neural Mechanisms of Memory Consolidation During Sleep',
    abstract: 'Sleep plays a crucial role in memory consolidation, with different sleep stages contributing to the stabilization of various types of memories. This study investigates the neural mechanisms underlying memory consolidation during slow-wave sleep and REM sleep phases.',
    authors: [
      { name: 'Dr. Sarah Chen', affiliation: 'Google Health' },
      { name: 'Prof. Michael Rodriguez', affiliation: 'Mayo Clinic' }
    ],
    institution: 'Google Health',
    journal: 'Nature Neuroscience',
    publicationDate: '2024-01-15T00:00:00Z',
    categories: ['neuroscience', 'ai-ml'],
    tags: ['memory consolidation', 'sleep', 'EEG', 'hippocampus'],
    doi: '10.1016/S2589-7500(24)00001-2',
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38567890/',
    viewCount: 92340,
    citationCount: 156,
    likeCount: 2890,
    bookmarkCount: 2234,
    impactScore: 85,
    readabilityScore: 78,
    noveltyScore: 92,
    isLocal: false,
    source: {
      name: 'Nature Neuroscience',
      url: 'https://www.nature.com/articles/nn.2024.001',
      type: 'journal'
    }
  },
  '6861a3da375c3d7dfe433a5f': {
    _id: '6861a3da375c3d7dfe433a5f',
    title: 'CRISPR-Cas9 Gene Therapy for Huntington\'s Disease: A Phase I Clinical Trial',
    abstract: 'Huntington\'s disease (HD) is a fatal neurodegenerative disorder caused by an expanded CAG repeat in the huntingtin gene. This phase I clinical trial evaluates the safety and preliminary efficacy of CRISPR-Cas9 gene editing therapy targeting the mutant huntingtin allele.',
    authors: [
      { name: 'Dr. Maria Gonzalez', affiliation: 'University of California' },
      { name: 'Prof. David Kim', affiliation: 'Broad Institute' }
    ],
    institution: 'University of California',
    journal: 'New England Journal of Medicine',
    publicationDate: '2024-02-03T00:00:00Z',
    categories: ['biotechnology', 'genetics', 'medicine'],
    tags: ['CRISPR', 'Huntington\'s disease', 'gene therapy', 'clinical trial'],
    doi: '10.1056/NEJMoa2024001',
    externalUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2024001',
    viewCount: 31250,
    citationCount: 78,
    likeCount: 1567,
    bookmarkCount: 1123,
    impactScore: 95,
    readabilityScore: 75,
    noveltyScore: 96,
    isLocal: true,
    source: {
      name: 'New England Journal of Medicine',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2024001',
      type: 'journal'
    }
  },
  '6861a3da375c3d7dfe433a60': {
    _id: '6861a3da375c3d7dfe433a60',
    title: 'AI-Powered Drug Discovery Identifies Novel Alzheimer\'s Therapeutics',
    abstract: 'This study presents a novel artificial intelligence platform that integrates multi-omics data, molecular dynamics simulations, and machine learning algorithms to identify promising therapeutic targets and compounds for Alzheimer\'s disease.',
    authors: [
      { name: 'Dr. Jennifer Liu', affiliation: 'Stanford University' },
      { name: 'Prof. Alexander Petrov', affiliation: 'MIT' }
    ],
    institution: 'Stanford University',
    journal: 'Science Translational Medicine',
    publicationDate: '2024-01-28T00:00:00Z',
    categories: ['ai-ml', 'medicine'],
    tags: ['artificial intelligence', 'drug discovery', 'Alzheimer\'s disease', 'machine learning'],
    doi: '10.1126/scitranslmed.2024.001',
    externalUrl: 'https://stm.sciencemag.org/content/16/734/eabcd1234',
    viewCount: 27890,
    citationCount: 62,
    likeCount: 1234,
    bookmarkCount: 890,
    impactScore: 87,
    readabilityScore: 82,
    noveltyScore: 90,
    isLocal: false,
    source: {
      name: 'Science Translational Medicine',
      url: 'https://stm.sciencemag.org/content/16/734/eabcd1234',
      type: 'journal'
    }
  },
  '507f1f77bcf86cd799439016': {
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
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38678901/',
    viewCount: 43210,
    citationCount: 78,
    likeCount: 1234,
    bookmarkCount: 987,
    impactScore: 76,
    readabilityScore: 85,
    noveltyScore: 81,
    isLocal: true,
    source: {
      name: 'Health Affairs',
      url: 'https://www.healthaffairs.org/doi/10.1377/hlthaff.2024.00123',
      type: 'journal'
    }
  },
  '507f1f77bcf86cd799439017': {
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
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38789012/',
    viewCount: 67890,
    citationCount: 112,
    likeCount: 1789,
    bookmarkCount: 1345,
    impactScore: 89,
    readabilityScore: 71,
    noveltyScore: 95,
    isLocal: false,
    source: {
      name: 'Nature Medicine',
      url: 'https://www.nature.com/articles/nm.2024.078',
      type: 'journal'
    }
  },
  '507f1f77bcf86cd799439018': {
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
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38890123/',
    viewCount: 156780,
    citationCount: 234,
    likeCount: 4567,
    bookmarkCount: 3456,
    impactScore: 94,
    readabilityScore: 79,
    noveltyScore: 97,
    isLocal: true,
    source: {
      name: 'New England Journal of Medicine',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2024001',
      type: 'journal'
    }
  },
  '507f1f77bcf86cd799439019': {
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
    externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/38901234/',
    viewCount: 34560,
    citationCount: 56,
    likeCount: 987,
    bookmarkCount: 765,
    impactScore: 83,
    readabilityScore: 80,
    noveltyScore: 91,
    isLocal: false,
    source: {
      name: 'Science Translational Medicine',
      url: 'https://stm.sciencemag.org/content/16/734/eabcd1234',
      type: 'journal'
    }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Fetching research article with ID:', id);
    
    // Connect to MongoDB
    await connectMongoose();
    
    // Find the research article by ID
    const article = await ResearchModel.findById(id);
    
    if (!article) {
      console.log('❌ Article not found in database, checking mock data');
      
      // Check if we have this specific article in our mock database
      const mockArticle = mockArticlesDatabase[id as keyof typeof mockArticlesDatabase];
      
      if (mockArticle) {
        console.log('✅ Found article in mock database:', mockArticle.title);
      return NextResponse.json({
        success: true,
        data: mockArticle
      });
      }
      
      // If not found in mock database either, return error
      console.log('❌ Article not found in mock database either');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Article not found',
          error: 'The requested article could not be found'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Article found:', article.title);
    
    // Increment view count
    try {
      await ResearchModel.incrementRead(id);
    } catch (error) {
      console.log('⚠️ Could not increment view count:', error);
    }
    
    return NextResponse.json({
      success: true,
      data: article
    });
    
  } catch (error) {
    console.error('❌ Error fetching research article:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
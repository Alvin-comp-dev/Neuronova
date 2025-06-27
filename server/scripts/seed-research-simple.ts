import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/database';
import Research from '../models/Research';

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const researchArticles = [
  {
    title: "Neural Mechanisms of Memory Consolidation During Sleep",
    abstract: "Sleep plays a crucial role in memory consolidation, with different sleep stages contributing to the stabilization of various types of memories. This study investigates the neural mechanisms underlying memory consolidation during slow-wave sleep and REM sleep phases.",
    authors: [
      { name: "Dr. Sarah Chen", affiliation: "Stanford University" },
      { name: "Prof. Michael Rodriguez", affiliation: "MIT" },
      { name: "Dr. Lisa Wang", affiliation: "Harvard Medical School" }
    ],
    categories: ["neuroscience"],
    tags: ["memory", "sleep", "EEG"],
    source: {
      name: "Nature Neuroscience",
      url: "https://nature.com/articles/s41593-024-1234-5",
      type: "journal" as const
    },
    doi: "10.1038/s41593-024-1234-5",
    publicationDate: new Date('2024-01-15'),
    citationCount: 45,
    trendingScore: 89,
    status: "published" as const,
    keywords: ["memory consolidation", "sleep", "EEG", "hippocampus"],
    figures: [{
      url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      caption: "EEG recordings during sleep phases",
      type: "image" as const
    }],
    metrics: {
      impactScore: 92,
      readabilityScore: 75,
      noveltyScore: 88
    }
  },
  {
    title: "CRISPR-Cas9 Gene Therapy for Huntington's Disease",
    abstract: "This phase I clinical trial evaluates the safety and preliminary efficacy of CRISPR-Cas9 gene editing therapy targeting the mutant huntingtin allele in patients with early-stage Huntington's disease.",
    authors: [
      { name: "Dr. Maria Gonzalez", affiliation: "Johns Hopkins University" },
      { name: "Prof. David Kim", affiliation: "UCLA" },
      { name: "Dr. Rachel Adams", affiliation: "Mayo Clinic" }
    ],
    categories: ["genetics"],
    tags: ["CRISPR", "gene-therapy", "huntingtons"],
    source: {
      name: "New England Journal of Medicine",
      url: "https://nejm.org/doi/10.1056/NEJMoa2401234",
      type: "journal" as const
    },
    doi: "10.1056/NEJMoa2401234",
    publicationDate: new Date('2024-02-03'),
    citationCount: 78,
    trendingScore: 95,
    status: "published" as const,
    keywords: ["CRISPR", "Huntington's disease", "gene therapy", "clinical trial"],
    figures: [{
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      caption: "CRISPR gene editing mechanism",
      type: "diagram" as const
    }],
    metrics: {
      impactScore: 98,
      readabilityScore: 82,
      noveltyScore: 94
    }
  },
  {
    title: "AI-Powered Drug Discovery for Alzheimer's Disease",
    abstract: "This study presents a novel artificial intelligence platform that integrates multi-omics data and machine learning algorithms to identify promising therapeutic targets and compounds for Alzheimer's disease treatment.",
    authors: [
      { name: "Dr. Jennifer Liu", affiliation: "Stanford AI Lab" },
      { name: "Prof. Alexander Petrov", affiliation: "DeepMind" },
      { name: "Dr. Yuki Tanaka", affiliation: "RIKEN" }
    ],
    categories: ["ai"],
    tags: ["machine-learning", "drug-discovery", "alzheimers"],
    source: {
      name: "Science Translational Medicine",
      url: "https://stm.sciencemag.org/content/16/1/eabcd1234",
      type: "journal" as const
    },
    doi: "10.1126/scitranslmed.abcd1234",
    publicationDate: new Date('2024-01-28'),
    citationCount: 62,
    trendingScore: 87,
    status: "published" as const,
    keywords: ["artificial intelligence", "drug discovery", "Alzheimer's disease", "machine learning"],
    figures: [{
      url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop",
      caption: "AI drug discovery pipeline",
      type: "chart" as const
    }],
    metrics: {
      impactScore: 89,
      readabilityScore: 78,
      noveltyScore: 91
    }
  },
  {
    title: "Brain-Computer Interface for Paralyzed Patients",
    abstract: "This study reports the development and clinical testing of a high-resolution BCI system that enables tetraplegic patients to control robotic arms with unprecedented precision using neural signals from the motor cortex.",
    authors: [
      { name: "Prof. Elena Vasquez", affiliation: "Neuralink" },
      { name: "Dr. Marcus Johnson", affiliation: "Brown University" },
      { name: "Dr. Priya Patel", affiliation: "Stanford Medicine" }
    ],
    categories: ["neuroscience"],
    tags: ["BCI", "paralysis", "neural-interface"],
    source: {
      name: "Nature Medicine",
      url: "https://nature.com/articles/s41591-024-5678-9",
      type: "journal" as const
    },
    doi: "10.1038/s41591-024-5678-9",
    publicationDate: new Date('2024-02-12'),
    citationCount: 91,
    trendingScore: 98,
    status: "published" as const,
    keywords: ["brain-computer interface", "paralysis", "motor cortex", "robotic prosthetics"],
    figures: [{
      url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
      caption: "Brain-computer interface system",
      type: "image" as const
    }],
    metrics: {
      impactScore: 96,
      readabilityScore: 73,
      noveltyScore: 97
    }
  },
  {
    title: "Personalized Cancer Immunotherapy Using AI",
    abstract: "This study presents a comprehensive personalized medicine framework that combines genomic profiling, immune phenotyping, and AI-driven prediction models to optimize immunotherapy selection for cancer patients.",
    authors: [
      { name: "Dr. Kevin Zhang", affiliation: "Memorial Sloan Kettering" },
      { name: "Prof. Isabella Rodriguez", affiliation: "MD Anderson" },
      { name: "Dr. Michael O'Connor", affiliation: "Dana-Farber" }
    ],
    categories: ["ai"],
    tags: ["personalized-medicine", "immunotherapy", "cancer"],
    source: {
      name: "Nature Cancer",
      url: "https://nature.com/articles/s43018-024-0123-4",
      type: "journal" as const
    },
    doi: "10.1038/s43018-024-0123-4",
    publicationDate: new Date('2024-02-05'),
    citationCount: 73,
    trendingScore: 90,
    status: "published" as const,
    keywords: ["personalized medicine", "cancer immunotherapy", "genomics", "biomarkers"],
    figures: [{
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      caption: "Personalized treatment workflow",
      type: "diagram" as const
    }],
    metrics: {
      impactScore: 93,
      readabilityScore: 81,
      noveltyScore: 89
    }
  }
];

async function seedResearchArticles() {
  console.log('🌱 Starting research article seeding process...');
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');
    
    // Clear existing research articles (in development only)
    if (process.env['NODE_ENV'] !== 'production') {
      await Research.deleteMany({});
      console.log('🗑️ Cleared existing research articles');
    }
    
    console.log(`📝 Creating ${researchArticles.length} research articles...`);
    
    // Create research articles
    const createdArticles = [];
    for (const articleData of researchArticles) {
      try {
        const article = new Research(articleData);
        const savedArticle = await article.save();
        createdArticles.push(savedArticle);
        
        console.log(`✅ Created: ${articleData.title.substring(0, 60)}...`);
      } catch (error: any) {
        console.error(`❌ Error creating article "${articleData.title}":`, error.message);
      }
    }
    
    console.log(`🎉 Successfully created ${createdArticles.length} research articles!`);
    
    // Display summary
    console.log('\n📊 Research Article Summary:');
    const articlesByCategory = await Research.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    articlesByCategory.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} articles`);
    });
    
    console.log('\n🔥 Top Trending Articles:');
    const trendingArticles = await Research.find()
      .sort({ trendingScore: -1 })
      .limit(3)
      .select('title trendingScore');
    
    trendingArticles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title.substring(0, 50)}... (Score: ${article.trendingScore})`);
    });
    
    console.log('\n📈 Database Statistics:');
    const totalArticles = await Research.countDocuments();
    const avgCitations = await Research.aggregate([
      { $group: { _id: null, avgCitations: { $avg: '$citationCount' } } }
    ]);
    
    console.log(`   - Total Articles: ${totalArticles}`);
    console.log(`   - Average Citations: ${Math.round(avgCitations[0]?.avgCitations || 0)}`);
    
  } catch (error) {
    console.error('❌ Research seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
if (require.main === module) {
  seedResearchArticles();
}

export default seedResearchArticles; 
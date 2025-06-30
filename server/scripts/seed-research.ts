import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/database';
import Research from '../models/Research';

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

interface ResearchData {
  title: string;
  abstract: string;
  authors: { name: string; affiliation?: string; email?: string }[];
  source: { name: string; url: string; type: 'journal' | 'preprint' | 'conference' | 'patent' };
  publicationDate: Date;
  doi?: string;
  categories: string[];
  keywords: string[];
  citationCount: number;
  status: 'published' | 'preprint' | 'under-review';
  trendingScore: number;
  figures?: { url: string; caption: string; type: 'image' | 'chart' | 'diagram' }[];
  metrics: { impactScore: number; readabilityScore: number; noveltyScore: number };
  language?: string;
}

const researchArticles: ResearchData[] = [
  {
    title: "Neural Mechanisms of Memory Consolidation During Sleep",
    abstract: "Sleep plays a crucial role in memory consolidation, with different sleep stages contributing to the stabilization of various types of memories. This study investigates the neural mechanisms underlying memory consolidation during slow-wave sleep and REM sleep phases. Using high-density EEG recordings and advanced signal processing techniques, we demonstrate that specific oscillatory patterns during sleep are critical for transferring information from hippocampal to neocortical networks. Our findings reveal that theta-gamma coupling during REM sleep facilitates procedural memory consolidation, while slow oscillations during NREM sleep support declarative memory stabilization. These results provide new insights into the fundamental processes of human memory formation and have implications for understanding sleep-related memory disorders.",
    authors: [
      { name: "Dr. Sarah Chen", affiliation: "Stanford University", email: "sarah.chen@stanford.edu" },
      { name: "Prof. Michael Rodriguez", affiliation: "MIT", email: "m.rodriguez@mit.edu" },
      { name: "Dr. Lisa Wang", affiliation: "Harvard Medical School" },
      { name: "Dr. James Thompson", affiliation: "UCSF" }
    ],
    source: { name: "Nature Neuroscience", url: "https://nature.com/articles/s41593-024-1234-5", type: "journal" },
    publicationDate: new Date('2024-01-15'),
    doi: "10.1038/s41593-024-1234-5",
    categories: ["neuroscience"],
    keywords: ["memory consolidation", "sleep", "EEG", "hippocampus", "theta oscillations", "REM sleep"],
    citationCount: 45,
    status: "published",
    trendingScore: 89,
    figures: [{ url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop", caption: "EEG recordings during sleep phases", type: "image" }],
    metrics: { impactScore: 92, readabilityScore: 75, noveltyScore: 88 }
  },
  {
    title: "CRISPR-Cas9 Gene Therapy for Huntington's Disease: A Phase I Clinical Trial",
    abstract: "Huntington's disease (HD) is a fatal neurodegenerative disorder caused by an expanded CAG repeat in the huntingtin gene. This phase I clinical trial evaluates the safety and preliminary efficacy of CRISPR-Cas9 gene editing therapy targeting the mutant huntingtin allele.",
    authors: [
      { name: "Dr. Maria Gonzalez", affiliation: "Stanford University" },
      { name: "Prof. David Kim", affiliation: "MIT" },
      { name: "Dr. Rachel Adams", affiliation: "Harvard Medical School" },
      { name: "Dr. Steven Clark", affiliation: "UCSF" }
    ],
    source: { name: "New England Journal of Medicine", url: "https://nejm.org/doi/10.1056/NEJMoa2401234", type: "journal" },
    publicationDate: new Date('2024-02-03'),
    doi: "10.1056/NEJMoa2401234",
    categories: ["genetics", "healthcare", "clinical-trials"],
    keywords: ["CRISPR", "Huntington's disease", "gene therapy", "clinical trial", "neuroprotection"],
    citationCount: 78,
    status: "published",
    trendingScore: 95,
    language: "en",
    metrics: { impactScore: 92, readabilityScore: 85, noveltyScore: 89 }
  },
  {
    title: "AI-Powered Drug Discovery Identifies Novel Alzheimer's Therapeutics",
    abstract: "This study presents a novel artificial intelligence platform that integrates multi-omics data, molecular dynamics simulations, and machine learning algorithms to identify promising therapeutic targets and compounds for Alzheimer's disease.",
    authors: [
      { name: "Dr. Jennifer Liu", affiliation: "Stanford University" },
      { name: "Prof. Alexander Petrov", affiliation: "MIT" },
      { name: "Dr. Yuki Tanaka", affiliation: "Tokyo University" },
      { name: "Dr. Robert Brown", affiliation: "Harvard Medical School" }
    ],
    source: { name: "Science Translational Medicine", url: "https://science.org/doi/10.1126/scitranslmed.abcd1234", type: "journal" },
    publicationDate: new Date('2024-01-28'),
    doi: "10.1126/scitranslmed.abcd1234",
    categories: ["ai", "healthcare", "bioinformatics"],
    keywords: ["artificial intelligence", "drug discovery", "Alzheimer's disease", "machine learning", "amyloid-beta"],
    citationCount: 62,
    status: "published",
    trendingScore: 87,
    language: "en",
    metrics: { impactScore: 88, readabilityScore: 82, noveltyScore: 90 }
  },
  {
    title: "Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms",
    abstract: "Brain-computer interfaces (BCIs) hold tremendous promise for restoring motor function in paralyzed individuals. This study reports the development and clinical testing of a high-resolution BCI system that enables tetraplegic patients to control robotic arms with unprecedented precision.",
    authors: [
      { name: "Prof. Elena Vasquez", affiliation: "Stanford University" },
      { name: "Dr. Marcus Johnson", affiliation: "MIT" },
      { name: "Dr. Priya Patel", affiliation: "Harvard Medical School" },
      { name: "Dr. Thomas Wilson", affiliation: "UCSF" }
    ],
    source: { name: "Nature Medicine", url: "https://nature.com/articles/s41591-024-5678-9", type: "journal" },
    publicationDate: new Date('2024-02-12'),
    doi: "10.1038/s41591-024-5678-9",
    categories: ["brain-computer-interface", "medical-devices", "clinical-trials"],
    keywords: ["brain-computer interface", "paralysis", "motor cortex", "robotic prosthetics", "neural decoding"],
    citationCount: 91,
    status: "published",
    trendingScore: 98,
    language: "en",
    metrics: { impactScore: 95, readabilityScore: 88, noveltyScore: 92 }
  },
  {
    title: "Optogenetics Reveals Neural Circuits Underlying Depression",
    abstract: "This study employs optogenetic techniques to investigate the role of specific neural circuits in depression-like behaviors in mouse models. We used channelrhodopsin-2 to selectively activate or inhibit neurons while monitoring behavioral responses.",
    authors: [
      { name: "Dr. Amanda Foster", affiliation: "Stanford University" },
      { name: "Prof. Hiroshi Nakamura", affiliation: "Tokyo University" },
      { name: "Dr. Carlos Mendez", affiliation: "MIT" },
      { name: "Dr. Sophie Laurent", affiliation: "Harvard Medical School" }
    ],
    source: { name: "Cell", url: "https://cell.com/cell/abstract/S0092-8674(24)01012", type: "journal" },
    publicationDate: new Date('2024-01-20'),
    doi: "10.1016/j.cell.2024.01.012",
    categories: ["neuroscience", "healthcare", "computational-neuroscience"],
    keywords: ["optogenetics", "depression", "neural circuits", "prefrontal cortex", "mood disorders"],
    citationCount: 56,
    status: "published",
    trendingScore: 82,
    language: "en",
    metrics: { impactScore: 85, readabilityScore: 80, noveltyScore: 87 }
  },
  {
    title: "Personalized Medicine Approach to Cancer Immunotherapy",
    abstract: "Cancer immunotherapy has revolutionized treatment outcomes for many patients, but response rates vary significantly across individuals. This study presents a comprehensive personalized medicine framework that combines genomic profiling, immune phenotyping, and AI-driven prediction models to optimize immunotherapy selection.",
    authors: [
      { name: "Dr. Kevin Zhang", affiliation: "Stanford University" },
      { name: "Prof. Isabella Rodriguez", affiliation: "MIT" },
      { name: "Dr. Michael O'Connor", affiliation: "Harvard Medical School" },
      { name: "Dr. Fatima Al-Rashid", affiliation: "UCSF" }
    ],
    source: { name: "Nature Cancer", url: "https://nature.com/articles/s43018-024-0123-4", type: "journal" },
    publicationDate: new Date('2024-02-05'),
    doi: "10.1038/s43018-024-0123-4",
    categories: ["oncology", "immunotherapy", "personalized-medicine"],
    keywords: ["personalized medicine", "cancer immunotherapy", "genomics", "biomarkers", "precision oncology"],
    citationCount: 73,
    status: "published",
    trendingScore: 90,
    figures: [{ 
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      caption: "Immunotherapy response prediction",
      type: "image"
    }],
    metrics: { impactScore: 91, readabilityScore: 84, noveltyScore: 89 }
  },
  {
    title: "Microbiome Modulation Improves Parkinson's Disease Symptoms",
    abstract: "This randomized controlled trial investigated whether targeted microbiome modulation could improve motor and non-motor symptoms in Parkinson's patients through the gut-brain axis.",
    authors: [
      { name: "Dr. Patricia Kim", affiliation: "Stanford University" },
      { name: "Prof. Giovanni Rossi", affiliation: "University of Milan" },
      { name: "Dr. Ana Martinez", affiliation: "Harvard Medical School" },
      { name: "Dr. John Smith", affiliation: "MIT" }
    ],
    source: { name: "Gut", url: "https://gut.bmj.com/content/early/2024/01/25/gutjnl-2024-123456", type: "journal" },
    publicationDate: new Date('2024-01-25'),
    doi: "10.1136/gutjnl-2024-123456",
    categories: ["microbiome", "parkinsons", "gastroenterology"],
    keywords: ["microbiome", "Parkinson's disease", "gut-brain axis", "probiotics", "neuroinflammation"],
    citationCount: 39,
    status: "published",
    trendingScore: 76,
    figures: [{ 
      url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop",
      caption: "Gut microbiome analysis",
      type: "image"
    }],
    metrics: { impactScore: 82, readabilityScore: 88, noveltyScore: 85 }
  },
  {
    title: "Virtual Reality Therapy for Post-Traumatic Stress Disorder",
    abstract: "This study evaluates the efficacy of immersive virtual reality exposure therapy (VRET) for treating combat-related PTSD, showing superior results to traditional therapy.",
    authors: [
      { name: "Dr. Rebecca Taylor", affiliation: "Stanford University" },
      { name: "Prof. James Anderson", affiliation: "MIT" },
      { name: "Dr. Maria Santos", affiliation: "Harvard Medical School" },
      { name: "Dr. David Lee", affiliation: "UCSF" }
    ],
    source: { name: "American Journal of Psychiatry", url: "https://ajp.psychiatryonline.org/doi/10.1176/appi.ajp.2024.23456789", type: "journal" },
    publicationDate: new Date('2024-02-08'),
    doi: "10.1176/appi.ajp.2024.23456789",
    categories: ["mental-health", "virtual-reality", "ptsd"],
    keywords: ["virtual reality", "PTSD", "exposure therapy", "trauma treatment", "veterans"],
    citationCount: 44,
    status: "published",
    trendingScore: 71,
    figures: [{ 
      url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
      caption: "VR therapy session",
      type: "image"
    }],
    metrics: { impactScore: 79, readabilityScore: 90, noveltyScore: 83 }
  },
  {
    title: "Stem Cell Therapy Restores Vision in Macular Degeneration Patients",
    abstract: "Age-related macular degeneration (AMD) is a leading cause of blindness in older adults. This phase II clinical trial evaluated the safety and efficacy of embryonic stem cell-derived retinal pigment epithelium (RPE) transplantation in patients with advanced dry AMD.",
    authors: [
      { name: "Prof. Catherine Wong", affiliation: "Stanford University" },
      { name: "Dr. Ahmed Hassan", affiliation: "Harvard Medical School" },
      { name: "Dr. Nora Johansson", affiliation: "Karolinska Institute" },
      { name: "Dr. Paul Martinez", affiliation: "UCSF" }
    ],
    source: { name: "The Lancet", url: "https://thelancet.com/journals/lancet/article/PIIS0140-6736(24)00123-4", type: "journal" },
    publicationDate: new Date('2024-01-30'),
    doi: "10.1016/S0140-6736(24)00123-4",
    categories: ["stem-cells", "ophthalmology", "regenerative-medicine"],
    keywords: ["stem cell therapy", "macular degeneration", "retinal transplantation", "vision restoration", "RPE cells"],
    citationCount: 67,
    status: "published",
    trendingScore: 93,
    figures: [{ 
      url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      caption: "Retinal cell transplantation",
      type: "image"
    }],
    metrics: { impactScore: 93, readabilityScore: 86, noveltyScore: 91 }
  },
  {
    title: "Machine Learning Predicts Alzheimer's Disease 10 Years Before Symptoms",
    abstract: "Early detection of Alzheimer's disease is crucial for implementing preventive interventions and improving patient outcomes. This study developed and validated a machine learning model capable of predicting Alzheimer's disease onset up to 10 years before clinical symptoms appear.",
    authors: [
      { name: "Dr. Linda Chen", affiliation: "Stanford University" },
      { name: "Prof. Robert Johnson", affiliation: "MIT" },
      { name: "Dr. Yuki Sato", affiliation: "Tokyo University" },
      { name: "Dr. Elena Popov", affiliation: "Harvard Medical School" }
    ],
    source: { name: "Nature Medicine", url: "https://nature.com/articles/s41591-024-6789-0", type: "journal" },
    publicationDate: new Date('2024-02-15'),
    doi: "10.1038/s41591-024-6789-0",
    categories: ["ai", "healthcare", "neuroimaging"],
    keywords: ["machine learning", "Alzheimer's prediction", "early detection", "neuroimaging", "biomarkers"],
    citationCount: 85,
    status: "published",
    trendingScore: 96,
    language: "en",
    metrics: { impactScore: 94, readabilityScore: 85, noveltyScore: 90 }
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
        
        console.log(`✅ Created article: ${articleData.title.substring(0, 50)}...`);
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
    
    interface CategoryCount {
      _id: string;
      count: number;
    }
    
    articlesByCategory.forEach((cat: CategoryCount) => {
      console.log(`${cat._id}: ${cat.count} articles`);
    });
    
    console.log('\n🔥 Top Trending Articles:');
    const trendingArticles = await Research.find()
      .sort({ trendingScore: -1 })
      .limit(5);
    
    interface TrendingArticle {
      title: string;
      trendingScore: number;
    }
    
    trendingArticles.forEach((article: TrendingArticle, index: number) => {
      console.log(`${index + 1}. ${article.title} (Score: ${article.trendingScore})`);
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
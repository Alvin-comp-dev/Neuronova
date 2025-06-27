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
    abstract: "Huntington's disease (HD) is a fatal neurodegenerative disorder caused by an expanded CAG repeat in the huntingtin gene. This phase I clinical trial evaluates the safety and preliminary efficacy of CRISPR-Cas9 gene editing therapy targeting the mutant huntingtin allele. Twenty-four patients with early-stage HD received intrathecal injections of lipid nanoparticles containing CRISPR-Cas9 components designed to selectively reduce mutant huntingtin expression. Primary endpoints included safety assessment and biomarker analysis over 12 months. Secondary endpoints measured motor function and cognitive performance. Results show the therapy was well-tolerated with no serious adverse events. Cerebrospinal fluid analysis revealed a 40% reduction in mutant huntingtin protein levels. Motor scores improved by an average of 15% compared to baseline, and cognitive assessments showed stabilization. These promising results support advancement to phase II trials and represent a significant step forward in precision medicine for neurodegenerative diseases.",
    authors: ["Dr. Maria Gonzalez", "Prof. David Kim", "Dr. Rachel Adams", "Dr. Steven Clark"],
    journal: "New England Journal of Medicine",
    publicationDate: new Date('2024-02-03'),
    doi: "10.1056/NEJMoa2401234",
    pmid: "38234567",
    categories: ["genetics", "gene-therapy", "neurodegenerative-diseases"],
    keywords: ["CRISPR", "Huntington's disease", "gene therapy", "clinical trial", "neuroprotection"],
    citationCount: 78,
    readingTime: 15,
    difficulty: "advanced",
    status: "published",
    trendingScore: 95,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop"]
  },
  {
    title: "AI-Powered Drug Discovery Identifies Novel Alzheimer's Therapeutics",
    abstract: "The development of effective treatments for Alzheimer's disease has been hindered by the complexity of disease mechanisms and high failure rates in clinical trials. This study presents a novel artificial intelligence platform that integrates multi-omics data, molecular dynamics simulations, and machine learning algorithms to identify promising therapeutic targets and compounds. Our AI system analyzed over 2 million compounds and predicted their binding affinity to key Alzheimer's-related proteins including amyloid-beta, tau, and APOE. The platform identified 12 lead compounds with high predicted efficacy and favorable pharmacokinetic properties. In vitro validation confirmed that 8 of these compounds significantly reduced amyloid-beta aggregation and tau phosphorylation in neuronal cell cultures. Two compounds showed neuroprotective effects in mouse models of Alzheimer's disease, with improved cognitive performance and reduced neuroinflammation. This AI-driven approach represents a paradigm shift in drug discovery and offers new hope for developing effective Alzheimer's treatments.",
    authors: ["Dr. Jennifer Liu", "Prof. Alexander Petrov", "Dr. Yuki Tanaka", "Dr. Robert Brown"],
    journal: "Science Translational Medicine",
    publicationDate: new Date('2024-01-28'),
    doi: "10.1126/scitranslmed.abcd1234",
    pmid: "38345678",
    categories: ["ai", "drug-discovery", "alzheimers"],
    keywords: ["artificial intelligence", "drug discovery", "Alzheimer's disease", "machine learning", "amyloid-beta"],
    citationCount: 62,
    readingTime: 14,
    difficulty: "advanced",
    status: "published",
    trendingScore: 87,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop"]
  },
  {
    title: "Brain-Computer Interface Enables Paralyzed Patients to Control Robotic Arms",
    abstract: "Brain-computer interfaces (BCIs) hold tremendous promise for restoring motor function in paralyzed individuals. This study reports the development and clinical testing of a high-resolution BCI system that enables tetraplegic patients to control robotic arms with unprecedented precision. The system uses microelectrode arrays implanted in the motor cortex to record neural signals, which are decoded in real-time using advanced machine learning algorithms. Five participants with chronic spinal cord injuries underwent implantation and completed a 6-month training protocol. Results demonstrate that participants achieved fine motor control sufficient for complex manipulation tasks including grasping objects, drinking from a cup, and writing. The system achieved 94% accuracy in intention decoding and response times under 100 milliseconds. Participants reported significant improvements in quality of life and independence. Long-term stability testing showed consistent performance over the study period with minimal signal degradation. This breakthrough represents a major advancement toward practical BCI applications for motor restoration.",
    authors: ["Prof. Elena Vasquez", "Dr. Marcus Johnson", "Dr. Priya Patel", "Dr. Thomas Wilson"],
    journal: "Nature Medicine",
    publicationDate: new Date('2024-02-12'),
    doi: "10.1038/s41591-024-5678-9",
    pmid: "38456789",
    categories: ["neurotechnology", "brain-computer-interface", "rehabilitation"],
    keywords: ["brain-computer interface", "paralysis", "motor cortex", "robotic prosthetics", "neural decoding"],
    citationCount: 91,
    readingTime: 16,
    difficulty: "advanced",
    status: "published",
    trendingScore: 98,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop"]
  },
  {
    title: "Optogenetics Reveals Neural Circuits Underlying Depression",
    abstract: "Major depressive disorder affects millions worldwide, yet the precise neural mechanisms remain poorly understood. This study employs optogenetic techniques to investigate the role of specific neural circuits in depression-like behaviors in mouse models. We used channelrhodopsin-2 to selectively activate or inhibit neurons in the prefrontal cortex, hippocampus, and ventral tegmental area while monitoring behavioral responses. Optogenetic activation of prefrontal cortex projections to the nucleus accumbens rapidly reversed depression-like behaviors, including anhedonia and social withdrawal. Conversely, inhibition of these same circuits induced depressive symptoms in healthy animals. Electrophysiological recordings revealed altered gamma oscillations in depressed animals, which were normalized following optogenetic treatment. These findings identify key neural pathways involved in mood regulation and suggest new targets for therapeutic intervention. The study provides a mechanistic framework for understanding how circuit dysfunction contributes to depression and offers insights for developing more effective treatments.",
    authors: ["Dr. Amanda Foster", "Prof. Hiroshi Nakamura", "Dr. Carlos Mendez", "Dr. Sophie Laurent"],
    journal: "Cell",
    publicationDate: new Date('2024-01-20'),
    doi: "10.1016/j.cell.2024.01.012",
    pmid: "38567890",
    categories: ["neuroscience", "optogenetics", "mental-health"],
    keywords: ["optogenetics", "depression", "neural circuits", "prefrontal cortex", "mood disorders"],
    citationCount: 56,
    readingTime: 13,
    difficulty: "advanced",
    status: "published",
    trendingScore: 82,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"]
  },
  {
    title: "Personalized Medicine Approach to Cancer Immunotherapy",
    abstract: "Cancer immunotherapy has revolutionized treatment outcomes for many patients, but response rates vary significantly across individuals. This study presents a comprehensive personalized medicine framework that combines genomic profiling, immune phenotyping, and AI-driven prediction models to optimize immunotherapy selection. We analyzed tumor samples and blood biomarkers from 500 cancer patients across multiple tumor types, including melanoma, lung cancer, and renal cell carcinoma. Our integrated approach identified molecular signatures predictive of response to different immunotherapy regimens, including checkpoint inhibitors, CAR-T cell therapy, and combination treatments. Machine learning models achieved 85% accuracy in predicting treatment response, significantly outperforming current clinical prediction methods. Patients treated according to our personalized recommendations showed improved overall survival (median 18.2 vs 12.4 months) and reduced severe adverse events. The study establishes a new paradigm for precision oncology and demonstrates the potential for AI-guided treatment selection to improve patient outcomes while reducing healthcare costs.",
    authors: ["Dr. Kevin Zhang", "Prof. Isabella Rodriguez", "Dr. Michael O'Connor", "Dr. Fatima Al-Rashid"],
    journal: "Nature Cancer",
    publicationDate: new Date('2024-02-05'),
    doi: "10.1038/s43018-024-0123-4",
    pmid: "38678901",
    categories: ["oncology", "immunotherapy", "personalized-medicine"],
    keywords: ["personalized medicine", "cancer immunotherapy", "genomics", "biomarkers", "precision oncology"],
    citationCount: 73,
    readingTime: 17,
    difficulty: "advanced",
    status: "published",
    trendingScore: 90,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop"]
  },
  {
    title: "Microbiome Modulation Improves Parkinson's Disease Symptoms",
    abstract: "Emerging evidence suggests a strong connection between the gut microbiome and Parkinson's disease pathogenesis through the gut-brain axis. This randomized controlled trial investigated whether targeted microbiome modulation could improve motor and non-motor symptoms in Parkinson's patients. Sixty participants with mild to moderate Parkinson's disease were randomized to receive either a specialized probiotic formulation containing Lactobacillus and Bifidobacterium strains or placebo for 12 weeks. The probiotic group showed significant improvements in UPDRS motor scores (23% improvement vs 5% in placebo), reduced constipation, and improved sleep quality. Metagenomic analysis revealed increased microbial diversity and elevated short-chain fatty acid production in the treatment group. Neuroimaging studies using DaTscan showed stabilization of dopaminergic function in treated patients compared to continued decline in controls. Inflammatory markers including TNF-α and IL-6 were significantly reduced in the probiotic group. These results provide compelling evidence for the therapeutic potential of microbiome-targeted interventions in neurodegenerative diseases and support the gut-brain axis as a viable treatment target.",
    authors: ["Dr. Patricia Kim", "Prof. Giovanni Rossi", "Dr. Ana Martinez", "Dr. John Smith"],
    journal: "Gut",
    publicationDate: new Date('2024-01-25'),
    doi: "10.1136/gutjnl-2024-123456",
    pmid: "38789012",
    categories: ["microbiome", "parkinsons", "gastroenterology"],
    keywords: ["microbiome", "Parkinson's disease", "gut-brain axis", "probiotics", "neuroinflammation"],
    citationCount: 39,
    readingTime: 11,
    difficulty: "intermediate",
    status: "published",
    trendingScore: 76,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop"]
  },
  {
    title: "Virtual Reality Therapy for Post-Traumatic Stress Disorder",
    abstract: "Post-traumatic stress disorder (PTSD) affects millions of veterans and civilians worldwide, with traditional therapies showing variable effectiveness. This study evaluates the efficacy of immersive virtual reality exposure therapy (VRET) for treating combat-related PTSD. Eighty veterans with chronic PTSD were randomized to receive either VRET or traditional prolonged exposure therapy over 12 sessions. The VRET protocol used photorealistic virtual environments recreating combat scenarios, allowing for controlled and graduated exposure to trauma-related stimuli. Primary outcomes included PTSD symptom severity measured by the Clinician-Administered PTSD Scale (CAPS-5) and functional impairment assessments. Secondary measures included depression scores, quality of life, and treatment retention rates. Results showed that VRET was superior to traditional therapy, with 78% of participants achieving clinically significant improvement compared to 52% in the control group. VRET participants also showed greater reductions in avoidance behaviors and hyperarousal symptoms. Neuroimaging revealed normalized amygdala activation patterns following VRET treatment. The immersive nature of VR therapy led to higher engagement and lower dropout rates, making it a promising tool for PTSD treatment.",
    authors: ["Dr. Rebecca Taylor", "Prof. James Anderson", "Dr. Maria Santos", "Dr. David Lee"],
    journal: "American Journal of Psychiatry",
    publicationDate: new Date('2024-02-08'),
    doi: "10.1176/appi.ajp.2024.23456789",
    pmid: "38890123",
    categories: ["mental-health", "virtual-reality", "ptsd"],
    keywords: ["virtual reality", "PTSD", "exposure therapy", "trauma treatment", "veterans"],
    citationCount: 44,
    readingTime: 10,
    difficulty: "intermediate",
    status: "published",
    trendingScore: 71,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop"]
  },
  {
    title: "Stem Cell Therapy Restores Vision in Macular Degeneration Patients",
    abstract: "Age-related macular degeneration (AMD) is a leading cause of blindness in older adults, with limited treatment options for the dry form of the disease. This phase II clinical trial evaluated the safety and efficacy of embryonic stem cell-derived retinal pigment epithelium (RPE) transplantation in patients with advanced dry AMD. Eighteen patients with geographic atrophy received subretinal injections of RPE cells derived from human embryonic stem cells. The primary endpoint was safety assessment over 12 months, with secondary endpoints including visual acuity changes and anatomical improvements measured by optical coherence tomography. No serious adverse events related to the treatment were observed. Remarkably, 67% of patients showed improved visual acuity, with an average gain of 15 letters on the ETDRS chart. OCT imaging revealed successful integration of transplanted cells and reduced geographic atrophy progression. Immunosuppressive therapy was well-tolerated, and no signs of immune rejection were detected. Long-term follow-up at 24 months confirmed sustained visual improvements. These groundbreaking results demonstrate the potential of stem cell therapy to restore vision and offer hope to millions of AMD patients worldwide.",
    authors: ["Prof. Catherine Wong", "Dr. Ahmed Hassan", "Dr. Nora Johansson", "Dr. Paul Martinez"],
    journal: "The Lancet",
    publicationDate: new Date('2024-01-30'),
    doi: "10.1016/S0140-6736(24)00123-4",
    pmid: "38901234",
    categories: ["stem-cells", "ophthalmology", "regenerative-medicine"],
    keywords: ["stem cell therapy", "macular degeneration", "retinal transplantation", "vision restoration", "RPE cells"],
    citationCount: 67,
    readingTime: 14,
    difficulty: "advanced",
    status: "published",
    trendingScore: 93,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"]
  },
  {
    title: "Machine Learning Predicts Alzheimer's Disease 10 Years Before Symptoms",
    abstract: "Early detection of Alzheimer's disease is crucial for implementing preventive interventions and improving patient outcomes. This longitudinal study developed and validated a machine learning model capable of predicting Alzheimer's disease onset up to 10 years before clinical symptoms appear. The model was trained on data from 5,000 cognitively normal individuals aged 50-80 who were followed for 15 years. Input features included neuroimaging data (MRI and PET scans), cognitive assessments, blood biomarkers, genetic information, and lifestyle factors. Advanced deep learning algorithms including convolutional neural networks and gradient boosting were employed to identify subtle patterns indicative of future cognitive decline. The final ensemble model achieved 89% accuracy in predicting Alzheimer's disease development, with 92% sensitivity and 87% specificity. Key predictive features included hippocampal volume changes, amyloid-beta accumulation patterns, plasma neurofilament light levels, and specific cognitive performance metrics. The model was validated in an independent cohort of 1,200 participants with similar performance metrics. This breakthrough enables early intervention strategies and represents a major advancement in precision medicine for neurodegenerative diseases.",
    authors: ["Dr. Linda Chen", "Prof. Robert Johnson", "Dr. Yuki Sato", "Dr. Elena Popov"],
    journal: "Nature Medicine",
    publicationDate: new Date('2024-02-15'),
    doi: "10.1038/s41591-024-6789-0",
    pmid: "39012345",
    categories: ["ai", "alzheimers", "early-detection"],
    keywords: ["machine learning", "Alzheimer's prediction", "early detection", "neuroimaging", "biomarkers"],
    citationCount: 85,
    readingTime: 15,
    difficulty: "advanced",
    status: "published",
    trendingScore: 96,
    content: "Full article content would be here...",
    figures: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop"]
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
    
    articlesByCategory.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} articles`);
    });
    
    console.log('\n🔥 Top Trending Articles:');
    const trendingArticles = await Research.find()
      .sort({ trendingScore: -1 })
      .limit(5)
      .select('title trendingScore');
    
    trendingArticles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title} (Score: ${article.trendingScore})`);
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
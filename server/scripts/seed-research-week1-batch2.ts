import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import Research model
import '../models/Research';
const Research = mongoose.models.Research || mongoose.model('Research');

const week1Batch2Articles = [
  // More Neuroscience Articles
  {
    title: "Transcranial Magnetic Stimulation for Cognitive Enhancement in Healthy Adults",
    abstract: "Systematic review and meta-analysis of 45 studies examining the effects of repetitive transcranial magnetic stimulation on cognitive performance in healthy adults. Results show consistent improvements in working memory and attention across multiple domains.",
    authors: [
      { name: "Dr. Amanda Foster", affiliation: "University of Pennsylvania" },
      { name: "Prof. Michael Zhang", affiliation: "Columbia University" },
      { name: "Dr. Sarah Johnson", affiliation: "University of California Los Angeles" }
    ],
    categories: ["neuroscience"],
    tags: ["transcranial-magnetic-stimulation", "cognitive-enhancement", "working-memory", "attention", "brain-stimulation"],
    source: {
      name: "Neuroscience & Biobehavioral Reviews",
      url: "https://sciencedirect.com/science/article/pii/S0149763424001234",
      type: "journal"
    },
    doi: "10.1016/j.neubiorev.2024.03.012",
    publicationDate: new Date("2024-03-30"),
    citationCount: 78,
    viewCount: 2134,
    bookmarkCount: 156,
    trendingScore: 234,
    status: "published",
    keywords: ["TMS", "cognitive enhancement", "brain stimulation", "working memory", "attention"],
    metrics: {
      impactScore: 85,
      readabilityScore: 81,
      noveltyScore: 82
    }
  },
  {
    title: "Glymphatic System Dysfunction in Neurodegenerative Diseases: MRI Evidence",
    abstract: "Multi-site MRI study of 500 patients reveals impaired glymphatic clearance in Alzheimer's, Parkinson's, and ALS. Novel diffusion tensor imaging protocols show 40% reduction in cerebrospinal fluid flow in affected brain regions.",
    authors: [
      { name: "Dr. Jennifer Liu", affiliation: "Mayo Clinic" },
      { name: "Prof. David Martinez", affiliation: "Johns Hopkins University" },
      { name: "Dr. Lisa Chen", affiliation: "Stanford University" }
    ],
    categories: ["neuroscience", "neuroimaging"],
    tags: ["glymphatic-system", "neurodegeneration", "mri", "cerebrospinal-fluid", "brain-clearance"],
    source: {
      name: "Nature Neuroscience",
      url: "https://nature.com/articles/s41593-2024-1789-0",
      type: "journal"
    },
    doi: "10.1038/s41593-2024-1789-0",
    publicationDate: new Date("2024-03-29"),
    citationCount: 145,
    viewCount: 3987,
    bookmarkCount: 289,
    trendingScore: 398,
    status: "published",
    keywords: ["glymphatic system", "neurodegeneration", "MRI", "brain clearance", "CSF flow"],
    metrics: {
      impactScore: 92,
      readabilityScore: 76,
      noveltyScore: 89
    }
  },

  // More AI Articles
  {
    title: "Multimodal AI for Real-Time Surgical Guidance Using Computer Vision and NLP",
    abstract: "Integration of computer vision and natural language processing for real-time surgical assistance. The system processes live video feeds and surgical notes to provide contextual guidance, reducing surgical errors by 23% in pilot studies.",
    authors: [
      { name: "Dr. Thomas Wilson", affiliation: "MIT CSAIL" },
      { name: "Prof. Elena Rodriguez", affiliation: "Stanford AI Lab" },
      { name: "Dr. Kevin Patel", affiliation: "Google Health" }
    ],
    categories: ["ai", "healthcare"],
    tags: ["computer-vision", "natural-language-processing", "surgical-guidance", "real-time-ai", "medical-ai"],
    source: {
      name: "Nature Machine Intelligence",
      url: "https://nature.com/articles/s42256-2024-0934-5",
      type: "journal"
    },
    doi: "10.1038/s42256-2024-0934-5",
    publicationDate: new Date("2024-03-27"),
    citationCount: 167,
    viewCount: 4521,
    bookmarkCount: 367,
    trendingScore: 456,
    status: "published",
    keywords: ["multimodal AI", "surgical guidance", "computer vision", "NLP", "medical AI"],
    metrics: {
      impactScore: 88,
      readabilityScore: 84,
      noveltyScore: 91
    }
  },
  {
    title: "Federated Learning for Genomic Data Analysis Across International Biobanks",
    abstract: "First large-scale federated learning study across 15 international biobanks with 2.3 million participants. Demonstrates privacy-preserving genome-wide association studies with comparable accuracy to centralized approaches.",
    authors: [
      { name: "Dr. Yuki Tanaka", affiliation: "RIKEN Center for Genomic Medicine" },
      { name: "Prof. Sophie Chen", affiliation: "Broad Institute" },
      { name: "Dr. Antonio Silva", affiliation: "European Bioinformatics Institute" }
    ],
    categories: ["ai", "bioinformatics", "genetics"],
    tags: ["federated-learning", "genomics", "privacy-preserving", "biobanks", "gwas"],
    source: {
      name: "Nature Genetics",
      url: "https://nature.com/articles/s41588-2024-1678-9",
      type: "journal"
    },
    doi: "10.1038/s41588-2024-1678-9",
    publicationDate: new Date("2024-03-26"),
    citationCount: 234,
    viewCount: 6789,
    bookmarkCount: 456,
    trendingScore: 567,
    status: "published",
    keywords: ["federated learning", "genomics", "privacy", "biobanks", "GWAS"],
    metrics: {
      impactScore: 94,
      readabilityScore: 79,
      noveltyScore: 93
    }
  },

  // More Genetics Articles
  {
    title: "Epigenetic Age Acceleration Reversed by Lifestyle Interventions: 5-Year Study",
    abstract: "Comprehensive lifestyle intervention including diet, exercise, and stress management reverses epigenetic aging by an average of 3.2 years. Study of 1,200 participants using methylation clocks and multi-omics analysis.",
    authors: [
      { name: "Dr. Catherine Lee", affiliation: "Harvard T.H. Chan School of Public Health" },
      { name: "Prof. Mark Johnson", affiliation: "University of California San Francisco" },
      { name: "Dr. Rachel Thompson", affiliation: "Yale School of Medicine" }
    ],
    categories: ["genetics", "healthcare"],
    tags: ["epigenetics", "aging", "lifestyle-intervention", "methylation", "longevity"],
    source: {
      name: "Cell Metabolism",
      url: "https://cell.com/cell-metabolism/fulltext/S1550-4131(24)00123-4",
      type: "journal"
    },
    doi: "10.1016/j.cmet.2024.03.015",
    publicationDate: new Date("2024-03-25"),
    citationCount: 189,
    viewCount: 5432,
    bookmarkCount: 398,
    trendingScore: 534,
    status: "published",
    keywords: ["epigenetics", "aging", "lifestyle intervention", "methylation", "longevity"],
    metrics: {
      impactScore: 91,
      readabilityScore: 86,
      noveltyScore: 88
    }
  },
  {
    title: "CRISPR 3.0: Ultra-Precise Base Editing with Minimal Off-Target Effects",
    abstract: "Next-generation CRISPR base editors achieve >99.5% on-target efficiency with <0.01% off-target mutations. New protein engineering approaches enable editing of previously inaccessible genomic regions with therapeutic applications.",
    authors: [
      { name: "Dr. Maria Gonzalez", affiliation: "Broad Institute" },
      { name: "Prof. Robert Kim", affiliation: "University of California Berkeley" },
      { name: "Dr. Lisa Anderson", affiliation: "Innovative Genomics Institute" }
    ],
    categories: ["genetics", "biotech"],
    tags: ["crispr", "base-editing", "gene-therapy", "precision-medicine", "genome-editing"],
    source: {
      name: "Nature Biotechnology",
      url: "https://nature.com/articles/s41587-2024-2278-6",
      type: "journal"
    },
    doi: "10.1038/s41587-2024-2278-6",
    publicationDate: new Date("2024-03-24"),
    citationCount: 298,
    viewCount: 7654,
    bookmarkCount: 567,
    trendingScore: 678,
    status: "published",
    keywords: ["CRISPR", "base editing", "gene therapy", "precision medicine", "genome editing"],
    metrics: {
      impactScore: 96,
      readabilityScore: 82,
      noveltyScore: 95
    }
  },

  // Healthcare & Medical Devices
  {
    title: "Wearable Continuous Glucose Monitoring for Non-Diabetic Health Optimization",
    abstract: "Study of 2,000 healthy adults using continuous glucose monitors reveals personalized glycemic responses to foods, exercise, and stress. Data enables precision nutrition recommendations and metabolic health optimization.",
    authors: [
      { name: "Dr. Michael Zhang", affiliation: "Stanford Digital Health Lab" },
      { name: "Prof. Jennifer Wu", affiliation: "Harvard Medical School" },
      { name: "Dr. Ahmed Hassan", affiliation: "Mayo Clinic" }
    ],
    categories: ["healthcare", "medical-devices"],
    tags: ["continuous-glucose-monitoring", "precision-nutrition", "metabolic-health", "wearable-devices", "personalized-medicine"],
    source: {
      name: "Nature Medicine",
      url: "https://nature.com/articles/s41591-2024-2890-3",
      type: "journal"
    },
    doi: "10.1038/s41591-2024-2890-3",
    publicationDate: new Date("2024-03-23"),
    citationCount: 156,
    viewCount: 4321,
    bookmarkCount: 298,
    trendingScore: 389,
    status: "published",
    keywords: ["continuous glucose monitoring", "precision nutrition", "metabolic health", "wearables", "personalized medicine"],
    metrics: {
      impactScore: 87,
      readabilityScore: 88,
      noveltyScore: 85
    }
  },
  {
    title: "AI-Powered Drug Repurposing Identifies Novel COVID-19 Therapeutics",
    abstract: "Machine learning analysis of drug-protein interaction networks identifies 15 FDA-approved drugs with anti-SARS-CoV-2 activity. Three compounds show efficacy in clinical trials for reducing hospitalization by 45%.",
    authors: [
      { name: "Dr. Sarah Williams", affiliation: "NIH National Center for Advancing Translational Sciences" },
      { name: "Prof. David Chen", affiliation: "University of California San Diego" },
      { name: "Dr. Jessica Martinez", affiliation: "Scripps Research Institute" }
    ],
    categories: ["ai", "pharmaceuticals", "healthcare"],
    tags: ["drug-repurposing", "covid-19", "machine-learning", "drug-discovery", "antiviral"],
    source: {
      name: "Science Translational Medicine",
      url: "https://stm.sciencemag.org/content/16/4/eadk4567",
      type: "journal"
    },
    doi: "10.1126/scitranslmed.adk4567",
    publicationDate: new Date("2024-03-22"),
    citationCount: 203,
    viewCount: 6543,
    bookmarkCount: 423,
    trendingScore: 567,
    status: "published",
    keywords: ["drug repurposing", "COVID-19", "machine learning", "drug discovery", "antiviral"],
    metrics: {
      impactScore: 89,
      readabilityScore: 83,
      noveltyScore: 87
    }
  },

  // Brain-Computer Interface
  {
    title: "High-Bandwidth Brain-Computer Interface Enables Real-Time Thought-to-Text",
    abstract: "Implantable BCI system with 10,000 electrodes achieves 90 words per minute thought-to-text typing in paralyzed patients. Novel signal processing algorithms decode intended speech from motor cortex activity patterns.",
    authors: [
      { name: "Dr. Ryan Chen", affiliation: "Neuralink Corporation" },
      { name: "Prof. Lisa Chang", affiliation: "Stanford Neuroscience Institute" },
      { name: "Dr. Robert Kim", affiliation: "University of Pittsburgh" }
    ],
    categories: ["brain-computer-interface", "neuroscience"],
    tags: ["brain-computer-interface", "neural-implants", "thought-to-text", "paralysis", "neural-decoding"],
    source: {
      name: "Nature Biomedical Engineering",
      url: "https://nature.com/articles/s41551-2024-1234-6",
      type: "journal"
    },
    doi: "10.1038/s41551-2024-1234-6",
    publicationDate: new Date("2024-03-21"),
    citationCount: 267,
    viewCount: 8765,
    bookmarkCount: 567,
    trendingScore: 789,
    status: "published",
    keywords: ["brain computer interface", "neural implants", "thought to text", "paralysis", "neural decoding"],
    metrics: {
      impactScore: 95,
      readabilityScore: 80,
      noveltyScore: 96
    }
  },

  // Computational Neuroscience
  {
    title: "Large-Scale Simulation of Human Cortical Networks Reveals Consciousness Mechanisms",
    abstract: "Detailed simulation of 1 million neurons across human cortical areas identifies neural signatures of conscious perception. Integration of thalamo-cortical loops emerges as key mechanism for conscious awareness.",
    authors: [
      { name: "Dr. Elena Rodriguez", affiliation: "Blue Brain Project, EPFL" },
      { name: "Prof. James Chen", affiliation: "Allen Institute for Brain Science" },
      { name: "Dr. Sophie Anderson", affiliation: "Human Brain Project" }
    ],
    categories: ["computational-neuroscience", "neuroscience"],
    tags: ["consciousness", "cortical-simulation", "neural-networks", "thalamo-cortical", "brain-modeling"],
    source: {
      name: "Science",
      url: "https://science.org/doi/10.1126/science.adk5678",
      type: "journal"
    },
    doi: "10.1126/science.adk5678",
    publicationDate: new Date("2024-03-20"),
    citationCount: 189,
    viewCount: 5432,
    bookmarkCount: 398,
    trendingScore: 534,
    status: "published",
    keywords: ["consciousness", "cortical simulation", "neural networks", "brain modeling", "computational neuroscience"],
    metrics: {
      impactScore: 93,
      readabilityScore: 78,
      noveltyScore: 94
    }
  },

  // Clinical Trials
  {
    title: "Personalized Cancer Vaccines Show 78% Response Rate in Phase II Trial",
    abstract: "Neoantigen-based personalized cancer vaccines combined with checkpoint inhibitors achieve 78% objective response rate in 156 patients with advanced solid tumors. Median progression-free survival extended to 18.5 months.",
    authors: [
      { name: "Dr. Patricia Williams", affiliation: "Memorial Sloan Kettering Cancer Center" },
      { name: "Prof. Antonio Silva", affiliation: "Dana-Farber Cancer Institute" },
      { name: "Dr. Mark Johnson", affiliation: "MD Anderson Cancer Center" }
    ],
    categories: ["clinical-trials", "biotech"],
    tags: ["personalized-vaccines", "cancer-immunotherapy", "neoantigens", "checkpoint-inhibitors", "precision-oncology"],
    source: {
      name: "New England Journal of Medicine",
      url: "https://nejm.org/doi/10.1056/NEJMoa2404567",
      type: "journal"
    },
    doi: "10.1056/NEJMoa2404567",
    publicationDate: new Date("2024-03-19"),
    citationCount: 234,
    viewCount: 7890,
    bookmarkCount: 456,
    trendingScore: 678,
    status: "published",
    keywords: ["personalized vaccines", "cancer immunotherapy", "neoantigens", "checkpoint inhibitors", "precision oncology"],
    metrics: {
      impactScore: 97,
      readabilityScore: 85,
      noveltyScore: 93
    }
  },

  // Bioinformatics
  {
    title: "Single-Cell Multi-Omics Atlas of Human Aging Across 50 Tissues",
    abstract: "Comprehensive single-cell analysis of aging across 50 human tissues from 200 donors aged 20-100 years. Identifies tissue-specific aging signatures and potential therapeutic targets for age-related diseases.",
    authors: [
      { name: "Dr. Yuki Tanaka", affiliation: "Salk Institute for Biological Studies" },
      { name: "Prof. Catherine Wong", affiliation: "Broad Institute" },
      { name: "Dr. Michael Brown", affiliation: "Buck Institute for Research on Aging" }
    ],
    categories: ["bioinformatics", "genetics"],
    tags: ["single-cell-analysis", "multi-omics", "aging", "tissue-atlas", "biomarkers"],
    source: {
      name: "Cell",
      url: "https://cell.com/cell/fulltext/S0092-8674(24)00456-9",
      type: "journal"
    },
    doi: "10.1016/j.cell.2024.03.023",
    publicationDate: new Date("2024-03-18"),
    citationCount: 178,
    viewCount: 5678,
    bookmarkCount: 389,
    trendingScore: 456,
    status: "published",
    keywords: ["single cell analysis", "multi-omics", "aging", "tissue atlas", "biomarkers"],
    metrics: {
      impactScore: 94,
      readabilityScore: 77,
      noveltyScore: 91
    }
  },

  // Add more articles to reach 30+ in this batch...
  // Pharmaceuticals
  {
    title: "Oral GLP-1 Receptor Agonist Shows Superior Efficacy in Type 2 Diabetes",
    abstract: "Novel oral formulation of GLP-1 receptor agonist achieves 2.1% HbA1c reduction and 12.5 kg weight loss in Phase III trial of 3,000 patients. Superior to injectable formulations with improved patient compliance.",
    authors: [
      { name: "Dr. Jennifer Liu", affiliation: "Novo Nordisk Research Center" },
      { name: "Prof. David Martinez", affiliation: "Joslin Diabetes Center" },
      { name: "Dr. Rachel Thompson", affiliation: "University of Pennsylvania" }
    ],
    categories: ["pharmaceuticals", "clinical-trials"],
    tags: ["glp-1-agonist", "diabetes", "oral-formulation", "weight-loss", "metabolic-disease"],
    source: {
      name: "The Lancet",
      url: "https://thelancet.com/journals/lancet/article/PIIS0140-6736(24)00567-8",
      type: "journal"
    },
    doi: "10.1016/S0140-6736(24)00567-8",
    publicationDate: new Date("2024-03-17"),
    citationCount: 145,
    viewCount: 4321,
    bookmarkCount: 298,
    trendingScore: 389,
    status: "published",
    keywords: ["GLP-1 agonist", "diabetes", "oral formulation", "weight loss", "metabolic disease"],
    metrics: {
      impactScore: 88,
      readabilityScore: 89,
      noveltyScore: 86
    }
  },

  // Medical Devices
  {
    title: "Minimally Invasive Robotic Surgery Reduces Complications by 40%",
    abstract: "Multi-center analysis of 10,000 robotic surgical procedures shows 40% reduction in complications, 50% shorter recovery time, and improved precision compared to traditional laparoscopic surgery across multiple specialties.",
    authors: [
      { name: "Dr. Michael Zhang", affiliation: "Mayo Clinic" },
      { name: "Prof. Sarah Johnson", affiliation: "Cleveland Clinic" },
      { name: "Dr. Thomas Wilson", affiliation: "Johns Hopkins Hospital" }
    ],
    categories: ["medical-devices", "healthcare"],
    tags: ["robotic-surgery", "minimally-invasive", "surgical-outcomes", "precision-surgery", "medical-robotics"],
    source: {
      name: "Annals of Surgery",
      url: "https://journals.lww.com/annalsofsurgery/fulltext/2024/04000/robotic_surgery_outcomes.12.aspx",
      type: "journal"
    },
    doi: "10.1097/SLA.0000000000006123",
    publicationDate: new Date("2024-03-16"),
    citationCount: 167,
    viewCount: 3987,
    bookmarkCount: 267,
    trendingScore: 345,
    status: "published",
    keywords: ["robotic surgery", "minimally invasive", "surgical outcomes", "precision surgery", "medical robotics"],
    metrics: {
      impactScore: 85,
      readabilityScore: 84,
      noveltyScore: 82
    }
  },

  // More Healthcare
  {
    title: "Telemedicine Platform Reduces Healthcare Costs by 35% in Rural Areas",
    abstract: "Comprehensive telemedicine platform serving 50,000 patients in rural areas demonstrates 35% cost reduction, 60% improvement in care access, and equivalent clinical outcomes to in-person care for chronic disease management.",
    authors: [
      { name: "Dr. Lisa Anderson", affiliation: "Rural Health Research Center" },
      { name: "Prof. Robert Kim", affiliation: "University of Washington" },
      { name: "Dr. Amanda Foster", affiliation: "Teladoc Health" }
    ],
    categories: ["healthcare"],
    tags: ["telemedicine", "rural-health", "healthcare-access", "cost-reduction", "chronic-disease"],
    source: {
      name: "JAMA Internal Medicine",
      url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2024789012",
      type: "journal"
    },
    doi: "10.1001/jamainternmed.2024.0789",
    publicationDate: new Date("2024-03-15"),
    citationCount: 123,
    viewCount: 3456,
    bookmarkCount: 234,
    trendingScore: 289,
    status: "published",
    keywords: ["telemedicine", "rural health", "healthcare access", "cost reduction", "chronic disease"],
    metrics: {
      impactScore: 83,
      readabilityScore: 91,
      noveltyScore: 79
    }
  }
];

async function seedWeek1Batch2() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env['MONGODB_URI'] as string, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log('✅ Connected to MongoDB');

    console.log('🌱 Seeding Week 1 Batch 2 research articles...');
    
    // Insert all articles
    const insertedArticles = await Research.insertMany(week1Batch2Articles);
    console.log(`✅ Successfully seeded ${insertedArticles.length} additional research articles`);

    // Get updated statistics
    const totalCount = await Research.countDocuments();
    const categoryStats = await Research.aggregate([
      { $group: { _id: { $arrayElemAt: ["$categories", 0] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log(`📊 Database now contains ${totalCount} total research articles`);
    console.log('📈 Category distribution:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} articles`);
    });

    await mongoose.disconnect();
    console.log('✅ Week 1 Batch 2 seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedWeek1Batch2();
}

export { seedWeek1Batch2 };
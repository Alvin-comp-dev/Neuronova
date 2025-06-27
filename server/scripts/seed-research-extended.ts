import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Extended research data with 20 articles
const extendedResearchData = [
  // NEUROSCIENCE ARTICLES
  {
    title: "Deep Learning Approaches to Neural Signal Decoding in Brain-Computer Interfaces",
    abstract: "This study presents novel deep learning architectures for decoding neural signals in real-time brain-computer interface applications. We demonstrate improved accuracy in motor intention prediction using convolutional neural networks combined with recurrent layers, achieving 94.2% classification accuracy across 15 patients with spinal cord injuries.",
    authors: [
      { name: "Dr. Elena Rodriguez", affiliation: "Stanford Neuroscience Institute" },
      { name: "Prof. James Chen", affiliation: "MIT CSAIL" },
      { name: "Dr. Sarah Kim", affiliation: "Johns Hopkins BCI Lab" }
    ],
    categories: ["neuroscience"],
    tags: ["brain-computer-interface", "deep-learning", "neural-decoding", "motor-cortex"],
    source: {
      name: "Nature Neuroscience",
      url: "https://nature.com/articles/s41593-2024-1567-8",
      type: "journal"
    },
    doi: "10.1038/s41593-2024-1567-8",
    publicationDate: new Date("2024-03-15"),
    citationCount: 127,
    viewCount: 2340,
    bookmarkCount: 189,
    trendingScore: 285,
    status: "published",
    keywords: ["BCI", "neural signals", "machine learning", "paralysis", "neuroprosthetics"],
    metrics: {
      impactScore: 96,
      readabilityScore: 78,
      noveltyScore: 94
    }
  },
  {
    title: "Optogenetic Restoration of Vision in Advanced Retinal Degeneration",
    abstract: "We report successful restoration of functional vision in patients with advanced retinal degeneration using optogenetic therapy. ChrimsonR-expressing retinal ganglion cells enabled light perception and basic pattern recognition in 8 out of 10 treated patients, with improvements maintained over 18 months of follow-up.",
    authors: [
      { name: "Dr. Michael Zhang", affiliation: "University of California San Francisco" },
      { name: "Prof. Lisa Anderson", affiliation: "Harvard Medical School" },
      { name: "Dr. Robert Kim", affiliation: "Moorfields Eye Hospital" }
    ],
    categories: ["neuroscience"],
    tags: ["optogenetics", "vision-restoration", "retinal-degeneration", "gene-therapy"],
    source: {
      name: "Nature Medicine",
      url: "https://nature.com/articles/s41591-2024-2891-4",
      type: "journal"
    },
    doi: "10.1038/s41591-2024-2891-4",
    publicationDate: new Date("2024-02-28"),
    citationCount: 203,
    viewCount: 4567,
    bookmarkCount: 334,
    trendingScore: 412,
    status: "published",
    keywords: ["optogenetics", "blindness", "retina", "vision restoration", "clinical trial"],
    metrics: {
      impactScore: 98,
      readabilityScore: 82,
      noveltyScore: 97
    }
  },
  {
    title: "Synaptic Plasticity Mechanisms in Alzheimer's Disease Progression",
    abstract: "Long-term potentiation and depression mechanisms are disrupted early in Alzheimer's disease pathogenesis. Using advanced two-photon microscopy and electrophysiology, we demonstrate that tau protein aggregation specifically impairs NMDA receptor-dependent synaptic plasticity 6 months before cognitive symptoms appear in transgenic mouse models.",
    authors: [
      { name: "Dr. Jennifer Liu", affiliation: "Washington University in St. Louis" },
      { name: "Prof. David Martinez", affiliation: "University of California San Diego" },
      { name: "Dr. Rachel Thompson", affiliation: "Mayo Clinic" }
    ],
    categories: ["neuroscience"],
    tags: ["alzheimers", "synaptic-plasticity", "tau-protein", "LTP", "neurodegeneration"],
    source: {
      name: "Cell",
      url: "https://cell.com/cell/fulltext/S0092-8674(24)00234-5",
      type: "journal"
    },
    doi: "10.1016/j.cell.2024.02.015",
    publicationDate: new Date("2024-03-08"),
    citationCount: 89,
    viewCount: 1876,
    bookmarkCount: 145,
    trendingScore: 198,
    status: "published",
    keywords: ["Alzheimer's disease", "synaptic plasticity", "tau protein", "neurodegeneration", "memory"],
    metrics: {
      impactScore: 94,
      readabilityScore: 76,
      noveltyScore: 88
    }
  },

  // AI IN HEALTHCARE ARTICLES
  {
    title: "Large Language Models for Clinical Decision Support: A Multi-Center Validation Study",
    abstract: "We present the first large-scale validation of GPT-4 based clinical decision support across 12 major hospitals. The AI system demonstrated 89.3% accuracy in diagnostic recommendations and 92.1% concordance with specialist opinions across 15,000 patient cases, with particular strength in rare disease identification.",
    authors: [
      { name: "Dr. Amanda Foster", affiliation: "Massachusetts General Hospital" },
      { name: "Prof. Kevin Patel", affiliation: "Stanford Medicine" },
      { name: "Dr. Maria Gonzalez", affiliation: "Cleveland Clinic" }
    ],
    categories: ["ai"],
    tags: ["large-language-models", "clinical-decision-support", "diagnosis", "healthcare-ai"],
    source: {
      name: "New England Journal of Medicine",
      url: "https://nejm.org/doi/10.1056/NEJMoa2402156",
      type: "journal"
    },
    doi: "10.1056/NEJMoa2402156",
    publicationDate: new Date("2024-03-22"),
    citationCount: 156,
    viewCount: 3421,
    bookmarkCount: 267,
    trendingScore: 345,
    status: "published",
    keywords: ["AI", "clinical decision support", "diagnosis", "machine learning", "healthcare"],
    metrics: {
      impactScore: 97,
      readabilityScore: 85,
      noveltyScore: 93
    }
  },
  {
    title: "Federated Learning for Privacy-Preserving Medical Image Analysis",
    abstract: "We developed a federated learning framework that enables collaborative training of medical AI models across institutions without sharing patient data. Our approach achieved 94.7% accuracy in chest X-ray diagnosis while maintaining strict privacy guarantees, demonstrating the potential for large-scale medical AI collaboration.",
    authors: [
      { name: "Dr. Thomas Wilson", affiliation: "Google Health" },
      { name: "Prof. Yuki Tanaka", affiliation: "University of Tokyo" },
      { name: "Dr. Sophie Chen", affiliation: "Imperial College London" }
    ],
    categories: ["ai"],
    tags: ["federated-learning", "medical-imaging", "privacy", "chest-xray", "collaborative-ai"],
    source: {
      name: "Nature Digital Medicine",
      url: "https://nature.com/articles/s41746-2024-1034-7",
      type: "journal"
    },
    doi: "10.1038/s41746-2024-1034-7",
    publicationDate: new Date("2024-03-05"),
    citationCount: 78,
    viewCount: 2134,
    bookmarkCount: 156,
    trendingScore: 234,
    status: "published",
    keywords: ["federated learning", "medical imaging", "privacy", "AI collaboration", "radiology"],
    metrics: {
      impactScore: 91,
      readabilityScore: 79,
      noveltyScore: 95
    }
  },
  {
    title: "AI-Powered Drug Discovery for Alzheimer's Disease Treatment",
    abstract: "This study presents a novel artificial intelligence platform that integrates multi-omics data and machine learning algorithms to identify promising therapeutic targets and compounds for Alzheimer's disease treatment. Our AI system identified 12 novel drug candidates, with 3 showing significant efficacy in preclinical models.",
    authors: [
      { name: "Dr. Jennifer Liu", affiliation: "Stanford AI Lab" },
      { name: "Prof. Alexander Petrov", affiliation: "DeepMind Health" },
      { name: "Dr. Yuki Tanaka", affiliation: "RIKEN Center" }
    ],
    categories: ["ai"],
    tags: ["machine-learning", "drug-discovery", "alzheimers", "multi-omics", "therapeutic-targets"],
    source: {
      name: "Science Translational Medicine",
      url: "https://stm.sciencemag.org/content/16/1/eabcd1234",
      type: "journal"
    },
    doi: "10.1126/scitranslmed.abcd1234",
    publicationDate: new Date("2024-01-28"),
    citationCount: 142,
    viewCount: 3456,
    bookmarkCount: 234,
    trendingScore: 298,
    status: "published",
    keywords: ["artificial intelligence", "drug discovery", "alzheimer's disease", "machine learning", "therapeutics"],
    metrics: {
      impactScore: 95,
      readabilityScore: 81,
      noveltyScore: 94
    }
  },

  // GENETICS ARTICLES
  {
    title: "Prime Editing Corrects Huntington's Disease Mutation in Patient-Derived Neurons",
    abstract: "We demonstrate successful correction of the HTT gene expansion mutation using prime editing in patient-derived iPSC neurons. The corrected cells showed restored huntingtin protein function and reduced aggregation, with 87% editing efficiency and minimal off-target effects across the genome.",
    authors: [
      { name: "Dr. Catherine Lee", affiliation: "Broad Institute" },
      { name: "Prof. Antonio Silva", affiliation: "UCLA" },
      { name: "Dr. Mark Johnson", affiliation: "University of Edinburgh" }
    ],
    categories: ["genetics"],
    tags: ["prime-editing", "huntingtons-disease", "gene-correction", "iPSC", "neurodegeneration"],
    source: {
      name: "Nature Biotechnology",
      url: "https://nature.com/articles/s41587-2024-2156-3",
      type: "journal"
    },
    doi: "10.1038/s41587-2024-2156-3",
    publicationDate: new Date("2024-02-14"),
    citationCount: 134,
    viewCount: 2876,
    bookmarkCount: 223,
    trendingScore: 312,
    status: "published",
    keywords: ["prime editing", "Huntington's disease", "gene therapy", "iPSC", "neurodegeneration"],
    metrics: {
      impactScore: 96,
      readabilityScore: 81,
      noveltyScore: 96
    }
  },
  {
    title: "CRISPR Base Editing Reverses Sickle Cell Disease in Clinical Trial",
    abstract: "Phase II clinical trial results demonstrate successful treatment of sickle cell disease using CRISPR base editing to reactivate fetal hemoglobin production. 28 out of 30 patients showed complete resolution of vaso-occlusive crises with sustained hemoglobin levels above 11 g/dL at 12-month follow-up.",
    authors: [
      { name: "Dr. Sarah Williams", affiliation: "Boston Children's Hospital" },
      { name: "Prof. David Chen", affiliation: "University of Pennsylvania" },
      { name: "Dr. Amara Okafor", affiliation: "National Institutes of Health" }
    ],
    categories: ["genetics"],
    tags: ["crispr", "base-editing", "sickle-cell-disease", "fetal-hemoglobin", "clinical-trial"],
    source: {
      name: "New England Journal of Medicine",
      url: "https://nejm.org/doi/10.1056/NEJMoa2403567",
      type: "journal"
    },
    doi: "10.1056/NEJMoa2403567",
    publicationDate: new Date("2024-03-12"),
    citationCount: 198,
    viewCount: 5432,
    bookmarkCount: 387,
    trendingScore: 456,
    status: "published",
    keywords: ["CRISPR", "sickle cell disease", "base editing", "gene therapy", "hemoglobin"],
    metrics: {
      impactScore: 99,
      readabilityScore: 84,
      noveltyScore: 97
    }
  },

  // Continue with more articles...
  {
    title: "Wireless Neural Dust for Continuous Brain Monitoring",
    abstract: "We developed ultrasonic-powered neural dust particles smaller than 1mm³ that can wirelessly monitor neural activity for months. Implanted in epilepsy patients, the devices successfully detected seizure onset 30 seconds before clinical symptoms, enabling preventive intervention.",
    authors: [
      { name: "Dr. Ryan Chen", affiliation: "University of California Berkeley" },
      { name: "Prof. Jessica Martinez", affiliation: "Stanford University" },
      { name: "Dr. Ahmed Hassan", affiliation: "University of Michigan" }
    ],
    categories: ["neuroscience"],
    tags: ["neural-dust", "wireless-monitoring", "epilepsy", "brain-implants", "seizure-detection"],
    source: {
      name: "Nature Electronics",
      url: "https://nature.com/articles/s41928-2024-1123-4",
      type: "journal"
    },
    doi: "10.1038/s41928-2024-1123-4",
    publicationDate: new Date("2024-02-20"),
    citationCount: 89,
    viewCount: 1987,
    bookmarkCount: 167,
    trendingScore: 245,
    status: "published",
    keywords: ["neural dust", "brain monitoring", "epilepsy", "wireless implants", "seizure prediction"],
    metrics: {
      impactScore: 93,
      readabilityScore: 77,
      noveltyScore: 95
    }
  },
  {
    title: "Bioengineered Pancreatic Islets Reverse Type 1 Diabetes in Clinical Trial",
    abstract: "Encapsulated pancreatic islet cells derived from stem cells successfully restored glucose homeostasis in 15 patients with type 1 diabetes. The bioengineered islets survived without immunosuppression and maintained insulin independence for over 18 months in 87% of patients.",
    authors: [
      { name: "Dr. Maria Santos", affiliation: "Harvard Stem Cell Institute" },
      { name: "Prof. Robert Kim", affiliation: "University of California San Francisco" },
      { name: "Dr. Lisa Chang", affiliation: "Joslin Diabetes Center" }
    ],
    categories: ["genetics"],
    tags: ["stem-cells", "diabetes", "islet-transplantation", "bioengineering", "regenerative-medicine"],
    source: {
      name: "Cell Stem Cell",
      url: "https://cell.com/cell-stem-cell/fulltext/S1934-5909(24)00089-2",
      type: "journal"
    },
    doi: "10.1016/j.stem.2024.02.008",
    publicationDate: new Date("2024-03-01"),
    citationCount: 167,
    viewCount: 4123,
    bookmarkCount: 298,
    trendingScore: 378,
    status: "published",
    keywords: ["diabetes", "stem cells", "islet transplantation", "regenerative medicine", "insulin"],
    metrics: {
      impactScore: 97,
      readabilityScore: 83,
      noveltyScore: 96
    }
  }
];

async function seedExtendedResearch() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });

    console.log('✅ Connected to MongoDB');

    // Use the simple schema approach that works
    const researchSchema = new mongoose.Schema({
      title: { type: String, required: true },
      abstract: { type: String, required: true },
      authors: [{
        name: { type: String, required: true },
        affiliation: { type: String }
      }],
      categories: [{ type: String }],
      tags: [{ type: String }],
      source: {
        name: { type: String, required: true },
        url: { type: String },
        type: { type: String, enum: ['journal', 'preprint', 'conference', 'patent'], default: 'journal' }
      },
      doi: { type: String },
      publicationDate: { type: Date, default: Date.now },
      citationCount: { type: Number, default: 0 },
      viewCount: { type: Number, default: 0 },
      bookmarkCount: { type: Number, default: 0 },
      trendingScore: { type: Number, default: 0 },
      status: { type: String, enum: ['published', 'preprint', 'under-review'], default: 'published' },
      keywords: [{ type: String }],
      metrics: {
        impactScore: { type: Number, default: 0 },
        readabilityScore: { type: Number, default: 0 },
        noveltyScore: { type: Number, default: 0 }
      }
    }, {
      timestamps: true
    });

    // Create or get the model
    const Research = mongoose.models.Research || mongoose.model('Research', researchSchema);

    // Clear existing research data
    console.log('🗑️ Clearing existing research data...');
    await Research.deleteMany({});

    // Insert extended research data
    console.log('📚 Seeding extended research articles...');
    const insertedArticles = await Research.insertMany(extendedResearchData);
    
    console.log(`✅ Successfully seeded ${insertedArticles.length} research articles`);

    // Display summary
    const categories = await Research.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Articles by category:');
    categories.forEach((cat: any) => {
      console.log(`  ${cat._id}: ${cat.count} articles`);
    });

    const totalStats = await Research.aggregate([
      {
        $group: {
          _id: null,
          totalArticles: { $sum: 1 },
          totalCitations: { $sum: '$citationCount' },
          totalViews: { $sum: '$viewCount' },
          avgImpactScore: { $avg: '$metrics.impactScore' }
        }
      }
    ]);

    if (totalStats.length > 0) {
      console.log('\n📈 Database Statistics:');
      console.log(`  Total Articles: ${totalStats[0].totalArticles}`);
      console.log(`  Total Citations: ${totalStats[0].totalCitations}`);
      console.log(`  Total Views: ${totalStats[0].totalViews}`);
      console.log(`  Average Impact Score: ${totalStats[0].avgImpactScore.toFixed(1)}`);
    }

  } catch (error) {
    console.error('❌ Error seeding research data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedExtendedResearch();
}

export default seedExtendedResearch; 
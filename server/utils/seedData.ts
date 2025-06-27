import Research from '../models/Research';

const mockResearchData = [
  {
    title: "Neural Plasticity in Brain-Computer Interface Learning: A Longitudinal fMRI Study",
    abstract: "This study investigates the neural mechanisms underlying learning in brain-computer interfaces (BCIs). Using longitudinal fMRI data from 25 participants over 8 weeks of BCI training, we observed significant plasticity in motor and parietal cortex regions. Our findings suggest that successful BCI control is associated with strengthened connectivity between primary motor cortex and posterior parietal cortex, while reduced activation in prefrontal regions indicates automatization of control strategies.",
    authors: [
      { name: "Dr. Sarah Chen", affiliation: "Stanford Neuroscience Institute", email: "schen@stanford.edu" },
      { name: "Dr. Michael Rodriguez", affiliation: "MIT Brain and Cognitive Sciences" },
      { name: "Dr. Emily Johnson", affiliation: "Harvard Medical School" }
    ],
    categories: ["neuroscience", "brain-computer-interface", "neuroimaging"],
    tags: ["fmri", "plasticity", "motor cortex", "learning", "bci"],
    source: {
      name: "Nature Neuroscience",
      url: "https://nature.com/neuro/articles/nn2024001",
      type: "journal"
    },
    doi: "10.1038/nn.2024.001",
    publicationDate: new Date('2024-01-15'),
    citationCount: 45,
    viewCount: 1250,
    bookmarkCount: 89,
    status: "published",
    keywords: ["brain-computer interface", "neural plasticity", "fMRI", "motor learning", "cortical connectivity"],
    metrics: {
      impactScore: 92,
      readabilityScore: 78,
      noveltyScore: 88
    }
  },
  {
    title: "CRISPR-Cas9 Gene Editing for Huntington's Disease: Phase II Clinical Trial Results",
    abstract: "We report the results of a Phase II clinical trial testing CRISPR-Cas9 gene editing therapy for Huntington's disease. 60 patients received stereotactic injections of CRISPR vectors targeting the mutant huntingtin gene. After 12 months, patients showed significant improvements in motor function scores (p<0.001) and cognitive assessments (p<0.05). Minimal off-target effects were observed, with only transient inflammation at injection sites. These results support advancing to Phase III trials.",
    authors: [
      { name: "Dr. James Wilson", affiliation: "Johns Hopkins University", email: "jwilson@jhu.edu" },
      { name: "Dr. Maria Garcia", affiliation: "Mayo Clinic" },
      { name: "Dr. Robert Kim", affiliation: "UCSF Neurology Department" }
    ],
    categories: ["genetics", "clinical-trials", "neuroscience"],
    tags: ["crispr", "gene therapy", "huntington", "clinical trial", "gene editing"],
    source: {
      name: "The Lancet Neurology",
      url: "https://lancet.com/neurology/2024/huntington-crispr",
      type: "journal"
    },
    doi: "10.1016/S1474-4422(24)00023-7",
    publicationDate: new Date('2024-02-01'),
    citationCount: 67,
    viewCount: 2100,
    bookmarkCount: 156,
    status: "published",
    keywords: ["CRISPR-Cas9", "Huntington's disease", "gene therapy", "clinical trial", "neurodegeneration"],
    metrics: {
      impactScore: 95,
      readabilityScore: 82,
      noveltyScore: 91
    }
  },
  {
    title: "Wearable Biosensors for Real-Time Glucose Monitoring: A Multi-Center Validation Study",
    abstract: "Continuous glucose monitoring is crucial for diabetes management. We developed a novel wearable biosensor using graphene-based electrochemical detection for non-invasive glucose monitoring. This multi-center study involving 500 participants across 10 clinical sites validated the device against traditional fingerstick methods. Our sensor achieved 95% accuracy within the clinically acceptable range, with minimal skin irritation and 14-day continuous wear capability.",
    authors: [
      { name: "Dr. Lisa Park", affiliation: "MIT Media Lab", email: "lpark@mit.edu" },
      { name: "Dr. David Thompson", affiliation: "Cleveland Clinic" },
      { name: "Dr. Anna Petrov", affiliation: "European Diabetes Research Institute" }
    ],
    categories: ["medical-devices", "healthcare", "biotech"],
    tags: ["glucose monitoring", "wearable", "biosensor", "diabetes", "continuous monitoring"],
    source: {
      name: "Nature Biomedical Engineering",
      url: "https://nature.com/natbiomedeng/glucose-sensor-2024",
      type: "journal"
    },
    doi: "10.1038/s41551-024-0012-3",
    publicationDate: new Date('2024-01-28'),
    citationCount: 23,
    viewCount: 890,
    bookmarkCount: 67,
    status: "published",
    keywords: ["glucose monitoring", "wearable technology", "biosensors", "diabetes", "graphene"],
    metrics: {
      impactScore: 87,
      readabilityScore: 85,
      noveltyScore: 89
    }
  },
  {
    title: "AI-Driven Drug Discovery for Alzheimer's Disease: Identifying Novel Tau Protein Inhibitors",
    abstract: "Using deep learning models trained on protein structures and drug-target interactions, we identified 15 novel compounds with potential to inhibit tau protein aggregation in Alzheimer's disease. Our AI pipeline processed over 10 million chemical compounds, reducing screening time from years to weeks. Three lead compounds showed promising results in cell culture studies, with IC50 values below 100nM and minimal cytotoxicity.",
    authors: [
      { name: "Dr. Alex Kumar", affiliation: "DeepMind Health", email: "akumar@deepmind.com" },
      { name: "Dr. Rachel Green", affiliation: "Oxford University" },
      { name: "Dr. Thomas Mueller", affiliation: "Max Planck Institute" }
    ],
    categories: ["ai", "pharmaceuticals", "neuroscience"],
    tags: ["machine learning", "drug discovery", "alzheimer", "tau protein", "deep learning"],
    source: {
      name: "Nature Machine Intelligence",
      url: "https://nature.com/natmachintell/alzheimer-ai-2024",
      type: "journal"
    },
    doi: "10.1038/s42256-024-0089-2",
    publicationDate: new Date('2024-02-10'),
    citationCount: 34,
    viewCount: 1560,
    bookmarkCount: 112,
    status: "published",
    keywords: ["artificial intelligence", "drug discovery", "Alzheimer's disease", "tau protein", "machine learning"],
    metrics: {
      impactScore: 90,
      readabilityScore: 76,
      noveltyScore: 94
    }
  },
  {
    title: "Single-Cell RNA Sequencing Reveals Novel Cell Types in Human Brain Organoids",
    abstract: "Brain organoids provide unprecedented opportunities to study human neurodevelopment. Using single-cell RNA sequencing, we characterized cellular diversity in 3D brain organoids derived from induced pluripotent stem cells. Our analysis revealed 12 distinct cell populations, including previously uncharacterized glial subtypes that express unique transcriptional signatures. These findings advance our understanding of human brain development and provide new targets for neurodevelopmental disorder research.",
    authors: [
      { name: "Dr. Kevin Lee", affiliation: "Broad Institute", email: "klee@broadinstitute.org" },
      { name: "Dr. Sophia Martinez", affiliation: "Salk Institute" },
      { name: "Dr. Jonathan Wright", affiliation: "University of Edinburgh" }
    ],
    categories: ["neuroscience", "bioinformatics", "biotech"],
    tags: ["single-cell", "rna sequencing", "organoids", "stem cells", "neurodevelopment"],
    source: {
      name: "Cell Stem Cell",
      url: "https://cell.com/cell-stem-cell/organoid-scrna-2024",
      type: "journal"
    },
    doi: "10.1016/j.stem.2024.01.008",
    publicationDate: new Date('2024-01-22'),
    citationCount: 56,
    viewCount: 1890,
    bookmarkCount: 134,
    status: "published",
    keywords: ["single-cell RNA sequencing", "brain organoids", "neurodevelopment", "stem cells", "cellular diversity"],
    metrics: {
      impactScore: 88,
      readabilityScore: 74,
      noveltyScore: 86
    }
  },
  {
    title: "Quantum-Enhanced MRI Imaging: Breaking the Resolution Barrier",
    abstract: "Traditional MRI resolution is limited by thermal noise and acquisition time. We developed a quantum-enhanced MRI system using nitrogen-vacancy diamond sensors that achieves sub-micron resolution in biological samples. Our method reduces imaging time by 75% while improving signal-to-noise ratio by 300%. Initial tests on ex-vivo brain tissue revealed previously invisible microstructures, opening new possibilities for neuroimaging research.",
    authors: [
      { name: "Dr. Yuki Tanaka", affiliation: "RIKEN Quantum Computing", email: "ytanaka@riken.jp" },
      { name: "Dr. Maria Kowalski", affiliation: "Vienna University of Technology" },
      { name: "Dr. Samuel Jackson", affiliation: "IBM Research" }
    ],
    categories: ["neuroimaging", "medical-devices", "ai"],
    tags: ["quantum sensing", "mri", "neuroimaging", "diamond sensors", "quantum computing"],
    source: {
      name: "Science",
      url: "https://science.org/quantum-mri-2024",
      type: "journal"
    },
    doi: "10.1126/science.2024.quantum.001",
    publicationDate: new Date('2024-02-05'),
    citationCount: 12,
    viewCount: 756,
    bookmarkCount: 89,
    status: "published",
    keywords: ["quantum sensing", "MRI", "neuroimaging", "diamond sensors", "high resolution"],
    metrics: {
      impactScore: 96,
      readabilityScore: 71,
      noveltyScore: 98
    }
  },
  {
    title: "Personalized Cancer Immunotherapy Using Patient-Derived Organoids",
    abstract: "We developed a rapid screening platform using patient-derived tumor organoids to predict immunotherapy response. By testing CAR-T cells against individual patient organoids within 5 days of biopsy, we achieved 89% accuracy in predicting clinical response. This approach enables personalized treatment selection and reduces time to effective therapy. Our study included 150 patients across multiple cancer types with 18-month follow-up data.",
    authors: [
      { name: "Dr. Patricia Adams", affiliation: "Memorial Sloan Kettering", email: "padams@mskcc.org" },
      { name: "Dr. Hassan Ali", affiliation: "University of Texas MD Anderson" },
      { name: "Dr. Catherine Zhou", affiliation: "Fred Hutchinson Cancer Center" }
    ],
    categories: ["healthcare", "biotech", "clinical-trials"],
    tags: ["immunotherapy", "organoids", "personalized medicine", "car-t", "cancer"],
    source: {
      name: "Nature Medicine",
      url: "https://nature.com/natmed/organoid-immunotherapy-2024",
      type: "journal"
    },
    doi: "10.1038/s41591-024-0234-5",
    publicationDate: new Date('2024-01-30'),
    citationCount: 78,
    viewCount: 2340,
    bookmarkCount: 198,
    status: "published",
    keywords: ["immunotherapy", "personalized medicine", "organoids", "CAR-T cells", "cancer treatment"],
    metrics: {
      impactScore: 93,
      readabilityScore: 81,
      noveltyScore: 87
    }
  },
  {
    title: "Biocompatible Neural Interfaces: Long-term Stability of Graphene Electrodes",
    abstract: "Long-term stability of neural interfaces remains a major challenge for brain-computer interfaces. We developed graphene-based neural electrodes with improved biocompatibility and stability. After 12 months of implantation in non-human primates, our electrodes maintained 95% of initial signal quality with minimal tissue inflammation. Surface modifications using biomimetic peptides reduced foreign body response by 80% compared to traditional materials.",
    authors: [
      { name: "Dr. Mohammad Hassan", affiliation: "Johns Hopkins Applied Physics Lab", email: "mhassan@jhuapl.edu" },
      { name: "Dr. Jennifer Liu", affiliation: "Stanford Materials Science" },
      { name: "Dr. Giuseppe Rossi", affiliation: "Italian Institute of Technology" }
    ],
    categories: ["brain-computer-interface", "medical-devices", "biotech"],
    tags: ["neural electrodes", "graphene", "biocompatibility", "neural interface", "implants"],
    source: {
      name: "Nature Biomedical Engineering",
      url: "https://nature.com/natbiomedeng/graphene-electrodes-2024",
      type: "journal"
    },
    doi: "10.1038/s41551-024-0089-7",
    publicationDate: new Date('2024-02-08'),
    citationCount: 29,
    viewCount: 1120,
    bookmarkCount: 95,
    status: "published",
    keywords: ["neural electrodes", "graphene", "brain-computer interface", "biocompatibility", "neural implants"],
    metrics: {
      impactScore: 85,
      readabilityScore: 79,
      noveltyScore: 83
    }
  },
  {
    title: "Machine Learning Prediction of Drug-Drug Interactions in Polypharmacy",
    abstract: "Polypharmacy increases the risk of adverse drug-drug interactions (DDIs), particularly in elderly patients. We developed a machine learning model using electronic health records from 1.2 million patients to predict DDI risks. Our ensemble model combining gradient boosting and neural networks achieved 94% accuracy in predicting severe DDIs, outperforming existing clinical decision support systems. The model identified 15 previously unknown DDI patterns.",
    authors: [
      { name: "Dr. Rajesh Patel", affiliation: "Mayo Clinic AI Lab", email: "rpatel@mayo.edu" },
      { name: "Dr. Karen Williams", affiliation: "Vanderbilt University Medical Center" },
      { name: "Dr. Chen Wei", affiliation: "Beijing University Hospital" }
    ],
    categories: ["ai", "pharmaceuticals", "healthcare"],
    tags: ["machine learning", "drug interactions", "polypharmacy", "clinical decision support", "predictive modeling"],
    source: {
      name: "Nature Digital Medicine",
      url: "https://nature.com/natdigitalmed/ddi-prediction-2024",
      type: "journal"
    },
    doi: "10.1038/s41746-024-0156-8",
    publicationDate: new Date('2024-01-25'),
    citationCount: 41,
    viewCount: 1450,
    bookmarkCount: 108,
    status: "published",
    keywords: ["drug-drug interactions", "machine learning", "polypharmacy", "clinical decision support", "healthcare AI"],
    metrics: {
      impactScore: 86,
      readabilityScore: 83,
      noveltyScore: 81
    }
  },
  {
    title: "Optogenetic Control of Dopamine Neurons in Parkinson's Disease Treatment",
    abstract: "Parkinson's disease involves progressive loss of dopamine neurons in the substantia nigra. We tested optogenetic stimulation of remaining dopamine neurons in a transgenic mouse model of Parkinson's disease. Light-activated channelrhodopsin expression in dopamine neurons restored motor function and reduced dyskinesia symptoms. Chronic stimulation over 6 months showed sustained benefits without adverse effects, suggesting potential for clinical translation.",
    authors: [
      { name: "Dr. Elena Volkov", affiliation: "Karolinska Institute", email: "evolkov@ki.se" },
      { name: "Dr. Mark Thompson", affiliation: "University of Cambridge" },
      { name: "Dr. Hiroshi Nakamura", affiliation: "University of Tokyo" }
    ],
    categories: ["neuroscience", "genetics", "clinical-trials"],
    tags: ["optogenetics", "parkinson", "dopamine", "gene therapy", "motor function"],
    source: {
      name: "Cell",
      url: "https://cell.com/optogenetics-parkinson-2024",
      type: "journal"
    },
    doi: "10.1016/j.cell.2024.01.012",
    publicationDate: new Date('2024-02-12'),
    citationCount: 38,
    viewCount: 1680,
    bookmarkCount: 125,
    status: "published",
    keywords: ["optogenetics", "Parkinson's disease", "dopamine neurons", "motor function", "gene therapy"],
    metrics: {
      impactScore: 91,
      readabilityScore: 77,
      noveltyScore: 89
    }
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing research data
    await Research.deleteMany({});
    console.log('🗑️ Cleared existing research data');
    
    // Insert mock data
    const insertedData = await Research.insertMany(mockResearchData);
    console.log(`✅ Successfully seeded ${insertedData.length} research articles`);
    
    // Create additional random data for pagination testing
    const additionalData = [];
    const categories = ['neuroscience', 'healthcare', 'biotech', 'ai', 'genetics', 'pharmaceuticals'];
    const sourceTypes = ['journal', 'preprint', 'conference'];
    
    for (let i = 0; i < 50; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomSource = sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
      const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      
      additionalData.push({
        title: `Research Article ${i + 11}: Advanced Studies in ${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}`,
        abstract: `This is a generated research article for testing purposes. It explores various aspects of ${randomCategory} with innovative approaches and methodologies. The study provides insights into current challenges and future directions in the field.`,
        authors: [
          { name: `Dr. Researcher ${i + 11}`, affiliation: "Test University" }
        ],
        categories: [randomCategory],
        tags: [randomCategory, 'research', 'study'],
        source: {
          name: `Test ${randomSource.charAt(0).toUpperCase() + randomSource.slice(1)}`,
          url: `https://test-${randomSource}.com/article-${i + 11}`,
          type: randomSource
        },
        publicationDate: randomDate,
        citationCount: Math.floor(Math.random() * 100),
        viewCount: Math.floor(Math.random() * 1000),
        bookmarkCount: Math.floor(Math.random() * 50),
        status: 'published',
        keywords: [randomCategory, 'research', 'analysis'],
        metrics: {
          impactScore: Math.floor(Math.random() * 100),
          readabilityScore: Math.floor(Math.random() * 100),
          noveltyScore: Math.floor(Math.random() * 100)
        }
      });
    }
    
    await Research.insertMany(additionalData);
    console.log(`✅ Successfully seeded ${additionalData.length} additional test articles`);
    
    console.log('🎉 Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
}; 
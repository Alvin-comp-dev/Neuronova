import { UserService } from './models/User';
import { ResearchModel } from './models/Research';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed Users
    const sampleUsers = [
      {
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@neuronova.com',
        password: 'password123',
        role: 'expert' as const,
        bio: 'Leading neuroscientist specializing in neural plasticity and brain-computer interfaces.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
        isVerified: true,
        preferences: {
          categories: ['neuroscience', 'ai'],
          emailNotifications: true,
          darkMode: true,
        },
        badges: ['verified-expert', 'top-contributor'],
        followedTopics: ['neural-plasticity', 'bci', 'machine-learning'],
      },
      {
        name: 'Dr. Michael Rodriguez',
        email: 'michael.rodriguez@neuronova.com',
        password: 'password123',
        role: 'expert' as const,
        bio: 'Geneticist and biotech researcher focused on CRISPR applications and gene therapy.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
        isVerified: true,
        preferences: {
          categories: ['genetics', 'biotech'],
          emailNotifications: true,
          darkMode: true,
        },
        badges: ['verified-expert', 'research-pioneer'],
        followedTopics: ['crispr', 'gene-therapy', 'biotech'],
      },
      {
        name: 'Emily Zhang',
        email: 'emily.zhang@student.edu',
        password: 'password123',
        role: 'user' as const,
        bio: 'PhD student in computational biology with interests in AI and drug discovery.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
        isVerified: false,
        preferences: {
          categories: ['ai', 'pharmaceuticals'],
          emailNotifications: true,
          darkMode: true,
        },
        badges: [],
        followedTopics: ['drug-discovery', 'machine-learning', 'computational-biology'],
      },
    ];

    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      try {
        const existingUser = await UserService.findByEmail(userData.email);
        if (!existingUser) {
          const user = await UserService.create(userData);
          createdUsers.push(user);
          console.log(`✅ Created user: ${userData.name}`);
        } else {
          createdUsers.push(existingUser);
          console.log(`⏭️ User already exists: ${userData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating user ${userData.name}:`, error);
      }
    }

    // Seed Research Articles
    const sampleResearch = [
      {
        title: 'Neural Plasticity in Adult Brains: Revolutionary Discoveries',
        abstract: 'Recent groundbreaking studies reveal unprecedented levels of neuroplasticity in adult human brains, fundamentally challenging long-held assumptions about brain development, recovery, and the potential for cognitive enhancement throughout life.',
        authors: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez', 'Dr. Lisa Wang'],
        journal: 'Nature Neuroscience',
        publishedDate: new Date('2024-01-15'),
        doi: '10.1038/s41593-2024-0001-1',
        url: 'https://nature.com/articles/neural-plasticity-2024',
        categories: ['neuroscience', 'research'],
        tags: ['neuroplasticity', 'adult brain', 'recovery', 'cognitive enhancement'],
        citationCount: 127,
        readCount: 2341,
        bookmarkCount: 89,
        shareCount: 45,
        impactScore: 8.7,
        isOpenAccess: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        status: 'approved' as const,
        submittedBy: createdUsers[0]?._id,
      },
      {
        title: 'CRISPR Gene Therapy Shows Unprecedented Promise for Alzheimer\'s Treatment',
        abstract: 'A breakthrough study demonstrates how CRISPR-Cas9 technology can be precisely used to target and modify genes associated with Alzheimer\'s disease progression, showing remarkable results in preclinical trials.',
        authors: ['Dr. James Thompson', 'Dr. Maria Garcia', 'Dr. Robert Kim'],
        journal: 'Cell',
        publishedDate: new Date('2024-01-12'),
        doi: '10.1016/j.cell.2024.01.001',
        url: 'https://cell.com/articles/crispr-alzheimers-2024',
        categories: ['genetics', 'healthcare'],
        tags: ['CRISPR', 'Alzheimer\'s', 'gene therapy', 'neurodegenerative'],
        citationCount: 89,
        readCount: 1876,
        bookmarkCount: 67,
        shareCount: 32,
        impactScore: 9.2,
        isOpenAccess: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop',
        status: 'approved' as const,
        submittedBy: createdUsers[1]?._id,
      },
      {
        title: 'AI-Powered Drug Discovery Platform Accelerates Cancer Research',
        abstract: 'Revolutionary machine learning algorithms are transforming pharmaceutical research by accurately predicting molecular interactions and identifying potential cancer treatments, reducing discovery time from years to months.',
        authors: ['Dr. Emily Zhang', 'Dr. David Wilson', 'Dr. Anna Petrov'],
        journal: 'Science',
        publishedDate: new Date('2024-01-10'),
        doi: '10.1126/science.2024.001',
        url: 'https://science.org/articles/ai-drug-discovery-2024',
        categories: ['ai', 'pharmaceuticals'],
        tags: ['machine learning', 'drug discovery', 'cancer', 'pharmaceutical'],
        citationCount: 156,
        readCount: 3102,
        bookmarkCount: 124,
        shareCount: 78,
        impactScore: 8.9,
        isOpenAccess: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        status: 'approved' as const,
        submittedBy: createdUsers[2]?._id,
      },
      {
        title: 'Breakthrough in Quantum Biology: Photosynthesis Efficiency Unlocked',
        abstract: 'Researchers discover quantum coherence effects in photosynthetic systems, opening revolutionary new avenues for bio-inspired energy technologies and sustainable power generation.',
        authors: ['Dr. Alex Kumar', 'Dr. Sophie Martin', 'Dr. Chen Liu'],
        journal: 'Nature',
        publishedDate: new Date('2024-01-08'),
        doi: '10.1038/s41586-2024-0001-1',
        url: 'https://nature.com/articles/quantum-biology-2024',
        categories: ['biotech', 'research'],
        tags: ['quantum biology', 'photosynthesis', 'energy', 'sustainability'],
        citationCount: 73,
        readCount: 1654,
        bookmarkCount: 45,
        shareCount: 23,
        impactScore: 7.8,
        isOpenAccess: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop',
        status: 'approved' as const,
        submittedBy: createdUsers[0]?._id,
      },
      {
        title: 'Personalized Medicine Revolution: Genomic Profiling for Precision Treatment',
        abstract: 'Advanced genomic sequencing techniques enable highly personalized treatment plans based on individual genetic profiles and disease markers, ushering in a new era of precision medicine.',
        authors: ['Dr. Rachel Adams', 'Dr. Mark Johnson', 'Dr. Yuki Tanaka'],
        journal: 'New England Journal of Medicine',
        publishedDate: new Date('2024-01-05'),
        doi: '10.1056/NEJMoa2024001',
        url: 'https://nejm.org/articles/personalized-medicine-2024',
        categories: ['genetics', 'healthcare'],
        tags: ['personalized medicine', 'genomics', 'precision treatment', 'healthcare'],
        citationCount: 201,
        readCount: 4567,
        bookmarkCount: 189,
        shareCount: 95,
        impactScore: 9.5,
        isOpenAccess: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
        status: 'approved' as const,
        submittedBy: createdUsers[1]?._id,
      },
      {
        title: 'Microbiome Research Reveals Novel Therapeutic Targets',
        abstract: 'Comprehensive analysis of the human microbiome identifies novel bacterial strains with significant therapeutic potential for treating autoimmune diseases and metabolic disorders.',
        authors: ['Dr. Patricia Lee', 'Dr. Carlos Mendez', 'Dr. Fatima Al-Rashid'],
        journal: 'Cell Host & Microbe',
        publishedDate: new Date('2024-01-03'),
        doi: '10.1016/j.chom.2024.01.001',
        url: 'https://cell.com/articles/microbiome-therapeutics-2024',
        categories: ['biotech', 'healthcare'],
        tags: ['microbiome', 'therapeutics', 'autoimmune', 'metabolic disorders'],
        citationCount: 94,
        readCount: 2198,
        bookmarkCount: 76,
        shareCount: 41,
        impactScore: 8.3,
        isOpenAccess: true,
        thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
        status: 'approved' as const,
        submittedBy: createdUsers[2]?._id,
      },
    ];

    console.log('📚 Seeding research articles...');
    for (const researchData of sampleResearch) {
      try {
        const research = await ResearchModel.create(researchData);
        console.log(`✅ Created research: ${researchData.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error creating research ${researchData.title.substring(0, 30)}:`, error);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const extendedUserData = [
  // ADMIN USERS
  {
    name: "Dr. Admin Rodriguez",
    email: "admin@neuronova.com",
    password: "admin123",
    role: "admin",
    isVerified: true,
    profile: {
      bio: "Chief Administrator and Neuroscience Research Director at Neuronova. Leading the platform's mission to democratize access to cutting-edge research.",
      specialization: "Platform Administration",
      institution: "Neuronova Inc.",
      location: "San Francisco, CA",
      expertise: ["platform-management", "neuroscience", "research-curation"],
      socialLinks: {
        linkedin: "https://linkedin.com/in/admin-rodriguez",
        twitter: "https://twitter.com/adminrodriguez"
      }
    },
    preferences: {
      categories: ["neuroscience", "ai", "platform-updates"],
      notifications: {
        email: true,
        push: true,
        weekly: true
      }
    }
  },

  // EXPERT USERS - Neuroscience
  {
    name: "Dr. Elena Vasquez",
    email: "elena.vasquez@stanford.edu",
    password: "expert123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Professor of Neuroscience at Stanford University, specializing in brain-computer interfaces and neural signal processing. Lead researcher on the breakthrough BCI study for paralyzed patients.",
      specialization: "Brain-Computer Interfaces",
      institution: "Stanford University",
      location: "Palo Alto, CA",
      expertise: ["brain-computer-interfaces", "neural-signal-processing", "motor-cortex", "neuroprosthetics"],
      publications: 127,
      citations: 8934,
      hIndex: 42,
      socialLinks: {
        linkedin: "https://linkedin.com/in/elena-vasquez-phd",
        twitter: "https://twitter.com/elenavasquezphd",
        orcid: "0000-0002-1234-5678"
      }
    },
    preferences: {
      categories: ["neuroscience", "ai", "medical-devices"],
      notifications: {
        email: true,
        push: true,
        weekly: true
      }
    }
  },
  {
    name: "Prof. Michael Zhang",
    email: "mzhang@ucsf.edu",
    password: "expert123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Professor of Ophthalmology and Vision Science at UCSF. Pioneer in optogenetic therapies for vision restoration and retinal degeneration treatment.",
      specialization: "Optogenetics & Vision Restoration",
      institution: "University of California San Francisco",
      location: "San Francisco, CA",
      expertise: ["optogenetics", "vision-restoration", "retinal-degeneration", "gene-therapy"],
      publications: 203,
      citations: 12567,
      hIndex: 58,
      socialLinks: {
        linkedin: "https://linkedin.com/in/michael-zhang-md-phd",
        orcid: "0000-0003-2345-6789"
      }
    },
    preferences: {
      categories: ["neuroscience", "genetics", "gene-therapy"],
      notifications: {
        email: true,
        push: false,
        weekly: true
      }
    }
  },

  // EXPERT USERS - AI in Healthcare
  {
    name: "Dr. Amanda Foster",
    email: "afoster@mgh.harvard.edu",
    password: "expert123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Director of AI in Medicine at Massachusetts General Hospital. Leading multi-center validation studies of large language models for clinical decision support.",
      specialization: "AI in Clinical Decision Support",
      institution: "Massachusetts General Hospital",
      location: "Boston, MA",
      expertise: ["clinical-ai", "large-language-models", "diagnosis", "healthcare-ai", "clinical-decision-support"],
      publications: 89,
      citations: 5432,
      hIndex: 38,
      socialLinks: {
        linkedin: "https://linkedin.com/in/amanda-foster-md",
        twitter: "https://twitter.com/amandafostermd"
      }
    },
    preferences: {
      categories: ["ai", "diagnostics", "healthcare-ai"],
      notifications: {
        email: true,
        push: true,
        weekly: true
      }
    }
  },
  {
    name: "Dr. Thomas Wilson",
    email: "twilson@google.com",
    password: "expert123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Senior Research Scientist at Google Health. Developing federated learning frameworks for privacy-preserving medical AI collaboration across institutions.",
      specialization: "Federated Learning in Healthcare",
      institution: "Google Health",
      location: "Mountain View, CA",
      expertise: ["federated-learning", "medical-imaging", "privacy", "collaborative-ai", "machine-learning"],
      publications: 67,
      citations: 3456,
      hIndex: 32,
      socialLinks: {
        linkedin: "https://linkedin.com/in/thomas-wilson-phd",
        twitter: "https://twitter.com/thomaswilsonai"
      }
    },
    preferences: {
      categories: ["ai", "privacy", "medical-imaging"],
      notifications: {
        email: true,
        push: false,
        weekly: true
      }
    }
  },

  // EXPERT USERS - Genetics
  {
    name: "Dr. Catherine Lee",
    email: "clee@broadinstitute.org",
    password: "expert123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Principal Investigator at the Broad Institute specializing in prime editing and gene correction technologies. Leading breakthrough research in Huntington's disease treatment.",
      specialization: "Prime Editing & Gene Correction",
      institution: "Broad Institute of MIT and Harvard",
      location: "Cambridge, MA",
      expertise: ["prime-editing", "gene-correction", "huntingtons-disease", "crispr", "neurodegeneration"],
      publications: 134,
      citations: 9876,
      hIndex: 45,
      socialLinks: {
        linkedin: "https://linkedin.com/in/catherine-lee-phd",
        orcid: "0000-0004-3456-7890"
      }
    },
    preferences: {
      categories: ["genetics", "gene-therapy", "neuroscience"],
      notifications: {
        email: true,
        push: true,
        weekly: true
      }
    }
  },
  {
    name: "Dr. Sarah Williams",
    email: "swilliams@childrens.harvard.edu",
    password: "expert123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Attending Physician and Researcher at Boston Children's Hospital. Leading clinical trials in CRISPR base editing for sickle cell disease treatment.",
      specialization: "CRISPR Clinical Applications",
      institution: "Boston Children's Hospital",
      location: "Boston, MA",
      expertise: ["crispr", "base-editing", "sickle-cell-disease", "clinical-trials", "hematology"],
      publications: 98,
      citations: 6543,
      hIndex: 41,
      socialLinks: {
        linkedin: "https://linkedin.com/in/sarah-williams-md-phd",
        orcid: "0000-0005-4567-8901"
      }
    },
    preferences: {
      categories: ["genetics", "clinical-trials", "hematology"],
      notifications: {
        email: true,
        push: true,
        weekly: true
      }
    }
  },

  // RESEARCHER USERS
  {
    name: "Dr. James Chen",
    email: "jchen@mit.edu",
    password: "researcher123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Postdoctoral Researcher at MIT CSAIL working on neural signal decoding algorithms for brain-computer interfaces.",
      specialization: "Neural Signal Processing",
      institution: "MIT Computer Science and Artificial Intelligence Laboratory",
      location: "Cambridge, MA",
      expertise: ["neural-signals", "machine-learning", "signal-processing", "algorithms"],
      publications: 23,
      citations: 567,
      hIndex: 12,
      socialLinks: {
        linkedin: "https://linkedin.com/in/james-chen-phd"
      }
    },
    preferences: {
      categories: ["neuroscience", "ai", "signal-processing"],
      notifications: {
        email: true,
        push: false,
        weekly: true
      }
    }
  },
  {
    name: "Dr. Lisa Anderson",
    email: "landerson@harvard.edu",
    password: "researcher123",
    role: "expert",
    isVerified: true,
    profile: {
      bio: "Research Fellow at Harvard Medical School studying optogenetic approaches to treating blindness and visual impairments.",
      specialization: "Optogenetic Vision Research",
      institution: "Harvard Medical School",
      location: "Boston, MA",
      expertise: ["optogenetics", "vision-research", "retinal-biology", "photoreceptors"],
      publications: 34,
      citations: 892,
      hIndex: 18,
      socialLinks: {
        linkedin: "https://linkedin.com/in/lisa-anderson-phd"
      }
    },
    preferences: {
      categories: ["neuroscience", "genetics", "vision-research"],
      notifications: {
        email: true,
        push: false,
        weekly: false
      }
    }
  },

  // REGULAR USERS
  {
    name: "Alex Thompson",
    email: "alex.thompson@gmail.com",
    password: "user123",
    role: "user",
    isVerified: true,
    profile: {
      bio: "Medical student interested in neuroscience and AI applications in healthcare. Passionate about staying current with research developments.",
      specialization: "Medical Student",
      institution: "Johns Hopkins School of Medicine",
      location: "Baltimore, MD",
      expertise: ["medical-education", "neuroscience", "healthcare-ai"],
      socialLinks: {
        linkedin: "https://linkedin.com/in/alex-thompson-med"
      }
    },
    preferences: {
      categories: ["neuroscience", "ai", "medical-education"],
      notifications: {
        email: true,
        push: true,
        weekly: true
      }
    }
  },
  {
    name: "Maria Santos",
    email: "maria.santos@example.com",
    password: "user123",
    role: "user",
    isVerified: true,
    profile: {
      bio: "Biotech entrepreneur following developments in gene therapy and personalized medicine. Founder of a healthcare startup.",
      specialization: "Biotech Entrepreneur",
      institution: "Santos Biotech Solutions",
      location: "San Diego, CA",
      expertise: ["entrepreneurship", "gene-therapy", "personalized-medicine", "biotech"],
      socialLinks: {
        linkedin: "https://linkedin.com/in/maria-santos-biotech",
        twitter: "https://twitter.com/mariasantosbio"
      }
    },
    preferences: {
      categories: ["genetics", "drug-discovery", "biotech"],
      notifications: {
        email: true,
        push: false,
        weekly: true
      }
    }
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    password: "user123",
    role: "user",
    isVerified: true,
    profile: {
      bio: "Software engineer with interest in healthcare AI and medical device development. Contributing to open-source medical AI projects.",
      specialization: "Healthcare Software Engineer",
      institution: "TechHealth Inc.",
      location: "Seattle, WA",
      expertise: ["software-engineering", "healthcare-ai", "medical-devices", "open-source"],
      socialLinks: {
        linkedin: "https://linkedin.com/in/david-kim-engineer",
        github: "https://github.com/davidkim"
      }
    },
    preferences: {
      categories: ["ai", "medical-devices", "software"],
      notifications: {
        email: true,
        push: true,
        weekly: false
      }
    }
  }
];

async function seedExtendedUsers() {
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

    // Create user schema
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
      isVerified: { type: Boolean, default: false },
      profile: {
        bio: { type: String },
        avatar: { type: String },
        specialization: { type: String },
        institution: { type: String },
        location: { type: String },
        expertise: [{ type: String }],
        publications: { type: Number, default: 0 },
        citations: { type: Number, default: 0 },
        hIndex: { type: Number, default: 0 },
        socialLinks: {
          linkedin: { type: String },
          twitter: { type: String },
          orcid: { type: String },
          github: { type: String }
        }
      },
      preferences: {
        categories: [{ type: String }],
        notifications: {
          email: { type: Boolean, default: true },
          push: { type: Boolean, default: false },
          weekly: { type: Boolean, default: true }
        }
      }
    }, {
      timestamps: true
    });

    // Create or get the model
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Clear existing users
    console.log('🗑️ Clearing existing users...');
    await User.deleteMany({});

    // Hash passwords and insert users
    console.log('👥 Seeding extended user accounts...');
    const usersToInsert = await Promise.all(
      extendedUserData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Successfully seeded ${insertedUsers.length} user accounts`);

    // Display summary by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n👤 Users by role:');
    usersByRole.forEach((role: any) => {
      console.log(`  ${role._id}: ${role.count} users`);
    });

    // Display expert summary
    const experts = await User.find({ role: 'expert' }).select('name profile.specialization profile.institution');
    console.log('\n🧑‍🔬 Expert Profiles:');
    experts.forEach((expert: any) => {
      console.log(`  ${expert.name} - ${expert.profile.specialization} (${expert.profile.institution})`);
    });

    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@neuronova.com / admin123');
    console.log('Expert: elena.vasquez@stanford.edu / expert123');
    console.log('Expert: jchen@mit.edu / researcher123');
    console.log('User: alex.thompson@gmail.com / user123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedExtendedUsers();
}

export default seedExtendedUsers; 
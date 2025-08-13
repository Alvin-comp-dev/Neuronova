import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { connectMongoose } from '../../src/lib/mongodb';

// Production user data with realistic profiles
const productionUsers = [
  {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@stanford.edu",
    password: "SecurePass123!",
    role: "expert",
    expertise: ["neuroscience", "ai"],
    institution: "Stanford University",
    department: "Department of Bioengineering",
    verified: true,
    bio: "Leading researcher in brain-computer interfaces with 15+ years of experience in neural engineering. Published 120+ papers in top-tier journals.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      twitter: "https://twitter.com/sarahchen_neuro",
      linkedin: "https://linkedin.com/in/sarahchen",
      orcid: "0000-0002-1234-5678"
    },
    preferences: {
      emailNotifications: true,
      researchAlerts: true,
      categories: ["neuroscience", "healthcare"]
    },
    stats: {
      articlesRead: 1247,
      bookmarks: 89,
      following: 45,
      followers: 234
    }
  },
  {
    name: "Prof. Michael Rodriguez",
    email: "mrodriguez@jhu.edu",
    password: "SecurePass123!",
    role: "expert",
    expertise: ["genetics", "biotech"],
    institution: "Johns Hopkins University",
    department: "Neural Engineering Lab",
    verified: true,
    bio: "Pioneer in gene editing applications for neurological disorders. Director of the Gene Therapy Research Center.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      twitter: "https://twitter.com/mrodriguez_gene",
      linkedin: "https://linkedin.com/in/michaelrodriguez",
      orcid: "0000-0003-2345-6789"
    },
    preferences: {
      emailNotifications: true,
      researchAlerts: true,
      categories: ["genetics", "biotech"]
    },
    stats: {
      articlesRead: 892,
      bookmarks: 156,
      following: 67,
      followers: 189
    }
  },
  {
    name: "Dr. Lisa Wang",
    email: "lisa.wang@mit.edu",
    password: "SecurePass123!",
    role: "expert",
    expertise: ["healthcare", "ai"],
    institution: "MIT",
    department: "Computer Science and Artificial Intelligence Laboratory",
    verified: true,
    bio: "AI researcher focused on healthcare applications. Developing machine learning models for medical diagnosis and drug discovery.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      twitter: "https://twitter.com/lisawang_ai",
      linkedin: "https://linkedin.com/in/lisawang",
      orcid: "0000-0004-3456-7890"
    },
    preferences: {
      emailNotifications: true,
      researchAlerts: true,
      categories: ["healthcare", "ai"]
    },
    stats: {
      articlesRead: 634,
      bookmarks: 78,
      following: 34,
      followers: 145
    }
  }
];

// Function to generate additional realistic users
function generateAdditionalUsers(): any[] {
  const firstNames = [
    "James", "Emma", "Robert", "Olivia", "William", "Ava", "Benjamin", "Isabella",
    "Lucas", "Sophia", "Henry", "Charlotte", "Alexander", "Mia", "Mason", "Amelia",
    "Ethan", "Harper", "Daniel", "Evelyn", "Matthew", "Abigail", "Aiden", "Emily",
    "Jackson", "Elizabeth", "Samuel", "Sofia", "David", "Avery", "Joseph", "Ella",
    "Carter", "Madison", "Owen", "Scarlett", "Wyatt", "Victoria", "John", "Aria"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
  ];
  
  const institutions = [
    "Harvard University", "Stanford University", "MIT", "Yale University", "Princeton University",
    "University of California Berkeley", "University of Pennsylvania", "Duke University",
    "Northwestern University", "University of Chicago", "Johns Hopkins University",
    "Columbia University", "University of Michigan", "New York University", "Boston University",
    "University of California Los Angeles", "University of Southern California", "Vanderbilt University",
    "Rice University", "Georgetown University", "Carnegie Mellon University", "University of Virginia",
    "Wake Forest University", "Tufts University", "University of Rochester", "Case Western Reserve University"
  ];
  
  const departments = [
    "Department of Biology", "Department of Chemistry", "Department of Physics",
    "Department of Computer Science", "Department of Engineering", "Department of Medicine",
    "Department of Neuroscience", "Department of Bioengineering", "Department of Genetics",
    "Department of Pharmacology", "Department of Biochemistry", "Department of Psychology"
  ];
  
  const expertiseAreas = [
    ["neuroscience", "ai"], ["healthcare", "ai"],
    ["genetics", "biotech"], ["pharmaceuticals", "genetics"],
    ["biotech", "ai"], ["healthcare", "neuroscience"],
    ["genetics", "pharmaceuticals"], ["ai", "neuroscience"]
  ];
  
  const roles = ["user", "expert", "user"];
  const roleWeights = [0.6, 0.3, 0.1]; // 60% users, 30% experts, 10% regular users
  
  const additionalUsers = [];
  
  for (let i = 0; i < 200; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const institution = institutions[Math.floor(Math.random() * institutions.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const expertise = expertiseAreas[Math.floor(Math.random() * expertiseAreas.length)];
    
    // Weighted role selection
    const roleRandom = Math.random();
    let role = "user";
    if (roleRandom < roleWeights[1]) role = "expert";
    else if (roleRandom < roleWeights[0] + roleWeights[1]) role = "user";
    
    const isVerified = role === "expert" || Math.random() > 0.7;
    
    additionalUsers.push({
      name: `${role === "expert" ? "Dr." : ""} ${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.edu`,
      password: "SecurePass123!",
      role,
      expertise: role !== "user" ? expertise : [],
      institution: role !== "user" ? institution : undefined,
      department: role !== "user" ? department : undefined,
      verified: isVerified,
      bio: generateBio(role, expertise),
      avatar: `https://images.unsplash.com/photo-${1500000000 + i}?w=150&h=150&fit=crop&crop=face`,
      socialLinks: Math.random() > 0.5 ? {
        linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        ...(Math.random() > 0.7 ? { twitter: `https://twitter.com/${firstName.toLowerCase()}_${lastName.toLowerCase()}` } : {}),
        ...(role === "expert" && Math.random() > 0.6 ? { orcid: `0000-000${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` } : {})
      } : {},
      preferences: {
        emailNotifications: Math.random() > 0.3,
        darkMode: Math.random() > 0.5,
        categories: [expertise[0], ...(Math.random() > 0.6 && expertise[1] && expertise[1] !== expertise[0] ? [expertise[1]] : [])]
      },
      stats: {
        articlesRead: Math.floor(Math.random() * 1000) + 50,
        bookmarks: Math.floor(Math.random() * 200) + 10,
        following: Math.floor(Math.random() * 100) + 5,
        followers: Math.floor(Math.random() * (role === "expert" ? 500 : 50)) + 1
      }
    });
  }
  
  return additionalUsers;
}

function generateBio(role: string, expertise: string[]): string {
  const bios = {
    expert: [
      `Leading researcher in ${expertise[0].toLowerCase()} with extensive experience in ${expertise[1]?.toLowerCase() || 'related fields'}. Published numerous papers in top-tier journals.`,
      `Pioneer in ${expertise[0].toLowerCase()} research. Director of research initiatives focusing on ${expertise[1]?.toLowerCase() || 'innovative applications'}.`,
      `Internationally recognized expert in ${expertise[0].toLowerCase()}. Dedicated to advancing ${expertise[1]?.toLowerCase() || 'scientific knowledge'} through cutting-edge research.`
    ],

    user: [
      "Science enthusiast interested in the latest research developments.",
      "Graduate student following cutting-edge research in multiple fields.",
      "Healthcare professional staying updated with the latest scientific advances."
    ]
  };
  
  const roleBios = bios[role as keyof typeof bios] || bios.user;
  return roleBios[Math.floor(Math.random() * roleBios.length)];
}

async function seedProductionUsers() {
  try {
    console.log('👥 Starting production user seeding...');
    
    // Connect to MongoDB
    await connectMongoose();
    
    // Clear existing user data (except admin users)
    await User.deleteMany({ role: { $ne: 'admin' } });
    console.log('🗑️  Cleared existing user data');
    
    // Combine manual and generated data
    const allUserData = [...productionUsers, ...generateAdditionalUsers()];
    
    console.log(`👤 Processing ${allUserData.length} users...`);
    
    // Hash passwords and insert users
    const processedUsers = [];
    for (const userData of allUserData) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      processedUsers.push({
        ...userData,
        password: hashedPassword,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
        lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last month
        isActive: Math.random() > 0.1 // 90% active users
      });
    }
    
    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < processedUsers.length; i += batchSize) {
      const batch = processedUsers.slice(i, i + batchSize);
      await User.insertMany(batch);
      console.log(`✅ Inserted user batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(processedUsers.length / batchSize)}`);
    }
    
    // Verify insertion
    const count = await User.countDocuments();
    console.log(`✅ Successfully seeded ${count} users`);
    
    // Display role breakdown
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Role breakdown:');
    roleStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} users`);
    });
    
    // Display verification stats
    const verificationStats = await User.aggregate([
      { $group: { _id: '$verified', count: { $sum: 1 } } }
    ]);
    
    console.log('\n✅ Verification breakdown:');
    verificationStats.forEach(stat => {
      console.log(`   ${stat._id ? 'Verified' : 'Unverified'}: ${stat.count} users`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding user data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedProductionUsers()
    .then(() => {
      console.log('🎉 Production user seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedProductionUsers;
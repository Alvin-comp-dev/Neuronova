import seedProductionUsers from './seed-production-users';
import seedProductionResearch from './seed-production-research';
import { connectMongoose } from '../../src/lib/mongodb';

async function seedProductionComplete() {
  try {
    console.log('🚀 Starting complete production database seeding...\n');
    
    // Connect to MongoDB
    await connectMongoose();
    console.log('✅ Connected to MongoDB\n');
    
    // Seed users first
    console.log('='.repeat(50));
    console.log('PHASE 1: SEEDING USERS');
    console.log('='.repeat(50));
    await seedProductionUsers();
    
    console.log('\n' + '='.repeat(50));
    console.log('PHASE 2: SEEDING RESEARCH ARTICLES');
    console.log('='.repeat(50));
    await seedProductionResearch();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 PRODUCTION SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    
    // Final statistics
    const User = (await import('../models/User')).default;
    const Research = (await import('../models/Research')).default;
    
    const userCount = await User.countDocuments();
    const researchCount = await Research.countDocuments();
    
    console.log('\n📊 FINAL STATISTICS:');
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   📚 Total Research Articles: ${researchCount}`);
    console.log(`   🎯 Database Status: PRODUCTION READY`);
    
  } catch (error) {
    console.error('💥 Production seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedProductionComplete()
    .then(() => {
      console.log('\n✨ Your Neuronova database is now production-ready!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Complete seeding failed:', error);
      process.exit(1);
    });
}

export default seedProductionComplete;
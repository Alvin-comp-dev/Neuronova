#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/database';
import { seedDatabase } from '../utils/seedData';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runSeed() {
  try {
    console.log('🚀 Starting database seeding process...');
    
    // Connect to database
    await connectDB();
    
    // Run seed
    const success = await seedDatabase();
    
    if (success) {
      console.log('✅ Database seeding completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Database seeding failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed script
runSeed(); 
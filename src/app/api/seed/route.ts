import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-database';

export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Database seeding is not allowed in production' },
        { status: 403 }
      );
    }

    console.log('🌱 Starting database seeding via API...');
    const result = await seedDatabase();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Seed API error:', error);
    
    // Handle MongoDB connection errors gracefully
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return NextResponse.json({
        success: false,
        error: 'MongoDB not configured. Please set MONGODB_URI environment variable.',
      }, { status: 503 });
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
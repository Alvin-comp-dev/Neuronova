import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real implementation, these would come from your database
    // For now, we'll return mock data with realistic values
    
    const stats = {
      totalUsers: 1247,
      activeUsers: 89,
      totalResearch: 3456,
      pendingModeration: 12,
      systemHealth: 'healthy' as const,
      serverUptime: '7d 14h 23m',
      systemMetrics: {
        cpuUsage: 45,
        memoryUsage: 72,
        databaseUsage: 28,
        networkIO: 15
      },
      recentActivity: [
        {
          id: '1',
          action: 'New user registration',
          user: 'john.doe@example.com',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          type: 'user'
        },
        {
          id: '2',
          action: 'Research paper published',
          user: 'Dr. Smith',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          type: 'content'
        },
        {
          id: '3',
          action: 'Content flagged for review',
          user: 'System',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          type: 'moderation'
        },
        {
          id: '4',
          action: 'Database backup completed',
          user: 'System',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          type: 'system'
        }
      ]
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
} 
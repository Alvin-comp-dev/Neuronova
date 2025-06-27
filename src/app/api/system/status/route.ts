import { NextRequest, NextResponse } from 'next/server';
import { cacheService } from '../../../../../server/services/cacheService';
import { rateLimitService } from '../../../../../server/services/rateLimitService';

export async function GET(request: NextRequest) {
  try {
    // Get cache statistics
    const cacheStats = cacheService.getStats();
    
    // Get rate limiting statistics
    const rateLimitStats = await rateLimitService.getStats();
    
    // Get system info
    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform
    };

    return NextResponse.json({
      success: true,
      data: {
        system: systemInfo,
        cache: cacheStats,
        rateLimits: rateLimitStats
      }
    });

  } catch (error) {
    console.error('❌ System status API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get system status',
      data: null
    }, { status: 500 });
  }
}

// POST endpoint to reset rate limits (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, service } = body;

    if (action === 'resetRateLimit' && service) {
      await rateLimitService.resetLimits(service);
      return NextResponse.json({
        success: true,
        message: `Rate limits reset for ${service}`
      });
    }

    if (action === 'flushCache') {
      await cacheService.flushAll();
      return NextResponse.json({
        success: true,
        message: 'Cache flushed successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ System status POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to execute system action'
    }, { status: 500 });
  }
} 
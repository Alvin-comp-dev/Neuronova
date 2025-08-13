import { NextRequest, NextResponse } from 'next/server';
import cacheService from '../../../../../server/services/cacheService';
import { rateLimitService } from '../../../../../server/services/rateLimitService';

export async function GET(request: NextRequest) {
  try {
    // Get cache statistics
    const cacheStats = await cacheService.getStats();
    
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

    // Format cache stats to match what the frontend expects
    const formattedCacheStats = {
      hits: cacheStats?.memory?.hits || 0,
      misses: cacheStats?.memory?.misses || 0,
      size: cacheStats?.memory?.keys || 0
    };

    // Format rate limit stats to match what the frontend expects
    const services = Object.keys(rateLimitStats || {});
    const formattedRateLimitStats = {
      total: services.length,
      active: services.filter(service => rateLimitStats[service]?.current?.blocked).length
    };

    return NextResponse.json({
      success: true,
      data: {
        system: systemInfo,
        cache: formattedCacheStats,
        rateLimits: formattedRateLimitStats
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
      await cacheService.flush();
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
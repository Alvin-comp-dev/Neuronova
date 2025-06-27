// Temporarily disable cache service for development
// import { cacheService } from './cacheService';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  blockDurationMs?: number; // How long to block after exceeding limit
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockEndTime?: number;
}

class RateLimitService {
  private defaultConfigs: { [service: string]: RateLimitConfig } = {
    pubmed: {
      windowMs: 3600000, // 1 hour
      maxRequests: 100,
      blockDurationMs: 1800000 // 30 minutes
    },
    arxiv: {
      windowMs: 3600000, // 1 hour
      maxRequests: 1000,
      blockDurationMs: 900000 // 15 minutes
    },
    biorxiv: {
      windowMs: 3600000, // 1 hour
      maxRequests: 100,
      blockDurationMs: 1800000 // 30 minutes
    }
  };

  private getKey(service: string, identifier: string = 'global'): string {
    return `ratelimit:${service}:${identifier}`;
  }

  async isAllowed(service: string, identifier: string = 'global'): Promise<boolean> {
    // Rate limiting disabled for development - always allow requests
    console.log(`🔧 Rate limiting disabled for development - allowing ${service}:${identifier}`);
    return true;

  }

  async getRemainingRequests(service: string, identifier: string = 'global'): Promise<number> {
    // Rate limiting disabled - return unlimited
    return Infinity;
  }

  async getResetTime(service: string, identifier: string = 'global'): Promise<number> {
    // Rate limiting disabled - no reset time needed
    return 0;
  }

  async getStats(service?: string): Promise<any> {
    // Rate limiting disabled - return mock stats
    const services = service ? [service] : Object.keys(this.defaultConfigs);
    const stats: any = {};
    
    for (const svc of services) {
      stats[svc] = {
        config: this.defaultConfigs[svc],
        current: { count: 0, resetTime: 0, blocked: false },
        remainingRequests: Infinity,
        resetTime: 0,
        status: 'disabled'
      };
    }
    
    return stats;
  }

  async resetLimits(service: string, identifier: string = 'global'): Promise<void> {
    // Rate limiting disabled - nothing to reset
    console.log(`🔧 Rate limiting disabled - reset not needed for ${service}:${identifier}`);
  }

  // Update service configuration
  updateConfig(service: string, config: Partial<RateLimitConfig>): void {
    this.defaultConfigs[service] = {
      ...this.defaultConfigs[service],
      ...config
    };
    console.log(`⚙️ Rate limit config updated for ${service}:`, this.defaultConfigs[service]);
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService(); 
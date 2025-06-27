// Redis completely disabled for development - using mock Redis
import NodeCache from 'node-cache';

// Mock Redis class to prevent any Redis connections
class MockRedis {
  status = 'disconnected';
  async ping() { throw new Error('Redis disabled'); }
  async get() { return null; }
  async set() { return 'OK'; }
  async setex() { return 'OK'; }
  async del() { return 1; }
  async exists() { return 0; }
  async flushall() { return 'OK'; }
  on() { return this; }
  disconnect() { return Promise.resolve(); }
}

class CacheService {
  private redis: MockRedis | null = null; // Using mock Redis
  private memoryCache: NodeCache;
  private isRedisAvailable = false;

  constructor() {
    // Initialize in-memory cache as fallback
    this.memoryCache = new NodeCache({ stdTTL: 86400 }); // 24 hours

    // Always use mock Redis in development for faster startup
    console.log('🔧 Cache service: Using memory cache only (Redis disabled for development)');
    this.isRedisAvailable = false;
    this.redis = new MockRedis();
  }

  // Redis initialization method removed - using memory cache only in development

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isRedisAvailable && this.redis) {
        const value = await this.redis.get(key);
        if (value) {
          return JSON.parse(value);
        }
      }
    } catch (error) {
      console.warn('⚠️ Redis get error, falling back to memory cache:', error);
    }

    // Fallback to memory cache
    return this.memoryCache.get<T>(key) || null;
  }

  async set(key: string, value: any, ttlSeconds: number = 86400): Promise<void> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
        return;
      }
    } catch (error) {
      console.warn('⚠️ Redis set error, falling back to memory cache:', error);
    }

    // Fallback to memory cache
    this.memoryCache.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.del(key);
      }
    } catch (error) {
      console.warn('⚠️ Redis delete error:', error);
    }

    // Also delete from memory cache
    this.memoryCache.del(key);
  }

  async has(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        const exists = await this.redis.exists(key);
        return exists === 1;
      }
    } catch (error) {
      console.warn('⚠️ Redis exists error, checking memory cache:', error);
    }

    // Fallback to memory cache
    return this.memoryCache.has(key);
  }

  async flushAll(): Promise<void> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.flushall();
      }
    } catch (error) {
      console.warn('⚠️ Redis flush error:', error);
    }

    // Also flush memory cache
    this.memoryCache.flushAll();
  }

  // Get cache stats
  getStats() {
    const memoryStats = this.memoryCache.getStats();
    return {
      redis: {
        available: this.isRedisAvailable,
        connected: this.redis?.status === 'ready'
      },
      memory: {
        keys: memoryStats.keys,
        hits: memoryStats.hits,
        misses: memoryStats.misses,
        hitRate: memoryStats.hits / (memoryStats.hits + memoryStats.misses) || 0
      }
    };
  }
}

// Export singleton instance
export const cacheService = new CacheService(); 
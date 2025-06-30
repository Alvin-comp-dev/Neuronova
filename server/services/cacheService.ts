// Redis completely disabled for development - using mock Redis
import NodeCache from 'node-cache';

// Mock Redis class to prevent any Redis connections
class MockRedis {
  status = 'disconnected';
  async ping(): Promise<string> { throw new Error('Redis disabled'); }
  async get(key: string): Promise<string | null> { return null; }
  async set(key: string, value: string): Promise<'OK'> { return 'OK'; }
  async setex(key: string, seconds: number, value: string): Promise<'OK'> { return 'OK'; }
  async del(key: string): Promise<number> { return 1; }
  async exists(key: string): Promise<number> { return 0; }
  async flushall(): Promise<'OK'> { return 'OK'; }
  on(event: string, callback: () => void): this { return this; }
  disconnect(): Promise<void> { return Promise.resolve(); }
}

// Create cache instance with default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

export class CacheService {
  private static instance: CacheService;
  private cache: NodeCache;
  private redis: MockRedis | null = null; // Using mock Redis
  private isRedisAvailable = false;

  private constructor() {
    this.cache = cache;

    // Always use mock Redis in development for faster startup
    console.log('🔧 Cache service: Using memory cache only (Redis disabled for development)');
    this.isRedisAvailable = false;
    this.redis = new MockRedis();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Get value from cache
  public async get<T>(key: string): Promise<T | undefined> {
    try {
      if (this.isRedisAvailable && this.redis) {
        const value = await this.redis.get(key);
        if (value) {
          return JSON.parse(value);
        }
      }
      // Fallback to memory cache
      return this.cache.get<T>(key);
    } catch (error) {
      console.warn('⚠️ Redis get error, falling back to memory cache:', error);
      return undefined;
    }
  }

  // Set value in cache
  public async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.setex(key, ttl || 3600, JSON.stringify(value));
        return true;
      }
      // Fallback to memory cache
      return this.cache.set(key, value, ttl || 3600);
    } catch (error) {
      console.warn('⚠️ Redis set error, falling back to memory cache:', error);
      return false;
    }
  }

  // Delete value from cache
  public async del(key: string): Promise<number> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.del(key);
      }
      // Also delete from memory cache
      return this.cache.del(key);
    } catch (error) {
      console.warn('⚠️ Redis delete error:', error);
      return 0;
    }
  }

  // Clear all cache
  public async flush(): Promise<void> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.flushall();
      }
      // Also flush memory cache
      this.cache.flushAll();
    } catch (error) {
      console.warn('⚠️ Redis flush error:', error);
    }
  }

  // Get cache statistics
  public async getStats(): Promise<any> {
    try {
      const memoryStats = this.cache.getStats();
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
    } catch (error) {
      console.error('Cache stats error:', error);
      return { keys: 0, hits: 0, misses: 0, ksize: 0, vsize: 0 };
    }
  }

  // Check if key exists
  public async has(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && this.redis) {
        const exists = await this.redis.exists(key);
        return exists === 1;
      }
      // Fallback to memory cache
      return this.cache.has(key);
    } catch (error) {
      console.warn('⚠️ Redis exists error, checking memory cache:', error);
      return false;
    }
  }

  // Get all keys
  public async keys(): Promise<string[]> {
    try {
      return this.cache.keys();
    } catch (error) {
      console.error('Cache keys error:', error);
      return [];
    }
  }

  // Set multiple values
  public async mset<T>(keyValuePairs: Array<{ key: string; val: T; ttl?: number }>): Promise<boolean> {
    try {
      return this.cache.mset(keyValuePairs);
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  // Get multiple values
  public async mget<T>(keys: string[]): Promise<{ [key: string]: T }> {
    try {
      return this.cache.mget(keys);
    } catch (error) {
      console.error('Cache mget error:', error);
      return {};
    }
  }
}

// Export singleton instance
export default CacheService.getInstance(); 
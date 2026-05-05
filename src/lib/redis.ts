// ============================================================
// Redis Client — Caching & Rate Limiting Provider
// ============================================================

import { Redis } from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

// Initialize Redis Client
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  keyPrefix: 'BLOG:', // Added prefix as requested
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  // Stop trying if too many errors
  reconnectOnError(err: Error) {
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      return true
    }
    return false
  },
})

// ioredis evalsha signature: (sha, numKeys, ...keys, ...args)
// hono-rate-limiter expects: (sha, keys[], args[])

/**
 * Compatibility wrapper for hono-rate-limiter
 * ioredis doesn't have scriptLoad and has a different evalsha signature
 */
export const rateLimitClient = {
  scriptLoad: (script: string) => redis.script('LOAD', script),
  evalsha: (sha: string, keys: string[], args: any[]) => redis.evalsha(sha, keys.length, ...keys, ...args),
  decr: (key: string) => redis.decr(key),
  del: (key: string) => redis.del(key),
  get: (key: string) => redis.get(key),
  set: (key: string, value: string, ...args: any[]) => redis.set(key, value, ...args),
}

// Connection Event Handlers
redis.on('connect', () => {
  console.log('⚡ Redis: Connected')
})

redis.on('error', (err: Error) => {
  console.warn('⚠️ Redis: Connection Error -', err.message)
})

/**
 * Cache Helper: Set data with TTL
 */
export async function setCache(key: string, value: any, ttlSeconds: number = 3600) {
  try {
    const stringValue = JSON.stringify(value)
    await redis.set(key, stringValue, 'EX', ttlSeconds)
  } catch (err: any) {
    console.error('Cache Set Error:', err)
  }
}

/**
 * Cache Helper: Get data
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (err: any) {
    console.error('Cache Get Error:', err)
    return null
  }
}

/**
 * Cache Helper: Invalidate key
 */
export async function delCache(key: string) {
  try {
    await redis.del(key)
  } catch (err: any) {
    console.error('Cache Delete Error:', err)
  }
}

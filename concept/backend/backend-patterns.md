# Essential Backend Patterns Every Engineer Should Know

A practical guide using Hono, but these patterns apply to any framework.

---

## 1. Request/Response Validation with Zod

Never trust incoming data. Validate everything.

```ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// Define schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().positive().optional(),
})

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// Validate request body
app.post('/users', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json') // fully typed!
  const user = await createUser(data)
  return c.json(user, 201)
})

// Validate query params
app.get('/users', zValidator('query', querySchema), async (c) => {
  const { page, limit } = c.req.valid('query')
  const users = await getUsers({ page, limit })
  return c.json(users)
})

// Validate route params
const paramSchema = z.object({
  id: z.string().uuid(),
})

app.get('/users/:id', zValidator('param', paramSchema), async (c) => {
  const { id } = c.req.valid('param')
  const user = await getUserById(id)
  return c.json(user)
})
```

---

## 2. Third-Party API Requests

Wrap external APIs with proper error handling, timeouts, and retries.

```ts
// lib/api-client.ts
interface RequestConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
}

class APIClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<T> {
    const { timeout = 10000, retries = 3, retryDelay = 1000, ...fetchOptions } = options

    let lastError: Error | null = null

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...fetchOptions,
          headers: { ...this.defaultHeaders, ...fetchOptions.headers },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          // Don't retry client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            const error = await response.json().catch(() => ({}))
            throw new APIError(response.status, error.message || 'Client error')
          }
          throw new Error(`HTTP ${response.status}`)
        }

        return await response.json()
      } catch (error) {
        lastError = error as Error

        // Don't retry on abort or client errors
        if (error instanceof APIError || (error as Error).name === 'AbortError') {
          throw error
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries - 1) {
          await sleep(retryDelay * Math.pow(2, attempt))
        }
      }
    }

    throw lastError
  }

  get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { method: 'GET', ...config })
  }

  post<T>(endpoint: string, body: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...config,
    })
  }
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Usage
const stripeClient = new APIClient('https://api.stripe.com/v1', process.env.STRIPE_KEY)
const githubClient = new APIClient('https://api.github.com')
```

---

## 3. Promise.all and Parallel Requests

Fetch multiple resources concurrently, but handle failures gracefully.

```ts
// Basic Promise.all - fails if ANY promise rejects
app.get('/dashboard/:userId', async (c) => {
  const userId = c.req.param('userId')

  const [user, orders, notifications] = await Promise.all([
    getUserById(userId),
    getOrdersByUser(userId),
    getNotifications(userId),
  ])

  return c.json({ user, orders, notifications })
})

// Promise.allSettled - get all results even if some fail
app.get('/dashboard/:userId/safe', async (c) => {
  const userId = c.req.param('userId')

  const results = await Promise.allSettled([
    getUserById(userId),
    getOrdersByUser(userId),
    getNotifications(userId),
    getRecommendations(userId), // non-critical, might fail
  ])

  const [userResult, ordersResult, notificationsResult, recsResult] = results

  // User is required
  if (userResult.status === 'rejected') {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({
    user: userResult.value,
    orders: ordersResult.status === 'fulfilled' ? ordersResult.value : [],
    notifications: notificationsResult.status === 'fulfilled' ? notificationsResult.value : [],
    recommendations: recsResult.status === 'fulfilled' ? recsResult.value : [],
  })
})

// Batching with concurrency limits
async function fetchInBatches<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  batchSize = 5
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
  }

  return results
}

// Usage: fetch 100 users, 5 at a time
const userIds = Array.from({ length: 100 }, (_, i) => i + 1)
const users = await fetchInBatches(userIds, getUserById, 5)
```

---

## 4. Error Handling Middleware

Centralized error handling keeps your routes clean.

```ts
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

// Custom error classes
class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}

// Global error handler
app.onError((err, c) => {
  console.error(`[ERROR] ${err.message}`, {
    path: c.req.path,
    method: c.req.method,
    stack: err.stack,
  })

  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }

  if (err instanceof NotFoundError) {
    return c.json({ error: err.message }, 404)
  }

  if (err instanceof ValidationError) {
    return c.json({ error: err.message, details: err.errors }, 400)
  }

  // Don't leak internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message

  return c.json({ error: message }, 500)
})

// Now routes can throw freely
app.get('/users/:id', async (c) => {
  const user = await getUserById(c.req.param('id'))
  if (!user) throw new NotFoundError('User')
  return c.json(user)
})
```

---

## 5. Authentication & Authorization Middleware

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

// JWT authentication
app.use('/api/*', jwt({ secret: process.env.JWT_SECRET! }))

// Custom auth middleware with user loading
const authenticate = createMiddleware<{
  Variables: { user: User }
}>(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const payload = await verifyToken(token)
    const user = await getUserById(payload.userId)

    if (!user) {
      return c.json({ error: 'User not found' }, 401)
    }

    c.set('user', user)
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

// Role-based authorization
const requireRole = (...roles: string[]) => {
  return createMiddleware<{ Variables: { user: User } }>(async (c, next) => {
    const user = c.get('user')

    if (!roles.includes(user.role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    await next()
  })
}

// Usage
app.use('/api/*', authenticate)
app.get('/api/admin/users', requireRole('admin'), async (c) => {
  return c.json(await getAllUsers())
})
```

---

## 6. Rate Limiting

Protect your API from abuse.

```ts
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

// In-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const rateLimit = (options: { max: number; windowMs: number }) => {
  return createMiddleware(async (c, next) => {
    const key = c.req.header('x-forwarded-for') || 'unknown'
    const now = Date.now()

    let record = rateLimitStore.get(key)

    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + options.windowMs }
      rateLimitStore.set(key, record)
    }

    record.count++

    // Set rate limit headers
    c.header('X-RateLimit-Limit', options.max.toString())
    c.header('X-RateLimit-Remaining', Math.max(0, options.max - record.count).toString())
    c.header('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000).toString())

    if (record.count > options.max) {
      return c.json({ error: 'Too many requests' }, 429)
    }

    await next()
  })
}

// Apply globally or per-route
app.use('/api/*', rateLimit({ max: 100, windowMs: 60 * 1000 })) // 100 req/min

// Stricter limit for auth endpoints
app.use('/auth/*', rateLimit({ max: 5, windowMs: 60 * 1000 })) // 5 req/min
```

---

## 7. Request Logging & Tracing

```ts
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const requestLogger = createMiddleware(async (c, next) => {
  const requestId = crypto.randomUUID()
  const start = Date.now()

  // Add request ID to headers for tracing
  c.header('X-Request-ID', requestId)

  console.log(`[${requestId}] --> ${c.req.method} ${c.req.path}`)

  await next()

  const duration = Date.now() - start
  const status = c.res.status

  console.log(`[${requestId}] <-- ${status} ${duration}ms`)

  // Log slow requests
  if (duration > 1000) {
    console.warn(`[${requestId}] SLOW REQUEST: ${duration}ms`)
  }
})

app.use('*', requestLogger)
```

---

## 8. Database Transaction Pattern

Ensure data consistency with transactions.

```ts
// Using a transaction wrapper (works with Prisma, Drizzle, etc.)
async function withTransaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
  const tx = await db.transaction()

  try {
    const result = await fn(tx)
    await tx.commit()
    return result
  } catch (error) {
    await tx.rollback()
    throw error
  }
}

// Usage
app.post('/orders', async (c) => {
  const { userId, items } = await c.req.json()

  const order = await withTransaction(async (tx) => {
    // Create order
    const order = await tx.orders.create({
      userId,
      status: 'pending',
    })

    // Create order items
    await tx.orderItems.createMany({
      data: items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      })),
    })

    // Deduct inventory
    for (const item of items) {
      const updated = await tx.products.update({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      })

      if (!updated) {
        throw new Error(`Insufficient stock for product ${item.productId}`)
      }
    }

    return order
  })

  return c.json(order, 201)
})
```

---

## 9. Caching Pattern

```ts
// Simple in-memory cache (use Redis in production)
class Cache {
  private store = new Map<string, { value: unknown; expiresAt: number }>()

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key)
    if (!item) return null
    if (Date.now() > item.expiresAt) {
      this.store.delete(key)
      return null
    }
    return item.value as T
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  async getOrSet<T>(key: string, fn: () => Promise<T>, ttlSeconds: number): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached

    const value = await fn()
    await this.set(key, value, ttlSeconds)
    return value
  }
}

const cache = new Cache()

// Usage
app.get('/products/:id', async (c) => {
  const id = c.req.param('id')

  const product = await cache.getOrSet(
    `product:${id}`,
    () => getProductById(id),
    300 // cache for 5 minutes
  )

  if (!product) {
    return c.json({ error: 'Product not found' }, 404)
  }

  return c.json(product)
})
```

---

## 10. Circuit Breaker Pattern

Prevent cascading failures when external services are down.

```ts
enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

class CircuitBreaker {
  private state = CircuitState.CLOSED
  private failures = 0
  private lastFailure = 0
  private successCount = 0

  constructor(
    private threshold: number = 5,      // failures before opening
    private timeout: number = 30000,    // time before trying again
    private successThreshold: number = 2 // successes to close
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailure > this.timeout) {
        this.state = CircuitState.HALF_OPEN
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await fn()

      if (this.state === CircuitState.HALF_OPEN) {
        this.successCount++
        if (this.successCount >= this.successThreshold) {
          this.reset()
        }
      }

      return result
    } catch (error) {
      this.recordFailure()
      throw error
    }
  }

  private recordFailure() {
    this.failures++
    this.lastFailure = Date.now()

    if (this.failures >= this.threshold) {
      this.state = CircuitState.OPEN
    }
  }

  private reset() {
    this.state = CircuitState.CLOSED
    this.failures = 0
    this.successCount = 0
  }
}

// Usage
const paymentCircuit = new CircuitBreaker()

app.post('/payments', async (c) => {
  try {
    const result = await paymentCircuit.execute(() => 
      stripeClient.post('/charges', await c.req.json())
    )
    return c.json(result)
  } catch (error) {
    if (error.message === 'Circuit breaker is OPEN') {
      return c.json({ error: 'Payment service temporarily unavailable' }, 503)
    }
    throw error
  }
})
```

---

## 11. Pagination Pattern

```ts
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

async function paginate<T>(
  query: { page: number; limit: number },
  fetchFn: (skip: number, take: number) => Promise<T[]>,
  countFn: () => Promise<number>
): Promise<PaginatedResponse<T>> {
  const skip = (query.page - 1) * query.limit
  
  const [data, total] = await Promise.all([
    fetchFn(skip, query.limit),
    countFn(),
  ])

  const totalPages = Math.ceil(total / query.limit)

  return {
    data,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    },
  }
}

// Usage
app.get('/users', zValidator('query', paginationSchema), async (c) => {
  const query = c.req.valid('query')

  const result = await paginate(
    query,
    (skip, take) => db.users.findMany({ skip, take }),
    () => db.users.count()
  )

  return c.json(result)
})
```

---

## 12. Idempotency for Safe Retries

Ensure operations can be safely retried without side effects.

```ts
const idempotencyStore = new Map<string, { response: unknown; createdAt: number }>()

const idempotent = createMiddleware(async (c, next) => {
  const key = c.req.header('Idempotency-Key')

  if (!key) {
    await next()
    return
  }

  // Check if we've seen this key before
  const cached = idempotencyStore.get(key)
  if (cached) {
    return c.json(cached.response)
  }

  await next()

  // Store the response
  const body = await c.res.clone().json()
  idempotencyStore.set(key, {
    response: body,
    createdAt: Date.now(),
  })
})

app.post('/payments', idempotent, async (c) => {
  const payment = await processPayment(await c.req.json())
  return c.json(payment, 201)
})

// Client usage:
// fetch('/payments', {
//   method: 'POST',
//   headers: { 'Idempotency-Key': 'unique-request-id-123' },
//   body: JSON.stringify({ amount: 100 })
// })
```

---

## Quick Reference: Putting It All Together

```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()

// Global middleware (order matters!)
app.use('*', secureHeaders())
app.use('*', cors())
app.use('*', requestLogger)
app.use('/api/*', rateLimit({ max: 100, windowMs: 60000 }))
app.use('/api/*', authenticate)

// Health check (no auth)
app.get('/health', (c) => c.json({ status: 'ok' }))

// Routes
app.route('/api/users', userRoutes)
app.route('/api/orders', orderRoutes)

// Global error handler
app.onError(errorHandler)

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404))

export default app
```

---

These patterns form the foundation of robust backend applications. Master them, and you'll be equipped to handle most backend challenges you encounter.

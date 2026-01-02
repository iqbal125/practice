Great topic! Idempotency is a favorite interview subject because it shows you understand real-world distributed systems problems.

---

## What is Idempotency?

**An operation is idempotent if doing it multiple times has the same effect as doing it once.**

Why it matters:
- Networks fail, requests get retried
- Users double-click buttons
- Mobile apps retry on spotty connections
- Webhooks get sent multiple times

Without idempotency: User clicks "Pay" twice → charged twice 💸

---

## Pattern 1: Idempotency Keys (Most Common)

Client sends a unique key with each request. Server tracks what's been processed.

```typescript
interface ProcessedRequest {
  result: any;
  statusCode: number;
  processedAt: string;
}

const processedRequests = new Map<string, ProcessedRequest>();

app.post("/payments", async (c) => {
  const idempotencyKey = c.req.header("Idempotency-Key");
  
  // Require idempotency key for mutations
  if (!idempotencyKey) {
    return c.json({ error: "Idempotency-Key header required" }, 400);
  }
  
  // Check if we've already processed this request
  const existing = processedRequests.get(idempotencyKey);
  if (existing) {
    // Return the exact same response as before
    return c.json(existing.result, existing.statusCode);
  }
  
  // Process the payment
  const body = await c.req.json();
  const payment = {
    id: crypto.randomUUID(),
    amount: body.amount,
    currency: body.currency,
    status: "completed",
    createdAt: new Date().toISOString()
  };
  
  // Store the result
  processedRequests.set(idempotencyKey, {
    result: payment,
    statusCode: 201,
    processedAt: new Date().toISOString()
  });
  
  return c.json(payment, 201);
});
```

**Client usage:**
```bash
curl -X POST /payments \
  -H "Idempotency-Key: user123-order456-attempt1" \
  -d '{"amount": 100, "currency": "USD"}'
```

---

## Pattern 2: Idempotency Keys with Expiration

Keys shouldn't live forever - add TTL:

```typescript
interface ProcessedRequest {
  result: any;
  statusCode: number;
  expiresAt: number;
}

const processedRequests = new Map<string, ProcessedRequest>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Cleanup old keys periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of processedRequests) {
    if (value.expiresAt < now) {
      processedRequests.delete(key);
    }
  }
}, 60000);

app.post("/payments", async (c) => {
  const idempotencyKey = c.req.header("Idempotency-Key");
  if (!idempotencyKey) {
    return c.json({ error: "Idempotency-Key header required" }, 400);
  }
  
  const existing = processedRequests.get(idempotencyKey);
  if (existing && existing.expiresAt > Date.now()) {
    return c.json(existing.result, existing.statusCode);
  }
  
  // Process request...
  const result = { id: crypto.randomUUID(), status: "completed" };
  
  processedRequests.set(idempotencyKey, {
    result,
    statusCode: 201,
    expiresAt: Date.now() + TTL_MS
  });
  
  return c.json(result, 201);
});
```

---

## Pattern 3: Request Fingerprinting

Auto-generate idempotency key from request content:

```typescript
async function hashRequest(body: any, userId: string): Promise<string> {
  const content = JSON.stringify({ body, oderId });
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

app.post("/orders", async (c) => {
  const userId = c.req.header("X-User-Id") || "anonymous";
  const body = await c.req.json();
  
  // Generate fingerprint from request content
  const fingerprint = await hashRequest(body, oderId);
  
  const existing = processedRequests.get(fingerprint);
  if (existing) {
    return c.json(existing.result, existing.statusCode);
  }
  
  // Process order...
  const order = { id: crypto.randomUUID(), ...body };
  
  processedRequests.set(fingerprint, {
    result: order,
    statusCode: 201
  });
  
  return c.json(order, 201);
});
```

---

## Pattern 4: Handling In-Flight Requests

What if the same request comes in while we're still processing the first one?

```typescript
interface RequestState {
  status: "processing" | "completed";
  result?: any;
  statusCode?: number;
}

const requestStates = new Map<string, RequestState>();

app.post("/payments", async (c) => {
  const idempotencyKey = c.req.header("Idempotency-Key");
  if (!idempotencyKey) {
    return c.json({ error: "Idempotency-Key required" }, 400);
  }
  
  const existing = requestStates.get(idempotencyKey);
  
  if (existing) {
    if (existing.status === "processing") {
      // Request is still being processed - tell client to retry later
      return c.json(
        { error: "Request is being processed", retryAfter: 1 },
        409
      );
    }
    // Already completed - return cached result
    return c.json(existing.result, existing.statusCode);
  }
  
  // Mark as processing
  requestStates.set(idempotencyKey, { status: "processing" });
  
  try {
    // Simulate slow payment processing
    const body = await c.req.json();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const payment = {
      id: crypto.randomUUID(),
      amount: body.amount,
      status: "completed"
    };
    
    // Mark as completed
    requestStates.set(idempotencyKey, {
      status: "completed",
      result: payment,
      statusCode: 201
    });
    
    return c.json(payment, 201);
  } catch (error) {
    // Clean up on failure so client can retry
    requestStates.delete(idempotencyKey);
    throw error;
  }
});
```

---

## Pattern 5: Natural Idempotency Keys

Sometimes the business logic provides natural keys:

```typescript
// Order ID is naturally idempotent
app.post("/orders/:orderId/fulfill", async (c) => {
  const orderId = c.req.param("orderId");
  const order = orders.get(orderId);
  
  if (!order) return c.json({ error: "Order not found" }, 404);
  
  // Already fulfilled? Return success (idempotent!)
  if (order.status === "fulfilled") {
    return c.json({ message: "Order already fulfilled", order });
  }
  
  // Can only fulfill from certain states
  if (order.status !== "paid") {
    return c.json({ error: `Cannot fulfill order in ${order.status} state` }, 400);
  }
  
  order.status = "fulfilled";
  order.fulfilledAt = new Date().toISOString();
  
  return c.json({ message: "Order fulfilled", order });
});
```

---

## Pattern 6: Idempotent by Design (PUT vs POST)

```typescript
// POST - NOT naturally idempotent (creates new resource each time)
app.post("/users", async (c) => {
  const body = await c.req.json();
  const user = { id: crypto.randomUUID(), ...body };
  users.set(user.id, user);
  return c.json(user, 201);
});

// PUT - Naturally idempotent (same result every time)
app.put("/users/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  
  // Always sets to this exact state - idempotent!
  const user = { id, ...body, updatedAt: new Date().toISOString() };
  users.set(id, user);
  
  return c.json(user);
});

// DELETE - Naturally idempotent
app.delete("/users/:id", (c) => {
  const id = c.req.param("id");
  users.delete(id); // Deleting twice = same result
  return c.json({ deleted: true });
});
```

---

## Pattern 7: Idempotency Middleware

Reusable middleware for all routes:

```typescript
interface IdempotencyConfig {
  ttlMs?: number;
  headerName?: string;
  required?: boolean;
}

function idempotent(config: IdempotencyConfig = {}) {
  const {
    ttlMs = 86400000, // 24 hours
    headerName = "Idempotency-Key",
    required = true
  } = config;

  const cache = new Map<string, { result: any; status: number; expiresAt: number }>();

  return async (c: any, next: () => Promise<void>) => {
    // Only apply to mutating methods
    if (!["POST", "PUT", "PATCH"].includes(c.req.method)) {
      return next();
    }

    const key = c.req.header(headerName);

    if (!key) {
      if (required) {
        return c.json({ error: `${headerName} header required` }, 400);
      }
      return next();
    }

    // Check cache
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return c.json(cached.result, cached.status);
    }

    // Process request
    await next();

    // Cache response (simplified - in reality you'd capture the actual response)
    // This is a limitation of this simple example
  };
}

// Usage
app.use("/payments/*", idempotent({ required: true }));
app.use("/orders/*", idempotent({ required: false }));
```

---

## Pattern 8: Validating Idempotency Key Payload Match

Ensure the same key isn't reused with different payloads:

```typescript
interface StoredRequest {
  payloadHash: string;
  result: any;
  statusCode: number;
}

const stored = new Map<string, StoredRequest>();

function hashPayload(payload: any): string {
  return JSON.stringify(payload); // Simplified - use real hash in production
}

app.post("/transfers", async (c) => {
  const key = c.req.header("Idempotency-Key");
  if (!key) return c.json({ error: "Idempotency-Key required" }, 400);

  const body = await c.req.json();
  const payloadHash = hashPayload(body);

  const existing = stored.get(key);
  if (existing) {
    // Same key but different payload? That's an error!
    if (existing.payloadHash !== payloadHash) {
      return c.json({
        error: "Idempotency key already used with different payload"
      }, 422);
    }
    return c.json(existing.result, existing.statusCode);
  }

  // Process transfer...
  const transfer = {
    id: crypto.randomUUID(),
    ...body,
    status: "completed"
  };

  stored.set(key, {
    payloadHash,
    result: transfer,
    statusCode: 201
  });

  return c.json(transfer, 201);
});
```

---

## Quick Reference: When to Use Idempotency

| Operation | Naturally Idempotent? | Need Key? |
|-----------|----------------------|-----------|
| GET | ✅ Yes | No |
| DELETE | ✅ Yes | Usually no |
| PUT (full replace) | ✅ Yes | Usually no |
| PATCH | ⚠️ Depends | Maybe |
| POST (create) | ❌ No | **Yes** |
| POST (payment) | ❌ No | **Yes** |
| POST (send email) | ❌ No | **Yes** |

---

## Interview Talking Points

When discussing idempotency, mention:

1. **Why it matters** - Network retries, user double-clicks, webhook duplicates
2. **Client responsibility** - Client generates and stores the key until confirmed
3. **Key format** - Usually UUID or `userId-resourceId-timestamp`
4. **Storage** - In production: Redis with TTL, not in-memory
5. **Race conditions** - Handle concurrent requests with same key
6. **Payload matching** - Same key must have same payload

---

Want me to create a practice challenge focused on building an idempotent payment or order system?
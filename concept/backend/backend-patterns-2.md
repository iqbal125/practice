Good thinking - let's go beyond just CRUD. Here are other categories of problems that come up in backend interviews:

---

## 1. **URL Shortener**

Classic interview problem - tests hashing, storage, redirects.

```typescript
const urlMap = new Map<string, string>();
const BASE_URL = "http://short.ly/";

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8);
}

app.post("/shorten", async (c) => {
  const { url } = await c.req.json();
  
  if (!url || !url.startsWith("http")) {
    return c.json({ error: "Valid URL required" }, 400);
  }
  
  const code = generateCode();
  urlMap.set(code, url);
  
  return c.json({ shortUrl: `${BASE_URL}${code}`, code }, 201);
});

app.get("/:code", (c) => {
  const code = c.req.param("code");
  const originalUrl = urlMap.get(code);
  
  if (!originalUrl) return c.json({ error: "Not found" }, 404);
  
  return c.redirect(originalUrl, 302);
});
```

---

## 2. **Rate Limiter Service**

"Build an API that tracks and limits requests per user"

```typescript
interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const limits = new Map<string, RateLimitRecord>();
const MAX_TOKENS = 10;
const REFILL_RATE = 1; // tokens per second

app.post("/check-limit", async (c) => {
  const { userId } = await c.req.json();
  const now = Date.now();
  
  let record = limits.get(userId);
  
  if (!record) {
    record = { tokens: MAX_TOKENS, lastRefill: now };
  } else {
    // Refill tokens based on time passed
    const secondsPassed = (now - record.lastRefill) / 1000;
    record.tokens = Math.min(MAX_TOKENS, record.tokens + secondsPassed * REFILL_RATE);
    record.lastRefill = now;
  }
  
  if (record.tokens < 1) {
    limits.set(userId, record);
    return c.json({ allowed: false, retryAfter: Math.ceil(1 / REFILL_RATE) }, 429);
  }
  
  record.tokens -= 1;
  limits.set(userId, record);
  
  return c.json({ allowed: true, remainingTokens: Math.floor(record.tokens) });
});
```

---

## 3. **Task Queue / Job Processor**

"Build a simple job queue with status tracking"

```typescript
interface Job {
  id: string;
  type: string;
  payload: any;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  result?: any;
}

const jobs = new Map<string, Job>();

app.post("/jobs", async (c) => {
  const { type, payload } = await c.req.json();
  
  const job: Job = {
    id: crypto.randomUUID(),
    type,
    payload,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  
  jobs.set(job.id, job);
  
  // Simulate async processing
  setTimeout(() => {
    job.status = "completed";
    job.completedAt = new Date().toISOString();
    job.result = { processed: true };
  }, 3000);
  
  return c.json(job, 202); // Accepted
});

app.get("/jobs/:id", (c) => {
  const job = jobs.get(c.req.param("id"));
  if (!job) return c.json({ error: "Job not found" }, 404);
  return c.json(job);
});

// Poll for next pending job (worker pattern)
app.post("/jobs/claim", (c) => {
  const pending = Array.from(jobs.values())
    .find(j => j.status === "pending");
  
  if (!pending) return c.json({ message: "No jobs available" }, 204);
  
  pending.status = "processing";
  return c.json(pending);
});
```

---

## 4. **Booking / Reservation System**

"Prevent double-booking a time slot"

```typescript
interface Booking {
  id: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  userId: string;
}

const bookings = new Map<string, Booking>();

function hasOverlap(resourceId: string, start: Date, end: Date, excludeId?: string): boolean {
  return Array.from(bookings.values()).some(booking => {
    if (booking.resourceId !== resourceId) return false;
    if (excludeId && booking.id === excludeId) return false;
    
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    return start < bookingEnd && end > bookingStart;
  });
}

app.post("/bookings", async (c) => {
  const { resourceId, startTime, endTime, userId } = await c.req.json();
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (end <= start) {
    return c.json({ error: "End time must be after start time" }, 400);
  }
  
  if (hasOverlap(resourceId, start, end)) {
    return c.json({ error: "Time slot not available" }, 409);
  }
  
  const booking: Booking = {
    id: crypto.randomUUID(),
    resourceId,
    startTime,
    endTime,
    userId
  };
  
  bookings.set(booking.id, booking);
  return c.json(booking, 201);
});

// Check availability
app.get("/availability/:resourceId", (c) => {
  const resourceId = c.req.param("resourceId");
  const date = c.req.query("date"); // YYYY-MM-DD
  
  const dayBookings = Array.from(bookings.values())
    .filter(b => b.resourceId === resourceId && b.startTime.startsWith(date))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  return c.json({ date, bookings: dayBookings });
});
```

---

## 5. **Wallet / Balance System**

"Track credits, prevent negative balance"

```typescript
interface Wallet {
  userId: string;
  balance: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  timestamp: string;
  description: string;
}

const wallets = new Map<string, Wallet>();

function getOrCreateWallet(userId: string): Wallet {
  if (!wallets.has(userId)) {
    wallets.set(userId, { userId, balance: 0, transactions: [] });
  }
  return wallets.get(userId)!;
}

app.post("/wallets/:userId/credit", async (c) => {
  const userId = c.req.param("userId");
  const { amount, description } = await c.req.json();
  
  if (amount <= 0) return c.json({ error: "Amount must be positive" }, 400);
  
  const wallet = getOrCreateWallet(userId);
  wallet.balance += amount;
  wallet.transactions.push({
    id: crypto.randomUUID(),
    type: "credit",
    amount,
    timestamp: new Date().toISOString(),
    description
  });
  
  return c.json({ balance: wallet.balance });
});

app.post("/wallets/:userId/debit", async (c) => {
  const userId = c.req.param("userId");
  const { amount, description } = await c.req.json();
  
  if (amount <= 0) return c.json({ error: "Amount must be positive" }, 400);
  
  const wallet = getOrCreateWallet(userId);
  
  if (wallet.balance < amount) {
    return c.json({ error: "Insufficient balance" }, 400);
  }
  
  wallet.balance -= amount;
  wallet.transactions.push({
    id: crypto.randomUUID(),
    type: "debit",
    amount,
    timestamp: new Date().toISOString(),
    description
  });
  
  return c.json({ balance: wallet.balance });
});

app.get("/wallets/:userId", (c) => {
  const wallet = wallets.get(c.req.param("userId"));
  if (!wallet) return c.json({ error: "Wallet not found" }, 404);
  return c.json(wallet);
});
```

---

## 6. **Voting / Polling System**

"Users can vote once, get results"

```typescript
interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Map<string, string>; // oderId -> optionId
  createdAt: string;
}

const polls = new Map<string, Poll>();

app.post("/polls", async (c) => {
  const { question, options } = await c.req.json();
  
  if (!options || options.length < 2) {
    return c.json({ error: "At least 2 options required" }, 400);
  }
  
  const poll: Poll = {
    id: crypto.randomUUID(),
    question,
    options,
    votes: new Map(),
    createdAt: new Date().toISOString()
  };
  
  polls.set(poll.id, poll);
  return c.json({ id: poll.id, question, options }, 201);
});

app.post("/polls/:id/vote", async (c) => {
  const pollId = c.req.param("id");
  const { oderId, optionIndex } = await c.req.json();
  
  const poll = polls.get(pollId);
  if (!poll) return c.json({ error: "Poll not found" }, 404);
  
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return c.json({ error: "Invalid option" }, 400);
  }
  
  if (poll.votes.has(oderId)) {
    return c.json({ error: "Already voted" }, 409);
  }
  
  poll.votes.set(oderId, poll.options[optionIndex]);
  return c.json({ success: true });
});

app.get("/polls/:id/results", (c) => {
  const poll = polls.get(c.req.param("id"));
  if (!poll) return c.json({ error: "Poll not found" }, 404);
  
  const results = poll.options.map(option => ({
    option,
    votes: Array.from(poll.votes.values()).filter(v => v === option).length
  }));
  
  return c.json({
    question: poll.question,
    totalVotes: poll.votes.size,
    results
  });
});
```

---

## 7. **Cache with TTL**

"Build a simple key-value cache that expires"

```typescript
interface CacheEntry {
  value: any;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiresAt < now) cache.delete(key);
  }
}, 60000);

app.post("/cache", async (c) => {
  const { key, value, ttlSeconds = 300 } = await c.req.json();
  
  cache.set(key, {
    value,
    expiresAt: Date.now() + (ttlSeconds * 1000)
  });
  
  return c.json({ success: true, expiresIn: ttlSeconds });
});

app.get("/cache/:key", (c) => {
  const key = c.req.param("key");
  const entry = cache.get(key);
  
  if (!entry || entry.expiresAt < Date.now()) {
    cache.delete(key);
    return c.json({ error: "Key not found or expired" }, 404);
  }
  
  return c.json({ key, value: entry.value });
});
```

---

## 8. **Event Log / Activity Feed**

```typescript
interface Event {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata: any;
  timestamp: string;
}

const events: Event[] = [];

app.post("/events", async (c) => {
  const body = await c.req.json();
  
  const event: Event = {
    id: crypto.randomUUID(),
    ...body,
    timestamp: new Date().toISOString()
  };
  
  events.push(event);
  return c.json(event, 201);
});

// Get activity feed for a user
app.get("/users/:userId/feed", (c) => {
  const userId = c.req.param("userId");
  const limit = Number(c.req.query("limit")) || 20;
  
  const userEvents = events
    .filter(e => e.userId === userId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);
  
  return c.json(userEvents);
});

// Get events for a specific resource
app.get("/resources/:type/:id/events", (c) => {
  const resourceType = c.req.param("type");
  const resourceId = c.req.param("id");
  
  const resourceEvents = events
    .filter(e => e.resourceType === resourceType && e.resourceId === resourceId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  
  return c.json(resourceEvents);
});
```

---

## 9. **Invitation / Token System**

"Generate invite codes, track usage"

```typescript
interface Invite {
  code: string;
  createdBy: string;
  maxUses: number;
  uses: number;
  usedBy: string[];
  expiresAt: string;
}

const invites = new Map<string, Invite>();

app.post("/invites", async (c) => {
  const { createdBy, maxUses = 1, expiresInHours = 24 } = await c.req.json();
  
  const invite: Invite = {
    code: crypto.randomUUID().substring(0, 8).toUpperCase(),
    createdBy,
    maxUses,
    uses: 0,
    usedBy: [],
    expiresAt: new Date(Date.now() + expiresInHours * 3600000).toISOString()
  };
  
  invites.set(invite.code, invite);
  return c.json(invite, 201);
});

app.post("/invites/:code/redeem", async (c) => {
  const code = c.req.param("code").toUpperCase();
  const { userId } = await c.req.json();
  
  const invite = invites.get(code);
  
  if (!invite) return c.json({ error: "Invalid code" }, 404);
  if (new Date(invite.expiresAt) < new Date()) {
    return c.json({ error: "Invite expired" }, 410);
  }
  if (invite.uses >= invite.maxUses) {
    return c.json({ error: "Invite fully redeemed" }, 410);
  }
  if (invite.usedBy.includes(userId)) {
    return c.json({ error: "Already redeemed by this user" }, 409);
  }
  
  invite.uses++;
  invite.usedBy.push(userId);
  
  return c.json({ success: true, message: "Invite redeemed" });
});
```

---

## 10. **Simple Pub/Sub (Long Polling)**

```typescript
interface Subscriber {
  resolve: (messages: any[]) => void;
  timeout: NodeJS.Timeout;
}

const channels = new Map<string, any[]>();
const subscribers = new Map<string, Subscriber[]>();

app.post("/channels/:channel/publish", async (c) => {
  const channel = c.req.param("channel");
  const message = await c.req.json();
  
  const messageWithMeta = {
    ...message,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  };
  
  // Store message
  if (!channels.has(channel)) channels.set(channel, []);
  channels.get(channel)!.push(messageWithMeta);
  
  // Notify waiting subscribers
  const waiting = subscribers.get(channel) || [];
  waiting.forEach(sub => {
    clearTimeout(sub.timeout);
    sub.resolve([messageWithMeta]);
  });
  subscribers.set(channel, []);
  
  return c.json(messageWithMeta, 201);
});

app.get("/channels/:channel/subscribe", async (c) => {
  const channel = c.req.param("channel");
  const timeout = Number(c.req.query("timeout")) || 30000;
  
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      // Remove this subscriber and return empty
      const subs = subscribers.get(channel) || [];
      subscribers.set(channel, subs.filter(s => s.resolve !== resolve));
      resolve(c.json([]));
    }, timeout);
    
    if (!subscribers.has(channel)) subscribers.set(channel, []);
    subscribers.get(channel)!.push({
      resolve: (messages) => resolve(c.json(messages)),
      timeout: timeoutId
    });
  });
});
```

---

## Summary: What Interviewers Look For

| Pattern | Tests Your Understanding Of |
|---------|----------------------------|
| URL Shortener | Hashing, redirects, unique IDs |
| Rate Limiter | Token bucket algorithm, time-based logic |
| Job Queue | Async processing, status management |
| Booking System | Conflict detection, date/time handling |
| Wallet | Transactions, preventing race conditions |
| Voting | One-per-user constraints, aggregation |
| Cache | TTL, expiration, cleanup |
| Event Log | Append-only patterns, filtering |
| Invitations | Token generation, usage limits |
| Pub/Sub | Real-time patterns, long polling |

---

Want me to give you a mock challenge that combines a few of these? I can play the role of interviewer and give you a realistic problem to solve in ~45 minutes.
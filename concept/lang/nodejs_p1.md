
# Node.js Interview Questions & Answers (Deep Dive)

> A curated, senior-friendly set of questions and answers for Node.js roles ranging from backend engineer to platform/infra. Includes code, pitfalls, and “why” behind design choices.

---

## 1) Runtime & Event Loop

### Q1. Explain Node.js’ architecture and why it’s suited for I/O heavy workloads.
**Answer:** Node.js runs JavaScript on V8 in a single-threaded event-loop model with a thread pool (libuv) for offloading blocking tasks (FS, DNS, crypto, compression). Non-blocking I/O lets one process multiplex thousands of connections. CPU-bound work blocks the loop, so offload to **Worker Threads**, external services, or native modules when needed.

---

### Q2. Walk through the event loop phases and microtasks.
**Answer:** The main phases: **timers** → **pending callbacks** → **idle/prepare** → **poll** → **check** → **close callbacks**.  
Microtasks (**promises / `queueMicrotask`**) run **between** macrotask turns and **before** the next phase ticks; `process.nextTick` runs **before** other microtasks in Node and can starve the loop if abused.

```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('microtask'));
process.nextTick(() => console.log('nextTick'));
/* Output order (typical): nextTick → microtask → timeout|immediate (order between the two can vary) */
```

---

### Q3. `setImmediate` vs `setTimeout(fn, 0)` vs `process.nextTick`?
**Answer:**
- `process.nextTick(fn)`: runs **before** promise microtasks; use sparingly for post-callback cleanup to avoid starving the loop.
- `setImmediate(fn)`: runs in the **check** phase, after **poll**.
- `setTimeout(fn, 0)`: scheduled in **timers**; actual timing depends on system timer granularity and loop state.

---

### Q4. How do you prevent blocking the event loop in CPU-heavy tasks?
**Answer:** Options: chunk work with `setImmediate`/`queueMicrotask`, use **Worker Threads** for parallelism, move work to external services, or write native code via **N-API**. Always measure with `perf_hooks`/Inspector.

---

## 2) Async Patterns & Error Handling

### Q5. Callback, Promise, async/await—tradeoffs?
**Answer:** Callbacks are lightweight but error-prone (“callback hell”, double-calls). Promises standardize completion and errors; `async/await` improves readability but must be paired with `try/catch` and **structured concurrency** (cancel/timeout).

---

### Q6. Show robust error handling with async/await and timeouts.
**Answer:**
```js
import { setTimeout as delay } from 'node:timers/promises';
import fetch from 'node-fetch'; // or global fetch in newer Node

async function withTimeout(promise, ms, msg = 'Timeout') {
  const t = delay(ms).then(() => { throw new Error(msg); });
  return Promise.race([promise, t]);
}

export async function getUser(id, { signal, timeout = 3000 } = {}) {
  try {
    const res = await withTimeout(fetch(`https://api/users/${id}`, { signal }), timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Log + rethrow with context
    err.context = { id };
    throw err;
  }
}
```

---

### Q7. What is backpressure and how do you handle it?
**Answer:** Backpressure occurs when producers generate data faster than consumers can process. In Node streams, respect `stream.write()`’s boolean return, pause/resume, or use `pipeline()` which handles backpressure automatically.

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

await pipeline(
  createReadStream('big.log'),
  createWriteStream('copy.log') // backpressure-aware
);
```

---

### Q8. How to design cancellable async flows?
**Answer:** Use **AbortController/AbortSignal**, pass `signal` down stack, and wire to stream/HTTP APIs that support it. Clean up resources on abort.

```js
const ac = new AbortController();
doWork({ signal: ac.signal });
// later
ac.abort(new Error('user_cancelled'));
```

---

## 3) Modules, Packaging, & Tooling

### Q9. CommonJS vs ES Modules in Node?
**Answer:** CJS uses `require`, `module.exports`; ESM uses `import`/`export`. ESM is **static**, enabling tree-shaking, top‑level `await`, and better tooling. In Node, choose via `type: "module"` in `package.json` or `.mjs` extension. Interop: use `createRequire` or dynamic `import()` when mixing.

---

### Q10. How do you structure a modern package?
**Answer:** Prefer **exports map** to define public surface, dual packages (CJS/ESM) when needed, declare `"engines"`, avoid deep imports. Example:

```json
{
  "name": "lib",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./cli": "./dist/cli.mjs"
  }
}
```

---

### Q11. npm vs yarn vs pnpm?
**Answer:** All can be production-grade. `pnpm` saves space via content-addressable store and strict hoisting; Yarn has workspaces/Plug'n'Play; npm is default and improved workspaces. Choose what your org supports; lock files must be reproducible in CI.

---

## 4) HTTP, Frameworks & APIs

### Q12. Express vs Fastify vs raw `http`?
**Answer:** Express is ubiquitous/middleware-rich; Fastify emphasizes speed, schema-driven validation, and encapsulation. Raw `http` is smallest surface/zero deps but lacks routing/validation; great for ultra-lean services or libraries.

---

### Q13. Show an idiomatic Fastify server with validation and graceful shutdown.
**Answer:**
```js
import Fastify from 'fastify';
import closeWithGrace from 'close-with-grace';

const app = Fastify({ logger: true });

app.addSchema({
  $id: 'user',
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id']
});

app.get('/users/:id', {
  schema: { params: { $ref: 'user#' } }
}, async (req, reply) => {
  return { id: req.params.id };
});

const closeListeners = closeWithGrace({ delay: 500 }, async ({ err }) => {
  if (err) app.log.error(err);
  await app.close();
});

app.addHook('onClose', async () => closeListeners.uninstall());

const start = async () => {
  await app.listen({ host: '0.0.0.0', port: process.env.PORT || 3000 });
};
start();
```

---

### Q14. How do you implement rate limiting and input validation?
**Answer:** Apply a **token bucket** or **leaky bucket** algorithm via middleware (e.g., Fastify plugins), validate inputs with JSON Schema (Ajv) or Zod, and return typed errors. Keep rate limiter state in Redis for distributed nodes.

---

### Q15. HTTP/2 and compression pitfalls?
**Answer:** HTTP/2 multiplexes streams; avoid head-of-line blocking by chunking responses and streaming. For compression, prefer **content negotiation**, cache compressed assets at edge/CDN, never compress already-compressed formats; beware of **BREACH/CRIME** style risks with secrets in responses.

---

## 5) Data, Streams & Storage

### Q16. When do you choose streams over buffering?
**Answer:** Use streams for large/unknown-size payloads to avoid memory spikes and to support backpressure. Buffer only small payloads or when random access is required.

---

### Q17. How to stream-upload to S3 or a DB with backpressure awareness?
**Answer:** Pipe from request to transform to SDK upload stream; watch highWaterMark thresholds, and surface errors via `pipeline()`.

---

### Q18. Show a transform stream that parses NDJSON safely.
**Answer:**
```js
import { Transform } from 'node:stream';

export class NDJSONParser extends Transform {
  constructor() { super({ readableObjectMode: true }); this._buf = ''; }
  _transform(chunk, enc, cb) {
    this._buf += chunk.toString('utf8');
    const lines = this._buf.split('
');
    this._buf = lines.pop() ?? '';
    try {
      for (const line of lines) if (line.trim()) this.push(JSON.parse(line));
      cb();
    } catch (e) { cb(e); }
  }
  _flush(cb) {
    try { if (this._buf.trim()) this.push(JSON.parse(this._buf)); cb(); }
    catch (e) { cb(e); }
  }
}
```

---

## 6) Performance & Diagnostics

### Q19. How do you profile a Node service?
**Answer:** Use the **Inspector** (`node --inspect` / Chrome DevTools), `clinic.js` (Doctor/Flame/Bubbleprof), `perf_hooks` for custom marks, and OS profilers (perf, Instruments). Capture heap snapshots and CPU profiles in prod behind a protected endpoint when needed.

---

### Q20. Memory leaks—common causes and detection?
**Answer:** Causes: global caches without eviction, listeners not removed, long-lived closures, large buffers, and accidental object retention. Detect with heap snapshots, `--trace-gc`, `WeakRef` + `FinalizationRegistry` for optional cleanup. Always cap caches (LRU).

---

### Q21. What is AsyncLocalStorage and when is it dangerous?
**Answer:** `AsyncLocalStorage` tracks request context across async boundaries. Useful for correlation IDs and per-request logging. Danger: memory leaks if you store large objects or forget to exit scope; also can hurt performance on hot paths.

---

### Q22. Cluster vs Worker Threads?
**Answer:** **Cluster** forks multiple Node processes to utilize multi-core for I/O-bound servers; uses IPC for coordination. **Worker Threads** share memory for CPU-bound tasks; communicate via `MessagePort`/`Atomics`. Often you combine: cluster for scale out + workers for heavy CPU tasks per process.

---

## 7) Security

### Q23. What are top Node security practices?
**Answer:**
- Lock dependencies; run `npm audit`/Snyk; pin transitive deps.
- Validate and sanitize inputs; enforce content-type and size limits.
- Use **Helmet/WAF**, CSRF tokens when needed, secure cookies (`HttpOnly`, `SameSite`, `Secure`).
- Avoid `eval`, dynamic `require`, and path traversal; use `path.join`/`path.normalize`.
- Secrets via env/secret manager; never in repo; rotate keys.
- Rate limit, circuit-break, and isolate blast radius (least-privilege IAM).

---

### Q24. SSRF & prototype pollution in Node—explain.
**Answer:** **SSRF:** untrusted URLs cause your server to fetch internal addresses; mitigate with allowlists, DNS pinning, and egress proxies.  
**Prototype pollution:** merging untrusted objects may set `__proto__`, leading to unexpected behavior; use libraries that block it (e.g., `lodash` patched), or deep-clone with safe utilities and validate keys.

---

## 8) Testing, Quality & DX

### Q25. Unit vs integration vs e2e in Node?
**Answer:** Unit tests isolate logic; integration tests wire modules/DBs (often via Testcontainers); e2e tests hit deployed services. Balance: fast and deterministic unit tests, a smaller set of flaky-resistant e2e, and contract tests for service boundaries.

---

### Q26. Show a Jest/Vitest test with fake timers and HTTP mocking.
**Answer:**
```ts
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { getUser } from './api';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('times out', async () => {
  const p = getUser('42', { timeout: 1000 });
  await vi.advanceTimersByTimeAsync(1001);
  await expect(p).rejects.toThrow(/Timeout/);
});
```

---

## 9) Deployment & Operations

### Q27. What’s your prod-ready Node runtime configuration?
**Answer:**
- Enable graceful shutdown (SIGINT/SIGTERM) with connection draining.
- Health checks (liveness/readiness); expose `/metrics` (Prometheus).
- Configure `UV_THREADPOOL_SIZE` when many FS/crypto ops.
- Set sensible memory limits in containers; monitor RSS/heap.
- Log in JSON; include correlation IDs; rotate and ship logs.

---

### Q28. How do you build a resilient HTTP client in Node?
**Answer:** Use `undici` or `axios` with **timeouts**, **retries with jitter**, **circuit breaker** (opossum), and **bulkhead** limits. Respect `AbortSignal`. Pool connections for HTTP/1.1 and HTTP/2 appropriately.

---

### Q29. Graceful shutdown example.
**Answer:**
```js
import http from 'node:http';
const server = http.createServer(handler);
server.listen(3000);

const signals = ['SIGTERM', 'SIGINT'];
signals.forEach(sig => process.on(sig, () => {
  server.close(err => {
    if (err) process.exitCode = 1;
    // Close DB, queues, etc.
    process.exit();
  });
}));
```

---

## 10) Advanced Topics

### Q30. Native addons, N-API, and ABI stability?
**Answer:** **N-API** abstracts V8 internals, preserving ABI across Node versions for compiled addons. Prefer N-API over NAN to reduce maintenance burden. Prebuild binaries per platform/arch to speed installs.

---

### Q31. Worker Threads example for CPU-bound hashing.
**Answer:**
```js
// main.js
import { Worker } from 'node:worker_threads';
export function hashMany(inputs) {
  return new Promise((resolve, reject) => {
    const w = new Worker(new URL('./worker.js', import.meta.url), { workerData: inputs });
    w.on('message', resolve);
    w.on('error', reject);
  });
}

// worker.js
import { workerData, parentPort } from 'node:worker_threads';
import { createHash } from 'node:crypto';
const out = workerData.map(s => createHash('sha256').update(s).digest('hex'));
parentPort.postMessage(out);
```

---

### Q32. Explain `perf_hooks` and a realistic use.
**Answer:** `perf_hooks` provides high-resolution timers (`performance.now()`), user timing marks/measures, and PerformanceObserver. Use it to instrument hot paths and generate flamegraphs or custom SLIs.

```js
import { performance, PerformanceObserver } from 'node:perf_hooks';
const obs = new PerformanceObserver((list) => console.log(list.getEntries()));
obs.observe({ entryTypes: ['measure'] });
performance.mark('db-start');
// ... db call
performance.mark('db-end');
performance.measure('db', 'db-start', 'db-end');
```

---

### Q33. What is the difference between `require.cache` and ESM module caching?
**Answer:** CJS caches `module.exports` keyed by resolved filename; clearing `require.cache` can force reload (with risks). ESM caches modules via the module graph; reloading ESM is not trivial—prefer feature flags or dependency injection for hot-swapping.

---

### Q34. How do you design for observability in Node?
**Answer:** Correlate logs, traces, and metrics: use **AsyncLocalStorage** for trace IDs, emit structured logs (pino), expose Prometheus metrics, and instrument HTTP/DB/queue clients with OpenTelemetry. Redact PII at the edge; sample judiciously.

---

### Q35. Common production pitfalls and how to avoid them?
**Answer:**
- Blocking the loop with JSON.stringify on big objects → stream or chunk.
- Unbounded parallelism → limit concurrency (p-limit), use queues.
- Trusting `req.ip` behind proxies → configure `X-Forwarded-For` and trusted proxies.
- Large JSON bodies → enforce `Content-Length` and body size limits.
- Leaking event listeners → remove on cleanup; watch `MaxListenersExceededWarning`.

---

## Bonus: Rapid-Fire Questions

- **When to use `domain` module?** Never—deprecated; use `try/catch`, promises, and centralized error handling.
- **Why `undici` over `http`?** Modern, spec-compliant fetch/agent, better perf.
- **Top-level await—gotchas?** Blocks module evaluation; avoid in hot paths.
- **How to share code in mono-repos?** Workspaces + build step + exports map.
- **JSON Schema vs Zod?** JSON Schema integrates with Fastify/validation-at-the-edge; Zod great for TS-first ergonomics.

---

## Closing Advice
Be ready to: diagram event loop timing, write a stream/pipeline, show a graceful shutdown, instrument with `perf_hooks`, and debug a leak. Bring data: micro-benchmarks, CPU profiles, heap snapshots, latency histograms. That’s what separates seniors from the pack.

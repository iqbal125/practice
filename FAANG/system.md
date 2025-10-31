Awesome — here are full, interview-ready answers for the **System Design** set (Q1–10). I’ll keep them crisp but complete: problem framing → baseline design → scaling & trade-offs → pitfalls → “what I’d implement first.”

---

# 1) LLM-powered chat web app (streaming, rate limiting, auth)

**Goal.** Real-time chat UI with token streaming, user accounts, safe usage limits.

**Baseline architecture.**

* **Client (React/TS):** `/chat` page; WebSocket or EventSource (SSE) to stream tokens; optimistic UI; retry/backoff.
* **Edge/API gateway:** AuthN (JWT) + rate limiter (token bucket in Redis) + request shaping.
* **App server (FastAPI):**

  * `POST /v1/chat` (kickoff) returns `conversation_id`; `GET /v1/chat/stream?id=…` streams tokens via SSE.
  * Middleware for quotas (requests/min, tokens/day).
* **LLM provider:** OpenAI API (stream=true) with per-user API key proxying or service key + per-user policy.
* **Data:** Postgres (users, conversations, messages), Redis (ephemeral streaming state, rate limits), Object store (attachments).
* **Observability:** Structured logs (req id, user id, model, tokens), metrics (P95 latency, TPS, tokens), tracing.

**Streaming.** Prefer **SSE** for linear token streams (easier with proxies, fewer WS edge cases). Use backpressure: only forward chunks; flush frequently; heartbeat to keep connections alive.

**Auth & permissions.** JWT (short-lived) + refresh, RBAC claims in token. On each request: verify signature, check org limits, feature flags.

**Rate limiting.**

* Burst control: token bucket `key=user:{id}:bucket` in Redis.
* Long-horizon quotas: daily tokens; decrement by `prompt_tokens + completion_tokens`.
* Return `429` with `Retry-After` and surface in UI.

**Safety & guardrails.** Prompt wrapping (system instructions), input/output moderation, allowlist model list, max output tokens, content filters.

**Scaling.**

* Stateless FastAPI behind ALB; autoscale on open connections + CPU.
* Redis cluster for rate limiting; R/W split for Postgres; write-behind for analytics.
* Circuit breakers if LLM provider degrades (fallback model, cached answers, “degraded mode” banner).

**Pitfalls.**

* Streaming over reverse proxies that buffer (disable buffering).
* Leaking PII in logs.
* Orphaned conversations due to partial writes during stream: use “append-only” message store + finalization flag.

**Ship first.**

1. SSE streaming path, 2) Redis rate limiter, 3) Postgres schema (users, sessions, conversations, messages), 4) basic moderation + metrics.

---

# 2) Multi-tenant API for secure embeddings queries

**Goal.** Tenants upload docs, query semantic search securely.

**Tenant isolation.**

* **AuthN:** OAuth or API keys with `tenant_id` claim.
* **AuthZ:** Every resource row includes `tenant_id`; enforce at query layer + service layer.
* **Data isolation:**

  * Easiest: shared DB with `tenant_id` + RLS (Row Level Security) in Postgres.
  * Stronger: schema-per-tenant; or DB-per-tenant for strict isolation (ops heavy).

**Pipeline.**

* **Ingest:** File → chunk (token-aware) → embed → store.
* **Storage:**

  * Vector DB (PgVector, Qdrant, Pinecone). Metadata: `tenant_id`, `doc_id`, `chunk_id`, `tags`, `ACL`.
  * Object store for raw docs.
* **Query:** Auth → top-k vector search (filtered by `tenant_id`, ACL) → rerank → return contexts.

**Performance & cost.**

* Batch embeddings, cache duplicate chunks by hash.
* Cold storage for old docs; TTL for orphaned chunks.
* Shard vector indexes by tenant or logically partition with metadata filters.

**Security.**

* KMS-managed encryption at rest.
* Per-tenant rate limits and usage quotas; noisy neighbor protection.

**Ship first:** RLS in Postgres + PgVector; API keys; ingest & search endpoints; metrics per tenant.

---

# 3) Versioning a public FastAPI/GraphQL API

**Principles.**

* **Avoid breaking changes**; add fields, never remove/rename without deprecation.
* **Communicate**: changelog, deprecation schedule, SDKs.

**REST (FastAPI).**

* URI versioning: `/v1/…`, `/v2/…`.
* Maintain multiple routers; shared business layer; feature flags by version.
* Deprecation headers: `Sunset`, `Deprecation`, `Link` to docs.

**GraphQL.**

* Single endpoint; evolve schema:

  * Add fields/types; mark deprecated with reason; 6–12 month horizon.
  * For breaking changes: stand up a **new schema** (`/graphql/v2`) or a “namespaced” graph.

**Testing & rollout.**

* Contract tests with snapshots.
* Canaries by API key cohort.
* Dual-write/dual-read when changing representations.

**Ship first:** `/v1` with Deprecation headers; schema registry; compatibility tests in CI.

---

# 4) Caching strategy for a dashboard calling multiple AI endpoints

**Patterns.**

* **Request coalescing**: deduplicate identical concurrent calls.
* **Layered cache:**

  * **Edge** (CDN) for GET widgets with cache keys including user/filters.
  * **App cache** (Redis) for expensive LLM calls: key = hash(prompt+params+model+tenant).
  * **Browser cache** (SWR/React Query) with staleness windows.

**Result determinism.**

* Non-deterministic LLM outputs: set `temperature=0` where possible to maximize cache hits.
* Version cache keys with **prompt version** + **model version**.

**TTL & invalidation.**

* Metrics: short TTL (e.g., 30–120s).
* Static copy or knowledge: long TTL; bust on content change.
* Token-aware: limit chunk sizes to reduce recomputation.

**Fallbacks.**

* Stale-while-revalidate, partial renders, skeletons.
* Graceful degradation: “data delayed” states.

**Ship first:** Redis result cache with prompt+params hash; SWR on client; per-widget loading policies.

---

# 5) Real-time collaborative editor (CRDTs/websockets)

**Consistency model.**

* **CRDT (e.g., Yjs, Automerge)** for local-first conflict-free merges; or **OT** (operational transform) like Google Docs.
* CRDT benefits: offline edits, low coordination; cost: heavier payloads.

**Transport.**

* WebSocket rooms per doc; presence & cursor channels.
* Backpressure & rate limiting on ops size/frequency.

**Storage.**

* Append operation log or periodic CRDT snapshots + compaction.
* Postgres for doc metadata; object store for snapshots.

**Scaling.**

* Sticky sessions (by doc) or use a stateful collaboration service (y-websocket cluster with Redis pub/sub).
* Horizontal scale with room sharding; Redis streams for fan-out.

**Concurrency & recovery.**

* Client retries with op IDs; idempotent apply.
* Snapshot every N ops to cap recovery time.

**Ship first:** Yjs + y-websocket + Postgres snapshots; presence; basic permissions.

---

# 6) Metrics pipeline for latency, token usage, errors (OpenAI calls)

**Goals.** Per-request observability: `user`, `tenant`, `model`, `prompt_id`, `tokens`, `latency`, `cost`.

**Capture.**

* FastAPI middleware wraps LLM calls; emits event:

  * request_id, start/end time, prompt_id/version, model, input/output tokens, retries, error class.
* Use **OTel traces**: span around LLM call; logs for chunks (sampled).

**Ingest.**

* App → Kafka (or Kinesis) → stream processor (Flink/Spark) → time-series DB (Prometheus for infra, ClickHouse for product analytics) + object store for raw.

**Dashboards & alerts.**

* p50/p95 latency by model & route.
* Error rate by code/provider.
* Tokens/day per tenant and spend forecast.
* Alert on: provider 5xx spike, timeouts, quota nearing.

**Cost controls.**

* Budget guardrails: per-tenant caps; auto degrade model/tokens when thresholds hit.

**Ship first:** Middleware → ClickHouse (or Postgres) + Grafana; alerts in PagerDuty.

---

# 7) AuthZ for admin tools (JWT + RBAC)

**Requirements.** Fine-grained roles (viewer, editor, admin), audit logs, scoped access.

**Model.**

* Users ↔ Roles (many-to-many) ↔ Permissions (CRUD over resources).
* JWT contains `sub`, `tenant_id`, `roles`, optional `scopes`.
* Server enforces policies (e.g., “Editor can update users in same tenant”).

**Implementation.**

* **FastAPI dependencies**: `get_current_user`, `require_roles("admin")`, `require_scope("users:write")`.
* **Policy layer** with a simple PDP (policy decision point) or OPA (Rego) for complex rules.
* **Row-level checks**: verify `resource.tenant_id == user.tenant_id`.

**Security.**

* Short-lived access tokens; refresh tokens in HttpOnly cookies.
* Key rotation (JWKS); jti blacklist for revocation.
* Audit logs: who did what, when, old→new values.

**Ship first:** Role table + decorators; audit middleware; admin UI to assign roles.

---

# 8) CI/CD for monorepo (React + FastAPI + Postgres)

**Repo layout.**

```
/apps/web      (Next.js/React)
/apps/api      (FastAPI)
/packages/ui   (shared components)
/infra         (IaC: Terraform)
/scripts
```

**CI.**

* **Selective builds** via path filters.
* **Static checks**: TypeScript, ESLint, mypy/ruff, black.
* **Tests**: unit (pytest, vitest), integration (spun Postgres via Testcontainers).
* **Security**: SCA (pip/audit, npm audit), secret scanning.
* **Build artifacts**: Docker images tagged with git SHA.

**CD.**

* Staging → prod with approvals.
* DB migrations (Alembic) run as separate job; backward-compatible (expand/contract).
* Blue-green or canary for API; Vercel/Netlify for web or containerized SSR.

**Observability gates.**

* Post-deploy smoke tests; rollback on error budgets breach.

**Ship first:** GitHub Actions workflow with matrix; Docker builds; staging env; Alembic migrations.

---

# 9) RAG architecture with LangChain + vector store

**Flow.**

1. **Ingest:** chunk docs (semantic boundaries), clean, embed (text-embedding-3-large), store embeddings + metadata.
2. **Query:**

   * Rewrite query (optional) → retrieve top-k → rerank (cross-encoder) → compose prompt with citations → call LLM (temperature=0.2) → stream.
3. **Feedback loop:** log queries, clicked citations; add hard negatives; periodically re-embed.

**Components.**

* **Retriever:** vector store (Qdrant/Pinecone/PgVector) with filters (tenant, tags).
* **Reranker:** small model improves precision@k (especially for long chunks).
* **Prompting:** instruction + condensed contexts + citations; **max context length** guard.

**Freshness & updates.**

* Hot index for last N days; nightly merge.
* Change data capture from content sources; delete/update by `doc_id`.

**Quality controls.**

* Evaluations (answer correctness, groundedness, citation accuracy) using QA sets.
* Guardrails: refuse outside scope; don’t fabricate links.

**Ship first:** PgVector retriever; chunker; simple prompt with citations; basic eval harness.

---

# 10) SSR vs SSG vs CSR in React (trade-offs)

**CSR (Client-Side Rendering).**

* Pros: simplest deploy (static assets), great interactivity; can fully cache at CDN.
* Cons: slow **first contentful paint**; SEO weaker without pre-render; heavy JS on low-end devices.
* Use for: Auth-gated apps, dashboards after login.

**SSR (Server-Side Rendering).**

* Pros: fast TTFB/SEO, personalized content; can stream HTML; good for dynamic pages.
* Cons: Higher server cost, caching hard (per-user), edge compatibility considerations.
* Use for: Marketing pages with personalization, content that changes frequently.

**SSG (Static Site Generation).**

* Pros: fastest, cheapest; cache forever; trivial scaling via CDN.
* Cons: Build time grows with pages; stale content unless ISR.
* Use for: Docs, blogs, mostly static marketing.

**Modern hybrid (Next.js).**

* **RSC + Suspense** to cut client JS; **ISR** for near-real-time static; **Route handlers** for API.
* Pick **per-route**:

  * Marketing/docs → SSG/ISR
  * Product listing → SSR (if personalized), otherwise ISR
  * App shell after login → CSR (with RSC for data-heavy components)

**Ship first:** Hybrid: SSG for public pages, SSR for SEO-critical dynamic routes, CSR for authed dashboard; measure with Web Vitals; adjust.

---

## Tiny code bits you can mention if asked

**FastAPI SSE streaming (skeleton):**

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

async def token_stream(prompt: str):
    # call provider with stream=True
    async for chunk in llm_stream(prompt):
        yield f"data: {chunk}\n\n"
    yield "event: end\ndata: {}\n\n"

@app.get("/v1/chat/stream")
async def stream(prompt: str):
    return StreamingResponse(token_stream(prompt), media_type="text/event-stream")
```

**Redis token-bucket (concept):**

```python
# key = f"rl:{user_id}"
# fields: tokens, updated_at
# refill = rate * (now - updated_at)
```

**FastAPI RBAC dependency:**

```python
from fastapi import Depends, HTTPException

def require_roles(*roles):
    def _inner(user=Depends(current_user)):
        if not set(roles) & set(user.roles):
            raise HTTPException(status_code=403)
        return user
    return _inner
```

---

If you want, I can spin these into a **mock interview script**: I ask follow-ups, you answer, I probe trade-offs (cache keys, backpressure, RLS vs schema-per-tenant, etc.). Or we can move to the **Coding** section (Q11–20) with full solutions next.



Here are **full, interview-ready solutions** for the **Coding Section (Q11–20)** — tailored to an OpenAI-style Full-Stack interview using **FastAPI + React + TypeScript + Python async**.
Each answer shows the **goal → reasoning → code + complexity** and **how to discuss it out loud** in an interview.

---

## 11) Rate Limiter Middleware (FastAPI)

**Goal:** Limit requests per user/IP.

**Approach**

* Token-bucket in Redis keyed by `user_id` or `ip`.
* Middleware checks, decrements, rejects if bucket empty.

**Code**

```python
from fastapi import FastAPI, Request, HTTPException
import time, aioredis

app = FastAPI()
r = await aioredis.from_url("redis://localhost")

RATE = 5     # requests
WINDOW = 60  # seconds

@app.middleware("http")
async def rate_limiter(request: Request, call_next):
    uid = request.headers.get("x-user-id", request.client.host)
    key = f"rl:{uid}"
    now = int(time.time())

    # atomic Lua or pipeline
    async with r.pipeline(transaction=True) as pipe:
        pipe.zremrangebyscore(key, 0, now - WINDOW)
        pipe.zadd(key, {str(now): now})
        pipe.zcard(key)
        pipe.expire(key, WINDOW)
        _, _, count, _ = await pipe.execute()

    if count > RATE:
        raise HTTPException(status_code=429, detail="Too Many Requests")
    return await call_next(request)
```

**Discuss:** O(1) per request; horizontally scalable since Redis centralizes counts.

---

## 12) GraphQL Resolvers Combining REST Sources

**Goal:** Aggregate data from multiple APIs.

```python
import strawberry, httpx

@strawberry.type
class Profile:
    id: str
    name: str
    posts: list[str]

async def fetch_user(id):
    async with httpx.AsyncClient() as c:
        return (await c.get(f"https://api/users/{id}")).json()

async def fetch_posts(id):
    async with httpx.AsyncClient() as c:
        return (await c.get(f"https://api/posts?user={id}")).json()

@strawberry.type
class Query:
    @strawberry.field
    async def profile(self, id: str) -> Profile:
        user, posts = await asyncio.gather(fetch_user(id), fetch_posts(id))
        return Profile(id=id, name=user["name"], posts=[p["title"] for p in posts])
```

**Discuss:** Parallelism via `gather`; adds ~0 latency over slowest source.

---

## 13) Debounce Async API Calls (Python)

```python
import asyncio, time
def debounce(wait):
    def decorator(fn):
        task = None
        async def wrapped(*a, **kw):
            nonlocal task
            if task: task.cancel()
            async def delayed(): 
                await asyncio.sleep(wait)
                await fn(*a, **kw)
            task = asyncio.create_task(delayed())
        return wrapped
    return decorator

@debounce(0.5)
async def call_api(q): print("Call:", q)
```

**Discuss:** Cancels in-flight tasks; prevents spamming expensive APIs.

---

## 14) Custom React Hook for API State

```tsx
import { useState, useCallback } from "react";

export function useApi<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await fn()); } 
    catch (e) { setError(e as Error); } 
    finally { setLoading(false); }
  }, [fn]);

  return { data, loading, error, execute };
}
```

**Discuss:** Generic reusable hook; handles loading/error; improves code reuse.

---

## 15) FastAPI Streaming Tokens (OpenAI API)

```python
from fastapi.responses import StreamingResponse
import openai, asyncio

async def stream_chat(prompt):
    async for chunk in openai.ChatCompletion.acreate(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    ):
        yield f"data: {chunk.choices[0].delta.get('content','')}\n\n"

@app.get("/chat/stream")
async def chat(prompt: str):
    return StreamingResponse(stream_chat(prompt),
                             media_type="text/event-stream")
```

**Discuss:** Show knowledge of SSE vs WS; memory safety; low latency.

---

## 16) Merge Multiple Async Generators

```python
import asyncio, heapq, itertools
async def merge_streams(*gens):
    pending = [asyncio.create_task(g.__anext__()) for g in gens]
    while pending:
        done, _ = await asyncio.wait(pending, return_when=asyncio.FIRST_COMPLETED)
        for task in done:
            try:
                item = task.result()
                yield item
                i = done.index(task)
                pending[i] = asyncio.create_task(gens[i].__anext__())
            except StopAsyncIteration:
                pending.remove(task)
```

**Discuss:** Handles variable-speed producers; real-time aggregation.

---

## 17) Optimize React Table Rendering 10 000 rows

**Discuss verbally:**

* Use **windowing** (e.g., `react-window`, `react-virtualized`).
* Memoize row components with `React.memo`.
* Avoid inline functions; key by stable ID.
* Lazy load columns, pagination for wide tables.
* Use `useDeferredValue` or `useTransition` (React 18).

Complexity O(viewport rows) render time.

---

## 18) Exponential Backoff Retry Decorator

```python
import asyncio, random
def retry(max_tries=5, base_delay=0.2):
    def wrap(fn):
        async def inner(*a, **kw):
            for i in range(max_tries):
                try: return await fn(*a, **kw)
                except Exception as e:
                    if i == max_tries-1: raise
                    delay = base_delay * (2 ** i) + random.random()/10
                    await asyncio.sleep(delay)
        return inner
    return wrap
```

**Discuss:** jitter avoids thundering herd; exponential delay mitigates transient errors.

---

## 19) Validate Nested JSON with Pydantic

```python
from pydantic import BaseModel, Field, ValidationError

class Config(BaseModel):
    db_url: str
    timeout: int = Field(ge=1, le=60)
    features: dict[str, bool]

payload = {"db_url": "postgres://...", "timeout": 30, "features": {"beta": True}}
cfg = Config(**payload)
```

**Discuss:** Pydantic handles coercion & schema evolution; raise `ValidationError` if invalid.

---

## 20) Uptime Monitor + Slack Alert

```python
import httpx, asyncio, os

SLACK = os.getenv("SLACK_WEBHOOK")
URLS = ["https://api.myapp.com/health", "https://app.myapp.com"]

async def check(url):
    async with httpx.AsyncClient(timeout=5) as c:
        try:
            r = await c.get(url)
            if r.status_code != 200:
                await c.post(SLACK, json={"text": f"❌ {url} down: {r.status_code}"})
        except Exception as e:
            await c.post(SLACK, json={"text": f"⚠️ {url} unreachable: {e}"})

async def main():
    while True:
        await asyncio.gather(*(check(u) for u in URLS))
        await asyncio.sleep(60)

asyncio.run(main())
```

**Discuss:** Asynchronous polling; use cloud cron or serverless job; metrics integration.

---

### 🧠 How to Present in Interview

When asked to code live:

1. **Explain the API shape** first.
2. **State trade-offs** (e.g., Redis vs in-memory).
3. **Write clean, readable code** (typing hints, async).
4. **Analyze complexity** and possible extensions.
5. **Test mental model** (edge cases, concurrency, scaling).

---

Would you like me to now produce **sample behavioral answers (Q26–30)** or a **mock technical interview simulation** (where I play interviewer and grade your system + coding answers in real time)?

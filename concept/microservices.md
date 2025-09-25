
# Backend Engineer Interview Q&A — AWS Cloud & Microservices (Deep Dive)

> A senior-level collection of questions and answers focused on **AWS**, **microservices**, **real-world scaling**, **debugging**, **production fixes**, and **performance optimization**. Code snippets use Node.js where illustrative.

---

## 1) Architecture & System Design

### Q1. Monolith vs. Microservices: when to choose which?
**Answer:** Start monolith for speed and cohesion; move to microservices when **team coupling** and **deployment friction** start to slow delivery or when **independent scaling** is clearly needed. Consider Conway’s Law (org structure ↔ architecture). Migration path: extract seams (bounded contexts), introduce a strangler fig proxy, align services to business capabilities, and ensure platform support (CI/CD, observability, shared libs).

---

### Q2. What are common microservice communication patterns and tradeoffs?
**Answer:**  
- **Synchronous (REST/gRPC)**: simpler request/reply semantics; tighter coupling, higher latency sensitivity.  
- **Asynchronous (events via SNS/SQS/Kinesis/Kafka)**: loose coupling, higher resilience, natural backpressure; but eventual consistency and harder debugging. Use **outbox** + **transactional writes** to publish events reliably.

---

### Q3. How do you enforce service boundaries and keep contracts stable?
**Answer:** Versioned APIs (URI or header), **consumer-driven contract tests** (Pact), schema registries (for Avro/JSON), and strong typing at boundaries. Deprecate via dual-run & canary, publish deprecation schedules, and track usage via access logs/metrics.

---

### Q4. What is the “outbox pattern” and when do you need it?
**Answer:** Persist “to-be-published events” in the same DB transaction as your domain update; a relay process reads the outbox and publishes to the broker (SNS/Kafka). This prevents lost events and guarantees **atomicity** between state change and event emission.

---

### Q5. How do you design idempotent operations across microservices?
**Answer:** Use **idempotency keys** (e.g., `Idempotency-Key` header) stored with request hash and result status; for event handlers, use **deduplication tables** keyed by message ID, or SQS FIFO with content-based dedupe. Ensure handlers check for already-processed IDs before side effects.

---

### Q6. How do you model eventual consistency for user-facing flows?
**Answer:** UI and API should expose **resource state** (e.g., `status: PENDING|READY|FAILED`) and allow **polling**/webhooks. Use **sagas** for multi-step workflows with compensations. Document SLAs for propagation delays (e.g., “index within 3s”).

---

## 2) AWS Building Blocks

### Q7. Choose between **Lambda**, **ECS/Fargate**, and **EKS**.
**Answer:**  
- **Lambda:** bursty/event-driven, ≤15 min tasks, low ops, very uneven traffic.  
- **ECS/Fargate:** containerized HTTP/queue workers without managing nodes; good default for most services.  
- **EKS:** needed for Kubernetes-specific ecosystem/workloads, multi-tenancy control, or custom schedulers; higher ops cost.

---

### Q8. ALB vs API Gateway vs NLB?
**Answer:**  
- **API Gateway (REST/HTTP/WebSocket):** auth (Cognito/Lambda authorizers), throttling, WAF, usage plans; more $$$ per request; great for serverless/API-first.  
- **ALB:** L7 routing to ECS/EKS/Lambda; cheaper at scale; native mTLS (via ACM) and path-based routing.  
- **NLB:** L4 ultra-low latency, static IPs, TLS passthrough; use for gRPC/Redis/TCP. Often NLB → gRPC, ALB → HTTP, API GW → public API serverless.

---

### Q9. DynamoDB vs Aurora (Postgres/MySQL)?
**Answer:**  
- **DynamoDB:** massive scale, partitioned key-value, single-digit ms latency; design with **access patterns first**; transactions limited; complex queries need **GSIs**/materialization.  
- **Aurora:** relational semantics, rich joins/transactions; vertical and read-replica scaling; needs careful tuning and connection pooling.

---

### Q10. When do you put a service in a VPC and what are the gotchas?
**Answer:** Private services/datastores should be in VPC subnets. **Lambda in VPC** adds ENI cold start overhead; use **VPC endpoints** (S3, DynamoDB) to avoid NAT cost. Configure subnets/NACLs/Security Groups least-privilege; watch ENI limits and IP exhaustion.

---

## 3) Messaging, Events & Data

### Q11. SQS vs SNS vs Kinesis vs MSK (Kafka) — how to choose?
**Answer:**  
- **SNS:** pub/sub fan-out; push to SQS, Lambda, HTTPS.  
- **SQS Standard/FIFO:** queue semantics; Standard = high throughput, at-least-once; FIFO = ordering + dedupe.  
- **Kinesis:** ordered shards for streaming analytics; checkpointing with KCL; native retries.  
- **MSK/Kafka:** rich streaming ecosystem, exactly-once semantics with transactions; higher ops complexity.

---

### Q12. How do you handle retries and DLQs in practice?
**Answer:** For async: configure **redrive policies** (SQS→DLQ after N receives), use **visibility timeouts** sized to processing time, implement **exponential backoff with jitter**. For sync: return 5xx/429 and clients retry with idempotency. Track DLQ depth and build **reprocessors** with rate limiting.

---

### Q13. What is backpressure and how does AWS help?
**Answer:** Backpressure occurs when consumers lag producers. Strategies: scale consumers (ECS autoscaling on SQS depth), **control concurrency** (Lambda reserved concurrency), adjust **batch sizes**, or shed load. For Kinesis, increase shard count and checkpoint responsibly.

---

### Q14. Strong vs eventual consistency in DynamoDB?
**Answer:** DynamoDB offers **eventual** by default, **strongly consistent** reads in a single Region (not for GSIs). For cross-Region, use **DynamoDB Global Tables** (last-writer-wins with per-item timestamps). For read-after-write in one Region, use **consistentRead: true** or **streams** + materialized views.

---

## 4) Reliability, Resilience & DR

### Q15. Circuit breakers, timeouts, and bulkheads—how to wire them?
**Answer:** Wrap outbound calls with **timeouts** (e.g., 300–2000 ms depending on SLO), **retry with jitter** on transient failures, and **circuit breakers** to prevent cascading failures; apply **bulkheads** (connection pools/concurrency limits) per dependency. Expose breaker state via metrics.

---

### Q16. Blue/Green vs Canary deployments on AWS?
**Answer:** Use **CodeDeploy** with ALB or Lambda weighted aliases: blue/green swaps whole environments; **canary** gradually shifts % traffic with automated rollback based on CloudWatch alarms (error rate, latency, 5xx). Prefer canary for high-traffic APIs to minimize risk.

---

### Q17. Multi-AZ vs Multi-Region strategies and RTO/RPO?
**Answer:** **Multi-AZ** = high availability within a Region (sub-2 min failover typical). **Multi-Region** = disaster recovery or latency-based routing (Route 53). Define **RTO** (time to restore) and **RPO** (data loss window). Options: pilot-light, warm-standby, or active-active with conflict resolution.

---

## 5) Observability & Prod Debugging

### Q18. What is your golden-signal dashboard?
**Answer:** **Latency, Traffic, Errors, Saturation (LTES)**; add **queue depth**, **p50/p95/p99** latency, **dependency health**, **GC time**, **CPU/RSS**, and **autoscaling indicators**. Tie to SLOs with alerting on **burn rate** (e.g., 2h/6h windows).

---

### Q19. How do you debug a production latency spike?
**Answer:** Start with **RED metrics** (rate, errors, duration), check dependency graphs (X-Ray/OpenTelemetry), identify hot endpoints, compare **baseline vs regression**, inspect **thread pool/connection pool saturation**, check **cold starts** (Lambda) or **CPU throttling** (ECS). Roll back recent deploy or enable canary logs; capture **CPU profile/heap snapshot** safely if reproducible.

---

### Q20. How do you trace requests across services?
**Answer:** **OpenTelemetry** (HTTP/gRPC auto-instrumentation) → exporters to X-Ray/Jaeger/Datadog; propagate **traceparent**/b3 headers through ALB/API GW/Lambda/ECS. Use **AsyncLocalStorage** in Node to carry correlation IDs; log in JSON with IDs.

---

### Q21. Real-world incident: SQS DLQ growing fast—what’s your playbook?
**Answer:** Triage: stop or slow producers (throttle at API), increase consumer concurrency cautiously, inspect **poison messages** (schema drift, external 500s), hotfix handler to be **idempotent** and **schema-tolerant**, reprocess DLQ in **batches with rate limits**, add **validation** and **dead-letter categorization**. Postmortem: add contract tests & alarms.

---

## 6) Performance & Cost Optimization

### Q22. API latency tuning in Node on ECS/ALB?
**Answer:** Use **HTTP Keep-Alive** (pooled agents/undici), avoid blocking the event loop (JSON on huge payloads—stream), cap concurrency per instance, pre-allocate connection pools to DB/Redis, compress selectively, and leverage **ElastiCache** for hot keys. Autoscale on **ALB TargetResponseTime** and CPU. Cache auth/ACL decisions where safe.

---

### Q23. How do you scale Aurora Postgres read-heavy workloads?
**Answer:** Add **read replicas**, route read traffic via **Aurora reader endpoint**, optimize **connection pooling** (RDS Proxy/pgBouncer), use **prepared statements**, **covering indexes**, and **partitioning** for big tables. For spikes, rely on **burst capacity** and scale up IOPS/instance class if needed.

---

### Q24. DynamoDB hot partition—what now?
**Answer:** Identify skew with **ConsumedRead/Write capacity** and **partition heat maps**. Remediate by **widening the key** (add random suffix/sharding key), adopt **write sharding**, or move hot counters to **Redis** with periodic reconciliation. Consider **adaptive capacity** and **on-demand** mode during remediation.

---

### Q25. Caching strategies across microservices?
**Answer:** **Read-through** for DB lookups, **write-through** for consistency, **write-behind** for bulk updates, **request coalescing** to prevent thundering herds, and **cache aside** as simple default. Use **TTL** + **invalidation events**; for DynamoDB, consider **DAX** when read-after-write is okay with slight delay.

---

### Q26. Cost controls at scale?
**Answer:** Right-size memory/CPU, use **Spot** for stateless workers, reserved/savings plans for steady base, **S3 lifecycle** and **intelligent tiering**, compress logs, **VPC endpoints** to reduce NAT data charges, and turn on **AWS Budgets/Cost Anomaly Detection** with Slack alerts.

---

## 7) Security & Compliance

### Q27. IAM least privilege in microservices—practical tips?
**Answer:** Each service has its own **execution role** scoped to exact resources/actions; no wildcard `*` in prod. Use **condition keys** (e.g., resource ARNs, source VPC), short-lived credentials (STS), **resource policies** for S3/SNS/SQS, and **KMS** for encryption. CI enforces policy linting (e.g., `cfn-nag`, `iamlint`).

---

### Q28. Secrets management?
**Answer:** Store in **AWS Secrets Manager** or **SSM Parameter Store (SecureString)**; rotate automatically, fetch at startup and cache in memory with TTL, never log secrets, and use **resource-based policies** + **VPC endpoints** for private access.

---

### Q29. Public APIs protection?
**Answer:** **WAF** (rate limits, bot control, IP reputation), **Cognito**/OIDC for auth, JWT validation with key rotation, **mTLS** for service-to-service where required, and strict **CORS**. Implement **resource quotas** and **usage plans** in API Gateway.

---

## 8) Deployments & CI/CD

### Q30. A proven pipeline for AWS microservices?
**Answer:** PR → build (lint, unit tests) → integration tests with **Testcontainers** → build image (SBOM, scan) → push to **ECR** → deploy via **CDK/Terraform** → run smoke tests → canary 5%/15%/50%/100% with **automated rollback** (CloudWatch alarms). Store infra and app in mono-repo with isolated pipelines per service.

---

### Q31. Zero-downtime DB migrations?
**Answer:** **Expand/contract**: add new nullable columns/tables, dual-write or backfill asynchronously, flip reads to new schema, remove old fields later. For Postgres, avoid locking DDL in peak; use **gh-ost/pt-online-schema-change** (MySQL) equivalents or partitioning strategies. Wrap in **feature flags**.

---

### Q32. Feature flags & safe rollouts?
**Answer:** Use a flag service (e.g., LaunchDarkly/Open-Source) to gate risky code paths, roll out by % or cohort, and enable **kill switches**. Audit flag configs; never tie auth to flags without fallback.

---

## 9) Real-World Scenarios (Debugging & Fixes)

### Q33. Production: p99 latency doubled after deploy—steps?
**Answer:** Immediately flip to **previous version** (canary or rollback). Compare diffs; check connection pools and retries; inspect **autoscaling events**; confirm **ALB target health** and **container resource limits**; look for added synchronous I/O or N+1 DB queries. Add temporary **circuit breaker** to slow dependency and ramp concurrency back carefully.

---

### Q34. Production: sudden 5xx spike on a single endpoint.
**Answer:** Scope blast radius with dashboards; examine last deploys, **WAF**/ingress changes, dependency error rates. Enable **debug logs** for a subset via header/flag. Reproduce with a controlled trace; if third-party failing, **fail open** or **degrade gracefully**. Patch and ship via hotfix branch; keep **postmortem** with action items.

---

### Q35. Data corruption in a downstream store due to duplicate processing.
**Answer:** Stop consumers; implement **idempotency** immediately (dedupe table keyed by message ID, unique constraints). Build a **reconciliation job** from the source of truth; replay DLQ with **exactly-once** semantics at business level (not transport). Add CDC/outbox to prevent recurrence.

---

### Q36. Memory leak in Node worker handling images.
**Answer:** Capture heap snapshots, look for retained buffers/global caches; stream images instead of buffering; ensure sharp/jimp pipelines free resources; cap concurrency; enforce **MaxListeners** and close streams on error. Add **–max-old-space-size** if justified after fix.

---

### Q37. Hot partition / uneven traffic across shards.
**Answer:** Add **sharding key** with randomization, implement **consistent hashing** in clients, or migrate to a broker/DB that supports rebalancing (increase shard count). Backfill or dual-write during transition; ensure ordering constraints are preserved if needed.

---

## 10) API Design & DX

### Q38. Pagination, filtering, and consistency best practices?
**Answer:** Use **cursor-based** pagination (stable sort key), include `nextCursor`, validate filters server-side, and document **consistency model** (e.g., stale reads acceptable up to 5s). For list APIs, support `If-None-Match`/ETags for caching.

---

### Q39. Schema validation at the edge?
**Answer:** Validate at gateway (API Gateway/Lambda@Edge/Fastify schemas) to reject bad requests early. Maintain **JSON Schema** or Zod; generate **OpenAPI** and clients from source of truth.

---

### Q40. Example: resilient HTTP client in Node (timeouts, retries, breaker).
**Answer:**
```js
import { fetch } from 'undici';
import CircuitBreaker from 'opossum';

const doFetch = async (url, opts = {}) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeout ?? 2000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } finally { clearTimeout(t); }
};

const breaker = new CircuitBreaker(doFetch, {
  timeout: 2500, errorThresholdPercentage: 50, resetTimeout: 5000
});

export async function getUser(id) {
  const res = await breaker.fire(`https://api/users/${id}`, { timeout: 1500 });
  return res.json();
}
```

---

## 11) Data Pipelines & Search

### Q41. Building a search index in microservices?
**Answer:** Use **CDC** (DynamoDB Streams/Aurora binlog) → **stream processor** → **OpenSearch/Elasticsearch** index with **idempotent upserts**. Design **reindex** jobs, version mappings, and **aliases** for zero-downtime swaps. Backpressure control via queue depth and batch sizes.

---

## 12) Testing & Quality

### Q42. What’s your recommended test pyramid for AWS microservices?
**Answer:** Heavy unit tests; moderate **contract tests** (CDC); integration tests with ephemeral infra (LocalStack/Testcontainers); few e2e tests via deployed stacks. Include **load tests** (k6/Locust) per critical path; enforce coverage on critical modules, not 100% blanket.

---

### Q43. How do you test failure modes realistically?
**Answer:** **Fault injection** (latency/5xx) via proxies or chaos tools; simulate **AZ failure** with targeted scaling & route53 changes in staging; test **DLQ replay** and **idempotency** by sending duplicates/out-of-order events.

---

## 13) Governance & Platform

### Q44. How do platform teams empower service teams?
**Answer:** Provide golden paths: **service templates** (CI/CD, observability baked-in), paved road modules (Auth, logging, metrics), **infra as code** modules (CDK constructs/Terraform), and docs. Offer **runtime SLOs** and a shared incident process.

---

## 14) Handy Runbooks & Checklists (Condensed)

- **Before scaling out**: check hot keys, DB indexes, N+1, compression, connection pools, GC, async batching.
- **Queue backlog**: increase consumers, reduce per-item cost (batching), raise visibility timeout, analyze poison messages.
- **API p99 regression**: diff release, examine ALB TargetResponseTime, breaker stats, dependency health, and new synchronous calls.
- **Cost spike**: inspect NAT egress, log volume, provisioned concurrency, Global Tables write amplication, cross-Region data transfer.
- **Security**: audit IAM wildcards, public S3 ACLs, open SGs, missing encryption, plaintext secrets in env.

---

## Closing Advice
Be prepared to: sketch a **saga** with compensations, write an idempotent handler, design a **DLQ replay**, show autoscaling triggers, and walk through **postmortem** action items. Bring numbers and dashboards—not just theory.

# Complete HTTP Cheatsheet

---

## HTTP Methods

| Method | Purpose | Idempotent | Safe | Body |
|--------|---------|------------|------|------|
| `GET` | Retrieve resource | ✓ | ✓ | No |
| `POST` | Create resource / submit data | ✗ | ✗ | Yes |
| `PUT` | Replace resource entirely | ✓ | ✗ | Yes |
| `PATCH` | Partial update | ✗ | ✗ | Yes |
| `DELETE` | Remove resource | ✓ | ✗ | Optional |
| `HEAD` | GET without body | ✓ | ✓ | No |
| `OPTIONS` | Get allowed methods (CORS preflight) | ✓ | ✓ | No |
| `TRACE` | Echo request (debugging) | ✓ | ✓ | No |
| `CONNECT` | Establish tunnel (proxies) | ✗ | ✗ | No |

---

## Status Codes

### 1xx Informational
| Code | Meaning |
|------|---------|
| 100 | Continue |
| 101 | Switching Protocols |
| 102 | Processing |
| 103 | Early Hints |

### 2xx Success
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 202 | Accepted (processing not complete) |
| 204 | No Content |
| 206 | Partial Content (range requests) |

### 3xx Redirection
| Code | Meaning | Caches | Method Change |
|------|---------|--------|---------------|
| 301 | Moved Permanently | ✓ | May change to GET |
| 302 | Found (temporary) | ✗ | May change to GET |
| 303 | See Other | ✗ | Always GET |
| 304 | Not Modified | - | - |
| 307 | Temporary Redirect | ✗ | Preserved |
| 308 | Permanent Redirect | ✓ | Preserved |

### 4xx Client Errors
| Code | Meaning |
|------|---------|
| 400 | Bad Request |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (authenticated but not allowed) |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 406 | Not Acceptable |
| 408 | Request Timeout |
| 409 | Conflict |
| 410 | Gone (permanently removed) |
| 411 | Length Required |
| 412 | Precondition Failed |
| 413 | Payload Too Large |
| 414 | URI Too Long |
| 415 | Unsupported Media Type |
| 416 | Range Not Satisfiable |
| 418 | I'm a Teapot ☕ |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 451 | Unavailable For Legal Reasons |

### 5xx Server Errors
| Code | Meaning |
|------|---------|
| 500 | Internal Server Error |
| 501 | Not Implemented |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |
| 505 | HTTP Version Not Supported |

---

## Request Headers

### General
| Header | Purpose | Example |
|--------|---------|---------|
| `Host` | Target host (required in HTTP/1.1) | `Host: api.example.com` |
| `User-Agent` | Client identifier | `User-Agent: Mozilla/5.0...` |
| `Connection` | Connection management | `Connection: keep-alive` |

### Content Negotiation
| Header | Purpose | Example |
|--------|---------|---------|
| `Accept` | Acceptable media types | `Accept: application/json` |
| `Accept-Language` | Preferred languages | `Accept-Language: en-US,en;q=0.9` |
| `Accept-Encoding` | Supported compression | `Accept-Encoding: gzip, br` |
| `Accept-Charset` | Preferred character sets | `Accept-Charset: utf-8` |

### Authentication
| Header | Purpose | Example |
|--------|---------|---------|
| `Authorization` | Credentials | `Authorization: Bearer <token>` |
| `Cookie` | Send cookies | `Cookie: session=abc123` |
| `Proxy-Authorization` | Proxy credentials | `Proxy-Authorization: Basic ...` |

### Request Body
| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Body media type | `Content-Type: application/json` |
| `Content-Length` | Body size (bytes) | `Content-Length: 348` |
| `Content-Encoding` | Body compression | `Content-Encoding: gzip` |

### Conditional Requests
| Header | Purpose | Example |
|--------|---------|---------|
| `If-Match` | Match ETag | `If-Match: "abc123"` |
| `If-None-Match` | No match ETag (caching) | `If-None-Match: "abc123"` |
| `If-Modified-Since` | Modified after date | `If-Modified-Since: Sat, 29 Oct 2023...` |
| `If-Unmodified-Since` | Not modified after date | `If-Unmodified-Since: Sat, 29 Oct 2023...` |

### Other
| Header | Purpose | Example |
|--------|---------|---------|
| `Origin` | Request origin (CORS) | `Origin: https://example.com` |
| `Referer` | Previous page URL | `Referer: https://example.com/page` |
| `Range` | Request partial content | `Range: bytes=0-1023` |
| `X-Requested-With` | AJAX identifier | `X-Requested-With: XMLHttpRequest` |
| `X-Forwarded-For` | Original client IP (proxies) | `X-Forwarded-For: 192.168.1.1` |
| `X-Forwarded-Proto` | Original protocol | `X-Forwarded-Proto: https` |

---

## Response Headers

### Content
| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Body media type | `Content-Type: text/html; charset=utf-8` |
| `Content-Length` | Body size | `Content-Length: 1234` |
| `Content-Encoding` | Compression used | `Content-Encoding: gzip` |
| `Content-Language` | Content language | `Content-Language: en` |
| `Content-Disposition` | Display/download behavior | `Content-Disposition: attachment; filename="file.pdf"` |

### Caching
| Header | Purpose | Example |
|--------|---------|---------|
| `Cache-Control` | Caching directives | `Cache-Control: max-age=3600` |
| `ETag` | Resource version identifier | `ETag: "33a64df551ae"` |
| `Last-Modified` | Last modification time | `Last-Modified: Tue, 15 Nov 2023...` |
| `Expires` | Expiration date (legacy) | `Expires: Thu, 01 Dec 2023...` |
| `Age` | Time in cache (seconds) | `Age: 24` |
| `Vary` | Headers affecting cached response | `Vary: Accept-Encoding, Origin` |

### Cookies
| Header | Purpose | Example |
|--------|---------|---------|
| `Set-Cookie` | Set a cookie | `Set-Cookie: id=abc; Path=/; HttpOnly; Secure; SameSite=Strict` |

### Redirects & Location
| Header | Purpose | Example |
|--------|---------|---------|
| `Location` | Redirect URL | `Location: https://example.com/new-page` |

### Authentication
| Header | Purpose | Example |
|--------|---------|---------|
| `WWW-Authenticate` | Authentication method required | `WWW-Authenticate: Bearer realm="api"` |

---

## Security Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `Strict-Transport-Security` | Force HTTPS | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | Resource loading rules | `default-src 'self'; script-src 'self' 'unsafe-inline'` |
| `X-Content-Type-Options` | Prevent MIME sniffing | `nosniff` |
| `X-Frame-Options` | Clickjacking protection | `DENY` or `SAMEORIGIN` |
| `X-XSS-Protection` | XSS filter (legacy) | `1; mode=block` |
| `Referrer-Policy` | Control Referer header | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Feature permissions | `geolocation=(), camera=(), microphone=()` |
| `Cross-Origin-Opener-Policy` | Process isolation | `same-origin` |
| `Cross-Origin-Embedder-Policy` | Embedding rules | `require-corp` |
| `Cross-Origin-Resource-Policy` | Who can load resource | `same-origin` |

---

## CORS Headers

| Header | Direction | Purpose | Example |
|--------|-----------|---------|---------|
| `Origin` | Request | Requesting origin | `Origin: https://app.com` |
| `Access-Control-Allow-Origin` | Response | Allowed origins | `*` or `https://app.com` |
| `Access-Control-Allow-Methods` | Response | Allowed methods | `GET, POST, PUT, DELETE` |
| `Access-Control-Allow-Headers` | Response | Allowed request headers | `Content-Type, Authorization` |
| `Access-Control-Allow-Credentials` | Response | Allow cookies/auth | `true` |
| `Access-Control-Max-Age` | Response | Preflight cache (seconds) | `86400` |
| `Access-Control-Expose-Headers` | Response | Headers readable by JS | `X-Custom-Header` |
| `Access-Control-Request-Method` | Preflight | Method being requested | `PUT` |
| `Access-Control-Request-Headers` | Preflight | Headers being requested | `Content-Type` |

---

## Cache-Control Directives

### Request Directives
| Directive | Meaning |
|-----------|---------|
| `no-cache` | Revalidate before using |
| `no-store` | Don't store anywhere |
| `max-age=N` | Accept if fresh within N seconds |
| `max-stale=N` | Accept stale up to N seconds |
| `min-fresh=N` | Must be fresh for N more seconds |
| `only-if-cached` | Only return cached response |

### Response Directives
| Directive | Meaning |
|-----------|---------|
| `public` | Any cache can store |
| `private` | Only browser can store |
| `no-cache` | Must revalidate before use |
| `no-store` | Don't cache at all |
| `max-age=N` | Fresh for N seconds |
| `s-maxage=N` | Fresh for N seconds (shared caches) |
| `must-revalidate` | Must revalidate when stale |
| `proxy-revalidate` | Proxies must revalidate when stale |
| `immutable` | Won't change, skip revalidation |
| `stale-while-revalidate=N` | Serve stale while revalidating |
| `stale-if-error=N` | Serve stale if origin errors |

---

## Content-Types (MIME Types)

### Text
```
text/plain
text/html
text/css
text/javascript (legacy: application/javascript)
text/csv
text/xml
```

### Application
```
application/json
application/xml
application/pdf
application/zip
application/gzip
application/octet-stream
application/x-www-form-urlencoded
application/ld+json
```

### Multipart
```
multipart/form-data
multipart/byteranges
```

### Images
```
image/png
image/jpeg
image/gif
image/webp
image/svg+xml
image/avif
```

### Audio/Video
```
audio/mpeg
audio/ogg
audio/wav
video/mp4
video/webm
video/ogg
```

### Fonts
```
font/woff
font/woff2
font/ttf
font/otf
```

---

## Authentication Schemes

| Scheme | Usage | Header Example |
|--------|-------|----------------|
| Basic | Base64 encoded username:password | `Authorization: Basic dXNlcjpwYXNz` |
| Bearer | Token-based (OAuth, JWT) | `Authorization: Bearer eyJhbGc...` |
| Digest | Challenge-response | `Authorization: Digest username="..." ...` |
| API Key | Custom header or query param | `X-API-Key: abc123` |

---

## Cookie Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `Expires` | Absolute expiration | `Expires=Thu, 01 Jan 2025 00:00:00 GMT` |
| `Max-Age` | Seconds until expiration | `Max-Age=3600` |
| `Domain` | Valid domain | `Domain=example.com` |
| `Path` | Valid path | `Path=/api` |
| `Secure` | HTTPS only | `Secure` |
| `HttpOnly` | No JavaScript access | `HttpOnly` |
| `SameSite` | Cross-site behavior | `SameSite=Strict\|Lax\|None` |

**SameSite values:**
- `Strict` — Only sent for same-site requests
- `Lax` — Sent for same-site + top-level navigation (default)
- `None` — Always sent (requires `Secure`)

---

## URL Structure

```
  https://user:pass@www.example.com:8080/path/to/resource?key=value&foo=bar#section
  └─┬──┘ └───┬───┘ └──────┬───────┘└─┬┘└──────┬────────┘└───────┬───────┘└───┬──┘
  scheme  userinfo       host      port     path              query       fragment
          └─────────┬─────────────────┘
                 authority
```

---

## HTTP Versions

| Version | Key Features |
|---------|--------------|
| HTTP/0.9 | Single-line requests, HTML only |
| HTTP/1.0 | Headers, status codes, content types |
| HTTP/1.1 | Keep-alive, chunked transfer, Host header required |
| HTTP/2 | Binary protocol, multiplexing, header compression, server push |
| HTTP/3 | QUIC (UDP-based), improved latency, better loss recovery |

---

## Common Request/Response Examples

### Simple GET
```http
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbG...
```

### POST with JSON
```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 42

{"name": "John", "email": "john@example.com"}
```

### Form Submission
```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 29

username=john&password=secret
```

### Typical Response
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 85
Cache-Control: max-age=3600
ETag: "abc123"

{"id": 1, "name": "John", "email": "john@example.com"}
```

### Redirect Response
```http
HTTP/1.1 301 Moved Permanently
Location: https://www.example.com/new-url
```

---

## Quick Reference: When to Use What

| Scenario | Method | Status |
|----------|--------|--------|
| Get a resource | GET | 200 |
| Create new resource | POST | 201 |
| Update entire resource | PUT | 200 or 204 |
| Partial update | PATCH | 200 or 204 |
| Delete resource | DELETE | 204 |
| Resource created async | POST | 202 |
| Bad JSON/input | - | 400 |
| Not logged in | - | 401 |
| Logged in but forbidden | - | 403 |
| Resource doesn't exist | - | 404 |
| Validation error | - | 422 |
| Rate limited | - | 429 |
| Server error | - | 500 |
# Security Phase 4 Report

**Date**: 2026-09-20
**Scope**: Independent review of deferred security findings (SEC-010, SEC-011, SEC-014, SEC-015)
**Methodology**: Source code inspection, architecture analysis, attack path tracing

---

## Findings Reviewed

| Finding | Original Severity | Current Status | Disposition |
|---------|------------------|----------------|-------------|
| SEC-010 | MEDIUM | NOT APPLICABLE | No multi-tenant school model exists in codebase |
| SEC-011 | MEDIUM | FALSE POSITIVE | Admin login is properly protected at proxy + server action layers |
| SEC-014 | MEDIUM | FALSE POSITIVE | NextAuth v5 provides CSRF protection automatically |
| SEC-015 | LOW | DEFERRED | Application-level rate limiting is hardening, not critical |
| SEC-006 | CRITICAL | FALSE POSITIVE | `proxy.ts` with `export function proxy` is correct for Next.js 16 |

---

## SEC-010 — School Access Control

### Analysis

Searched entire codebase for `school`, `tenant`, `school_id`, `tenant_id` — **zero results**.

**Database schema** (`supabase/schema.sql`) contains 10 tables:
- `blog_posts`, `services`, `case_studies` — global content, no tenant scoping
- `contact_submissions`, `leads` — global, no tenant scoping
- `projects`, `invoices`, `support_tickets` — scoped by `client_email` column
- `users` — with `role` column (`admin`, `agent`, `client`)

**No multi-tenant data model exists.** There is no school/tenant concept anywhere in the application.

### Data Isolation Model

| Data Type | Isolation Mechanism | Verified |
|-----------|-------------------|----------|
| Client projects | `WHERE client_email = session.user.email` in `portal.ts:21` | ✅ |
| Client invoices | `WHERE client_email = session.user.email` in `portal.ts:35` | ✅ |
| Client tickets | `WHERE client_email = session.user.email` in `portal.ts:49` | ✅ |
| Admin data | All data visible (by design — admins manage the platform) | ✅ |
| CRM leads | All leads visible to agents (by design) | ✅ |

### Attack Path Analysis

- **Can Client A access Client B's data?** → **No.** Portal queries filter by `session.user.email` from the JWT, not from user input. No IDOR exists.
- **Can a client access admin routes?** → **No.** `proxy.ts:83-92` redirects non-client roles away from `/portal`. Admin actions require `admin`/`agent` role.
- **Can an admin access another admin's data?** → Not applicable — admins see all data (single-tenant platform).

### Verdict: NOT APPLICABLE

The application is a **single-tenant platform** with role-based access (admin/agent/client). The "school access control" finding assumes a multi-tenant architecture that does not exist in this codebase. No fix required.

---

## SEC-011 — Admin Login Protection

### Flow Trace

```
1. Login UI (app/admin/page.tsx)
   └─ "use client" component
   └─ Calls signIn("credentials", { redirect: false })
   
2. Authentication (lib/auth.ts:49-78)
   └─ Credentials provider queries users table
   └─ bcryptjs.compare() validates password
   └─ Returns { id, email, name, role }
   
3. Session Creation (lib/auth.ts:82-94)
   └─ JWT strategy (not database sessions)
   └─ jwt callback: token.role = user.role
   └─ session callback: session.user.role = token.role
   
4. Route Protection (proxy.ts:47-67)
   └─ Intercepts ALL /admin/:path* requests
   └─ Reads authjs.session-token cookie
   └─ Decodes JWT, extracts role
   └─ Redirects to /admin if no token OR role !== admin/agent
   
5. Server Action Protection (lib/actions/admin.ts:8-15)
   └─ requireAdmin() calls auth() (server-side session)
   └─ Checks session.user.role !== "admin" && !== "agent"
   └─ Throws "Forbidden" if check fails
```

### Attack Path Analysis

| Attack Vector | Protected? | Evidence |
|---------------|------------|----------|
| Navigate to `/admin/dashboard` without login | ✅ | `proxy.ts:59-60` redirects to `/admin` |
| Navigate to `/admin/dashboard` with client role | ✅ | `proxy.ts:62-64` redirects to `/admin` |
| Call admin server action without auth | ✅ | `admin.ts:9-10` throws "Unauthorized" |
| Call admin action with client role | ✅ | `admin.ts:11-13` throws "Forbidden" |
| Bypass proxy via direct HTTP request | ✅ | Proxy runs server-side on every request |
| Forge session cookie | ✅ | JWT is signed with NextAuth secret; httpOnly + SameSite=Lax |

### Why the Client Component is Not a Vulnerability

The login page (`app/admin/page.tsx`) is `"use client"` — this is fine because:
1. The actual authentication happens server-side via NextAuth's `signIn()` API
2. After login, `router.push("/admin/dashboard")` navigates to a proxy-protected route
3. The proxy validates the JWT server-side before allowing access
4. Server actions within admin pages have their own `requireAdmin()` checks

### Verdict: FALSE POSITIVE

The admin login is protected at **three layers**:
1. **Proxy layer** (HTTP-level): JWT validation on every `/admin/:path*` request
2. **Server action layer**: `requireAdmin()` with session + role check
3. **Infrastructure layer**: NextAuth JWT signing, httpOnly cookies, SameSite=Lax

No additional server-side check is needed for the login flow itself.

---

## SEC-014 — CSRF Protection

### Framework Analysis

**NextAuth v5 (5.0.0-beta.32)** provides built-in CSRF protection:
- CSRF tokens in callback URLs
- Origin/Referer header validation
- `authjs.session-token` cookie: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (production)

### State-Changing Endpoints

| Endpoint | Method | Auth Required | CSRF Protected By |
|----------|--------|---------------|-------------------|
| `/api/auth/[...nextauth]` | POST | No (login) | NextAuth CSRF tokens |
| Contact form (`submitContactAction`) | Server Action | No | Same-origin requirement + NextAuth |
| All admin CRUD actions | Server Action | `requireAdmin()` | NextAuth session + Same-origin |
| All portal actions | Server Action | `requireClient()` | NextAuth session + Same-origin |

### Cookie Security

```
authjs.session-token:
  httpOnly: true      → Cannot be read by JavaScript
  sameSite: 'lax'    → NOT sent on cross-site POST requests
  secure: true        → HTTPS only (in production)
```

### Attack Surface

- **Cross-site form submission**: Blocked by `SameSite: Lax` — cookies not sent on cross-site POST
- **Server Actions**: Require same-origin POST requests with valid action IDs
- **GET requests**: No state-changing operations exist via GET
- **XMLHttpRequest/fetch**: Blocked by CORS and SameSite policy

### Verdict: FALSE POSITIVE

NextAuth v5 handles CSRF protection automatically via:
1. CSRF token validation on auth endpoints
2. `SameSite: Lax` cookie policy (default)
3. Server Actions' same-origin requirement
4. No state-changing GET endpoints

No additional CSRF implementation is required.

---

## SEC-015 — Rate Limiting

### Endpoints Requiring Protection

| Endpoint | Sensitivity | Current Protection | Rate Limiting Value |
|----------|------------|-------------------|---------------------|
| Login (`/admin`, `/portal`, `/crm`) | HIGH | bcryptjs (slow hash) | Brute force prevention |
| Contact form | MEDIUM | None | Spam prevention |
| Server actions | LOW | `requireAdmin()`/`requireClient()` | Minimal value |

### Existing Protections

1. **bcryptjs**: Password hashing with cost factor 10+ (~100ms per hash). Makes brute force expensive.
2. **Vercel infrastructure**: DDoS protection at the edge.
3. **JWT expiration**: Sessions expire, requiring re-authentication.
4. **No password reset endpoint**: Reduces attack surface.

### Recommended Solution (If Implemented)

- **Storage**: Upstash Redis (serverless, pay-per-request)
- **Library**: `@upstash/ratelimit` or `next-rate-limit`
- **Limits**: 5 attempts/minute on login, 10/hour on contact form
- **Prerequisites**: Upstash account, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` env vars

### Verdict: DEFERRED

Rate limiting is a **hardening measure**, not a critical vulnerability. The application has adequate protection via:
- bcryptjs slow hashing (makes brute force expensive)
- Vercel infrastructure DDoS protection
- No password reset endpoint (reduced attack surface)
- Session-based auth with JWT expiration

**To implement later**: Add Upstash rate limiting on `/api/auth/[...nextauth]` (login) and contact form server action.

---

## SEC-006 — Proxy Convention (Re-verified)

### Original Audit Claim
> "The file exports a function named `proxy` and a `config` matcher. However, Next.js middleware must either be named `middleware` or live in `middleware.ts`."

### Actual Finding

Per Next.js 16 documentation (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`):

> "The `middleware` file convention is deprecated and has been renamed to `proxy`."
> "The file must export a single function, either as a default export or named `proxy`."

The build output confirms: `ƒ Proxy (Middleware)` — the proxy is active and working.

### Verdict: FALSE POSITIVE

The original `proxy.ts` with `export function proxy()` was always the correct convention for Next.js 16. The audit assumed pre-v16 conventions.

---

## Validation

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Passes |
| `npm run build` | ✅ Builds successfully (32 pages) |
| `ƒ Proxy (Middleware)` | ✅ Active in build output |

---

## Remaining Security Work

### Genuinely Unresolved Items

| Item | Priority | Status | Notes |
|------|----------|--------|-------|
| Application-level rate limiting | LOW | Deferred | Requires Upstash Redis infrastructure |
| Supabase RLS on browser client queries | MEDIUM | Needs investigation | Admin/CRM dashboard pages use browser client with anon key; verify RLS policies allow this |
| No password reset flow | LOW | Not started | Feature request, not security fix |
| No test suite | MEDIUM | Not started | Would help prevent regressions |

### Items Confirmed as Not Needed

| Item | Reason |
|------|--------|
| School/tenant isolation | No multi-tenant model exists |
| Additional CSRF protection | NextAuth v5 handles this |
| Server-side login protection | Proxy + server actions already protected |
| Middleware rename to `middleware.ts` | `proxy.ts` is correct for Next.js 16 |

# Supabase RLS Security Remediation

**Date:** September 19, 2026  
**Status:** COMPLETE — VERIFIED  
**Severity:** HIGH (pre-fix) → RESOLVED

---

## Finding

Four sensitive tables (`users`, `projects`, `invoices`, `support_tickets`) had RLS enabled with **overly permissive policies** that granted unrestricted access to all roles including `anon`. The policy `USING(true)` with `roles={public}` effectively rendered RLS meaningless.

---

## Before-State Policies

Each table had exactly one RLS policy:

```sql
POLICY "Service role full access on [table]"
  ON [table] FOR ALL
  TO public           -- applies to ALL roles (anon, authenticated, service_role)
  USING (true)        -- no row-level filtering
  WITH CHECK (true);  -- no insert/update filtering
```

### GRANT state (before fix):

| Role | Tables | Privileges |
|------|--------|------------|
| `anon` | users, projects, invoices, support_tickets | SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER |
| `authenticated` | users, projects, invoices, support_tickets | SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER |
| `service_role` | users, projects, invoices, support_tickets | SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER |
| `postgres` | users, projects, invoices, support_tickets | Full (owner) |

---

## Why `USING(true)` Was Dangerous

1. **Anon key exposure**: The `anon` key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) is embedded in client-side JavaScript. Anyone with the Supabase URL + anon key could:
   - `SELECT * FROM users` — expose emails, bcrypt password hashes, roles
   - `SELECT * FROM projects` — expose all client project data
   - `SELECT * FROM invoices` — expose financial data
   - `SELECT * FROM support_tickets` — expose support communications
   - `INSERT/UPDATE/DELETE` — corrupt or steal data

2. **No row filtering**: `USING(true)` means all rows are visible/modifiable to all roles.

3. **Defense-in-depth failure**: RLS was enabled but provided zero actual protection. Security relied entirely on application-layer controls.

---

## Exact Policy Changes

### Migration: `fix_rls_policies_sensitive_tables`

```sql
-- 1. Drop overly permissive policies
DROP POLICY IF EXISTS "Service role full access on users" ON public.users;
DROP POLICY IF EXISTS "Service role full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Service role full access on invoices" ON public.invoices;
DROP POLICY IF EXISTS "Service role full access on support_tickets" ON public.support_tickets;

-- 2. Revoke direct access from anon and authenticated roles
REVOKE ALL ON public.users FROM anon, authenticated;
REVOKE ALL ON public.projects FROM anon, authenticated;
REVOKE ALL ON public.invoices FROM anon, authenticated;
REVOKE ALL ON public.support_tickets FROM anon, authenticated;

-- 3. Ensure service_role retains full access
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.invoices TO service_role;
GRANT ALL ON public.support_tickets TO service_role;
```

---

## Tables Affected

| Table | Rows | RLS Enabled | Policies After Fix | GRANT After Fix |
|-------|------|-------------|-------------------|-----------------|
| `users` | 1 | Yes | 0 (none) | postgres, service_role only |
| `projects` | 3 | Yes | 0 (none) | postgres, service_role only |
| `invoices` | 3 | Yes | 0 (none) | postgres, service_role only |
| `support_tickets` | 3 | Yes | 0 (none) | postgres, service_role only |

---

## Verification Results

### 1. Anonymous/anon access is DENIED

| Check | Result |
|-------|--------|
| `anon` GRANT privileges | **NONE** (all REVOKE'd) |
| RLS policies for anon | **NONE** (all dropped) |
| Effective access | **DENIED** (no grant + no policy = blocked) |

### 2. Public browser access is DENIED

| Check | Result |
|-------|--------|
| Browser client (`lib/supabase/client.ts`) | Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Anon key role in Supabase | `anon` |
| `anon` access to sensitive tables | **DENIED** (see above) |
| Browser-side queries to sensitive tables | **ZERO** (confirmed via grep) |

### 3. Server-side service-role operations WORK

| Operation | Query | Result |
|-----------|-------|--------|
| `SELECT * FROM users` | getAdminClients() | ✅ 1 row returned |
| `SELECT * FROM projects` | getAdminClients() | ✅ 3 rows returned |
| `SELECT * FROM invoices` | getAdminClients() | ✅ 3 rows returned |
| `SELECT ... FROM projects WHERE client_email = ...` | getPortalProjects() | ✅ 3 rows returned |
| `SELECT ... FROM invoices WHERE client_email = ...` | getPortalInvoices() | ✅ 3 rows returned |
| `SELECT ... FROM support_tickets WHERE client_email = ...` | getPortalTickets() | ✅ 3 rows returned |

### 4. Admin operations WORK

| Operation | Auth Check | Result |
|-----------|-----------|--------|
| `getAdminClients()` | `requireAdmin()` | ✅ Queries users + projects + invoices |
| `getAdminInvoices()` | `requireAdmin()` | ✅ Queries invoices |
| `getAdminDashboardStats()` | `requireAdmin()` | ✅ Queries leads, blog_posts, services, etc. |

### 5. Client portal operations WORK

| Operation | Auth Check | Result |
|-----------|-----------|--------|
| `getPortalProjects()` | `requireClient()` + email filter | ✅ Returns client-scoped projects |
| `getPortalInvoices()` | `requireClient()` + email filter | ✅ Returns client-scoped invoices |
| `getPortalTickets()` | `requireClient()` + email filter | ✅ Returns client-scoped tickets |
| `createSupportTicket()` | `requireClient()` + email from session | ✅ Inserts with session email |
| `getPortalStats()` | `requireClient()` + email filter | ✅ Counts client-scoped data |

### 6. Client A cannot access Client B's data

| Check | Result |
|-------|--------|
| Portal queries filter by `session.user.email!` | ✅ All portal queries use `.eq("client_email", session.user.email!)` |
| JWT email from NextAuth | ✅ `session.user.email` comes from JWT token |
| User cannot supply their own email | ✅ Email is server-validated, not user-input |
| Client isolation | ✅ **VERIFIED** — email scoping enforced at application layer |

### 7. No browser Supabase queries were introduced

| Check | Result |
|-------|--------|
| `import ... from "@/lib/supabase/client"` in codebase | **0 matches** |
| All sensitive table queries in | `lib/actions/admin.ts`, `lib/actions/portal.ts` (server actions only) |
| No `"use client"` files import Supabase | ✅ **VERIFIED** |

### 8. No service-role key exposed to client

| Check | Result |
|-------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` in codebase | **Only in `lib/supabase/server.ts:6`** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` in codebase | **Only in `lib/supabase/client.ts:11`** |
| Service-role key in `NEXT_PUBLIC_*` env vars | **No** |
| Service-role key bundled into client JS | **No** |

---

## Application Authorization Model

```
┌─────────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                              │
│                                                              │
│  Browser ──► proxy.ts (JWT validation)                       │
│              ├── /admin/* ──► requireAdmin() ──► service_role│
│              └── /portal/* ──► requireClient() ──► service_role│
│                                                              │
│  service_role bypasses RLS ──► Full table access             │
│  anon role ──► No grants + No policies ──► DENIED           │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Mechanism | Protects |
|-------|-----------|----------|
| **Layer 1** | `proxy.ts` JWT validation | All `/admin/*` and `/portal/*` routes |
| **Layer 2** | `requireAdmin()` | Admin server actions |
| **Layer 3** | `requireClient()` | Portal server actions |
| **Layer 4** | `session.email` filtering | Portal queries scoped to authenticated user |
| **Layer 5** | RLS + GRANT (post-fix) | `anon`/`authenticated` denied at database level |

---

## Service-Role Verification

| File | Import | Key Used |
|------|--------|----------|
| `lib/supabase/server.ts` | `SUPABASE_SERVICE_ROLE_KEY` | Service-role |
| `lib/actions/admin.ts` | `createClient` from `@/lib/supabase/server` | Service-role |
| `lib/actions/portal.ts` | `createClient` from `@/lib/supabase/server` | Service-role |
| `lib/auth.ts` | `pg.Pool` (direct Postgres) | `DATABASE_URL` (postgres user) |
| `lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon (browser, but never queries sensitive tables) |

---

## IDOR Verification

| Table | IDOR Risk | Mitigation |
|-------|-----------|------------|
| `users` | No UUID-based queries | Queried only by admin via `getAdminClients()` |
| `projects` | No direct ID access from portal | Portal filters by `client_email` from JWT |
| `invoices` | No direct ID access from portal | Portal filters by `client_email` from JWT |
| `support_tickets` | No direct ID access from portal | Portal filters by `client_email` from JWT |

All UUIDs are auto-generated (`gen_random_uuid()`). No user-supplied IDs are used for data access in portal queries.

---

## Remaining Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Service-role key compromise | Low | Critical | Vercel environment variables, key rotation |
| JWT secret compromise | Low | Critical | Strong secret, NextAuth v5 signing |
| bcrypt hash exposure (users table) | Low | Medium | Service-role only access (post-fix) |
| Admin account compromise | Low | High | Strong password, MFA recommendation |
| Future code introduces browser query | Low | Medium | Code review, linting rules |

---

## Build Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Zero errors |
| `npm run lint` | ⚠️ 4 pre-existing errors (unrelated to RLS fix) |
| `npm run build` | ✅ All 32 routes generated successfully |

---

## Final RLS Policy State

```sql
-- After fix:
-- users:      RLS enabled, 0 policies, GRANT: postgres + service_role only
-- projects:   RLS enabled, 0 policies, GRANT: postgres + service_role only
-- invoices:   RLS enabled, 0 policies, GRANT: postgres + service_role only
-- support_tickets: RLS enabled, 0 policies, GRANT: postgres + service_role only

-- Access matrix:
-- anon:           DENIED (no grants + no policies)
-- authenticated:  DENIED (no grants + no policies)
-- service_role:   FULL ACCESS (bypasses RLS + has grants)
-- postgres:       FULL ACCESS (superuser)
```

---

## Migration

- **Migration name:** `fix_rls_policies_sensitive_tables`
- **Applied via:** `supabase_apply_migration`
- **Status:** ✅ Successfully applied

---

**Report Generated:** September 19, 2026  
**Phase:** 6 — Supabase Database Security Verification  
**Status:** COMPLETE

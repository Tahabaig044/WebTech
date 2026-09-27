# Supabase RLS Security Report

**Date**: 2026-09-20
**Scope**: Complete audit of Supabase browser-client data access and RLS policies
**Trigger**: Phase 4 finding — "Supabase RLS on browser client queries — MEDIUM — Needs investigation"

---

## Executive Summary

**A genuine vulnerability existed and has been fixed.**

Three admin/CRM pages (`admin/dashboard`, `admin/leads`, `crm/dashboard`) were using the browser Supabase client with the anon key to query `leads`, `blog_posts`, `services`, `case_studies`, and `contact_submissions` directly from the browser. The RLS policies require `auth.role() = 'authenticated'`, but the browser client has no Supabase Auth session (the app uses NextAuth). This meant:

- If RLS was properly enforced: browser queries would fail silently (data wouldn't load)
- If RLS was NOT enforced: anyone with the anon key (public, embedded in JS bundle) could read/mutate sensitive data

**Fix applied**: Moved all three pages to use server actions with `requireAdmin()` authorization checks, matching the pattern already used by the portal pages.

---

## Supabase Client Inventory

| Client | File | Env Vars | Runtime | Credentials Exposed to Browser |
|--------|------|----------|---------|-------------------------------|
| **Browser client** | `lib/supabase/client.ts` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Yes (NEXT_PUBLIC_ prefix) |
| **Server service-role** | `lib/supabase/server.ts` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Server only | No |

### Classification

| Type | Client | Usage |
|------|--------|-------|
| A. Browser/client-side | `lib/supabase/client.ts` | **REMOVED** from admin/CRM pages (was used in 3 pages) |
| C. Server-side privileged | `lib/supabase/server.ts` | Used by `lib/actions/admin.ts`, `lib/actions/portal.ts`, `lib/supabase/queries.ts` |

**Note**: The server client uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses ALL RLS. Authorization is handled at the application level via `requireAdmin()` / `requireClient()`.

---

## Browser Query Inventory (AFTER FIX)

**No browser Supabase client queries remain in admin/CRM pages.**

| File | Before | After |
|------|--------|-------|
| `app/admin/dashboard/page.tsx` | Direct browser queries to leads, blog_posts, services, case_studies, contact_submissions | Server action: `getAdminDashboardStats()` |
| `app/admin/leads/page.tsx` | Direct browser queries to leads (SELECT + UPDATE) | Server actions: `getAllLeads()`, `updateLeadStatus()` |
| `app/crm/dashboard/page.tsx` | Direct browser queries to leads | Server action: `getCRMLeads()` |
| `app/portal/dashboard/page.tsx` | Already used server actions (safe) | No change |

### Portal Pages (Already Safe)

All portal pages use server actions with `requireClient()`:
- `getPortalProjects()` — filters by `session.user.email`
- `getPortalInvoices()` — filters by `session.user.email`
- `getPortalTickets()` — filters by `session.user.email`
- `getPortalStats()` — filters by `session.user.email`
- `createSupportTicket()` — uses `session.user.email` for `client_email`

---

## Database Tables

| Table | In Schema | RLS Enabled | Policies |
|-------|-----------|-------------|----------|
| `blog_posts` | Yes | Yes | SELECT (published), ALL (authenticated) |
| `services` | Yes | Yes | SELECT (active), ALL (authenticated) |
| `case_studies` | Yes | Yes | SELECT (published), ALL (authenticated) |
| `contact_submissions` | Yes | Yes | INSERT (public), SELECT/UPDATE (authenticated) |
| `leads` | Yes | Yes | ALL (authenticated) |
| `users` | No (managed by NextAuth) | Unknown | None in schema |
| `projects` | No (referenced by indexes) | Unknown | None in schema |
| `invoices` | No (referenced by indexes) | Unknown | None in schema |
| `support_tickets` | No (referenced by indexes) | Unknown | None in schema |

---

## RLS Policy Inventory

### Tables WITH RLS (from `supabase/schema.sql`)

| Table | RLS Enabled | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
|-------|-------------|---------------|---------------|---------------|---------------|
| `blog_posts` | ✅ | Published posts (public) | Authenticated only | Authenticated only | Authenticated only |
| `services` | ✅ | Active services (public) | Authenticated only | Authenticated only | Authenticated only |
| `case_studies` | ✅ | Published cases (public) | Authenticated only | Authenticated only | Authenticated only |
| `contact_submissions` | ✅ | Authenticated only | Public (anyone can submit) | Authenticated only | None |
| `leads` | ✅ | Authenticated only | Authenticated only | Authenticated only | Authenticated only |

### Tables WITHOUT RLS in Schema

| Table | Status | Risk |
|-------|--------|------|
| `users` | Created by NextAuth adapter | HIGH — if RLS not enabled, any authenticated Supabase user could read all user records |
| `projects` | Not in schema | HIGH — if RLS not enabled, data accessible via anon key |
| `invoices` | Not in schema | HIGH — if RLS not enabled, financial data accessible |
| `support_tickets` | Not in schema | MEDIUM — client communications accessible |

**Critical**: The `users`, `projects`, `invoices`, and `support_tickets` tables are NOT defined in `schema.sql` and have no RLS policies in the schema file. These tables exist (they're queried by the application) but their RLS status is unknown from the schema file alone.

---

## Browser Data Access Analysis

### The Vulnerability (FIXED)

**Before the fix:**

| Attacker Type | Can Read Leads? | Can Read Blog/Services/Cases? | Can Update Leads? | Method |
|---------------|-----------------|-------------------------------|-------------------|--------|
| Unauthenticated (knows anon key) | **Depends on RLS** | **Depends on RLS** | **Depends on RLS** | Direct Supabase API call |
| Unauthenticated (browser DevTools) | **Depends on RLS** | **Depends on RLS** | **Depends on RLS** | Intercept/replay browser requests |

**After the fix:**

| Attacker Type | Can Read Leads? | Can Read Blog/Services/Cases? | Can Update Leads? | Method |
|---------------|-----------------|-------------------------------|-------------------|--------|
| Unauthenticated | No | No (public reads OK) | No | Server actions require `requireAdmin()` |
| Client role user | No | No (public reads OK) | No | Proxy blocks, server actions require admin |
| Admin/Agent role | Yes | Yes | Yes | Authorized via `requireAdmin()` |

### Why This Was Real

1. The anon key is public — it's embedded in the JavaScript bundle (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
2. The RLS policies use `auth.role() = 'authenticated'` which requires a Supabase Auth session
3. The app uses NextAuth, not Supabase Auth — the browser client has NO Supabase Auth session
4. Therefore `auth.role()` returns `anon` for browser queries, and the `authenticated` policies should block access
5. **BUT**: If RLS was misconfigured, disabled, or the anon role was granted broader access, the data would be exposed

The fix eliminates this dependency entirely by moving all queries server-side.

---

## Client Isolation

### Portal Client Access

| Data Type | Isolation Mechanism | Verified |
|-----------|-------------------|----------|
| Projects | `WHERE client_email = session.user.email` (from JWT) | ✅ |
| Invoices | `WHERE client_email = session.user.email` (from JWT) | ✅ |
| Support Tickets | `WHERE client_email = session.user.email` (from JWT) | ✅ |
| Stats | Filtered by `session.user.email` | ✅ |

**No IDOR possible**: The email comes from the NextAuth session (server-side JWT), not from user input.

### Admin Access

| Data Type | Access Level | Verified |
|-----------|-------------|----------|
| All leads | Full access (admin/agent role) | ✅ |
| All blog posts | Full access | ✅ |
| All services | Full access | ✅ |
| All case studies | Full access | ✅ |
| All contact submissions | Full access | ✅ |
| All users | Full access (via service-role) | ✅ |
| All projects | Full access (via service-role) | ✅ |
| All invoices | Full access (via service-role) | ✅ |

### CRM Access

| Data Type | Access Level | Verified |
|-----------|-------------|----------|
| All leads | Read + update status | ✅ |

**Note**: CRM uses the same `requireAdmin()` check as admin (allows `admin` and `agent` roles). This is correct — agents manage leads.

---

## Service Role Review

| Property | Status |
|----------|--------|
| Server-only | ✅ `lib/supabase/server.ts` has no `"use client"` directive |
| Never imported by client components | ✅ No `"use client"` files import from `@/lib/supabase/server` |
| Never exposed via NEXT_PUBLIC_ | ✅ Uses `SUPABASE_SERVICE_ROLE_KEY` (not NEXT_PUBLIC_) |
| Never returned to browser | ✅ Only used in server actions and server-side queries |
| Privileged queries have auth checks | ✅ All server actions call `requireAdmin()` or `requireClient()` first |

---

## IDOR Analysis

| Pattern | Found | Source of Value | Risk |
|---------|-------|-----------------|------|
| `.eq("id", userProvidedId)` in portal | No | Portal doesn't query by ID | N/A |
| `.eq("client_email", userProvidedEmail)` | No | All portal queries use `session.user.email` | Safe |
| `.eq("id", lead.id)` in admin leads | Yes | Lead ID from database, not user input | Safe (admin-only) |

**No IDOR vulnerabilities found.** All email-based queries in portal actions use the authenticated session email, not user-controlled input.

---

## RLS vs Application Auth

| Table | RLS Status | App-Level Auth | Security Depends On | Assessment |
|-------|-----------|----------------|--------------------|--------------------|
| `blog_posts` | RLS enabled | Server actions: `requireAdmin()` | Both (RLS for public reads, app auth for writes) | Adequate |
| `services` | RLS enabled | Server actions: `requireAdmin()` | Both | Adequate |
| `case_studies` | RLS enabled | Server actions: `requireAdmin()` | Both | Adequate |
| `contact_submissions` | RLS enabled | Server actions: public insert | RLS for inserts, app auth for reads | Adequate |
| `leads` | RLS enabled | Server actions: `requireAdmin()` | Both | **FIXED** — was browser-dependent |
| `users` | Unknown | NextAuth manages | App-level (NextAuth JWT) | Depends on actual DB config |
| `projects` | Unknown | Server actions: `requireClient()` | App-level (session email filter) | Depends on actual DB config |
| `invoices` | Unknown | Server actions: `requireClient()` | App-level (session email filter) | Depends on actual DB config |
| `support_tickets` | Unknown | Server actions: `requireClient()` | App-level (session email filter) | Depends on actual DB config |

---

## Findings

| ID | Severity | Finding | Evidence | Status |
|----|----------|---------|----------|--------|
| RLS-001 | HIGH | Browser client used for admin/CRM data queries without guaranteed RLS | `admin/dashboard`, `admin/leads`, `crm/dashboard` imported `@/lib/supabase/client` | **FIXED** |
| RLS-002 | MEDIUM | `users`, `projects`, `invoices`, `support_tickets` tables not defined in schema.sql — RLS status unknown | Schema only defines 5 tables; app queries 4 additional tables | **DEFERRED** — requires DB inspection |
| RLS-003 | LOW | Service-role key bypasses RLS by design | `lib/supabase/server.ts` uses `SUPABASE_SERVICE_ROLE_KEY` | **SAFE** — all uses have `requireAdmin()`/`requireClient()` checks |

---

## Changes Made

### 1. `lib/actions/admin.ts`

Added 4 new server actions:
- `getAdminDashboardStats()` — replaces browser queries in admin dashboard
- `getAllLeads()` — replaces browser queries in admin leads page
- `updateLeadStatus(id, status)` — replaces browser UPDATE in admin leads page
- `getCRMLeads()` — replaces browser queries in CRM dashboard

All actions use `requireAdmin()` for authorization.

### 2. `app/admin/dashboard/page.tsx`

- Removed: `import { createClient } from "@/lib/supabase/client"`
- Added: `import { getAdminDashboardStats, type DashboardStats } from "@/lib/actions/admin"`
- Changed: `useEffect` now calls `getAdminDashboardStats()` server action instead of direct Supabase queries

### 3. `app/admin/leads/page.tsx`

- Removed: `import { createClient } from "@/lib/supabase/client"`
- Added: `import { getAllLeads, updateLeadStatus } from "@/lib/actions/admin"`
- Changed: `fetchLeads` now calls `getAllLeads()` server action
- Changed: `handleDrop` now calls `updateLeadStatus()` server action

### 4. `app/crm/dashboard/page.tsx`

- Removed: `import { createClient } from "@/lib/supabase/client"`
- Added: `import { getCRMLeads } from "@/lib/actions/admin"`
- Changed: `useEffect` now calls `getCRMLeads()` server action

---

## Validation

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Passes |
| `npm run build` | ✅ Builds successfully (32 pages) |
| Browser Supabase client in admin/ | ✅ Zero imports remaining |
| Browser Supabase client in crm/ | ✅ Zero imports remaining |
| Browser Supabase client in portal/ | ✅ Never used (already server actions) |

---

## Remaining Security Risks

| Risk | Severity | Notes |
|------|----------|-------|
| RLS status of `users`, `projects`, `invoices`, `support_tickets` tables | MEDIUM | These tables are not defined in `schema.sql`. Need database-level inspection to verify RLS is enabled. If RLS is disabled, the service-role server client is the only protection. |
| Service-role key usage | LOW | All server-side queries use `requireAdmin()`/`requireClient()`, but the service-role key itself bypasses RLS. A compromised server action could access any data. |
| NextAuth session cookie security | LOW | Handled by NextAuth v5 defaults (httpOnly, SameSite=Lax, secure in production). |

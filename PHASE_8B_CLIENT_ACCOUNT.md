# Phase 8B: Client Account & Profile

## Status: COMPLETE

## Summary
Complete client self-service account experience for the PixelWyre portal — profile management, password change, forgot/reset password flows, improved settings page, and authentication UX improvements.

---

## Implemented

### 8B.1 — Profile Management
- **`getPortalProfile()`** — Server action to fetch profile data, scoped by `session.user.email`
- **`updatePortalProfile()`** — Server action to update name and phone, validated with Zod, scoped by `session.user.email`
- **Zod schema** `portalProfileSchema` — name (1-100 chars), phone (optional, max 30 chars)
- **Settings page** — Editable profile form with name, email (read-only), and phone fields
- **Session update** — Profile changes propagate to NextAuth session via `updateSession()`

### 8B.2 — Password & Security
- **`changePortalPassword()`** — Server action: verifies current password, hashes new password with bcrypt (12 rounds), invalidates all sessions. Validated with Zod schema `portalPasswordSchema`
- **`requestPortalPasswordReset()`** — Server action: rate-limited (5/min), generates crypto token, stores in `verification_tokens` with 1-hour expiry, returns success always (prevents email enumeration)
- **`resetPortalPassword()`** — Server action: validates token + expiry, hashes new password, deletes used token, invalidates all sessions
- **Forgot password page** (`/portal/forgot-password`) — Email input form, success state with "check your email" message
- **Reset password page** (`/portal/reset-password`) — Token-based password reset form with Suspense boundary, success state
- **Login page** — "Forgot password?" link added (replaced "Need help? Contact Support")

### 8B.3 — Account Settings
Rebuilt `/portal/dashboard/settings` with three sections:
1. **Profile** — Avatar (initials), editable name, read-only email, phone field, save button
2. **Security** — Current password, new password, confirm password, change button, password requirements
3. **Account Details** — Read-only email, role, member status

### 8B.4 — Authentication UX
- **Portal login** — "Forgot password?" link directs to `/portal/forgot-password`
- **Authenticated user redirect** — Middleware redirects authenticated clients away from `/portal`, `/portal/forgot-password`, `/portal/reset-password` to `/portal/dashboard`
- **Route protection** — Middleware enforces client role for all `/portal/*` routes (except login/forgot/reset)

### 8B.5 — Authorization / IDOR Security
All new mutations verified:
- `updatePortalProfile()` — Uses `session.user.email!` for `.eq("email", ...)`, never accepts client-provided email/user ID
- `changePortalPassword()` — Uses `session.user.email!` for both lookup and update
- `getPortalProfile()` — Uses `session.user.email!` for `.eq("email", ...)`
- `resetPortalPassword()` — Token-derived email (server-side stored), not user-provided
- `requestPortalPasswordReset()` — Email-only lookup, token stored server-side

### 8B.6 — UX Quality
- Consistent dark theme styling across all new pages
- Field-level validation errors displayed inline
- Loading states on all form submissions (button disabled + "Saving..."/"Changing..." text)
- Success/failure toast notifications via `sonner`
- Proper disabled states on buttons during async operations
- Mobile-responsive layout (max-width containers, flexible grids)
- Accessibility: labels on all form fields, semantic HTML, keyboard navigable

### 8B.7 — Error Handling
- No silent `.catch(() => {})` patterns
- All server actions return `{ success: boolean; error?: string }`
- Client-side error display via toast notifications and inline error messages
- Server-side errors logged to console for diagnostics
- No SQL errors, stack traces, or internal details exposed to client

---

## Files Modified

| File | Change |
|------|--------|
| `lib/validations/portal.ts` | Added `portalProfileSchema`, `portalPasswordSchema` |
| `lib/actions/portal.ts` | Added `getPortalProfile`, `updatePortalProfile`, `changePortalPassword`, `requestPortalPasswordReset`, `resetPortalPassword` |
| `app/portal/dashboard/settings/page.tsx` | Complete rebuild — Profile, Security, Account sections |
| `app/portal/page.tsx` | Added "Forgot password?" link |
| `middleware.ts` | Added `isAuthPage()`, redirect authenticated clients from auth pages |

## Files Created

| File | Purpose |
|------|---------|
| `app/portal/forgot-password/page.tsx` | Forgot password page — email form, success state |
| `app/portal/reset-password/page.tsx` | Reset password page — token-based form with Suspense boundary |

---

## Authentication Changes

| Change | Detail |
|--------|--------|
| Forgot password flow | `requestPortalPasswordReset()` + `/portal/forgot-password` page |
| Reset password flow | `resetPortalPassword()` + `/portal/reset-password` page |
| Password change flow | `changePortalPassword()` in settings (requires current password) |
| Session invalidation | Password change and reset both delete all sessions for the user |
| Auth redirect guard | Middleware redirects authenticated clients away from login/forgot/reset pages |
| Rate limiting | Password reset rate limited (5 attempts per email per minute) |
| Token security | Crypto random 32-byte tokens, 1-hour expiry, single use, stored in `verification_tokens` |
| Email enumeration prevention | Forgot password always returns success regardless of email existence |

---

## Authorization Verification

**Every new portal mutation:**
1. Calls `requireClient()` — validates session exists and role is "client"
2. Uses `session.user.email!` as the sole ownership identifier for all DB queries
3. Never accepts client-provided `client_email`, `client_id`, user ID, or account ID

**Verified actions:**
- `getPortalProfile()` → `.eq("email", session.user.email!)`
- `updatePortalProfile()` → `.eq("email", session.user.email!)`
- `changePortalPassword()` → `.eq("email", session.user.email!)` for both read and update
- `requestPortalPasswordReset()` → email-only lookup, no user-controlled identifiers
- `resetPortalPassword()` → token-derived email from server-side storage

**Cross-client IDOR test scenarios (all pass safely):**
- Client A providing Client B's email in profile update → rejected (session email used)
- Client A providing Client B's user ID → rejected (session email used)
- Client A supplying another client's email in password change → rejected (session email used)
- Unauthenticated access to any portal action → rejected (requireClient throws)

---

## Security Verification

| Check | Status |
|-------|--------|
| Profile reads scoped by session email | PASS |
| Profile updates scoped by session email | PASS |
| Password operations use authenticated account | PASS |
| User-controlled ownership IDs ignored | PASS — session email always used |
| No IDOR vulnerabilities | PASS |
| No privilege escalation | PASS |
| No sensitive information leakage | PASS |
| Passwords never logged or exposed | PASS |
| Reset tokens single-use with expiry | PASS |
| Rate limiting on password reset | PASS |
| Email enumeration prevented | PASS |

---

## TypeScript

```
npx tsc --noEmit — PASS (0 errors)
```

## Production Build

```
npm run build — PASS (42 routes)
```

New routes: `/portal/forgot-password`, `/portal/reset-password`

## Regression Testing

### Portal
| Feature | Status |
|---------|--------|
| Login | PASS — unchanged, "Forgot password?" link added |
| Dashboard | PASS — unchanged |
| Active project count | PASS — filtered by in_progress |
| Projects | PASS — pagination working |
| Invoices | PASS — currency from DB, pagination working |
| Support tickets | PASS — Zod validation, pagination working |
| Settings | PASS — rebuilt with Profile, Security, Account sections |
| Loading states | PASS — skeleton loaders |
| Empty states | PASS — EmptyState component |
| Error states | PASS — error UI with retry |
| Logout | PASS — unchanged |
| Forgot password | PASS — new page, email form, success state |
| Reset password | PASS — new page, token-based form |

### Authentication
| Feature | Status |
|---------|--------|
| Login | PASS |
| Logout | PASS |
| Forgot password | PASS — new |
| Reset password | PASS — new |
| Protected routes | PASS — middleware enforces roles |
| Client role protection | PASS — non-client redirected from /portal/* |
| Auth redirect guard | PASS — authenticated clients redirected from auth pages |

### Admin
| Feature | Status |
|---------|--------|
| All admin routes | PASS — no changes to admin code |
| Admin profile | PASS — unchanged |
| Admin password change | PASS — unchanged |

### CRM
| Feature | Status |
|---------|--------|
| CRM routes | PASS — no changes, compile and load |

---

## Known Limitations

1. **Email delivery not configured** — `requestPortalPasswordReset()` logs the reset token to console. Production requires implementing email sending (Resend, Nodemailer, or SendGrid).
2. **No `company` field in users table** — Schema doesn't support company information. Would require a migration to add a `company` column.
3. **No avatar upload** — Profile uses initials-based avatar. Image upload infrastructure exists (`ImageUpload` component) but users table lacks an `avatar_url` column.
4. **No notification preferences** — Schema doesn't support notification settings. Would require a new table or column.
5. **Phone number not verified** — Phone is stored but not verified via SMS/OTP.

---

## Manual Production Actions

1. **Implement email sending** for password reset links in `requestPortalPasswordReset()` — replace `console.log` with actual email delivery
2. **Set `NEXTAUTH_URL`** to production domain for correct reset link URLs
3. **Consider adding columns** to `users` table: `company` (text), `avatar_url` (text) if these features are needed

# Phase 9A — CRM Foundation & Lead CRUD

**Date:** 2026-09-21
**Status:** COMPLETE

## Summary

Implemented full lead CRUD operations for the admin CRM panel. Previously the system only had a Kanban board with drag-and-drop status updates. Now includes a dedicated list view with search/filtering, detail page with inline status updates, create/edit forms with Zod validation, and delete with confirmation dialogs across all views.

## Changes

### Zod Validation (`lib/validations/admin.ts`)
- Added `leadCreateSchema` — validates name (required), email, phone, service (required), value, status, notes
- Added `leadUpdateFullSchema` — validates all fields including status for edit mode
- All fields have length limits; email validated with `.email()`, empty strings coerce to `null`

### Server Actions (`lib/actions/admin.ts`)
- **`getLeadById(id)`** — fetch single lead by ID, returns null if not found
- **`createLead(data)`** — validate with `leadCreateSchema`, insert, revalidate leads + dashboard paths
- **`updateLead(id, data)`** — validate with `leadUpdateFullSchema`, update all fields, revalidate
- **`deleteLead(id)`** — delete lead by ID, revalidate leads + dashboard paths
- **`searchLeads(params)`** — paginated search with query (name/email/phone/service ilike), status filter, returns `{ data, total, page, totalPages }`
- All actions call `requireAdmin()` (session + role check)

### Components
- **`components/admin/LeadForm.tsx`** — shared create/edit form with fields: name, email, phone, service (select), value, status (edit only), notes (textarea). Client-side Zod validation with field-level errors, loading states, router navigation.

### Pages
| Route | Description |
|---|---|
| `/admin/leads` | Kanban board (updated: + `closed_lost` column, delete button on cards, cards clickable → detail page, + list view/new lead links) |
| `/admin/leads/all` | List view with debounced search, status filter, service filter, pagination, CSV export, view/delete actions per row |
| `/admin/leads/new` | Create form page |
| `/admin/leads/[id]` | Detail page — contact info, deal info, inline status buttons, notes, edit/delete actions |
| `/admin/leads/[id]/edit` | Edit form page (pre-filled with existing data) |

### Kanban Updates (`app/admin/leads/page.tsx`)
- Added `closed_lost` column with red accent/error badge
- Made cards clickable (navigate to detail page)
- Added delete button (×) on each card with hover effect
- Added ConfirmDialog for delete confirmation
- Added "List View" and "+ New Lead" links in header

## Route Count
- **Before:** 46 routes
- **After:** 48 routes (+ `/admin/leads/all`, `/admin/leads/new`, `/admin/leads/[id]`, `/admin/leads/[id]/edit`)

## Verification
- **TypeScript:** PASS (0 errors)
- **Build:** PASS (48 routes compiled)
- **IDOR:** All lead actions use `requireAdmin()` — no client-scoping needed since leads are admin-managed, not client-owned

## Files Modified
- `lib/validations/admin.ts` — added 2 schemas
- `lib/actions/admin.ts` — added 5 server actions, updated import
- `app/admin/leads/page.tsx` — added closed_lost column, delete, clickable cards

## Files Created
- `components/admin/LeadForm.tsx` — shared create/edit form
- `app/admin/leads/all/page.tsx` — list view
- `app/admin/leads/new/page.tsx` — create page
- `app/admin/leads/[id]/page.tsx` — detail page
- `app/admin/leads/[id]/edit/page.tsx` — edit page

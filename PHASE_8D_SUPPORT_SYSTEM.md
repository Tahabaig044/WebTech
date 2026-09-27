# Phase 8D: Client Support System

## Status: COMPLETE

## Summary
Complete client support ticket system for the PixelWyre portal — stable ticket numbers, dedicated ticket detail page with conversation thread, reply functionality, internal notes security, and IDOR protection.

---

## Implemented

### 8D.1 — Stable Ticket Numbers
- **Migration**: Added `ticket_number` column to `support_tickets` table (text, NOT NULL, unique)
- **Sequence**: `ticket_number_seq` PostgreSQL sequence generates `PW-000001`, `PW-000002`, etc.
- **Backfill**: All 3 existing tickets assigned stable numbers based on `created_at` order
- **Display**: Support list now shows `PW-000001` instead of fake `TK-{i+1}` that reset on each page load

### 8D.2 — Ticket Messages Table
- **New table**: `ticket_messages` with columns:
  - `id` (uuid, PK)
  - `ticket_id` (uuid, FK → support_tickets, ON DELETE CASCADE)
  - `sender_email` (text)
  - `sender_role` (text, CHECK: 'client' | 'agent' | 'admin')
  - `message` (text)
  - `is_internal_note` (boolean, default false)
  - `created_at` (timestamptz)
- **Index**: `idx_ticket_messages_ticket_id` for fast lookups
- **RLS**: Disabled (service-role key, consistent with all other tables)

### 8D.3 — Server Actions
Three new server actions added to `lib/actions/portal.ts`:

| Action | Purpose | Security |
|--------|---------|----------|
| `getPortalTicketById(id)` | Fetch single ticket detail | Dual filter: `id` + `client_email` |
| `getPortalTicketMessages(ticketId)` | Fetch conversation messages | Ownership verified before query; internal notes filtered out |
| `replyToTicket(ticketId, { message })` | Add client reply to ticket | Ownership verified; `sender_role` hardcoded to `"client"`; `is_internal_note` hardcoded to `false` |

### 8D.4 — Ticket Detail Page
- **Route**: `/portal/dashboard/support/[id]`
- **Conversation thread**: Shows original ticket message + all non-internal replies
- **Reply form**: Textarea with send button; disabled when ticket is closed
- **Sidebar**: Status, priority, ticket number, created/updated dates
- **Auto-scroll**: Conversation scrolls to latest message
- **Loading state**: Skeleton UI during data fetch
- **Error state**: Professional "Ticket not found" with back link
- **Responsive**: Two-column grid collapses to single column on mobile

### 8D.5 — Support List Improvements
- **Stable ticket numbers**: `ticket_number` from database instead of fake `TK-{i+1}`
- **Clickable rows**: Each row is a `<Link>` to `/portal/dashboard/support/[id]`
- **Removed inline expansion**: Ticket detail is now a dedicated page (cleaner UX)
- **Hover effect**: CSS transition on row background

### 8D.6 — Validation
- **New schema**: `ticketReplySchema` in `lib/validations/portal.ts` — message 1-5000 chars
- **Reply validation**: Server-side Zod validation before insert

---

## Security Verification

### Internal Notes
| Check | Status |
|-------|--------|
| Internal notes filtered from client queries | PASS — `.eq("is_internal_note", false)` in `getPortalTicketMessages()` |
| Client cannot set `is_internal_note: true` | PASS — hardcoded to `false` in `replyToTicket()` |
| Client cannot set `sender_role: "admin"` | PASS — hardcoded to `"client"` in `replyToTicket()` |

### IDOR Protection
| Test | Scenario | Expected | Actual |
|------|----------|----------|--------|
| 1 | Client A requests Client B's ticket by ID | NOT FOUND | PASS — `client_email` filter rejects |
| 2 | Client A sends reply to Client B's ticket | REJECTED | PASS — ownership check fails |
| 3 | Client A views Client B's ticket messages | EMPTY | PASS — ownership check returns empty |
| 4 | Unauthenticated access to any action | AUTH REQUIRED | PASS — `requireClient()` throws |
| 5 | Non-client role access | DENIED | PASS — `requireClient()` checks role |

---

## Database Changes

### New Column: `support_tickets.ticket_number`
| Property | Value |
|----------|-------|
| Type | text |
| Nullable | NOT NULL |
| Default | `PW-` + 6-digit sequence |
| Unique | Yes (constraint: `support_tickets_ticket_number_unique`) |
| Backfilled | 3 existing tickets (PW-000001 through PW-000003) |

### New Table: `ticket_messages`
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | uuid | NO | PK, gen_random_uuid() |
| `ticket_id` | uuid | NO | FK → support_tickets(id) CASCADE |
| `sender_email` | text | NO | Email of sender |
| `sender_role` | text | NO | CHECK: client/agent/admin |
| `message` | text | NO | Message content |
| `is_internal_note` | boolean | NO | Default false |
| `created_at` | timestamptz | YES | Default now() |

### New Sequence: `ticket_number_seq`
- Start: 1 (auto-increments on each new ticket)
- Current value: 3 (matches 3 existing tickets)

---

## Files Modified

| File | Change |
|------|--------|
| `lib/types/index.ts` | Added `ticket_number` to `SupportTicket`, added `TicketMessage` type |
| `lib/validations/portal.ts` | Added `ticketReplySchema` and `TicketReplyInput` type |
| `lib/actions/portal.ts` | Added `getPortalTicketById`, `getPortalTicketMessages`, `replyToTicket`; updated `getPortalTickets` select to include `ticket_number` |
| `app/portal/dashboard/support/page.tsx` | Replaced fake ticket numbers with stable `ticket_number`, made rows clickable Links, removed inline expansion |

## Files Created

| File | Purpose |
|------|---------|
| `app/portal/dashboard/support/[id]/page.tsx` | Ticket detail page with conversation thread and reply form |

---

## TypeScript

```
npx tsc --noEmit — PASS (0 errors)
```

## Production Build

```
npm run build — PASS (45 routes)
```

New route: `/portal/dashboard/support/[id]`

---

## Regression Testing

### Portal
| Feature | Status |
|---------|--------|
| Login | PASS |
| Dashboard | PASS |
| Projects list | PASS |
| Project detail | PASS |
| Invoices | PASS |
| Support list | PASS — stable ticket numbers, clickable rows |
| Ticket detail | PASS — new page |
| Reply to ticket | PASS — new feature |
| Settings | PASS |
| Profile editing | PASS |
| Password change | PASS |
| Forgot password | PASS |
| Reset password | PASS |
| Logout | PASS |

### Security
| Check | Status |
|-------|--------|
| Client ownership enforced | PASS — dual filter (id + client_email) |
| Internal notes hidden from clients | PASS — is_internal_note=false filter |
| Client cannot impersonate staff | PASS — sender_role hardcoded |
| Client cannot create internal notes | PASS — is_internal_note hardcoded |
| Cross-client ticket access | PASS — returns "not found" |
| Non-client portal access | PASS — middleware blocks |
| Unauthenticated access | PASS — requireClient() throws |

### Admin
| Feature | Status |
|---------|--------|
| All admin routes | PASS — no changes to admin code |

### CRM
| Feature | Status |
|---------|--------|
| CRM routes | PASS — no changes, compile and load |

---

## Known Limitations

1. **No file attachments** — No storage buckets exist. Attachment support would require creating a Supabase Storage bucket and an `attachment` column or separate `ticket_attachments` table.
2. **No admin/agent reply interface** — Staff cannot reply to tickets through the portal. An admin support inbox would be needed.
3. **No email notifications** — Clients are not notified of staff replies. Would require email sending integration.
4. **No ticket status transitions** — Clients cannot reopen or close tickets. Status changes are only possible through admin.
5. **No ticket search** — Clients cannot search tickets by subject or number. Would require full-text search or a simple ILIKE filter.
6. **No ticket categories/tags** — Tickets have no categorization beyond priority. Would require schema changes.

---

## Manual Production Actions

1. **Backfill sequence**: `SELECT setval('ticket_number_seq', (SELECT COUNT(*) FROM support_tickets));` — run if tickets were created outside the app
2. **Create storage bucket** (optional): If file attachments are desired, create a `ticket-attachments` bucket in Supabase Storage with appropriate RLS policies
3. **Implement email notifications** (optional): Add email sending for new replies in `replyToTicket()` action

---

## Migration Applied

```
Name: add_ticket_messages_and_number
Status: Applied successfully
Changes:
  - ALTER TABLE support_tickets ADD COLUMN ticket_number text
  - CREATE SEQUENCE ticket_number_seq START 1
  - UPDATE support_tickets SET ticket_number = 'PW-' || LPAD(...)
  - ALTER TABLE support_tickets ALTER COLUMN ticket_number SET DEFAULT ...
  - ALTER TABLE support_tickets ALTER COLUMN ticket_number SET NOT NULL
  - ALTER TABLE support_tickets ADD CONSTRAINT ... UNIQUE (ticket_number)
  - CREATE TABLE ticket_messages (...)
  - CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id)
  - ALTER TABLE ticket_messages DISABLE ROW LEVEL SECURITY
```

# Phase 9C — Lead Conversion & CRM Workflow

**Status:** COMPLETE

## Database Changes
- `leads.converted_client_id` — nullable UUID FK to users(id)

## Implemented

### Lead Conversion
- `Convert to Client` button on lead detail page (requires lead email)
- Confirmation dialog before conversion
- Creates a `users` row with `role: "client"` using lead name/email
- If user with same email already exists, links to existing user instead
- Prevents duplicate conversion (button disabled when already converted)
- Records `lead.converted` activity
- After conversion: shows "Converted" badge + "View Client" link

### UI Updates
- **Lead detail**: New "Conversion" section showing status, convert button, or converted state with client link
- **Kanban cards**: Small "CVT" badge on converted leads
- **List view**: "Converted" badge next to lead name
- **Client list side panel**: Shows "Source: Lead: [name] →" link when client originated from a lead conversion

### Server Actions
- `convertLeadToClient(leadId)` — validates lead exists, not already converted, has email; creates/links user; logs activity
- `getLeadForClient(clientEmail)` — finds lead by converted_client_id for display in client list

## Verification
- TypeScript: PASS (0 errors)
- Build: PASS (48 routes)
- All existing functionality preserved (CRUD, Kanban, search, filters, pagination, CSV, assignment, follow-ups, activity, status changes)

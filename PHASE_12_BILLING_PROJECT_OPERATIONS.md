# Phase 12 — Billing & Project Operations

**Status:** COMPLETE

## Implementation

### DB Migration
- Added `project_id UUID REFERENCES projects(id) ON DELETE SET NULL` to invoices table
- Added index on `invoices.project_id`

### Project Management (Admin)
- **Pages**: `/admin/projects` (list with status filter, pagination), `/admin/projects/new`, `/admin/projects/[id]` (detail), `/admin/projects/[id]/edit`
- **Components**: `ProjectForm.tsx` (create/edit with name, client email, category, status, progress slider, description)
- **Server actions**: `getAdminProjects`, `getProjectById`, `createProject`, `updateProject`, `deleteProject`
- **Sidebar**: Added "Projects" nav link with folder icon

### Invoice Management (Admin)
- **Invoice detail page**: `/admin/invoices/[id]` — shows invoice details, payment summary, linked project, and payment history
- **InvoiceForm**: Added project dropdown (auto-loaded from admin projects)
- **Invoice list**: Rows are now clickable, linking to detail page
- **Server actions updated**: `createInvoice` and `updateInvoice` accept `project_id`; validates project exists if provided

### Payment Management (Admin)
- **Payment recording**: Inline form on invoice detail page — amount, date, method, receipt number, reference, notes
- **Payment deletion**: With confirmation dialog
- **Auto-status update**: Recording a payment sets invoice to "pending" if it was "draft"
- **Server actions**: `getAdminInvoicePayments`, `createPayment`, `deletePayment`

### Invoice ↔ Project Relationship
- `invoices.project_id` FK added — links invoice to a project
- Project dropdown on invoice form
- Project link shown on invoice detail page

### Portal
- Portal invoice queries updated to include `project_id` field
- All portal behavior preserved — scoped by authenticated client via `requireClient()`

## DB Changes
- `invoices.project_id UUID REFERENCES projects(id) ON DELETE SET NULL`
- Index: `idx_invoices_project_id`

## Files Modified
- `lib/actions/admin.ts` — project CRUD, payment CRUD, updated invoice actions
- `lib/actions/portal.ts` — updated invoice select queries to include `project_id`
- `lib/types/index.ts` — `ProjectInsert` type, `project_id` on `Invoice` and `AdminInvoice`
- `lib/validations/admin.ts` — `projectSchema`, `paymentSchema`, updated `invoiceSchema`
- `components/admin/InvoiceForm.tsx` — project dropdown
- `components/admin/ProjectForm.tsx` — new component
- `app/admin/layout.tsx` — Projects nav link
- `app/admin/invoices/page.tsx` — clickable rows
- `app/admin/invoices/[id]/page.tsx` — new admin invoice detail page
- `app/admin/projects/page.tsx` — new project list page
- `app/admin/projects/new/page.tsx` — new project create page
- `app/admin/projects/[id]/page.tsx` — new project detail page
- `app/admin/projects/[id]/edit/page.tsx` — new project edit page

## Verification
- TypeScript: PASS (0 errors)
- Build: PASS (46 routes, +2 from Phase 11)

## Limitations
- No payment gateway integration (manual recording only)
- No accounting/reconciliation features
- No invoice PDF generation beyond browser print
- Invoice list doesn't show project name (would need join query)
- Portal invoice detail doesn't show linked project name

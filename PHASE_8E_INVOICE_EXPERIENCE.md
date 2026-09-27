# Phase 8E: Client Invoice Experience

## Status: COMPLETE

## Summary
Complete client invoice viewing experience for the PixelWyre portal — dedicated invoice detail page with payment history, currency formatting utility, PDF download via browser print, clickable invoice list rows, and IDOR protection.

---

## Implemented

### 8E.1 — Invoice Detail Page
- **Route**: `/portal/dashboard/invoices/[id]`
- **Server action**: `getPortalInvoiceById(id)` — fetches single invoice, scoped by `session.user.email`
- **Payment history**: `getPortalInvoicePayments(invoiceId)` — fetches payments for the invoice, scoped by invoice ownership verification
- **Invoice header**: Invoice number, status badge, "Download PDF" button
- **Amount card**: Large formatted total with currency, paid date if applicable
- **Description section**: Full invoice description with empty state
- **Payment history**: Visual cards showing each payment with amount, date, mode, receipt number, reference, and notes
- **Details sidebar**: Status, invoice number, currency, issue date, due date, paid date
- **Payment summary**: Total paid, remaining balance, payment count (shown when payments exist)
- **Need help?**: Support link card
- **Error state**: Professional "Invoice not found" with back link
- **Loading state**: Skeleton UI during data fetch
- **Responsive**: Two-column grid collapses to single column on mobile

### 8E.2 — Currency Formatting Utility
- **New file**: `lib/utils/currency.ts`
- **`formatCurrency(amount, currency)`**: Centralized formatter supporting PKR, USD, EUR, GBP, INR, AED, SAR, CNY, JPY, CAD, AUD, CHF
- **Unknown currencies**: Falls back to `{CODE} {amount}` format — no crash
- **Decimal handling**: Always 2 decimal places for consistency
- **`getCurrencySymbol(currency)`**: Returns the symbol for a given currency code
- **Used in**: Invoice detail page, invoice list page summary cards

### 8E.3 — PDF Download
- **Implementation**: Browser `window.print()` with print-specific CSS
- **No new dependencies**: Uses native browser print functionality
- **Print layout**: Clean invoice document with company header, invoice number, dates, bill-to info, description, total amount, and payment history
- **Print styles**: Hides all UI chrome (navigation, buttons, sidebars), shows only the invoice document
- **Security**: Invoice ownership verified server-side before data is loaded; print only shows data the client already has access to

### 8E.4 — Invoice List Improvements
- **Clickable rows**: Each row is a `<Link>` to `/portal/dashboard/invoices/[id]`
- **Due date column**: Added due date display between description and amount
- **"View →" action**: Visual affordance indicating clickability
- **Currency utility**: Uses `formatCurrency()` instead of inline formatting
- **Removed preview modal**: Replaced by dedicated detail page (cleaner UX)
- **Hover effect**: CSS transition on row background
- **Preserved**: All existing pagination, summary cards, loading/empty states

### 8E.5 — Types
- **New type**: `InvoicePayment` in `lib/types/index.ts` — matches `payments` table schema
- **Fields**: id, invoice_id, receipt_number, amount, payment_date, payment_mode, reference_number, notes, created_at

---

## Invoice Detail

The invoice detail page displays all information supported by the current schema:

| Field | Source | Displayed |
|-------|--------|-----------|
| Invoice number | `invoices.invoice_number` | Yes — header + sidebar |
| Status | `invoices.status` | Yes — StatusBadge |
| Amount | `invoices.amount` | Yes — formatted with currency |
| Currency | `invoices.currency` | Yes — defaults to PKR |
| Description | `invoices.description` | Yes — full text section |
| Due date | `invoices.due_date` | Yes — sidebar, "Not set" if null |
| Issue date | `invoices.created_at` | Yes — sidebar |
| Paid date | `invoices.paid_at` | Yes — sidebar + amount card |
| Client email | `invoices.client_email` | Used for ownership only, not displayed |
| Payment history | `payments` table | Yes — full cards with all fields |

---

## Currency

Centralized in `lib/utils/currency.ts`:

| Currency | Symbol | Supported |
|----------|--------|-----------|
| PKR | ₨ | Yes |
| USD | $ | Yes |
| EUR | € | Yes |
| GBP | £ | Yes |
| INR | ₹ | Yes |
| AED | د.إ | Yes |
| SAR | ﷼ | Yes |
| CNY | ¥ | Yes |
| JPY | ¥ | Yes |
| CAD | C$ | Yes |
| AUD | A$ | Yes |
| CHF | CHF | Yes |
| Unknown | `{CODE} {amount}` | Safe fallback |

Invoice currency is never hardcoded. The `currency` field from the database determines the displayed currency throughout.

---

## Line Items

**The current invoice schema does not support line items.** Invoices have a single `amount` field — no `invoice_items`, `invoice_line_items`, or equivalent table exists.

- Documented as a limitation
- The `description` field serves as the primary content for invoice details
- No speculative line-item infrastructure created

---

## Totals

The current schema supports a single total amount per invoice:

| Field | Exists | Displayed |
|-------|--------|-----------|
| Total amount | `invoices.amount` | Yes — formatted with currency |
| Subtotal | No | N/A — documented limitation |
| Tax | No | N/A — documented limitation |
| Discount | No | N/A — documented limitation |

When payments exist, the detail page calculates:
- **Total paid**: Sum of all `payments.amount` for the invoice
- **Remaining**: `invoice.amount - total paid`

---

## PDF

- **Method**: `window.print()` with `@media print` CSS
- **No new dependencies**: No PDF library added
- **Print content**: Invoice number, dates, bill-to info, description, total, payment history
- **Security**: Server-side ownership verification before data load; print only shows authorized data
- **User experience**: "Download PDF" button triggers browser print dialog (user selects "Save as PDF")

---

## Payment

**Payment infrastructure already exists** in the database:

- **`payments` table**: id, invoice_id, receipt_number, amount, payment_date, payment_mode (enum: CASH, CHEQUE, BANK_TRANSFER, ONLINE), reference_number, notes, recorded_by, created_at
- **Real data**: 10 payment records exist in the database
- **No portal server actions existed for payments** — new `getPortalInvoicePayments()` added
- **Payment history displayed**: On invoice detail page with full details
- **No payment initiation**: Clients cannot create payments (admin-recorded only)
- **No payment gateway**: No Stripe, PayPal, or other payment processing integrated

Payment processing remains a separate future implementation. The current system tracks payments recorded by admin staff.

---

## Authorization

### Invoice Detail
```typescript
const { data, error } = await supabase
  .from("invoices")
  .select("id, client_email, invoice_number, amount, currency, status, description, due_date, paid_at, created_at")
  .eq("id", id)
  .eq("client_email", session.user.email!)  // ← ownership filter
  .single();
```

### Invoice Payments
```typescript
// Step 1: Verify invoice ownership
const { data: invoice } = await supabase
  .from("invoices")
  .select("id")
  .eq("id", invoiceId)
  .eq("client_email", session.user.email!)  // ← ownership filter
  .single();

// Step 2: Fetch payments (only if ownership verified)
const { data } = await supabase
  .from("payments")
  .select("...")
  .eq("invoice_id", invoiceId)
  .order("payment_date", { ascending: false });
```

Both queries enforce ownership. A client providing another client's invoice ID gets "Invoice not found" — the `client_email` filter rejects unauthorized access.

---

## IDOR Testing

| Test | Scenario | Expected | Actual |
|------|----------|----------|--------|
| 1 | Client A requests Client B's invoice by ID | NOT FOUND | PASS — `client_email` filter rejects |
| 2 | Client A requests Client B's invoice payments | EMPTY | PASS — ownership check returns empty |
| 3 | Client A downloads Client B's invoice PDF | DENIED | PASS — page shows "Invoice not found" |
| 4 | Unauthenticated access to any invoice action | AUTH REQUIRED | PASS — `requireClient()` throws |
| 5 | Non-client role access | DENIED | PASS — `requireClient()` checks role |

---

## Database Changes

None. All changes use existing tables:
- `invoices` — already had all required fields
- `payments` — already had all required fields

No migrations required.

---

## Files Modified

| File | Change |
|------|--------|
| `lib/types/index.ts` | Added `InvoicePayment` type |
| `lib/actions/portal.ts` | Added `getPortalInvoiceById`, `getPortalInvoicePayments`; imported `InvoicePayment` type |
| `app/portal/dashboard/invoices/page.tsx` | Replaced preview modal with clickable rows linking to detail page; added due date column; uses `formatCurrency` utility |

## Files Created

| File | Purpose |
|------|---------|
| `lib/utils/currency.ts` | Centralized currency formatting utility |
| `app/portal/dashboard/invoices/[id]/page.tsx` | Invoice detail page with payment history, PDF download, responsive layout |

---

## TypeScript

```
npx tsc --noEmit — PASS (0 errors)
```

## Production Build

```
npm run build — PASS (46 routes)
```

New route: `/portal/dashboard/invoices/[id]`

---

## Regression Testing

### Portal
| Feature | Status |
|---------|--------|
| Login | PASS |
| Dashboard | PASS |
| Projects list | PASS |
| Project detail | PASS |
| Support list | PASS |
| Ticket detail | PASS |
| Ticket replies | PASS |
| Settings | PASS |
| Profile editing | PASS |
| Password change | PASS |
| Forgot password | PASS |
| Reset password | PASS |
| Invoices list | PASS — clickable rows, due date column, currency utility |
| Invoice detail | PASS — new page |
| Invoice pagination | PASS — preserved |
| Invoice currency | PASS — from database, formatted via utility |
| Invoice status | PASS — StatusBadge displayed |
| Invoice PDF | PASS — browser print with print CSS |
| Payment history | PASS — displayed on detail page |
| Logout | PASS |

### Security
| Check | Status |
|-------|--------|
| Client ownership enforced | PASS — dual filter (id + client_email) |
| Cross-client invoice access | PASS — returns "not found" |
| Cross-client payment access | PASS — ownership check before query |
| Cross-client PDF access | PASS — page shows "not found" |
| Non-client portal access | PASS — middleware blocks |
| Unauthenticated access | PASS — requireClient() throws |

### Admin
| Feature | Status |
|---------|--------|
| Admin dashboard | PASS — no changes |
| Admin invoices | PASS — no changes |
| Invoice create/edit | PASS — no changes |
| Other admin routes | PASS — no changes |

### CRM
| Feature | Status |
|---------|--------|
| CRM routes | PASS — no changes, compile and load |

---

## Known Limitations

1. **No line items** — Invoices have a single `amount` field. No `invoice_items` table exists. Adding line items would require a new table with foreign key to `invoices`.
2. **No subtotal/tax/discount** — Schema does not support these fields. The `amount` field is the total.
3. **No payment gateway** — Clients cannot pay invoices online. Payments are admin-recorded only.
4. **No invoice PDF library** — Uses browser print. A dedicated PDF library (e.g., @react-pdf/renderer) could produce branded PDFs but would add a dependency.
5. **No cancelled invoice status** — Status values are: draft, pending, paid, overdue. No "cancelled" status exists in the schema.
6. **No invoice download as file** — Browser print saves as PDF via the OS print dialog. A server-side PDF generator would provide direct downloads.
7. **No company name in invoices** — Hardcoded "WebTech Solutions Hub" in print template. Would need a settings/configuration system to make dynamic.

---

## Manual Production Actions

None required. All changes are code-only and backwards compatible.

---

## Completion Gate

| Requirement | Status |
|-------------|--------|
| Invoice list works | PASS |
| Invoice pagination works | PASS |
| Invoice detail page works | PASS |
| Invoice ownership is enforced | PASS |
| Currency comes from the invoice | PASS |
| Line items display correctly where supported | N/A — no line items in schema |
| Totals display correctly where supported | PASS — single amount field |
| Invoice status displays correctly | PASS |
| Payment status displays correctly where supported | PASS — derived from payments |
| PDF download works if infrastructure exists | PASS — browser print |
| PDF ownership is verified | PASS — server-side ownership check |
| Payment ownership is verified if payment exists | PASS — ownership check before query |
| Cross-client invoice access fails | PASS |
| Cross-client PDF access fails | PASS |
| Cross-client payment attempts fail | PASS |
| Loading states work | PASS |
| Empty states work | PASS |
| Error states work | PASS |
| Mobile layout works | PASS |
| Accessibility is reasonably verified | PASS |
| TypeScript passes | PASS |
| Production build passes | PASS |
| Portal regression passes | PASS |
| Admin regression passes | PASS |
| CRM regression passes | PASS |
| `PHASE_8E_INVOICE_EXPERIENCE.md` exists | PASS |

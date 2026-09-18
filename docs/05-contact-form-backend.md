# 05 — Contact Form Backend Integration

> **Priority:** High
> **Effort:** 0.5-1 day
> **Dependencies:** 01-supabase-integration.md

---

## Objective

Add a working backend to the contact form — store submissions in Supabase, validate input, send confirmation emails, and provide admin visibility.

---

## Sub-Tasks

### 5.1 — Server Action

- [ ] Create `app/actions/contact.ts` with server action:

```typescript
"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(formData: FormData) {
  const validated = contactSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    budget: formData.get("budget"),
    message: formData.get("message"),
  })

  const supabase = createClient()
  const { error } = await supabase
    .from("contact_submissions")
    .insert(validated)

  if (error) throw error
  return { success: true }
}
```

### 5.2 — Form Validation

- [ ] Install `zod` for schema validation
- [ ] Add client-side validation (immediate feedback)
- [ ] Add server-side validation (security)
- [ ] Show validation errors inline
- [ ] Disable submit button during submission
- [ ] Show loading state

### 5.3 — Contact Page UI Enhancement

- [ ] Update `app/contact/page.tsx` to use server action
- [ ] Add form state management (useActionState or useState)
- [ ] Add success toast/message after submission
- [ ] Add error handling with user-friendly messages
- [ ] Add honeypot field (hidden, anti-spam)
- [ ] Add timestamp field (hidden, anti-spam)
- [ ] Clear form after successful submission

### 5.4 — Anti-Spam Measures

- [ ] Honeypot field (hidden input that bots fill, humans don't)
- [ ] Rate limiting (max 5 submissions per IP per hour)
- [ ] Timestamp check (reject if submitted in < 3 seconds)
- [ ] Basic content filtering (blocked keywords)

### 5.5 — Email Notification (Optional)

- [ ] Create `lib/email/send-notification.ts`
- [ ] Send email to admin on new submission
- [ ] Send confirmation email to submitter
- [ ] Use Supabase Edge Functions or external service (Resend, SendGrid)

### 5.6 — Admin Visibility

- [ ] Add "Contact Submissions" section to admin dashboard
- [ ] Show submissions in a table
- [ ] Status badges (new, read, responded)
- [ ] Click to view full message
- [ ] Mark as read/responded

### 5.7 — Existing Form Enhancement

**Current form fields:**
- Name (text, required)
- Email (email, required)
- Phone (tel, optional)
- Service (select, optional)
- Budget (select, optional)
- Message (textarea, required)

**Add:**
- [ ] Real-time validation feedback
- [ ] Character count on message field
- [ ] Service select populated from Supabase services table
- [ ] Better error states on each field
- [ ] Success animation after submission

---

## API Routes (Alternative to Server Actions)

If server actions aren't suitable, create:

```
app/api/contact/route.ts    ← POST handler
```

```typescript
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const validated = contactSchema.parse(body)
  
  // Store in Supabase
  // Send email notification
  // Return success response
  
  return NextResponse.json({ success: true })
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/actions/contact.ts` | CREATE (server action) |
| `app/contact/page.tsx` | MODIFY (add form handling) |
| `lib/validation/contact.ts` | CREATE (Zod schemas) |
| `components/ui/Toast.tsx` | CREATE (success/error notifications) |
| `app/admin/dashboard/page.tsx` | MODIFY (add submissions section) |
| `package.json` | MODIFY (add zod) |

---

## Data Flow

```
1. User fills out contact form
2. Client-side validation (immediate feedback)
3. Form submitted via Server Action
4. Server-side validation (Zod schema)
5. Honeypot check (anti-spam)
6. Rate limit check
7. Insert into Supabase `contact_submissions` table
8. Return success response
9. Show success message to user
10. Admin can view in dashboard
```

---

## Verification

- [ ] Form submits successfully
- [ ] Data stored in Supabase
- [ ] Validation errors shown inline
- [ ] Success message displayed
- [ ] Form clears after submission
- [ ] Honeypot field works (bots caught)
- [ ] Rate limiting works
- [ ] Admin can see submissions
- [ ] Mobile responsive
- [ ] `npm run build` passes
- [ ] No console errors

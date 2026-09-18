# Pixelwyre Digital — Dynamic Features Master Plan

> **Project:** Pixelwyre Digital Next.js 16
> **Date:** September 14, 2026
> **Status:** Planning Phase

---

## Current State

The project is **100% static**. All data is hardcoded in page components. No database, no API routes, no dynamic content pages, no form backend.

### What Exists
- 22 static routes (all pre-rendered)
- `lib/types/index.ts` — partial TypeScript types (mostly unused)
- `lib/data/site-data.json` — site config data (never imported)
- Admin dashboard with hardcoded mock data
- Contact form UI (no submission handling)

### What's Missing
- No Supabase packages or client
- No `.env` files
- No `app/api/` directory
- No dynamic `[slug]` routes
- No form validation or backend
- Types are orphaned (defined but never imported)

---

## 5 Planned Features

| # | Feature | Priority | Dependencies | Est. Effort |
|---|---------|----------|-------------|-------------|
| 1 | Supabase Integration | Critical | None (foundation) | 2-3 days |
| 2 | Blog Post Pages | High | Supabase (for data) | 1-2 days |
| 3 | Service Detail Pages | High | Supabase (for data) | 1 day |
| 4 | Portfolio/Project Pages | High | Supabase (for data) | 1 day |
| 5 | Contact Form Backend | High | Supabase (for storage) | 0.5-1 day |

---

## Execution Order

```
Phase 1: Supabase Setup (Foundation)
  └── All other features depend on this

Phase 2: Content Pages (Parallel)
  ├── Blog Post Pages
  ├── Service Detail Pages
  └── Portfolio/Project Pages

Phase 3: Form Backend
  └── Contact Form Integration

Phase 4: Polish & Testing
  └── All features validated
```

---

## File Structure (Target)

```
pixelwyre/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          ← Browser client
│   │   ├── server.ts          ← Server client
│   │   └── middleware.ts      ← Auth middleware
│   ├── types/
│   │   └── index.ts           ← All TypeScript types
│   └── data/
│       └── site-data.json     ← Static site config
│
├── app/
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts       ← Contact form handler
│   │   └── revalidate/
│   │       └── route.ts       ← On-demand revalidation
│   │
│   ├── blog/
│   │   ├── page.tsx           ← Blog listing (existing)
│   │   └── [slug]/
│   │       └── page.tsx       ← Individual blog post
│   │
│   ├── services/
│   │   ├── page.tsx           ← Services listing (existing)
│   │   └── [slug]/
│   │       └── page.tsx       ← Individual service page
│   │
│   └── case-studies/
│       ├── page.tsx           ← Case studies listing (existing)
│       └── [slug]/
│           └── page.tsx       ← Individual case study
│
└── supabase/
    └── schema.sql             ← Database schema
```

---

## Database Schema (Planned)

### Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `blog_posts` | Blog articles | slug, title, content, excerpt, category, featured_image, published_at |
| `services` | Service offerings | slug, name, description, price, category, features, icon |
| `case_studies` | Portfolio projects | slug, client_name, industry, result, description, metrics, tech_stack |
| `contact_submissions` | Form entries | name, email, phone, service, budget, message, created_at |
| `leads` | Sales leads | name, email, phone, service, status, value, created_at |

---

## Key Decisions

1. **Supabase over raw SQL** — Free tier, real-time, auth built-in, dashboard for content management
2. **Server Components by default** — Only use `"use client"` when interactivity is needed
3. **Incremental Static Regeneration (ISR)** — Content pages revalidate every 60 seconds
4. **Server Actions for mutations** — Contact form, lead creation
5. **No new UI libraries** — Use existing design system from globals.css

---

## Related Documents

- [01-supabase-integration.md](./01-supabase-integration.md)
- [02-blog-post-pages.md](./02-blog-post-pages.md)
- [03-service-detail-pages.md](./03-service-detail-pages.md)
- [04-portfolio-project-pages.md](./04-portfolio-project-pages.md)
- [05-contact-form-backend.md](./05-contact-form-backend.md)
- [PHASES.md](./PHASES.md)

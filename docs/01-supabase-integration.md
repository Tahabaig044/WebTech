# 01 — Supabase Integration

> **Priority:** Critical (Foundation for all other features)
> **Effort:** 2-3 days
> **Dependencies:** None

---

## Objective

Set up Supabase as the database and backend for Pixelwyre Digital. Create client utilities, define the database schema, migrate existing hardcoded data, and establish patterns for data fetching.

---

## Sub-Tasks

### 1.1 — Install & Configure Supabase

- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`
- [ ] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `.env.local` to `.gitignore`
- [ ] Create `lib/supabase/client.ts` — browser client singleton
- [ ] Create `lib/supabase/server.ts` — server client for Server Components
- [ ] Create `lib/supabase/middleware.ts` — auth middleware helper
- [ ] Update `next.config.ts` with Supabase image domains if needed

### 1.2 — Database Schema

- [ ] Create `supabase/schema.sql` with all tables:

```sql
-- Blog Posts
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  featured_image TEXT,
  author TEXT DEFAULT 'Pixelwyre Team',
  read_time TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Services
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price TEXT NOT NULL,
  price_period TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  features TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Case Studies / Portfolio
CREATE TABLE case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  result_summary TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  metrics JSONB DEFAULT '[]',
  tech_stack TEXT[] DEFAULT '{}',
  featured_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  timeline TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Submissions
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads (for admin dashboard)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service TEXT NOT NULL,
  value TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

- [ ] Add RLS (Row Level Security) policies:
  - Public read for `blog_posts` (published only), `services` (active only), `case_studies` (published only)
  - Authenticated full access for admin operations
  - Insert-only for `contact_submissions` (public form)
- [ ] Create indexes on `slug`, `category`, `published`, `status`

### 1.3 — Data Migration

- [ ] Export existing hardcoded blog posts → seed SQL
- [ ] Export existing hardcoded services (32 items from admin page) → seed SQL
- [ ] Export existing hardcoded case studies → seed SQL
- [ ] Create `supabase/seed.sql` with all seed data
- [ ] Verify data integrity after migration

### 1.4 — TypeScript Types

- [ ] Update `lib/types/index.ts` with all database types:

```typescript
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  featured_image: string | null;
  author: string;
  read_time: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string | null;
  price: string;
  price_period: string | null;
  category: string;
  icon: string | null;
  features: string[];
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client_name: string;
  industry: string;
  result_summary: string;
  description: string;
  challenge: string | null;
  solution: string | null;
  metrics: Metric[];
  tech_stack: string[];
  featured_image: string | null;
  gallery: string[];
  timeline: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface Metric {
  label: string;
  before: string;
  after: string;
  change: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  service: string;
  value: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}
```

### 1.5 — Data Fetching Utilities

- [ ] Create `lib/supabase/queries.ts` with typed query functions:

```typescript
// Blog
export async function getBlogPosts(options?: { category?: string; limit?: number }): Promise<BlogPost[]>
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null>
export async function getBlogCategories(): Promise<string[]>

// Services
export async function getServices(options?: { category?: string }): Promise<Service[]>
export async function getServiceBySlug(slug: string): Promise<Service | null>
export async function getServiceCategories(): Promise<string[]>

// Case Studies
export async function getCaseStudies(): Promise<CaseStudy[]>
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null>

// Contact
export async function submitContactForm(data: ContactSubmissionInsert): Promise<{ success: boolean }>
```

- [ ] Use ISR with `revalidate: 60` for public pages
- [ ] Use `noStore()` for admin pages (always fresh)

### 1.6 — Environment Variables

- [ ] Document required env vars in `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `lib/supabase/client.ts` | CREATE |
| `lib/supabase/server.ts` | CREATE |
| `lib/supabase/queries.ts` | CREATE |
| `lib/types/index.ts` | MODIFY |
| `supabase/schema.sql` | CREATE |
| `supabase/seed.sql` | CREATE |
| `.env.local` | CREATE (manual — credentials) |
| `.env.example` | CREATE |
| `next.config.ts` | MODIFY (if image domains needed) |
| `package.json` | MODIFY (new dependencies) |

---

## Verification

- [ ] `npm run build` passes with 0 errors
- [ ] Supabase client connects successfully
- [ ] All tables created with RLS policies
- [ ] Seed data inserted correctly
- [ ] Query functions return typed data
- [ ] ISR revalidation works (modify data in Supabase, wait 60s, refresh page)
- [ ] Public pages only show published/active records

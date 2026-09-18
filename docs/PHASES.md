# PHASES.md — Execution Timeline

> **Project:** Pixelwyre Digital — Dynamic Features
> **Total Estimated Effort:** 5-7 days
> **Start Date:** Pending (requires Supabase project setup)

---

## Phase 1: Foundation (Days 1-2)

**Goal:** Supabase connected, schema created, data migrated, query functions working.

| # | Task | Est. | Status |
|---|------|------|--------|
| 1.1 | Install Supabase packages | 15 min | ⬜ |
| 1.2 | Create Supabase project + get credentials | 30 min | ⬜ |
| 1.3 | Create `.env.local` with credentials | 5 min | ⬜ |
| 1.4 | Create `lib/supabase/client.ts` | 15 min | ⬜ |
| 1.5 | Create `lib/supabase/server.ts` | 15 min | ⬜ |
| 1.6 | Create `supabase/schema.sql` | 30 min | ⬜ |
| 1.7 | Run schema in Supabase dashboard | 10 min | ⬜ |
| 1.8 | Create `supabase/seed.sql` with all data | 45 min | ⬜ |
| 1.9 | Run seed data | 10 min | ⬜ |
| 1.10 | Update `lib/types/index.ts` | 30 min | ⬜ |
| 1.11 | Create `lib/supabase/queries.ts` | 45 min | ⬜ |
| 1.12 | Test all query functions | 30 min | ⬜ |
| 1.13 | Build validation | 15 min | ⬜ |

**Phase 1 Exit Criteria:**
- [ ] `npm run build` passes
- [ ] All 5 tables exist in Supabase with RLS
- [ ] Seed data inserted (32 services, 5 case studies, sample blog posts)
- [ ] Query functions return typed data
- [ ] ISR works (data updates without rebuild)

---

## Phase 2: Content Pages (Days 3-5)

**Goal:** Blog, services, and case studies have individual `[slug]` pages with dynamic data.

### Phase 2a: Blog Pages (Day 3)

| # | Task | Est. | Status |
|---|------|------|--------|
| 2a.1 | Install react-markdown + plugins | 5 min | ⬜ |
| 2a.2 | Create `app/blog/[slug]/page.tsx` | 45 min | ⬜ |
| 2a.3 | Create `components/blog/MarkdownRenderer.tsx` | 30 min | ⬜ |
| 2a.4 | Create `components/blog/TableOfContents.tsx` | 30 min | ⬜ |
| 2a.5 | Create `components/blog/ShareButtons.tsx` | 20 min | ⬜ |
| 2a.6 | Create `components/blog/RelatedPosts.tsx` | 20 min | ⬜ |
| 2a.7 | Create `components/blog/BlogCTA.tsx` | 15 min | ⬜ |
| 2a.8 | Update `app/blog/page.tsx` to fetch from Supabase | 30 min | ⬜ |
| 2a.9 | Add category filter functionality | 20 min | ⬜ |
| 2a.10 | Add pagination | 20 min | ⬜ |
| 2a.11 | Add SEO meta tags + JSON-LD | 20 min | ⬜ |
| 2a.12 | Test and validate | 15 min | ⬜ |

### Phase 2b: Service Detail Pages (Day 4)

| # | Task | Est. | Status |
|---|------|------|--------|
| 2b.1 | Create `app/services/[slug]/page.tsx` | 45 min | ⬜ |
| 2b.2 | Create `components/services/PricingTable.tsx` | 30 min | ⬜ |
| 2b.3 | Create `components/services/RelatedServices.tsx` | 20 min | ⬜ |
| 2b.4 | Create `components/services/ServiceCTA.tsx` | 15 min | ⬜ |
| 2b.5 | Update `app/services/page.tsx` to fetch from Supabase | 30 min | ⬜ |
| 2b.6 | Add search/filter functionality | 20 min | ⬜ |
| 2b.7 | Add SEO meta tags + JSON-LD | 20 min | ⬜ |
| 2b.8 | Test and validate | 15 min | ⬜ |

### Phase 2c: Portfolio Pages (Day 5)

| # | Task | Est. | Status |
|---|------|------|--------|
| 2c.1 | Create `app/case-studies/[slug]/page.tsx` | 45 min | ⬜ |
| 2c.2 | Create `components/portfolio/MetricsGrid.tsx` | 30 min | ⬜ |
| 2c.3 | Create `components/portfolio/TechStack.tsx` | 15 min | ⬜ |
| 2c.4 | Create `components/portfolio/Testimonial.tsx` | 15 min | ⬜ |
| 2c.5 | Create `components/portfolio/Gallery.tsx` | 20 min | ⬜ |
| 2c.6 | Create `components/portfolio/CaseStudyCTA.tsx` | 15 min | ⬜ |
| 2c.7 | Update `app/case-studies/page.tsx` to fetch from Supabase | 30 min | ⬜ |
| 2c.8 | Add industry filter | 15 min | ⬜ |
| 2c.9 | Add SEO meta tags + JSON-LD | 20 min | ⬜ |
| 2c.10 | Test and validate | 15 min | ⬜ |

**Phase 2 Exit Criteria:**
- [ ] `/blog` lists posts from Supabase with category filter
- [ ] `/blog/[slug]` renders individual post with markdown
- [ ] `/services` lists all 32 services from Supabase
- [ ] `/services/[slug]` shows individual service detail
- [ ] `/case-studies` lists all 5 projects from Supabase
- [ ] `/case-studies/[slug]` shows full case study with metrics
- [ ] All pages have SEO meta tags
- [ ] All pages are mobile responsive
- [ ] `npm run build` passes

---

## Phase 3: Form Backend (Day 5-6)

**Goal:** Contact form submits to Supabase, admin can view submissions.

| # | Task | Est. | Status |
|---|------|------|--------|
| 3.1 | Install zod | 5 min | ⬜ |
| 3.2 | Create `lib/validation/contact.ts` | 20 min | ⬜ |
| 3.3 | Create `app/actions/contact.ts` server action | 30 min | ⬜ |
| 3.4 | Update `app/contact/page.tsx` with form handling | 45 min | ⬜ |
| 3.5 | Add client-side validation feedback | 20 min | ⬜ |
| 3.6 | Add honeypot anti-spam field | 10 min | ⬜ |
| 3.7 | Add success/error states | 15 min | ⬜ |
| 3.8 | Add submissions table to admin dashboard | 30 min | ⬜ |
| 3.9 | Test form submission end-to-end | 15 min | ⬜ |
| 3.10 | Test anti-spam measures | 10 min | ⬜ |

**Phase 3 Exit Criteria:**
- [ ] Contact form submits to Supabase
- [ ] Validation errors shown inline
- [ ] Success message displayed after submission
- [ ] Honeypot field catches bots
- [ ] Admin dashboard shows submissions
- [ ] `npm run build` passes

---

## Phase 4: Polish & Testing (Day 6-7)

**Goal:** Everything works, looks professional, and passes all checks.

| # | Task | Est. | Status |
|---|------|------|--------|
| 4.1 | Cross-browser testing | 30 min | ⬜ |
| 4.2 | Mobile responsive testing (all breakpoints) | 30 min | ⬜ |
| 4.3 | SEO audit (meta tags, structured data) | 20 min | ⬜ |
| 4.4 | Performance audit (Lighthouse) | 20 min | ⬜ |
| 4.5 | Accessibility audit (keyboard, screen reader) | 20 min | ⬜ |
| 4.6 | Fix any visual issues | 30 min | ⬜ |
| 4.7 | Final build validation | 15 min | ⬜ |
| 4.8 | Documentation update | 15 min | ⬜ |

**Phase 4 Exit Criteria:**
- [ ] All pages render correctly at all breakpoints
- [ ] No console errors
- [ ] Lighthouse score > 90 on all pages
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] `npm run build` passes with 0 errors
- [ ] Documentation updated

---

## Gantt Summary

```
Day 1  ████████████████████ Phase 1: Supabase Setup
Day 2  ████████████████████ Phase 1: Data Migration + Queries
Day 3  ████████████████████ Phase 2a: Blog Pages
Day 4  ████████████████████ Phase 2b: Service Pages
Day 5  ████████████░░░░░░░░ Phase 2c: Portfolio Pages
Day 5  ░░░░░░░░████████████ Phase 3: Contact Form
Day 6  ████████████████████ Phase 3: Admin Integration
Day 7  ████████████████████ Phase 4: Polish & Testing
```

---

## Blockers & Prerequisites

| Blocker | Resolution | Owner |
|---------|-----------|-------|
| Supabase project not created | Create at supabase.com | User |
| `.env.local` credentials needed | User provides project URL + anon key | User |
| Supabase service role key for admin | User provides from Supabase dashboard | User |
| Blog content (markdown) | Write 3-5 sample posts | User/Agent |
| Service descriptions | Expand existing descriptions | Agent |
| Case study images | User provides screenshots | User |

---

## Parallel Execution Opportunities

After Phase 1 completes, these can be done in parallel:

```
Phase 2a (Blog)     ──┐
Phase 2b (Services) ──┼── Parallel (Days 3-5)
Phase 2c (Portfolio) ─┘

Phase 3 (Contact) ──── Sequential after Phase 2c (Day 5-6)
```

---

## Rollback Plan

If any phase fails:
1. Revert to last working commit
2. Check Supabase connection
3. Verify environment variables
4. Run `npm run build` to isolate errors
5. Fix and retry

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Build errors | 0 |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 90 |
| Lighthouse SEO | > 95 |
| Mobile responsive | All breakpoints |
| Form submission success rate | > 99% |
| Page load time | < 2s |

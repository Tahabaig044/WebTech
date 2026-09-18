# 04 — Portfolio / Project Detail Pages

> **Priority:** High
> **Effort:** 1 day
> **Dependencies:** 01-supabase-integration.md

---

## Objective

Create individual case study / portfolio detail pages with `[slug]` dynamic routing, metrics visualization, and a professional project presentation.

---

## Sub-Tasks

### 4.1 — Data Structure Enhancement

**Current data** (5 case studies):
- Al-Razaq Traders (Retail) — 340% increase in online orders
- GreenField Academy (Education) — 60% admin workload reduction
- FitZone Gym (Fitness) — 2x membership sign-ups
- Smile Dental Clinic (Healthcare) — 3x patient bookings
- Bite & Sip Café (Restaurant) — ₨2.8M monthly delivery revenue

- [ ] Add `slug` field (e.g., `al-razzaq-traders`, `greenfield-academy`)
- [ ] Add `challenge` field (problem statement)
- [ ] Add `solution` field (what we did)
- [ ] Add `featured_image` field
- [ ] Add `gallery` array (before/after screenshots, UI mockups)
- [ ] Verify `metrics` JSONB structure is consistent
- [ ] Add `testimonial` field (client quote)

### 4.2 — Dynamic Route Setup

- [ ] Create `app/case-studies/[slug]/page.tsx`
- [ ] Add `generateStaticParams()` for all 5 case study slugs
- [ ] Add `generateMetadata()` for dynamic SEO
- [ ] Handle 404 for non-existent slugs

### 4.3 — Case Study Detail Layout

```
┌─────────────────────────────────────────────┐
│ Hero Section                                │
│ Client: Al-Razaq Traders                    │
│ Industry: Retail & E-Commerce               │
│ Result: 340% increase in online orders      │
│ Timeline: 3 months                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Key Metrics (visual cards)                  │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │ Orders  │ │ Revenue │ │ GM Rank │       │
│ │ +340%   │ │ +300%   │ │ #2      │       │
│ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Challenge ──────────────────────────────    │
│ What problem the client faced...            │
│                                             │
│ Solution ──────────────────────────────     │
│ What we built / delivered...                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Tech Stack                                  │
│ [Next.js] [Stripe] [Google Shopping] [...]  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Client Testimonial                          │
│ "Pixelwyre transformed our business..."    │
│ — Client Name, CEO                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Gallery (before/after, UI screenshots)      │
│ [img] [img] [img] [img]                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ CTA: Want similar results? Contact us       │
└─────────────────────────────────────────────┘
```

### 4.4 — Case Studies Listing Enhancement

- [ ] Update `app/case-studies/page.tsx` to fetch from Supabase
- [ ] Show featured case studies prominently
- [ ] Add industry filter
- [ ] Each card links to `/case-studies/[slug]`
- [ ] Show key metric on listing card

### 4.5 — Metrics Visualization

- [ ] Create `components/portfolio/MetricsGrid.tsx`
- [ ] Visual before → after comparison
- [ ] Percentage change highlighted
- [ ] Color-coded improvement indicators

### 4.6 — SEO

- [ ] Open Graph tags per case study
- [ ] JSON-LD structured data (CaseStudy schema)
- [ ] Canonical URL
- [ ] Sitemap inclusion

---

## Page Structure

```
/case-studies/                    ← Listing (existing, enhanced)
/case-studies/[slug]              ← Detail (NEW)
/case-studies/al-razzaq-traders   ← Example slug
/case-studies/greenfield-academy  ← Example slug
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/case-studies/[slug]/page.tsx` | CREATE |
| `app/case-studies/page.tsx` | MODIFY (fetch from Supabase) |
| `components/portfolio/MetricsGrid.tsx` | CREATE |
| `components/portfolio/TechStack.tsx` | CREATE |
| `components/portfolio/Testimonial.tsx` | CREATE |
| `components/portfolio/Gallery.tsx` | CREATE |
| `components/portfolio/CaseStudyCTA.tsx` | CREATE |

---

## Verification

- [ ] `/case-studies` lists all 5 projects from Supabase
- [ ] `/case-studies/[slug]` shows full case study
- [ ] Metrics displayed with before → after
- [ ] Tech stack badges shown
- [ ] Testimonial displayed
- [ ] Gallery renders (if images provided)
- [ ] 404 for invalid slugs
- [ ] SEO meta tags present
- [ ] Mobile responsive
- [ ] `npm run build` passes

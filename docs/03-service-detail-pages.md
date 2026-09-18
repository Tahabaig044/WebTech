# 03 — Service Detail Pages

> **Priority:** High
> **Effort:** 1 day
> **Dependencies:** 01-supabase-integration.md

---

## Objective

Create individual service detail pages with `[slug]` dynamic routing, unified data source, and a professional service presentation.

---

## Sub-Tasks

### 3.1 — Data Unification

**Problem:** Service data exists in 3 separate places:
- `app/services/page.tsx` — 6 categories with descriptions
- `app/admin/services/page.tsx` — 32 individual services with prices
- `components/home/ServicesGrid.tsx` — homepage grid

- [ ] Consolidate all service data into Supabase `services` table
- [ ] Map existing 32 services with correct categories, prices, features
- [ ] Add `slug` field to each service (e.g., `basic-website`, `local-seo-starter`)
- [ ] Add `short_description` and `description` (full text) fields
- [ ] Add `features` array field

### 3.2 — Dynamic Route Setup

- [ ] Create `app/services/[slug]/page.tsx`
- [ ] Add `generateStaticParams()` for all service slugs
- [ ] Add `generateMetadata()` for dynamic SEO
- [ ] Handle 404 for non-existent slugs

### 3.3 — Service Detail Layout

```
┌─────────────────────────────────────────────┐
│ Hero Section                                │
│ ┌─────┐ Service Name                        │
│ │ Icon │ Category Badge                      │
│ └─────┘ Short Description                   │
│                                             │
│ Price: ₨XX,XXX  │  [Get Quote]  [WhatsApp] │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Description (full markdown content)         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Features List                               │
│ ✓ Feature 1    ✓ Feature 2    ✓ Feature 3  │
│ ✓ Feature 4    ✓ Feature 5    ✓ Feature 6  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ FAQ Section (common questions)              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Related Services (same category, limit 3)   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ CTA: Ready to get started? Contact us       │
└─────────────────────────────────────────────┘
```

### 3.4 — Services Listing Enhancement

- [ ] Update `app/services/page.tsx` to fetch from Supabase
- [ ] Display all services grouped by category
- [ ] Add search/filter functionality
- [ ] Each card links to `/services/[slug]`
- [ ] Show price on listing cards

### 3.5 — Pricing Table Component

- [ ] Create `components/services/PricingTable.tsx`
- [ ] Show pricing tiers if service has multiple options
- [ ] Highlight recommended tier
- [ ] CTA button per tier

### 3.6 — SEO

- [ ] Open Graph tags per service
- [ ] JSON-LD structured data (Product/Service schema)
- [ ] Canonical URL
- [ ] Sitemap inclusion

---

## Page Structure

```
/services/                    ← Listing (existing, enhanced)
/services/[slug]              ← Detail (NEW)
/services/web-development     ← Example slug
/services/local-seo-starter   ← Example slug
```

---

## Data Flow

```
1. User visits /services/local-seo-starter
2. generateStaticParams() returns all 32 service slugs
3. Page calls getServiceBySlug("local-seo-starter")
4. Supabase returns Service with all fields
5. Page renders hero + description + features + FAQ + CTA
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/services/[slug]/page.tsx` | CREATE |
| `app/services/page.tsx` | MODIFY (fetch from Supabase) |
| `components/services/PricingTable.tsx` | CREATE |
| `components/services/ServiceFAQ.tsx` | CREATE |
| `components/services/RelatedServices.tsx` | CREATE |
| `components/services/ServiceCTA.tsx` | CREATE |

---

## Verification

- [ ] `/services` lists all 32 services from Supabase
- [ ] `/services/[slug]` shows individual service detail
- [ ] Price displayed correctly
- [ ] Features list rendered
- [ ] Related services shown
- [ ] CTA links to contact page
- [ ] 404 for invalid slugs
- [ ] SEO meta tags present
- [ ] Mobile responsive
- [ ] `npm run build` passes

# 02 — Individual Blog Post Pages

> **Priority:** High
> **Effort:** 1-2 days
> **Dependencies:** 01-supabase-integration.md

---

## Objective

Create individual blog post pages with `[slug]` dynamic routing, markdown content rendering, and a professional reading experience.

---

## Sub-Tasks

### 2.1 — Dynamic Route Setup

- [ ] Create `app/blog/[slug]/page.tsx`
- [ ] Add `generateStaticParams()` for static generation of known slugs
- [ ] Add `generateMetadata()` for dynamic SEO per post
- [ ] Handle 404 for non-existent slugs

### 2.2 — Content Rendering

- [ ] Install `react-markdown` and `remark-gfm` (GitHub Flavored Markdown)
- [ ] Create `components/blog/MarkdownRenderer.tsx` — styled markdown component
- [ ] Support: headings, paragraphs, lists, code blocks, blockquotes, images, links, tables
- [ ] Apply Pixelwyre typography styles to rendered markdown
- [ ] Add `rehype-raw` for HTML support in content

### 2.3 — Blog Post Layout

- [ ] Hero section with featured image (if exists)
- [ ] Category badge
- [ ] Title (large, heading font)
- [ ] Author + date + read time meta bar
- [ ] Table of contents (auto-generated from headings)
- [ ] Content body
- [ ] Share buttons (Twitter, LinkedIn, WhatsApp)
- [ ] Related posts section (same category, limit 3)
- [ ] CTA banner ("Need a similar solution? Contact us")

### 2.4 — Blog Listing Enhancement

- [ ] Update `app/blog/page.tsx` to fetch from Supabase
- [ ] Add category filter functionality (client-side state)
- [ ] Add "featured" post highlight at top
- [ ] Pagination (10 posts per page)
- [ ] Empty state when no posts match filter
- [ ] Loading skeleton during fetch

### 2.5 — SEO

- [ ] Open Graph tags per post (title, description, image)
- [ ] Twitter Card tags
- [ ] Canonical URL
- [ ] JSON-LD structured data (Article schema)
- [ ] Sitemap generation for blog posts

### 2.6 — MDX Alternative (Optional Enhancement)

- [ ] Consider MDX for richer content (interactive components in blog posts)
- [ ] Only if needed — markdown is sufficient for most cases

---

## Page Structure

```
/blog/                    ← Listing page (existing, enhanced)
/blog/[slug]              ← Individual post (NEW)
```

---

## Component Structure

```
components/
└── blog/
    ├── MarkdownRenderer.tsx    ← Renders markdown content
    ├── TableOfContents.tsx     ← Auto-generated TOC
    ├── ShareButtons.tsx        ← Social sharing
    ├── RelatedPosts.tsx        ← Related posts grid
    └── BlogCTA.tsx             ← Call-to-action banner
```

---

## Data Flow

```
1. User visits /blog/my-post
2. Next.js calls generateStaticParams() → [ { slug: "my-post" }, ... ]
3. Page component calls getBlogPostBySlug("my-post")
4. Supabase query returns BlogPost with content (markdown string)
5. MarkdownRenderer converts to HTML
6. Page renders with full layout
```

---

## Markdown Content Format

Posts stored in Supabase with markdown content:

```markdown
## Introduction

Your business website is often the first impression potential customers have of your brand.

### Why Speed Matters

- 53% of users abandon sites that take > 3 seconds to load
- Google uses page speed as a ranking factor
- Every 1-second delay reduces conversions by 7%

### Our Approach

We build with **Next.js** and **Tailwind CSS** for maximum performance...

```javascript
// Example code block
const config = { ... }
```

> "Pixelwyre delivered our site in 2 weeks with a 96 PageSpeed score." — Client Name
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/blog/[slug]/page.tsx` | CREATE |
| `app/blog/page.tsx` | MODIFY (fetch from Supabase) |
| `components/blog/MarkdownRenderer.tsx` | CREATE |
| `components/blog/TableOfContents.tsx` | CREATE |
| `components/blog/ShareButtons.tsx` | CREATE |
| `components/blog/RelatedPosts.tsx` | CREATE |
| `components/blog/BlogCTA.tsx` | CREATE |
| `package.json` | MODIFY (react-markdown, remark-gfm) |

---

## Verification

- [ ] `/blog` lists posts from Supabase
- [ ] `/blog/[slug]` renders individual post with markdown
- [ ] 404 shown for non-existent slugs
- [ ] Category filter works
- [ ] Table of contents generated from headings
- [ ] Social share buttons work
- [ ] Related posts shown correctly
- [ ] SEO meta tags present per post
- [ ] Mobile responsive
- [ ] `npm run build` passes

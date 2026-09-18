-- ============================================================
-- Pixelwyre Digital — Supabase Database Schema
-- ============================================================

-- ============================================================
-- 1. blog_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  excerpt       TEXT,
  category      TEXT NOT NULL,
  featured_image TEXT,
  author        TEXT DEFAULT 'Pixelwyre Team',
  read_time     TEXT,
  featured      BOOLEAN DEFAULT false,
  published     BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  description       TEXT NOT NULL,
  short_description TEXT,
  price             TEXT NOT NULL,
  price_period      TEXT,
  category          TEXT NOT NULL,
  icon              TEXT,
  features          TEXT[] DEFAULT '{}',
  active            BOOLEAN DEFAULT true,
  sort_order        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. case_studies
-- ============================================================
CREATE TABLE IF NOT EXISTS case_studies (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  client_name     TEXT NOT NULL,
  industry        TEXT NOT NULL,
  result_summary  TEXT NOT NULL,
  description     TEXT NOT NULL,
  challenge       TEXT,
  solution        TEXT,
  metrics         JSONB DEFAULT '[]',
  tech_stack      TEXT[] DEFAULT '{}',
  featured_image  TEXT,
  gallery         TEXT[] DEFAULT '{}',
  timeline        TEXT,
  featured        BOOLEAN DEFAULT false,
  published       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. contact_submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  service    TEXT,
  budget     TEXT,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. leads
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  service    TEXT NOT NULL,
  value      TEXT,
  status     TEXT DEFAULT 'new',
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug       ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category   ON blog_posts (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published  ON blog_posts (published);

CREATE INDEX IF NOT EXISTS idx_services_slug       ON services (slug);
CREATE INDEX IF NOT EXISTS idx_services_category   ON services (category);
CREATE INDEX IF NOT EXISTS idx_services_active     ON services (active);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug       ON case_studies (slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry   ON case_studies (industry);
CREATE INDEX IF NOT EXISTS idx_case_studies_published  ON case_studies (published);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status    ON contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created   ON contact_submissions (created_at);

CREATE INDEX IF NOT EXISTS idx_leads_status   ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_service  ON leads (service);

-- ============================================================
-- updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- blog_posts: public can read published; authenticated can do all
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- services: public can read active; authenticated can do all
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active services"
  ON services FOR SELECT
  USING (active = true);

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- case_studies: public can read published; authenticated can do all
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published case studies"
  ON case_studies FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage case studies"
  ON case_studies FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- contact_submissions: public can insert; authenticated can read/update
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert contact submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact submissions"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- leads: authenticated can do all
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

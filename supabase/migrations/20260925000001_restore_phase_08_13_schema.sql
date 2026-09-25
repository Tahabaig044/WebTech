-- Restore Phase 8-13 schema on the correct Supabase project.
-- Idempotent: only creates missing objects and adds missing columns.
-- Never drops or recreates existing objects. Existing data is preserved.

-- ============================================================
-- projects
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email text NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  progress integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_client_email_idx ON public.projects (client_email);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects (status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects (created_at DESC);

-- ============================================================
-- invoices
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email text NOT NULL,
  invoice_number text NOT NULL,
  amount numeric(12, 2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'PKR',
  status text NOT NULL DEFAULT 'pending',
  description text NOT NULL DEFAULT '',
  due_date date,
  paid_at timestamptz,
  project_id uuid REFERENCES public.projects (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS invoices_invoice_number_key
  ON public.invoices (invoice_number);
CREATE INDEX IF NOT EXISTS invoices_client_email_idx ON public.invoices (client_email);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices (status);
CREATE INDEX IF NOT EXISTS invoices_project_id_idx ON public.invoices (project_id);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON public.invoices (created_at DESC);

-- ============================================================
-- payments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices (id) ON DELETE CASCADE,
  receipt_number text NOT NULL,
  amount numeric(12, 2) NOT NULL,
  payment_date date NOT NULL,
  payment_mode text NOT NULL,
  reference_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS payments_receipt_number_key
  ON public.payments (receipt_number);
CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON public.payments (invoice_id);
CREATE INDEX IF NOT EXISTS payments_payment_date_idx ON public.payments (payment_date DESC);

-- ============================================================
-- notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON public.notifications (user_id, is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications (created_at DESC);

-- ============================================================
-- lead_followups
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lead_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES public.users (id) ON DELETE SET NULL,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_followups_lead_id_idx ON public.lead_followups (lead_id);
CREATE INDEX IF NOT EXISTS lead_followups_assigned_to_idx ON public.lead_followups (assigned_to);
CREATE INDEX IF NOT EXISTS lead_followups_due_date_idx ON public.lead_followups (due_date);
CREATE INDEX IF NOT EXISTS lead_followups_status_idx ON public.lead_followups (status);

-- ============================================================
-- support_tickets
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.support_ticket_number_seq START 1001;

CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'TKT-' || TO_CHAR(nextval('public.support_ticket_number_seq'), 'FM000000');
END;
$$;

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email text NOT NULL,
  ticket_number text NOT NULL DEFAULT public.generate_ticket_number(),
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS support_tickets_ticket_number_key
  ON public.support_tickets (ticket_number);
CREATE INDEX IF NOT EXISTS support_tickets_client_email_idx
  ON public.support_tickets (client_email);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON public.support_tickets (status);
CREATE INDEX IF NOT EXISTS support_tickets_priority_idx ON public.support_tickets (priority);
CREATE INDEX IF NOT EXISTS support_tickets_created_at_idx
  ON public.support_tickets (created_at DESC);

-- Backfill any rows that predate the default.
UPDATE public.support_tickets
SET ticket_number = public.generate_ticket_number()
WHERE ticket_number IS NULL;

-- ============================================================
-- ticket_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets (id) ON DELETE CASCADE,
  sender_email text NOT NULL,
  sender_role text NOT NULL DEFAULT 'client',
  message text NOT NULL,
  is_internal_note boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ticket_messages_ticket_id_idx
  ON public.ticket_messages (ticket_id, created_at);

-- ============================================================
-- activity_log
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users (id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  entity_name text,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_log_entity_idx
  ON public.activity_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS activity_log_user_id_idx ON public.activity_log (user_id);
CREATE INDEX IF NOT EXISTS activity_log_created_at_idx
  ON public.activity_log (created_at DESC);

-- ============================================================
-- site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  value jsonb,
  category text NOT NULL DEFAULT 'brand',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS site_settings_key_key ON public.site_settings (key);
CREATE INDEX IF NOT EXISTS site_settings_category_idx ON public.site_settings (category);

INSERT INTO public.site_settings (key, value, category)
VALUES
  ('brand_name',      '"Pixelwyre"'::jsonb,          'brand'),
  ('copyright_text',  '"© Pixelwyre. All rights reserved."'::jsonb, 'footer'),
  ('contact_email',   '"hello@pixelwyre.com"'::jsonb, 'contact'),
  ('contact_phone',   '""'::jsonb,                    'contact'),
  ('office_address',  '""'::jsonb,                    'contact'),
  ('whatsapp_number', '""'::jsonb,                    'contact'),
  ('hero_title',      '"Build better, ship faster."'::jsonb, 'hero'),
  ('hero_subtitle',   '"We design and engineer digital products that grow with your business."'::jsonb, 'hero'),
  ('footer_tagline',  '"Digital product studio."'::jsonb, 'footer'),
  ('social_facebook',  '""'::jsonb,                   'social'),
  ('social_twitter',   '""'::jsonb,                   'social'),
  ('social_linkedin',  '""'::jsonb,                   'social'),
  ('social_instagram', '""'::jsonb,                   'social')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Missing columns on existing tables
-- ============================================================
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS converted_client_id uuid REFERENCES public.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON public.leads (assigned_to);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone text;

-- ============================================================
-- Row Level Security
-- All access runs through service-role server actions, so RLS is
-- enabled with no permissive policies (default deny for anon/authenticated).
-- ============================================================
ALTER TABLE public.projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_followups  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings   ENABLE ROW LEVEL SECURITY;

-- Support ticket numbers must stay unique under concurrency.
CREATE UNIQUE INDEX IF NOT EXISTS support_tickets_ticket_number_uniq
  ON public.support_tickets (ticket_number);

export interface SiteConfig {
  brand_id: string;
  brand_name: string;
  brand_tagline: string;
  logo_url: string;
  logo_3d_url: string;
  announcement_text: string;
  announcement_link: string;
  contact_email: string;
  contact_phone: string;
  office_address: string;
  whatsapp_number: string;
  whatsapp_message: string;
  crm_endpoint: string;
  crm_api_token: string;
  copyright_text: string;
  tawk_property_id: string;
  google_apps_script_url: string;
  crm_endpoint_url: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  x: string;
  linkedin: string;
  youtube: string;
  whatsapp: string;
}

export interface HeroData {
  eyebrow: string;
  heading: string;
  subtitle: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  banner_image: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  enabled: boolean;
  upfront_price: number;
  monthly_subscription: string;
  yr2_renewal_cost: string;
  direct_cost: number;
  agent_upfront_rate: number;
  agent_upfront_pkr: number;
  agent_monthly_rate: number;
  agent_monthly_pkr: number;
  tl_rate: number;
  tl_pkr: number;
  mgr_rate: number;
  mgr_pkr: number;
  total_comm_pkr: number;
  total_comm_rate: number;
  company_net_pkr: number;
  company_net_pct: number;
}

export interface SiteData {
  config: SiteConfig;
  social: SocialLinks;
  hero: HeroData;
  stats: Stat[];
  services: Service[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  initials: string;
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductCard {
  icon: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  borderColor: string;
}

export interface IndustryHub {
  id: string;
  label: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  features: string[];
  price: string;
}

// ============================================================
// Database Types (Supabase)
// ============================================================

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

export interface BlogPostInsert {
  slug: string;
  title: string;
  content: string;
  excerpt?: string | null;
  category: string;
  featured_image?: string | null;
  author?: string;
  read_time?: string | null;
  featured?: boolean;
  published?: boolean;
  published_at?: string | null;
}

export interface DBService {
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

export interface DBServiceInsert {
  slug: string;
  name: string;
  description: string;
  short_description?: string | null;
  price: string;
  price_period?: string | null;
  category: string;
  icon?: string | null;
  features?: string[];
  active?: boolean;
  sort_order?: number;
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
  metrics: CaseMetric[];
  tech_stack: string[];
  featured_image: string | null;
  gallery: string[];
  timeline: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface CaseMetric {
  label: string;
  before: string;
  after: string;
  change: string;
}

export interface CaseStudyInsert {
  slug: string;
  client_name: string;
  industry: string;
  result_summary: string;
  description: string;
  challenge?: string | null;
  solution?: string | null;
  metrics?: CaseMetric[];
  tech_stack?: string[];
  featured_image?: string | null;
  gallery?: string[];
  timeline?: string | null;
  featured?: boolean;
  published?: boolean;
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

export interface ContactSubmissionInsert {
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
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

export interface LeadInsert {
  name: string;
  email?: string | null;
  phone?: string | null;
  service: string;
  value?: string | null;
  status?: string;
  notes?: string | null;
}

// ============================================================
// Portal Types
// ============================================================

export interface Project {
  id: string;
  client_email: string;
  name: string;
  category: string;
  description: string;
  progress: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_email: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  client_email: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

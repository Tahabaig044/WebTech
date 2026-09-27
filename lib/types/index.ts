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
  assigned_to: string | null;
  converted_client_id: string | null;
  created_at: string;
}

export interface LeadWithAssignee extends Lead {
  assignee_name?: string | null;
  assignee_email?: string | null;
  converted_client_name?: string | null;
  converted_client_email?: string | null;
}

export interface LeadInsert {
  name: string;
  email?: string | null;
  phone?: string | null;
  service: string;
  value?: string | null;
  status?: string;
  notes?: string | null;
  assigned_to?: string | null;
}

export interface LeadFollowup {
  id: string;
  lead_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  due_date: string;
  status: string;
  completed_at: string | null;
  created_at: string;
}

export interface LeadFollowupWithAssignee extends LeadFollowup {
  assignee_name?: string | null;
  assignee_email?: string | null;
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface CRMAnalytics {
  dateRange: string;
  leads: {
    total: number;
    new: number;
    contacted: number;
    proposalSent: number;
    closedWon: number;
    closedLost: number;
    converted: number;
    byService: Array<{ service: string; count: number }>;
    byAssignee: Array<{ name: string; count: number }>;
  };
  conversion: {
    totalConverted: number;
    conversionRate: number;
    lostRate: number;
  };
  followups: {
    pending: number;
    completed: number;
    overdue: number;
    dueToday: number;
    byAssignee: Array<{ name: string; pending: number; completed: number }>;
  };
  revenue: {
    totalPipeline: number;
    convertedValue: number;
    lostValue: number;
  };
  support: {
    open: number;
    closed: number;
    pending: number;
    byPriority: Array<{ priority: string; count: number }>;
  };
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

export interface ProjectInsert {
  client_email: string;
  name: string;
  category?: string;
  description?: string;
  progress?: number;
  status?: string;
}

export interface Invoice {
  id: string;
  client_email: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  project_id: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface InvoicePayment {
  id: string;
  invoice_id: string;
  receipt_number: string;
  amount: number;
  payment_date: string;
  payment_mode: string;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  client_email: string;
  ticket_number: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_email: string;
  sender_role: "client" | "agent" | "admin";
  message: string;
  is_internal_note: boolean;
  created_at: string;
}

// ============================================================
// Admin Aggregate Types
// ============================================================

export interface AdminClient {
  email: string;
  name: string | null;
  role: string;
  created_at: string;
  project_count: number;
  invoice_count: number;
  total_spent: number;
  last_project_date: string | null;
}

export interface AdminInvoice {
  id: string;
  client_email: string;
  invoice_number: string;
  amount: number;
  currency: string | null;
  status: string | null;
  description: string | null;
  project_id: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

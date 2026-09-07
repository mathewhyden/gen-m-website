export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  company?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export type ProjectStatus = 
  | 'ENQUIRY'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'TESTING'
  | 'CLIENT_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'INVOICE_GENERATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'COMPLETED';

export type BookingStatus = 
  | 'new' | 'confirmed' | 'completed' | 'cancelled' 
  | 'NEW' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export type EnquiryStatus = 
  | 'new' | 'contacted' | 'converted' | 'archived'
  | 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED';

export type InvoiceStatus = 
  | 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'
  | 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';

export type PaymentStatus = 
  | 'success' | 'pending' | 'failed'
  | 'SUCCESS' | 'PENDING' | 'FAILED';

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
  completedAt?: string;
}

export interface ProjectFeedback {
  id: string;
  projectId: string;
  type: 'approval' | 'change_request' | 'APPROVAL' | 'CHANGE_REQUEST';
  authorName: string;
  authorEmail: string;
  feedback: string;
  attachments?: string[];
  submittedAt: string;
  resolved?: boolean;
}

export interface Project {
  id: string;
  projectId: string; // e.g. GM-PRJ-2026-001
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  name: string;
  slug: string;
  serviceId?: string;
  serviceName: string;
  description: string;
  longDescription?: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  startDate?: string;
  expectedDelivery: string;
  amount: number;
  budget?: string;
  currency: string;
  progress: number; // 0 - 100
  status: ProjectStatus;
  featured?: boolean;
  category: string; // 'Web Development' | 'Graphic Design' | 'AI Solutions' | 'Branding'
  milestones?: ProjectMilestone[];
  feedbacks?: ProjectFeedback[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate?: number;
  unitPrice?: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. GM-2026-001
  projectId: string;
  projectName: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  totalAmount?: number;
  currency: string;
  issueDate?: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
  paymentId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  paymentId?: string;
  transactionId?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  projectId?: string;
  clientName?: string;
  payerName?: string;
  clientEmail?: string;
  payerEmail?: string;
  amount: number;
  currency: string;
  gateway: string;
  method?: string;
  paymentMethod?: string;
  status: PaymentStatus;
  transactionRef?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type PaymentRecord = Payment;

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  date: string;
  time: string;
  meetingType: 'google_meet' | 'zoom' | 'phone' | string;
  meetingLink?: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget: string;
  timeline?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template?: string;
  status: 'sent' | 'delivered' | 'failed' | 'SENT' | 'DELIVERED' | 'FAILED' | string;
  body?: string;
  data?: Record<string, unknown>;
  sentAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  iconName?: string;
  badge?: string;
  priceRange?: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating?: number;
  avatar?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  monthlyExpenses: number;
  totalExpenses: number;
  profitMarginPercent?: number;
  currentMonthName?: string;
  activeProjects: number;
  totalProjects: number;
  totalBookings: number;
  upcomingBookings: number;
  pendingInvoices: number;
  totalEnquiries: number;
  newEnquiries: number;
}

import fs from 'fs';
import path from 'path';
import { 
  Project, 
  Booking, 
  Enquiry, 
  Invoice, 
  Payment, 
  User, 
  EmailLog, 
  ServiceItem, 
  Testimonial,
  ProjectMilestone,
  ProjectFeedback,
  AdminStats,
  Expense
} from './types';

const STORE_PATH = path.join(process.cwd(), '.data', 'db_store.json');

function saveStoreToDisk(
  bookings: Booking[], 
  enquiries: Enquiry[], 
  expenses: Expense[] = [], 
  payments: Payment[] = [], 
  invoices: Invoice[] = []
) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify({ bookings, enquiries, expenses, payments, invoices }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store to disk:', err);
  }
}

function loadStoreFromDisk(): { 
  bookings: Booking[]; 
  enquiries: Enquiry[]; 
  expenses?: Expense[];
  payments?: Payment[];
  invoices?: Invoice[];
} | null {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load store from disk:', err);
  }
  return null;
}

// Global singleton in-memory database instance to persist across Next.js API calls in Node runtime
interface GlobalDatabase {
  users: User[];
  projects: Project[];
  bookings: Booking[];
  enquiries: Enquiry[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  emailLogs: EmailLog[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  isInitialized: boolean;
}

const globalForDb = globalThis as unknown as { __genm_db?: GlobalDatabase };

const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Gen-M Admin',
    email: 'admin@gen-m.com',
    password: 'Mathew@0208',
    role: 'admin',
    company: 'Gen-M Studio',
    phone: '+91 87542 54943',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'usr-admin-2',
    name: 'Mathew Hyden',
    email: 'mathewhyden028@gmail.com',
    password: 'Mathew@0208',
    role: 'admin',
    company: 'Gen-M Studio Owner',
    phone: '+91 87542 54943',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'usr-admin-3',
    name: 'Gen-M Studio Admin',
    email: 'admin.genm@gmail.com',
    password: 'Mathew@0208',
    role: 'admin',
    company: 'Gen-M Studio',
    phone: '+91 87542 54943',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  }
];

const initialProjects: Project[] = [
  {
    id: 'prj-1',
    projectId: 'GM-PRJ-2026-001',
    clientId: 'usr-client-1',
    clientName: 'Sindhuja Ramesh',
    clientEmail: 'sindhu@hebeart.com',
    clientCompany: 'Hebe Art Studio',
    name: 'Hebe Art Studio',
    slug: 'hebe-art-studio',
    serviceId: 'srv-web',
    serviceName: 'Web Development',
    category: 'Web Development',
    description: 'A custom digital gallery and portfolio website created for contemporary visual art.',
    longDescription: 'Hebe Art Studio required a modern digital gallery with smooth image inspection, exhibition timelines, and direct client inquiries. Built with clean visual design and mobile responsiveness.',
    coverImage: '/websites/hebe-art-studio.jpg',
    gallery: [
      '/websites/hebe-art-studio.jpg',
      '/graphic-design/graphic-work-1-1.jpg',
      '/graphic-design/graphic-work-2-1.jpg',
    ],
    technologies: ['Modern Web', 'Tailwind CSS', 'Responsive Layout'],
    liveUrl: 'https://hebeartstudio.netlify.app/portfolio',
    startDate: '2026-01-10',
    expectedDelivery: '2026-02-28',
    amount: 85000,
    budget: '₹85,000',
    currency: 'INR',
    progress: 100,
    status: 'COMPLETED',
    featured: true,
    milestones: [
      { id: 'm-1', projectId: 'prj-1', title: 'Brand Identity & Layout Design', description: 'Curated typography & visual structure', status: 'completed', dueDate: '2026-01-20', completedAt: '2026-01-19' },
      { id: 'm-2', projectId: 'prj-1', title: 'Gallery Build & Animations', description: 'Clean layout and smooth transitions', status: 'completed', dueDate: '2026-02-10', completedAt: '2026-02-09' },
      { id: 'm-3', projectId: 'prj-1', title: 'Client Review & Launch', description: 'Tested and launched live for client', status: 'completed', dueDate: '2026-02-25', completedAt: '2026-02-24' }
    ],
    feedbacks: [
      { id: 'f-1', projectId: 'prj-1', type: 'approval', authorName: 'Sindhuja Ramesh', authorEmail: 'sindhu@hebeart.com', feedback: 'The exhibition transitions and clean art layout look great! Approved for final launch.', submittedAt: '2026-02-24T14:30:00Z', resolved: true }
    ],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-26T18:00:00Z',
  },
  {
    id: 'prj-2',
    projectId: 'GM-PRJ-2026-002',
    clientId: 'usr-client-2',
    clientName: 'Carlos Santos',
    clientEmail: 'carlos@csmarcom.com',
    clientCompany: 'CS Marcom Agency',
    name: 'CS Marcom Agency',
    slug: 'cs-marcom',
    serviceId: 'srv-marketing',
    serviceName: 'Web Development',
    category: 'Web Development',
    description: 'A clean modern website and services showcase for CS Marcom Agency.',
    longDescription: 'A modern marketing agency website for CS Marcom featuring service matrices, case study showcases, and seamless client contact forms.',
    coverImage: '/websites/cs-marcom.jpg',
    gallery: [
      '/websites/cs-marcom.jpg',
      '/graphic-design/graphic-work-18-1.jpg',
    ],
    technologies: ['Web Design', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://csmarcom.pages.dev/',
    startDate: '2026-01-25',
    expectedDelivery: '2026-03-15',
    amount: 120000,
    budget: '₹1,20,000',
    currency: 'INR',
    progress: 85,
    status: 'CLIENT_REVIEW',
    featured: true,
    milestones: [
      { id: 'm-201', projectId: 'prj-2', title: 'Structure & Planning', description: 'Page outline and wireframe layouts', status: 'completed', dueDate: '2026-02-05', completedAt: '2026-02-04' },
      { id: 'm-202', projectId: 'prj-2', title: 'Design & Interactive Pages', description: 'Service listings and interactive sections', status: 'completed', dueDate: '2026-02-25', completedAt: '2026-02-23' },
      { id: 'm-203', projectId: 'prj-2', title: 'Contact Integration & Review', description: 'Contact form setup and review stage', status: 'in_progress', dueDate: '2026-03-10' }
    ],
    feedbacks: [],
    createdAt: '2026-01-25T09:00:00Z',
    updatedAt: '2026-03-01T11:20:00Z',
  },
  {
    id: 'prj-3',
    projectId: 'GM-PRJ-2026-003',
    clientId: 'usr-client-1',
    clientName: 'Sindhuja Ramesh',
    clientEmail: 'sindhu@hebeart.com',
    clientCompany: 'Cosmo Arts',
    name: 'Cosmo Arts Digital Experience',
    slug: 'cosmo-arts',
    serviceId: 'srv-web',
    serviceName: 'Web Development',
    category: 'Web Development',
    description: 'Visual arts studio showcase and digital portfolio experience for modern artists.',
    longDescription: 'A visual studio website featuring modern portfolio layouts, artwork showcases, and clean typography tailored for artistic expression.',
    coverImage: '/websites/cosmo-arts.jpg',
    gallery: [
      '/websites/cosmo-arts.jpg',
      '/graphic-design/graphic-work-10-1.jpg',
    ],
    technologies: ['Web Design', 'Brand Identity', 'Responsive Design'],
    liveUrl: 'https://cosmoarts.pages.dev/',
    startDate: '2026-02-01',
    expectedDelivery: '2026-03-20',
    amount: 65000,
    budget: '₹65,000',
    currency: 'INR',
    progress: 70,
    status: 'IN_PROGRESS',
    featured: true,
    milestones: [
      { id: 'm-301', projectId: 'prj-3', title: 'Visual Theme & Moodboards', description: 'Color palette and layout structure', status: 'completed', dueDate: '2026-02-15', completedAt: '2026-02-14' },
      { id: 'm-302', projectId: 'prj-3', title: 'Website Build & Portfolio Setup', description: 'Custom gallery pages and responsive styling', status: 'in_progress', dueDate: '2026-03-05' },
    ],
    feedbacks: [],
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-03-01T15:00:00Z',
  },
  {
    id: 'prj-4',
    projectId: 'GM-PRJ-2026-004',
    clientId: 'usr-client-2',
    clientName: 'David Miller',
    clientEmail: 'david@gospelcare.org',
    clientCompany: 'Gospel Ministry Birthday Care',
    name: 'Gospel Ministry Birthday Care',
    slug: 'gospel-ministry',
    serviceId: 'srv-web',
    serviceName: 'Web Development',
    category: 'Web Development',
    description: 'An interactive community portal for celebrating member milestones and birthdays.',
    longDescription: 'A community engagement portal that streamlines birthday greetings, milestone notifications, and member outreach with a friendly, accessible interface.',
    coverImage: '/websites/gospel-care.jpg',
    gallery: [
      '/websites/gospel-care.jpg',
      '/graphic-design/graphic-work-11-1.jpg',
    ],
    technologies: ['Web Portal', 'Modern Design', 'Notifications'],
    liveUrl: 'https://gospel-ministry-believers-birthday-care.ai.studio/',
    startDate: '2026-01-15',
    expectedDelivery: '2026-02-15',
    amount: 75000,
    budget: '₹75,000',
    currency: 'INR',
    progress: 100,
    status: 'COMPLETED',
    featured: true,
    milestones: [
      { id: 'm-401', projectId: 'prj-4', title: 'Member Portal Design', description: 'Friendly layout and milestone dashboard', status: 'completed', dueDate: '2026-01-30', completedAt: '2026-01-29' },
      { id: 'm-402', projectId: 'prj-4', title: 'Reminders & Live Testing', description: 'Notification reminders and testing', status: 'completed', dueDate: '2026-02-12', completedAt: '2026-02-12' }
    ],
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-02-16T10:00:00Z',
  }
];

const initialInvoices: Invoice[] = [];

const initialPayments: Payment[] = [];

const initialExpenses: Expense[] = [];

const initialBookings: Booking[] = [];

const initialEnquiries: Enquiry[] = [];

const initialEmailLogs: EmailLog[] = [
  {
    id: 'em-1',
    to: 'sindhu@hebeart.com',
    subject: 'Project Verification Request: Hebe Art Studio',
    template: 'client_review_request',
    status: 'delivered',
    data: { projectId: 'prj-1', projectName: 'Hebe Art Studio' },
    sentAt: '2026-02-23T11:00:00Z',
  },
  {
    id: 'em-2',
    to: 'sindhu@hebeart.com',
    subject: 'Invoice GM-2026-001 from Gen-M Studio',
    template: 'invoice_generated',
    status: 'delivered',
    data: { invoiceNumber: 'GM-2026-001', amount: 85000 },
    sentAt: '2026-02-25T10:05:00Z',
  },
  {
    id: 'em-3',
    to: 'admin@gen-m.com',
    subject: 'Payment Received: GM-2026-001 (₹85,000)',
    template: 'payment_success_admin',
    status: 'delivered',
    data: { invoiceNumber: 'GM-2026-001', amount: 85000 },
    sentAt: '2026-02-26T16:45:05Z',
  }
];

const initialServices: ServiceItem[] = [
  {
    id: 'srv-branding',
    title: 'Brand Identity',
    description: 'Distinct visual identity systems, typography pairings, color theories, and comprehensive brand books that command authority.',
    iconName: 'Palette',
    features: ['Brand Guidelines & Systems', 'Typography & Color Mastery', 'Vector Logos & Marks', 'Print & Digital Collateral'],
    badge: 'Core Foundation',
    priceRange: 'From ₹25,000',
  },
  {
    id: 'srv-graphic',
    title: 'Graphic Design',
    description: 'High-impact visual creatives, pitch decks, exhibition visuals, marketing assets, and product packaging crafted with precision.',
    iconName: 'Sparkles',
    features: ['Campaign & Social Creatives', 'Pitch Decks & Presentations', 'Packaging & Print Production', 'Exhibition & Vector Art'],
    badge: 'Visual Design',
    priceRange: 'From ₹15,000',
  },
  {
    id: 'srv-marketing',
    title: 'Digital Marketing',
    description: 'Data-driven growth funnels, conversion rate optimization, search ranking dominance, and precision paid ad campaigns.',
    iconName: 'TrendingUp',
    features: ['Conversion Funnel Architecture', 'Technical SEO Mastery', 'Performance Ad Scaling', 'Lifecycle Email Marketing'],
    badge: 'Marketing & Growth',
    priceRange: 'From ₹20,000/mo',
  },
  {
    id: 'srv-ai',
    title: 'AI Agents & Automation',
    description: 'Bespoke autonomous AI agents, enterprise workflow automations, and LLM-powered business intelligence engines.',
    iconName: 'Brain',
    features: ['Autonomous AI Agent Fleets', 'Internal Workflow Automation', 'Custom LLM Fine-Tuning', 'Predictive Business Logic'],
    badge: 'Next-Gen',
    priceRange: 'From ₹45,000',
  },
  {
    id: 'srv-web',
    title: 'Web Development',
    description: 'High-performance Next.js web applications, blazing-fast landing experiences, headless CMS architectures, and custom portals.',
    iconName: 'Monitor',
    features: ['Next.js 16 & React 19', 'Sub-second Page Speeds', 'Custom Admin Dashboards', 'Headless CMS & Commerce'],
    badge: 'Flagship',
    priceRange: 'From ₹35,000',
  },
  {
    id: 'srv-app',
    title: 'App Development',
    description: 'Cross-platform mobile applications for iOS and Android, built with speed, reliability, and modern UI.',
    iconName: 'Smartphone',
    features: ['iOS & Android Apps', 'Cross-Platform Experience', 'Real-time Push Notifications', 'API & Database Integration'],
    badge: 'Full-Stack',
    priceRange: 'From ₹50,000',
  }
];

const initialTestimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sindhuja Ramesh',
    role: 'Founder & Lead Curator',
    company: 'Hebe Art Studio',
    quote: 'Gen-M transformed our digital presence into a living, high-contrast gallery. The client portal, real-time reviews, and seamless payment flow made working with them effortless.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 't-2',
    name: 'Carlos Santos',
    role: 'Managing Director',
    company: 'CS Marcom Agency',
    quote: 'The level of engineering rigor and aesthetic precision Gen-M delivers is unmatched. Our conversion rates increased by 140% within the first month of launch.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 't-3',
    name: 'David Miller',
    role: 'Operations Director',
    company: 'Gospel Ministry Birthday Care',
    quote: 'Automating our community care outreach was a game changer. The team built an intuitive system that our volunteers love using daily.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  }
];

function getDatabase(): GlobalDatabase {
  if (!globalForDb.__genm_db) {
    const saved = loadStoreFromDisk();
    globalForDb.__genm_db = {
      users: initialUsers,
      projects: initialProjects,
      bookings: saved?.bookings || [],
      enquiries: saved?.enquiries || [],
      invoices: saved?.invoices || [],
      payments: saved?.payments || [],
      expenses: saved?.expenses || [],
      emailLogs: initialEmailLogs,
      services: initialServices,
      testimonials: initialTestimonials,
      isInitialized: true,
    };
  }
  const dbInstance = globalForDb.__genm_db;
  // Keep customer list clean without artificial fake clients
  dbInstance.users = (dbInstance.users || []).filter(u => u.role === 'admin');
  dbInstance.bookings = (dbInstance.bookings || []).filter(b => b.id !== 'bk-1' && b.id !== 'bk-2');
  dbInstance.enquiries = (dbInstance.enquiries || []).filter(e => e.id !== 'enq-1' && e.id !== 'enq-2' && e.email !== 'test@example.com');
  if (!dbInstance.expenses) dbInstance.expenses = [];
  if (!dbInstance.payments) dbInstance.payments = [];
  if (!dbInstance.invoices) dbInstance.invoices = [];
  // Ensure admin user password is up to date
  const adminUser = dbInstance.users.find(u => u.email.toLowerCase() === 'admin.genm@gmail.com');
  if (adminUser) {
    adminUser.password = 'Mathew@0208';
  }
  const mathewUser = dbInstance.users.find(u => u.email.toLowerCase() === 'mathewhyden028@gmail.com');
  if (mathewUser) {
    mathewUser.password = 'Mathew@0208';
  }
  return dbInstance;
}

export const db = {
  // Users & Auth
  getUsers: () => getDatabase().users,
  findUserByEmail: (email: string) => {
    const normalized = (email || '').trim().toLowerCase();
    const database = getDatabase();
    const user = database.users.find(u => u.email.toLowerCase() === normalized);
    if (user && (normalized === 'admin.genm@gmail.com' || normalized === 'mathewhyden028@gmail.com')) {
      user.password = 'Mathew@0208';
    }
    return user;
  },
  findUserById: (id: string) => getDatabase().users.find(u => u.id === id),
  createUser: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    getDatabase().users.push(newUser);
    return newUser;
  },

  // Projects
  getProjects: () => getDatabase().projects,
  getProjectById: (id: string) => getDatabase().projects.find(p => p.id === id || p.projectId === id || p.slug === id),
  getProjectsByClientId: (clientId: string) => getDatabase().projects.filter(p => p.clientId === clientId),
  createProject: (project: Partial<Project>): Project => {
    const dbInstance = getDatabase();
    const count = dbInstance.projects.length + 1;
    const projectNumber = `GM-PRJ-2026-${String(count).padStart(3, '0')}`;
    const newProject: Project = {
      id: `prj-${Date.now()}`,
      projectId: projectNumber,
      clientId: project.clientId || 'usr-client-1',
      clientName: project.clientName || 'Client',
      clientEmail: project.clientEmail || 'client@example.com',
      clientCompany: project.clientCompany || '',
      name: project.name || 'New Project',
      slug: project.slug || (project.name || 'new-project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      serviceId: project.serviceId || 'srv-web',
      serviceName: project.serviceName || 'Web Development',
      category: project.category || 'Web Development',
      description: project.description || '',
      longDescription: project.longDescription || project.description || '',
      coverImage: project.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      gallery: project.gallery || [],
      technologies: project.technologies || ['Next.js', 'Tailwind CSS'],
      liveUrl: project.liveUrl,
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      expectedDelivery: project.expectedDelivery || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      amount: project.amount || 2000,
      currency: project.currency || 'USD',
      progress: project.progress || 10,
      status: project.status || 'CONFIRMED',
      featured: project.featured ?? false,
      milestones: project.milestones || [
        { id: `m-${Date.now()}-1`, projectId: `prj-${Date.now()}`, title: 'Kickoff & Discovery', description: 'Project alignment and asset gathering', status: 'in_progress', dueDate: new Date().toISOString().split('T')[0] }
      ],
      feedbacks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbInstance.projects.unshift(newProject);
    return newProject;
  },
  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const project = db.getProjectById(id);
    if (!project) return null;
    Object.assign(project, updates, { updatedAt: new Date().toISOString() });
    return project;
  },
  deleteProject: (id: string): boolean => {
    const dbInstance = getDatabase();
    const index = dbInstance.projects.findIndex(p => p.id === id || p.projectId === id);
    if (index === -1) return false;
    dbInstance.projects.splice(index, 1);
    return true;
  },

  // Milestones
  addMilestone: (projectId: string, milestone: Omit<ProjectMilestone, 'id' | 'projectId'>): ProjectMilestone | null => {
    const project = db.getProjectById(projectId);
    if (!project) return null;
    const newM: ProjectMilestone = {
      ...milestone,
      id: `m-${Date.now()}`,
      projectId: project.id,
    };
    if (!project.milestones) project.milestones = [];
    project.milestones.push(newM);
    return newM;
  },
  updateMilestone: (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>): ProjectMilestone | null => {
    const project = db.getProjectById(projectId);
    if (!project || !project.milestones) return null;
    const m = project.milestones.find(item => item.id === milestoneId);
    if (!m) return null;
    Object.assign(m, updates);
    return m;
  },

  // Feedback & Approvals
  addFeedback: (projectId: string, feedback: Omit<ProjectFeedback, 'id' | 'projectId' | 'submittedAt'>): ProjectFeedback | null => {
    const project = db.getProjectById(projectId);
    if (!project) return null;
    const newFb: ProjectFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      projectId: project.id,
      submittedAt: new Date().toISOString(),
    };
    if (!project.feedbacks) project.feedbacks = [];
    project.feedbacks.unshift(newFb);

    // Update project state based on feedback type
    if (feedback.type === 'approval') {
      project.status = 'APPROVED';
      project.progress = 100;
    } else if (feedback.type === 'change_request') {
      project.status = 'CHANGES_REQUESTED';
    }
    project.updatedAt = new Date().toISOString();

    // Log email notification
    db.logEmail({
      to: 'admin@gen-m.com',
      subject: `Project ${feedback.type === 'approval' ? 'Approved' : 'Change Requested'}: ${project.name}`,
      template: feedback.type === 'approval' ? 'project_approved_admin' : 'changes_requested_admin',
      data: { projectId: project.id, feedback: feedback.feedback }
    });

    return newFb;
  },

  // Invoices
  getInvoices: () => getDatabase().invoices,
  getInvoiceById: (id: string) => getDatabase().invoices.find(i => i.id === id || i.invoiceNumber === id),
  getInvoicesByClientId: (clientId: string) => getDatabase().invoices.filter(i => i.clientId === clientId),
  createInvoice: (invoice: Partial<Invoice>): Invoice => {
    const dbInstance = getDatabase();
    const count = dbInstance.invoices.length + 1;
    const invoiceNumber = `GM-2026-${String(count).padStart(3, '0')}`;
    
    const items = invoice.items || [
      { id: `it-${Date.now()}-1`, description: 'Agency Project Delivery & Licensing', quantity: 1, rate: invoice.total || 2000, amount: invoice.total || 2000 }
    ];
    const subtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
    const tax = invoice.tax || 0;
    const discount = invoice.discount || 0;
    const total = subtotal + tax - discount;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      projectId: invoice.projectId || 'prj-1',
      projectName: invoice.projectName || 'Project Delivery',
      clientId: invoice.clientId || 'usr-client-1',
      clientName: invoice.clientName || 'Client Name',
      clientEmail: invoice.clientEmail || 'client@example.com',
      clientCompany: invoice.clientCompany || '',
      clientAddress: invoice.clientAddress || '',
      items,
      subtotal,
      tax,
      discount,
      total,
      currency: invoice.currency || 'USD',
      dueDate: invoice.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: invoice.status || 'sent',
      notes: invoice.notes || 'Thank you for choosing Gen-M Studio. All work is covered under our satisfaction warranty.',
      createdAt: new Date().toISOString(),
    };

    dbInstance.invoices.unshift(newInvoice);

    // Update project state if associated
    if (newInvoice.projectId) {
      const project = db.getProjectById(newInvoice.projectId);
      if (project && project.status === 'APPROVED') {
        project.status = 'INVOICE_GENERATED';
      }
    }

    // Log email
    db.logEmail({
      to: newInvoice.clientEmail,
      subject: `Invoice ${newInvoice.invoiceNumber} from Gen-M Studio`,
      template: 'invoice_generated',
      data: { invoiceNumber: newInvoice.invoiceNumber, total: newInvoice.total }
    });

    return newInvoice;
  },
  updateInvoice: (id: string, updates: Partial<Invoice>): Invoice | null => {
    const invoice = db.getInvoiceById(id);
    if (!invoice) return null;
    Object.assign(invoice, updates);
    return invoice;
  },

  // Payments
  getPayments: () => getDatabase().payments,
  processPayment: (params: {
    invoiceId: string;
    amount: number;
    currency: string;
    gateway: 'razorpay' | 'stripe' | 'bank_transfer';
    method: 'card' | 'upi' | 'netbanking' | 'wire';
    transactionRef: string;
    metadata?: Record<string, any>;
  }): Payment | null => {
    const invoice = db.getInvoiceById(params.invoiceId);
    if (!invoice) return null;

    const newPayment: Payment = {
      id: `pmt-${Date.now()}`,
      paymentId: `pay_GM_${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      projectId: invoice.projectId,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      amount: params.amount,
      currency: params.currency,
      gateway: params.gateway,
      method: params.method,
      status: 'success',
      transactionRef: params.transactionRef,
      metadata: params.metadata,
      createdAt: new Date().toISOString(),
    };

    getDatabase().payments.unshift(newPayment);

    // Update invoice status
    invoice.status = 'paid';
    invoice.paymentId = newPayment.paymentId;
    invoice.paidAt = newPayment.createdAt;

    // Update project status
    if (invoice.projectId) {
      const project = db.getProjectById(invoice.projectId);
      if (project) {
        project.status = 'PAID';
        project.progress = 100;
      }
    }

    // Email logs
    db.logEmail({
      to: invoice.clientEmail,
      subject: `Payment Receipt: ${invoice.invoiceNumber} (Paid in Full)`,
      template: 'payment_success_client',
      data: { paymentId: newPayment.paymentId, amount: newPayment.amount }
    });
    db.logEmail({
      to: 'admin@gen-m.com',
      subject: `Payment Verified: ${invoice.invoiceNumber} - ₹${newPayment.amount.toLocaleString('en-IN')}`,
      template: 'payment_success_admin',
      data: { paymentId: newPayment.paymentId, amount: newPayment.amount }
    });

    return newPayment;
  },

  // Bookings
  getBookings: () => getDatabase().bookings,
  getBookingById: (id: string) => getDatabase().bookings.find(b => b.id === id),
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
    const dbInst = getDatabase();
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    dbInst.bookings.unshift(newBooking);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries);

    // Send notifications
    db.logEmail({
      to: newBooking.email,
      subject: 'Consultation Confirmed with Gen-M Studio',
      template: 'booking_client_confirmation',
      data: { date: newBooking.date, time: newBooking.time, service: newBooking.service }
    });
    db.logEmail({
      to: 'admin@gen-m.com',
      subject: `New Consultation Booked: ${newBooking.name} (${newBooking.company || 'Direct'})`,
      template: 'booking_admin_alert',
      data: { name: newBooking.name, date: newBooking.date, time: newBooking.time }
    });

    return newBooking;
  },
  updateBooking: (id: string, updates: Partial<Booking>): Booking | null => {
    const booking = db.getBookingById(id);
    if (!booking) return null;
    Object.assign(booking, updates);
    const dbInst = getDatabase();
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries);
    return booking;
  },

  // Enquiries
  getEnquiries: () => getDatabase().enquiries,
  createEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry => {
    const dbInst = getDatabase();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    dbInst.enquiries.unshift(newEnquiry);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries);

    db.logEmail({
      to: 'admin@gen-m.com',
      subject: `New Project Enquiry: ${newEnquiry.name} (${newEnquiry.service})`,
      template: 'enquiry_admin_alert',
      data: { name: newEnquiry.name, service: newEnquiry.service, budget: newEnquiry.budget }
    });

    return newEnquiry;
  },
  updateEnquiry: (id: string, updates: Partial<Enquiry>): Enquiry | null => {
    const dbInst = getDatabase();
    const enquiry = dbInst.enquiries.find(e => e.id === id);
    if (!enquiry) return null;
    Object.assign(enquiry, updates);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries);
    return enquiry;
  },

  // Email Logs
  getEmailLogs: () => getDatabase().emailLogs,
  logEmail: (log: Omit<EmailLog, 'id' | 'sentAt' | 'status'> & { status?: 'sent' | 'delivered' | 'failed' }): EmailLog => {
    const newLog: EmailLog = {
      ...log,
      id: `em-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: log.status || 'delivered',
      sentAt: new Date().toISOString(),
    };
    getDatabase().emailLogs.unshift(newLog);
    return newLog;
  },

  // Services & CMS
  getServices: () => getDatabase().services,
  updateServices: (services: ServiceItem[]) => {
    getDatabase().services = services;
  },
  getTestimonials: () => getDatabase().testimonials,
  updateTestimonials: (testimonials: Testimonial[]) => {
    getDatabase().testimonials = testimonials;
  },

  // Expenses Tracker
  getExpenses: (): Expense[] => getDatabase().expenses || [],
  getExpenseById: (id: string): Expense | undefined => (getDatabase().expenses || []).find(e => e.id === id),
  createExpense: (expense: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const dbInst = getDatabase();
    if (!dbInst.expenses) dbInst.expenses = [];
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    dbInst.expenses.unshift(newExp);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return newExp;
  },
  deleteExpense: (id: string): boolean => {
    const dbInst = getDatabase();
    if (!dbInst.expenses) return false;
    const index = dbInst.expenses.findIndex(e => e.id === id);
    if (index === -1) return false;
    dbInst.expenses.splice(index, 1);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return true;
  },

  // Dashboard Aggregates
  getAdminStats: () => {
    const data = getDatabase();
    const totalEnquiries = data.enquiries.length;
    const newEnquiries = data.enquiries.filter(e => e.status === 'new').length;
    const upcomingBookings = data.bookings.filter(b => b.status === 'confirmed' || b.status === 'new').length;
    const activeProjects = data.projects.filter(p => !['COMPLETED'].includes(p.status)).length;
    const reviewProjects = data.projects.filter(p => p.status === 'CLIENT_REVIEW' || p.status === 'CHANGES_REQUESTED').length;
    const pendingInvoices = (data.invoices || []).filter(i => i.status !== 'paid' && i.status !== 'cancelled').length;
    
    const successfulPayments = (data.payments || []).filter(p => p.status === 'success');
    const totalRevenue = successfulPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthName = `${monthNames[currentMonth]} ${currentYear}`;

    // Filter payments received in the current month
    const thisMonthPayments = successfulPayments.filter(p => {
      const dateStr = p.createdAt || p.timestamp;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const monthlyRevenue = thisMonthPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Calculate actual expenses for the current month
    const allExpenses = data.expenses || [];
    const thisMonthExpenses = allExpenses.filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    const monthlyExpenses = thisMonthExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalExpenses = allExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Real Net profit for this month (in Rupees): Revenue - Expenses
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    const profitMarginPercent = monthlyRevenue > 0
      ? Math.round((monthlyProfit / monthlyRevenue) * 100)
      : (monthlyExpenses > 0 ? -100 : 0);

    return {
      totalEnquiries,
      newEnquiries,
      upcomingBookings,
      totalBookings: data.bookings.length,
      activeProjects,
      totalProjects: data.projects.length,
      reviewProjects,
      pendingInvoices,
      totalRevenue,
      monthlyRevenue,
      monthlyProfit,
      monthlyExpenses,
      totalExpenses,
      profitMarginPercent,
      currentMonthName,
      recentProjects: data.projects.slice(0, 5),
      recentBookings: data.bookings.slice(0, 5),
      recentEnquiries: data.enquiries.slice(0, 5),
      recentPayments: (data.payments || []).slice(0, 5),
    };
  }
};

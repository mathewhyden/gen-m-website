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
  Expense,
  TeamMember,
  PromoSettings
} from './types';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db as firestore, isFirebaseConfigured } from './firebase';

const STORE_PATH = path.join(process.cwd(), '.data', 'db_store.json');

function saveStoreToDisk(
  bookings: Booking[], 
  enquiries: Enquiry[], 
  expenses: Expense[] = [], 
  payments: Payment[] = [], 
  invoices: Invoice[] = [],
  projects?: Project[],
  team?: TeamMember[],
  promo?: PromoSettings
) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify({ bookings, enquiries, expenses, payments, invoices, projects, team, promo }, null, 2), 'utf-8');
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
  projects?: Project[];
  team?: TeamMember[];
  promo?: PromoSettings;
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

// Remove undefined fields so Firestore doesn't throw an unsupported field error
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
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
  team: TeamMember[];
  promo: PromoSettings;
  isInitialized: boolean;
  hasSyncedFirestore: boolean;
}

const globalForDb = globalThis as unknown as { __genm_db?: GlobalDatabase };

const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Gen-M Admin',
    email: 'admin@gen-m.com',
    password: 'Mathew@0208',
    role: 'admin',
    company: 'Gen-M Tech',
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
    company: 'Gen-M Tech Owner',
    phone: '+91 87542 54943',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'usr-admin-3',
    name: 'Gen-M Tech Admin',
    email: 'admin.genm@gmail.com',
    password: 'Mathew@0208',
    role: 'admin',
    company: 'Gen-M Tech',
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

const initialEmailLogs: EmailLog[] = [];

const initialTeam: TeamMember[] = [
  {
    id: 'team-1',
    name: 'MATHEW',
    role: 'FRONTEND DEVELOPER',
    quote: 'Crafting clean, responsive interfaces that feel effortless to use.',
    image: '/team/mathew.jpg',
    order: 1,
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'team-2',
    name: 'SIDHU',
    role: 'BACKEND DEVELOPER',
    quote: 'Building stable, reliable foundations behind every experience.',
    image: '/team/sidhu.jpg',
    order: 2,
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'team-3',
    name: 'MATHEW',
    role: 'AI SPECIALIST',
    quote: 'Making complex intelligence feel simple, intuitive, and practical.',
    image: '/team/mathew-ai.jpg',
    order: 3,
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

const initialPromo: PromoSettings = {
  enabled: false,
  title: 'Special 50% OFF on Web Development Package!',
  subtitle: 'Commission your bespoke enterprise digital platform with Gen-M Tech. Limited onboarding slots available for this quarter.',
  mediaType: 'none',
  mediaUrl: '',
  ctaText: 'Claim 50% Discount Now',
  ctaLink: '#contact',
  updatedAt: new Date().toISOString(),
};

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
    quote: 'Gen-M transformed our digital presence into a living, high-contrast gallery. The real-time reviews and seamless payment flow made working with them effortless.',
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
      projects: saved?.projects || initialProjects,
      bookings: saved?.bookings || [],
      enquiries: saved?.enquiries || [],
      invoices: saved?.invoices || [],
      payments: saved?.payments || [],
      expenses: saved?.expenses || [],
      emailLogs: initialEmailLogs,
      services: initialServices,
      testimonials: initialTestimonials,
      team: saved?.team || initialTeam,
      promo: saved?.promo || initialPromo,
      isInitialized: true,
      hasSyncedFirestore: false,
    };
  }
  const dbInstance = globalForDb.__genm_db;
  dbInstance.users = (dbInstance.users || []).filter(u => u.role === 'admin');
  dbInstance.bookings = (dbInstance.bookings || []).filter(b => b.id !== 'bk-1' && b.id !== 'bk-2');
  dbInstance.enquiries = (dbInstance.enquiries || []).filter(e => e.id !== 'enq-1' && e.id !== 'enq-2' && e.email !== 'test@example.com');
  if (!dbInstance.expenses) dbInstance.expenses = [];
  if (!dbInstance.payments) dbInstance.payments = [];
  if (!dbInstance.invoices) dbInstance.invoices = [];
  if (!dbInstance.team || dbInstance.team.length === 0) dbInstance.team = initialTeam;
  if (!dbInstance.promo) dbInstance.promo = initialPromo;
  
  const adminUser = dbInstance.users.find(u => u.email.toLowerCase() === 'admin.genm@gmail.com');
  if (adminUser) adminUser.password = 'Mathew@0208';
  const mathewUser = dbInstance.users.find(u => u.email.toLowerCase() === 'mathewhyden028@gmail.com');
  if (mathewUser) mathewUser.password = 'Mathew@0208';

  return dbInstance;
}

export const db = {
  // Users & Auth
  getUsers: async (): Promise<User[]> => getDatabase().users,
  findUserByEmail: (email: string): User | undefined => {
    const normalized = (email || '').trim().toLowerCase();
    const database = getDatabase();
    const user = database.users.find(u => u.email.toLowerCase() === normalized);
    if (user && (normalized === 'admin.genm@gmail.com' || normalized === 'mathewhyden028@gmail.com')) {
      user.password = 'Mathew@0208';
    }
    return user;
  },
  findUserById: (id: string): User | undefined => getDatabase().users.find(u => u.id === id),
  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    getDatabase().users.push(newUser);
    return newUser;
  },

  // Projects CRUD (Firestore collection: 'projects' with graceful fallback)
  getProjects: async (): Promise<Project[]> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'projects'));
        if (!snap.empty) {
          const items: Project[] = [];
          snap.forEach(d => items.push(d.data() as Project));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          getDatabase().projects = items;
          return items;
        } else {
          // Graceful fallback to initial projects and auto-seed so the site is never blank
          for (const p of initialProjects) {
            await setDoc(doc(firestore, 'projects', p.id), sanitizeForFirestore(p));
          }
          getDatabase().projects = initialProjects;
          return initialProjects;
        }
      } catch (err) {
        console.warn('Firestore getProjects warning (using cache):', err);
      }
    }
    return getDatabase().projects;
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'projects', id));
        if (snap.exists()) {
          return snap.data() as Project;
        }
      } catch (err) {
        console.warn('Firestore getProjectById warning:', err);
      }
    }
    return getDatabase().projects.find(p => p.id === id || p.projectId === id || p.slug === id);
  },

  getProjectsByClientId: async (clientId: string): Promise<Project[]> => {
    const all = await db.getProjects();
    return all.filter(p => p.clientId === clientId);
  },

  createProject: async (project: Partial<Project>): Promise<Project> => {
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
      currency: project.currency || 'INR',
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

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'projects', newProject.id), sanitizeForFirestore(newProject));
      } catch (err) {
        console.warn('Firestore createProject error:', err);
      }
    }

    dbInstance.projects.unshift(newProject);
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices, dbInstance.projects, dbInstance.team, dbInstance.promo);
    return newProject;
  },

  saveProject: async (project: Partial<Project>): Promise<Project> => {
    return db.createProject(project);
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    const project = await db.getProjectById(id);
    if (!project) return null;
    const updated = { ...project, ...updates, updatedAt: new Date().toISOString() };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'projects', updated.id), sanitizeForFirestore(updated), { merge: true });
      } catch (err) {
        console.warn('Firestore updateProject error:', err);
      }
    }

    const dbInstance = getDatabase();
    const idx = dbInstance.projects.findIndex(p => p.id === updated.id);
    if (idx >= 0) dbInstance.projects[idx] = updated;
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices, dbInstance.projects, dbInstance.team, dbInstance.promo);
    return updated;
  },

  deleteProject: async (id: string): Promise<boolean> => {
    if (isFirebaseConfigured && firestore) {
      try {
        await deleteDoc(doc(firestore, 'projects', id));
      } catch (err) {
        console.warn('Firestore deleteProject error:', err);
      }
    }
    const dbInstance = getDatabase();
    const index = dbInstance.projects.findIndex(p => p.id === id || p.projectId === id);
    if (index === -1) return false;
    dbInstance.projects.splice(index, 1);
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices, dbInstance.projects, dbInstance.team, dbInstance.promo);
    return true;
  },

  // Milestones
  addMilestone: async (projectId: string, milestone: Omit<ProjectMilestone, 'id' | 'projectId'>): Promise<ProjectMilestone | null> => {
    const project = await db.getProjectById(projectId);
    if (!project) return null;
    const newM: ProjectMilestone = {
      ...milestone,
      id: `m-${Date.now()}`,
      projectId: project.id,
    };
    if (!project.milestones) project.milestones = [];
    project.milestones.push(newM);
    await db.updateProject(project.id, { milestones: project.milestones });
    return newM;
  },

  updateMilestone: async (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>): Promise<ProjectMilestone | null> => {
    const project = await db.getProjectById(projectId);
    if (!project || !project.milestones) return null;
    const m = project.milestones.find(item => item.id === milestoneId);
    if (!m) return null;
    Object.assign(m, updates);
    await db.updateProject(project.id, { milestones: project.milestones });
    return m;
  },

  // Feedback & Approvals
  addFeedback: async (projectId: string, feedback: Omit<ProjectFeedback, 'id' | 'projectId' | 'submittedAt'>): Promise<ProjectFeedback | null> => {
    const project = await db.getProjectById(projectId);
    if (!project) return null;
    const newFb: ProjectFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      projectId: project.id,
      submittedAt: new Date().toISOString(),
    };
    if (!project.feedbacks) project.feedbacks = [];
    project.feedbacks.unshift(newFb);

    if (feedback.type === 'approval') {
      project.status = 'APPROVED';
      project.progress = 100;
    } else if (feedback.type === 'change_request') {
      project.status = 'CHANGES_REQUESTED';
    }
    project.updatedAt = new Date().toISOString();
    await db.updateProject(project.id, project);

    db.logEmail({
      to: 'admin@gen-m.com',
      subject: `Project ${feedback.type === 'approval' ? 'Approved' : 'Change Requested'}: ${project.name}`,
      template: feedback.type === 'approval' ? 'project_approved_admin' : 'changes_requested_admin',
      data: { projectId: project.id, feedback: feedback.feedback }
    });

    return newFb;
  },

  // Invoices (Firestore collection: 'invoices')
  getInvoices: async (): Promise<Invoice[]> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'invoices'));
        if (!snap.empty) {
          const items: Invoice[] = [];
          snap.forEach(d => items.push(d.data() as Invoice));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          getDatabase().invoices = items;
          return items;
        }
      } catch (err) {
        console.warn('Firestore getInvoices warning:', err);
      }
    }
    return getDatabase().invoices;
  },

  getInvoiceById: async (id: string): Promise<Invoice | undefined> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'invoices', id));
        if (snap.exists()) return snap.data() as Invoice;
      } catch (err) {
        console.warn('Firestore getInvoiceById warning:', err);
      }
    }
    return getDatabase().invoices.find(i => i.id === id || i.invoiceNumber === id);
  },

  getInvoicesByClientId: async (clientId: string): Promise<Invoice[]> => {
    const all = await db.getInvoices();
    return all.filter(i => i.clientId === clientId);
  },

  createInvoice: async (invoice: Partial<Invoice>): Promise<Invoice> => {
    const dbInstance = getDatabase();
    const count = dbInstance.invoices.length + 1;
    const invoiceNumber = `GM-2026-${String(count).padStart(3, '0')}`;
    
    const items = (invoice.items && invoice.items.length > 0)
      ? invoice.items.map((it, idx) => {
          const qty = Math.max(1, Number(it.quantity) || 1);
          const unitPrice = it.unitPrice !== undefined ? Number(it.unitPrice) : (it.rate !== undefined ? Number(it.rate) : (Number(it.amount) / qty || 0));
          const amount = it.amount !== undefined ? Number(it.amount) : (qty * unitPrice);
          return {
            id: it.id || `it-${Date.now()}-${idx + 1}`,
            description: it.description || 'Deliverable Milestone',
            quantity: qty,
            rate: unitPrice,
            unitPrice: unitPrice,
            amount: amount,
          };
        })
      : [
          {
            id: `it-${Date.now()}-1`,
            description: 'Project Delivery & Development',
            quantity: 1,
            rate: Number(invoice.total) || 2000,
            unitPrice: Number(invoice.total) || 2000,
            amount: Number(invoice.total) || 2000,
          }
        ];

    const calculatedSubtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
    const subtotal = invoice.subtotal !== undefined && !isNaN(Number(invoice.subtotal))
      ? Number(invoice.subtotal)
      : calculatedSubtotal;
    const tax = Number(invoice.tax) || 0;
    const discount = Number(invoice.discount) || 0;
    const total = invoice.total !== undefined && !isNaN(Number(invoice.total))
      ? Number(invoice.total)
      : (subtotal + tax - discount);

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      invoiceNumber,
      projectId: invoice.projectId || 'prj-custom',
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
      totalAmount: total,
      currency: invoice.currency || 'INR',
      issueDate: invoice.issueDate || new Date().toISOString().split('T')[0],
      dueDate: invoice.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: invoice.status || 'sent',
      notes: invoice.notes || 'Thank you for choosing Gen-M Tech.',
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'invoices', newInvoice.id), sanitizeForFirestore(newInvoice));
      } catch (err) {
        console.warn('Firestore createInvoice error:', err);
      }
    }

    dbInstance.invoices.unshift(newInvoice);
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices);

    if (newInvoice.projectId) {
      const project = await db.getProjectById(newInvoice.projectId);
      if (project && project.status === 'APPROVED') {
        await db.updateProject(project.id, { status: 'INVOICE_GENERATED' });
      }
    }

    db.logEmail({
      to: newInvoice.clientEmail,
      subject: `Invoice ${newInvoice.invoiceNumber} from Gen-M Tech`,
      template: 'invoice_generated',
      data: { invoiceNumber: newInvoice.invoiceNumber, total: newInvoice.total }
    });

    return newInvoice;
  },

  saveInvoice: async (invoice: Partial<Invoice>): Promise<Invoice> => {
    return db.createInvoice(invoice);
  },

  updateInvoice: async (id: string, updates: Partial<Invoice>): Promise<Invoice | null> => {
    const invoice = await db.getInvoiceById(id);
    if (!invoice) return null;
    const updated = { ...invoice, ...updates };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'invoices', updated.id), sanitizeForFirestore(updated), { merge: true });
      } catch (err) {
        console.warn('Firestore updateInvoice error:', err);
      }
    }

    const dbInstance = getDatabase();
    const idx = dbInstance.invoices.findIndex(i => i.id === updated.id);
    if (idx >= 0) dbInstance.invoices[idx] = updated;
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices);
    return updated;
  },

  deleteInvoice: async (id: string): Promise<boolean> => {
    if (isFirebaseConfigured && firestore) {
      try {
        await deleteDoc(doc(firestore, 'invoices', id));
      } catch (err) {
        console.warn('Firestore deleteInvoice error:', err);
      }
    }
    const dbInstance = getDatabase();
    const idx = dbInstance.invoices.findIndex(i => i.id === id);
    if (idx >= 0) dbInstance.invoices.splice(idx, 1);
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices);
    return true;
  },

  clearInvoices: async (): Promise<boolean> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'invoices'));
        for (const d of snap.docs) {
          await deleteDoc(d.ref);
        }
      } catch (err) {
        console.warn('Firestore clearInvoices error:', err);
      }
    }
    const dbInstance = getDatabase();
    dbInstance.invoices = [];
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices);
    return true;
  },

  // Payments (Firestore collection: 'payments')
  getPayments: async (): Promise<Payment[]> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'payments'));
        if (!snap.empty) {
          const items: Payment[] = [];
          snap.forEach(d => items.push(d.data() as Payment));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          getDatabase().payments = items;
          return items;
        }
      } catch (err) {
        console.warn('Firestore getPayments warning:', err);
      }
    }
    return getDatabase().payments;
  },

  processPayment: async (params: {
    invoiceId: string;
    amount: number;
    currency: string;
    gateway: 'razorpay' | 'stripe' | 'bank_transfer';
    method: 'card' | 'upi' | 'netbanking' | 'wire';
    transactionRef: string;
    metadata?: Record<string, any>;
  }): Promise<Payment | null> => {
    const invoice = await db.getInvoiceById(params.invoiceId);
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

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'payments', newPayment.id), sanitizeForFirestore(newPayment));
      } catch (err) {
        console.warn('Firestore processPayment error:', err);
      }
    }

    const dbInst = getDatabase();
    dbInst.payments.unshift(newPayment);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);

    await db.updateInvoice(invoice.id, {
      status: 'paid',
      paymentId: newPayment.paymentId,
      paidAt: newPayment.createdAt,
    });

    if (invoice.projectId) {
      await db.updateProject(invoice.projectId, {
        status: 'PAID',
        progress: 100,
      });
    }

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

  recordClientPayment: async (params: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    projectTitle: string;
    totalFee: number;
    amount: number;
    balanceDue: number;
    paymentMethod: string;
    gateway: string;
    utrNumber: string;
    notes?: string;
    status?: string;
  }): Promise<Payment> => {
    const isFull = params.balanceDue <= 0 || params.amount >= params.totalFee;
    const badge = isFull ? 'Fully Paid' : 'Advance Received';
    const newPayment: Payment = {
      id: `pmt-${Date.now()}`,
      paymentId: `PAY-GM-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionId: params.utrNumber || `TXN-${Date.now()}`,
      clientName: params.clientName,
      payerName: params.clientName,
      clientEmail: params.clientEmail,
      payerEmail: params.clientEmail,
      clientPhone: params.clientPhone || '',
      projectTitle: params.projectTitle,
      totalFee: params.totalFee,
      amount: params.amount,
      advancePaid: params.amount,
      balanceDue: Math.max(0, params.balanceDue),
      currency: 'INR',
      gateway: params.gateway || 'UPI_BANK',
      paymentMethod: params.paymentMethod || 'UPI',
      method: params.paymentMethod || 'UPI',
      status: params.status || badge,
      paymentStatusBadge: badge,
      transactionRef: params.utrNumber,
      utrNumber: params.utrNumber,
      notes: params.notes || '',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'payments', newPayment.id), sanitizeForFirestore(newPayment));
      } catch (err) {
        console.warn('Firestore recordClientPayment error:', err);
      }
    }

    const dbInst = getDatabase();
    dbInst.payments.unshift(newPayment);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);

    db.logEmail({
      to: newPayment.clientEmail || 'client@gen-m.com',
      subject: `Payment Acknowledgment: ${newPayment.projectTitle} (UTR: ${newPayment.utrNumber})`,
      template: 'payment_advance_receipt',
      data: { amount: newPayment.amount, utr: newPayment.utrNumber }
    });

    db.logEmail({
      to: 'admin.genm@gmail.com',
      subject: `New Client Payment Logged: ₹${newPayment.amount.toLocaleString('en-IN')} from ${newPayment.clientName}`,
      template: 'admin_payment_alert',
      data: { client: newPayment.clientName, project: newPayment.projectTitle, amount: newPayment.amount, utr: newPayment.utrNumber }
    });

    return newPayment;
  },

  updatePayment: async (id: string, updates: Partial<Payment>): Promise<Payment | null> => {
    const dbInst = getDatabase();
    const pmt = dbInst.payments.find(p => p.id === id);
    if (!pmt) return null;
    const updated = { ...pmt, ...updates };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'payments', id), sanitizeForFirestore(updated), { merge: true });
      } catch (err) {
        console.warn('Firestore updatePayment error:', err);
      }
    }

    const idx = dbInst.payments.findIndex(p => p.id === id);
    if (idx >= 0) dbInst.payments[idx] = updated;
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return updated;
  },

  deletePayment: async (id: string): Promise<boolean> => {
    if (isFirebaseConfigured && firestore) {
      try {
        await deleteDoc(doc(firestore, 'payments', id));
      } catch (err) {
        console.warn('Firestore deletePayment error:', err);
      }
    }

    const dbInst = getDatabase();
    if (dbInst.payments) {
      const idx = dbInst.payments.findIndex(p => p.id === id);
      if (idx >= 0) {
        dbInst.payments.splice(idx, 1);
      }
    }
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return true;
  },

  clearPayments: async (): Promise<boolean> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'payments'));
        for (const d of snap.docs) {
          await deleteDoc(d.ref);
        }
      } catch (err) {
        console.warn('Firestore clearPayments error:', err);
      }
    }
    const dbInst = getDatabase();
    dbInst.payments = [];
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return true;
  },

  // Bookings (Firestore collection: 'bookings')
  getBookings: async (): Promise<Booking[]> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'bookings'));
        if (!snap.empty) {
          const items: Booking[] = [];
          snap.forEach(d => items.push(d.data() as Booking));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          getDatabase().bookings = items;
          return items;
        }
      } catch (err) {
        console.warn('Firestore getBookings warning:', err);
      }
    }
    return getDatabase().bookings;
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'bookings', id));
        if (snap.exists()) return snap.data() as Booking;
      } catch (err) {
        console.warn('Firestore getBookingById warning:', err);
      }
    }
    return getDatabase().bookings.find(b => b.id === id);
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    const dbInst = getDatabase();
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'bookings', newBooking.id), sanitizeForFirestore(newBooking));
      } catch (err) {
        console.warn('Firestore createBooking error:', err);
      }
    }

    dbInst.bookings.unshift(newBooking);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);

    db.logEmail({
      to: newBooking.email,
      subject: 'Consultation Confirmed with Gen-M Tech',
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

  saveBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    return db.createBooking(booking);
  },

  updateBooking: async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    const booking = await db.getBookingById(id);
    if (!booking) return null;
    const updated = { ...booking, ...updates };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'bookings', updated.id), sanitizeForFirestore(updated), { merge: true });
      } catch (err) {
        console.warn('Firestore updateBooking error:', err);
      }
    }

    const dbInst = getDatabase();
    const idx = dbInst.bookings.findIndex(b => b.id === updated.id);
    if (idx >= 0) dbInst.bookings[idx] = updated;
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return updated;
  },

  // Enquiries (Firestore collection: 'enquiries')
  getEnquiries: async (): Promise<Enquiry[]> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'enquiries'));
        if (!snap.empty) {
          const items: Enquiry[] = [];
          snap.forEach(d => items.push(d.data() as Enquiry));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          getDatabase().enquiries = items;
          return items;
        }
      } catch (err) {
        console.warn('Firestore getEnquiries warning:', err);
      }
    }
    return getDatabase().enquiries;
  },

  createEnquiry: async (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> => {
    const dbInst = getDatabase();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'enquiries', newEnquiry.id), sanitizeForFirestore(newEnquiry));
      } catch (err) {
        console.warn('Firestore createEnquiry error:', err);
      }
    }

    dbInst.enquiries.unshift(newEnquiry);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);

    db.logEmail({
      to: 'admin@gen-m.com',
      subject: `New Project Enquiry: ${newEnquiry.name} (${newEnquiry.service})`,
      template: 'enquiry_admin_alert',
      data: { name: newEnquiry.name, service: newEnquiry.service, budget: newEnquiry.budget }
    });

    return newEnquiry;
  },

  saveEnquiry: async (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> => {
    return db.createEnquiry(enquiry);
  },

  updateEnquiry: async (id: string, updates: Partial<Enquiry>): Promise<Enquiry | null> => {
    const dbInst = getDatabase();
    const enquiry = dbInst.enquiries.find(e => e.id === id);
    if (!enquiry) return null;
    const updated = { ...enquiry, ...updates };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'enquiries', updated.id), sanitizeForFirestore(updated), { merge: true });
      } catch (err) {
        console.warn('Firestore updateEnquiry error:', err);
      }
    }

    const idx = dbInst.enquiries.findIndex(e => e.id === updated.id);
    if (idx >= 0) dbInst.enquiries[idx] = updated;
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return updated;
  },

  // Email Logs
  getEmailLogs: async (): Promise<EmailLog[]> => getDatabase().emailLogs,
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

  // Services & CMS (Firestore collection: 'content', doc: 'services')
  getServices: async (): Promise<ServiceItem[]> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'content', 'services'));
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.items)) {
            getDatabase().services = data.items;
            return data.items;
          }
        }
      } catch (err) {
        console.warn('Firestore getServices warning:', err);
      }
    }
    return getDatabase().services;
  },

  updateServices: async (services: ServiceItem[]) => {
    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'content', 'services'), { items: services });
      } catch (err) {
        console.warn('Firestore updateServices warning:', err);
      }
    }
    getDatabase().services = services;
  },

  getTestimonials: async (): Promise<Testimonial[]> => getDatabase().testimonials,
  updateTestimonials: async (testimonials: Testimonial[]) => {
    getDatabase().testimonials = testimonials;
  },

  // Expenses Tracker (Firestore collection: 'expenses')
  getExpenses: async (): Promise<Expense[]> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'expenses'));
        if (!snap.empty) {
          const items: Expense[] = [];
          snap.forEach(d => items.push(d.data() as Expense));
          items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          getDatabase().expenses = items;
          return items;
        }
      } catch (err) {
        console.warn('Firestore getExpenses warning:', err);
      }
    }
    return getDatabase().expenses || [];
  },

  getExpenseById: async (id: string): Promise<Expense | undefined> => {
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'expenses', id));
        if (snap.exists()) return snap.data() as Expense;
      } catch (err) {
        console.warn('Firestore getExpenseById warning:', err);
      }
    }
    return (getDatabase().expenses || []).find(e => e.id === id);
  },

  createExpense: async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    const dbInst = getDatabase();
    if (!dbInst.expenses) dbInst.expenses = [];
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'expenses', newExp.id), sanitizeForFirestore(newExp));
      } catch (err) {
        console.warn('Firestore createExpense error:', err);
      }
    }

    dbInst.expenses.unshift(newExp);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return newExp;
  },

  saveExpense: async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    return db.createExpense(expense);
  },

  deleteExpense: async (id: string): Promise<boolean> => {
    if (isFirebaseConfigured && firestore) {
      try {
        await deleteDoc(doc(firestore, 'expenses', id));
      } catch (err) {
        console.warn('Firestore deleteExpense error:', err);
      }
    }
    const dbInst = getDatabase();
    if (!dbInst.expenses) return false;
    const index = dbInst.expenses.findIndex(e => e.id === id);
    if (index === -1) return false;
    dbInst.expenses.splice(index, 1);
    saveStoreToDisk(dbInst.bookings, dbInst.enquiries, dbInst.expenses, dbInst.payments, dbInst.invoices);
    return true;
  },

  // Dashboard Aggregates
  getAdminStats: async (): Promise<AdminStats> => {
    const [enquiries, bookings, projects, invoices, payments, expenses] = await Promise.all([
      db.getEnquiries(),
      db.getBookings(),
      db.getProjects(),
      db.getInvoices(),
      db.getPayments(),
      db.getExpenses(),
    ]);

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter(e => e.status === 'new').length;
    const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'new').length;
    const activeProjects = projects.filter(p => !['COMPLETED'].includes(p.status)).length;
    const reviewProjects = projects.filter(p => p.status === 'CLIENT_REVIEW' || p.status === 'CHANGES_REQUESTED').length;
    const pendingInvoices = (invoices || []).filter(i => i.status !== 'paid' && i.status !== 'cancelled').length;
    
    const successfulPayments = (payments || []).filter(p => 
      p.status === 'success' || 
      p.paymentStatusBadge === 'Advance Received' || 
      p.paymentStatusBadge === 'Fully Paid' || 
      p.status === 'Advance Received' || 
      p.status === 'Fully Paid'
    );
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
    const allExpenses = expenses || [];
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
      totalBookings: bookings.length,
      activeProjects,
      totalProjects: projects.length,
      reviewProjects,
      pendingInvoices,
      totalRevenue,
      monthlyRevenue,
      monthlyProfit,
      monthlyExpenses,
      totalExpenses,
      profitMarginPercent,
      currentMonthName,
      recentProjects: projects.slice(0, 5),
      recentBookings: bookings.slice(0, 5),
      recentEnquiries: enquiries.slice(0, 5),
      recentPayments: (payments || []).slice(0, 5),
    };
  },

  // Team Members CRUD
  getTeamMembers: async (): Promise<TeamMember[]> => {
    const dbInstance = getDatabase();
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'team'));
        if (!snap.empty) {
          const firestoreMembers: TeamMember[] = snap.docs.map(d => ({ ...d.data(), id: d.id } as TeamMember));
          dbInstance.team = firestoreMembers;
        }
      } catch (err) {
        console.warn('Firestore getTeamMembers error:', err);
      }
    }
    return [...(dbInstance.team || [])].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  },

  getTeamMemberById: async (id: string): Promise<TeamMember | null> => {
    const members = await db.getTeamMembers();
    return members.find(m => m.id === id) || null;
  },

  createTeamMember: async (member: Partial<TeamMember>): Promise<TeamMember> => {
    const dbInstance = getDatabase();
    const id = member.id || `team-${Date.now()}`;
    const newMember: TeamMember = {
      id,
      name: member.name || 'Team Member',
      role: member.role || 'Developer',
      quote: member.quote || '',
      image: member.image || '/team/mathew.jpg',
      order: member.order !== undefined ? Number(member.order) : ((dbInstance.team?.length || 0) + 1),
      active: member.active !== undefined ? Boolean(member.active) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'team', id), sanitizeForFirestore(newMember));
      } catch (err) {
        console.warn('Firestore createTeamMember error:', err);
      }
    }

    if (!dbInstance.team) dbInstance.team = [];
    dbInstance.team.push(newMember);
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices, dbInstance.projects, dbInstance.team, dbInstance.promo);
    return newMember;
  },

  updateTeamMember: async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
    const dbInstance = getDatabase();
    if (!dbInstance.team) dbInstance.team = [];
    const idx = dbInstance.team.findIndex(m => m.id === id);
    if (idx < 0) return null;

    const updated: TeamMember = {
      ...dbInstance.team[idx],
      ...updates,
      order: updates.order !== undefined ? Number(updates.order) : dbInstance.team[idx].order,
      active: updates.active !== undefined ? Boolean(updates.active) : dbInstance.team[idx].active,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'team', id), sanitizeForFirestore(updated), { merge: true });
      } catch (err) {
        console.warn('Firestore updateTeamMember error:', err);
      }
    }

    dbInstance.team[idx] = updated;
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices, dbInstance.projects, dbInstance.team, dbInstance.promo);
    return updated;
  },

  deleteTeamMember: async (id: string): Promise<boolean> => {
    const dbInstance = getDatabase();
    if (isFirebaseConfigured && firestore) {
      try {
        await deleteDoc(doc(firestore, 'team', id));
      } catch (err) {
        console.warn('Firestore deleteTeamMember error:', err);
      }
    }
    if (dbInstance.team) {
      dbInstance.team = dbInstance.team.filter(m => m.id !== id);
    }
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices, dbInstance.projects, dbInstance.team, dbInstance.promo);
    return true;
  },

  // Promo / Offer Settings
  getPromoSettings: async (): Promise<PromoSettings> => {
    const dbInstance = getDatabase();
    if (isFirebaseConfigured && firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'settings', 'promo'));
        if (snap.exists()) {
          dbInstance.promo = { ...dbInstance.promo, ...snap.data() } as PromoSettings;
        }
      } catch (err) {
        console.warn('Firestore getPromoSettings error:', err);
      }
    }
    return dbInstance.promo || initialPromo;
  },

  savePromoSettings: async (settings: Partial<PromoSettings>): Promise<PromoSettings> => {
    const dbInstance = getDatabase();
    const current = dbInstance.promo || initialPromo;
    const updated: PromoSettings = {
      ...current,
      ...settings,
      enabled: settings.enabled !== undefined ? Boolean(settings.enabled) : current.enabled,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && firestore) {
      try {
        await setDoc(doc(firestore, 'settings', 'promo'), sanitizeForFirestore(updated), { merge: true });
      } catch (err) {
        console.warn('Firestore savePromoSettings error:', err);
      }
    }

    dbInstance.promo = updated;
    saveStoreToDisk(dbInstance.bookings, dbInstance.enquiries, dbInstance.expenses, dbInstance.payments, dbInstance.invoices, dbInstance.projects, dbInstance.team, dbInstance.promo);
    return updated;
  },
};

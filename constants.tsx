
import { Workspace, AITask, SecurityAlert, Repository, LiveSession, ProfileData, LibraryResource, LibraryCategory, Job, Organization } from './types';

export const MOCK_REPOS: Repository[] = [
  {
    id: 'trackcodex-backend',
    name: 'trackcodex-backend',
    description: 'Core API service for the TrackCodex platform handling user authentication, repository indexing, and AI analysis queuing.',
    isPublic: false,
    visibility: 'PRIVATE',
    techStack: 'Go',
    techColor: '#00add8',
    stars: 24,
    forks: 5,
    aiHealth: 'A+',
    aiHealthLabel: 'Excellent',
    securityStatus: 'Passing',
    lastUpdated: '2h ago',
    contributors: ['https://picsum.photos/seed/u1/32', 'https://picsum.photos/seed/u2/32', 'https://picsum.photos/seed/u3/32'],
    languages: [
      { name: 'Go', percentage: 85, color: '#00add8' },
      { name: 'TypeScript', percentage: 15, color: '#3178c6' }
    ],
    refactors: [
      { id: '1', type: 'Complexity', description: 'The `processData` function in `utils.ts` has a cyclomatic complexity of 24.', target: 'utils.ts' },
      { id: '2', type: 'Modernization', description: "Convert 'var' declarations to 'const' in legacy module `auth.js`.", target: 'auth.js' }
    ],
    releaseVersion: 'v2.4.0'
  },
  {
    id: 'dashboard-ui',
    name: 'dashboard-ui',
    description: 'React-based frontend for the main dashboard including all charting components, collaborative tools, and AI insights.',
    isPublic: true,
    visibility: 'PUBLIC',
    techStack: 'TypeScript',
    techColor: '#3178c6',
    stars: 142,
    forks: 38,
    aiHealth: 'B',
    aiHealthLabel: 'Good',
    securityStatus: '2 Issues',
    lastUpdated: '15m ago'
  },
  {
    id: 'documentation-site',
    name: 'documentation-site',
    description: 'Public facing documentation built with Docusaurus. Contains guides, API reference, and platform architecture docs.',
    isPublic: true,
    visibility: 'PUBLIC',
    techStack: 'Markdown',
    techColor: '#f97316',
    stars: 89,
    forks: 12,
    aiHealth: 'A++',
    aiHealthLabel: 'Perfect',
    securityStatus: 'Passing',
    lastUpdated: '3d ago'
  },
  {
    id: 'legacy-importer',
    name: 'legacy-importer',
    description: 'Scripts to migrate data from the old SVN system. Currently in maintenance mode for enterprise legacy clients.',
    isPublic: false,
    visibility: 'PRIVATE',
    techStack: 'Python',
    techColor: '#facc15',
    stars: 2,
    forks: 0,
    aiHealth: 'C-',
    aiHealthLabel: 'Poor',
    securityStatus: 'Unchecked',
    lastUpdated: '1mo ago'
  },
  {
    id: 'mobile-app-flutter',
    name: 'mobile-app-flutter',
    description: 'Cross-platform mobile application for field agents. Integrated with camera and real-time sync via WebSocket.',
    isPublic: false,
    visibility: 'PRIVATE',
    techStack: 'Dart',
    techColor: '#0ea5e9',
    stars: 18,
    forks: 3,
    aiHealth: 'A',
    aiHealthLabel: 'Great',
    securityStatus: 'Passing',
    lastUpdated: '5h ago'
  }
];

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'trackcodex-backend',
    name: 'track-api-prod',
    status: 'Running',
    runtime: 'Node 20.x',
    lastModified: '2m ago',
    repo: 'trackcodex/core-engine',
    branch: 'main',
    commit: 'f29a1d4',
    collaborators: ['https://picsum.photos/seed/1/32', 'https://picsum.photos/seed/2/32']
  },
  {
    id: 'dashboard-ui',
    name: 'ui-stage',
    status: 'Stopped',
    runtime: 'React 18',
    lastModified: '1d ago',
    repo: 'trackcodex/dashboard-ui',
    branch: 'develop',
    commit: 'a1b2c3d',
    collaborators: ['https://picsum.photos/seed/3/32']
  }
];

export const MOCK_AI_TASKS: AITask[] = [
  { id: '1', taskName: 'Refactor Auth Controller', fileName: 'auth_module.ts', model: 'Claude 3.5 Sonnet', result: 'Diff Generated', timestamp: '2 mins ago' }
];

export const MOCK_SECURITY_ALERTS: SecurityAlert[] = [
  { id: 'FIND-9023', severity: 'Critical', vulnerability: 'SQL Injection in User Login', repository: 'auth-service-api', status: 'Open' }
];

export const MOCK_SESSIONS: LiveSession[] = [
  { id: 's1', title: 'Debugging Auth Module', project: 'api-gateway-v3', host: 'Sarah Chen', hostAvatar: 'https://picsum.photos/seed/sarah/64', viewers: 12, participants: 8 },
];

export const MOCK_PROFILE: ProfileData = {
  name: 'Alex Chen',
  username: 'alexcoder',
  avatar: 'https://picsum.photos/seed/alexprofile/400',
  bio: 'Security-first developer specializing in Rust and cryptographic systems. 🛡️',
  followers: '2.4k',
  following: 180,
  company: 'TrackCodex Security',
  location: 'Seattle, WA',
  website: 'alexchen.security',
  rating: '4.9/5',
  pinnedRepos: [
    {
      name: 'rust-crypto-guard',
      description: 'High-performance cryptographic primitives for secure communication channels.',
      language: 'Rust',
      langColor: '#f97316',
      stars: '1.2k',
      forks: 142,
      isPublic: true
    }
  ]
};

export const MOCK_LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'secure-auth-api',
    name: 'secure-auth-api',
    description: 'JWT-based authentication server with CSRF protection, rate limiting, and secure cookie handling pre-configured.',
    longDescription: 'A production-ready authentication server implementation featuring JWT-based stateless authentication, CSRF protection, and rate limiting out of the box. Designed to drop into any Express.js microservice architecture. Includes pre-configured secure cookie handling and PII redaction for logs.',
    category: 'Backend API',
    techStack: 'TypeScript',
    techColor: '#3178c6',
    stars: 4800,
    forks: 1200,
    lastUpdated: '2 days ago',
    visibility: 'PUBLIC',
    isAudited: true,
    type: 'Template',
    tags: ['JWT', 'OAuth2', 'Express'],
    version: 'v2.4.1',
    snippetPreview: `import express from 'express';\nimport { rateLimit } from 'express-rate-limit';\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100\n});\n\napp.use(limiter);`
  },
  {
    id: 'etl-pipeline-secure',
    name: 'etl-pipeline-secure',
    description: 'Robust data ingestion script with PII redaction capabilities and encrypted logging. Ideal for healthcare data processing.',
    category: 'Backend API',
    techStack: 'Python',
    techColor: '#facc15',
    stars: 3200,
    forks: 890,
    lastUpdated: '5 days ago',
    visibility: 'PUBLIC',
    isAudited: true,
    type: 'Snippet',
    tags: ['Pandas', 'Security'],
    version: 'v1.0.4'
  },
  {
    id: 'microservice-base-go',
    name: 'microservice-base-go',
    description: 'High-performance boilerplate with built-in gRPC support, Prometheus metrics, and distributed tracing via Jaeger.',
    category: 'Backend API',
    techStack: 'Go',
    techColor: '#00add8',
    stars: 1800,
    forks: 340,
    lastUpdated: '1 week ago',
    visibility: 'PUBLIC',
    isAudited: false,
    type: 'Template',
    tags: ['gRPC', 'Tracing'],
    version: 'v0.8.2'
  },
  {
    id: 'aes-256-wrapper',
    name: 'aes-256-wrapper',
    description: 'Memory-safe implementation of AES-256-GCM for encrypting sensitive configuration files at rest. Zero-dependency.',
    category: 'Backend API',
    techStack: 'Rust',
    techColor: '#f97316',
    stars: 980,
    forks: 150,
    lastUpdated: '3 weeks ago',
    visibility: 'PUBLIC',
    isAudited: true,
    type: 'Snippet',
    tags: ['Crypto', 'AES'],
    version: 'v1.2.0'
  },
  {
    id: 'sqli-prevention-paper',
    name: 'sqli-prevention-paper',
    description: 'Academic paper discussing modern techniques for preventing SQL injection in ORM-less environments using prepared statements.',
    category: 'Research Papers',
    techStack: 'Markdown',
    techColor: '#888',
    stars: 14000,
    forks: 0,
    lastUpdated: '1 month ago',
    visibility: 'RESEARCH',
    isAudited: false,
    type: 'Paper',
    tags: ['SQLi', 'Database'],
    version: '2023-Final'
  },
  {
    id: 'graphql-server-hardened',
    name: 'graphql-server-hardened',
    description: 'Opinionated GraphQL server setup with depth limiting, cost analysis, and disabled introspection for production.',
    category: 'Backend API',
    techStack: 'TypeScript',
    techColor: '#3178c6',
    stars: 2400,
    forks: 560,
    lastUpdated: '2 weeks ago',
    visibility: 'PUBLIC',
    isAudited: true,
    type: 'Kit',
    tags: ['GraphQL', 'Security'],
    version: 'v2.0.1'
  },
  {
    id: 'dashboard-pro-kit',
    name: 'Enterprise Dashboard UI Kit & Prompt',
    description: 'A comprehensive UI design system and AI generation prompt for building secure, data-dense enterprise dashboards.',
    longDescription: 'A comprehensive UI design system and AI generation prompt for building secure, data-dense enterprise dashboards. Optimized for financial and analytics workloads with pre-built accessibility features.',
    category: 'UI & Design',
    techStack: 'Tailwind CSS',
    techColor: '#06b6d4',
    stars: 5200,
    forks: 1400,
    lastUpdated: '2 days ago',
    visibility: 'PUBLIC',
    isAudited: true,
    type: 'Kit',
    tags: ['React', 'Dashboard'],
    version: 'v2.4.0',
    snippetPreview: `Generate a responsive {{DashboardType}} layout using CSS Grid.\nInclude a sidebar navigation with {{NavItems}} items.\nThe main content area should feature:\n1. A summary cards row displaying {{KPI_Metrics}}.\n...`
  }
];

export const MOCK_LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: 'backend-api', name: 'Backend API', icon: 'api', count: 12 },
  { id: 'frontend-spa', name: 'Frontend SPA', icon: 'web_asset', count: 8 },
  { id: 'microservice', name: 'Microservice', icon: 'grid_view', count: 15 },
  { id: 'security-patterns', name: 'Security Patterns', icon: 'security', count: 24 },
  { id: 'utilities', name: 'Utilities', icon: 'build', count: 10 },
  { id: 'research-papers', name: 'Research Papers', icon: 'menu_book', count: 5 },
  { id: 'ui-design', name: 'UI & Design', icon: 'design_services', count: 4 }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'DeFi Protocol Security Audit',
    description: 'Perform a comprehensive security audit on our upcoming DeFi lending protocol built on Solana.',
    longDescription: 'We are seeking a senior security engineer to perform a 2-week intensive audit of our Solana smart contracts. Focus areas include liquidations logic, oracle integration, and flash loan prevention. You will be working directly with our lead developer in a dedicated workspace.',
    budget: '$8,500',
    type: 'Contract',
    status: 'Open',
    techStack: ['Rust', 'Solana', 'Security'],
    repoId: 'trackcodex-backend',
    creator: {
      name: 'SolanaLend Team',
      avatar: 'https://picsum.photos/seed/solana/64'
    },
    postedDate: '2 hours ago'
  },
  {
    id: 'job-2',
    title: 'React Performance Optimization',
    description: 'Optimize a data-heavy analytics dashboard to reduce bundle size and improve TTI.',
    longDescription: 'Our main dashboard has grown too complex. We need a React expert to implement code-splitting, optimize memoization, and refactor expensive computations to web workers. The project uses Recharts and Tailwind CSS.',
    budget: '$3,200',
    type: 'Gig',
    status: 'In Progress',
    techStack: ['React', 'TypeScript', 'Performance'],
    repoId: 'dashboard-ui',
    creator: {
      name: 'AnalyticsPro',
      avatar: 'https://picsum.photos/seed/analytics/64'
    },
    postedDate: 'Yesterday'
  },
  {
    id: 'job-3',
    title: 'Senior Go Backend Engineer',
    description: 'Join our team full-time to lead the infrastructure migration to a microservices architecture.',
    longDescription: 'Looking for a long-term partner to help us scale our backend infrastructure. You will be responsible for designing gRPC interfaces, implementing distributed tracing, and mentoring junior engineers. This is a high-impact role with competitive equity.',
    budget: '$160k/year',
    type: 'Full-time',
    status: 'Open',
    techStack: ['Go', 'Kubernetes', 'gRPC'],
    repoId: 'trackcodex-backend',
    creator: {
      name: 'TrackCodex Core',
      avatar: 'https://picsum.photos/seed/track/64'
    },
    postedDate: '3 days ago'
  },
  {
    id: 'job-4',
    title: 'Mobile Camera WebSocket Integration',
    description: 'Implement real-time camera stream syncing via WebSockets for a Flutter application.',
    budget: '$2,500',
    type: 'Gig',
    status: 'Completed',
    techStack: ['Dart', 'Flutter', 'WebSockets'],
    repoId: 'mobile-app-flutter',
    creator: {
      name: 'FieldAgent Inc',
      avatar: 'https://picsum.photos/seed/field/64'
    },
    postedDate: '1 week ago',
    rating: 5,
    feedback: 'Excellent work! The latency is incredibly low and the implementation is clean.'
  }
];

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'quantaforge',
    name: 'Quantaforge',
    avatar: 'https://picsum.photos/seed/quantaforge/200',
    description: 'Building the next generation of developer tools with a focus on security, performance, and AI-driven insights.',
    website: 'quantaforge.io',
    location: 'San Francisco, CA',
    repositories: MOCK_REPOS.slice(0, 3),
    members: [
      { username: 'alexcoder', name: 'Alex Chen', avatar: 'https://picsum.photos/seed/alexprofile/64', role: 'Owner', lastActive: '2 hours ago' },
      { username: 'sarah_backend', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/64', role: 'Admin', lastActive: '15 minutes ago' },
      { username: 'm_thorne', name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/marcus/64', role: 'Member', lastActive: 'Yesterday' },
      { username: 'david_kim', name: 'David Kim', avatar: 'https://picsum.photos/seed/david/64', role: 'Member', lastActive: '3 days ago' },
    ],
    teams: [
      { id: 't1', name: 'Core Infrastructure', description: 'Manages the core backend services and platform infrastructure.', memberCount: 8, repoCount: 2 },
      { id: 't2', name: 'Frontend Guild', description: 'Maintains all user-facing applications and design systems.', memberCount: 12, repoCount: 4 },
      { id: 't3', name: 'ForgeAI Research', description: 'R&D for the ForgeAI engine and related services.', memberCount: 5, repoCount: 1 },
    ],
  },
  {
    id: 'opensource-collective',
    name: 'Open Source Collective',
    avatar: 'https://picsum.photos/seed/opensource/200',
    description: 'A collective of open-source contributors focused on building public goods for the developer community.',
    website: 'opensource.dev',
    location: 'Remote',
    repositories: MOCK_REPOS.slice(3),
    members: [
      { username: 'alexcoder', name: 'Alex Chen', avatar: 'https://picsum.photos/seed/alexprofile/64', role: 'Member', lastActive: '1 day ago' },
    ],
    teams: [],
  }
];
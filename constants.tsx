
import { Workspace, AITask, SecurityAlert, Repository, LiveSession, ProfileData, LibraryResource, LibraryCategory } from './types';

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
    id: '1',
    name: 'track-api-prod',
    status: 'Running',
    runtime: 'Node 20.x',
    lastModified: '2m ago',
    repo: 'trackcodex/core-engine',
    branch: 'main',
    commit: 'f29a1d4',
    collaborators: ['https://picsum.photos/seed/1/32', 'https://picsum.photos/seed/2/32']
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

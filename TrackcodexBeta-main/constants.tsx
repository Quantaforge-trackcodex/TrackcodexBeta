import {
  Workspace,
  AITask,
  SecurityAlert,
  Repository,
  LiveSession,
  ProfileData,
  LibraryResource,
  LibraryCategory,
  Job,
  Organization,
  Candidate,
  TrialRepo,
  GrowthPathItem,
  SkillRadarData,
  OnboardingTask,
} from "./types";
import { FileItem } from "./components/common/UniversalFileList";

export const MOCK_REPOS: Repository[] = [
  {
    id: "trackcodex-backend",
    name: "trackcodex-backend",
    description:
      "Core API service for the **TrackCodex** platform handling `user authentication`, repository indexing, and AI analysis queuing. Check out the [API docs](#/repo/trackcodex-backend).",
    isPublic: false,
    visibility: "PRIVATE",
    techStack: "Go",
    techColor: "#00add8",
    stars: 24,
    forks: 5,
    aiHealth: "A+",
    aiHealthLabel: "Excellent",
    securityStatus: "Passing",
    lastUpdated: "2h ago",
    contributors: [
      "https://picsum.photos/seed/u1/32",
      "https://picsum.photos/seed/u2/32",
      "https://picsum.photos/seed/u3/32",
    ],
    languages: [
      { name: "Go", percentage: 85, color: "#00add8" },
      { name: "TypeScript", percentage: 15, color: "#3178c6" },
    ],
    refactors: [
      {
        id: "1",
        type: "Complexity",
        description:
          "The `processData` function in `utils.ts` has a cyclomatic complexity of 24.",
        target: "utils.ts",
      },
      {
        id: "2",
        type: "Modernization",
        description:
          "Convert 'var' declarations to 'const' in legacy module `auth.js`.",
        target: "auth.js",
      },
    ],
    releaseVersion: "v2.4.0",
    readme: `
<div class="flex flex-col items-center justify-center mb-8 text-center pb-8 border-b border-[#30363d]">
    <div class="size-24 bg-gradient-to-br from-white to-slate-400 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
        <span class="material-symbols-outlined !text-[48px] text-black">code_blocks</span>
    </div>
    <h1 class="text-4xl font-black text-white mb-2 tracking-tight">QuantaCode</h1>
    <p class="text-xl text-slate-400 font-light">The Advanced AI-Powered Code Editor</p>
    
    <div class="flex items-center gap-2 mt-6">
        <span class="px-2 py-0.5 bg-[#21262d] border border-[#30363d] text-xs font-mono text-slate-300 rounded-l">Last Release</span>
        <span class="px-2 py-0.5 bg-[#b91c1c] text-white text-xs font-bold font-mono rounded-r">No release or repo not found</span>
        <span class="px-2 py-0.5 bg-[#21262d] border border-[#30363d] text-xs font-mono text-slate-300 rounded-l ml-2">License</span>
        <span class="px-2 py-0.5 bg-[#a3e635] text-black text-xs font-bold font-mono rounded-r">MIT</span>
    </div>
</div>

<p class="text-base leading-relaxed mb-6">
    QuantaCode is a next-generation code editor built for the AI era. Forked from the robust VS Code OSS foundation, it integrates native AI capabilities and intelligent web scaling tools directly into your workflow.
</p>

<h2 class="text-2xl font-bold text-white border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[24px] text-rose-500">rocket_launch</span> Key Features
</h2>

<h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[20px] text-purple-400">psychology</span> Antigravity AI
</h3>
<p class="mb-4">Your built-in coding companion.</p>
<ul class="list-disc pl-6 space-y-1 mb-6 text-slate-300">
    <li><strong>DeepSeek Integration:</strong> Powered by the localized DeepSeek-r1 model for private, high-performance inference.</li>
    <li><strong>Context-Aware:</strong> Understands your project structure and actively learns from your workspace.</li>
    <li><strong>Privacy-First:</strong> Run entirely offline with Ollama, keeping your code safe.</li>
</ul>

<h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[20px] text-blue-400">language</span> Web Scaler Agent
</h3>
<p class="mb-4">Turn the web into your dataset.</p>
<ul class="list-disc pl-6 space-y-1 mb-6 text-slate-300">
    <li><strong>Intelligent Scraping:</strong> Extract docs, tutorials, and stack overflow answers directly into your editor context.</li>
    <li><strong>Seamless Integration:</strong> Scraped content is automatically fed into Antigravity AI for context-aware answers.</li>
    <li><strong>Powered by Camel-AI/Owl:</strong> Advanced multi-modal web navigation agent.</li>
</ul>

<h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[20px] text-amber-400">bolt</span> Performance Optimized
</h3>
<ul class="list-disc pl-6 space-y-1 mb-6 text-slate-300">
    <li><strong>Stripped & Polished:</strong> Telemetry removed, legacy bloatware stripped.</li>
    <li><strong>Native Efficiency:</strong> Rebuilt native modules for maximum speed on Windows.</li>
</ul>

 <h2 class="text-2xl font-bold text-white border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[24px] text-emerald-500">download</span> Download
</h2>
<p class="mb-4">Get the latest version from our <a href="#" class="text-primary hover:underline">Releases Page</a>.</p>
<p class="font-bold mb-2">Supported Platforms:</p>
<ul class="list-disc pl-6 space-y-1 mb-6 text-slate-300">
    <li>Windows 10/11 (x64)</li>
    <li>Linux (.deb/.rpm) - <em>Coming Soon</em></li>
    <li>macOS (Apple Silicon) - <em>Coming Soon</em></li>
</ul>

<h2 class="text-2xl font-bold text-white border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[24px] text-slate-400">build</span> Installation
</h2>
<div class="bg-[#161b22] p-4 rounded-lg border border-[#30363d] font-mono text-sm mb-6">
    <p class="text-slate-400 mb-2">1. Download the installer ( <span class="text-white">QuantaCodeSetup-x64.exe</span> ).</p>
    <p class="text-slate-400 mb-2">2. Run the installer and accept the EULA.</p>
    <p class="text-slate-400">3. Start coding!</p>
</div>

 <h2 class="text-2xl font-bold text-white border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[24px] text-amber-600">terminal</span> For Developers
</h2>
<p class="mb-2">Want to build from source?</p>
<div class="bg-[#161b22] p-4 rounded-lg border border-[#30363d] font-mono text-sm mb-6 relative group">
    <button class="absolute top-4 right-4 text-slate-500 hover:text-white"><span class="material-symbols-outlined !text-[16px]">content_copy</span></button>
    <div class="text-slate-300">
        <span class="text-primary">git clone</span> https://github.com/QuantaForge-trackcodex/quantacode.git<br/>
        <span class="text-primary">cd</span> quantacode<br/>
        ./scripts/clone-and-setup.ps1
    </div>
</div>

 <h2 class="text-2xl font-bold text-white border-b border-[#30363d] pb-2 mb-4 flex items-center gap-2">
    <span class="material-symbols-outlined !text-[24px] text-orange-400">balance</span> License
</h2>
<p class="mb-4">QuantaCode is distributed under the MIT License. Copyright (c) 2026 QuantaForge LLC.</p>
<p class="text-xs text-slate-500">Based on Visual Studio Code Open Source (Code-OSS) by Microsoft.</p>
`,
  },
  {
    id: "dashboard-ui",
    name: "dashboard-ui",
    description:
      "*React-based* frontend for the main dashboard including all charting components, collaborative tools, and `AI insights`.",
    isPublic: true,
    visibility: "PUBLIC",
    techStack: "TypeScript",
    techColor: "#3178c6",
    stars: 142,
    forks: 38,
    aiHealth: "B",
    aiHealthLabel: "Good",
    securityStatus: "2 Issues",
    lastUpdated: "15m ago",
  },
  {
    id: "documentation-site",
    name: "documentation-site",
    description:
      "Public facing documentation built with _Docusaurus_. Contains guides, [API reference](#), and platform architecture docs.",
    isPublic: true,
    visibility: "PUBLIC",
    techStack: "Markdown",
    techColor: "#f97316",
    stars: 89,
    forks: 12,
    aiHealth: "A++",
    aiHealthLabel: "Perfect",
    securityStatus: "Passing",
    lastUpdated: "3d ago",
  },
  {
    id: "legacy-importer",
    name: "legacy-importer",
    description:
      "Scripts to migrate data from the old SVN system. Currently in maintenance mode for enterprise legacy clients.",
    isPublic: false,
    visibility: "PRIVATE",
    techStack: "Python",
    techColor: "#facc15",
    stars: 2,
    forks: 0,
    aiHealth: "C-",
    aiHealthLabel: "Poor",
    securityStatus: "Unchecked",
    lastUpdated: "1mo ago",
  },
  {
    id: "mobile-app-flutter",
    name: "mobile-app-flutter",
    description:
      "Cross-platform mobile application for field agents. Integrated with camera and real-time sync via WebSocket.",
    isPublic: false,
    visibility: "PRIVATE",
    techStack: "Dart",
    techColor: "#0ea5e9",
    stars: 18,
    forks: 3,
    aiHealth: "A",
    aiHealthLabel: "Great",
    securityStatus: "Passing",
    lastUpdated: "5h ago",
  },
];

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "trackcodex-backend",
    name: "track-api-prod",
    status: "Running",
    runtime: "Node 20.x",
    lastModified: "2m ago",
    repo: "trackcodex/core-engine",
    branch: "main",
    commit: "f29a1d4",
    collaborators: [
      "https://picsum.photos/seed/1/32",
      "https://picsum.photos/seed/2/32",
    ],
  },
  {
    id: "dashboard-ui",
    name: "ui-stage",
    status: "Stopped",
    runtime: "React 18",
    lastModified: "1d ago",
    repo: "trackcodex/dashboard-ui",
    branch: "develop",
    commit: "a1b2c3d",
    collaborators: ["https://picsum.photos/seed/3/32"],
  },
];

export const MOCK_AI_TASKS: AITask[] = [
  {
    id: "1",
    taskName: "Refactor Auth Controller",
    fileName: "auth_module.ts",
    model: "Claude 3.5 Sonnet",
    result: "Diff Generated",
    timestamp: "2 mins ago",
  },
];

export const MOCK_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: "FIND-9023",
    severity: "Critical",
    vulnerability: "SQL Injection in User Login",
    repository: "auth-service-api",
    status: "Open",
  },
];

export const MOCK_SESSIONS: LiveSession[] = [
  {
    id: "s1",
    title: "Debugging Auth Module",
    project: "api-gateway-v3",
    host: "Sarah Chen",
    hostAvatar: "https://picsum.photos/seed/sarah/64",
    viewers: 12,
    participants: 8,
  },
];

export const MOCK_PROFILE: ProfileData = {
  name: "Alex Chen",
  username: "alexcoder",
  avatar: "https://picsum.photos/seed/alexprofile/400",
  bio: "Security-first developer specializing in Rust and cryptographic systems. 🛡️",
  followers: "2.4k",
  following: 180,
  company: "TrackCodex Security",
  location: "Seattle, WA",
  website: "alexchen.security",
  rating: "4.9/5",
  pinnedRepos: [
    {
      name: "rust-crypto-guard",
      description:
        "High-performance cryptographic primitives for secure communication channels.",
      language: "Rust",
      langColor: "#f97316",
      stars: "1.2k",
      forks: 142,
      isPublic: true,
    },
  ],
};

export const MOCK_LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: "secure-auth-api",
    name: "secure-auth-api",
    description:
      "JWT-based authentication server with CSRF protection, rate limiting, and secure cookie handling pre-configured.",
    longDescription:
      "A production-ready authentication server implementation featuring JWT-based stateless authentication, CSRF protection, and rate limiting out of the box. Designed to drop into any Express.js microservice architecture. Includes pre-configured secure cookie handling and PII redaction for logs.",
    category: "Backend API",
    techStack: "TypeScript",
    techColor: "#3178c6",
    stars: 4800,
    forks: 1200,
    lastUpdated: "2 days ago",
    visibility: "PUBLIC",
    isAudited: true,
    type: "Template",
    tags: ["JWT", "OAuth2", "Express"],
    version: "v2.4.1",
    snippetPreview: `import express from 'express';\nimport { rateLimit } from 'express-rate-limit';\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100\n});\n\napp.use(limiter);`,
  },
  {
    id: "dashboard-pro-kit",
    name: "Enterprise Dashboard UI Kit & Prompt",
    description:
      "A comprehensive UI design system and AI generation prompt for building secure, data-dense enterprise dashboards.",
    longDescription:
      "A comprehensive UI design system and AI generation prompt for building secure, data-dense enterprise dashboards. Optimized for financial and analytics workloads with pre-built accessibility features.",
    category: "UI & Design",
    techStack: "Tailwind CSS",
    techColor: "#06b6d4",
    stars: 5200,
    forks: 1400,
    lastUpdated: "2 days ago",
    visibility: "PUBLIC",
    isAudited: true,
    type: "Kit",
    tags: ["React", "Dashboard"],
    version: "v2.4.0",
    snippetPreview: `Generate a responsive {{DashboardType}} layout using CSS Grid.\nInclude a sidebar navigation with {{NavItems}} items.\nThe main content area should feature:\n1. A summary cards row displaying {{KPI_Metrics}}.\n...`,
  },
];

export const MOCK_LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: "backend-api", name: "Backend API", icon: "api", count: 12 },
  { id: "ui-design", name: "UI & Design", icon: "design_services", count: 4 },
];

export const MOCK_JOBS: Job[] = [
  {
    id: "stripe-billing-eng",
    title: "Senior Billing Engineer",
    description:
      "Implement idempotency keys for terminal reader connections. Work with the financial infrastructure team to ensure 99.999% reliability.",
    budget: "$180k - $240k",
    type: "Full-time",
    status: "Open",
    techStack: ["TypeScript", "React", "API Design"],
    repoId: "stripe/stripe-terminal-js",
    creator: {
      name: "Stripe",
      avatar: "https://cdn.worldvectorlogo.com/logos/stripe-2.svg",
    },
    postedDate: "2 hours ago",
    longDescription:
      "Stripe is looking for a Senior Billing Engineer to help build the financial infrastructure of the internet.\n\n### Responsibilities\n- Design and implement idempotency keys for terminal reader connections.\n- Optimize billing workflows for high-volume transaction processing.\n- Collaborate with product managers to define new billing features.\n\n### Requirements\n- 5+ years of experience with TypeScript and Node.js.\n- Strong understanding of distributed systems and API design.\n- Experience with financial software is a plus.",
  },
  {
    id: "netflix-platform-eng",
    title: "Platform Integrity Engineer",
    description:
      "Optimize circuit breaker timeout propagation for 5G edge cases. Ensure streaming quality even in degraded network conditions.",
    budget: "$220k - $310k",
    type: "Full-time",
    status: "Open",
    techStack: ["Java", "Spring", "Distributed Systems"],
    repoId: "Netflix/Hystrix",
    creator: {
      name: "Netflix",
      avatar: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
    },
    postedDate: "4 hours ago",
    longDescription:
      "Netflix is redefining the future of entertainment.\n\n### The Role\nJoin our Platform Integrity team to ensure our global streaming service remains resilient under all conditions. You will be working on core infrastructure components that handle millions of requests per second.",
  },
  {
    id: "vercel-frontend-arch",
    title: "Frontend Infra Architect",
    description:
      "Refactor middleware runtime to support edge-cached WASM assets. Lead the architecture for the next generation of Next.js.",
    budget: "$160k - $210k",
    type: "Contract",
    status: "Open",
    techStack: ["Rust", "Go", "Next.js"],
    repoId: "vercel/next.js",
    creator: {
      name: "Vercel",
      avatar: "https://cdn.worldvectorlogo.com/logos/vercel.svg",
    },
    postedDate: "1 day ago",
  },
  {
    id: "airbnb-security-lead",
    title: "Systems Security Lead",
    description:
      "Implement strict CSP policy enforcement across legacy modules. protect user data and ensure compliance with global regulations.",
    budget: "$195k - $265k",
    type: "Full-time",
    status: "Open",
    techStack: ["Node.js", "Security", "React"],
    repoId: "airbnb/javascript",
    creator: {
      name: "Airbnb",
      avatar: "https://cdn.worldvectorlogo.com/logos/airbnb.svg",
    },
    postedDate: "2 days ago",
  },
  {
    id: "j1",
    title: "DeFi Protocol Security Audit",
    description:
      "Perform a comprehensive security audit on our upcoming DeFi lending protocol built on Solana.",
    budget: "$8,500",
    type: "Contract",
    status: "Open",
    techStack: ["Rust", "Solana", "Security"],
    repoId: "trackcodex-backend",
    creator: {
      name: "SolanaLend Team",
      avatar: "https://picsum.photos/seed/solana/64",
    },
    postedDate: "2 hours ago",
  },
  {
    id: "j2",
    title: "React Performance Optimization",
    description:
      "Optimize a data-heavy analytics dashboard to reduce bundle size and improve TTI.",
    budget: "$3,200",
    type: "Gig",
    status: "InProgress",
    techStack: ["React", "TypeScript", "Performance"],
    repoId: "dashboard-ui",
    creator: {
      name: "AnalyticsPro",
      avatar: "https://picsum.photos/seed/analytics/64",
    },
    postedDate: "Yesterday",
  },
];

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "quantaforge",
    name: "Quantaforge",
    avatar: "https://picsum.photos/seed/quantaforge/200",
    description:
      "Building the next generation of developer tools with a focus on security, performance, and AI-driven insights.",
    website: "quantaforge.io",
    location: "San Francisco, CA",
    repositories: MOCK_REPOS.slice(0, 3),
    members: [
      {
        username: "alexcoder",
        name: "Alex Chen",
        avatar: "https://picsum.photos/seed/alexprofile/64",
        role: "OWNER",
        lastActive: "2 hours ago",
      },
      {
        username: "sarah_backend",
        name: "Sarah Chen",
        avatar: "https://picsum.photos/seed/sarah/64",
        role: "ADMIN",
        lastActive: "15 minutes ago",
      },
      {
        username: "m_thorne",
        name: "Marcus Thorne",
        avatar: "https://picsum.photos/seed/marcus/64",
        role: "MEMBER",
        lastActive: "Yesterday",
      },
      {
        username: "david_kim",
        name: "David Kim",
        avatar: "https://picsum.photos/seed/david/64",
        role: "MEMBER",
        lastActive: "3 days ago",
      },
    ],
    teams: [
      {
        id: "t1",
        name: "Core Infrastructure",
        description:
          "Manages the core backend services and platform infrastructure.",
        memberCount: 8,
        repoCount: 2,
      },
      {
        id: "t2",
        name: "Frontend Guild",
        description:
          "Maintains all user-facing applications and design systems.",
        memberCount: 12,
        repoCount: 4,
      },
      {
        id: "t3",
        name: "ForgeAI Research",
        description: "R&D for the ForgeAI engine and related services.",
        memberCount: 5,
        repoCount: 1,
      },
    ],
  },
];

// --- NEW HIRING & GROWTH MOCK DATA ---

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "jane-doe",
    name: "Jane Doe",
    role: "Senior Software Engineer Applicant",
    location: "San Francisco, CA",
    avatar: "https://picsum.photos/seed/janedoe/64",
    aiComplexityScore: 92,
    codeReplayUrl: "#",
    techScore: 94,
    cultureFit: 88,
    complexity: "High",
    experience: "8y+",
    technicalEvidence: [
      {
        title: "Refactored Middleware Logic",
        description:
          "Replaced nested callbacks with clean async/await patterns and error handlers.",
        complexity: 94,
        quality: 96,
        timestamp: "00:42:16",
      },
      {
        title: "Database Schema Optimization",
        description:
          "Identified and fixed a critical N+1 query issue in the data fetching layer.",
        complexity: 88,
        quality: 92,
        timestamp: "01:16:02",
      },
    ],
    linesChanged: { added: 482, removed: 24 },
    testingCoverage: 92,
    maintainability: "A+",
    qualitativeNotes: [
      {
        author: "Sarah Chen",
        avatar: "https://picsum.photos/seed/sarah/64",
        rating: 5,
        note: "Deep understanding of distributed systems. She just didn’t solve the coding prompt, she discussed architectural tradeoffs for production.",
        tags: ["Architecture", "Leadership"],
        strengths: [
          "Highly articulate about technical tradeoffs",
          "Proactive mentoring mindset",
        ],
        potentials: ["Limited experience with Kubernetes"],
      },
    ],
  },
  {
    id: "alex-chen",
    name: "Alex Chen",
    role: "Staff Engineer @ TechFlow",
    avatar: "https://picsum.photos/seed/alexchen/64",
    aiComplexityScore: 88,
    aiComplexityDepth: "High Depth",
    codeReplayUrl: "#",
    prQuality: 94,
    status: "Top Match",
    codeReplayHighlights: [
      "Refactored with logic from O(n) to O(1) during live session.",
    ],
    interviewerSentiment: 4.8,
    techStackMatch: [
      { skill: "Go", alignment: 95 },
      { skill: "K8s", alignment: 80 },
      { skill: "Redis", alignment: 98 },
    ],
    trialPRLink: "#402",
    decision: "Extend Offer",
  },
  {
    id: "sarah-smith",
    name: "Sarah Smith",
    role: "Sr. Backend @ Cloudscale",
    avatar: "https://picsum.photos/seed/sarahsmith/64",
    aiComplexityScore: 94,
    aiComplexityDepth: "Elite",
    codeReplayUrl: "#",
    prQuality: 92,
    status: "Passing",
    codeReplayHighlights: [
      "Optimized Postgres queries with intelligent indexing.",
      "Integrated Redis caching for hot path calls.",
    ],
    interviewerSentiment: 4.9,
    techStackMatch: [
      { skill: "Go", alignment: 100 },
      { skill: "K8s", alignment: 90 },
      { skill: "Redis", alignment: 95 },
    ],
    trialPRLink: "#415",
    decision: "Schedule Final",
  },
  {
    id: "jordan-lee",
    name: "Jordan Lee",
    role: "Lead Dev @ DataPulse",
    avatar: "https://picsum.photos/seed/jordanlee/64",
    aiComplexityScore: 85,
    aiComplexityDepth: "Standard",
    codeReplayUrl: "#",
    prQuality: 88,
    status: "Archived",
    codeReplayHighlights: ["Followed standard MVC patterns consistently."],
    interviewerSentiment: 3.8,
    techStackMatch: [
      { skill: "Go", alignment: 80 },
      { skill: "Docker", alignment: 90 },
    ],
    trialPRLink: "#389",
    decision: "Archive",
  },
];

export const MOCK_TRIAL_REPOS: TrialRepo[] = [
  {
    id: "trial-1",
    title: "Senior Billing Engineer",
    company: "Stripe",
    location: "Remote",
    salaryRange: "$180k - $240k",
    status: "Newly Active",
    description: "Implement idempotency keys for terminal reader connections.",
    challenges: [],
    tech: ["TypeScript", "React", "API Design"],
    deployments: 0,
    coverage: 0,
    avgPrReview: "0m",
    logo: "https://cdn.worldvectorlogo.com/logos/stripe-2.svg",
    repoName: "stripe/stripe-terminal-js",
    readme: `# Stripe Terminal JS

This library provides bindings for the Stripe Terminal SDK.

## Installation
\`\`\`bash
npm install @stripe/terminal-js
\`\`\`

## Features
- Connection management
- Payment processing
- Reader updates

## Idempotency Challenge
Implement a robust idempotency key generation strategy for offline reader connections. Ensure that network flaps do not result in double charges.`,
  },
  {
    id: "trial-2",
    title: "Platform Integrity Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    salaryRange: "$220k - $310k",
    status: "Updated",
    description:
      "Optimize circuit breaker timeout propagation for 5G edge cases.",
    challenges: [],
    tech: ["Java", "Spring", "Distributed Systems"],
    deployments: 0,
    coverage: 0,
    avgPrReview: "0m",
    logo: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
    repoName: "Netflix/Hystrix",
    readme: `# Netflix Hystrix

Hystrix is a latency and fault tolerance library designed to isolate points of access to remote systems, services and 3rd party libraries.

## Circuit Breaker Pattern
Stop cascading failures in complex distributed systems.

## Challenge: 5G Timeout Propagation
Optimize the timeout propagation logic to handle high-latency 5G edge cases without triggering false positives.`,
  },
  {
    id: "trial-3",
    title: "Frontend Infra Architect",
    company: "Vercel",
    location: "San Francisco, CA",
    salaryRange: "$160k - $210k",
    status: "Updated",
    description:
      "Refactor middleware runtime to support edge-cached WASM assets.",
    challenges: [],
    tech: ["Rust", "Go", "Next.js"],
    deployments: 0,
    coverage: 0,
    avgPrReview: "0m",
    logo: "https://cdn.worldvectorlogo.com/logos/vercel.svg",
    repoName: "vercel/next.js",
  },
  {
    id: "trial-4",
    title: "Systems Security Lead",
    company: "Airbnb",
    location: "Remote",
    salaryRange: "$195k - $265k",
    status: "Newly Active",
    description:
      "Implement strict CSP policy enforcement across legacy modules.",
    challenges: [],
    tech: ["Node.js", "Security", "React"],
    deployments: 0,
    coverage: 0,
    avgPrReview: "0m",
    logo: "https://cdn.worldvectorlogo.com/logos/airbnb.svg",
    repoName: "airbnb/javascript",
  },
  {
    id: "trial-5",
    title: "Site Reliability Engineer",
    company: "Datadog",
    location: "Paris, FR",
    salaryRange: "$175k - $225k",
    status: "Updated",
    description:
      "Optimize trace aggregation overhead in high-throughput nodes.",
    challenges: [],
    tech: ["Golang", "K8s", "Datadog"],
    deployments: 0,
    coverage: 0,
    avgPrReview: "0m",
    logo: "https://dashboard.snapcraft.io/site_media/appmedia/2021/01/datadog-agent-icon-256x256_5yT1F6E.png",
    repoName: "DataDog/dd-trace-js",
  },
  {
    id: "trial-6",
    title: "Backend Core Engineer",
    company: "Uber",
    location: "Amsterdam, NL",
    salaryRange: "$210k - $280k",
    status: "Newly Active",
    description: "Implement dynamic theme-switching engine for accessibility.",
    challenges: [],
    tech: ["React", "Styletron", "A11y"],
    deployments: 0,
    coverage: 0,
    avgPrReview: "0m",
    logo: "https://cdn.worldvectorlogo.com/logos/uber-2.svg",
    repoName: "uber/baseui",
  },
];

export const MOCK_GROWTH_DATA = {
  skillRadar: [
    { subject: "System Design", score: 85, fullMark: 100 },
    { subject: "Frontend", score: 70, fullMark: 100 },
    { subject: "Backend", score: 90, fullMark: 100 },
    { subject: "Security", score: 95, fullMark: 100 },
    { subject: "Leadership", score: 75, fullMark: 100 },
  ] as SkillRadarData[],
  growthPath: [
    {
      skill: "Kubernetes",
      category: "DevOps",
      currentProficiency: 75,
      targetLevel: "Staff Engineer",
      recommendation: "Level Up Soon",
    },
    {
      skill: "GraphQL",
      category: "API",
      currentProficiency: 45,
      targetLevel: "Intermediate",
      recommendation: "View Internal Docs",
    },
    {
      skill: "Cybersecurity",
      category: "Security",
      currentProficiency: 88,
      targetLevel: "Advanced",
      recommendation: "Exam Prep",
    },
  ] as GrowthPathItem[],
};

export const MOCK_ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: "1",
    title: "Request SSH keys & VPN access",
    description: "Completed 2 days ago",
    status: "completed",
    type: "required",
  },
  {
    id: "2",
    title: "Local environment setup (Docker & Node v20)",
    description: "Priority: High",
    status: "pending",
    type: "priority",
  },
  {
    id: "3",
    title: "Initial commit to personal sandbox repo",
    description: "Due by Friday",
    status: "pending",
    type: "goal",
  },
  {
    id: "4",
    title: "Join #eng-general and introduce yourself",
    description: "Social goal",
    status: "pending",
    type: "social",
  },
];

// --- IDE ECOSYSTEM MOCK DATA ---

export const MOCK_EXTENSIONS = [
  {
    id: "py",
    name: "Python",
    publisher: "Microsoft",
    version: "2024.2.0",
    downloads: "102M",
    icon: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png",
    description:
      "IntelliSense, Linting, Debugging (multi-threaded, remote), Jupyter Notebooks, code formatting, refactoring, unit tests, and more.",
  },
  {
    id: "eslint",
    name: "ESLint",
    publisher: "Microsoft",
    version: "2.4.2",
    downloads: "34M",
    icon: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/eslint/eslint.png",
    description: "Integrates ESLint into VS Code.",
  },
  {
    id: "prettier",
    name: "Prettier - Code formatter",
    publisher: "Prettier",
    version: "10.1.0",
    downloads: "42M",
    icon: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/prettier/prettier.png",
    description: "Code formatter using prettier",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    publisher: "GitHub",
    version: "1.143.0",
    downloads: "12M",
    icon: "https://github.githubassets.com/assets/copilot-logo-6c617132848e.svg",
    description: "Your AI pair programmer.",
  },
  {
    id: "docker",
    name: "Docker",
    publisher: "Microsoft",
    version: "1.29.0",
    downloads: "28M",
    icon: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png",
    description:
      "Makes it easy to create, manage, and debug containerized applications.",
  },
];

export const MOCK_FILE_SYSTEM = [
  {
    id: "root",
    name: "track-api-prod",
    type: "folder",
    children: [
      {
        id: "src",
        name: "src",
        type: "folder",
        children: [
          {
            id: "main.cpp",
            name: "main.cpp",
            type: "file",
            language: "cpp",
            content:
              '#include <iostream>\n\nint main() {\n    std::cout << "Hello TrackCodex!" << std::endl;\n    return 0;\n}',
          },
          {
            id: "utils.ts",
            name: "utils.ts",
            type: "file",
            language: "typescript",
            content: "export const add = (a: number, b: number) => a + b;",
          },
          {
            id: "server.go",
            name: "server.go",
            type: "file",
            language: "go",
            content:
              'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Server running...")\n}',
          },
        ],
      },
      {
        id: "README.md",
        name: "README.md",
        type: "file",
        language: "markdown",
        content: "# TrackCodex API\n\nProduction backend service.",
      },
      {
        id: ".gitignore",
        name: ".gitignore",
        type: "file",
        language: "plaintext",
        content: "node_modules\ndist\n.env",
      },
      {
        id: "package.json",
        name: "package.json",
        type: "file",
        language: "json",
        content: '{\n  "name": "track-api",\n  "version": "1.0.0"\n}',
      },
    ],
  },
];
// --- REPOSITORY CONTENT MOCK DATA ---

export const MOCK_REPO_FILES: FileItem[] = [
  {
    name: ".github/workflows",
    type: "dir",
    commitVal: "Update CI pipeline for release",
    time: "2 days ago",
    icon: "folder",
    path: ".github/workflows",
  },
  {
    name: "src",
    type: "dir",
    commitVal: "Refactor auth middleware validation",
    time: "4 hours ago",
    icon: "folder",
    path: "src",
  },
  {
    name: "public",
    type: "dir",
    commitVal: "Add favicon and manifest",
    time: "3 weeks ago",
    icon: "folder",
    path: "public",
  },
  {
    name: "tests",
    type: "dir",
    commitVal: "Add unit tests for user service",
    time: "5 days ago",
    icon: "folder",
    path: "tests",
  },
  {
    name: ".gitignore",
    type: "file",
    commitVal: "Ignore build artifacts",
    time: "2 months ago",
    icon: "file",
    path: ".gitignore",
  },
  {
    name: "LICENSE",
    type: "file",
    commitVal: "Initial commit",
    time: "1 year ago",
    icon: "file",
    path: "LICENSE",
  },
  {
    name: "README.md",
    type: "file",
    commitVal: "Update documentation links",
    time: "1 hour ago",
    icon: "file",
    path: "README.md",
  },
  {
    name: "package.json",
    type: "file",
    commitVal: "Bump version to 2.4.1",
    time: "15 minutes ago",
    icon: "file",
    path: "package.json",
  },
  {
    name: "tsconfig.json",
    type: "file",
    commitVal: "Strict mode enabled",
    time: "6 months ago",
    icon: "file",
    path: "tsconfig.json",
  },
  {
    name: "vite.config.ts",
    type: "file",
    commitVal: "Optimize build chunks",
    time: "1 week ago",
    icon: "file",
    path: "vite.config.ts",
  },
];

export const MOCK_ISSUES = [
  {
    id: 142,
    title: "Authentication fails with 500 on fresh install",
    status: "open",
    author: "jdoe",
    time: "2 hours ago",
    comments: 4,
    labels: [
      { name: "bug", color: "#d73a49" },
      { name: "priority", color: "#b60205" },
    ],
  },
  {
    id: 141,
    title: "Add support for OAuth2 providers",
    status: "open",
    author: "alexcoder",
    time: "5 hours ago",
    comments: 12,
    labels: [{ name: "feature", color: "#a2eeef" }],
  },
  {
    id: 139,
    title: "Memory leak in dashboard component",
    status: "closed",
    author: "sarah_backend",
    time: "yesterday",
    comments: 1,
    labels: [{ name: "bug", color: "#d73a49" }],
  },
];

export const MOCK_PRS = [
  {
    id: 143,
    title: "feat: Add Google Login integration",
    status: "open",
    author: "alexcoder",
    time: "1 hour ago",
    comments: 2,
    checks: "passing",
  },
  {
    id: 140,
    title: "fix: Resolve dashboard memory leak",
    status: "merged",
    author: "sarah_backend",
    time: "yesterday",
    comments: 5,
    checks: "passing",
  },
];

export const MOCK_DISCUSSIONS = [
  {
    id: 1,
    title: "Best practices for state management?",
    category: "Q&A",
    author: "newbie_dev",
    time: "3 days ago",
    replies: 8,
    upvotes: 12,
  },
  {
    id: 2,
    title: "RFC: Plugin Architecture v2",
    category: "Ideas",
    author: "arch_lead",
    time: "1 week ago",
    replies: 24,
    upvotes: 45,
  },
];

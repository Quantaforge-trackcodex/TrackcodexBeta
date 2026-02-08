export type SystemRole =
  | "Super Admin"
  | "Org Admin"
  | "Team Admin"
  | "Moderator"
  | "Developer"
  | "Viewer";

export type RepoRole = "READ" | "TRIAGE" | "WRITE" | "MAINTAIN" | "ADMIN";

export type RepoPermission =
  | "pull_code"
  | "push_code"
  | "triage_issues"
  | "manage_webhooks"
  | "administer_repo"
  | "delete_repo";

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  isCustom: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  status: "Running" | "Stopped" | "Starting" | "Ready" | "Cloning" | "Failed";
  runtime: string;
  lastModified: string;
  repo: string; // Keep for legacy
  repoUrl?: string | null; // Real backend field
  branch: string;
  commit: string;
  collaborators: string[];
  project?: string;
  environment?: "DEV" | "STAGING" | "PROD";
  hasPassword?: boolean;
  ownerId?: string;
  updatedAt?: string;
}

export interface PullRequest {
  id: string;
  number: string;
  title: string;
  status: "Open" | "Merged" | "Closed";
  ciStatus: "Failing" | "Passing" | "None";
  author: string;
}

export interface AITask {
  id: string;
  taskName: string;
  fileName: string;
  model: string;
  result: "Success" | "Processing" | "Diff Generated";
  timestamp: string;
}

export interface SecurityAlert {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  vulnerability: string;
  repository: string;
  status: "Open" | "In-Review" | "Fixed";
}

export interface LanguageDist {
  name: string;
  percentage: number;
  color: string;
}

export interface RepoRefactor {
  id: string;
  type: "Complexity" | "Modernization";
  description: string;
  target: string;
}

export interface Repository {
  id: string;
  name: string;
  isPublic: boolean;
  description: string;
  techStack: string; // Keep for UI helper
  techColor: string; // Keep for UI helper
  language?: string; // Backend Prisma field
  stars: number;
  forks: number;
  aiHealth: string;
  aiHealthLabel: string;
  securityStatus: string;
  lastUpdated: string;
  visibility: "PRIVATE" | "PUBLIC";
  logo?: string;
  readme?: string;
  githubId?: number;
  htmlUrl?: string;
  languages?: LanguageDist[];
  refactors?: RepoRefactor[];
  contributors?: string[];
  releaseVersion?: string;
  owner?: string;
  open_issues?: number;
  license?: string;
  updatedAt?: string;
}

export interface LiveSession {
  id: string;
  title: string;
  project: string;
  host: string;
  hostAvatar: string;
  viewers: number;
  participants: number;
}

export interface PinnedRepo {
  name: string;
  description: string;
  language: string;
  langColor: string;
  stars: string;
  forks: number;
  isPublic: boolean;
}

export interface ProfileData {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: string;
  following: number;
  company: string;
  location: string;
  website: string;
  rating: string;
  pinnedRepos: PinnedRepo[];
}

export interface LibraryResource {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  techStack: string;
  techColor: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  visibility: "PUBLIC" | "PRIVATE" | "RESEARCH";
  isAudited: boolean;
  type: "Template" | "Guide" | "Snippet" | "Paper" | "Kit";
  tags: string[];
  snippetPreview?: string;
  version?: string;
}

export interface LibraryCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface OfferDetails {
  baseSalary: string;
  equity: string;
  signOnBonus: string;
  startDate: string;
  reportingManager: string;
  officeLocation: string;
  includeRelocation: boolean;
  customNDA: boolean;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  longDescription?: string; // Enhanced description for rich details
  techStack: string[];
  budget: string;
  type: "Contract" | "Gig" | "Full-time" | "Bounty";
  status: "Open" | "InProgress" | "Completed" | "Pending";
  repoId: string;
  creator: {
    name: string;
    avatar: string;
  };
  postedDate: string;
  targetUserId?: string;
  personalNote?: string;
  offerDetails?: OfferDetails; // New field for rich offers
}

// --- Community Enhancement Types ---

export type KarmaLevel =
  | "Contributor"
  | "Collaborator"
  | "Expert"
  | "Maintainer";

export interface CommunityComment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    karma: number;
  };
  text: string;
  timestamp: string;
  replies?: CommunityComment[];
  upvotes: number;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    username: string;
    role: string;
    avatar: string;
    isLive?: boolean;
    karma?: number;
  };
  time: string;
  visibility: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  comments: number;
  commentsData?: CommunityComment[];
  linkedEntity?: {
    type: "repo" | "workspace";
    id: string;
    label: string;
  };
  codeSnippet?: {
    filename: string;
    language: string;
    content: string;
  };
  image?: string;
  type?: string;
  moderation?: "SAFE" | "WARNING" | "FLAGGED";
  moderationReason?: string;
}

// --- Admin Types ---

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    username: string;
    avatar: string;
  };
  action: string;
  target: string;
  severity: "Info" | "Warning" | "Critical";
  metadata?: any;
}

export interface SystemMetrics {
  activeUsers: number;
  liveWorkspaces: number;
  repoActivityCount: number;
  jobsCreatedToday: number;
  communityHealthScore: number;
  pendingFlags: number;
}

// --- Organization Types ---

// --- Organization Types ---

export type OrgRole = "OWNER" | "ADMIN" | "MEMBER" | "BILLING_MANAGER";
export type TeamRole = "MAINTAINER" | "MEMBER";

export interface OrgMember {
  username: string;
  name: string;
  avatar: string;
  role: OrgRole;
  lastActive: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  repoCount: number;
}

export interface Organization {
  id: string;
  name: string;
  avatar: string;
  description: string;
  website?: string;
  location?: string;
  members: OrgMember[];
  teams: Team[];
  repositories: Repository[];
}

// --- Settings Types ---

export interface PersonalAccessToken {
  id: string;
  name: string;
  tokenPreview: string; // e.g., 'tcx_live_a83k...'
  scopes: string[];
  expiresAt: number | null; // timestamp or null for no expiry
  createdAt: number;
}

// --- Hiring & Growth Types ---
export interface SkillProficiency {
  skill: string;
  proficiency: number;
}

export interface GrowthPathItem {
  skill: string;
  category: string;
  currentProficiency: number;
  targetLevel: string;
  recommendation: string;
}

export interface SkillRadarData {
  subject: string;
  score: number;
  fullMark: number;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location?: string;
  aiComplexityScore: number;
  codeReplayUrl: string; // for highlights
  prQuality?: number; // for discovery view
  status?: "Passing" | "Idle" | "Archived" | "Top Match"; // for discovery view

  // For Comparison View
  aiComplexityDepth?: "High Depth" | "Elite" | "Standard";
  codeReplayHighlights?: string[];
  interviewerSentiment?: number;
  techStackMatch?: { skill: string; alignment: number }[];
  trialPRLink?: string;
  decision?: "Extend Offer" | "Schedule Final" | "Archive";

  // For Scorecard View
  techScore?: number;
  cultureFit?: number;
  complexity?: string; // "High", "Medium", etc.
  experience?: string; // "8y+", etc.
  technicalEvidence?: {
    title: string;
    description: string;
    complexity: number;
    quality: number;
    timestamp: string;
  }[];
  linesChanged?: { added: number; removed: number };
  testingCoverage?: number;
  maintainability?: string;
  qualitativeNotes?: {
    author: string;
    avatar: string;
    rating: number;
    note: string;
    tags: string[];
    strengths: string[];
    potentials: string[];
  }[];
}

export interface TrialRepo {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  status: "Newly Active" | "Updated";
  description: string;
  challenges: string[];
  tech: string[];
  deployments: number;
  coverage: number;
  avgPrReview: string;
  logo: string;
  repoName: string;
  readme?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "locked";
  dueDate?: string;
  type: "required" | "priority" | "social" | "goal";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "job_match" | "system" | "message" | "alert";
  read: boolean;
  timestamp: string;
  link?: string;
  metadata?: any;
}

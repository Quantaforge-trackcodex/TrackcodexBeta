
export type SystemRole = 'Super Admin' | 'Org Admin' | 'Team Admin' | 'Moderator' | 'Developer' | 'Viewer';

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  isCustom: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  status: 'Running' | 'Stopped';
  runtime: string;
  lastModified: string;
  repo: string;
  branch: string;
  commit: string;
  collaborators: string[];
  project?: string;
  environment?: 'DEV' | 'STAGING' | 'PROD';
}

export interface PullRequest {
  id: string;
  number: string;
  title: string;
  status: 'Open' | 'Merged' | 'Closed';
  ciStatus: 'Failing' | 'Passing' | 'None';
  author: string;
}

export interface AITask {
  id: string;
  taskName: string;
  fileName: string;
  model: string;
  result: 'Success' | 'Processing' | 'Diff Generated';
  timestamp: string;
}

export interface SecurityAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  vulnerability: string;
  repository: string;
  status: 'Open' | 'In-Review' | 'Fixed';
}

export interface LanguageDist {
  name: string;
  percentage: number;
  color: string;
}

export interface RepoRefactor {
  id: string;
  type: 'Complexity' | 'Modernization';
  description: string;
  target: string;
}

export interface Repository {
  id: string;
  name: string;
  isPublic: boolean;
  description: string;
  techStack: string;
  techColor: string;
  stars: number;
  forks: number;
  aiHealth: string;
  aiHealthLabel: string;
  securityStatus: string;
  lastUpdated: string;
  visibility: 'PRIVATE' | 'PUBLIC';
  readme?: string;
  languages?: LanguageDist[];
  refactors?: RepoRefactor[];
  contributors?: string[];
  releaseVersion?: string;
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
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESEARCH';
  isAudited: boolean;
  type: 'Template' | 'Guide' | 'Snippet' | 'Paper' | 'Kit';
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

export interface Job {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  budget: string;
  type: 'Contract' | 'Gig' | 'Full-time';
  status: 'Open' | 'In Progress' | 'Completed' | 'Pending' | 'Pending Review';
  techStack: string[];
  repoId: string;
  creator: {
    name: string;
    avatar: string;
  };
  rating?: number;
  feedback?: string;
  postedDate: string;
  targetUserId?: string; // For direct offers
  personalNote?: string;
}

// --- Community Enhancement Types ---

export type KarmaLevel = 'Contributor' | 'Collaborator' | 'Expert' | 'Maintainer';

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
    type: 'repo' | 'workspace';
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
  moderation?: 'SAFE' | 'WARNING' | 'FLAGGED';
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
  severity: 'Info' | 'Warning' | 'Critical';
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

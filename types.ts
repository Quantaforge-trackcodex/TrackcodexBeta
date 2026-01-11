
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

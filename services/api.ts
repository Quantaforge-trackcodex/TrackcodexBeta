
import { Repository, Workspace, Job, ProfileData } from '../types';

const API_BASE = '/api/v1';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tc_token');
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || 'Request failed', errorData);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => request<any>('/auth/me'),
  },
  workspaces: {
    list: () => request<Workspace[]>('/workspaces'),
    get: (id: string) => request<Workspace>(`/workspaces/${id}`),
    create: (data: any) => request<Workspace>('/workspaces', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => request<Workspace>(`/workspaces/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  repositories: {
    list: () => request<Repository[]>('/repositories'),
    get: (id: string) => request<Repository>(`/repositories/${id}`),
    create: (data: any) => request<Repository>('/repositories', { method: 'POST', body: JSON.stringify(data) }),
  },
  forgeAI: {
    streamCompletion: (prompt: string, context: any) => request<any>('/forgeai/complete', { method: 'POST', body: JSON.stringify({ prompt, context }) }),
    analyzeRepo: (repoId: string) => request<any>(`/forgeai/analyze/${repoId}`),
  },
  jobs: {
    list: () => request<Job[]>('/jobs'),
    create: (data: any) => request<Job>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    apply: (id: string) => request<void>(`/jobs/${id}/apply`, { method: 'POST' }),
  },
  profile: {
    get: (username: string) => request<ProfileData>(`/profiles/${username}`),
    update: (data: any) => request<ProfileData>('/profiles/me', { method: 'PATCH', body: JSON.stringify(data) }),
  }
};

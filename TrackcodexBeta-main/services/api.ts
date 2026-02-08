import { Repository, Workspace, Job, ProfileData } from "../types";

// Extended Window interface for Electron Bridge
declare global {
  interface Window {
    electron?: {
      env: {
        API_URL: string;
      };
    };
  }
}

// Dynamic API Base: Uses Electron Bridge if available (Desktop), otherwise relative (Web)
const API_BASE = window.electron?.env.API_URL
  ? `${window.electron.env.API_URL}/api/v1`
  : "/api/v1";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // We use Cookies for auth, so no Bearer token needed
  // But we MUST send CSRF token
  const csrfToken = localStorage.getItem("csrf_token");
  const headers = new Headers(options.headers);

  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");

  // IMPORTANT: 'include' credentials to send HttpOnly cookies
  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  const response = await fetch(`${API_BASE}${path}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      // Handle unauthorized background requests silently or trigger logout?
      // For now, let it throw so callers know it failed
    }
    throw new ApiError(
      response.status,
      errorData.message || "Request failed",
      errorData,
    );
  }

  const text = await response.text();
  try {
    return text ? JSON.parse(text) : ({} as T);
  } catch (e) {
    console.error("Failed to parse response JSON", e);
    return {} as T;
  }
}

export const api = {
  auth: {
    login: (credentials: any) =>
      request<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    getMe: () => request<any>("/auth/me"),
  },
  workspaces: {
    list: () => request<Workspace[]>("/workspaces"),
    get: (id: string) => request<Workspace>(`/workspaces/${id}`),
    create: (data: any) =>
      request<Workspace>("/workspaces", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: string) =>
      request<Workspace>(`/workspaces/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) =>
      request<void>(`/workspaces/${id}`, { method: "DELETE" }),
  },
  repositories: {
    list: () => request<Repository[]>("/repositories"),
    get: (id: string) => request<Repository>(`/repositories/${id}`),
    create: (data: any) =>
      request<Repository>("/repositories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    sync: () =>
      request<{ message: string; repositories: Repository[] }>(
        "/repositories/sync",
        { method: "POST" },
      ),
  },
  forgeAI: {
    complete: (options: {
      prompt: string;
      provider?: string;
      model?: string;
      workspaceId?: string;
      systemPrompt?: string;
    }) =>
      request<any>("/forgeai/complete", {
        method: "POST",
        body: JSON.stringify(options),
      }),
    synthesize: (requirement: string, workspaceId: string) =>
      request<any>("/forgeai/synthesize", {
        method: "POST",
        body: JSON.stringify({ requirement, workspaceId }),
      }),
  },
  jobs: {
    list: () => request<Job[]>("/jobs"),
    create: (data: any) =>
      request<Job>("/jobs", { method: "POST", body: JSON.stringify(data) }),
    apply: (id: string) =>
      request<void>(`/jobs/${id}/apply`, { method: "POST" }),
  },
  profile: {
    get: (username: string) => request<ProfileData>(`/profiles/${username}`),
    update: (data: any) =>
      request<ProfileData>("/profiles/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  cloud: {
    listContainers: () => request<any[]>("/cloud/containers"),
    stopContainer: (id: string) =>
      request<any>(`/cloud/containers/${id}/stop`, { method: "POST" }),
    listPipelines: (workspaceId?: string) =>
      request<any[]>(
        `/cloud/pipelines${workspaceId ? `?workspaceId=${workspaceId}` : ""}`,
      ),
    triggerPipeline: (workspaceId: string) =>
      request<any>("/cloud/pipelines", {
        method: "POST",
        body: JSON.stringify({ workspaceId }),
      }),
    getPipeline: (id: string) => request<any>(`/cloud/pipelines/${id}`),
  },
  notifications: {
    list: (userId: string) => request<any[]>(`/notifications?userId=${userId}`),
  },
  // Generic methods for services
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: any) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: any) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};

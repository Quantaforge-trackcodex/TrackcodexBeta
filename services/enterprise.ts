import { api } from "./api";

export interface Enterprise {
  id: string;
  slug: string;
  name: string;
  plan: string;
  status: string;
  members: EnterpriseMember[];
  organizations?: any[];
  _count?: { members: number };
  ssoConfig?: any;
  createdAt: string;
}

export interface EnterpriseMember {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

export const enterpriseApi = {
  // Create an Enterprise
  create: (data: { name: string; slug: string }) =>
    api.post<Enterprise>("/enterprises", data),

  // Get details
  get: (slug: string) => api.get<Enterprise>(`/enterprises/${slug}`),

  // Invite member
  addMember: (slug: string, data: { userId: string; role: string }) =>
    api.post<EnterpriseMember>(`/enterprises/${slug}/members`, data),

  // Get members
  getMembers: (slug: string) =>
    api.get<{ members: EnterpriseMember[] }>(`/enterprises/${slug}/members`),

  // List my enterprises
  getMyEnterprises: () => api.get<Enterprise[]>("/enterprises"),
};

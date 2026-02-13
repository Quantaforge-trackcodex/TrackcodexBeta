import { api } from "./api";

export interface StrataNetwork {
  id: string;
  slug: string;
  name: string;
  plan: string;
  status: string;
  members: StrataNetworkMember[];
  strata?: any[];
  _count?: { members: number };
  ssoConfig?: any;
  createdAt: string;
}

export interface StrataNetworkMember {
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

export const strataNetworkApi = {
  // Create a StrataNetwork
  create: (data: { name: string; slug: string }) =>
    api.post<StrataNetwork>("/enterprises", data),

  // Get details
  get: (slug: string) => api.get<StrataNetwork>(`/enterprises/${slug}`),

  // Invite member
  addMember: (slug: string, data: { userId: string; role: string }) =>
    api.post<StrataNetworkMember>(`/enterprises/${slug}/members`, data),

  // Get members
  getMembers: (slug: string) =>
    api.get<{ members: StrataNetworkMember[] }>(`/enterprises/${slug}/members`),

  // List my enterprises
  getMyNetworks: () => api.get<StrataNetwork[]>("/enterprises"),
};

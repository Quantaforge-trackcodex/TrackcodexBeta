import { api } from "../context/AuthContext";

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: string; // OWNER, ADMIN, WRITE, READ
  joinedAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    email: string;
  };
  inviter?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
  workspace: {
    id: string;
    name: string;
    description?: string;
    visibility: string;
  };
  inviter: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

export interface WorkspacePermissions {
  role: string | null;
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canManageMembers: boolean;
    canDelete: boolean;
    canTransferOwnership: boolean;
    canManagePassword: boolean;
  };
}

class WorkspaceCollaborationService {
  /**
   * Invite user to workspace
   */
  async inviteToWorkspace(
    workspaceId: string,
    email: string,
    role: string,
  ): Promise<{ invite: WorkspaceInvite }> {
    const response = await api.post(`/workspaces/${workspaceId}/invite`, {
      email,
      role,
    });
    return response.data;
  }

  /**
   * Get workspace members
   */
  async getWorkspaceMembers(
    workspaceId: string,
  ): Promise<{ members: WorkspaceMember[] }> {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    workspaceId: string,
    memberId: string,
    role: string,
  ): Promise<{ member: WorkspaceMember }> {
    const response = await api.patch(
      `/workspaces/${workspaceId}/members/${memberId}`,
      { role },
    );
    return response.data;
  }

  /**
   * Remove member from workspace
   */
  async removeMember(
    workspaceId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    const response = await api.delete(
      `/workspaces/${workspaceId}/members/${memberId}`,
    );
    return response.data;
  }

  /**
   * Leave workspace
   */
  async leaveWorkspace(workspaceId: string): Promise<{ message: string }> {
    const response = await api.post(`/workspaces/${workspaceId}/leave`);
    return response.data;
  }

  /**
   * Set workspace password
   */
  async setWorkspacePassword(
    workspaceId: string,
    password: string,
  ): Promise<{ message: string }> {
    const response = await api.post(`/workspaces/${workspaceId}/password`, {
      password,
    });
    return response.data;
  }

  /**
   * Remove workspace password
   */
  async removeWorkspacePassword(
    workspaceId: string,
  ): Promise<{ message: string }> {
    const response = await api.delete(`/workspaces/${workspaceId}/password`);
    return response.data;
  }

  /**
   * Verify workspace password
   */
  async verifyWorkspacePassword(
    workspaceId: string,
    password: string,
  ): Promise<{ valid: boolean }> {
    const response = await api.post(
      `/workspaces/${workspaceId}/verify-password`,
      {
        password,
      },
    );
    return response.data;
  }

  /**
   * Get pending invites for current user
   */
  async getPendingInvites(): Promise<{ invites: WorkspaceInvite[] }> {
    const response = await api.get("/workspace-invites");
    return response.data;
  }

  /**
   * Accept workspace invite
   */
  async acceptInvite(token: string): Promise<{ message: string }> {
    const response = await api.post(`/workspace-invites/${token}/accept`);
    return response.data;
  }

  /**
   * Decline workspace invite
   */
  async declineInvite(token: string): Promise<{ message: string }> {
    const response = await api.post(`/workspace-invites/${token}/decline`);
    return response.data;
  }

  /**
   * Cancel workspace invite
   */
  async cancelInvite(
    workspaceId: string,
    inviteId: string,
  ): Promise<{ message: string }> {
    const response = await api.delete(
      `/workspaces/${workspaceId}/invites/${inviteId}`,
    );
    return response.data;
  }

  /**
   * Get user's permissions for workspace
   */
  async getPermissions(workspaceId: string): Promise<WorkspacePermissions> {
    const response = await api.get(`/workspaces/${workspaceId}/permissions`);
    return response.data;
  }

  /**
   * Transfer workspace ownership
   */
  async transferOwnership(
    workspaceId: string,
    newOwnerId: string,
  ): Promise<{ message: string }> {
    const response = await api.post(`/workspaces/${workspaceId}/transfer`, {
      newOwnerId,
    });
    return response.data;
  }
}

export const workspaceCollaborationService =
  new WorkspaceCollaborationService();

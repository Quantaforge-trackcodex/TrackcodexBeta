import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  workspaceCollaborationService as wsCollaborationService,
  WorkspaceMember,
} from "../services/workspaceCollaborationService";
import { WorkspaceSecuritySettings } from "../components/workspace/WorkspaceSecuritySettings";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";

const WorkspaceSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Utilizing a generic object type or 'any' cast to known shape if preferred
  // Ideally this should be typed as Workspace, but to fix lint we can use 'any' with eslint-disable or unknown.
  // The error was "Unexpected any". Using 'any' in useState<any> is the cause.
  // I will assume workspace has a shape or just leave it if I can't import Workspace type easily.
  // But wait, removing <any> and letting it infer or using unknown?
  // I'll try to use a partial shape or just suppress for now as I don't have the type handy.
  // Actually I should find the type. It's likely in services/api or workspaceCollaborationService.
  // Checking imports: import { WorkspaceMember } from ...
  // I'll use `Record<string, any>` which is better than `any`, or `unknown`.
  const [workspace, setWorkspace] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "general" | "members" | "security"
  >("general");
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchWorkspaceData = React.useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [wsData, membersData] = await Promise.all([
        api.workspaces.get(id),
        wsCollaborationService.getWorkspaceMembers(id),
      ]);
      setWorkspace(wsData);
      setMembers(membersData.members);

      // Determine current user's role
      const myMember = membersData.members.find((m) => m.userId === user?.id);
      setCurrentUserRole(myMember?.role || null);
    } catch (error) {
      console.error("Failed to fetch workspace settings data", error);
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    fetchWorkspaceData();
  }, [fetchWorkspaceData, refreshKey]);

  const handleDeleteWorkspace = async () => {
    if (
      !id ||
      !window.confirm(
        "Are you sure you want to delete this workspace? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.workspaces.delete(id);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete workspace", error);
      alert(
        `Failed to delete workspace: ${(error as Error).message || "Unknown error"}`,
      );
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!id) return;
    try {
      await wsCollaborationService.updateMemberRole(id, memberId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
      );
    } catch (error) {
      console.error("Failed to update role", error);
      alert(
        `Failed to update member role: ${(error as Error).message || "Unknown error"}`,
      );
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!id || !window.confirm("Remove this member?")) return;
    try {
      await wsCollaborationService.removeMember(id, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (error) {
      console.error("Failed to remove member", error);
      alert(
        `Failed to remove member: ${(error as Error).message || "Unknown error"}`,
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gh-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gh-bg text-gh-text-secondary">
        <p>Workspace not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-primary hover:underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  const canManageMembers =
    currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  const isOwner = currentUserRole === "OWNER";

  return (
    <div className="min-h-screen bg-gh-bg text-gh-text flex flex-col">
      {/* Header */}
      <div className="border-b border-gh-border bg-gh-bg-secondary px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(`/workspace/${id}`)}
          className="text-gh-text-secondary hover:text-gh-text transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gh-text">Workspace Settings</h1>
          <p className="text-sm text-gh-text-secondary">{workspace.name}</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-gh-border bg-gh-bg py-6 px-4 space-y-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center gap-3 ${activeTab === "general"
                ? "bg-primary/10 text-primary"
                : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
              }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
            General
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center gap-3 ${activeTab === "members"
                ? "bg-primary/10 text-primary"
                : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
              }`}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            Members
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center gap-3 ${activeTab === "security"
                ? "bg-primary/10 text-primary"
                : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
              }`}
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            Security
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl">
          {activeTab === "general" && (
            <div className="space-y-8">
              <section className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-gh-text mb-4">
                  General Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="workspace-name"
                      className="block text-sm font-medium text-gh-text-secondary mb-1"
                    >
                      Workspace Name
                    </label>
                    <input
                      id="workspace-name"
                      type="text"
                      value={workspace.name}
                      disabled
                      className="w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-gh-text focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gh-text-muted mt-1">
                      Renaming workspaces is currently disabled.
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="workspace-description"
                      className="block text-sm font-medium text-gh-text-secondary mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="workspace-description"
                      value={workspace.description || ""}
                      disabled
                      className="w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-gh-text focus:outline-none focus:border-primary h-24 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              {isOwner && (
                <section className="bg-gh-bg-secondary border border-red-500/40 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-red-400 mb-4">
                    Danger Zone
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gh-text">Delete Workspace</h3>
                      <p className="text-sm text-gh-text-secondary">
                        Permanently delete this workspace and all its data.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteWorkspace}
                      className="px-4 py-2 bg-red-600/90 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete Workspace
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gh-border bg-gh-bg/50 flex justify-between items-center">
                <h2 className="font-bold text-gh-text">Workspace Members</h2>
                {canManageMembers && (
                  <button className="px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      person_add
                    </span>
                    Invite People
                  </button>
                )}
              </div>
              <div className="divide-y divide-gh-border">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 flex items-center justify-between hover:bg-gh-bg-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gh-bg-tertiary flex items-center justify-center text-gh-text overflow-hidden">
                        {member.user.avatar ? (
                          <img
                            src={member.user.avatar}
                            alt={member.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold">
                            {member.user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gh-text text-sm">
                          {member.user.name}
                          {member.userId === user?.id && (
                            <span className="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full uppercase tracking-wider">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gh-text-secondary">
                          @{member.user.username} • {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {canManageMembers && member.role !== "OWNER" ? (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(member.id, e.target.value)
                          }
                          aria-label="Change member role"
                          className="bg-gh-bg border border-gh-border text-gh-text text-xs rounded-md px-2 py-1 focus:outline-none focus:border-primary"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="WRITE">Editor</option>
                          <option value="READ">Viewer</option>
                        </select>
                      ) : (
                        <span className="px-2 py-1 bg-gh-bg-tertiary border border-gh-border text-gh-text-secondary text-xs rounded-md font-mono">
                          {member.role}
                        </span>
                      )}

                      {canManageMembers &&
                        member.userId !== user?.id &&
                        member.role !== "OWNER" && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1.5 text-gh-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Remove member"
                          >
                            <span className="material-symbols-outlined text-lg">
                              person_remove
                            </span>
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && id && (
            <WorkspaceSecuritySettings
              workspaceId={id}
              hasPassword={!!workspace.hasPassword}
              onPasswordChange={() => setRefreshKey((prev) => prev + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;

import { SystemRole } from "../types";

export type Permission =
  | "manage_users"
  | "manage_teams"
  | "manage_repos"
  | "manage_workspaces"
  | "manage_jobs"
  | "moderate_community"
  | "view_audit_logs"
  | "edit_roles"
  | "view_admin_panel";

const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  "Super Admin": [
    "manage_users",
    "manage_teams",
    "manage_repos",
    "manage_workspaces",
    "manage_jobs",
    "moderate_community",
    "view_audit_logs",
    "edit_roles",
    "view_admin_panel",
  ],
  "Org Admin": [
    "manage_users",
    "manage_teams",
    "manage_repos",
    "manage_workspaces",
    "view_audit_logs",
    "view_admin_panel",
  ],
  "Team Admin": ["manage_repos", "manage_workspaces", "view_admin_panel"],
  Moderator: ["moderate_community", "view_admin_panel"],
  Developer: [],
  Viewer: [],
};

export const hasPermission = (
  role: SystemRole,
  permission: Permission,
): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const isAdmin = (role: SystemRole): boolean => {
  return ["Super Admin", "Org Admin", "Team Admin", "Moderator"].includes(role);
};

// --- Repository RBAC ---

import { RepoRole, RepoPermission } from "../types";

const REPO_ROLE_PERMISSIONS: Record<RepoRole, RepoPermission[]> = {
  READ: ["pull_code"],
  TRIAGE: ["pull_code", "triage_issues"],
  WRITE: ["pull_code", "triage_issues", "push_code"],
  MAINTAIN: ["pull_code", "triage_issues", "push_code", "manage_webhooks"],
  ADMIN: [
    "pull_code",
    "triage_issues",
    "push_code",
    "manage_webhooks",
    "administer_repo",
    "delete_repo",
  ],
};

export const hasRepoPermission = (
  role: RepoRole,
  permission: RepoPermission,
): boolean => {
  return REPO_ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

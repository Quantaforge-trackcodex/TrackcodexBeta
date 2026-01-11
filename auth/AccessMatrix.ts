
import { SystemRole } from '../types';

export type Permission = 
  | 'manage_users' 
  | 'manage_teams' 
  | 'manage_repos' 
  | 'manage_workspaces' 
  | 'manage_jobs' 
  | 'moderate_community' 
  | 'view_audit_logs' 
  | 'edit_roles'
  | 'view_admin_panel';

const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  'Super Admin': [
    'manage_users', 'manage_teams', 'manage_repos', 
    'manage_workspaces', 'manage_jobs', 'moderate_community', 
    'view_audit_logs', 'edit_roles', 'view_admin_panel'
  ],
  'Org Admin': [
    'manage_users', 'manage_teams', 'manage_repos', 
    'manage_workspaces', 'view_audit_logs', 'view_admin_panel'
  ],
  'Team Admin': [
    'manage_repos', 'manage_workspaces', 'view_admin_panel'
  ],
  'Moderator': [
    'moderate_community', 'view_admin_panel'
  ],
  'Developer': [],
  'Viewer': []
};

export const hasPermission = (role: SystemRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const isAdmin = (role: SystemRole): boolean => {
  return ['Super Admin', 'Org Admin', 'Team Admin', 'Moderator'].includes(role);
};

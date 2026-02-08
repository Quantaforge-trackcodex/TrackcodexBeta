import React from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

// Admin Sub-modules (implemented below as internal components for concise structure)
import AdminOverview from "../components/admin/AdminOverview";
import UserManager from "../components/admin/UserManager";
import TeamManager from "../components/admin/TeamManager";
import WorkspaceMonitor from "../components/admin/WorkspaceMonitor";
import RepositoryGovernance from "../components/admin/RepositoryGovernance";
import JobOversight from "../components/admin/JobOversight";
import CommunityModeration from "../components/admin/CommunityModeration";
import RoleEditor from "../components/admin/RoleEditor";
import AuditLogs from "../components/admin/AuditLogs";

const AdminNavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) => (
  <NavLink
    to={to}
    end={to === "/admin"}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-widest ${isActive
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        : "text-gh-text-secondary hover:text-gh-text hover:bg-gh-bg-tertiary"
      }`
    }
  >
    <span className="material-symbols-outlined !text-[18px]">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

const AdminRoomView = () => {
  const location = useLocation();

  return (
    <div className="flex h-full bg-gh-bg font-display overflow-hidden">
      {/* Internal Admin Sidebar */}
      <aside className="w-64 border-r border-gh-border flex flex-col p-4 shrink-0 bg-gh-bg-secondary">
        <div className="px-3 mb-8">
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="material-symbols-outlined filled !text-[20px]">
              admin_panel_settings
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Governance Module
            </span>
          </div>
          <h2 className="text-xl font-black text-gh-text">Admin Room</h2>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <AdminNavItem to="/admin" icon="dashboard" label="Overview" />
          <div className="h-px bg-gh-border my-4 mx-3"></div>
          <p className="px-3 text-[9px] font-black text-gh-text-secondary uppercase tracking-widest mb-2">
            Management
          </p>
          <AdminNavItem to="/admin/users" icon="person" label="Users" />
          <AdminNavItem to="/admin/teams" icon="groups" label="Teams" />
          <AdminNavItem
            to="/admin/workspaces"
            icon="terminal"
            label="Workspaces"
          />
          <AdminNavItem
            to="/admin/repositories"
            icon="account_tree"
            label="Repositories"
          />
          <div className="h-px bg-gh-border my-4 mx-3"></div>
          <p className="px-3 text-[9px] font-black text-gh-text-secondary uppercase tracking-widest mb-2">
            Operations
          </p>
          <AdminNavItem to="/admin/jobs" icon="work" label="Jobs" />
          <AdminNavItem
            to="/admin/community"
            icon="diversity_3"
            label="Community"
          />
          <div className="h-px bg-gh-border my-4 mx-3"></div>
          <p className="px-3 text-[9px] font-black text-gh-text-secondary uppercase tracking-widest mb-2">
            Security
          </p>
          <AdminNavItem to="/admin/roles" icon="shield_person" label="Roles" />
          <AdminNavItem
            to="/admin/audit-logs"
            icon="list_alt"
            label="Audit Logs"
          />
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
            Compliance Active
          </p>
          <p className="text-[10px] text-gh-text-secondary leading-tight">
            All actions in the Admin Room are logged for internal audit.
          </p>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminRoomView;

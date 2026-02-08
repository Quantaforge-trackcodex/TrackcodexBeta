import React, { useEffect, useState } from "react";
import { useSidebarState } from "../../hooks/useSidebarState";
import { profileService, UserProfile } from "../../services/profile";
import SidebarItem from "./SidebarItem";
import { isAdmin as checkIsAdmin } from "../../auth/AccessMatrix";


const OrgSwitcher = ({
  isExpanded,
  profile,
}: {
  isExpanded: boolean;
  profile: UserProfile;
}) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-2 rounded-xl transition-all group cursor-pointer ${isExpanded ? "bg-gh-bg-secondary border border-gh-border hover:bg-gh-bg" : ""}`}
      >
        <div className="relative shrink-0">
          <img
            src={profile.avatar}
            className="size-8 rounded-lg border border-gh-border group-hover:border-primary/50 transition-all object-cover"
            alt={profile.name}
          />
        </div>
        {isExpanded && (
          <div className="flex flex-col min-w-0 flex-1 animate-in fade-in duration-300">
            <span className="text-[12px] font-bold text-gh-text truncate leading-none mb-1">
              {profile.name}
            </span>
            <span className="text-[9px] text-gh-text-secondary font-black uppercase tracking-widest">
              {profile.systemRole}
            </span>
          </div>
        )}
        {isExpanded && (
          <span
            className={`material-symbols-outlined !text-[16px] text-gh-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            expand_more
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gh-bg-secondary border border-gh-border rounded-xl shadow-2xl z-[100] p-1 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-1">
          {/* Status Placeholder */}
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gh-bg cursor-pointer border border-transparent hover:border-gh-border transition-all">
            <span className="material-symbols-outlined text-gh-text-secondary text-sm">
              sentiment_satisfied
            </span>
            <span className="text-xs text-gh-text-secondary">Set status</span>
          </div>

          <div
            onClick={() => window.location.reload()}
            className="menu-item-gh text-red-400 hover:text-red-300"
          >
            <span className="material-symbols-outlined icon">logout</span> Sign
            out
          </div>
        </div>
      )}
      <style>{`
        .menu-item-gh {
            @apply flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/10 cursor-pointer text-sm text-gh-text hover:text-blue-400 transition-colors;
        }
        .menu-item-gh .icon {
            @apply text-[18px] text-gh-text-secondary;
        }
        .menu-item-gh:hover .icon {
            @apply text-blue-400;
        }
      `}</style>
    </div>
  );
};

const Sidebar = () => {
  const { isExpanded, toggleSidebar, setIsExpanded } = useSidebarState();
  const [profile, setProfile] = useState<UserProfile>(
    profileService.getProfile(),
  );

  // Hooks
  const isAdmin = checkIsAdmin(profile.systemRole);

  useEffect(() => {
    return profileService.subscribe(setProfile);
  }, []);

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`
        glass-panel border-r border-gh-border flex flex-col shrink-0 h-full 
        transition-all duration-300 ease-in-out font-display relative z-50
        ${isExpanded ? "w-[240px]" : "w-[64px]"}
      `}
    >
      {/* Platform Branding & Toggle */}
      <div
        className={`h-14 flex items-center shrink-0 border-b border-gh-border relative group ${isExpanded ? "p-2" : "justify-center"}`}
      >
        {isExpanded ? (
          <OrgSwitcher isExpanded={isExpanded} profile={profile} />
        ) : (
          <span className="material-symbols-outlined text-gh-text-secondary">
            menu
          </span>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute -right-3 top-4 size-6 bg-gh-bg border border-gh-border rounded-full flex items-center justify-center text-gh-text-secondary hover:text-gh-text transition-all shadow-xl z-[60] hover:scale-110 ${isExpanded ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
        >
          <span
            className={`material-symbols-outlined !text-[16px] transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
          >
            chevron_left
          </span>
        </button>
      </div>

      {/* Primary Navigation - Flat Hierarchy */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1">
        <SidebarItem
          to="/dashboard/home"
          icon="home"
          label="Home"
          isExpanded={isExpanded}
        />

        <SidebarItem
          to="/platform-matrix"
          icon="insights"
          label="Platform Matrix"
          isExpanded={isExpanded}
        />
        <SidebarItem
          to="/repositories"
          icon="account_tree"
          label="Dashboard"
          isExpanded={isExpanded}
        />

        <SidebarItem
          to="/workspaces"
          icon="terminal"
          label="Workspaces"
          isExpanded={isExpanded}
        />
        <SidebarItem
          to="/dashboard/library"
          icon="auto_stories"
          label="Library"
          isExpanded={isExpanded}
        />
        <SidebarItem
          to="/marketplace"
          icon="store"
          label="Marketplace"
          isExpanded={isExpanded}
        />
        <SidebarItem
          to="/community"
          icon="diversity_3"
          label="Community"
          isExpanded={isExpanded}
        />
        <SidebarItem
          to="/forge-ai"
          icon="bolt"
          label="ForgeAI"
          isExpanded={isExpanded}
        />
        <SidebarItem
          to="/profile"
          icon="account_circle"
          label="Profile"
          isExpanded={isExpanded}
        />
        <SidebarItem
          to="/settings"
          icon="settings"
          label="Settings"
          isExpanded={isExpanded}
        />

        {/* Role Restricted Admin Panel */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-gh-border">
            <SidebarItem
              to="/admin"
              icon="verified_user"
              label="Admin Panel"
              isExpanded={isExpanded}
            />
          </div>
        )}
      </div>

      {/* User Quick Profile - Static Display Only */}
      <div className="p-3 bg-gh-bg-secondary shrink-0">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl transition-all ${!isExpanded ? "justify-center" : ""}`}
        >
          <div className="relative shrink-0">
            <img
              src={profile.avatar}
              className="size-8 rounded-lg border border-gh-border transition-all object-cover"
              alt=""
            />
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border-2 border-gh-bg" />
          </div>
          {isExpanded && (
            <div className="flex flex-col min-w-0 flex-1 animate-in fade-in duration-300">
              <span className="text-[12px] font-bold text-gh-text truncate leading-none mb-1">
                {profile.name}
              </span>
              <span className="text-[9px] text-gh-text-secondary font-black uppercase tracking-widest">
                {profile.systemRole}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

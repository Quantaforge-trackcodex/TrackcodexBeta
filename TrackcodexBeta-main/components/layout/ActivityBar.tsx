import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import TrackCodexLogo from "../branding/TrackCodexLogo";
import { profileService, UserProfile } from "../../services/profile";
import { SystemRole } from "../../types";

// Consistent role normalization
const getAccessTier = (role: SystemRole): "guest" | "developer" | "admin" => {
  if (["Super Admin", "Org Admin", "Team Admin", "Moderator"].includes(role))
    return "admin";
  if (role === "Developer") return "developer";
  return "guest";
};

const ActivityIcon = ({
  to,
  icon,
  label,
  badge,
  roles,
  userTier,
}: {
  to: string;
  icon: string;
  label: string;
  badge?: number;
  roles: string[];
  userTier: string;
}) => {
  if (!roles.includes(userTier)) return null;

  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        `w-full h-12 flex items-center justify-center relative transition-all duration-150 ${isActive
          ? "text-white border-l-2 border-white"
          : "text-slate-600 hover:text-slate-200"
        }`
      }
    >
      <span className={`material-symbols-outlined !text-[24px]`}>{icon}</span>
      {badge && (
        <span className="absolute top-2 right-2 size-4 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center border-2 border-gh-bg-secondary">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

const ActivityBar = () => {
  const [profile, setProfile] = useState<UserProfile>(
    profileService.getProfile(),
  );
  const userTier = getAccessTier(profile.systemRole);

  useEffect(() => {
    return profileService.subscribe((updated) => setProfile(updated));
  }, []);

  return (
    <aside className="w-12 bg-gh-bg-secondary flex flex-col items-center shrink-0 z-50 border-r border-gh-border">
      <div className="w-full h-12 flex items-center justify-center p-2 mb-2">
        <TrackCodexLogo size="sm" collapsed clickable className="scale-110" />
      </div>

      <ActivityIcon
        to="/dashboard/home"
        icon="home"
        label="Home"
        roles={["guest", "developer", "admin"]}
        userTier={userTier}
      />
      <ActivityIcon
        to="/workspaces"
        icon="terminal"
        label="Workspaces"
        roles={["developer", "admin"]}
        userTier={userTier}
      />
      <ActivityIcon
        to="/repositories"
        icon="account_tree"
        label="Source Control"
        roles={["developer", "admin"]}
        userTier={userTier}
      />
      <ActivityIcon
        to="/workspace/pr"
        icon="rule"
        label="Pull Requests"
        badge={2}
        roles={["developer", "admin"]}
        userTier={userTier}
      />
      <ActivityIcon
        to="/forge-ai"
        icon="psychology"
        label="ForgeAI"
        roles={["developer", "admin"]}
        userTier={userTier}
      />
      <ActivityIcon
        to="/community"
        icon="diversity_3"
        label="Community"
        roles={["guest", "developer", "admin"]}
        userTier={userTier}
      />
      <ActivityIcon
        to="/dashboard/jobs"
        icon="work"
        label="Mission Marketplace"
        roles={["guest", "developer", "admin"]}
        userTier={userTier}
      />

      <div className="mt-auto w-full flex flex-col items-center">
        <ActivityIcon
          to="/profile"
          icon="account_circle"
          label="Account"
          roles={["guest", "developer", "admin"]}
          userTier={userTier}
        />
        <ActivityIcon
          to="/settings"
          icon="settings"
          label="Settings"
          roles={["admin"]}
          userTier={userTier}
        />
      </div>
    </aside>
  );
};

export default ActivityBar;

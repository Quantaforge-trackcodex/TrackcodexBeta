import React from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";

const SettingsSidebarItem = ({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all ${
        isActive
          ? "bg-gh-bg-secondary text-gh-text font-bold border-l-2 border-primary"
          : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
      }`
    }
  >
    <span className="material-symbols-outlined !text-[18px] opacity-70">
      {icon}
    </span>
    {label}
  </NavLink>
);

import SettingsContextSwitcher from "./SettingsContextSwitcher";

// FIX: Removed the 'children' prop as this component uses react-router's <Outlet /> to render nested routes,
// and it's used as a layout route element without children being passed directly.
const SettingsLayout: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-gh-bg font-display overflow-hidden">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col lg:flex-row min-h-0 h-full p-8 gap-8">
        {/* Settings Navigation */}
        <aside className="w-full lg:w-[260px] shrink-0 space-y-8 overflow-y-auto no-scrollbar pb-8">
          <SettingsContextSwitcher currentContext="personal" />
          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              Personal Settings
            </h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsSidebarItem
                to="/settings/profile"
                label="Public Profile"
                icon="person"
              />
              <SettingsSidebarItem
                to="/settings/account"
                label="Account"
                icon="manage_accounts"
              />
              <SettingsSidebarItem
                to="/settings/appearance"
                label="Appearance"
                icon="palette"
              />
              <SettingsSidebarItem
                to="/settings/notifications"
                label="Notifications"
                icon="notifications"
              />
              <SettingsSidebarItem
                to="/settings/accessibility"
                label="Accessibility"
                icon="accessibility"
              />
            </nav>
          </section>

          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              Access
            </h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsSidebarItem
                to="/settings/security"
                label="Security"
                icon="shield"
              />
              <SettingsSidebarItem
                to="/settings/billing"
                label="Billing and plans"
                icon="credit_card"
              />
              <SettingsSidebarItem
                to="/settings/emails"
                label="Emails"
                icon="mail"
              />
            </nav>
          </section>

          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              Team Settings
            </h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsSidebarItem
                to="/settings/forge-ai-usage"
                label="ForgeAI Usage"
                icon="auto_awesome"
              />
            </nav>
          </section>

          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              Developer Settings
            </h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsSidebarItem
                to="/settings/tokens"
                label="Personal access tokens"
                icon="key"
              />
              <SettingsSidebarItem
                to="/settings/integrations"
                label="Integrations"
                icon="extension"
              />
            </nav>
          </section>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar pr-4 pb-20">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;

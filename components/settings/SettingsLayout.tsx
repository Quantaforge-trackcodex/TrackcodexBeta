import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

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
      `flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all ${isActive
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

const ExpandableMenuItem = ({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  // Check if any child route is active
  const isChildActive = React.Children.toArray(children).some((child: any) => {
    return location.pathname.includes(child.props.to);
  });

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-all ${isChildActive
          ? "bg-gh-bg-secondary text-gh-text font-bold"
          : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
          }`}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] opacity-70">
            {icon}
          </span>
          {label}
        </div>
        <span
          className={`material-symbols-outlined !text-[16px] transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"
            }`}
        >
          expand_more
        </span>
      </button>
      {isExpanded && (
        <div className="ml-9 mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
};

const SubMenuItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-3 py-1.5 rounded-md text-[12px] transition-all ${isActive
        ? "text-gh-text font-bold bg-gh-bg"
        : "text-gh-text-secondary hover:text-gh-text hover:bg-gh-bg/50"
      }`
    }
  >
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
              <SettingsSidebarItem
                to="/settings/privacy"
                label="Privacy"
                icon="lock"
              />
            </nav>
          </section>

          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              Access
            </h3>
            <nav className="flex flex-col gap-0.5">
              <ExpandableMenuItem icon="credit_card" label="Billing and licensing">
                <SubMenuItem to="/settings/billing" label="Overview" />
                <SubMenuItem to="/settings/billing/usage" label="Usage" />
                <SubMenuItem to="/settings/billing/analytics" label="Premium request analytics" />
                <SubMenuItem to="/settings/billing/budgets" label="Budgets and alerts" />
                <SubMenuItem to="/settings/billing/licensing" label="Licensing" />
                <SubMenuItem to="/settings/billing/payment-info" label="Payment information" />
                <SubMenuItem to="/settings/billing/payment-history" label="Payment history" />
                <SubMenuItem to="/settings/billing/additional" label="Additional billing details" />
              </ExpandableMenuItem>
              <SettingsSidebarItem
                to="/settings/emails"
                label="Emails"
                icon="mail"
              />
              <ExpandableMenuItem icon="shield" label="Security">
                <SubMenuItem to="/settings/security" label="Password and authentication" />
                <SubMenuItem to="/settings/integrations" label="Integrations" />
              </ExpandableMenuItem>
              <SettingsSidebarItem
                to="/settings/sessions"
                label="Sessions"
                icon="devices"
              />
              <SettingsSidebarItem
                to="/settings/ssh-keys"
                label="SSH and GPG keys"
                icon="key"
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
            </nav>
          </section>


          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              StrataHub
            </h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsSidebarItem
                to="/strata"
                label="StrataHub"
                icon="corporate_fare"
              />
            </nav>
          </section>

          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              AHI & CS System
            </h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsSidebarItem
                to="/settings/ahi-cs"
                label="AHI & CS System"
                icon="psychology"
              />
            </nav>
          </section>

          <section>
            <h3 className="px-3 text-[11px] font-black uppercase text-gh-text-secondary tracking-widest mb-3">
              Moderation
            </h3>
            <nav className="flex flex-col gap-0.5">
              <ExpandableMenuItem icon="gavel" label="Moderation">
                <SubMenuItem to="/admin/community" label="Blocked users" />
                <SubMenuItem to="/admin/interaction-limits" label="Interaction limits" />
                <SubMenuItem to="/admin/code-review-limits" label="Code review limits" />
              </ExpandableMenuItem>
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

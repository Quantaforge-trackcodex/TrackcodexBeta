import React from 'react';
import { NavLink, useParams, Outlet, useOutletContext } from 'react-router-dom';
import { Organization } from '../../types';

import SettingsContextSwitcher from '../settings/SettingsContextSwitcher';

const SettingsNavItem = ({ to, label, icon }: { to: string; label: string; icon: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all ${isActive
        ? 'bg-white/10 text-white'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <span className="material-symbols-outlined !text-[18px] opacity-70">{icon}</span>
    {label}
  </NavLink>
);

const OrgSettingsLayout: React.FC = () => {
  const { org } = useOutletContext<{ org: Organization }>();
  const { orgId } = useParams();
  const basePath = `/org/${orgId}/settings`;

  return (
    <div className="flex-1 flex bg-gh-bg font-display">
      <div className="max-w-[1400px] w-full mx-auto flex gap-8">
        {/* Settings Sidebar */}
        <aside className="w-[240px] shrink-0 space-y-8">
          <div className="px-1 pt-8">
            <SettingsContextSwitcher
              currentContext="organization"
              orgName={org.name}
              orgAvatar={org.avatar}
              orgId={orgId}
            />
          </div>

          <section>
            <h3 className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Settings</h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsNavItem to={`${basePath}/general`} label="General" icon="tune" />
              <SettingsNavItem to={`${basePath}/permissions`} label="Permissions" icon="lock_person" />
              <SettingsNavItem to={`${basePath}/environments`} label="Environments" icon="layers" />
              <SettingsNavItem to={`${basePath}/webhooks`} label="Webhooks" icon="webhook" />
            </nav>
          </section>

          <section>
            <h3 className="px-3 text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Security</h3>
            <nav className="flex flex-col gap-0.5">
              <SettingsNavItem to={`${basePath}/authentication`} label="Authentication" icon="shield" />
              <SettingsNavItem to={`${basePath}/ssh-keys`} label="SSH & GPG Keys" icon="key" />
            </nav>
          </section>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 min-w-0">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet context={{ org }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrgSettingsLayout;

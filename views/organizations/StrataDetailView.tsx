import React from "react";
import { useParams, NavLink, Outlet } from "react-router-dom";
import { MOCK_STRATA } from "../../constants";

// FIX: Changed component to React.FC to correctly handle the 'key' prop when used in a list.
const StrataTab: React.FC<{
  to: string;
  icon: string;
  label: string;
  badge?: number;
  end?: boolean;
}> = ({ to, icon, label, badge, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 text-[13px] font-medium border-b-2 transition-all cursor-pointer shrink-0 ${isActive
        ? "text-gh-text border-[#f78166]"
        : "text-gh-text-secondary border-transparent hover:border-gh-border-active hover:text-gh-text"
      }`
    }
  >
    <span className="material-symbols-outlined !text-[18px]">{icon}</span>
    {label}
    {badge !== undefined && (
      <span className="px-1.5 py-0.5 rounded-full bg-gh-bg-tertiary text-[10px] font-bold text-gh-text">
        {badge}
      </span>
    )}
  </NavLink>
);

const StrataDetailView = () => {
  const { orgId } = useParams();
  const strata = MOCK_STRATA.find((o) => o.id === orgId);

  if (!strata) {
    return (
      <div className="p-8 text-center text-slate-400">
        Strata not found.
      </div>
    );
  }

  const tabs = [
    {
      to: `/strata/${orgId}`,
      icon: "space_dashboard",
      label: "Overview",
      end: true,
    },
    {
      to: "repositories",
      icon: "account_tree",
      label: "Repositories",
      badge: strata.repositories.length,
    },
    { to: "people", icon: "group", label: "People", badge: strata.members.length },
    { to: "teams", icon: "groups", label: "Teams", badge: strata.teams.length },
    { to: "settings", icon: "settings", label: "Settings" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-gh-bg font-display">
      <header className="bg-gh-bg-secondary border-b border-gh-border pt-8">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center gap-6 mb-8">
            <img
              src={strata.avatar}
              alt={strata.name}
              className="size-20 rounded-lg border-2 border-gh-border p-1 object-cover"
            />
            <div>
              <h1 className="text-3xl font-black text-gh-text tracking-tight">
                {strata.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gh-text-secondary">
                {strata.location && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined !text-base">
                      location_on
                    </span>
                    {strata.location}
                  </span>
                )}
                {strata.website && (
                  <a
                    href={`https://${strata.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined !text-base">
                      link
                    </span>
                    {strata.website}
                  </a>
                )}
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <StrataTab key={tab.label} {...tab} />
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full">
        <Outlet context={{ strata }} />
      </main>
    </div>
  );
};

export default StrataDetailView;

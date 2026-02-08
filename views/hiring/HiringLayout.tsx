import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const HiringNavItem = ({
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
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
        isActive
          ? "bg-gh-bg-secondary text-gh-text"
          : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
      }`
    }
  >
    <span className="material-symbols-outlined !text-base">{icon}</span>
    {label}
  </NavLink>
);

const HiringLayout = () => {
  const basePath = "/marketplace/hiring";

  return (
    <div className="flex-1 flex bg-gh-bg font-display">
      <aside className="w-64 p-6 border-r border-gh-border flex flex-col">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gh-text">Hiring Pipeline</h2>
          <p className="text-xs text-gh-text-secondary mt-1">
            Engineering Pipeline
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          <HiringNavItem
            to={`${basePath}/discovery`}
            icon="person_search"
            label="Candidate Discovery"
          />
          <HiringNavItem
            to={`${basePath}/assessments`}
            icon="signal_cellular_alt"
            label="Assessments"
          />
          <HiringNavItem
            to={`${basePath}/jobs`}
            icon="work_outline"
            label="Jobs"
          />
          <HiringNavItem
            to={`${basePath}/analytics`}
            icon="analytics"
            label="Analytics"
          />
        </nav>
        <div className="mt-auto">
          <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm">
            New Assessment
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default HiringLayout;

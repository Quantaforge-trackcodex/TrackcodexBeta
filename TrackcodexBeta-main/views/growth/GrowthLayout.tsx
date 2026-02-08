import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const GrowthNavItem = ({
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

const GrowthLayout = () => {
  const basePath = "/marketplace/growth";

  return (
    <div className="flex-1 flex bg-gh-bg font-display">
      <aside className="w-64 p-6 border-r border-gh-border flex flex-col">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gh-text">Engineering Level</h2>
          <p className="text-xs text-gh-text-secondary mt-1">Senior SWE II</p>
        </div>
        <nav className="flex flex-col gap-1">
          <GrowthNavItem
            to={`${basePath}/dashboard`}
            icon="insights"
            label="Overview"
          />
          <GrowthNavItem
            to={`${basePath}/radar`}
            icon="radar"
            label="Skill Radar"
          />
          <GrowthNavItem
            to={`${basePath}/path`}
            icon="timeline"
            label="Growth Path"
          />
          <GrowthNavItem
            to={`${basePath}/certifications`}
            icon="military_tech"
            label="Certifications"
          />
        </nav>
        <div className="mt-auto">
          <button className="w-full py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold text-sm">
            Sync PR History
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gh-bg">
        <Outlet />
      </main>
    </div>
  );
};

export default GrowthLayout;

import React from "react";
import { NavLink, Routes, Route, Navigate, Outlet } from "react-router-dom";
import MissionsView from "./MissionsView";
import MissionDetailView from "./MissionDetailView";
import TrialRepositoriesView from "./TrialRepositoriesView";

// --- Merged Views ---
import CandidateDiscoveryView from "../hiring/CandidateDiscoveryView";
import CandidateScorecardView from "../hiring/CandidateScorecardView";
import CandidateComparisonView from "../hiring/CandidateComparisonView";
import OfferEditorView from "../hiring/OfferEditorView";
import SessionSchedulerView from "../hiring/SessionSchedulerView";
import InterviewerFeedbackView from "../hiring/InterviewerFeedbackView";
import AssessmentsView from "../hiring/AssessmentsView";
import SkillDashboardView from "../growth/SkillDashboardView";
import DeveloperProfileView from "../growth/DeveloperProfileView";

const MarketplaceTab = ({
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
    end={false} // Allow nested routes to keep the tab active
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive
        ? "bg-primary text-primary-foreground shadow-lg"
        : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
      }`
    }
  >
    <span className="material-symbols-outlined !text-base">{icon}</span>
    {label}
  </NavLink>
);

const MarketplaceLayout = () => {
  return (
    <div className="flex-1 flex flex-col bg-gh-bg font-display">
      <header className="p-8 border-b border-gh-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
                Marketplace
              </h1>
              <p className="text-sm text-gh-text-secondary max-w-2xl leading-relaxed">
                Discover high-value missions, prove your skills in real-world
                trials, and collaborate with top engineering teams.
              </p>
            </div>
          </div>
          <nav className="mt-8 flex items-center gap-2 p-2 bg-gh-bg-secondary border border-gh-border rounded-xl w-fit">
            <MarketplaceTab
              to="/marketplace/missions"
              label="Missions"
              icon="work"
            />
            <MarketplaceTab
              to="/marketplace/trials"
              label="Trial Repositories"
              icon="rule"
            />
            <MarketplaceTab
              to="/marketplace/hiring"
              label="Hiring"
              icon="person_search"
            />
            <MarketplaceTab
              to="/marketplace/growth"
              label="Growth"
              icon="trending_up"
            />
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

export default MarketplaceLayout;

import React from "react";
import { useNavigate } from "react-router-dom";
import HomeHero from "../components/home/HomeHero";
import ContinueWorkspaces from "../components/home/ContinueWorkspaces";
import NeedsAttention from "../components/home/NeedsAttention";
import JobHub from "../components/home/JobHub";
import LearnGrow from "../components/home/LearnGrow";
import { ActivityFeed } from "../components/activity/ActivityFeed";
import styles from "./Home.module.css";

const HomeView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-8 font-display">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-10 animate-fade-in">
          <div>
            <h1 className="text-3xl font-black text-gh-text tracking-tight uppercase">
              Home Command
            </h1>
            <p className="text-gh-text-secondary text-sm mt-1">
              Operational overview and quick launch controls.
            </p>
          </div>
        </div>

        {/* Hero Section with AI Widget */}
        <div className="mb-12">
          <HomeHero />
        </div>

        {/* Main Content Grid - Workspaces and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column - Workspaces */}
          <div className="lg:col-span-7 animate-slide-up">
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gh-text tracking-tight">
                  Active Sessions
                </h2>
                <button
                  onClick={() => navigate("/workspaces")}
                  className="text-primary text-sm font-bold hover:underline"
                >
                  View all workspaces
                </button>
              </div>
              <ContinueWorkspaces />
            </section>

            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-rose-500 filled">
                report
              </span>
              <h2 className="text-xl font-bold text-gh-text tracking-tight">
                Critical Insights
              </h2>
            </div>
            <NeedsAttention />
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-5 animate-slide-in-right">
            <ActivityFeed />
          </div>
        </div>

        {/* Grid for Job Hub and Learn & Grow */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 animate-slide-up ${styles.animatedSection}`}
          style={{ "--animation-delay": "0.2s" } as React.CSSProperties}
        >
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary filled">
                  work
                </span>
                <h2 className="text-xl font-bold text-gh-text tracking-tight">
                  Marketplace Activity
                </h2>
              </div>
              <button
                onClick={() => navigate("/dashboard/jobs")}
                className="text-primary text-sm font-bold hover:underline"
              >
                Browse Missions
              </button>
            </div>
            <JobHub />
          </div>

          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold text-gh-text tracking-tight mb-6">
              Ecosystem Highlights
            </h2>
            <LearnGrow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

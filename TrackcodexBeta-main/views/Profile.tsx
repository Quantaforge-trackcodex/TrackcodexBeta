import React, { useState, useEffect } from "react";
import ProfileCard from "../components/profile/ProfileCard";
import Highlights from "../components/profile/Highlights";
import CodingSnapshot from "../components/profile/CodingSnapshot";
import ForgeAIUsage from "../components/profile/ForgeAIUsage";
import SecurityImpact from "../components/profile/SecurityImpact";
import FreelanceCard from "../components/profile/FreelanceCard";
import PinnedRepos from "../components/profile/PinnedRepos";
import ContributionHeatmap from "../components/profile/ContributionHeatmap";
import ActivityFeed from "../components/profile/ActivityFeed";
import VisualPortfolio from "../components/profile/VisualPortfolio";
import { profileService, UserProfile } from "../services/profile";
import { MOCK_REPOS } from "../constants";
import { useNavigate } from "react-router-dom";

import { githubService } from "../services/github";
import { Repository } from "../types";

const ProfileRepositories = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
      const token = localStorage.getItem("trackcodex_git_token");
      if (!token) {
        setRepos(MOCK_REPOS);
        return;
      }

      setLoading(true);
      try {
        const data = await githubService.getRepos(token);

        // Transform to UI Model
        // Transform to UI Model
        const uiRepos: any[] = data.map((repo) => ({
          id: String(repo.id),
          name: repo.name,
          description: repo.description || "No description provided.",
          isPublic: !repo.private,
          visibility: repo.private ? "PRIVATE" : "PUBLIC",
          techStack: repo.language || "Plain Text",
          techColor:
            repo.language === "TypeScript"
              ? "#3178c6"
              : repo.language === "JavaScript"
                ? "#f1e05a"
                : repo.language === "Rust"
                  ? "#dea584"
                  : "#8b949e",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          aiHealth: String(repo.open_issues_count), // Using issues as data point
          aiHealthLabel: repo.license?.name || "No License",
          securityStatus: "Unknown",
          lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
          contributors: [],
          languages: [],
          refactors: [],
          releaseVersion: "v1.0.0", // stub
          readme: undefined,
          licenseName: repo.license?.name,
          openIssues: repo.open_issues_count,
        }));

        setRepos(uiRepos);
      } catch (err) {
        console.error("Failed to fetch remote repos", err);
        setError("Failed to sync remote. Using cached data.");
        setRepos(MOCK_REPOS);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="h-7 w-32 bg-gh-border/20 animate-pulse rounded-md"></div>
          <div className="h-8 w-48 bg-gh-border/20 animate-pulse rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gh-bg-secondary border border-gh-border p-5 rounded-lg h-[160px] animate-pulse relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-gh-text tracking-tight">
          Repositories
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gh-text-secondary text-sm">
              search
            </span>
            <input
              className="bg-gh-bg border border-gh-border rounded-md pl-9 pr-4 py-1.5 text-xs text-gh-text focus:ring-1 focus:ring-primary w-64 outline-none transition-all placeholder:text-gh-text-secondary"
              placeholder="Search profile repositories..."
            />
          </div>
          <button
            onClick={() => navigate("/repositories")}
            className="text-[11px] font-bold uppercase text-primary tracking-widest hover:underline flex items-center gap-1"
          >
            Global View{" "}
            <span className="material-symbols-outlined !text-[16px]">
              open_in_new
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => navigate(`/repo/${repo.id}`)}
            className="group bg-gh-bg-secondary border border-gh-border p-5 rounded-lg hover:border-gh-text-secondary transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-gh-bg border border-gh-border flex items-center justify-center text-gh-text-secondary group-hover:text-primary transition-all">
                  <span className="material-symbols-outlined">
                    account_tree
                  </span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gh-text group-hover:text-primary transition-colors">
                    {repo.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gh-text-secondary font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-gh-border">
                      {repo.visibility}
                    </span>
                    {repo.licenseName && (
                      <span className="text-[10px] text-gh-text-secondary font-medium">
                        ⚖️ {repo.licenseName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gh-text-secondary line-clamp-2 mb-4 h-[32px]">
              {repo.description}
            </p>

            <div className="flex items-center justify-between border-t border-gh-border pt-3 mt-auto">
              <div className="flex items-center gap-4 text-xs font-bold text-gh-text-secondary">
                <span className="flex items-center gap-1">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: repo.techColor }}
                  ></span>
                  {repo.techStack}
                </span>
                <span className="flex items-center gap-1 hover:text-white">
                  <span className="material-symbols-outlined !text-[14px]">
                    star
                  </span>
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1 hover:text-white pointer-events-none">
                  <span className="material-symbols-outlined !text-[14px]">
                    adjust
                  </span>
                  {(repo as any).openIssues || 0}
                </span>
              </div>
              <span className="text-[10px] text-gh-text-secondary font-medium uppercase tracking-wider">
                Updated {repo.lastUpdated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileView = () => {
  const [profile, setProfile] = useState<UserProfile>(
    profileService.getProfile(),
  );
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();

  useEffect(() => {
    // Sync with backend on mount
    // profileService.syncWithBackend(); // REMOVED: Mock mode only

    // Sync GitHub User Data
    const syncProfile = async () => {
      const token = localStorage.getItem("trackcodex_git_token");
      if (!token) {
        setIsMockMode(true);
        return;
      }

      try {
        const userData = await githubService.verifyToken(token);

        // Calculate Skill DNA
        let computedSkills: { name: string; level: number }[] = [];
        try {
          const repos = await githubService.getRepos(token);
          if (githubService.calculateSkillDNA) {
            computedSkills = githubService.calculateSkillDNA(repos);
          }
        } catch (e) {
          console.warn("Skill DNA calculation skipped", e);
        }

        setProfile((prev) => {
          const updated = {
            ...prev,
            name: userData.name || userData.login,
            username: userData.login,
            avatar: userData.avatar_url,
            bio: userData.bio || prev.bio,
            company: userData.company || prev.company,
            location: userData.location || prev.location,
            website: userData.blog || prev.website,
            followers: userData.followers,
            following: userData.following,
            skills: computedSkills.length > 0 ? computedSkills : prev.skills,
          };
          // Broadcast to global service for Sidebar
          profileService.updateProfile(updated);
          return updated;
        });
        setIsMockMode(false);
      } catch (err) {
        console.error("Profile sync failed", err);
        setIsMockMode(true);
      }
    };
    syncProfile();

    return profileService.subscribe((updated) => setProfile(updated));
  }, []);

  const tabs = [
    { label: "Overview", icon: "dashboard" },
    { label: "Code & Repos", icon: "account_tree", badge: "42" },
    { label: "Security", icon: "verified_user", badge: "Top 5%" },
    { label: "AI & ForgeAI", icon: "auto_awesome" },
    { label: "Community", icon: "hub" },
    { label: "Portfolio", icon: "grid_view" },
    { label: "Jobs", icon: "work" },
  ];

  const handleTabClick = (label: string) => {
    // Keep everything internal now, no external navigation
    setActiveTab(label);
  };

  return (
    <div className="font-display p-10">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12">
        {/* Profile Identity Sidebar */}
        <div className="w-full lg:w-[300px] shrink-0 animate-in fade-in slide-in-from-left duration-500">
          <ProfileCard profile={profile} />
        </div>

        {/* Dynamic Content Dashboard */}
        <div className="flex-1 min-w-0">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-gh-border mb-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.label)}
                className={`flex items-center gap-2 pb-4 text-[14px] font-medium transition-all relative shrink-0 ${activeTab === tab.label ? "text-gh-text" : "text-gh-text-secondary hover:text-gh-text"}`}
              >
                <span className="material-symbols-outlined !text-[20px] opacity-70">
                  {tab.icon}
                </span>
                {tab.label}
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab.label === "Security"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-gh-bg-secondary text-gh-text-secondary border border-gh-border"
                      }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.label && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === "Overview" && (
              <div className="space-y-12">
                <Highlights />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <CodingSnapshot />
                  <SecurityImpact />
                  <ForgeAIUsage />
                  <FreelanceCard />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                  <div className="xl:col-span-2 space-y-12">
                    <PinnedRepos />
                    <ContributionHeatmap />
                  </div>
                  <div className="space-y-12">
                    <ActivityFeed />
                    <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl relative overflow-hidden group">
                      <div className="flex items-center gap-2 mb-4 text-primary">
                        <span className="material-symbols-outlined filled !text-xl">
                          verified
                        </span>
                        <h3 className="text-[10px] font-black uppercase tracking-widest">
                          ForgeAI Audited
                        </h3>
                      </div>
                      <p className="text-[13px] text-gh-text-secondary leading-relaxed font-medium">
                        Professional history and community contributions are
                        verified by ForgeAI protocols to maintain network-wide
                        trust levels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Code & Repos" && <ProfileRepositories />}

            {activeTab === "Security" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gh-text">
                    Recent Security Audits
                  </h2>
                  <button
                    onClick={() => navigate("/activity")}
                    className="text-xs font-bold text-primary uppercase tracking-widest"
                  >
                    View Full Dashboard
                  </button>
                </div>
                {/* Security Summary Component */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gh-bg-secondary border border-gh-border p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <span className="material-symbols-outlined">
                          shield
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gh-text">
                          Vulnerability Scan
                        </h4>
                        <p className="text-xs text-gh-text-secondary">
                          Last run 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <div className="text-2xl font-black text-gh-text">
                          0
                        </div>
                        <div className="text-[10px] font-bold text-gh-text-secondary uppercase tracking-widest">
                          Critical
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-gh-text">
                          2
                        </div>
                        <div className="text-[10px] font-bold text-gh-text-secondary uppercase tracking-widest">
                          Warnings
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-emerald-500">
                          98%
                        </div>
                        <div className="text-[10px] font-bold text-gh-text-secondary uppercase tracking-widest">
                          Score
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gh-bg-secondary border border-gh-border p-6 rounded-xl">
                    <h4 className="text-sm font-bold text-gh-text mb-4">
                      Recent Flags Resolved
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between text-xs">
                        <span className="text-gh-text-secondary">
                          Depedency Outdated (lodash)
                        </span>
                        <span className="text-emerald-500 font-bold">
                          Fixed
                        </span>
                      </li>
                      <li className="flex items-center justify-between text-xs">
                        <span className="text-gh-text-secondary">
                          Exposed ENV var in logs
                        </span>
                        <span className="text-emerald-500 font-bold">
                          Fixed
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "AI & ForgeAI" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gh-text">
                    ForgeAI Activity
                  </h2>
                  <button
                    onClick={() => navigate("/forge-ai")}
                    className="text-xs font-bold text-primary uppercase tracking-widest"
                  >
                    Open Lab
                  </button>
                </div>
                <div className="bg-gh-bg-secondary border border-gh-border p-8 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <span className="material-symbols-outlined text-3xl">
                        auto_awesome
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gh-text">
                        Weekly Compute Usage
                      </h3>
                      <p className="text-sm text-gh-text-secondary">
                        You have used{" "}
                        <strong className="text-gh-text">14.2 hours</strong> of
                        GPU time this week.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-purple-400">
                      842
                    </div>
                    <div className="text-xs font-bold text-gh-text-secondary uppercase tracking-widest">
                      Tokens / Sec
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Community" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gh-text">
                    Community Contributions
                  </h2>
                  <button
                    onClick={() => navigate("/community")}
                    className="text-xs font-bold text-primary uppercase tracking-widest"
                  >
                    Visit Hub
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Karma",
                      value: profile.communityKarma,
                      icon: "favorite",
                      color: "text-rose-500",
                    },
                    {
                      label: "Posts",
                      value: profile.postsCount,
                      icon: "article",
                      color: "text-blue-400",
                    },
                    {
                      label: "Following",
                      value: profile.following,
                      icon: "group",
                      color: "text-amber-400",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-gh-bg-secondary border border-gh-border p-6 rounded-xl flex items-center gap-4"
                    >
                      <span
                        className={`material-symbols-outlined ${stat.color}`}
                      >
                        {stat.icon}
                      </span>
                      <div>
                        <div className="text-xl font-black text-gh-text">
                          {stat.value}
                        </div>
                        <div className="text-[10px] font-bold text-gh-text-secondary uppercase tracking-widest">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Portfolio" && <VisualPortfolio />}

            {activeTab === "Jobs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gh-text">
                    Recent Missions
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.open(`/#/resume/${profile.username || "me"}`, "_blank")}
                      className="text-xs font-bold text-gh-text hover:text-primary uppercase tracking-widest flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined !text-[16px]">description</span>
                      My Resume
                    </button>
                    <button
                      onClick={() => navigate("/dashboard/jobs")}
                      className="text-xs font-bold text-primary uppercase tracking-widest"
                    >
                      Browse All
                    </button>
                  </div>
                </div>
                <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                  {[
                    {
                      title: "Backend Refactor for Fintech App",
                      status: "In Progress",
                      pay: "$4,500",
                    },
                    {
                      title: "React Native UI Polish",
                      status: "Completed",
                      pay: "$1,200",
                    },
                  ].map((job, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-6 border-b border-gh-border last:border-0 hover:bg-gh-bg-tertiary transition-colors"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-gh-text">
                          {job.title}
                        </h4>
                        <span className="text-xs text-gh-text-secondary">
                          Contract • Remote
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${job.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}
                        >
                          {job.status}
                        </span>
                        <span className="text-sm font-bold text-gh-text">
                          {job.pay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

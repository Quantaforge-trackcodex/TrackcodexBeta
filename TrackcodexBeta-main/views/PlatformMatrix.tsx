import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import {
  MOCK_REPOS,
  MOCK_WORKSPACES,
  MOCK_JOBS,
  MOCK_SESSIONS,
} from "../constants";

const sparklineData = [
  { v: 30 },
  { v: 45 },
  { v: 35 },
  { v: 65 },
  { v: 50 },
  { v: 85 },
  { v: 70 },
];

const FeatureCard = ({ title, desc, icon, to, color, count, label }: any) => (
  <div
    onClick={() => (window.location.hash = to)}
    className="p-6 rounded-2xl bg-gh-bg-secondary border border-gh-border group hover:border-primary/50 transition-all flex flex-col h-full relative overflow-hidden cursor-pointer"
  >
    <div
      className={`absolute -right-4 -top-4 size-24 bg-${color}/5 rounded-full blur-3xl group-hover:scale-150 transition-transform`}
    ></div>

    <div className="flex items-start justify-between mb-6 relative z-10">
      <div
        className={`size-12 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} shadow-lg shadow-${color}/5 group-hover:bg-${color} group-hover:text-white transition-all`}
      >
        <span className="material-symbols-outlined !text-[28px]">{icon}</span>
      </div>
      {count !== undefined && (
        <div className="text-right">
          <p className="text-2xl font-black text-gh-text tracking-tighter leading-none">
            {count}
          </p>
          <p className="text-[8px] font-black text-gh-text-secondary uppercase tracking-widest mt-1">
            {label}
          </p>
        </div>
      )}
    </div>

    <h3 className="text-lg font-black text-gh-text mb-2 uppercase tracking-tight relative z-10">
      {title}
    </h3>
    <p className="text-[13px] text-gh-text-secondary leading-relaxed mb-8 flex-1 relative z-10">
      {desc}
    </p>

    <div className="h-[2px] w-full bg-gh-bg-tertiary rounded-full overflow-hidden mb-4">
      <div
        className={`h-full bg-${color} w-2/3 group-hover:w-full transition-all duration-700`}
      ></div>
    </div>

    <div className="flex items-center justify-between relative z-10">
      <span
        className={`text-[10px] font-black uppercase tracking-widest text-${color}`}
      >
        Live Sync Active
      </span>
      <span className="material-symbols-outlined text-gh-text-secondary group-hover:text-gh-text group-hover:translate-x-1 transition-all !text-[18px]">
        arrow_forward
      </span>
    </div>
  </div>
);

const ActivityLog = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const activities = [
    {
      id: "1",
      type: "commit",
      title: "Pushed 3 commits to main",
      description:
        "Refactor: implemented shared buffer logic for live session synchronization.",
      relativeTime: "2 hours ago",
      entityName: "trackcodex-core",
      entityId: "trackcodex-backend",
    },
    {
      id: "2",
      type: "ai",
      title: "ForgeAI Refactor Generated",
      description:
        "AI suggested a complexity reduction for the auth validation middleware.",
      relativeTime: "4 hours ago",
      entityName: "auth_module.ts",
      entityId: "trackcodex-backend",
      impact: "high",
    },
    {
      id: "3",
      type: "mission",
      title: "Mission Offer Accepted",
      description:
        'Accepted the "DeFi Protocol Security Audit" mission from @solanalend.',
      relativeTime: "6 hours ago",
      entityName: "Mission Marketplace",
      entityId: "job-1",
    },
    {
      id: "4",
      type: "security",
      title: "Vulnerability Resolved",
      description:
        "Patched a potential SQL injection vulnerability detected by DAST scanner.",
      relativeTime: "Yesterday",
      entityName: "legacy-importer",
      entityId: "legacy-importer",
      impact: "high",
    },
    {
      id: "5",
      type: "social",
      title: "Commented on Community Thread",
      description:
        "Replied to @sarah_backend regarding Postgres scaling strategies.",
      relativeTime: "Yesterday",
      entityName: "Community Feed",
      entityId: "p1",
    },
  ];

  const filtered = useMemo(
    () =>
      filter === "All"
        ? activities
        : activities.filter((a) => a.type === filter.toLowerCase()),
    [filter],
  );

  const getColor = (type: string) => {
    switch (type) {
      case "commit":
        return "text-primary";
      case "ai":
        return "text-purple-400";
      case "mission":
        return "text-amber-500";
      case "social":
        return "text-cyan-400";
      case "security":
        return "text-rose-500";
      default:
        return "text-gh-text-secondary";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "commit":
        return "account_tree";
      case "ai":
        return "auto_awesome";
      case "mission":
        return "work";
      case "social":
        return "forum";
      case "security":
        return "shield";
      default:
        return "history";
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 bg-gh-bg-secondary border border-gh-border p-1 rounded-xl">
          {["All", "Commit", "AI", "Mission", "Social"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === f
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-gh-text-secondary hover:text-gh-text"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.2em]">
          Platform History Stream
        </span>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gh-border"></div>
        <div className="space-y-10">
          {filtered.map((activity, i) => (
            <div key={activity.id} className="flex gap-6 relative group">
              <div
                className={`size-12 rounded-full bg-gh-bg-secondary border border-gh-border flex items-center justify-center shrink-0 z-10 group-hover:border-primary transition-colors shadow-xl`}
              >
                <span
                  className={`material-symbols-outlined !text-[20px] ${getColor(activity.type)}`}
                >
                  {getIcon(activity.type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black text-gh-text group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                    {activity.title}
                  </h3>
                  <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-widest">
                    {activity.relativeTime}
                  </span>
                </div>
                <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-5 shadow-sm group-hover:shadow-xl transition-all relative overflow-hidden">
                  {activity.impact === "high" && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest border-l border-b border-rose-500/20 rounded-bl-xl">
                      High Impact
                    </div>
                  )}
                  <p className="text-[13px] text-gh-text-secondary leading-relaxed font-medium italic">
                    "{activity.description}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-gh-border/50 flex items-center gap-2">
                    <span className="text-[9px] font-bold text-gh-text-secondary uppercase tracking-widest">
                      Context:
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-tight hover:underline cursor-pointer ${getColor(activity.type)}`}
                    >
                      {activity.entityName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlatformMatrix = () => {
  const [activeTab, setActiveTab] = useState<"matrix" | "metrics" | "activity">(
    "matrix",
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gh-bg p-8 font-display">
      <div className="max-w-[1400px] mx-auto">
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 border-b border-gh-border pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled">hub</span>
              </div>
              <h1 className="text-4xl font-black text-gh-text tracking-tighter uppercase">
                Platform Intelligence
              </h1>
            </div>
            <p className="text-gh-text-secondary text-sm max-w-xl">
              Unified operational control and architectural mapping of the
              TrackCodex ecosystem.
            </p>
          </div>

          <div className="flex bg-gh-bg-secondary border border-gh-border p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "matrix" ? "bg-primary text-primary-foreground shadow-lg" : "text-gh-text-secondary hover:text-gh-text"}`}
            >
              <span className="material-symbols-outlined !text-[18px]">
                view_quilt
              </span>
              Capabilities
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "metrics" ? "bg-primary text-primary-foreground shadow-lg" : "text-gh-text-secondary hover:text-gh-text"}`}
            >
              <span className="material-symbols-outlined !text-[18px]">
                monitoring
              </span>
              Live Metrics
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "activity" ? "bg-primary text-primary-foreground shadow-lg" : "text-gh-text-secondary hover:text-gh-text"}`}
            >
              <span className="material-symbols-outlined !text-[18px] filled">
                history
              </span>
              Activity
            </button>
          </div>
        </div>

        {activeTab === "matrix" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                title="Cloud Workspaces"
                desc="High-performance ephemeral development environments with 1-click provisioning."
                icon="terminal"
                to="/workspaces"
                color="primary"
                count={MOCK_WORKSPACES.length}
                label="Active Sessions"
              />
              <FeatureCard
                title="Source Control"
                desc="Enterprise Git governance integrated with automated SAST/DAST scanning protocols."
                icon="account_tree"
                to="/repositories"
                color="emerald-500"
                count={MOCK_REPOS.length}
                label="Indexed Repos"
              />
              <FeatureCard
                title="ForgeAI Engine"
                desc="Gemini-powered deep analysis of code architecture, security, and logic refactoring."
                icon="psychology"
                to="/forge-ai"
                color="indigo-500"
                count="12.4k"
                label="Tokens/Day"
              />
              <FeatureCard
                title="Mission Marketplace"
                desc="Monetize expertise through high-value missions sourced directly from active repos."
                icon="work"
                to="/dashboard/jobs"
                color="amber-500"
                count={MOCK_JOBS.filter((j) => j.status === "Open").length}
                label="Missions Open"
              />
              <FeatureCard
                title="Live Collaboration"
                desc="Real-time multi-user sessions with integrated audio and ForgeAI moderation."
                icon="sensors"
                to="/live-sessions"
                color="rose-500"
                count={MOCK_SESSIONS.length}
                label="Live Channels"
              />
              <FeatureCard
                title="Engineering Library"
                desc="Curated technical research, templates, and pre-audited security modules."
                icon="auto_stories"
                to="/dashboard/library"
                color="cyan-500"
                count="850+"
                label="Certified Assets"
              />
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "System Uptime",
                  value: "99.98%",
                  trend: "+0.02%",
                  color: "text-emerald-500",
                },
                {
                  label: "Compute Load",
                  value: "42%",
                  trend: "-5%",
                  color: "text-primary",
                },
                {
                  label: "API Latency",
                  value: "14ms",
                  trend: "-2ms",
                  color: "text-cyan-500",
                },
                {
                  label: "Global Health",
                  value: "A+",
                  trend: "Stable",
                  color: "text-emerald-400",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="p-6 bg-gh-bg-secondary border border-gh-border rounded-2xl"
                >
                  <p className="text-[10px] font-black text-gh-text-secondary uppercase tracking-widest mb-2">
                    {m.label}
                  </p>
                  <div className="flex items-end justify-between">
                    <span className={`text-3xl font-black ${m.color}`}>
                      {m.value}
                    </span>
                    <span className="text-[10px] font-bold text-gh-text-secondary">
                      {m.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-gh-bg-secondary border border-gh-border rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-gh-text uppercase tracking-widest">
                    Platform Traffic
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary"></span>
                    <span className="text-[10px] font-bold text-gh-text-secondary uppercase">
                      Requests/Sec
                    </span>
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#135bec"
                        fill="#135bec"
                        fillOpacity={0.1}
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-8 bg-gh-bg-secondary border border-gh-border rounded-3xl">
                <h3 className="text-sm font-black text-gh-text uppercase tracking-widest mb-8">
                  Service Health Matrix
                </h3>
                <div className="space-y-4">
                  {[
                    "Core Engine",
                    "ForgeAI Gateway",
                    "Git SCM Engine",
                    "Workspace VPS",
                  ].map((service) => (
                    <div
                      key={service}
                      className="flex items-center justify-between p-4 bg-gh-bg border border-gh-border rounded-xl group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gh-text-secondary">
                          {service}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        Operational
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && <ActivityLog />}
      </div>
    </div>
  );
};

export default PlatformMatrix;

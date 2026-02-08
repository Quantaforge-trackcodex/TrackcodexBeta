import React from "react";
import { UserProfile } from "../../services/profile";
import styles from "./ProofProfileModal.module.css";

interface ProofProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  profile: UserProfile;
}

const StatCard = ({
  label,
  value,
  subtext,
  icon,
  trend,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  trend: string;
}) => (
  <div className="bg-[#1e1e2e] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-50 text-white/20">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
      {label}
    </h3>
    <div className="text-4xl font-black text-white mb-2">{value}</div>
    <div
      className={`text-xs font-bold ${trend.includes("+") ? "text-emerald-400" : "text-amber-400"}`}
    >
      {trend} {subtext}
    </div>
  </div>
);

const ProofProfileModal: React.FC<ProofProfileModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  profile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#050507]/95 backdrop-blur-md animate-in fade-in duration-300 font-display">
      <div className="w-full h-full max-w-[1400px] flex overflow-hidden bg-[#0d0d12] relative border border-white/5 rounded-2xl shadow-2xl my-8 md:my-12 mx-4 md:mx-12">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar p-10">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
              <div className="size-24 rounded-2xl p-[2px] bg-gradient-to-br from-purple-500 to-cyan-500">
                <img
                  src={profile.avatar}
                  className="size-full rounded-2xl object-cover border-4 border-[#0d0d12]"
                  alt="Avatar"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="material-symbols-outlined text-emerald-400 filled !text-xl">
                    verified
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400 font-medium">
                    Senior Full-Stack Engineer
                  </span>
                  <span className="w-px h-4 bg-white/10"></span>
                  <span className="text-purple-400 font-bold flex items-center gap-1">
                    Impact Score: 985
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="material-symbols-outlined !text-sm">
                    location_on
                  </span>
                  San Francisco, CA • Open to High-Impact Roles
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const storedGhUser = localStorage.getItem(
                    "trackcodex_github_username",
                  );
                  const targetUser = storedGhUser || profile.username;
                  window.open(`https://github.com/${targetUser}`, "_blank");
                }}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-white text-xs font-bold uppercase tracking-widest transition-all"
              >
                View GitHub
              </button>
              <button
                onClick={() => {
                  window.open(`/#/resume/${profile.username || "me"}`, "_blank");
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined !text-[16px]">description</span>
                View Resume
              </button>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <StatCard
              label="Production Merges"
              value="12.4k"
              trend="↗ +12%"
              subtext="vs avg"
              icon="commit"
            />
            <StatCard
              label="Review Turnaround"
              value="4.2h"
              trend="↘ -15%"
              subtext="(faster)"
              icon="timer"
            />
            <StatCard
              label="Arch Approvals"
              value="18"
              trend="↗ +5%"
              subtext="quarterly"
              icon="architecture"
            />
          </div>

          {/* Heatmap Section */}
          <div className="bg-[#1e1e2e] border border-white/5 rounded-xl p-8 mb-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">
                3D Production Impact Heatmap
              </h3>
              <div className="flex gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-slate-700"></span> Low
                  Impact
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-purple-500"></span>{" "}
                  High Impact
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between px-4 gap-2">
              {/* Simulated Heatmap Bars */}
              {Array.from({ length: 48 }).map((_, i) => {
                // Deterministic pseudo-random for hydration stability
                const height = ((i * 1337 + 42) % 80) + 20;
                const opacity = Math.max(0.3, height / 100);
                return (
                  <div
                    key={i}
                    className={`flex-1 bg-purple-500 rounded-t-sm transition-all hover:bg-purple-400 ${styles.heatmapBar}`}
                    style={
                      {
                        "--bar-height": `${height}%`,
                        "--bar-opacity": opacity,
                      } as React.CSSProperties
                    }
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Jan 2024</span>
              <span>Feb 2024</span>
              <span>Mar 2024</span>
              <span>Apr 2024</span>
              <span>May 2024</span>
              <span>Jun 2024</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            {/* Architectural Clusters */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">
                Architectural Skill Clusters
              </h3>

              <div className="bg-[#1e1e2e] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <span className="material-symbols-outlined !text-lg">
                      layers
                    </span>
                  </div>
                  <span className="font-bold text-white">
                    Distributed Systems
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full w-[85%] bg-cyan-500 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  {["Microservices", "gRPC", "Kafka"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded uppercase tracking-wider border border-cyan-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e1e2e] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <span className="material-symbols-outlined !text-lg">
                      speed
                    </span>
                  </div>
                  <span className="font-bold text-white">
                    Frontend Performance
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div className="h-full w-[92%] bg-purple-500 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  {["Next.js Core", "WASM", "V8 Optimization"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded uppercase tracking-wider border border-purple-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Provenance & Action */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#1e1e2e] border border-white/5 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white mb-6">
                  Tech Provenance
                </h3>
                <div className="space-y-5">
                  {[
                    { name: "Go / Kubernetes", val: 42 },
                    { name: "React / TypeScript", val: 38 },
                    { name: "Rust / WASM", val: 20 },
                  ].map((tech) => (
                    <div key={tech.name}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-300 font-medium">
                          {tech.name}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {tech.val}% impact
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-indigo-500 rounded-full ${styles.techProgressBar}`}
                          style={
                            {
                              "--progress-width": `${tech.val}%`,
                            } as React.CSSProperties
                          }
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-center border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black text-white mb-2">
                    Hire {profile.name.split(" ")[0]}
                  </h2>
                  <p className="text-purple-100 text-sm mb-6 leading-relaxed max-w-[80%] mx-auto">
                    {profile.name.split(" ")[0]} is currently considering
                    high-impact roles in Distributed Systems or FinTech.
                  </p>
                  <button
                    onClick={onProceed}
                    className="w-full py-4 bg-white text-purple-900 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  >
                    Start Direct Interview
                  </button>
                  <div className="mt-4 text-[10px] font-bold text-purple-200/60 uppercase tracking-widest">
                    TrackCodeX Verified Profile
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofProfileModal;

import React from "react";

const TeamManager = () => {
  const teams = [
    {
      name: "Core Engine",
      org: "Quantaforge",
      members: 12,
      repos: 4,
      lead: "Sarah Chen",
      status: "Active",
    },
    {
      name: "Frontend UX",
      org: "Quantaforge",
      members: 8,
      repos: 2,
      lead: "Alex Rivers",
      status: "Active",
    },
    {
      name: "Security Audit",
      org: "External Partners",
      members: 4,
      repos: 1,
      lead: "Marcus Thorne",
      status: "Restricted",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
            Team Management
          </h1>
          <p className="text-gh-text-secondary">
            Manage developer clusters and organizational hierarchy.
          </p>
        </div>
        <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">group_add</span>
          Create New Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team, i) => (
          <div
            key={i}
            className="bg-gh-bg-secondary border border-gh-border p-6 rounded-2xl hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="size-12 rounded-2xl bg-gh-bg-tertiary flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">
                  groups
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${team.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}
              >
                {team.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gh-text mb-1">{team.name}</h3>
            <p className="text-[10px] text-gh-text-secondary font-black uppercase tracking-widest mb-6">
              {team.org}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] text-gh-text-secondary uppercase font-black">
                  Members
                </p>
                <p className="text-xl font-black text-gh-text">
                  {team.members}
                </p>
              </div>
              <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] text-gh-text-secondary uppercase font-black">
                  Repositories
                </p>
                <p className="text-xl font-black text-gh-text">{team.repos}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gh-border">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gh-text-secondary">
                  Lead:
                </span>
                <span className="text-[11px] font-bold text-primary">
                  @{team.lead.split(" ")[0].toLowerCase()}
                </span>
              </div>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
                Manage Access
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;

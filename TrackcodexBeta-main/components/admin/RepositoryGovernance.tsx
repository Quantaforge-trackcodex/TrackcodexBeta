import React from "react";

const RepositoryGovernance = () => {
  const repositories = [
    {
      name: "trackcodex-backend",
      visibility: "PRIVATE",
      health: "A+",
      security: "Clean",
      owner: "Quantaforge",
      modified: "2h ago",
    },
    {
      name: "dashboard-ui",
      visibility: "PUBLIC",
      health: "B",
      security: "2 Flags",
      owner: "Quantaforge",
      modified: "15m ago",
    },
    {
      name: "legacy-importer",
      visibility: "PRIVATE",
      health: "C-",
      security: "High Risk",
      owner: "Internal",
      modified: "1mo ago",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
            Repository Governance
          </h1>
          <p className="text-gh-text-secondary">
            Global oversight and enforcement of code standards and security
            compliance.
          </p>
        </div>
      </div>

      <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gh-bg text-gh-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-gh-border">
              <th className="px-6 py-4">Repository</th>
              <th className="px-6 py-4">Org/Owner</th>
              <th className="px-6 py-4">AI Health</th>
              <th className="px-6 py-4">Security</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gh-border">
            {repositories.map((repo) => (
              <tr
                key={repo.name}
                className="hover:bg-gh-bg-tertiary transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gh-text-secondary">
                      account_tree
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gh-text">
                        {repo.name}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gh-text-secondary">
                        {repo.visibility} • Last: {repo.modified}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs text-gh-text-secondary font-bold">
                  {repo.owner}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${repo.health.startsWith("A") ? "text-emerald-500" : "text-amber-500"}`}
                  >
                    {repo.health}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${repo.security === "Clean" ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {repo.security}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 rounded-lg bg-gh-bg text-gh-text-secondary text-[9px] font-black uppercase tracking-widest border border-gh-border transition-all">
                      Lock Source
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-[9px] font-black uppercase tracking-widest border border-primary/20 transition-all">
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepositoryGovernance;

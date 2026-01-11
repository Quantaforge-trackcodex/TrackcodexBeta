
import React from 'react';

const RepositoryGovernance = () => {
  const repositories = [
    { name: 'trackcodex-backend', visibility: 'PRIVATE', health: 'A+', security: 'Clean', owner: 'Quantaforge', modified: '2h ago' },
    { name: 'dashboard-ui', visibility: 'PUBLIC', health: 'B', security: '2 Flags', owner: 'Quantaforge', modified: '15m ago' },
    { name: 'legacy-importer', visibility: 'PRIVATE', health: 'C-', security: 'High Risk', owner: 'Internal', modified: '1mo ago' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Repository Governance</h1>
          <p className="text-slate-500">Global oversight and enforcement of code standards and security compliance.</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0d0d0f] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#30363d]">
              <th className="px-6 py-4">Repository</th>
              <th className="px-6 py-4">Org/Owner</th>
              <th className="px-6 py-4">AI Health</th>
              <th className="px-6 py-4">Security</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d]">
            {repositories.map(repo => (
              <tr key={repo.name} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">account_tree</span>
                      <div>
                         <p className="text-sm font-bold text-white">{repo.name}</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{repo.visibility} • Last: {repo.modified}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5 text-xs text-slate-400 font-bold">{repo.owner}</td>
                <td className="px-6 py-5">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${repo.health.startsWith('A') ? 'text-emerald-500' : 'text-amber-500'}`}>{repo.health}</span>
                </td>
                <td className="px-6 py-5">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${repo.security === 'Clean' ? 'text-emerald-500' : 'text-rose-500'}`}>{repo.security}</span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all">Lock Source</button>
                      <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-[9px] font-black uppercase tracking-widest border border-primary/20 transition-all">Archive</button>
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


import React from 'react';
import { MOCK_WORKSPACES, MOCK_AI_TASKS, MOCK_SESSIONS } from '../constants';

const StatCard = ({ title, value, change, progress }: any) => (
  <div className="p-6 rounded-xl bg-[#0d1117] border border-[#30363d] shadow-sm flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{title}</span>
      <span className={`${change.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'} text-[11px] font-black`}>
        {change}
      </span>
    </div>
    <div className="text-3xl font-black text-white mb-6 leading-none">{value}</div>
    <div className="mt-auto pt-2">
      <div className="h-[3px] w-full bg-[#1e293b] rounded-full overflow-hidden">
        <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  </div>
);

const Overview = () => {
  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-[#09090b]">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Workspaces" value="12" change="+20%" progress={40} />
          <StatCard title="Active Repos" value="45" change="+5%" progress={30} />
          <StatCard title="Live Sessions" value="3" change="-2%" progress={20} />
          <StatCard title="AI Tokens Used" value="12.4k" change="+15%" progress={75} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div className="flex flex-col gap-6 min-w-0">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-black text-white/90">Active Workspaces</h2>
              <button className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-all">
                View All <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
              </button>
            </div>
            
            <div className="rounded-2xl border border-[#30363d] overflow-hidden bg-[#0d1117] shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#161b22] text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] border-b border-[#30363d]">
                    <th className="px-6 py-4">Workspace Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Runtime</th>
                    <th className="px-6 py-4">Last Modified</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {MOCK_WORKSPACES.map(ws => (
                    <tr key={ws.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{ws.name}</span>
                          <span className="text-[11px] font-mono text-slate-500 mt-1">{ws.branch} • {ws.commit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                          <span className="text-xs font-bold text-emerald-500">{ws.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-400 font-mono">Node 20.x</td>
                      <td className="px-6 py-5 text-xs text-slate-500">{ws.lastModified}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-xs font-black uppercase tracking-widest text-[#58a6ff] hover:underline">Open IDE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <section>
              <div className="flex items-center gap-2 mb-6 px-1">
                <span className="material-symbols-outlined text-primary !text-[20px] filled">bolt</span>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">ForgeAI Activity</h3>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-5 space-y-5 shadow-sm">
                {MOCK_AI_TASKS.map((task) => (
                  <div key={task.id} className="flex gap-4 group">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined !text-[18px]">auto_fix_high</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-200 leading-snug">
                        {task.taskName} in <span className="font-mono text-[#58a6ff] bg-[#58a6ff]/10 px-1.5 py-0.5 rounded text-[11px] border border-[#58a6ff]/20">{task.fileName}</span>
                      </p>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight mt-1.5 block">{task.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-500 !text-[20px] filled">sensors</span>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Live Sessions</h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">{MOCK_SESSIONS.length} Active</span>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 shadow-sm">
                <div className="space-y-4">
                  {MOCK_SESSIONS.slice(0, 3).map(session => (
                    <div key={session.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full border-2 border-primary/20 p-0.5 relative group-hover:border-primary/50 transition-colors">
                          <img className="size-full rounded-full object-cover" src={session.hostAvatar} alt={session.host} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-none mb-1 group-hover:text-primary transition-colors">{session.host}</p>
                          <p className="text-[10px] text-slate-500 font-medium">Working on <span className="text-slate-300 font-bold">{session.project}</span></p>
                        </div>
                      </div>
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2.5 border border-[#30363d] rounded-xl text-[11px] font-black text-slate-500 hover:text-white hover:border-slate-500 transition-all uppercase tracking-widest bg-black/20">
                  View All Presence
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

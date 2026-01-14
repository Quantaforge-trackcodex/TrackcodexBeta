
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { MOCK_WORKSPACES, MOCK_AI_TASKS, MOCK_SESSIONS } from '../constants';
import { useNavigate } from 'react-router-dom';

const activityData = [
  { name: 'Mon', commits: 40, ai: 24 },
  { name: 'Tue', commits: 30, ai: 13 },
  { name: 'Wed', commits: 20, ai: 98 },
  { name: 'Thu', commits: 27, ai: 39 },
  { name: 'Fri', commits: 18, ai: 48 },
  { name: 'Sat', commits: 23, ai: 38 },
  { name: 'Sun', commits: 34, ai: 43 },
];

const StatCard = ({ title, value, change, color }: any) => (
  <div className="p-4 rounded-xl bg-gh-bg-secondary border border-gh-border flex flex-col group hover:border-gh-text-secondary transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-gh-text-secondary">{title}</span>
      <span className={`text-[10px] font-bold ${change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
        {change}
      </span>
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
  </div>
);

const Overview = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-gh-bg font-display">
      <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gh-border">
           <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">System Console</h1>
              <p className="text-gh-text-secondary text-xs mt-1">Platform telemetry and infrastructure health metrics.</p>
           </div>
           <div className="flex items-center gap-3">
              <button className="px-4 py-1.5 border border-gh-border bg-gh-bg-secondary text-gh-text hover:border-gh-text-secondary rounded-md text-xs font-bold transition-all">
                Telemetry Log
              </button>
              <button onClick={() => navigate('/workspace/new')} className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-xs font-bold transition-all shadow-sm">
                Provision Workspace
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Workspaces" value="12" change="+2" color="primary" />
          <StatCard title="Active Repositories" value="45" change="+5" color="emerald-500" />
          <StatCard title="Security Alerts" value="4" change="-8" color="rose-500" />
          <StatCard title="AI Intelligence" value="12.4k" change="+1.2k" color="amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-8">
            {/* System Performance Graph */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold uppercase text-gh-text-secondary tracking-widest">Global Activity Flux</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gh-text-secondary uppercase">
                     <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary"></span> Commits</span>
                     <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500"></span> AI Tasks</span>
                  </div>
               </div>

               <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                      <XAxis dataKey="name" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', borderRadius: '6px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="commits" stroke="#58a6ff" strokeWidth={2} fill="#58a6ff" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="ai" stroke="#3fb950" strokeWidth={2} fill="#3fb950" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </section>

            {/* Recent Workspaces Table */}
            <section>
              <h2 className="text-xs font-bold uppercase text-gh-text-secondary tracking-widest mb-4">Instance Registry</h2>
              <div className="rounded-xl border border-gh-border overflow-hidden bg-gh-bg-secondary">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/20 text-gh-text-secondary text-[10px] font-bold uppercase tracking-widest border-b border-gh-border">
                      <th className="px-6 py-4">Instance</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Context</th>
                      <th className="px-6 py-4 text-right">Administrative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gh-border">
                    {MOCK_WORKSPACES.map(ws => (
                      <tr key={ws.id} className="group hover:bg-white/5 transition-all cursor-pointer">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gh-text group-hover:text-primary">{ws.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${ws.status === 'Running' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-gh-border text-gh-text-secondary'}`}>
                            <span className={`size-1.5 rounded-full ${ws.status === 'Running' ? 'bg-emerald-500' : 'bg-gh-text-secondary'}`}></span>
                            {ws.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gh-text-secondary font-mono">{ws.branch}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[10px] font-bold text-gh-text-secondary hover:text-white uppercase">Re-Open</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
               <h3 className="text-[11px] font-bold text-gh-text-secondary uppercase tracking-widest mb-4">Security Overview</h3>
               <div className="flex flex-col items-center py-4">
                  <div className="text-4xl font-black text-emerald-500">84%</div>
                  <p className="text-[10px] text-gh-text-secondary font-bold uppercase mt-1">Platform Integrity</p>
                  <div className="w-full h-1.5 bg-gh-bg rounded-full overflow-hidden mt-6">
                     <div className="h-full bg-emerald-500 w-[84%]"></div>
                  </div>
               </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold text-gh-text-secondary uppercase tracking-widest mb-4">ForgeAI Activity</h3>
              <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4 space-y-4">
                {MOCK_AI_TASKS.map((task) => (
                  <div key={task.id} className="flex gap-3 group cursor-pointer border-b border-gh-border last:border-0 pb-4 last:pb-0">
                    <span className="material-symbols-outlined text-primary !text-[20px] mt-0.5">auto_awesome</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-gh-text leading-snug group-hover:text-primary">{task.taskName}</p>
                      <p className="text-[10px] text-gh-text-secondary mt-1 uppercase font-bold tracking-tighter">{task.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

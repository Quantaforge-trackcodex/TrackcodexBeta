import React from "react";

const WorkspaceMonitor = () => {
  const activeWorkspaces = [
    {
      id: "ws1",
      name: "phoenix-core-prod",
      owner: "sarah_backend",
      users: 3,
      uptime: "12h 45m",
      load: 45,
      status: "Active",
    },
    {
      id: "ws2",
      name: "auth-debug-session",
      owner: "alex_dev",
      users: 1,
      uptime: "45m",
      load: 12,
      status: "Idle",
    },
    {
      id: "ws3",
      name: "payment-gateway-v2",
      owner: "marcus_j",
      users: 5,
      uptime: "2d 12h",
      load: 88,
      status: "Heavy Load",
    },
  ];

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
            Workspace Monitor
          </h1>
          <p className="text-gh-text-secondary">
            Monitor and audit all active cloud development environments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              {activeWorkspaces.length} Environments Running
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Compute Usage", value: "62%", color: "text-primary" },
          {
            label: "Network Ingress",
            value: "1.2 GB/s",
            color: "text-emerald-500",
          },
          { label: "Avg Latency", value: "18ms", color: "text-amber-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gh-bg-secondary border border-gh-border p-6 rounded-2xl"
          >
            <p className="text-[10px] font-black text-gh-text-secondary uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gh-bg text-gh-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-gh-border">
              <th className="px-6 py-4">Environment</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Uptime</th>
              <th className="px-6 py-4">Load</th>
              <th className="px-6 py-4 text-right">Administrative</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gh-border">
            {activeWorkspaces.map((ws) => (
              <tr
                key={ws.id}
                className="hover:bg-gh-bg-tertiary transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gh-text">
                      {ws.name}
                    </span>
                    <span className="text-[10px] text-gh-text-secondary font-mono uppercase tracking-tighter">
                      ID: {ws.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      @{ws.owner}
                    </span>
                    <span className="text-[10px] text-slate-600 font-bold bg-gh-bg-tertiary px-1.5 py-0.5 rounded border border-white/5">
                      {ws.users} collab
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs text-slate-400">
                  {ws.uptime}
                </td>
                <td className="px-6 py-5">
                  <div className="w-24 h-1.5 bg-gh-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${ws.load > 80 ? "bg-rose-500" : "bg-primary"}`}
                      // eslint-disable-next-line
                      style={{ width: `${ws.load}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 rounded-lg bg-gh-bg-tertiary text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-widest border border-gh-border transition-all">
                      Audit Logs
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-widest border border-rose-500/20 transition-all">
                      Terminate
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

export default WorkspaceMonitor;

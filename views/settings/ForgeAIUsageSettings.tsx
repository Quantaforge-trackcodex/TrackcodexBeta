import React, { useState } from "react";
import styles from "./ForgeAIUsageSettings.module.css";

const ForgeAIUsageSettings = () => {
  const usageHistory = [
    {
      date: "Oct 24, 14:20",
      activity: "Code Review",
      icon: "code",
      tokens: 458,
      workspace: "Backend Core",
    },
    {
      date: "Oct 24, 12:45",
      activity: "Architecture Insight",
      icon: "architecture",
      tokens: 1280,
      workspace: "Frontend Web",
    },
    {
      date: "Oct 24, 09:15",
      activity: "Chat Interaction",
      icon: "chat",
      tokens: 85,
      workspace: "Mobile API",
    },
    {
      date: "Oct 23, 17:50",
      activity: "Code Review",
      icon: "code",
      tokens: 318,
      workspace: "Backend Core",
    },
  ];

  const tokensByWorkspace = [
    { name: "Backend Core", tokens: 4200, color: "#a855f7" },
    { name: "Frontend Web", tokens: 2800, color: "#3b82f6" },
    { name: "Mobile API", tokens: 800, color: "#14b8a6" },
  ];
  const totalTokens = tokensByWorkspace.reduce((acc, ws) => acc + ws.tokens, 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex items-center justify-between pb-6 border-b border-gh-border">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ForgeAI Management
          </h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Monitor and manage your workspace's AI token consumption.
          </p>
        </div>
        <button className="bg-[#a855f7] hover:brightness-110 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#a855f7]/20 active:scale-95">
          <span className="material-symbols-outlined !text-[18px]">
            add_shopping_cart
          </span>
          Buy more tokens
        </button>
      </header>

      <section className="p-8 bg-gh-bg-secondary border border-gh-border rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Current Usage
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-white tracking-tighter">
              7,800
            </span>
            <span className="text-xl font-bold text-slate-500">
              / 10,000 used
            </span>
          </div>
          <div className="w-full max-w-sm h-3 bg-gh-bg rounded-full overflow-hidden mt-6 border border-gh-border shadow-inner">
            <div
              className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 ${styles.tokenUsageBar}`}
              style={{ "--usage-width": "78%" } as React.CSSProperties}
            ></div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Projected Usage
          </p>
          <p className="text-3xl font-black text-white">~9,450 tokens</p>
          <div className="flex items-center justify-end gap-2 mt-2 text-amber-500">
            <span className="material-symbols-outlined !text-[16px]">
              trending_up
            </span>
            <span className="text-xs font-bold">
              Approaching limit by Oct 30
            </span>
          </div>
        </div>
        <div className="self-stretch w-px bg-gh-border mx-4"></div>
        <div className="w-64 space-y-4">
          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Tokens by Workspace
          </h4>
          {tokensByWorkspace.map((ws) => (
            <div key={ws.name}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-300">{ws.name}</span>
                <span className="font-mono text-slate-500">
                  {ws.tokens / 1000}k
                </span>
              </div>
              <div className="h-1.5 bg-gh-bg rounded-full">
                <div
                  className={`h-full rounded-full ${styles.workspaceBar}`}
                  style={
                    {
                      "--workspace-width": `${(ws.tokens / totalTokens) * 100}%`,
                      "--workspace-color": ws.color,
                    } as React.CSSProperties
                  }
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Usage History</h3>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 !text-[18px]">
                search
              </span>
              <input
                className="bg-gh-bg-secondary border border-gh-border rounded-lg pl-10 pr-4 py-2 text-xs w-64 outline-none"
                placeholder="Filter activity..."
              />
            </div>
            <button className="size-9 flex items-center justify-center bg-gh-bg-secondary border border-gh-border rounded-lg text-slate-400">
              <span className="material-symbols-outlined !text-[18px]">
                filter_list
              </span>
            </button>
          </div>
        </div>
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gh-bg">
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Activity</th>
                <th className="px-6 py-3">Tokens Consumed</th>
                <th className="px-6 py-3">Workspace</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gh-border">
              {usageHistory.map((item, i) => (
                <tr
                  key={i}
                  className="text-sm text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined !text-[18px] text-slate-500">
                        {item.icon}
                      </span>
                      <span className="font-bold text-white">
                        {item.activity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {item.tokens.toLocaleString()}{" "}
                    <span className="text-slate-500">tokens</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gh-bg text-slate-400 text-[10px] font-bold rounded border border-gh-border">
                      {item.workspace}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-500 hover:text-white">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-xs text-slate-500">Showing 4 of 1,240 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold bg-gh-bg-secondary border border-gh-border rounded-lg text-slate-400">
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs font-bold bg-gh-bg-secondary border border-gh-border rounded-lg text-slate-400">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgeAIUsageSettings;

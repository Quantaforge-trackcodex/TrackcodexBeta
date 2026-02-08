import React from "react";

const MetricCard = ({ label, value, trend, icon, color }: any) => (
  <div className="bg-gh-bg-secondary border border-gh-border p-6 rounded-2xl flex flex-col relative overflow-hidden group">
    <div
      className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl text-${color}`}
    >
      <span className="material-symbols-outlined !text-[80px]">{icon}</span>
    </div>
    <div className="flex items-center gap-2 mb-4">
      <span className={`material-symbols-outlined !text-[18px] text-${color}`}>
        {icon}
      </span>
      <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-widest">
        {label}
      </span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-black text-gh-text leading-none">
        {value}
      </span>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
      >
        {trend}
      </span>
    </div>
  </div>
);

const AdminOverview = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
          Platform Overview
        </h1>
        <p className="text-gh-text-secondary">
          Real-time snapshots of TrackCodex performance and usage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          label="Active Users"
          value="1,242"
          trend="+12.4%"
          icon="person"
          color="primary"
        />
        <MetricCard
          label="Live Workspaces"
          value="86"
          trend="+4.2%"
          icon="terminal"
          color="emerald-500"
        />
        <MetricCard
          label="Job Throughput"
          value="$42.5k"
          trend="+8.1%"
          icon="payments"
          color="amber-500"
        />
        <MetricCard
          label="Community Health"
          value="94.2"
          trend="+0.5%"
          icon="favorite"
          color="rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gh-text flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                monitoring
              </span>
              System Load
            </h2>
            <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-widest">
              Last 6 Hours
            </span>
          </div>
          <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-8 h-[300px] flex items-end gap-2">
            {[40, 20, 60, 45, 80, 55, 90, 75, 40, 65, 85, 30].map((h, i) => (
              <div
                key={i}
                className={`flex-1 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary/40 cursor-help h-[${h}%]`}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gh-bg-tertiary text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}% Usage
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gh-text-secondary mb-4">
              Security Critical
            </h3>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    4 Unresolved Alerts
                  </p>
                  <p className="text-[10px] text-gh-text-secondary uppercase font-black">
                    Requires Immediate Review
                  </p>
                </div>
              </div>
              <button className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all">
                Review Escalations
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gh-text-secondary mb-4">
              Live Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  user: "Sarah K.",
                  action: "created a workspace",
                  time: "2m ago",
                  color: "text-primary",
                },
                {
                  user: "Marcus T.",
                  action: "resolved a security flag",
                  time: "12m ago",
                  color: "text-emerald-500",
                },
                {
                  user: "ForgeAI",
                  action: "flagged community post",
                  time: "15m ago",
                  color: "text-rose-500",
                },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="size-2 rounded-full bg-gh-text-secondary mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-xs text-gh-text-secondary">
                      <span className="font-bold text-gh-text">{act.user}</span>{" "}
                      {act.action}
                    </p>
                    <span className="text-[9px] font-black text-gh-text-secondary uppercase tracking-widest">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

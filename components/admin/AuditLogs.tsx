import React from "react";

const AuditLogs = () => {
  const logs = [
    {
      id: "a1",
      timestamp: "2024-11-09 14:23:12",
      actor: "Alex Rivers",
      action: "ROLE_CHANGE",
      target: "Sarah Chen (Org Admin -> Super Admin)",
      severity: "Critical",
    },
    {
      id: "a2",
      timestamp: "2024-11-09 13:45:04",
      actor: "System",
      action: "VULNERABILITY_DETECTED",
      target: "trackcodex-backend",
      severity: "High",
    },
    {
      id: "a3",
      timestamp: "2024-11-09 11:20:55",
      actor: "Marcus Thorne",
      action: "CONTENT_MODERATION",
      target: "Post #9023 (Spam Filter Override)",
      severity: "Info",
    },
    {
      id: "a4",
      timestamp: "2024-11-09 10:05:32",
      actor: "Sarah Chen",
      action: "WORKSPACE_TERMINATED",
      target: "Abandoned Session #WS-04",
      severity: "Warning",
    },
  ];

  const getSeverityStyle = (s: string) => {
    switch (s) {
      case "Critical":
        return "bg-rose-500/10 text-rose-500 border-rose-500/30";
      case "High":
        return "bg-orange-500/10 text-orange-500 border-orange-500/30";
      case "Warning":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
            Audit Logs
          </h1>
          <p className="text-gh-text-secondary">
            Immutable record of all administrative and security-critical system
            actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gh-bg-secondary border border-gh-border text-gh-text-secondary hover:text-gh-text px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            Filter logs
          </button>
          <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            Verify Chain
          </button>
        </div>
      </div>

      <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gh-bg text-gh-text-secondary text-[10px] font-black uppercase tracking-[0.2em] border-b border-gh-border">
              <th className="px-6 py-4">Timestamp (UTC)</th>
              <th className="px-6 py-4">Actor</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Impact / Target</th>
              <th className="px-6 py-4 text-right">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gh-border">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gh-bg-tertiary transition-colors group"
              >
                <td className="px-6 py-5">
                  <span className="text-xs font-mono text-gh-text-secondary">
                    {log.timestamp}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-gh-text">
                    {log.actor}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded border border-primary/20">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs text-gh-text-secondary">
                    {log.target}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getSeverityStyle(log.severity)}`}
                  >
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;

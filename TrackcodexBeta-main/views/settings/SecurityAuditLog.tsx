import React, { useState, useEffect } from "react";
import { api } from "../../context/AuthContext";

interface LoginAttempt {
  id: string;
  ipAddress: string;
  userAgent: string;
  action: string;
  success: boolean;
  createdAt: string;
  details: any;
}

const SecurityAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<LoginAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/auth/audit-logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 text-gh-text-secondary">Loading security logs...</div>
    );
  }

  return (
    <div className="bg-gh-bg-secondary border border-gh-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gh-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gh-text">
          Security Activity
        </h3>
        <span className="text-xs text-gh-text-secondary">Last 30 days</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gh-text">
          <thead className="bg-gh-bg text-gh-text-secondary font-medium border-b border-gh-border">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Location / IP</th>
              <th className="px-4 py-3">Device</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gh-border">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gh-text-secondary"
                >
                  No security activity recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gh-bg/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          log.action.includes("login")
                            ? "text-blue-400"
                            : log.action.includes("oauth")
                              ? "text-purple-400"
                              : "text-gray-400"
                        }`}
                      >
                        {log.action.includes("login") ? "login" : "link"}
                      </span>
                      <span className="capitalize">
                        {log.action.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {log.ipAddress}
                  </td>
                  <td
                    className="px-4 py-3 max-w-[200px] truncate"
                    title={log.userAgent}
                  >
                    {formatUserAgent(log.userAgent)}
                  </td>
                  <td className="px-4 py-3">
                    {log.success ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/20">
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900/30 text-red-400 border border-red-500/20">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gh-text-secondary">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper to clean up detailed UA strings
function formatUserAgent(ua: string): string {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Unknown Device";
}

export default SecurityAuditLog;

import React, { useState, useEffect } from "react";
import { api } from "../../context/AuthContext";

interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastActivityAt: string;
  isCurrent?: boolean;
}

const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await api.get("/auth/sessions"); // You'll need to ensure this endpoint exists in auth routes
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("Failed to revoke session");
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm("Are you sure? You will be logged out of all other devices."))
      return;
    try {
      await api.delete("/auth/sessions");
      fetchSessions(); // Refresh to show only current
    } catch (err) {
      console.error("Failed to revoke sessions");
    }
  };

  if (isLoading)
    return (
      <div className="text-sm text-gh-text-secondary">Loading sessions...</div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gh-text">Sessions</h3>
        <button
          onClick={handleRevokeAll}
          className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline"
        >
          Revoke all others
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-5 bg-gh-bg border border-gh-border rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-slate-500 !text-3xl">
                {getDeviceIcon(session.userAgent)}
              </span>
              <div>
                <p className="text-sm font-bold text-gh-text">
                  {formatUserAgent(session.userAgent)} • {session.ipAddress}
                </p>
                <p className="text-xs text-gh-text-secondary">
                  {session.isCurrent
                    ? "Your current session"
                    : `Last active: ${new Date(session.lastActivityAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            {session.isCurrent ? (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                Active
              </span>
            ) : (
              <button
                onClick={() => handleRevoke(session.id)}
                className="text-xs font-medium text-gh-text-secondary hover:text-gh-text border border-gh-border bg-gh-bg-secondary px-3 py-1 rounded hover:bg-gh-bg-tertiary"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function getDeviceIcon(ua: string) {
  if (ua.includes("Mobile")) return "smartphone";
  return "laptop_mac";
}

function formatUserAgent(ua: string) {
  if (ua.includes("Windows")) return "Windows PC";
  if (ua.includes("Macintosh")) return "Mac OS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone")) return "iPhone";
  return "Unknown Device";
}

export default SessionManager;

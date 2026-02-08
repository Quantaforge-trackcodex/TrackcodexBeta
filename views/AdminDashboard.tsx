import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [logs, setLogs] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Org ID for Demo - in real app, select from dropdown
  const ORG_ID = "demo-org-id";

  // Fetch Data
  useEffect(() => {
    const fetchMembers = async () => {
      // Demo: get first org ID or use hardcoded if user has none
      try {
        // First get user orgs
        const orgsRes = await fetch(
          "http://localhost:4000/api/v1/organizations",
          {
            headers: { "x-user-id": "user-1" }, // Mock ID
          },
        );
        const orgs = await orgsRes.json();
        const targetOrgId = orgs[0]?.id || ORG_ID;

        if (activeTab === "audit") {
          const res = await fetch(
            `http://localhost:4000/api/v1/organizations/${targetOrgId}/logs`,
            {
              headers: { "x-user-id": "user-1" },
            },
          );
          const data = await res.json();
          setLogs(
            data.logs?.map((l: any) => ({
              id: l.id,
              action: l.action,
              user: "User", // Schema needs updating to include user name in log or join it
              timestamp: l.createdAt,
              details: JSON.stringify(l.metadata),
            })) || [],
          );
        } else {
          const res = await fetch(
            `http://localhost:4000/api/v1/organizations/${targetOrgId}/members`,
          );
          const data = await res.json();
          setMembers(data);
        }
      } catch (e) {
        console.error("Failed to fetch admin data", e);
      }
    };

    fetchMembers();
  }, [activeTab]);

  return (
    <div className="p-8 font-display text-gh-text h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gh-text tracking-tight">
              Organization Settings
            </h1>
            <p className="text-sm text-gh-text-secondary mt-1">
              Manage team access and audit security logs.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-green-900/20">
              Invite Member
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gh-border mb-6">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "members" ? "border-primary text-gh-text" : "border-transparent text-gh-text-secondary hover:text-gh-text"}`}
          >
            Team Members
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "audit" ? "border-primary text-gh-text" : "border-transparent text-gh-text-secondary hover:text-gh-text"}`}
          >
            Audit Logs 🛡️
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-3 text-sm font-bold border-b-2 border-transparent text-gh-text-secondary hover:text-gh-text`}
          >
            Billing
          </button>
        </div>

        {/* Content */}
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
          {activeTab === "members" && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gh-bg text-xs uppercase font-bold text-gh-text-secondary">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {members.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-gh-bg-tertiary transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gh-bg flex items-center justify-center text-xs font-bold text-gh-text">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gh-text">{m.name}</div>
                          <div className="text-xs text-gh-text-secondary">
                            {m.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          m.role === "OWNER"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : m.role === "ADMIN"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-gh-bg-tertiary text-gh-text-secondary border border-gh-border"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gh-text-secondary">
                      {m.joined}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gh-text-secondary hover:text-red-400 transition-colors">
                        <span className="material-symbols-outlined !text-[18px]">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "audit" && (
            <table className="w-full text-left text-sm">
              <thead className="bg-gh-bg text-xs uppercase font-bold text-gh-text-secondary">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gh-border">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gh-bg-tertiary transition-colors font-mono text-xs"
                  >
                    <td className="px-6 py-4 text-gh-text-secondary">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gh-text">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-primary">{log.user}</td>
                    <td className="px-6 py-4 text-gh-text-secondary">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { enterpriseApi, Enterprise } from "../../services/enterprise";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/layout/Sidebar";

// Simple Loading Spinner
const Loading = () => (
  <div className="p-10 text-center text-gray-400">Loading Enterprise...</div>
);

export default function EnterpriseDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!slug) return;
    loadEnterprise();
  }, [slug]);

  useEffect(() => {
    if (activeTab === "members" && slug) {
      loadMembers();
    }
  }, [activeTab, slug]);

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await enterpriseApi.getMembers(slug!);
      setMembers(res.members || []);
    } catch (e) {
      console.error("Failed to load members", e);
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadEnterprise = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.get(slug!);
      setEnterprise(data);
    } catch (e: any) {
      setError(e.message || "Failed to load enterprise");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-blue-600 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!enterprise) return null;

  return (
    <div className="flex h-screen bg-gray-950 text-white font-sans">
      {/* We reuse the global Sidebar or create a specific Enterprise Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold">
              {enterprise.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-semibold">{enterprise.name}</h1>
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                {enterprise.plan} PLAN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded transition">
              Documentation
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-700">
              {/* User Avatar Placeholder */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 mb-8">
            {["overview", "members", "settings", "policies"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-gray-400 text-sm mb-1">Total Members</h3>
                <div className="text-3xl font-bold">
                  {enterprise._count?.members ||
                    enterprise.members?.length ||
                    0}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-gray-400 text-sm mb-1">Workspaces</h3>
                <div className="text-3xl font-bold">
                  {enterprise.organizations?.length || 0}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
                <h3 className="text-gray-400 text-sm mb-1">Security Score</h3>
                <div className="text-3xl font-bold text-green-400">98%</div>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loadingMembers ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Loading members...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    members.map((m: any) => (
                      <tr
                        key={m.userId}
                        className="hover:bg-gray-800/50 transition"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                            {/* Avatar placeholder or image */}
                            {m.user?.avatar ? (
                              <img
                                src={m.user.avatar}
                                alt={`${m.user?.name || "User"} avatar`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                {m.user?.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {m.user?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {m.user?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${m.role === "OWNER" ? "bg-purple-900 text-purple-200" : "bg-gray-700 text-gray-300"}`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(m.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

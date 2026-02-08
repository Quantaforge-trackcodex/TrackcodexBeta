import React, { useEffect, useState } from "react";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import { enterpriseApi, Enterprise } from "../../services/enterprise";
import EnterpriseOnboarding from "./EnterpriseOnboarding";
import EnterpriseOverview from "./EnterpriseOverview";
import EnterpriseOrganizations from "./EnterpriseOrganizations";
import EnterprisePeople from "./EnterprisePeople";
import EnterprisePolicies from "./EnterprisePolicies";
import EnterpriseBillingDashboard from "./EnterpriseBillingDashboard";
import EnterpriseSettings from "./EnterpriseSettings";
import EnterpriseCompliance from "./EnterpriseCompliance";

// Simple Loading Spinner
const Loading = () => (
  <div className="p-10 text-center text-gh-text-secondary">Loading Enterprise...</div>
);

export default function EnterpriseDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnterprise = async () => {
      try {
        setLoading(true);
        const data = await enterpriseApi.get(slug!);
        setEnterprise(data);
      } catch (e) {
        setError((e as Error).message || "Failed to load enterprise");
      } finally {
        setLoading(false);
      }
    };

    if (!slug) return;
    loadEnterprise();
  }, [slug]);

  if (loading) return <Loading />;

  // Initial Onboarding Check - if error or specific status
  if (error) {
    return <EnterpriseOnboarding slug={slug} />;
  }

  if (!enterprise) return null;

  return (
    <div className="flex h-screen bg-gh-bg text-gh-text font-sans">
      {/* Global Sidebar is rendered by App.tsx, so we don't include it here */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar / Header */}
        <header className="h-[60px] border-b border-gh-border flex items-center justify-between px-6 bg-gh-bg-secondary shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gh-bg-tertiary border border-gh-border flex items-center justify-center font-bold text-sm text-gh-text shadow-sm">
              {enterprise.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-gh-text leading-tight hover:text-blue-400 cursor-pointer transition-colors max-w-[200px] truncate">{enterprise.name}</h1>
              <span className="text-[10px] text-gh-text-secondary">
                {enterprise.slug}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gh-bg-tertiary border border-gh-border rounded-md px-2 py-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              <span className="text-xs font-medium text-gh-text">Enterprise</span>
            </div>
            <a href="#" className="text-sm text-gh-text hover:text-blue-400 hover:underline transition-colors">Support</a>
            <div className="w-8 h-8 rounded-full bg-gh-bg-secondary border border-gh-border overflow-hidden">
              <img src="https://github.com/github.png" alt="Avatar" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-gh-bg border-b border-gh-border px-6 pt-4 shrink-0">
          <nav className="flex gap-6 -mb-px overflow-x-auto" aria-label="Tabs">
            {[
              { name: "Overview", path: "" },
              { name: "Organizations", path: "organizations" },
              { name: "People", path: "people" },
              { name: "AI Controls", path: "ai-controls" },
              { name: "Policies", path: "policies" },
              { name: "Security", path: "security" },
              { name: "Billing and licensing", path: "billing" },
              { name: "Compliance", path: "compliance" },
              { name: "Insights", path: "insights" },
              { name: "Settings", path: "settings" }
            ].map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                end={tab.path === ""}
                className={({ isActive }) => `pb-3 border-b-2 text-sm whitespace-nowrap font-medium transition-colors ${isActive
                  ? "border-[#f78166] text-gh-text"
                  : "border-transparent text-gh-text-secondary hover:text-gh-text hover:border-gh-border"
                  }`}
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gh-bg p-6 custom-scrollbar">
          <Routes>
            <Route index element={<EnterpriseOverview />} />
            <Route path="organizations" element={<EnterpriseOrganizations />} />
            <Route path="people" element={<EnterprisePeople />} />
            <Route path="policies" element={<EnterprisePolicies />} />
            <Route path="billing" element={<EnterpriseBillingDashboard />} />
            <Route path="settings" element={<EnterpriseSettings />} />
            <Route path="compliance" element={<EnterpriseCompliance />} />

            {/* Placeholders for other tabs */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-64 text-gh-text-secondary">
                <span className="material-symbols-outlined text-4xl mb-2">construction</span>
                <p>This section is under construction.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface SecurityAlert {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  resource: string;
  status: "OPEN" | "FIXED" | "DISMISSED";
  createdAt: string;
}

const RepoSecurityTab = () => {
  const { id: repoId } = useParams();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [runningDependabot, setRunningDependabot] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(
    null,
  );

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/security/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch security alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoId) fetchAlerts();
  }, [repoId]);

  const handleRunScan = async () => {
    if (scanning) return;
    setScanning(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/security/scan`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchAlerts();
        alert("Security scan completed successfully.");
      }
    } catch (err) {
      console.error(err);
      alert("Security scan failed.");
    } finally {
      setScanning(false);
    }
  };

  const handleRunDependabot = async () => {
    if (runningDependabot) return;
    setRunningDependabot(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/dependabot/run`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Dependabot update cycle started. Watch for new Pull Requests!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start Dependabot.");
    } finally {
      setRunningDependabot(false);
    }
  };

  const handleUpdateStatus = async (alertId: string, status: string) => {
    try {
      const res = await fetch(`/api/v1/security/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setAlerts(
          alerts.map((a) =>
            a.id === alertId ? ({ ...a, status } as SecurityAlert) : a,
          ),
        );
        setSelectedAlert(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === "ALL") return true;
    return a.type === activeFilter;
  });

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "HIGH":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "LOW":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SECRET":
        return "key";
      case "SCA":
        return "package";
      case "SAST":
        return "code";
      default:
        return "security";
    }
  };

  return (
    <div className="flex gap-8 p-6">
      {/* Sidebar */}
      <div className="w-64 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-gh-text-secondary uppercase tracking-wider mb-3 px-2">
            Analysis
          </h3>
          <div className="space-y-1">
            {["ALL", "SECRET", "SCA", "SAST"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between ${activeFilter === filter
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text"
                  }`}
              >
                <span>
                  {filter === "ALL"
                    ? "All Alerts"
                    : filter === "SCA"
                      ? "Dependabot"
                      : filter === "SAST"
                        ? "CodeQL"
                        : "Secret Scanning"}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === filter ? "bg-white/20" : "bg-gh-bg-tertiary"}`}
                >
                  {filter === "ALL"
                    ? alerts.length
                    : alerts.filter((a) => a.type === filter).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gh-border space-y-2">
          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="w-full py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text text-sm font-bold hover:bg-gh-border transition-all flex items-center justify-center gap-2"
          >
            <span
              className={`material-symbols-outlined !text-[18px] ${scanning ? "animate-spin" : ""}`}
            >
              {scanning ? "sync" : "security"}
            </span>
            {scanning ? "Scanning..." : "Run Security Scan"}
          </button>

          <button
            onClick={handleRunDependabot}
            disabled={runningDependabot}
            className="w-full py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400 text-sm font-bold hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span
              className={`material-symbols-outlined !text-[18px] ${runningDependabot ? "animate-spin" : ""}`}
            >
              {runningDependabot ? "sync" : "smart_toy"}
            </span>
            {runningDependabot ? "Updating..." : "Run Dependabot"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gh-text">Security Alerts</h2>
          <div className="text-sm text-gh-text-secondary">
            Showing {filteredAlerts.length} total alerts
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-16 text-center">
            <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined !text-[32px] text-green-500">
                verified_user
              </span>
            </div>
            <h3 className="text-xl font-bold text-gh-text mb-2">
              No security alerts found
            </h3>
            <p className="text-gh-text-secondary max-w-md mx-auto">
              Your repository looks healthy! No vulnerabilities, secrets, or
              code quality issues were detected.
            </p>
          </div>
        ) : (
          <div className="border border-gh-border rounded-xl overflow-hidden bg-gh-bg-secondary divide-y divide-gh-border">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className="p-4 hover:bg-gh-bg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 size-8 rounded-lg flex items-center justify-center border ${getSeverityColor(alert.severity)}`}
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {getTypeIcon(alert.type)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getSeverityColor(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gh-text-secondary">
                        {alert.type} Alert
                      </span>
                      <span className="text-xs text-gh-text-secondary">•</span>
                      <span className="text-xs text-gh-text-secondary">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-gh-text mb-1 group-hover:text-primary transition-colors">
                      {alert.description}
                    </h4>
                    <code className="text-[11px] bg-gh-bg-tertiary px-1.5 py-0.5 rounded text-gh-text-secondary">
                      {alert.resource}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 self-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${alert.status === "FIXED"
                          ? "text-green-500 bg-green-500/10"
                          : alert.status === "DISMISSED"
                            ? "text-gray-500 bg-gh-bg-tertiary"
                            : "text-orange-500 bg-orange-500/10"
                        }`}
                    >
                      {alert.status}
                    </span>
                    <span className="material-symbols-outlined text-gh-text-secondary opacity-0 group-hover:opacity-100 transition-all">
                      chevron_right
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gh-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined !text-[24px] ${getSeverityColor(selectedAlert.severity).split(" ")[0]}`}
                >
                  {getTypeIcon(selectedAlert.type)}
                </span>
                <h2 className="text-lg font-bold text-gh-text">
                  Alert Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gh-text-secondary hover:text-gh-text"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gh-bg rounded-xl border border-gh-border">
                <div
                  className={`text-center px-4 py-2 rounded-lg border flex flex-col items-center ${getSeverityColor(selectedAlert.severity)}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Severity
                  </span>
                  <span className="text-xl font-black">
                    {selectedAlert.severity}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gh-text mb-1">
                    {selectedAlert.description}
                  </h3>
                  <p className="text-sm text-gh-text-secondary italic">
                    Found in {selectedAlert.resource}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gh-text-secondary uppercase tracking-wider mb-2">
                  Remediation
                </h4>
                <div className="bg-[#0d1117] p-4 rounded-lg font-mono text-sm text-gh-text border border-gh-border">
                  {selectedAlert.type === "SECRET" ? (
                    <div className="space-y-2">
                      <p className="text-orange-400 font-bold">
                        ⚠️ Critical Action Required
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gh-text-secondary">
                        <li>Revoke the secret immediately at the provider.</li>
                        <li>Rotate and generate new credentials.</li>
                        <li>
                          Use BFG Repo-Cleaner to permanently remove from
                          history.
                        </li>
                      </ul>
                    </div>
                  ) : selectedAlert.type === "SCA" ? (
                    <div className="space-y-2">
                      <p className="text-primary font-bold">🔧 Suggested Fix</p>
                      <p className="text-gh-text-secondary">
                        Update the package in package.json to the latest secure
                        version.
                      </p>
                      <pre className="bg-gh-bg p-2 rounded text-xs mt-2">
                        npm install [package-name]@latest
                      </pre>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-yellow-400 font-bold">
                        📝 Code Review
                      </p>
                      <p className="text-gh-text-secondary">
                        Refactor the code to address the insecure pattern. See
                        OWASP guidelines for mitigation.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gh-text-secondary pt-4 border-t border-gh-border">
                <span>Alert ID: {selectedAlert.id}</span>
                <span>
                  Detected: {new Date(selectedAlert.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gh-bg border-t border-gh-border flex justify-end gap-3">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 text-gh-text-secondary hover:text-gh-text text-sm font-bold"
              >
                Close
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(selectedAlert.id, "DISMISSED")
                }
                className="px-4 py-2 bg-gh-bg border border-gh-border text-gh-text rounded-md font-bold hover:bg-gh-border text-sm"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedAlert.id, "FIXED")}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 text-sm"
              >
                Mark as Fixed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoSecurityTab;

import React, { useState } from "react";
import RepoDependencyGraph from "./RepoDependencyGraph";

interface RepoInsightsTabProps {
  repo: any;
}

const RepoInsightsTab: React.FC<RepoInsightsTabProps> = ({ repo }) => {
  const [activeSection, setActiveSection] = useState("Pulse");
  const [pulseData, setPulseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (activeSection === "Pulse") fetchPulse();
  }, [activeSection, repo.id]);

  const fetchPulse = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repo.id}/insights/pulse?period=week`,
      );
      if (res.ok) {
        const data = await res.json();
        setPulseData(data);
      }
    } catch (e) {
      console.error("Failed to fetch pulse", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 grid grid-cols-[280px_1fr] gap-8">
      {/* Sidebar */}
      <div className="flex flex-col gap-1">
        {/* ... existing sidebar logic ... */}
        <button
          onClick={() => setActiveSection("Pulse")}
          className={`px-3 py-2 text-left text-sm font-medium ${
            activeSection === "Pulse"
              ? "text-[#c9d1d9] bg-[#21262d] rounded-md border-l-2 border-[#f78166]"
              : "text-[#8b949e] hover:text-[#c9d1d9]"
          }`}
        >
          Pulse
        </button>
        {/* Other tabs ... */}
      </div>

      {/* Main Content */}
      <div>
        {activeSection === "Dependencies" && (
          <RepoDependencyGraph repoId={repo.id} />
        )}

        {activeSection === "Pulse" && (
          <>
            <h2 className="text-2xl font-bold text-[#c9d1d9] mb-6">
              Pulse (Last 7 days)
            </h2>
            {loading ? (
              <div className="text-gray-500">Loading insights...</div>
            ) : !pulseData ? (
              <div className="text-gray-500">No activity data available.</div>
            ) : (
              <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-sm text-[#8b949e]">
                    Active pull requests
                  </span>
                </div>

                <div className="h-4 bg-[#30363d] rounded-full overflow-hidden flex mb-2">
                  <div className="w-[60%] bg-[#3fb950]"></div>
                  <div className="w-[40%] bg-[#a371f7]"></div>
                </div>

                <div className="flex gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-[#3fb950] rounded-sm"></div>
                    <span className="text-[#c9d1d9]">
                      {pulseData.activePullRequests?.merged || 0} Merged
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-[#a371f7] rounded-sm"></div>
                    <span className="text-[#c9d1d9]">
                      {pulseData.activePullRequests?.open || 0} Open
                    </span>
                  </div>
                </div>

                <hr className="border-[#30363d] my-6" />

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-sm text-[#8b949e]">
                    Commit Activity
                  </span>
                </div>

                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-white mb-1">
                    {pulseData.commits?.total || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    Commits by {pulseData.commits?.authors || 0} authors
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RepoInsightsTab;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PipelineVisualizer from "../repo/PipelineVisualizer";

// Types matching API response
interface WorkflowRun {
  id: string;
  workflowName: string;
  commitSha: string;
  event: string;
  status: string;
  conclusion: string | null;
  createdAt: string;
  updatedAt: string;
  jobs: any[]; // Summary
  duration?: string; // Calculated
}

interface Workflow {
  id: string;
  name: string;
  path: string;
  state: string;
}

const RepoActionsTab = () => {
  const { id: repoId } = useParams();
  const [currentView, setCurrentView] = useState<
    "overview" | "workflows" | "detail"
  >("overview");
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);
  const [loadingRun, setLoadingRun] = useState(false);

  useEffect(() => {
    if (repoId) {
      fetchData();
    }
  }, [repoId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [runsRes, workflowsRes] = await Promise.all([
        fetch(`/api/ci/repos/${repoId}/runs`),
        fetch(`/api/ci/repos/${repoId}/workflows`),
      ]);

      if (runsRes.ok) {
        const runsData = await runsRes.json();
        setRuns(runsData);
      }
      if (workflowsRes.ok) {
        const wfsData = await workflowsRes.json();
        setWorkflows(wfsData);
      }
    } catch (error) {
      console.error("Failed to fetch CI data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = async (run: WorkflowRun) => {
    setLoadingRun(true);
    try {
      const res = await fetch(`/api/ci/runs/${run.id}`);
      if (res.ok) {
        const fullRun = await res.json();
        // Transform for visualizer if needed, or pass full object
        // Assuming Visualizer can handle the API shape or we map it here
        setSelectedRun(fullRun);
        setCurrentView("detail");
      }
    } catch (e) {
      console.error("Failed to load run details", e);
    } finally {
      setLoadingRun(false);
    }
  };

  const handleBack = () => {
    setSelectedRun(null);
    setCurrentView("overview");
    // Refresh list on back??
    fetchData();
  };

  if (currentView === "detail" && selectedRun) {
    return <PipelineVisualizer run={selectedRun} onBack={handleBack} />;
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-[#8b949e]">Loading actions...</div>
    );
  }

  return (
    <div className="flex h-full min-h-[500px]">
      {/* Sidebar Navigation for Actions */}
      <div className="w-64 pr-6 border-r border-[#30363d] hidden lg:block">
        <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest mb-4 px-2">
          Actions
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => setCurrentView("overview")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === "overview" ? "bg-[#1f6feb] text-white" : "text-[#c9d1d9] hover:bg-[#161b22]"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView("workflows")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === "workflows" ? "bg-[#1f6feb] text-white" : "text-[#c9d1d9] hover:bg-[#161b22]"}`}
          >
            Workflow runs
          </button>
        </div>

        <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest mt-8 mb-4 px-2">
          Workflows
        </h3>
        <div className="space-y-1">
          {workflows.map((w) => (
            <button
              key={w.id}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-[#c9d1d9] hover:bg-[#161b22] truncate flex items-center gap-2"
            >
              <span
                className={`size-2 rounded-full ${w.state === "ACTIVE" ? "bg-green-500" : "bg-gray-500"}`}
              ></span>
              {w.name}
            </button>
          ))}
          {workflows.length === 0 && (
            <div className="px-3 text-xs text-[#8b949e] italic">
              No workflows found
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pl-6">
        {currentView === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                All Workflow Runs
              </h2>
              <div className="flex items-center gap-2">
                {loadingRun && (
                  <span className="text-xs text-[#58a6ff] animate-pulse">
                    Loading details...
                  </span>
                )}
                <button
                  onClick={async () => {
                    setLoadingRun(true);
                    try {
                      await fetch(`/api/ci/repos/${repoId}/dispatch`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ref: "HEAD" }),
                      });
                      // Refresh runs
                      setTimeout(fetchData, 1000);
                    } catch (e) {
                      console.error("Failed to dispatch");
                    } finally {
                      setLoadingRun(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#238636] text-white text-xs font-bold rounded-md hover:bg-[#2ea043] transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined !text-[16px]">
                    play_arrow
                  </span>
                  Run workflow
                </button>
              </div>
            </div>

            {/* Stats (Mocked or calculated) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Keep stats as is or calculate from runs */}
              <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg">
                <span className="text-[#8b949e] text-xs font-bold uppercase">
                  Total Runs
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {runs.length}
                </div>
              </div>
              <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg">
                <span className="text-[#8b949e] text-xs font-bold uppercase">
                  Success Rate
                </span>
                <div className="text-3xl font-black text-[#3fb950] mt-1">
                  {runs.length > 0
                    ? Math.round(
                        (runs.filter((r) => r.conclusion === "SUCCESS").length /
                          runs.length) *
                          100,
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
              <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex justify-between items-center">
                <h3 className="font-bold text-[#c9d1d9] text-sm">Activity</h3>
              </div>
              <div className="divide-y divide-[#30363d]">
                {runs.length === 0 ? (
                  <div className="p-8 text-center text-[#8b949e]">
                    No workflow runs yet. Push code to start CI.
                  </div>
                ) : (
                  runs.map((run) => (
                    <div
                      key={run.id}
                      onClick={() => handleRunClick(run)}
                      className="p-4 hover:bg-[#161b22] transition-colors cursor-pointer group flex items-start gap-4"
                    >
                      <div
                        className={`mt-1 size-5 flex items-center justify-center rounded-full ${run.conclusion === "SUCCESS" ? "text-[#3fb950]" : run.conclusion === "FAILURE" ? "text-[#f85149]" : "text-[#d29922] animate-pulse"}`}
                      >
                        <span className="material-symbols-outlined !text-[20px]">
                          {run.conclusion === "SUCCESS"
                            ? "check_circle"
                            : run.conclusion === "FAILURE"
                              ? "cancel"
                              : run.status === "QUEUED"
                                ? "radio_button_checked"
                                : "sync"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#c9d1d9] text-sm group-hover:text-[#58a6ff] truncate">
                            {run.event} for {run.commitSha.substring(0, 7)}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#161b22] border border-[#30363d] text-[#8b949e]">
                            {run.workflowName}
                          </span>
                        </div>
                        <div className="text-xs text-[#8b949e] mt-1 flex items-center gap-2">
                          <span>{run.id}</span>
                          <span>•</span>
                          <span>
                            {new Date(run.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {/* Status Badge */}
                      <div className="text-xs font-mono self-center px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9]">
                        {run.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === "workflows" && (
          /* Keep workflow placeholder or list real workflows */
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Workflow Manager
            </h2>
            <div className="space-y-4">
              {workflows.map((w) => (
                <div
                  key={w.id}
                  className="p-4 border border-[#30363d] rounded-md bg-[#0d1117] flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-[#c9d1d9]">{w.name}</h3>
                    <p className="text-xs text-[#8b949e] font-mono">{w.path}</p>
                  </div>
                  <div className="px-2 py-1 rounded bg-[#1f6feb]/20 text-[#58a6ff] text-xs">
                    {w.state}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoActionsTab;

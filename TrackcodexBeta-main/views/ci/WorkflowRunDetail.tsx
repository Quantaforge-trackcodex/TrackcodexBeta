import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const WorkflowRunDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [pendingDeployment, setPendingDeployment] = useState<any>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRun();
    // Poll for updates every 3 seconds if run is in progress
    const interval = setInterval(() => {
      if (run?.status === "IN_PROGRESS" || run?.status === "QUEUED") {
        fetchRun();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  useEffect(() => {
    if (run?.deployments) {
      const waiting = run.deployments.find((d: any) => d.status === "WAITING");
      setPendingDeployment(waiting);
    } else {
      setPendingDeployment(null);
    }
  }, [run]);

  const fetchRun = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/runs/${id}`);
      const data = await res.json();
      setRun(data);

      // Auto-select first job if none selected
      if (!selectedJob && data.jobs && data.jobs.length > 0) {
        setSelectedJob(data.jobs[0].id);
        fetchJobLogs(data.jobs[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch run", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobLogs = async (jobId: string) => {
    try {
      const job = run?.jobs?.find((j: any) => j.id === jobId);
      if (job && job.steps) {
        const allLogs: string[] = [];
        job.steps.forEach((step: any) => {
          if (step.logs && step.logs.length > 0) {
            allLogs.push(`=== ${step.name} ===`);
            allLogs.push(...step.logs);
          }
        });
        setLogs(allLogs);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  const handleCancelRun = async () => {
    if (!confirm("Cancel this workflow run?")) return;
    try {
      await fetch(`/api/v1/runs/${id}/cancel`, { method: "POST" });
      fetchRun();
    } catch (err) {
      console.error("Failed to cancel run", err);
    }
  };

  const handleRerun = async () => {
    try {
      const res = await fetch(`/api/v1/runs/${id}/rerun`, { method: "POST" });
      const newRun = await res.json();
      navigate(`/runs/${newRun.id}`);
    } catch (err) {
      console.error("Failed to rerun", err);
    }
  };

  const handleApprove = async (status: "APPROVED" | "REJECTED") => {
    if (!pendingDeployment) return;
    try {
      await fetch(`/api/v1/deployments/${pendingDeployment.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          userId: "current-user-id", // TODO: Get actual user ID from AuthContext
        }),
      });
      fetchRun();
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const getStatusBadge = (status: string, conclusion?: string) => {
    if (status === "QUEUED") {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">
          Queued
        </span>
      );
    }
    if (status === "IN_PROGRESS") {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 flex items-center gap-1">
          <span className="size-2 bg-blue-400 rounded-full animate-pulse"></span>
          In Progress
        </span>
      );
    }
    if (conclusion === "SUCCESS") {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
          ✓ Success
        </span>
      );
    }
    if (conclusion === "FAILURE") {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500">
          ✗ Failed
        </span>
      );
    }
    if (conclusion === "CANCELLED") {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-gh-bg-tertiary text-gh-text-secondary">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!run) {
    return <div className="p-6 text-center text-gh-text">Run not found</div>;
  }

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <div className="border-b border-gh-border bg-gh-bg-secondary">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gh-text mb-2">
                {run.workflowName}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gh-text-secondary">
                {getStatusBadge(run.status, run.conclusion)}
                <span>Commit: {run.commitSha?.substring(0, 7)}</span>
                <span>Event: {run.event}</span>
                <span>{new Date(run.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {run.status === "IN_PROGRESS" && (
                <button
                  onClick={handleCancelRun}
                  className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg text-sm hover:bg-red-500/30 transition-all"
                >
                  Cancel
                </button>
              )}
              {run.status === "COMPLETED" && (
                <button
                  onClick={handleRerun}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-opacity-90 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined !text-[16px]">
                    refresh
                  </span>
                  Re-run
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Gate Banner */}
      {pendingDeployment && (
        <div className="bg-indigo-500/10 border-b border-indigo-500/20 p-4 px-6 flex items-center justify-between animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <span className="material-symbols-outlined">
                security_update_good
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Deployment to{" "}
                {pendingDeployment.environment?.name || "Environment"} pending
                approval
              </h4>
              <p className="text-xs text-[#8b949e]">
                Reviewers must approve this deployment before it can proceed.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove("REJECTED")}
              className="px-3 py-1.5 border border-[#30363d] text-[#f85149] rounded-lg text-sm hover:bg-red-500/10 transition-all font-bold"
            >
              Reject
            </button>
            <button
              onClick={() => handleApprove("APPROVED")}
              className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm transition-all font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined !text-[18px]">
                verified
              </span>
              Approve Deployment
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Jobs Sidebar */}
        <div className="w-64 border-r border-gh-border bg-gh-bg-secondary p-4 overflow-y-auto">
          <h3 className="text-sm font-bold text-gh-text mb-3">Jobs</h3>
          <div className="space-y-2">
            {run.jobs?.map((job: any) => (
              <button
                key={job.id}
                onClick={() => {
                  setSelectedJob(job.id);
                  fetchJobLogs(job.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedJob === job.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-gh-bg text-gh-text hover:bg-gh-border"
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{job.name}</span>
                  {getStatusBadge(job.status, job.conclusion)}
                </div>
                {job.steps && (
                  <div className="text-xs opacity-70">
                    {
                      job.steps.filter((s: any) => s.status === "success")
                        .length
                    }
                    /{job.steps.length} steps
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Viewer */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-gh-border bg-gh-bg-secondary px-4 py-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gh-text">Logs</h3>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-gh-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded"
                />
                Auto-scroll
              </label>
              <button
                onClick={() => {
                  const logText = logs.join("\n");
                  const blob = new Blob([logText], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `run-${id}-logs.txt`;
                  a.click();
                }}
                className="px-2 py-1 bg-gh-bg text-gh-text rounded text-xs hover:bg-gh-border transition-all"
              >
                Download
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#0d1117] p-4 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-gh-text-secondary">No logs available</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="text-gray-300 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRunDetail;

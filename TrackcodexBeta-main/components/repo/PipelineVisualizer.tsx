import React, { useState } from "react";
import { WorkflowRun } from "../../data/mockPipelines";

const PipelineVisualizer = ({
  run,
  onBack,
}: {
  run: WorkflowRun;
  onBack: () => void;
}) => {
  const [selectedJobId, setSelectedJobId] = useState(run.jobs[0].id);

  const activeJob = run.jobs.find((j) => j.id === selectedJobId) || run.jobs[0];

  return (
    <div className="flex h-[calc(100vh-200px)] bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden">
      {/* Sidebar: Jobs Graph/List */}
      <div className="w-80 border-r border-[#30363d] flex flex-col bg-[#161b22]">
        <div className="p-4 border-b border-[#30363d]">
          <button
            onClick={onBack}
            className="text-[#58a6ff] hover:underline text-xs mb-2 flex items-center gap-1"
          >
            <span className="material-symbols-outlined !text-[14px]">
              arrow_back
            </span>
            Back to Summary
          </button>
          <h3 className="font-bold text-white text-sm">{run.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${run.status === "success" ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10" : run.status === "failure" ? "border-rose-500/50 text-rose-500 bg-rose-500/10" : "border-blue-500/50 text-blue-500 bg-blue-500/10"}`}
            >
              {run.status.replace("_", " ")}
            </span>
            <span className="text-xs text-[#8b949e]">{run.duration}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Visual Graph Representation (Vertical for list) */}
          {run.jobs.map((job, i) => (
            <div key={job.id} className="relative">
              {i > 0 && (
                <div className="absolute top-[-16px] left-[19px] w-[2px] h-4 bg-[#30363d]"></div>
              )}
              <button
                onClick={() => setSelectedJobId(job.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${selectedJobId === job.id ? "bg-[#1f6feb]/10 border-[#1f6feb] shadow-[0_0_10px_rgba(31,111,235,0.2)]" : "bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]"}`}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center border-2 ${job.status === "success" ? "border-[#238636] text-[#238636] bg-[#238636]/10" : job.status === "failure" ? "border-[#f85149] text-[#f85149] bg-[#f85149]/10" : "border-[#1f6feb] text-[#1f6feb] animate-pulse"}`}
                >
                  <span className="material-symbols-outlined !text-[20px]">
                    {job.status === "success"
                      ? "check"
                      : job.status === "failure"
                        ? "close"
                        : "sync"}
                  </span>
                </div>
                <div className="text-left">
                  <div
                    className={`text-sm font-bold ${selectedJobId === job.id ? "text-white" : "text-[#c9d1d9]"}`}
                  >
                    {job.name}
                  </div>
                  <div className="text-[10px] text-[#8b949e]">Job {i + 1}</div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Terminal / Logs */}
      <div className="flex-1 bg-[#0d1117] flex flex-col font-mono text-sm">
        <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22] flex justify-between items-center">
          <span className="font-bold text-[#c9d1d9]">{activeJob.name}</span>
          <div className="flex gap-2">
            <button
              className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white"
              title="Download Logs"
            >
              <span className="material-symbols-outlined !text-[18px]">
                download
              </span>
            </button>
            <button
              className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white"
              title="Full Screen"
            >
              <span className="material-symbols-outlined !text-[18px]">
                fullscreen
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          {activeJob.steps.map((step, idx) => (
            <div key={step.id} className="group">
              <div
                className={`flex items-center gap-2 cursor-pointer py-1 ${step.status === "failure" ? "text-[#f85149]" : "text-[#c9d1d9]"}`}
                //   onClick (TODO: collapse logic)
              >
                <span className="material-symbols-outlined !text-[14px] opacity-70">
                  {step.status === "success"
                    ? "check_circle"
                    : step.status === "failure"
                      ? "cancel"
                      : "radio_button_checked"}
                </span>
                <span className="font-bold">{step.name}</span>
                <span className="ml-auto text-xs opacity-50">
                  {step.duration}
                </span>
              </div>

              {/* Logs */}
              <div className="pl-6 border-l border-[#30363d] ml-1.5 mt-1 space-y-0.5 text-xs text-[#8b949e]">
                {step.logs.map((log, li) => (
                  <div
                    key={li}
                    className="hover:bg-[#161b22] hover:text-[#c9d1d9] px-2 py-0.5 rounded-sm flex gap-4"
                  >
                    <span className="opacity-30 select-none w-6 text-right">
                      {li + 1}
                    </span>
                    <span className="font-mono">{log}</span>
                  </div>
                ))}
                {step.logs.length === 0 && step.status !== "running" && (
                  <div className="opacity-30 italic px-2">No output</div>
                )}
                {step.status === "running" && (
                  <div className="px-2 text-[#58a6ff] animate-pulse">_</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineVisualizer;

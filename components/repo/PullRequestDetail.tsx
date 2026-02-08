import React, { useState } from "react";
import { PullRequest } from "../../data/mockPullRequests";
import CollaborativeDiffViewer from "../ide/CollaborativeDiffViewer";

const PullRequestDetail = ({
  pr,
  onBack,
}: {
  pr: PullRequest;
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("conversation");

  return (
    <div className="animate-in fade-in slide-in-from-right duration-300">
      <button
        onClick={onBack}
        className="text-[#58a6ff] hover:underline text-sm mb-4 flex items-center gap-1"
      >
        <span className="material-symbols-outlined !text-[16px]">
          arrow_back
        </span>
        Back to List
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-white">
            {pr.title}{" "}
            <span className="text-[#8b949e] font-light">#{pr.number}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span
            className={`px-3 py-1 rounded-full text-white font-bold flex items-center gap-1 ${pr.status === "open" ? "bg-[#238636]" : pr.status === "merged" ? "bg-[#a371f7]" : "bg-[#f85149]"}`}
          >
            <span className="material-symbols-outlined !text-[18px]">
              {pr.status === "open"
                ? "adjust"
                : pr.status === "merged"
                  ? "merge_type"
                  : "close"}
            </span>
            {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
          </span>
          <span className="text-[#8b949e]">
            <strong className="text-white">{pr.author.name}</strong> wants to
            merge {pr.diffStats.files} commits into{" "}
            <code className="bg-[#161b22] px-1 rounded">main</code> from{" "}
            <code className="bg-[#161b22] px-1 rounded">feature/dark-mode</code>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#30363d] mb-6 flex gap-6">
        {["Conversation", "Commits", "Checks", "Files Changed"].map((tab) => {
          const id = tab.toLowerCase().replace(" ", "-");
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === id ? "border-[#f78166] text-white" : "border-transparent text-[#8b949e] hover:text-[#c9d1d9]"}`}
            >
              {tab === "Conversation" && (
                <span className="material-symbols-outlined !text-[18px]">
                  chat
                </span>
              )}
              {tab === "Commits" && (
                <span className="material-symbols-outlined !text-[18px]">
                  commit
                </span>
              )}
              {tab === "Checks" && (
                <span className="material-symbols-outlined !text-[18px]">
                  fact_check
                </span>
              )}
              {tab === "Files Changed" && (
                <>
                  <span className="material-symbols-outlined !text-[18px]">
                    code_blocks
                  </span>
                  <span className="bg-[#30363d] px-1.5 rounded-full text-[10px]">
                    {pr.diffStats.files}
                  </span>
                </>
              )}
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Content Stub */}
      <div className="min-h-[300px] text-[#8b949e]">
        {activeTab === "conversation" && (
          <>
            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex gap-4">
                  <img
                    src={pr.author.avatar}
                    alt={pr.author.name}
                    className="size-10 rounded-full border border-[#30363d]"
                  />
                  <div className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg">
                    <div className="bg-[#161b22] p-2 px-4 border-b border-[#30363d] text-sm flex justify-between rounded-t-lg">
                      <div>
                        <strong className="text-white">{pr.author.name}</strong>{" "}
                        commented {pr.createdAt}
                      </div>
                      <div className="flex gap-2">
                        <span className="material-symbols-outlined !text-[16px]">
                          sentiment_satisfied
                        </span>
                        <span className="material-symbols-outlined !text-[16px]">
                          edit
                        </span>
                      </div>
                    </div>
                    <div className="p-4 text-[#c9d1d9] text-sm">
                      <p>
                        This PR introduces the dark mode themes for the
                        dashboard components. I've tested it on Chrome and
                        Firefox.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Item (Commit) */}
                <div className="flex items-center gap-4 ml-5 relative pb-8 border-l-2 border-[#30363d] pl-8">
                  <div className="absolute left-[-5px] top-0 bg-[#30363d] rounded-full p-1 text-[#8b949e]">
                    <span className="material-symbols-outlined !text-[12px]">
                      commit
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8b949e] font-mono">
                    <span className="text-[#c9d1d9]">a1b2c3d</span> added dark
                    mode variables
                  </div>
                </div>

                {/* Merge Box */}
                <div className="border border-[#30363d] rounded-lg p-4 bg-[#161b22] mt-8">
                  <div className="flex items-center gap-4">
                    <div className="size-8 rounded-full bg-[#238636] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined !text-[20px]">
                        check
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        This branch has no conflicts with the base branch
                      </h4>
                      <p className="text-xs text-[#8b949e]">
                        Merging can be performed automatically.
                      </p>
                    </div>
                    <button className="ml-auto px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-bold rounded flex items-center gap-2">
                      Merge pull request
                      <span className="material-symbols-outlined !text-[18px]">
                        arrow_drop_down
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider">
                      Reviewers
                    </h4>
                    <span className="material-symbols-outlined !text-[16px] text-[#8b949e] cursor-pointer hover:text-white">
                      settings
                    </span>
                  </div>
                  <div className="space-y-3">
                    {pr.reviews && pr.reviews.length > 0 ? (
                      pr.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary border border-primary/30 uppercase font-black">
                              {review.reviewer.username.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-[#c9d1d9]">
                              @{review.reviewer.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {review.body?.includes("CODEOWNERS") && (
                              <span
                                className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase font-black"
                                title="Auto-assigned via CODEOWNERS governance"
                              >
                                Owner
                              </span>
                            )}
                            <span
                              className={`material-symbols-outlined !text-[16px] ${
                                review.status === "APPROVED"
                                  ? "text-[#238636]"
                                  : review.status === "CHANGES_REQUESTED"
                                    ? "text-[#f85149]"
                                    : "text-[#8b949e]"
                              }`}
                            >
                              {review.status === "APPROVED"
                                ? "check_circle"
                                : review.status === "CHANGES_REQUESTED"
                                  ? "error"
                                  : "pending"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#8b949e] italic">
                        No reviewers assigned.
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#30363d] pt-4">
                  <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-2">
                    Assignees
                  </h4>
                  <p className="text-xs text-[#8b949e] italic">
                    No one assigned.
                  </p>
                </div>

                <div className="border-t border-[#30363d] pt-4">
                  <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-2">
                    Labels
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pr.labels.map((l) => (
                      <span
                        key={l.name}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: `${l.color}20`,
                          color: l.color,
                          border: `1px solid ${l.color}40`,
                        }}
                      >
                        {l.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === "files-changed" && (
          <div className="space-y-4">
            <CollaborativeDiffViewer
              prId={pr.id}
              fileName="src/components/Dashboard.tsx"
              language="typescript"
              original={`export const Dashboard = () => {\n  return <div>Empty Dashboard</div>;\n};`}
              modified={`export const Dashboard = () => {\n  return (\n    <div className="bg-[#0a0a0f] text-white p-6">\n      <h1 className="text-2xl font-bold mb-4">Project Dashboard</h1>\n      <ActivityFeed />\n    </div>\n  );\n};`}
            />
            <CollaborativeDiffViewer
              prId={pr.id}
              fileName="src/styles/theme.css"
              language="css"
              original={`.dashboard { background: white; }`}
              modified={`.dashboard { \n  background: #0a0a0f; \n  color: #ffffff; \n  backdrop-filter: blur(10px);\n}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequestDetail;

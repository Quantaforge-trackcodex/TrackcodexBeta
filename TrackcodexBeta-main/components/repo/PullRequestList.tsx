import React, { useState } from "react";
import { MOCK_PULL_REQUESTS, PullRequest } from "../../data/mockPullRequests";

const PullRequestList = ({
  onSelectPR,
}: {
  onSelectPR: (pr: PullRequest) => void;
}) => {
  const [filter, setFilter] = useState("open");

  const filteredPRs = MOCK_PULL_REQUESTS.filter((pr) => {
    if (filter === "open") return pr.status === "open";
    return pr.status !== "open";
  });

  return (
    <div className="bg-gh-bg min-h-[400px] border border-gh-border rounded-lg overflow-hidden font-sans">
      {/* Header / Filter Bar */}
      <div className="bg-gh-bg-secondary p-4 border-b border-gh-border flex items-center justify-between">
        <div className="flex gap-4 text-sm font-bold">
          <button
            onClick={() => setFilter("open")}
            className={`flex items-center gap-2 ${filter === "open" ? "text-white" : "text-gh-text-secondary hover:text-gh-text"}`}
          >
            <span className="material-symbols-outlined !text-[18px]">
              adjust
            </span>
            {MOCK_PULL_REQUESTS.filter((p) => p.status === "open").length} Open
          </button>
          <button
            onClick={() => setFilter("closed")}
            className={`flex items-center gap-2 ${filter === "closed" ? "text-white" : "text-gh-text-secondary hover:text-gh-text"}`}
          >
            <span className="material-symbols-outlined !text-[18px]">
              check
            </span>
            {MOCK_PULL_REQUESTS.filter((p) => p.status !== "open").length}{" "}
            Closed
          </button>
        </div>
        <div className="flex gap-4 text-[13px] text-gh-text-secondary">
          <button className="hover:text-white transition-colors">
            Author <span className="text-[10px]">▼</span>
          </button>
          <button className="hover:text-white transition-colors">
            Label <span className="text-[10px]">▼</span>
          </button>
          <button className="hover:text-white transition-colors">
            Sort <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div>
        {filteredPRs.map((pr) => (
          <div
            key={pr.id}
            onClick={() => onSelectPR(pr)}
            className="flex items-start gap-3 p-3 border-b border-gh-border last:border-0 hover:bg-gh-bg-secondary transition-colors cursor-pointer group"
          >
            <div
              className={`mt-1 ${pr.status === "open" ? "text-[#3fb950]" : pr.status === "merged" ? "text-[#a371f7]" : "text-[#f85149]"}`}
            >
              <span className="material-symbols-outlined !text-[18px]">
                {pr.status === "open"
                  ? "adjust"
                  : pr.status === "merged"
                    ? "merge_type"
                    : "close"}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-[16px] font-bold text-gh-text truncate group-hover:text-primary transition-colors">
                  {pr.title}
                </h4>
                {pr.labels.map((label) => (
                  <span
                    key={label.name}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-opacity-20 border border-opacity-30"
                    style={{
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                      borderColor: label.color,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gh-text-secondary">
                <span>
                  #{pr.number} opened {pr.createdAt} by{" "}
                  <span className="text-gh-text hover:underline">
                    {pr.author.name}
                  </span>
                </span>
                <span>•</span>
                <div
                  className="flex items-center gap-1 group/status"
                  title={pr.checks.text}
                >
                  <span
                    className={`size-2 rounded-full ${pr.checks.status === "success" ? "bg-[#238636]" : pr.checks.status === "failure" ? "bg-[#f85149]" : "bg-[#d29922]"}`}
                  ></span>
                  <span className="opacity-0 group-hover/status:opacity-100 transition-opacity">
                    {pr.checks.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1 text-[12px] text-gh-text-secondary">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined !text-[14px]">
                  chat_bubble
                </span>
                {pr.commentsCount}
              </div>
              {/* Avatar stack if reviewers existed */}
            </div>
          </div>
        ))}

        {filteredPRs.length === 0 && (
          <div className="p-10 text-center text-gh-text-secondary">
            <span className="material-symbols-outlined !text-4xl mb-2 opacity-50">
              inbox
            </span>
            <p>No pull requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequestList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Repository } from "../../types";

interface RepoIssuesTabProps {
  repo: Repository;
}

const RepoIssuesTab: React.FC<RepoIssuesTabProps> = ({ repo }) => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"OPEN" | "CLOSED">("OPEN");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, [repo.id, filter]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const url = `/api/v1/repositories/${repo.id}/issues?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (issue: any) => {
    if (issue.status === "CLOSED") {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500 flex items-center gap-1">
          <span className="material-symbols-outlined !text-[14px]">
            check_circle
          </span>
          Closed
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500 flex items-center gap-1">
        <span className="material-symbols-outlined !text-[14px]">
          radio_button_unchecked
        </span>
        Open
      </span>
    );
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-gh-text-secondary">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Loading issues...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilter("OPEN")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${filter === "OPEN"
              ? "bg-primary text-primary-foreground"
              : "text-gh-text hover:bg-gh-bg-secondary border border-gh-border"
              }`}
          >
            <span className="material-symbols-outlined !text-[16px]">
              radio_button_unchecked
            </span>
            Open
          </button>
          <button
            onClick={() => setFilter("CLOSED")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${filter === "CLOSED"
              ? "bg-primary text-primary-foreground"
              : "text-gh-text hover:bg-gh-bg-secondary border border-gh-border"
              }`}
          >
            <span className="material-symbols-outlined !text-[16px]">
              check_circle
            </span>
            Closed
          </button>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined !text-[18px]">add</span>
          New Issue
        </button>
      </div>

      {/* Issue List */}
      {issues.length === 0 ? (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-16 text-center">
          <span className="material-symbols-outlined !text-[64px] text-gh-text-secondary opacity-30">
            adjust
          </span>
          <h4 className="text-lg font-bold text-gh-text mt-4">No issues</h4>
          <p className="text-sm text-gh-text-secondary mt-2">
            {filter === "OPEN"
              ? "There are no open issues"
              : "No closed issues found"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() =>
                navigate(`/repositories/${repo.id}/issues/${issue.number}`)
              }
              className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4 hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`material-symbols-outlined !text-[28px] mt-0.5 ${issue.status === "CLOSED"
                    ? "text-purple-500"
                    : "text-green-500"
                    }`}
                >
                  {issue.status === "CLOSED"
                    ? "check_circle"
                    : "radio_button_unchecked"}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-gh-text group-hover:text-primary truncate transition-colors">
                      {issue.title}
                    </h3>
                    {getStatusBadge(issue)}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gh-text-secondary flex-wrap">
                    <span className="font-mono">#{issue.number}</span>
                    <span>
                      opened by{" "}
                      <span className="font-medium text-gh-text">
                        {issue.author?.username || "unknown"}
                      </span>
                    </span>
                    <span>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>

                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex items-center gap-1">
                        {issue.labels.slice(0, 3).map((label: any) => (
                          <span
                            key={label.id}
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${label.color}20`,
                              color: label.color,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                        {issue.labels.length > 3 && (
                          <span className="text-gh-text-secondary">
                            +{issue.labels.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {issue.assignees && issue.assignees.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">
                          person
                        </span>
                        <span>{issue.assignees.length} assigned</span>
                      </div>
                    )}

                    {issue.milestone && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">
                          flag
                        </span>
                        {issue.milestone.title}
                      </span>
                    )}

                    {issue._count?.comments > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">
                          comment
                        </span>
                        {issue._count.comments}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Issue Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-gh-text mb-4">
              Create New Issue
            </h2>
            <p className="text-sm text-gh-text-secondary mb-4">
              Issue creation form coming soon...
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gh-bg-tertiary text-gh-text rounded-lg hover:bg-gh-border transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoIssuesTab;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const IssueDetail: React.FC = () => {
  const { id: repoId, number } = useParams<{ id: string; number: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [reopening, setReopening] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [repoId, number]);

  const fetchIssue = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/issues/${number}`,
      );
      const data = await res.json();
      setIssue(data);
    } catch (err) {
      console.error("Failed to fetch issue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (stateReason: "completed" | "not_planned") => {
    if (!issue || closing) return;
    setClosing(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/issues/${number}/close`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stateReason }),
        },
      );
      if (!res.ok) throw new Error("Close failed");
      await fetchIssue();
    } catch (err) {
      console.error(err);
      alert("Failed to close issue");
    } finally {
      setClosing(false);
    }
  };

  const handleReopen = async () => {
    if (!issue || reopening) return;
    setReopening(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/issues/${number}/reopen`,
        {
          method: "POST",
        },
      );
      if (!res.ok) throw new Error("Reopen failed");
      await fetchIssue();
    } catch (err) {
      console.error(err);
      alert("Failed to reopen issue");
    } finally {
      setReopening(false);
    }
  };

  const handleAddAssignee = async (userId: string) => {
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/issues/${number}/assignees`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        },
      );
      if (!res.ok) throw new Error("Failed to add assignee");
      await fetchIssue();
    } catch (err) {
      console.error(err);
      alert("Failed to add assignee");
    }
  };

  const handleRemoveAssignee = async (userId: string) => {
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/issues/${number}/assignees/${userId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Failed to remove assignee");
      await fetchIssue();
    } catch (err) {
      console.error(err);
      alert("Failed to remove assignee");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-gh-text">Issue not found</h3>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (issue.status === "CLOSED") {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-500 flex items-center gap-1">
          <span className="material-symbols-outlined !text-[16px]">
            check_circle
          </span>
          Closed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-500 flex items-center gap-1">
        <span className="material-symbols-outlined !text-[16px]">
          radio_button_unchecked
        </span>
        Open
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <div className="border-b border-gh-border bg-gh-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(`/repositories/${repoId}`)}
            className="text-sm text-gh-text-secondary hover:text-primary mb-3 flex items-center gap-1"
          >
            <span className="material-symbols-outlined !text-[16px]">
              arrow_back
            </span>
            Back to repository
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gh-text mb-2">
                {issue.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gh-text-secondary">
                {getStatusBadge()}
                <span className="font-mono">#{issue.number}</span>
                <span>
                  opened by{" "}
                  <span className="font-medium text-gh-text">
                    {issue.author.username}
                  </span>
                </span>
                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                {issue.closedAt && (
                  <span>
                    closed {new Date(issue.closedAt).toLocaleDateString()}
                    {issue.stateReason &&
                      ` as ${issue.stateReason.replace("_", " ")}`}
                  </span>
                )}
              </div>
            </div>

            {issue.status === "OPEN" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleClose("completed")}
                  disabled={closing}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <span
                    className={`material-symbols-outlined !text-[18px] ${closing ? "animate-spin" : ""}`}
                  >
                    {closing ? "sync" : "check_circle"}
                  </span>
                  {closing ? "Closing..." : "Close as completed"}
                </button>
                <button
                  onClick={() => handleClose("not_planned")}
                  disabled={closing}
                  className="px-4 py-2 bg-gh-bg-tertiary text-gh-text rounded-lg font-medium hover:bg-gh-border transition-all disabled:opacity-50"
                >
                  Close as not planned
                </button>
              </div>
            ) : (
              <button
                onClick={handleReopen}
                disabled={reopening}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span
                  className={`material-symbols-outlined !text-[18px] ${reopening ? "animate-spin" : ""}`}
                >
                  {reopening ? "sync" : "refresh"}
                </span>
                {reopening ? "Reopening..." : "Reopen Issue"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-[1fr_300px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Description */}
            {issue.body && (
              <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
                <p className="text-gh-text whitespace-pre-wrap">{issue.body}</p>
              </div>
            )}

            {/* Comments */}
            {issue.comments && issue.comments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gh-text">Comments</h3>
                {issue.comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gh-text">
                        {comment.author.username}
                      </span>
                      <span className="text-xs text-gh-text-secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gh-text">{comment.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Assignees */}
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
              <h4 className="text-sm font-bold text-gh-text mb-3">Assignees</h4>
              {issue.assignees && issue.assignees.length > 0 ? (
                <div className="space-y-2">
                  {issue.assignees.map((assignee: any) => (
                    <div
                      key={assignee.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gh-text">
                        {assignee.user.username}
                      </span>
                      <button
                        onClick={() => handleRemoveAssignee(assignee.userId)}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gh-text-secondary">
                  No one assigned
                </p>
              )}
            </div>

            {/* Labels */}
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
              <h4 className="text-sm font-bold text-gh-text mb-3">Labels</h4>
              {issue.labels && issue.labels.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {issue.labels.map((label: any) => (
                    <span
                      key={label.id}
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${label.color}20`,
                        color: label.color,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gh-text-secondary">No labels</p>
              )}
            </div>

            {/* Milestone */}
            {issue.milestone && (
              <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
                <h4 className="text-sm font-bold text-gh-text mb-3">
                  Milestone
                </h4>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined !text-[18px] text-gh-text-secondary">
                    flag
                  </span>
                  <span className="text-sm text-gh-text">
                    {issue.milestone.title}
                  </span>
                </div>
                {issue.milestone.dueDate && (
                  <p className="text-xs text-gh-text-secondary mt-2">
                    Due {new Date(issue.milestone.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;

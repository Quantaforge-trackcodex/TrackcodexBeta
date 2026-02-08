import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Repository } from "../../types";

interface RepoPullRequestsTabProps {
  repo: Repository;
}

const RepoPullRequestsTab: React.FC<RepoPullRequestsTabProps> = ({ repo }) => {
  const navigate = useNavigate();
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"OPEN" | "CLOSED" | "MERGED">("OPEN");

  useEffect(() => {
    fetchPrs();
  }, [repo.id, filter]);

  const fetchPrs = async () => {
    setLoading(true);
    try {
      const url = `/api/v1/repositories/${repo.id}/pulls?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setPrs(data);
    } catch (err) {
      console.error("Failed to fetch PRs", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (pr: any) => {
    if (pr.status === "MERGED") {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500">
          Merged
        </span>
      );
    }
    if (pr.status === "CLOSED") {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-500">
          Closed
        </span>
      );
    }
    if (pr.draft) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-500">
          Draft
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
        Open
      </span>
    );
  };

  const getReviewStatus = (pr: any) => {
    if (!pr.reviews || pr.reviews.length === 0) return null;

    const approved = pr.reviews.filter(
      (r: any) => r.status === "APPROVED",
    ).length;
    const changesRequested = pr.reviews.filter(
      (r: any) => r.status === "CHANGES_REQUESTED",
    ).length;

    if (changesRequested > 0) {
      return (
        <span className="text-red-500 text-xs flex items-center gap-1">
          <span className="material-symbols-outlined !text-[14px]">error</span>
          Changes requested
        </span>
      );
    }
    if (approved > 0) {
      return (
        <span className="text-green-500 text-xs flex items-center gap-1">
          <span className="material-symbols-outlined !text-[14px]">
            check_circle
          </span>
          {approved} approved
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-gh-text-secondary">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Fetching pull requests...</p>
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
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "OPEN"
                ? "bg-primary text-primary-foreground"
                : "text-gh-text hover:bg-gh-bg-secondary border border-gh-border"
              }`}
          >
            <span className="material-symbols-outlined !text-[16px] inline-block mr-1">
              call_split
            </span>
            Open
          </button>
          <button
            onClick={() => setFilter("CLOSED")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "CLOSED"
                ? "bg-primary text-primary-foreground"
                : "text-gh-text hover:bg-gh-bg-secondary border border-gh-border"
              }`}
          >
            <span className="material-symbols-outlined !text-[16px] inline-block mr-1">
              close
            </span>
            Closed
          </button>
          <button
            onClick={() => setFilter("MERGED")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === "MERGED"
                ? "bg-primary text-primary-foreground"
                : "text-gh-text hover:bg-gh-bg-secondary border border-gh-border"
              }`}
          >
            <span className="material-symbols-outlined !text-[16px] inline-block mr-1">
              merge
            </span>
            Merged
          </button>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined !text-[18px]">add</span>
          New Pull Request
        </button>
      </div>

      {/* PR List */}
      {prs.length === 0 ? (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-16 text-center">
          <span className="material-symbols-outlined !text-[64px] text-gh-text-secondary opacity-30">
            merge
          </span>
          <h4 className="text-lg font-bold text-gh-text mt-4">
            No pull requests
          </h4>
          <p className="text-sm text-gh-text-secondary mt-2">
            {filter === "OPEN"
              ? "There are no open pull requests"
              : `No ${filter.toLowerCase()} pull requests found`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {prs.map((pr) => (
            <div
              key={pr.id}
              onClick={() =>
                navigate(`/repositories/${repo.id}/pulls/${pr.number}`)
              }
              className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4 hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`material-symbols-outlined !text-[28px] mt-0.5 ${pr.status === "MERGED"
                      ? "text-purple-500"
                      : pr.status === "CLOSED"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                >
                  {pr.status === "MERGED"
                    ? "merge"
                    : pr.status === "CLOSED"
                      ? "close"
                      : "call_split"}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-gh-text group-hover:text-primary truncate transition-colors">
                      {pr.title}
                    </h3>
                    {getStatusBadge(pr)}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gh-text-secondary flex-wrap">
                    <span className="font-mono">#{pr.number}</span>
                    <span>
                      opened by{" "}
                      <span className="font-medium text-gh-text">
                        {pr.author?.username || "unknown"}
                      </span>
                    </span>
                    <span>{new Date(pr.createdAt).toLocaleDateString()}</span>

                    {pr.diffStats && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 font-medium">
                          +{pr.diffStats.additions}
                        </span>
                        <span className="text-red-500 font-medium">
                          -{pr.diffStats.deletions}
                        </span>
                        <span className="text-gh-text-secondary">
                          {pr.diffStats.changedFiles} files
                        </span>
                      </div>
                    )}

                    {getReviewStatus(pr)}

                    {pr._count?.comments > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">
                          comment
                        </span>
                        {pr._count.comments}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoPullRequestsTab;

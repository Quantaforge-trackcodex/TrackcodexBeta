import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PullRequestDetail: React.FC = () => {
  const { id: repoId, number } = useParams<{ id: string; number: string }>();
  const navigate = useNavigate();
  const [pr, setPr] = useState<any>(null);
  const [diff, setDiff] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "conversation" | "files" | "commits"
  >("conversation");
  const [reviewStatus, setReviewStatus] = useState<
    "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED"
  >("COMMENTED");
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    fetchPR();
  }, [repoId, number]);

  const fetchPR = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/pulls/${number}`);
      const data = await res.json();
      setPr(data);

      // Fetch diff
      const diffRes = await fetch(
        `/api/v1/repositories/${repoId}/pulls/${number}/diff`,
      );
      const diffData = await diffRes.json();
      setDiff(diffData.diff || "");
    } catch (err) {
      console.error("Failed to fetch PR", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async () => {
    if (!pr || merging) return;
    setMerging(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/pulls/${number}/merge`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "merge" }),
        },
      );
      if (!res.ok) throw new Error("Merge failed");
      await fetchPR();
      alert("Pull request merged successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to merge pull request");
    } finally {
      setMerging(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!pr || submittingReview) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/pulls/${number}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: reviewStatus, body: reviewBody }),
        },
      );
      if (!res.ok) throw new Error("Review submission failed");
      setReviewBody("");
      await fetchPR();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pr) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-gh-text">
          Pull request not found
        </h3>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (pr.status === "MERGED") {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-500">
          Merged
        </span>
      );
    }
    if (pr.status === "CLOSED") {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-500">
          Closed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-500">
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
                {pr.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gh-text-secondary">
                {getStatusBadge()}
                <span className="font-mono">#{pr.number}</span>
                <span>
                  opened by{" "}
                  <span className="font-medium text-gh-text">
                    {pr.author.username}
                  </span>
                </span>
                <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {pr.status === "OPEN" && (
              <button
                onClick={handleMerge}
                disabled={merging}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span
                  className={`material-symbols-outlined !text-[18px] ${merging ? "animate-spin" : ""}`}
                >
                  {merging ? "sync" : "merge"}
                </span>
                {merging ? "Merging..." : "Merge Pull Request"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gh-border bg-gh-bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("conversation")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "conversation"
                ? "border-primary text-primary"
                : "border-transparent text-gh-text-secondary hover:text-gh-text"
                }`}
            >
              Conversation
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "files"
                ? "border-primary text-primary"
                : "border-transparent text-gh-text-secondary hover:text-gh-text"
                }`}
            >
              Files Changed {pr.diffStats && `(${pr.diffStats.changedFiles})`}
            </button>
            <button
              onClick={() => setActiveTab("commits")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "commits"
                ? "border-primary text-primary"
                : "border-transparent text-gh-text-secondary hover:text-gh-text"
                }`}
            >
              Commits
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "conversation" && (
          <div className="space-y-6">
            {/* Description */}
            {pr.body && (
              <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
                <p className="text-gh-text whitespace-pre-wrap">{pr.body}</p>
              </div>
            )}

            {/* Reviews */}
            {pr.reviews && pr.reviews.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gh-text">Reviews</h3>
                {pr.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gh-text">
                        {review.reviewer.username}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.status === "APPROVED"
                          ? "bg-green-500/20 text-green-500"
                          : review.status === "CHANGES_REQUESTED"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-gray-500/20 text-gray-500"
                          }`}
                      >
                        {review.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-gh-text-secondary">
                        {new Date(review.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {review.body && (
                      <p className="text-sm text-gh-text-secondary">
                        {review.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Review */}
            {pr.status === "OPEN" && (
              <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-gh-text mb-4">
                  Add your review
                </h3>
                <label htmlFor="review-comment" className="sr-only">
                  Review comment
                </label>
                <textarea
                  id="review-comment"
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Leave a comment..."
                  className="w-full bg-gh-bg border border-gh-border rounded-lg p-3 text-gh-text placeholder-gh-text-secondary focus:outline-none focus:border-primary resize-none"
                  rows={4}
                  aria-label="Review comment"
                />
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <label htmlFor="review-status" className="sr-only">
                      Review status
                    </label>
                    <select
                      id="review-status"
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value as any)}
                      className="bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-gh-text focus:outline-none focus:border-primary"
                      aria-label="Select review status"
                    >
                      <option value="COMMENTED">Comment</option>
                      <option value="APPROVED">Approve</option>
                      <option value="CHANGES_REQUESTED">Request Changes</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "files" && (
          <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              {pr.diffStats && (
                <>
                  <span className="text-green-500 font-medium">
                    +{pr.diffStats.additions}
                  </span>
                  <span className="text-red-500 font-medium">
                    -{pr.diffStats.deletions}
                  </span>
                  <span className="text-gh-text-secondary">
                    {pr.diffStats.changedFiles} files changed
                  </span>
                </>
              )}
            </div>
            <pre className="bg-gh-bg p-4 rounded-lg overflow-x-auto text-xs font-mono text-gh-text whitespace-pre">
              {diff || "No changes"}
            </pre>
          </div>
        )}

        {activeTab === "commits" && (
          <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6 text-center text-gh-text-secondary">
            Commits view coming soon
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequestDetail;

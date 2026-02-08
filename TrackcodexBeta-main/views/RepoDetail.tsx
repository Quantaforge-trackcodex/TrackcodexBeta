import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MOCK_REPOS } from "../constants";
import PostJobModal from "../components/jobs/PostJobModal";
import { useRealtime } from "../contexts/RealtimeContext";

// Tabs
import RepoCodeTab from "../components/repositories/RepoCodeTab";
import RepoIssuesTab from "../components/repositories/RepoIssuesTab";
import RepoPullRequestsTab from "../components/repositories/RepoPullRequestsTab";
import RepoDiscussionsTab from "../components/repositories/RepoDiscussionsTab";
import RepoWikiTab from "../components/repositories/RepoWikiTab";
import RepoActionsTab from "../components/repositories/RepoActionsTab";
import RepoProjectsTab from "../components/repositories/RepoProjectsTab";
import RepoSecurityTab from "../components/repositories/RepoSecurityTab";
import RepoInsightsTab from "../components/repositories/RepoInsightsTab";
import RepoSettingsTab from "../components/repositories/RepoSettingsTab";
import ActivityFeed from "../components/shared/ActivityFeed";

const RepoDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, presence, send, subscribe } = useRealtime();
  const location = useLocation();
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Code");
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isForking, setIsForking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Deep linking for Code Viewer
  useEffect(() => {
    if (location.pathname.includes("/blob/")) {
      setActiveTab("Code");
    }
  }, [location.pathname]);

  const handleFork = async () => {
    if (isForking) return;
    setIsForking(true);
    try {
      const res = await fetch(`/api/v1/repositories/${id}/fork`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Fork failed");
      }
      const newRepo = await res.json();
      navigate(`/repositories/${newRepo.id}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to fork repository.");
    } finally {
      setIsForking(false);
    }
  };

  const handleUseTemplate = async () => {
    if (isGenerating) return;
    const newName = prompt("Enter a name for your new repository:");
    if (!newName) return;

    setIsGenerating(true);
    try {
      const res = await fetch(`/api/v1/repositories/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Template generation failed");
      }
      const newRepo = await res.json();
      navigate(`/repositories/${newRepo.id}`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to generate from template.");
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    const fetchRepo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/repositories/${id}`);
        const data = await response.json();
        setRepo(data);
      } catch (err) {
        console.error("Failed to fetch repo detail from internal API", err);
        const mockRepo = MOCK_REPOS.find((r) => r.id === id) || MOCK_REPOS[0];
        setRepo(mockRepo);
      } finally {
        setLoading(false);
      }
    };

    fetchRepo();
  }, [id]);

  useEffect(() => {
    if (isConnected && id) {
      send({ type: "WORKSPACE_JOIN", workspaceId: id });

      const unsubscribe = subscribe((event) => {
        if (event.type === "REPOSITORY_UPDATE" && event.repoId === id) {
          console.log(
            "🔄 Realtime: Repository updated externally, refreshing data...",
          );
          setRepo((prev: any) => ({ ...prev, settings: event.settings }));
        }
      });

      return () => {
        send({ type: "WORKSPACE_LEAVE", workspaceId: id });
        unsubscribe();
      };
    }
  }, [isConnected, id, send, subscribe]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gh-bg text-gh-text-secondary">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold animate-pulse">
            Synchronizing Repository Hardware...
          </p>
        </div>
      </div>
    );
  }

  if (!repo) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "Code":
        return <RepoCodeTab repo={repo} />;
      case "Issues":
        return <RepoIssuesTab repo={repo} />;
      case "Pull Requests":
        return <RepoPullRequestsTab repo={repo} />;
      case "Discussions":
        return <RepoDiscussionsTab repo={repo} />;
      case "Actions":
        return <RepoActionsTab />;
      case "Wiki":
        return <RepoWikiTab />;
      case "Projects":
        return <RepoProjectsTab repo={repo} />;
      case "Security":
        return <RepoSecurityTab />;
      case "Insights":
        return <RepoInsightsTab repo={repo} />;
      case "Settings":
        return <RepoSettingsTab repo={repo} />;
      case "Activity":
        return <ActivityFeed repoId={repo.id} showTitle={false} limit={50} />;
      default:
        return (
          <div className="bg-gh-bg border border-gh-border rounded-lg p-16 text-center text-gh-text-secondary">
            <span className="material-symbols-outlined !text-[48px] mb-4 opacity-50">
              construction
            </span>
            <h3 className="text-xl font-bold text-gh-text mb-2">{activeTab}</h3>
            <p className="max-w-md mx-auto">
              This section is currently under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="font-display text-gh-text h-full overflow-y-auto relative bg-gh-bg scrollbar-thin">
      {/* HEADER SECTION */}
      <div className="bg-gh-bg-secondary border-b border-gh-border pt-4 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gh-text-secondary !text-[20px]">
                book
              </span>
              <div className="flex items-center gap-2 text-xl">
                <span
                  className="text-primary cursor-pointer hover:underline"
                  onClick={() => navigate("/repositories")}
                >
                  {repo.owner || "track-codex"}
                </span>
                <span className="text-gh-text-secondary">/</span>
                <span className="font-bold text-primary cursor-pointer hover:underline">
                  {repo.name}
                </span>
                <span className="px-2 py-0.5 rounded-full border border-gh-border text-[12px] font-medium text-gh-text-secondary capitalize bg-transparent ml-2">
                  {repo.visibility?.toLowerCase() || "public"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {presence.length > 1 && (
                <div className="flex -space-x-2 mr-2">
                  {presence.map((uid) => (
                    <div
                      key={uid}
                      className="size-7 rounded-full border-2 border-gh-bg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-white uppercase"
                      title={`User ${uid} is online`}
                    >
                      {uid.substring(0, 1)}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center bg-gh-bg-secondary border border-gh-border rounded-md overflow-hidden text-sm">
                {repo.isTemplate && (
                  <button
                    onClick={handleUseTemplate}
                    disabled={isGenerating}
                    className="px-3 py-1 bg-primary text-primary-foreground font-bold border-r border-gh-border hover:bg-opacity-90 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <span
                      className={`material-symbols-outlined !text-[16px] ${isGenerating ? "animate-spin" : ""}`}
                    >
                      {isGenerating ? "sync" : "content_copy"}
                    </span>
                    {isGenerating ? "Generating..." : "Use this template"}
                  </button>
                )}
                <button className="px-3 py-1 text-gh-text font-medium border-r border-gh-border hover:bg-gh-bg-tertiary flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined !text-[16px]">
                    notifications
                  </span>
                  Notifications
                </button>
                <button
                  onClick={handleFork}
                  disabled={isForking}
                  className="px-3 py-1 text-gh-text font-medium border-r border-gh-border hover:bg-gh-bg-tertiary flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span
                    className={`material-symbols-outlined !text-[16px] ${isForking ? "animate-spin" : ""}`}
                  >
                    {isForking ? "sync" : "fork_right"}
                  </span>
                  {isForking ? "Forking..." : "Fork"}
                  <span className="bg-gh-bg-tertiary px-1.5 rounded-full text-xs">
                    {repo.forks}
                  </span>
                </button>
                <button className="px-3 py-1 text-gh-text font-medium hover:bg-gh-bg-tertiary flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined !text-[16px]">
                    star
                  </span>
                  Star{" "}
                  <span className="bg-gh-bg-tertiary px-1.5 rounded-full text-xs">
                    {repo.stars}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-1 text-sm font-medium text-gh-text overflow-x-auto">
            {[
              "Code",
              "Issues",
              "Pull Requests",
              "Activity",
              "Discussions",
              "Actions",
              "Projects",
              "Wiki",
              "Security",
              "Insights",
              "Settings",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 border-b-[3px] hover:bg-gh-bg rounded-t-md transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? "border-primary font-bold text-gh-text" : "border-transparent text-gh-text-secondary"}`}
              >
                {/* Icons for tabs */}
                <span className="material-symbols-outlined !text-[18px]">
                  {tab === "Code"
                    ? "code"
                    : tab === "Issues"
                      ? "adjust"
                      : tab === "Pull Requests"
                        ? "schema"
                        : tab === "Activity"
                          ? "history"
                          : tab === "Discussions"
                            ? "chat_bubble"
                            : tab === "Actions"
                              ? "play_circle"
                              : tab === "Projects"
                                ? "table_chart"
                                : tab === "Wiki"
                                  ? "menu_book"
                                  : tab === "Security"
                                    ? "security"
                                    : tab === "Settings"
                                      ? "settings"
                                      : "insights"}
                </span>
                {tab}
                {tab === "Issues" && (
                  <span className="px-1.5 py-0.5 bg-gh-bg-secondary rounded-full text-xs ml-1">
                    {repo.open_issues || 0}
                  </span>
                )}
                {tab === "Pull Requests" && (
                  <span className="px-1.5 py-0.5 bg-gh-bg-secondary rounded-full text-xs ml-1">
                    0
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-6">
        {renderTabContent()}
      </div>

      <PostJobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={() => { }}
        initialData={{
          repoId: repo.id,
          description: `Hiring an expert for ${repo.name} repository tasks.`,
        }}
      />
    </div>
  );
};

export default RepoDetailView;

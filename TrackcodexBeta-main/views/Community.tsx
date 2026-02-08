import React, { useState, useEffect } from "react";
import { socialService, Post, Community } from "../services/socialService";
import { CommunityBrowser } from "../components/community/CommunityBrowser";
import { CreatePostModal } from "../components/community/CreatePostModal";

const CommunityView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );
  const [sidebarView, setSidebarView] = useState<"channels" | "communities">(
    "channels",
  );

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const data = await socialService.getFeed();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderPostContent = (post: Post) => {
    switch (post.type) {
      case "repo_update":
        return (
          <div className="mt-3 bg-gh-bg-secondary border border-gh-border rounded-lg p-4 flex gap-4 hover:border-primary transition-colors cursor-pointer group">
            <div className="size-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">terminal</span>
            </div>
            <div>
              <h4 className="font-bold text-gh-text text-sm group-hover:text-primary">
                {post.repoLink?.name}
              </h4>
              <p className="text-xs text-gh-text-secondary mt-1 line-clamp-2">
                {post.repoLink?.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-gh-text-secondary">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[#f78166]"></span>{" "}
                  {post.repoLink?.language}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined !text-[12px]">
                    star
                  </span>{" "}
                  {post.repoLink?.stars}
                </span>
              </div>
            </div>
          </div>
        );
      case "job_alert":
        return (
          <div className="mt-3 bg-gh-bg-secondary border border-gh-border rounded-lg p-0 overflow-hidden group hover:border-emerald-600 transition-colors cursor-pointer">
            <div className="p-4 flex items-center justify-between border-b border-gh-border">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded bg-gh-bg flex items-center justify-center text-gh-text font-black text-xs border border-gh-border">
                  IMG
                  <span className="sr-only">Company Logo</span>
                </div>
                <div>
                  <h4 className="font-bold text-gh-text text-sm">
                    {post.jobDetails?.role}
                  </h4>
                  <div className="text-xs text-gh-text-secondary">
                    {post.jobDetails?.company} • {post.jobDetails?.location}
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-colors">
                Apply
              </button>
            </div>
            <div className="px-4 py-2 bg-gh-bg border-t border-gh-border text-xs text-gh-text-secondary font-mono">
              {post.jobDetails?.salary}
            </div>
          </div>
        );
      case "question":
        return (
          <div className="mt-3">
            {post.title && (
              <h3 className="text-lg font-bold text-gh-text mb-2">
                {post.title}
              </h3>
            )}
            <p className="text-sm text-gh-text-secondary leading-relaxed mb-3">
              {post.content}
            </p>
            {post.codeSnippet && (
              <div className="bg-gh-bg border border-gh-border rounded-lg p-3 text-xs font-mono text-gh-text-secondary overflow-x-auto">
                <div className="flex justify-between items-center mb-2 border-b border-gh-border pb-2">
                  <span className="text-gh-text-secondary">
                    {post.codeSnippet.language}
                  </span>
                  <button className="text-primary hover:underline">Copy</button>
                </div>
                <pre>{post.codeSnippet.code}</pre>
              </div>
            )}
          </div>
        );
      case "showcase":
        return (
          <div className="mt-3">
            <p className="text-sm text-gh-text-secondary mb-3">
              {post.content}
            </p>
            {post.mediaUrl && (
              <div className="rounded-lg overflow-hidden border border-gh-border">
                <img
                  src={post.mediaUrl}
                  alt="Showcase"
                  className="w-full object-cover max-h-[400px]"
                />
              </div>
            )}
          </div>
        );
      default:
        return <p className="text-sm text-[#c9d1d9] mt-2">{post.content}</p>;
    }
  };

  return (
    <div className="h-full overflow-hidden flex bg-gh-bg">
      {/* Left Sidebar: Navigation & Communities */}
      <div className="w-64 border-r border-gh-border p-4 hidden lg:block overflow-y-auto">
        <div className="space-y-1 mb-8">
          <button className="w-full text-left px-3 py-2 rounded-md bg-gh-bg-secondary text-gh-text text-sm font-bold border-l-2 border-primary">
            Home
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gh-bg-secondary text-gh-text-secondary text-sm font-medium transition-colors">
            Popular
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gh-bg-secondary text-gh-text-secondary text-sm font-medium transition-colors">
            Global News
          </button>
        </div>

        <h3 className="px-3 text-xs font-bold text-gh-text-secondary uppercase tracking-wider mb-2">
          My Communities
        </h3>
        <div className="space-y-1">
          {["r/rust", "r/reactjs", "quanta/engineering", "design-systems"].map(
            (c) => (
              <button
                key={c}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg-secondary text-gh-text text-sm transition-colors group"
              >
                <span className="text-gh-text-secondary group-hover:text-gh-text">
                  #
                </span>{" "}
                {c}
              </button>
            ),
          )}
        </div>

        {/* Sidebar View Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSidebarView("channels")}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-colors ${sidebarView === "channels"
              ? "bg-primary text-primary-foreground"
              : "bg-gh-bg-secondary text-gh-text-secondary hover:text-gh-text"
              }`}
          >
            Channels
          </button>
          <button
            onClick={() => setSidebarView("communities")}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-colors ${sidebarView === "communities"
              ? "bg-primary text-primary-foreground"
              : "bg-gh-bg-secondary text-gh-text-secondary hover:text-gh-text"
              }`}
          >
            Communities
          </button>
        </div>

        {/* Conditional Sidebar Content */}
        {sidebarView === "channels" ? (
          <div>
            <h3 className="text-xs font-bold text-gh-text-secondary uppercase mb-2">
              Channels
            </h3>
            <div className="space-y-1">
              {[
                "general",
                "announcements",
                "show-and-tell",
                "help",
                "random",
              ].map((c) => (
                <button
                  key={c}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg-secondary text-gh-text text-sm transition-colors group"
                >
                  <span className="text-gh-text-secondary group-hover:text-gh-text">
                    #
                  </span>{" "}
                  {c}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <CommunityBrowser
            onSelectCommunity={(community) => {
              setSelectedCommunity(community);
              // Optionally load community feed here
            }}
          />
        )}
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto py-8 px-4">
          {/* Create Post */}
          <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px]">
                <img
                  src="https://i.pravatar.cc/150?u=arivera"
                  alt="Current User Avatar"
                  className="size-full rounded-full object-cover border-2 border-gh-bg-secondary"
                />
              </div>
              <div
                className="flex-1 bg-gh-bg border border-gh-border rounded-lg px-4 text-sm text-gh-text placeholder-gh-text-secondary cursor-pointer hover:border-primary transition-all flex items-center"
                onClick={() => setShowCreateModal(true)}
              >
                <span className="text-gh-text-secondary">
                  What are you building today?
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="p-2 text-gh-text-secondary hover:text-gh-text rounded hover:bg-gh-bg transition-colors">
                <span className="material-symbols-outlined !text-[20px]">
                  image
                </span>
              </button>
              <button className="p-2 text-gh-text-secondary hover:text-gh-text rounded hover:bg-gh-bg transition-colors">
                <span className="material-symbols-outlined !text-[20px]">
                  code
                </span>
              </button>
              <button className="p-2 text-gh-text-secondary hover:text-gh-text rounded hover:bg-gh-bg transition-colors">
                <span className="material-symbols-outlined !text-[20px]">
                  link
                </span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gh-border">
            {["for-you", "following", "trending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === tab ? "text-gh-text border-primary" : "text-gh-text-secondary border-transparent hover:text-gh-text"}`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-[#8b949e]">
                Loading your feed...
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gh-bg-secondary border border-gh-border rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {post.type === "job_alert" && (
                        <span className="text-[10px] font-bold bg-[#238636]/10 text-[#238636] border border-[#238636]/20 px-1.5 py-0.5 rounded uppercase">
                          Job Alert
                        </span>
                      )}
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="size-8 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                          {post.author.name}
                        </span>
                        <span className="text-[10px] text-[#8b949e]">
                          {post.author.role || "Member"} •{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="text-[#8b949e] hover:text-white">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="mt-2 text-sm text-gh-text leading-relaxed">
                    {post.title && (
                      <h3 className="font-bold mb-2">{post.title}</h3>
                    )}
                    <p className="text-gh-text-secondary">{post.content}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gh-border text-gh-text-secondary">
                    <button className="flex items-center gap-1.5 text-xs font-bold hover:text-[#f78166] transition-colors hover:bg-[#f78166]/10 px-2 py-1 rounded">
                      <span className="material-symbols-outlined !text-[16px]">
                        arrow_upward
                      </span>{" "}
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold hover:text-primary transition-colors hover:bg-primary/10 px-2 py-1 rounded">
                      <span className="material-symbols-outlined !text-[16px]">
                        chat_bubble
                      </span>{" "}
                      {post.comments?.length || 0}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold hover:text-white transition-colors hover:bg-white/10 px-2 py-1 rounded">
                      <span className="material-symbols-outlined !text-[16px]">
                        share
                      </span>{" "}
                      Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Trending */}
      <div className="w-80 border-l border-gh-border p-6 hidden xl:block overflow-y-auto">
        <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-4 mb-6">
          <h3 className="text-xs font-black text-gh-text uppercase tracking-widest mb-4">
            Trending Repos
          </h3>
          <div className="space-y-4">
            {[
              { name: "facebook/react", stars: "213k", diff: "+124" },
              { name: "rust-lang/rust", stars: "94k", diff: "+89" },
              { name: "shadcn/ui", stars: "45k", diff: "+432" },
            ].map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-gh-text group-hover:text-primary transition-colors">
                    {r.name}
                  </div>
                  <div className="text-[10px] text-gh-text-secondary">
                    {r.stars} stars
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[#3fb950]">
                  {r.diff}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={() => {
            loadFeed();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CommunityView;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socialService, Post } from "../services/socialService";
import { CommunityBrowser } from "../components/community/CommunityBrowser";
import { CreatePostModal } from "../components/community/CreatePostModal";
import UserHoverCard from "../components/community/UserHoverCard";

const CommunityView = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");
  const [showCreateModal, setShowCreateModal] = useState(false);

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
              ? "bg-primary text-white"
              : "bg-gh-bg-secondary text-gh-text-secondary hover:text-gh-text"
              }`}
          >
            Channels
          </button>
          <button
            onClick={() => setSidebarView("communities")}
            className={`flex-1 px-3 py-2 rounded-md text-xs font-bold transition-colors ${sidebarView === "communities"
              ? "bg-primary text-white"
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
          <CommunityBrowser onSelectCommunity={() => { }} />
        )}
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto py-8 px-4">
          {/* Create Post */}
          {/* Create Post Widget - New Design */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex gap-3">
              <div className="shrink-0">
                <img
                  src="https://i.pravatar.cc/150?u=arivera"
                  alt="Current User"
                  className="size-10 rounded-full object-cover border border-[#30363d]"
                />
              </div>
              <div
                className="flex-1"
                onClick={() => setShowCreateModal(true)}
              >
                <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-sm text-[#c9d1d9] placeholder-[#8b949e] cursor-pointer hover:bg-[#161b22] hover:border-[#8b949e] transition-all">
                  What are you building today?
                </div>
                <div className="flex justify-between items-center mt-3 px-1">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 transition-colors">
                      <span className="material-symbols-outlined !text-[18px]">
                        image
                      </span>
                      <span className="text-xs font-bold">Photo</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 transition-colors">
                      <span className="material-symbols-outlined !text-[18px]">
                        videocam
                      </span>
                      <span className="text-xs font-bold">Video</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 transition-colors">
                      <span className="material-symbols-outlined !text-[18px]">
                        poll
                      </span>
                      <span className="text-xs font-bold">Poll</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[#8b949e] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 transition-colors">
                      <span className="material-symbols-outlined !text-[18px]">
                        calendar_month
                      </span>
                      <span className="text-xs font-bold">Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
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
              <div className="flex flex-col items-center justify-center py-20 text-[#8b949e]">
                <span className="material-symbols-outlined !text-4xl animate-spin mb-4">
                  progress_activity
                </span>
                <p>Loading your feed...</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#8b949e]/50 transition-colors group cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-3 relative group/author">
                      <div className="relative">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="size-10 rounded-full border border-[#30363d] cursor-pointer"
                          onClick={() => navigate(`/marketplace/growth/profile/${post.author.id}`)}
                        />
                        {/* Hover Card */}
                        <div className="hidden group-hover/author:block absolute top-8 left-0 z-50 pt-2">
                          <UserHoverCard user={post.author} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[15px] font-bold text-[#c9d1d9] hover:underline cursor-pointer"
                            onClick={() => navigate(`/marketplace/growth/profile/${post.author.id}`)}
                          >
                            {post.author.name}
                          </span>
                          {post.author.role && (
                            <span className="material-symbols-outlined !text-[14px] text-[#58a6ff]">verified</span>
                          )}

                        </div>
                        <div className="text-[12px] text-[#8b949e] flex items-center gap-1">
                          {new Date(post.createdAt).toLocaleDateString()} •{" "}
                          <span className="material-symbols-outlined !text-[12px]">public</span>
                        </div>
                      </div>
                    </div>

                    <button className="text-[#8b949e] hover:text-[#c9d1d9] p-1 rounded-full hover:bg-[#30363d] transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </div>

                  {/* Content Body */}
                  <div className="pl-[52px]">
                    <div className="text-[15px] text-[#e6edf3] leading-relaxed whitespace-pre-wrap mb-3">
                      {post.title && <h3 className="font-bold mb-1">{post.title}</h3>}
                      {post.content}
                    </div>

                    {/* Render specific post type content if needed */}
                    {post.type === "repo_update" && post.repoLink && (
                      <div className="mt-2 bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#8b949e] transition-colors">
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <img src={post.author.avatar} className="size-5 rounded-md" alt={post.author.name} />
                            <span className="font-bold text-[#c9d1d9] text-sm">{post.repoLink.name}</span>
                          </div>
                          <p className="text-sm text-[#8b949e] line-clamp-2 mb-3">{post.repoLink.description}</p>
                          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#f78166]"></span> {post.repoLink.language}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-[14px]">star</span> {post.repoLink.stars}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-[14px]">fork_right</span> 24</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {post.type === "showcase" && post.mediaUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-[#30363d]">
                        <img src={post.mediaUrl} className="w-full h-auto object-cover max-h-[500px]" alt="Post media" />
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-4 text-[#8b949e] max-w-md">
                      <button className="flex items-center gap-2 text-xs font-bold hover:text-[#f78166] group/action transition-colors">
                        <div className="p-2 rounded-full group-hover/action:bg-[#f78166]/10 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined !text-[18px]">favorite</span>
                        </div>
                        <span>{post.likes}</span>
                      </button>

                      <button className="flex items-center gap-2 text-xs font-bold hover:text-[#58a6ff] group/action transition-colors">
                        <div className="p-2 rounded-full group-hover/action:bg-[#58a6ff]/10 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined !text-[18px]">chat_bubble</span>
                        </div>
                        <span>{post.comments?.length || 0}</span>
                      </button>

                      <button className="flex items-center gap-2 text-xs font-bold hover:text-[#3fb950] group/action transition-colors">
                        <div className="p-2 rounded-full group-hover/action:bg-[#3fb950]/10 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined !text-[18px]">cached</span>
                        </div>
                        <span>Repost</span>
                      </button>

                      <button className="flex items-center gap-2 text-xs font-bold hover:text-[#58a6ff] group/action transition-colors">
                        <div className="p-2 rounded-full group-hover/action:bg-[#58a6ff]/10 transition-colors flex items-center justify-center">
                          <span className="material-symbols-outlined !text-[18px]">share</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Trending */}
      <div className="w-80 border-l border-gh-border p-6 hidden xl:block overflow-y-auto">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 mb-6">
          <h3 className="text-xs font-black text-[#8b949e] uppercase tracking-widest mb-4">
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
                  <div className="text-xs font-bold text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors">
                    {r.name}
                  </div>
                  <div className="text-[10px] text-[#8b949e]">
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

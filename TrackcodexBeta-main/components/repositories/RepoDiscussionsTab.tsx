import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Repository } from "../../types";

interface RepoDiscussionsTabProps {
  repo: Repository;
}

const RepoDiscussionsTab: React.FC<RepoDiscussionsTabProps> = ({ repo }) => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("GENERAL");
  const [creating, setCreating] = useState(false);

  const categories = [
    { name: "GENERAL", label: "General", emoji: "📢" },
    { name: "IDEAS", label: "Ideas", emoji: "💡" },
    { name: "Q&A", label: "Q&A", emoji: "🙏" },
    { name: "ANNOUNCEMENTS", label: "Announcements", emoji: "🙌" },
  ];

  useEffect(() => {
    fetchDiscussions();
  }, [repo.id, category]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/repositories/${repo.id}/discussions`;
      if (category) url += `?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setDiscussions(data);
    } catch (err) {
      console.error("Failed to fetch discussions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newBody.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repo.id}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
          category: newCategory,
        }),
      });
      if (!res.ok) throw new Error("Failed to create discussion");
      const discussion = await res.json();
      setShowCreateModal(false);
      setNewTitle("");
      setNewBody("");
      navigate(`/repositories/${repo.id}/discussions/${discussion.number}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create discussion");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Sidebar */}
      <div className="w-1/4 min-w-[200px] flex flex-col gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`flex items-center justify-between px-3 py-2 border rounded-md font-bold text-sm ${category === null
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-gh-bg-secondary border-gh-border text-gh-text hover:bg-gh-border"
            }`}
        >
          <span>All Discussions</span>
        </button>

        <div className="border border-gh-border rounded-md overflow-hidden bg-gh-bg-secondary text-sm">
          <div className="p-2 border-b border-gh-border font-bold text-gh-text">
            Categories
          </div>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className={`w-full text-left px-3 py-2 text-sm transition-all flex gap-2 ${category === cat.name
                  ? "bg-gh-bg-tertiary text-primary font-bold"
                  : "text-gh-text-secondary hover:bg-gh-bg hover:text-gh-text"
                }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 flex bg-gh-bg border border-gh-border rounded-md overflow-hidden focus-within:border-primary">
            <div className="flex-1 flex items-center px-3 gap-2">
              <span className="material-symbols-outlined !text-[18px] text-gh-text-secondary">
                search
              </span>
              <input
                type="text"
                placeholder="Search discussions"
                className="bg-transparent border-none outline-none text-gh-text text-sm w-full py-1.5"
              />
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition-colors text-sm"
          >
            New Discussion
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : discussions.length === 0 ? (
          <div className="bg-gh-bg-secondary border border-gh-border rounded-md p-12 text-center">
            <span className="material-symbols-outlined !text-[48px] text-gh-text-secondary mb-4 opacity-50">
              forum
            </span>
            <h3 className="text-lg font-bold text-gh-text mb-2">
              No discussions found
            </h3>
            <p className="text-gh-text-secondary mb-4">
              Be the first to start a conversation in this repository.
            </p>
          </div>
        ) : (
          <div className="border border-gh-border rounded-md bg-gh-bg-secondary divide-y divide-gh-border">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                onClick={() =>
                  navigate(
                    `/repositories/${repo.id}/discussions/${discussion.number}`,
                  )
                }
                className="p-4 hover:bg-gh-bg group flex gap-3 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-1 text-gh-text-secondary pt-1 min-w-[40px]">
                  <span className="material-symbols-outlined !text-[20px] hover:text-green-500">
                    arrow_upward
                  </span>
                  <span className="text-sm font-bold">
                    {discussion.reactions?.length || 0}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gh-text text-[16px] group-hover:text-primary mb-1">
                    {discussion.title}
                  </div>
                  <div className="text-xs text-gh-text-secondary flex gap-2 items-center">
                    <span className="bg-gh-bg-tertiary px-2 py-0.5 rounded-full text-[10px]">
                      {discussion.category}
                    </span>
                    <span>
                      {discussion.author?.username} started{" "}
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gh-text-secondary text-sm">
                  <span className="material-symbols-outlined !text-[16px]">
                    chat_bubble
                  </span>
                  {discussion._count?.comments || 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gh-bg-secondary border border-gh-border rounded-xl w-full max-w-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gh-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-gh-text">New Discussion</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gh-text-secondary hover:text-gh-text"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gh-text mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setNewCategory(cat.name)}
                      className={`flex items-center gap-2 p-2 border rounded-md text-sm transition-all ${newCategory === cat.name
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-gh-border text-gh-text hover:bg-gh-bg"
                        }`}
                    >
                      <span>{cat.emoji}</span> {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gh-text mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ask a question or start a discussion"
                  className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gh-text mb-2">
                  Body
                </label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Share details, ask questions, or post an update..."
                  rows={8}
                  className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:border-primary outline-none resize-none font-mono text-sm"
                />
              </div>
            </div>
            <div className="p-4 bg-gh-bg border-t border-gh-border flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gh-text-secondary hover:text-gh-text text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || !newBody.trim() || creating}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {creating ? "Starting..." : "Start Discussion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoDiscussionsTab;

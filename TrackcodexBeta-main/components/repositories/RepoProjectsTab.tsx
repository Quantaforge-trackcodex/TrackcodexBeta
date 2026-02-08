import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Repository } from "../../types";

interface RepoProjectsTabProps {
  repo: Repository;
}

const RepoProjectsTab: React.FC<RepoProjectsTabProps> = ({ repo }) => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [repo.id]);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repo.id}/boards`);
      const data = await res.json();
      setBoards(data);
    } catch (err) {
      console.error("Failed to fetch boards", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repo.id}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBoardName,
          description: newBoardDesc || undefined,
          layout: "KANBAN",
        }),
      });
      if (!res.ok) throw new Error("Failed to create board");
      const board = await res.json();
      setBoards([board, ...boards]);
      setShowCreateModal(false);
      setNewBoardName("");
      setNewBoardDesc("");
      navigate(`/boards/${board.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create board");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-gh-text-secondary">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Loading project boards...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gh-text">Project Boards</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined !text-[18px]">add</span>
          New Board
        </button>
      </div>

      {/* Boards List */}
      {boards.length === 0 ? (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-16 text-center">
          <span className="material-symbols-outlined !text-[64px] text-gh-text-secondary opacity-30">
            dashboard
          </span>
          <h4 className="text-lg font-bold text-gh-text mt-4">
            No project boards
          </h4>
          <p className="text-sm text-gh-text-secondary mt-2">
            Create a board to organize your issues and pull requests
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all"
          >
            Create your first board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/boards/${board.id}`)}
              className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5 hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gh-text group-hover:text-primary transition-colors">
                  {board.name}
                </h3>
                <span className="material-symbols-outlined !text-[20px] text-gh-text-secondary">
                  {board.layout === "KANBAN" ? "view_kanban" : "table_chart"}
                </span>
              </div>

              {board.description && (
                <p className="text-sm text-gh-text-secondary mb-4 line-clamp-2">
                  {board.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-gh-text-secondary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined !text-[14px]">
                    view_week
                  </span>
                  {board.columns?.length || 0} columns
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined !text-[14px]">
                    style
                  </span>
                  {board.columns?.reduce(
                    (sum: number, col: any) => sum + (col._count?.cards || 0),
                    0,
                  ) || 0}{" "}
                  cards
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold text-gh-text mb-4">
              Create New Board
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gh-text mb-2">
                  Board Name *
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g., Sprint Planning, Feature Roadmap"
                  className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-gh-text focus:outline-none focus:border-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gh-text mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  placeholder="What is this board for?"
                  rows={3}
                  className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-gh-text focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim() || creating}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Board"}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName("");
                  setNewBoardDesc("");
                }}
                className="px-4 py-2 bg-gh-bg-tertiary text-gh-text rounded-lg hover:bg-gh-border transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoProjectsTab;

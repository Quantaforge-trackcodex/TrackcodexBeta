import React, { useState } from "react";
import { socialService } from "../../services/socialService";
import "./CreatePostModal.css";

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onPostCreated,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<
    "discussion" | "question" | "showcase" | "research"
  >("discussion");
  const [communitySlug, setCommunitySlug] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [researchPaperUrl, setResearchPaperUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      await socialService.createPost(content, title || undefined);
      onPostCreated();
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content create-post-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="post-type">Post Type</label>
            <select
              id="post-type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              aria-label="Select post type"
            >
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="showcase">Showcase Project</option>
              <option value="research">Research Paper</option>
            </select>
          </div>

          {type !== "discussion" && (
            <div className="form-group">
              <label htmlFor="post-title">Title</label>
              <input
                id="post-title"
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Post title"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              aria-label="Post content"
            />
          </div>

          <div className="form-group">
            <label htmlFor="community-slug">Community (optional)</label>
            <input
              id="community-slug"
              type="text"
              placeholder="e.g., rust, javascript"
              value={communitySlug}
              onChange={(e) => setCommunitySlug(e.target.value)}
              aria-label="Community name"
            />
          </div>

          {type === "showcase" && (
            <div className="form-group">
              <label htmlFor="workspace-id">Workspace ID (optional)</label>
              <input
                id="workspace-id"
                type="text"
                placeholder="Link to your workspace"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                aria-label="Workspace ID"
              />
            </div>
          )}

          {type === "research" && (
            <div className="form-group">
              <label htmlFor="research-url">Research Paper URL</label>
              <input
                id="research-url"
                type="url"
                placeholder="https://arxiv.org/..."
                value={researchPaperUrl}
                onChange={(e) => setResearchPaperUrl(e.target.value)}
                aria-label="Research paper URL"
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

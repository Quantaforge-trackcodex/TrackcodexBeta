import React, { useState, useEffect } from "react";
import { socialService, Community } from "../../services/socialService";
import "./CommunityBrowser.css";

interface CommunityBrowserProps {
  onSelectCommunity?: (community: Community) => void;
}

export const CommunityBrowser: React.FC<CommunityBrowserProps> = ({
  onSelectCommunity,
}) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setLoading(true);
    // For now, we'll need to add a list endpoint or use mock data
    // Since we don't have a list endpoint yet, we'll show a placeholder
    setLoading(false);
  };

  const handleCreateCommunity = async () => {
    try {
      await socialService.createCommunity(newCommunity);
      setShowCreateModal(false);
      setNewCommunity({ name: "", description: "" });
      loadCommunities();
    } catch (err) {
      console.error("Failed to create community:", err);
    }
  };

  const handleJoinCommunity = async (slug: string) => {
    const success = await socialService.joinCommunity(slug);
    if (success) {
      loadCommunities();
    }
  };

  return (
    <div className="community-browser">
      <div className="browser-header">
        <h2>Communities</h2>
        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          + Create Community
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading communities...</div>
      ) : (
        <div className="communities-grid">
          {communities.length === 0 ? (
            <div className="empty-state">
              <p>No communities yet. Create the first one!</p>
            </div>
          ) : (
            communities.map((community) => (
              <div key={community.id} className="community-card">
                {community.avatar && (
                  <img
                    src={community.avatar}
                    alt={community.name}
                    className="community-avatar"
                  />
                )}
                <h3>{community.name}</h3>
                <p className="community-slug">c/{community.slug}</p>
                {community.description && (
                  <p className="description">{community.description}</p>
                )}
                <div className="community-stats">
                  <span>{community._count?.members || 0} members</span>
                  <span>{community._count?.posts || 0} posts</span>
                </div>
                <div className="community-actions">
                  <button onClick={() => handleJoinCommunity(community.slug)}>
                    Join
                  </button>
                  {onSelectCommunity && (
                    <button onClick={() => onSelectCommunity(community)}>
                      View
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create Community</h3>
            <input
              type="text"
              placeholder="Community Name"
              value={newCommunity.name}
              onChange={(e) =>
                setNewCommunity({ ...newCommunity, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description (optional)"
              value={newCommunity.description}
              onChange={(e) =>
                setNewCommunity({
                  ...newCommunity,
                  description: e.target.value,
                })
              }
            />
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button
                onClick={handleCreateCommunity}
                disabled={!newCommunity.name}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

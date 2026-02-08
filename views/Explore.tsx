import React, { useState, useEffect } from "react";
import { Users, Search, TrendingUp, UserPlus, Star } from "lucide-react";
import { profileService } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import "../styles/Explore.css";

interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "workspaces">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingUsers, setTrendingUsers] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDiscoveryData();
  }, []);

  const loadDiscoveryData = async () => {
    setLoading(true);
    try {
      const [trending, suggested] = await Promise.all([
        profileService.getTrendingUsers(),
        profileService.getSuggestedUsers(),
      ]);
      setTrendingUsers(trending);
      setSuggestedUsers(suggested);
    } catch (error) {
      console.error("Error loading discovery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await profileService.searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await profileService.followUser(userId);
      // Refresh data
      loadDiscoveryData();
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await profileService.unfollowUser(userId);
      // Refresh data
      loadDiscoveryData();
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const renderUserCard = (user: User) => (
    <div key={user.id} className="user-card">
      <div className="user-card-header">
        <img
          src={
            user.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
          }
          alt={user.name}
          className="user-avatar"
        />
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-username">@{user.username}</p>
        </div>
        <button
          className={`follow-btn ${user.isFollowing ? "following" : ""}`}
          onClick={() =>
            user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)
          }
        >
          {user.isFollowing ? "Following" : "Follow"}
        </button>
      </div>
      {user.bio && <p className="user-bio">{user.bio}</p>}
      <div className="user-stats">
        <span>
          <strong>{user.followersCount || 0}</strong> followers
        </span>
        <span>
          <strong>{user.followingCount || 0}</strong> following
        </span>
      </div>
    </div>
  );

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>
          <Users size={32} /> Explore
        </h1>
        <p>Discover developers and projects in the TrackCodex community</p>
      </div>

      <div className="explore-tabs">
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={20} />
          Users
        </button>
        <button
          className={`tab ${activeTab === "workspaces" ? "active" : ""}`}
          onClick={() => setActiveTab("workspaces")}
        >
          <Star size={20} />
          Workspaces
        </button>
      </div>

      {activeTab === "users" && (
        <div className="explore-content">
          {/* Search Section */}
          <div className="search-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <section className="explore-section">
              <h2>
                <Search size={24} /> Search Results
              </h2>
              <div className="user-grid">
                {searchResults.map(renderUserCard)}
              </div>
            </section>
          )}

          {/* Trending Users */}
          {!searchQuery && (
            <>
              <section className="explore-section">
                <h2>
                  <TrendingUp size={24} /> Trending Developers
                </h2>
                <p className="section-subtitle">
                  Most followed developers this week
                </p>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  <div className="user-grid">
                    {trendingUsers.map(renderUserCard)}
                  </div>
                )}
              </section>

              {/* Suggested Users */}
              <section className="explore-section">
                <h2>
                  <UserPlus size={24} /> Suggested for You
                </h2>
                <p className="section-subtitle">
                  Developers you might want to follow
                </p>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  <div className="user-grid">
                    {suggestedUsers.map(renderUserCard)}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {activeTab === "workspaces" && (
        <div className="explore-content">
          <div className="coming-soon">
            <Star size={48} />
            <h2>Workspace Discovery Coming Soon</h2>
            <p>Explore trending and starred workspaces</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;

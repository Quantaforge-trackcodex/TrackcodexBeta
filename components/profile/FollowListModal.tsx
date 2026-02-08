import React, { useEffect, useState } from "react";
import { profileService, UserProfile } from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/FollowListModal.css";

interface FollowListModalProps {
  userId: string;
  type: "followers" | "following";
  isOpen: boolean;
  onClose: () => void;
}

export const FollowListModal: React.FC<FollowListModalProps> = ({
  userId,
  type,
  isOpen,
  onClose,
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, userId, type]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let userList: UserProfile[];

      if (type === "followers") {
        userList = await profileService.getFollowers(userId);
      } else {
        userList = await profileService.getFollowing(userId);
      }

      setUsers(userList);

      // Build following map
      const map: Record<string, boolean> = {};
      userList.forEach((u) => {
        map[u.id] = u.isFollowing || false;
      });
      setFollowingMap(map);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    if (!currentUser) return;

    setActionLoading((prev) => ({ ...prev, [targetUserId]: true }));

    try {
      const isCurrentlyFollowing = followingMap[targetUserId];

      if (isCurrentlyFollowing) {
        await profileService.unfollowUser(targetUserId);
        setFollowingMap((prev) => ({ ...prev, [targetUserId]: false }));
      } else {
        await profileService.followUser(targetUserId);
        setFollowingMap((prev) => ({ ...prev, [targetUserId]: true }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleUserClick = (targetUserId: string) => {
    navigate(`/profile/${targetUserId}`);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="follow-modal-backdrop" onClick={handleBackdropClick}>
      <div className="follow-modal">
        <div className="follow-modal-header">
          <h2>{type === "followers" ? "Followers" : "Following"}</h2>
          <button onClick={onClose} className="close-button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="follow-modal-content">
          {loading ? (
            <div className="follow-modal-loading">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="follow-modal-empty">
              <p>
                {type === "followers"
                  ? "No followers yet"
                  : "Not following anyone yet"}
              </p>
            </div>
          ) : (
            <div className="user-list">
              {users.map((user) => {
                const isOwnProfile = currentUser?.id === user.id;
                const isFollowing = followingMap[user.id];
                const isLoading = actionLoading[user.id];

                return (
                  <div key={user.id} className="user-list-item">
                    <div
                      className="user-info"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name}
                        className="user-avatar"
                      />
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-username">@{user.username}</div>
                        {user.bio && <div className="user-bio">{user.bio}</div>}
                      </div>
                    </div>

                    {!isOwnProfile && (
                      <button
                        onClick={() => handleFollow(user.id)}
                        disabled={isLoading}
                        className={`follow-action-button ${
                          isFollowing ? "following" : ""
                        }`}
                      >
                        {isLoading
                          ? "Loading..."
                          : isFollowing
                            ? "Following"
                            : "Follow"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;

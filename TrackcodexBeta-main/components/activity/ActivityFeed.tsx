import React, { useEffect, useState } from "react";
import {
  activityService,
  Activity,
  ActivityType,
} from "../../services/activityService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/ActivityFeed.css";

export const ActivityFeed: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [page]);

  const loadActivities = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await activityService.getFollowingFeed(page, 20);

      if (response.activities.length < 20) {
        setHasMore(false);
      }

      setActivities((prev) =>
        page === 1 ? response.activities : [...prev, ...response.activities],
      );
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleActivityClick = (activity: Activity) => {
    // Navigate based on activity type
    if (
      activity.action === ActivityType.FOLLOW_USER &&
      activity.metadata?.targetUserId
    ) {
      navigate(`/profile/${activity.metadata.targetUserId}`);
    } else if (
      activity.action === ActivityType.STAR_WORKSPACE &&
      activity.workspaceId
    ) {
      navigate(`/workspace/${activity.workspaceId}`);
    } else if (
      activity.action === ActivityType.CREATE_WORKSPACE &&
      activity.workspaceId
    ) {
      navigate(`/workspace/${activity.workspaceId}`);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="activity-feed-loading">
        <div className="loading-spinner"></div>
        <p>Loading activity feed...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="activity-feed-empty">
        <div className="empty-icon">📭</div>
        <h3>No Activity Yet</h3>
        <p>Follow users to see their activity here</p>
        <button onClick={() => navigate("/explore")} className="explore-button">
          Explore Users
        </button>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-feed-header">
        <h2>Following Feed</h2>
        <p>Activity from people you follow</p>
      </div>

      <div className="activity-list">
        {activities.map((activity) => {
          const formatted = activityService.formatActivity(activity);
          const timeAgo = activityService.getRelativeTime(activity.createdAt);

          return (
            <div
              key={activity.id}
              className="activity-item"
              onClick={() => handleActivityClick(activity)}
            >
              <div className="activity-avatar">
                <img
                  src={activity.user.avatar || "/default-avatar.png"}
                  alt={activity.user.name}
                />
              </div>

              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-user">{activity.user.name}</span>
                  <span className="activity-username">
                    @{activity.user.username}
                  </span>
                  <span className="activity-time">{timeAgo}</span>
                </div>

                <div className="activity-body">
                  <span className="activity-icon">{formatted.icon}</span>
                  <span className="activity-description">
                    {formatted.title}
                    {formatted.description && (
                      <span className="activity-target">
                        {" "}
                        {formatted.description}
                      </span>
                    )}
                  </span>
                </div>

                {activity.metadata?.description && (
                  <div className="activity-metadata">
                    {activity.metadata.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="activity-load-more">
          <button onClick={handleLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

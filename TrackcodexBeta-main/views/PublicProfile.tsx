import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { profileService, UserProfile } from "../services/profileService";
import { activityService, Activity } from "../services/activityService";
import { useAuth } from "../context/AuthContext";
import { FollowListModal } from "../components/profile/FollowListModal";
import { ChatDialog } from "../components/chat/ChatDialog";
import PortfolioDisplay from "../components/profile/PortfolioDisplay";
import RepositoryShowcase from "../components/profile/RepositoryShowcase";
import PinnedItemsGrid from "../components/profile/PinnedItemsGrid";
import ContributionGraph from "../components/profile/ContributionGraph";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/PublicProfile.css";
import styles from "./PublicProfile.module.css";
import "../styles/PortfolioStyles.css";

export const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activityPage, setActivityPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following">(
    "followers",
  );
  const [chatOpen, setChatOpen] = useState(false);

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [pinnedItems, setPinnedItems] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      loadProfile();
      loadActivities();
      loadStats();
      loadPortfolio();
      loadRepositories();
      loadPinnedItems();
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;

    try {
      const profileData = await profileService.getProfile(userId);
      setProfile(profileData);
      setIsFollowing(profileData.isFollowing || false);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadActivities = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await activityService.getUserActivity(
        userId,
        activityPage,
        20,
      );

      if (response.activities.length < 20) {
        setHasMoreActivities(false);
      }

      setActivities((prev) =>
        activityPage === 1
          ? response.activities
          : [...prev, ...response.activities],
      );
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!userId) return;

    try {
      const statsData = await activityService.getActivityStats(userId);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadPortfolio = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/v1/portfolio/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data.items || []);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const loadRepositories = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/v1/repositories?userId=${userId}&limit=6`,
      );
      if (response.ok) {
        const data = await response.json();
        setRepositories(data.repositories || []);
      }
    } catch (error) {
      console.error("Error loading repositories:", error);
    }
  };

  const loadPinnedItems = async () => {
    if (!userId || !profile) return;

    try {
      // Fetch pinned items from user profile
      const pinnedIds = profile.pinnedItems || [];
      const items = [];

      for (const pinnedId of pinnedIds.slice(0, 6)) {
        if (pinnedId.startsWith("portfolio:")) {
          const itemId = pinnedId.replace("portfolio:", "");
          const portItem = portfolioItems.find((p) => p.id === itemId);
          if (portItem) {
            items.push({
              type: "portfolio",
              id: portItem.id,
              title: portItem.title,
              description: portItem.description,
              technologies: portItem.technologies,
              imageUrl: portItem.imageUrl,
              demoUrl: portItem.demoUrl,
              sourceUrl: portItem.sourceUrl,
            });
          }
        } else if (pinnedId.startsWith("repo:")) {
          const repoName = pinnedId.replace("repo:", "");
          const repo = repositories.find((r) => r.name === repoName);
          if (repo) {
            items.push({
              type: "repository",
              id: repo.id,
              title: repo.name,
              description: repo.description,
              language: repo.language,
              stars: repo.stars,
              forks: repo.forks,
            });
          }
        }
      }

      setPinnedItems(items);
    } catch (error) {
      console.error("Error loading pinned items:", error);
    }
  };

  const handleFollow = async () => {
    if (!userId || !profile) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await profileService.unfollowUser(userId);
        setIsFollowing(false);
        setProfile({
          ...profile,
          followers: profile.followers - 1,
        });
      } else {
        await profileService.followUser(userId);
        setIsFollowing(true);
        setProfile({
          ...profile,
          followers: profile.followers + 1,
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMoreActivities) {
      setActivityPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (activityPage > 1) {
      loadActivities();
    }
  }, [activityPage]);

  if (loading && activityPage === 1) {
    return (
      <div className="public-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="public-profile-error">
        <h2>Profile Not Found</h2>
        <p>The user you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/explore")}>Explore Users</button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;
  const totalActivities = Object.values(stats).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="public-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-banner"></div>

        <div className="profile-info-container">
          <div className="profile-avatar-section">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt={profile.name}
              className="profile-avatar-large"
            />
          </div>

          <div className="profile-details">
            <div className="profile-name-section">
              <h1>{profile.name}</h1>
              <p className="profile-username">@{profile.username}</p>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => navigate("/settings/profile")}
                className="edit-profile-button"
              >
                Edit Profile
              </button>
            )}

            {!isOwnProfile && currentUser && (
              <button
                onClick={() => setChatOpen(true)}
                className={`edit-profile-button ${styles.messageButton}`}
              >
                Message
              </button>
            )}
          </div>

          <ChatDialog
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            targetUserId={profile.id}
            targetUserName={profile.name}
            currentUserId={currentUser?.id || ""}
          />

          {profile.bio && (
            <div className="profile-bio">
              <p>{profile.bio}</p>
            </div>
          )}

          {/* Profile README Section */}
          {profile.profileReadme && profile.showReadme && (
            <div className={styles.profileReadmeSection}>
              <div
                className={`prose prose-gh max-w-none ${styles.readmeContent}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {profile.profileReadme}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Resume Download Button */}
          {profile.resumeUrl && profile.showResume && (
            <div className={styles.resumeContainer}>
              <a
                href={`/#/resume/${userId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-secondary ${styles.resumeButton}`}
              >
                <span
                  className={`material-symbols-outlined ${styles.resumeIcon}`}
                >
                  description
                </span>
                View Resume
              </a>
            </div>
          )}

          <div className="profile-meta">
            {profile.location && (
              <span className="meta-item">
                <span className="material-symbols-outlined">location_on</span>
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-item"
              >
                <span className="material-symbols-outlined">link</span>
                {profile.website}
              </a>
            )}
            <span className="meta-item">
              <span className="material-symbols-outlined">calendar_today</span>
              Joined{" "}
              {new Date(profile.createdAt || Date.now()).toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" },
              )}
            </span>
          </div>

          <div className="profile-stats">
            <button
              onClick={() => {
                setModalType("followers");
                setModalOpen(true);
              }}
              className="stat-item"
            >
              <strong>{profile.followers}</strong>
              <span>Followers</span>
            </button>
            <button
              onClick={() => {
                setModalType("following");
                setModalOpen(true);
              }}
              className="stat-item"
            >
              <strong>{profile.following}</strong>
              <span>Following</span>
            </button>
            <div className="stat-item">
              <strong>{totalActivities}</strong>
              <span>Activities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="profile-content">
        <div className="activity-timeline">
          {/* Pinned Items Section */}
          {pinnedItems.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>
                <span className="material-icons">push_pin</span>
                Pinned
              </h2>
              <PinnedItemsGrid
                items={pinnedItems}
                userId={userId || ""}
                isOwner={isOwnProfile}
              />
            </div>
          )}

          {/* Portfolio Section */}
          {profile?.showPortfolio && portfolioItems.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>
                <span className="material-icons">work_outline</span>
                Portfolio
              </h2>
              <PortfolioDisplay items={portfolioItems} isOwner={isOwnProfile} />
            </div>
          )}

          {/* Repositories Section */}
          {profile?.showRepositories && repositories.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>
                <span className="material-icons">folder</span>
                Repositories
              </h2>
              <RepositoryShowcase
                repositories={repositories}
                userId={userId || ""}
                isOwner={isOwnProfile}
              />
            </div>
          )}

          {/* Contribution Graph Section */}
          {profile?.showContributions && userId && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>
                <span className="material-icons">insert_chart</span>
                Contribution Graph
              </h2>
              <ContributionGraph userId={userId} />
            </div>
          )}

          <h2>Activity Timeline</h2>

          {activities.length === 0 ? (
            <div className="no-activities">
              <p>No activity yet</p>
            </div>
          ) : (
            <>
              <div className="timeline-list">
                {activities.map((activity) => {
                  const formatted = activityService.formatActivity(activity);
                  const timeAgo = activityService.getRelativeTime(
                    activity.createdAt,
                  );

                  return (
                    <div key={activity.id} className="timeline-item">
                      <div className="timeline-icon">{formatted.icon}</div>

                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-action">
                            {formatted.title}
                          </span>
                          {formatted.description && (
                            <span className="timeline-target">
                              {formatted.description}
                            </span>
                          )}
                        </div>

                        {activity.metadata?.description && (
                          <div className="timeline-metadata">
                            {activity.metadata.description}
                          </div>
                        )}

                        <div className="timeline-time">{timeAgo}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMoreActivities && (
                <div className="load-more-activities">
                  <button onClick={handleLoadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Activity Stats Sidebar */}
        <div className="activity-stats-sidebar">
          <h3>Activity Breakdown</h3>
          <div className="stats-list">
            {Object.entries(stats).map(([action, count]) => (
              <div key={action} className="stat-row">
                <span className="stat-label">{action.replace(/_/g, " ")}</span>
                <span className="stat-value">{count}</span>
              </div>
            ))}
            {Object.keys(stats).length === 0 && (
              <p className="no-stats">No activity stats yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Follow List Modal */}
      {userId && (
        <FollowListModal
          userId={userId}
          type={modalType}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PublicProfile;

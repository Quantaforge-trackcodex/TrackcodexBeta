import React, { useEffect, useState } from "react";

interface ActivityItem {
  id: string;
  type: string;
  actor: { name: string; avatarUrl?: string };
  repo?: { name: string };
  details: any;
  createdAt: string;
}

const ActivityFeed = ({
  repoId,
  orgId,
  showTitle = true,
  limit = 20,
}: {
  repoId?: string;
  orgId?: string;
  showTitle?: boolean;
  limit?: number;
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const url = repoId
          ? `/repositories/${repoId}/activity?limit=${limit}`
          : `/organizations/${orgId}/activity?limit=${limit}`;

        const apiBase = (import.meta as any).env?.VITE_API_URL || "/api/v1";
        const response = await fetch(`${apiBase}${url}`);
        const data = await response.json();
        setActivities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [repoId, orgId, limit]);

  if (loading)
    return (
      <div className="p-4 text-gh-text-secondary">Loading activity...</div>
    );

  return (
    <div className="flex flex-col gap-4">
      {showTitle && (
        <h3 className="text-lg font-bold text-gh-text mb-2">Recent Activity</h3>
      )}
      {activities.length === 0 ? (
        <div className="p-8 text-center bg-gh-bg-secondary border border-gh-border rounded-md text-gh-text-secondary">
          No recent activity found.
        </div>
      ) : (
        activities.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 p-4 bg-gh-bg-secondary border border-gh-border rounded-md"
          >
            <div className="size-8 rounded-full bg-gh-bg-tertiary flex items-center justify-center overflow-hidden">
              {item.actor.avatarUrl ? (
                <img src={item.actor.avatarUrl} alt={item.actor.name} />
              ) : (
                <span className="material-symbols-outlined text-gh-text-secondary">
                  person
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gh-text">
                <span className="font-bold">{item.actor.name}</span>{" "}
                <span className="text-gh-text-secondary">
                  {item.type.toLowerCase().replace("_", " ")}
                </span>
                {item.repo && (
                  <span className="font-bold"> in {item.repo.name}</span>
                )}
              </div>
              {item.details && (
                <div className="text-xs text-gh-text-secondary italic">
                  {typeof item.details === "string"
                    ? item.details
                    : JSON.stringify(item.details)}
                </div>
              )}
              <div className="text-[10px] text-gh-text-secondary uppercase tracking-tight">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed;

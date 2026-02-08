import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Notification } from "../types";
import { profileService } from "../services/profile";
import { MOCK_JOBS } from "../constants";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "timestamp">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("trackcodex_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      // Add a welcome notification if empty
      setNotifications([
        {
          id: "welcome-1",
          title: "Welcome to TrackCodex",
          message: "Check out the new Job Marketplace!",
          type: "system",
          read: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(
      "trackcodex_notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  // INTELLIGENT SKILL MATCHING LOGIC
  useEffect(() => {
    // Subscribe to profile updates to trigger check when skills change
    const unsubscribe = profileService.subscribe((profile) => {
      checkJobMatches(profile);
    });

    // Initial check
    checkJobMatches(profileService.getProfile());

    return () => unsubscribe();
  }, []);

  const checkJobMatches = (profile: any) => {
    if (!profile.skills) return;

    const notifiedJobsKey = "trackcodex_notified_jobs";
    const notifiedJobs = JSON.parse(
      localStorage.getItem(notifiedJobsKey) || "[]",
    );

    const userSkillNames = profile.skills.map((s: any) => s.name.toLowerCase());

    MOCK_JOBS.forEach((job) => {
      // Skip if already notified
      if (notifiedJobs.includes(job.id)) return;

      // Check for overlap
      const hasMatch = job.techStack.some((tech) =>
        userSkillNames.includes(tech.toLowerCase()),
      );

      if (hasMatch) {
        // Trigger Notification
        const newNotif: Notification = {
          id: `job-match-${job.id}-${Date.now()}`,
          title: "New Job Match!",
          message: `Your skill matches the requirements for: ${job.title}`,
          type: "job_match",
          read: false,
          timestamp: new Date().toISOString(),
          link: `/marketplace/job/${job.id}`,
          metadata: { jobId: job.id, company: job.creator.name },
        };

        setNotifications((prev) => [newNotif, ...prev]);

        // Mark as notified
        notifiedJobs.push(job.id);
        localStorage.setItem(notifiedJobsKey, JSON.stringify(notifiedJobs));
      }
    });
  };

  const addNotification = (
    notif: Omit<Notification, "id" | "read" | "timestamp">,
  ) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

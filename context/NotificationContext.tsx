import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Notification } from "../types";
import { profileService, UserProfile } from "../services/profile";
import { MOCK_JOBS } from "../constants";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "timestamp">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const checkJobMatches = (profile: UserProfile | null) => {
    if (!profile || !profile.skills) return;

    const notifiedJobsKey = "trackcodex_notified_jobs";
    const notifiedJobs = JSON.parse(
      localStorage.getItem(notifiedJobsKey) || "[]",
    );

    const userSkillNames = profile.skills.map((s) => s.name.toLowerCase());

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

  const loadNotifications = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const list = await api.notifications.list(user.id);
      setNotifications(list);
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Load from API when user changes
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Handle Realtime Events
  useEffect(() => {
    const handleRealTimeNotif = (event: Event) => {
      const e = event as CustomEvent;
      const rawNotif = e.detail;

      // map to Notification type
      const newNotif: Notification = {
        id: rawNotif.id || `notif-${Date.now()}`,
        title: rawNotif.title,
        message: rawNotif.message,
        type: rawNotif.type || "system",
        read: rawNotif.read || false,
        timestamp: rawNotif.timestamp || rawNotif.createdAt || new Date().toISOString(),
        link: rawNotif.link,
        metadata: rawNotif.metadata,
      };

      setNotifications((prev) => [newNotif, ...prev]);
    };

    window.addEventListener(
      "trackcodex-realtime-notification",
      handleRealTimeNotif as EventListener,
    );
    return () =>
      window.removeEventListener(
        "trackcodex-realtime-notification",
        handleRealTimeNotif as EventListener,
      );
  }, []);

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


  const addNotification = (
    notif: Omit<Notification, "id" | "read" | "timestamp">,
  ) => {
    // For local system notifications (e.g. from other components)
    // We might want to send these to backend too? For now keep local
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
      type: notif.type || "system", // Ensure type is set
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await api.notifications.markRead(id);
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      if (user?.id) {
        await api.notifications.markAllRead(user.id);
      }
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const deleteNotification = (id: string) => {
    // Backend doesn't have delete yet? Just remove locally
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
        isLoading,
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

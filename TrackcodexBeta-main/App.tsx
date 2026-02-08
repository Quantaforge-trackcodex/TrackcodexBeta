import React, { useState, useEffect, useRef } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { api } from "./services/api";
import { RealtimeProvider } from "./contexts/RealtimeContext";

// Auth Views
const Login = React.lazy(() => import("./views/auth/Login"));
const Signup = React.lazy(() => import("./views/auth/Signup"));
const OAuthCallback = React.lazy(() => import("./views/auth/OAuthCallback"));

// Layout Components

import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import MessagingPanel from "./components/messaging/MessagingPanel";
import SplashScreen from "./components/branding/SplashScreen";
import SettingsLayout from "./components/settings/SettingsLayout";
import CommandPalette from "./components/layout/CommandPalette";

import ChatWidget from "./components/social/ChatWidget"; // Global Chat
import RedirectToLogin from "./components/auth/RedirectToLogin";

import NotificationsModalView from "./components/notifications/NotificationsModal";
import UserProfileDropdown from "./components/profile/UserProfileDropdown";
import { profileService, UserProfile } from "./services/profile";

// Core Views
const RepositoriesView = React.lazy(() => import("./views/Repositories"));

// Eager load to debug
import RepoDetailView from "./views/RepoDetail";
// const RepoDetailView = React.lazy(() => import("./views/RepoDetail"));

const EditorView = React.lazy(() => import("./views/Editor"));
const ProfileView = React.lazy(() => import("./views/Profile"));
const Overview = React.lazy(() => import("./views/Overview"));
const WorkspacesView = React.lazy(() => import("./views/Workspaces"));
const CreateWorkspaceView = React.lazy(() => import("./views/CreateWorkspace"));
const PublicProfile = React.lazy(() => import("./views/PublicProfile"));
const ResumeProfile = React.lazy(() => import("./views/ResumeProfile"));
// const WorkspaceDetailView = React.lazy(
//   () => import("./views/WorkspaceDetailView"),
// );
import WorkspaceIDE from "./views/ide/IDEShim"; // Native Monaco IDE
const HomeView = React.lazy(() => import("./views/Home"));
const ExploreView = React.lazy(() => import("./views/Explore"));
const LibraryView = React.lazy(() => import("./views/Library"));

const ForgeAIView = React.lazy(() => import("./views/ForgeAI"));
const NotificationsView = React.lazy(() => import("./views/NotificationsView"));
const AcceptInvite = React.lazy(() => import("./views/AcceptInvite"));
const WorkspaceSettings = React.lazy(() => import("./views/WorkspaceSettings"));
const AdminRoomView = React.lazy(() => import("./views/Admin"));
const PlatformMatrix = React.lazy(() => import("./views/PlatformMatrix"));
const Terms = React.lazy(() => import("./views/legal/Terms"));
const Privacy = React.lazy(() => import("./views/legal/Privacy"));
const Status = React.lazy(() => import("./views/legal/Status"));
const Security = React.lazy(() => import("./views/legal/Security"));
const Contact = React.lazy(() => import("./views/legal/Contact"));
const CookiePolicy = React.lazy(() => import("./views/legal/CookiePolicy"));
import { CookieConsent } from "./components/legal/CookieConsent";
import RoleGuard from "./auth/RoleGuard";
const CommunityView = React.lazy(() => import("./views/Community"));

const DiscussionDetail = React.lazy(() => import("./views/DiscussionDetail"));

// Organization Views
const OrganizationIndexView = React.lazy(
  () => import("./views/organizations/OrganizationIndexView"),
);
const OrganizationDetailView = React.lazy(
  () => import("./views/organizations/OrganizationDetailView"),
);
const OrgOverview = React.lazy(
  () => import("./components/organizations/OrgOverview"),
);
const OrgRepositories = React.lazy(
  () => import("./components/organizations/OrgRepositories"),
);
const OrgPeople = React.lazy(
  () => import("./components/organizations/OrgPeople"),
);
const OrgTeams = React.lazy(
  () => import("./components/organizations/OrgTeams"),
);
const OrgSettingsLayout = React.lazy(
  () => import("./components/organizations/OrgSettingsLayout"),
);
const OrgGeneralSettings = React.lazy(
  () => import("./views/organizations/settings/OrgGeneralSettings"),
);
const OrgAuthenticationSecurity = React.lazy(
  () => import("./views/organizations/settings/OrgAuthenticationSecurity"),
);
const OrgEnvironments = React.lazy(
  () => import("./views/organizations/settings/OrgEnvironments"),
);
const OrgPermissions = React.lazy(
  () => import("./views/organizations/settings/OrgPermissions"),
);
const OrgWebhooks = React.lazy(
  () => import("./views/organizations/settings/OrgWebhooks"),
);

// Settings Sub-views
const AppearanceSettings = React.lazy(
  () => import("./views/settings/AppearanceSettings"),
);
const EmailSettings = React.lazy(
  () => import("./views/settings/EmailSettings"),
);
const SecuritySettings = React.lazy(
  () => import("./views/settings/SecuritySettings"),
);
const AccountSettings = React.lazy(
  () => import("./views/settings/AccountSettings"),
);
const ProfileSettings = React.lazy(
  () => import("./views/settings/ProfileSettings"),
);
const BillingSettings = React.lazy(
  () => import("./views/settings/BillingSettings"),
);
const ForgeAIUsageSettings = React.lazy(
  () => import("./views/settings/ForgeAIUsageSettings"),
);
const AccessibilitySettings = React.lazy(
  () => import("./views/settings/AccessibilitySettings"),
);
const NotificationsSettings = React.lazy(
  () => import("./views/settings/NotificationsSettings"),
);
const PersonalAccessTokensSettings = React.lazy(
  () => import("./views/settings/PersonalAccessTokensSettings"),
);
const IntegrationsSettings = React.lazy(
  () => import("./views/settings/IntegrationsSettings"),
);

// --- NEW HIRING & GROWTH VIEWS ---
const MarketplaceLayout = React.lazy(
  () => import("./views/marketplace/MarketplaceLayout"),
);
const OnboardingLayout = React.lazy(
  () => import("./views/onboarding/OnboardingLayout"),
);
const WelcomeView = React.lazy(() => import("./views/onboarding/WelcomeView"));
const OfferAcceptanceView = React.lazy(
  () => import("./views/trials/OfferAcceptanceView"),
);

const TrialSubmittedView = React.lazy(
  () => import("./views/trials/TrialSubmittedView"),
);

// Enterprise
const EnterpriseDashboard = React.lazy(
  () => import("./views/enterprise/EnterpriseDashboard"),
);
const EnterpriseBilling = React.lazy(
  () => import("./views/enterprise/EnterpriseBilling"),
);

// --- Marketplace Sub-views ---
const MissionsView = React.lazy(
  () => import("./views/marketplace/MissionsView"),
);
const MissionDetailView = React.lazy(
  () => import("./views/marketplace/MissionDetailView"),
);
const MyApplicationsView = React.lazy(
  () => import("./views/marketplace/MyApplicationsView"),
);
const TrialRepositoriesView = React.lazy(
  () => import("./views/marketplace/TrialRepositoriesView"),
);

// --- Hiring Sub-views ---
const HiringLayout = React.lazy(() => import("./views/hiring/HiringLayout"));
const CandidateDiscoveryView = React.lazy(
  () => import("./views/hiring/CandidateDiscoveryView"),
);
const CandidateScorecardView = React.lazy(
  () => import("./views/hiring/CandidateScorecardView"),
);
const CandidateComparisonView = React.lazy(
  () => import("./views/hiring/CandidateComparisonView"),
);
const OfferEditorView = React.lazy(
  () => import("./views/hiring/OfferEditorView"),
);
const SessionSchedulerView = React.lazy(
  () => import("./views/hiring/SessionSchedulerView"),
);
const InterviewerFeedbackView = React.lazy(
  () => import("./views/hiring/InterviewerFeedbackView"),
);
const AssessmentsView = React.lazy(
  () => import("./views/hiring/AssessmentsView"),
);
const JobApplicationsView = React.lazy(
  () => import("./views/hiring/JobApplicationsView"),
);

// --- Growth Sub-views ---
const GrowthLayout = React.lazy(() => import("./views/growth/GrowthLayout"));
const SkillDashboardView = React.lazy(
  () => import("./views/growth/SkillDashboardView"),
);
const DeveloperProfileView = React.lazy(
  () => import("./views/growth/DeveloperProfileView"),
);

// --- Onboarding Sub-views ---
const OnboardingWorkspace = React.lazy(
  () => import("./views/onboarding/OnboardingWorkspace"),
);
const BuddyDashboardView = React.lazy(
  () => import("./views/onboarding/BuddyDashboardView"),
);
const WalletDashboard = React.lazy(
  () => import("./views/finance/WalletDashboard"),
);

// --- Admin Sub-views ---
const AdminOverview = React.lazy(
  () => import("./components/admin/AdminOverview"),
);
const UserManager = React.lazy(() => import("./components/admin/UserManager"));
const TeamManager = React.lazy(() => import("./components/admin/TeamManager"));
const WorkspaceMonitor = React.lazy(
  () => import("./components/admin/WorkspaceMonitor"),
);
const RepositoryGovernance = React.lazy(
  () => import("./components/admin/RepositoryGovernance"),
);
const JobOversight = React.lazy(
  () => import("./components/admin/JobOversight"),
);
const CommunityModeration = React.lazy(
  () => import("./components/admin/CommunityModeration"),
);
const RoleEditor = React.lazy(() => import("./components/admin/RoleEditor"));
const AuditLogs = React.lazy(() => import("./components/admin/AuditLogs"));
const AdminDashboard = React.lazy(() => import("./views/AdminDashboard"));

import { logActivity } from "./services/activityLogger";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-gh-bg p-8 text-center">
          <span className="material-symbols-outlined !text-4xl text-red-500 mb-4">
            error
          </span>
          <h1 className="text-xl font-bold text-gh-text mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-gh-text-secondary max-w-md mb-6">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-lg text-sm font-bold hover:bg-gh-bg-tertiary transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface NotificationItem {
  id: string;
  type: "job" | "comment" | "community" | "system" | "info";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  hasActions?: boolean; // Keep for toast compatibility
  time?: string; // Keep for fallback mock data
}

const ProtectedApp = () => {
  const [notification, setNotification] = useState<NotificationItem | null>(
    null,
  );
  const [isFocusMode] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    const handleNotify = (event: Event) => {
      const e = event as CustomEvent<NotificationItem>;
      setNotification(e.detail);
      if (!e.detail.hasActions) {
        setTimeout(() => setNotification(null), 5000);
      }
    };
    window.addEventListener(
      "trackcodex-notification",
      handleNotify as EventListener,
    );
    return () =>
      window.removeEventListener(
        "trackcodex-notification",
        handleNotify as EventListener,
      );
  }, []);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(
    profileService.getProfile(),
  );

  useEffect(() => {
    return profileService.subscribe(setProfile);
  }, []);
  const isIdeView = ["/editor", "/workspace/", "/trials/live-session"].some(
    (path) => location.pathname.includes(path),
  );

  // Global Key Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault(); // Prevent browser save
        // console.log("Global Save Triggered");
        logActivity("save", { context: location.pathname });
        // In a real app, we'd also trigger the active editor's save method via context
        setNotification({
          id: `save-notif-${Date.now()}`,
          type: "info" as const,
          title: "Saved",
          message: "Your changes have been saved.",
          createdAt: new Date().toISOString(),
          read: false,
          hasActions: false,
        });
      }

      // Command Palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault(); // Prevent browser search focus
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isAddMenuOpen && !target.closest(".add-menu-container"))
        setIsAddMenuOpen(false);
      if (isNotificationsOpen && !target.closest(".notifications-container"))
        setIsNotificationsOpen(false);
      if (
        isProfileDropdownOpen &&
        !target.closest(".profile-dropdown-container")
      )
        setIsProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAddMenuOpen, isNotificationsOpen]);

  // --- REAL NOTIFICATIONS LOGIC ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { user, logout } = useAuth(); // Assuming AuthContext provides user and logout

  // Fetch Initial Notifications
  useEffect(() => {
    if (!user?.id) return;
    api.notifications
      .list(user.id)
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Failed to fetch notifications", err));
  }, [user]);

  // Listen for Real-Time Notification Events (via custom event from ChatWidget/WebSocket)
  useEffect(() => {
    const handleRealTimeNotif = (event: Event) => {
      const e = event as CustomEvent<NotificationItem>;
      const newNotif = e.detail;
      setNotifications((prev: NotificationItem[]) => [newNotif, ...prev]);
      // Also show toast
      setNotification({
        ...newNotif, // Spread first to get all properties
        id: newNotif.id || `toast-${Date.now()}`, // Use existing ID or generate
        hasActions: false,
      });
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

  // Use the fetched notifications instead of Mock
  const displayNotifications: NotificationItem[] =
    notifications.length > 0
      ? notifications
      : [
        {
          id: "mock1",
          type: "system" as const,
          title: "Welcome",
          message: "No new notifications yet.",
          createdAt: new Date().toISOString(),
          read: true,
        },
      ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden print:overflow-visible print:h-auto text-gh-text font-display bg-gh-bg transition-colors duration-300">
      {notification && (
        <div className="fixed top-12 right-12 z-[500] bg-gh-bg-secondary border border-gh-border/30 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col gap-6 max-w-sm ring-2 ring-gh-border ring-inset">
          <div className="flex items-start gap-4">
            {/* ... existing toast UI ... */}
            <div className="min-w-0">
              <h4 className="text-[15px] font-black text-gh-text uppercase tracking-tight truncate">
                {notification.title}
              </h4>
              <p className="text-[13px] text-gh-text-secondary mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gh-text-secondary hover:text-gh-text shrink-0 mt-1"
            >
              <span className="material-symbols-outlined !text-[20px]">
                close
              </span>
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 flex min-h-0">
        {!isFocusMode && (
          <div className="contents print:hidden">
            <Sidebar />
          </div>
        )}

        <main
          ref={mainScrollRef}
          className={`flex-1 min-w-0 flex flex-col bg-gh-bg relative print:overflow-visible print:h-auto print:block ${isIdeView || isFocusMode ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"}`}
        >
          {/* Global Search Header - Visible on all non-IDE pages if desired, or just home. User wants 'Global'. */}
          {!isIdeView && !isFocusMode && (
            <div className="h-14 border-b border-gh-border grid grid-cols-[1fr_auto_1fr] items-center px-6 bg-gh-bg shrink-0 sticky top-0 z-40 print:hidden">
              <div className="flex items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-4 text-gh-text-secondary hover:text-gh-text transition-colors p-1 rounded-full hover:bg-gh-bg-secondary"
                  title="Go Back"
                >
                  <span className="material-symbols-outlined !text-[20px]">
                    arrow_back
                  </span>
                </button>
                {/* Left Spacer / Breadcrumbs placeholder */}
              </div>

              <div
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gh-bg-secondary border border-gh-border rounded-md w-[400px] cursor-pointer hover:border-gh-text-secondary transition-colors group shadow-sm"
              >
                <span className="material-symbols-outlined !text-[16px] text-gh-text-secondary group-hover:text-gh-text">
                  search
                </span>
                <span className="text-sm text-gh-text-secondary group-hover:text-gh-text flex-1">
                  Type{" "}
                  <kbd className="border border-gh-border rounded px-1 text-[10px] bg-gh-bg">
                    /
                  </kbd>{" "}
                  to search
                </span>
              </div>

              <div className="flex items-center justify-end gap-4">
                {/* Notifications Dropdown */}
                <div className="relative notifications-container">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`text-gh-text-secondary hover:text-white transition-colors relative ${isNotificationsOpen ? "text-gh-text" : ""}`}
                    title="Notifications"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      notifications
                    </span>
                    {displayNotifications.some(
                      (n: NotificationItem) => !n.read,
                    ) && (
                        <span className="absolute top-0 right-0 size-2 bg-blue-500 rounded-full border-2 border-gh-bg"></span>
                      )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-gh-bg-secondary border border-gh-border rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gh-border bg-gh-bg">
                        <span className="text-xs font-black uppercase tracking-widest text-gh-text">
                          Notifications
                        </span>
                        <button className="text-[10px] text-primary hover:underline">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {displayNotifications.map((notif: NotificationItem) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 border-b border-gh-border/50 hover:bg-gh-bg transition-colors cursor-pointer group ${!notif.read ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 size-8 rounded-lg flex items-center justify-center shrink-0 ${notif.type === "job"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : notif.type === "comment"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : notif.type === "community"
                                      ? "bg-purple-500/10 text-purple-500"
                                      : "bg-gh-text-secondary/10 text-gh-text-secondary"
                                  }`}
                              >
                                <span className="material-symbols-outlined !text-[16px]">
                                  {notif.type === "job"
                                    ? "work"
                                    : notif.type === "comment"
                                      ? "chat_bubble"
                                      : notif.type === "community"
                                        ? "local_fire_department"
                                        : "info"}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-0.5">
                                  <h5
                                    className={`text-sm font-bold ${!notif.read ? "text-gh-text" : "text-gh-text-secondary"}`}
                                  >
                                    {notif.title}
                                  </h5>
                                  <span className="text-[10px] text-gh-text-secondary">
                                    {notif.createdAt
                                      ? new Date(
                                        notif.createdAt,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                      : "Now"}
                                  </span>
                                </div>
                                <p className="text-xs text-gh-text-secondary leading-relaxed line-clamp-2 group-hover:text-gh-text">
                                  {notif.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          navigate("/notifications");
                        }}
                        className="w-full py-2 text-[10px] font-bold text-gh-text-secondary hover:text-white bg-gh-bg border-t border-gh-border transition-colors uppercase tracking-widest"
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications Modal */}
                <NotificationsModalView
                  isOpen={isNotificationsModalOpen}
                  onClose={() => setIsNotificationsModalOpen(false)}
                  notifications={displayNotifications}
                  onMarkAllRead={() => {
                    const updated = notifications.map((n) => ({
                      ...n,
                      read: true,
                    }));
                    setNotifications(updated);
                    // Ideally call API to mark read here
                  }}
                />

                {/* Add Menu Dropdown */}
                <div className="relative add-menu-container">
                  <button
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    className={`text-gh-text-secondary hover:text-white transition-colors ${isAddMenuOpen ? "text-white" : ""}`}
                    title="Create New..."
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      add
                    </span>
                  </button>

                  {isAddMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gh-bg-secondary border border-gh-border rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-3 py-2 border-b border-gh-border mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gh-text-secondary">
                          Create New
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/workspace/new");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gh-text hover:text-white hover:bg-gh-bg flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          laptop_mac
                        </span>
                        Workspace
                      </button>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/repositories");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gh-text hover:text-white hover:bg-gh-bg flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          folder_open
                        </span>
                        Repository
                      </button>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/marketplace/missions");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gh-text hover:text-white hover:bg-gh-bg flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          rocket_launch
                        </span>
                        Mission
                      </button>
                      <div className="h-px bg-gh-border my-1"></div>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/organizations");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gh-text hover:text-white hover:bg-gh-bg flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          domain
                        </span>
                        Organization
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative profile-dropdown-container">
                  <div
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="cursor-pointer"
                    title="Profile Settings"
                  >
                    <img
                      src={profile.avatar}
                      className={`size-6 rounded-full border transition-all ${isProfileDropdownOpen ? "border-gh-text scale-110 shadow-lg shadow-primary/20" : "border-gh-border hover:border-gh-text"}`}
                      alt="Profile"
                    />
                  </div>

                  {isProfileDropdownOpen && (
                    <UserProfileDropdown
                      profile={profile}
                      onClose={() => setIsProfileDropdownOpen(false)}
                      logout={logout}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ErrorBoundary wrapping Routes for safety */}
          <ErrorBoundary>
            {/* Suspense removed for debugging */}
            {/* <React.Suspense fallback={...}> */}
            <Routes>
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/status" element={<Status />} />
              <Route path="/security" element={<Security />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/" element={<Navigate to="/dashboard/home" />} />
              <Route path="/dashboard/home" element={<HomeView />} />
              <Route path="/onboarding/welcome" element={<WelcomeView />} />

              {/* Enterprise */}
              <Route
                path="/enterprise/:slug/*"
                element={<EnterpriseDashboard />}
              />
              <Route
                path="/enterprise/billing"
                element={<EnterpriseBilling />}
              />

              {/* Protected Routes */}
              <Route path="/accept-invite" element={<AcceptInvite />} />
              <Route path="/explore" element={<ExploreView />} />
              <Route path="/platform-matrix" element={<PlatformMatrix />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/workspaces" element={<WorkspacesView />} />
              <Route path="/community" element={<CommunityView />} />
              <Route path="/workspace/new" element={<CreateWorkspaceView />} />
              <Route path="/workspace/:id" element={<WorkspaceIDE />} />
              <Route path="/repositories" element={<RepositoriesView />} />
              <Route path="/repo/:id/*" element={<RepoDetailView />} />
              <Route
                path="/repositories/:id/discussions/:number"
                element={<DiscussionDetail />}
              />
              <Route path="/dashboard/library" element={<LibraryView />} />
              <Route
                path="/editor"
                element={<EditorView isFocusMode={isFocusMode} />}
              />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/profile/:userId" element={<PublicProfile />} />
              <Route path="/resume/:userId" element={<ResumeProfile />} />
              <Route
                path="/stars"
                element={<Navigate to="/repositories" replace />}
              />
              <Route path="/notifications" element={<NotificationsView />} />
              <Route path="/org-dashboard" element={<AdminDashboard />} />

              <Route
                path="/organizations"
                element={<OrganizationIndexView />}
              />
              <Route path="/org/:orgId" element={<OrganizationDetailView />}>
                <Route index element={<OrgOverview />} />
                <Route path="repositories" element={<OrgRepositories />} />
                <Route path="people" element={<OrgPeople />} />
                <Route path="teams" element={<OrgTeams />} />
                <Route path="settings" element={<OrgSettingsLayout />}>
                  <Route index element={<Navigate to="general" replace />} />
                  <Route path="general" element={<OrgGeneralSettings />} />
                  <Route
                    path="authentication"
                    element={<OrgAuthenticationSecurity />}
                  />
                  <Route path="environments" element={<OrgEnvironments />} />
                  <Route path="permissions" element={<OrgPermissions />} />
                  <Route path="webhooks" element={<OrgWebhooks />} />
                  <Route path="*" element={<Navigate to="general" replace />} />
                </Route>
                <Route path="*" element={<Navigate to="" replace />} />
              </Route>

              <Route path="/marketplace" element={<MarketplaceLayout />}>
                <Route index element={<Navigate to="missions" replace />} />
                <Route path="missions" element={<MissionsView />} />
                <Route path="missions/:id" element={<MissionDetailView />} />
                <Route path="trials/:id" element={<MissionDetailView />} />
                <Route path="applications" element={<MyApplicationsView />} />
                <Route path="trials" element={<TrialRepositoriesView />} />

                <Route path="hiring" element={<HiringLayout />}>
                  <Route index element={<Navigate to="discovery" replace />} />
                  <Route
                    path="discovery"
                    element={<CandidateDiscoveryView />}
                  />
                  <Route
                    path="candidate/:id"
                    element={<CandidateScorecardView />}
                  />
                  <Route path="compare" element={<CandidateComparisonView />} />
                  <Route path="offer/:id" element={<OfferEditorView />} />
                  <Route
                    path="schedule/:id"
                    element={<SessionSchedulerView />}
                  />
                  <Route
                    path="feedback/:id"
                    element={<InterviewerFeedbackView />}
                  />
                  <Route path="assessments" element={<AssessmentsView />} />
                  <Route
                    path="*"
                    element={<Navigate to="discovery" replace />}
                  />
                </Route>

                <Route path="growth" element={<GrowthLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<SkillDashboardView />} />
                  <Route
                    path="profile/:id"
                    element={<DeveloperProfileView />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="dashboard" replace />}
                  />
                </Route>

                <Route path="*" element={<Navigate to="missions" replace />} />
              </Route>
              <Route
                path="/dashboard/jobs"
                element={<Navigate to="/marketplace/missions" replace />}
              />
              <Route
                path="/jobs/:id"
                element={<Navigate to="/marketplace/missions/:id" replace />}
              />
              <Route
                path="/jobs/:id/applications"
                element={<JobApplicationsView />}
              />

              <Route path="/onboarding" element={<OnboardingLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<OnboardingWorkspace />} />
                <Route path="buddy" element={<BuddyDashboardView />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              <Route path="/finance" element={<WalletDashboard />} />

              <Route path="/welcome/:userId" element={<WelcomeView />} />
              <Route
                path="/offer/:offerId/accept"
                element={<OfferAcceptanceView />}
              />

              <Route
                path="/trials/submitted/:trialId"
                element={<TrialSubmittedView />}
              />

              <Route
                path="/workspace/:id/settings"
                element={<WorkspaceSettings />}
              />
              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="appearance" element={<AppearanceSettings />} />
                <Route
                  path="accessibility"
                  element={<AccessibilitySettings />}
                />
                <Route
                  path="notifications"
                  element={<NotificationsSettings />}
                />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="emails" element={<EmailSettings />} />
                <Route path="billing" element={<BillingSettings />} />
                <Route
                  path="forge-ai-usage"
                  element={<ForgeAIUsageSettings />}
                />
                <Route
                  path="tokens"
                  element={<PersonalAccessTokensSettings />}
                />
                <Route path="integrations" element={<IntegrationsSettings />} />
                <Route path="*" element={<Navigate to="profile" replace />} />
              </Route>

              <Route path="/forge-ai" element={<ForgeAIView />} />

              <Route
                path="/admin"
                element={
                  <RoleGuard>
                    <AdminRoomView />
                  </RoleGuard>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<UserManager />} />
                <Route path="teams" element={<TeamManager />} />
                <Route path="workspaces" element={<WorkspaceMonitor />} />
                <Route path="repositories" element={<RepositoryGovernance />} />
                <Route path="jobs" element={<JobOversight />} />
                <Route path="community" element={<CommunityModeration />} />
                <Route path="roles" element={<RoleEditor />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard/home" />} />
            </Routes>

            {!location.pathname.includes("/resume/") && (
              <div className="print:hidden">
                <Footer />
              </div>
            )}
            <CookieConsent />
            {/* </React.Suspense> */}
          </ErrorBoundary>
        </main>
      </div>
      {/* StatusBar removed */}
      <div className="print:hidden">
        {!isFocusMode && <MessagingPanel />}
        <ChatWidget /> {/* Global Real-Time Chat */}
      </div>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  // Removed artificial delay
  const [isAppLoading, setIsAppLoading] = useState(false);

  if (isLoading || isAppLoading) {
    console.log("AppContent: Showing SplashScreen");
    return <SplashScreen />;
  }

  return (
    <React.Suspense fallback={<SplashScreen />}>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/auth/callback/:provider"
              element={<OAuthCallback />}
            />
            <Route path="*" element={<RedirectToLogin />} />
          </>
        ) : (
          <Route path="/*" element={<ProtectedApp />} />
        )}
      </Routes>
    </React.Suspense>
  );
};

// This component now correctly consumes useAuth (because it's wrapped by AuthProvider in App)
// and handles the conditional rendering of RealtimeProvider.
const AppWithProviders = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  console.log("AppWithProviders Render:", {
    isAuthenticated,
    isLoading,
    userId: user?.id,
  });

  return (
    <NotificationProvider>
      {isAuthenticated && user ? (
        <RealtimeProvider userId={user.id}>
          <AppContent />
        </RealtimeProvider>
      ) : (
        <AppContent />
      )}
    </NotificationProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider>
        <AppWithProviders />
      </AuthProvider>
    </HashRouter>
  </ThemeProvider>
);

export default App;

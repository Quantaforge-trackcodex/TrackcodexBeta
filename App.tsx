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
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import { api } from "./services/api";
import { RealtimeProvider } from "./contexts/RealtimeContext";

// Auth Views
const Login = React.lazy(() => import("./views/auth/Login"));
const Signup = React.lazy(() => import("./views/auth/Signup"));
const OAuthCallback = React.lazy(() => import("./views/auth/OAuthCallback"));
const LandingPage = React.lazy(() => import("./views/LandingPage"));

// Layout Components

import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import MessagingPanel from "./components/messaging/MessagingPanel";
import SplashScreen from "./components/branding/SplashScreen";
import SettingsLayout from "./components/settings/SettingsLayout";
import CommandPalette from "./components/layout/CommandPalette";
import ChatWidget from "./components/social/ChatWidget"; // Global Chat
import RedirectToLogin from "./components/auth/RedirectToLogin";

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
const Portfolio = React.lazy(() => import("./views/Portfolio"));
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
const Leaderboard = React.lazy(() => import("./views/Leaderboard"));
const AdminRoomView = React.lazy(() => import("./views/Admin"));
const TaskVault = React.lazy(() => import("./views/TaskVault"));
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

// Strata Views
const StrataIndexView = React.lazy(
  () => import("./views/organizations/StrataIndexView"),
);
const StrataDetailView = React.lazy(
  () => import("./views/organizations/StrataDetailView"),
);
const StrataOverview = React.lazy(
  () => import("./components/organizations/StrataOverview"),
);
const StrataRepositories = React.lazy(
  () => import("./components/organizations/StrataRepositories"),
);
const StrataPeople = React.lazy(
  () => import("./components/organizations/StrataPeople"),
);
const StrataTeams = React.lazy(
  () => import("./components/organizations/StrataTeams"),
);
const StrataSettingsLayout = React.lazy(
  () => import("./components/organizations/StrataSettingsLayout"),
);
const StrataGeneralSettings = React.lazy(
  () => import("./views/organizations/settings/StrataGeneralSettings"),
);
const StrataAuthenticationSecurity = React.lazy(
  () => import("./views/organizations/settings/StrataAuthenticationSecurity"),
);
const StrataEnvironments = React.lazy(
  () => import("./views/organizations/settings/StrataEnvironments"),
);
const StrataPermissions = React.lazy(
  () => import("./views/organizations/settings/StrataPermissions"),
);
const StrataWebhooks = React.lazy(
  () => import("./views/organizations/settings/StrataWebhooks"),
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
const SessionsSettings = React.lazy(
  () => import("./views/settings/SessionsSettings"),
);
const SSHKeysSettings = React.lazy(
  () => import("./views/settings/SSHKeysSettings"),
);
const AhiCsSettings = React.lazy(
  () => import("./views/settings/AhiCsSettings"),
);
const PrivacySettings = React.lazy(
  () => import("./views/settings/PrivacySettings"),
);
const BillingUsage = React.lazy(
  () => import("./views/settings/billing/BillingUsage"),
);
const BillingAnalytics = React.lazy(
  () => import("./views/settings/billing/BillingAnalytics"),
);
const BillingBudgets = React.lazy(
  () => import("./views/settings/billing/BillingBudgets"),
);
const BillingLicensing = React.lazy(
  () => import("./views/settings/billing/BillingLicensing"),
);
const BillingPaymentInfo = React.lazy(
  () => import("./views/settings/billing/BillingPaymentInfo"),
);
const BillingPaymentHistory = React.lazy(
  () => import("./views/settings/billing/BillingPaymentHistory"),
);
const BillingAdditional = React.lazy(
  () => import("./views/settings/billing/BillingAdditional"),
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
  skipToast?: boolean; // New flag to suppress popup
}

const ProtectedApp = ({ isFocusMode }: { isFocusMode: boolean }) => {
  const [notification, setNotification] = useState<NotificationItem | null>(
    null,
  );
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
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(
    profileService.getProfile(),
  );

  useEffect(() => {
    return profileService.subscribe(setProfile);
  }, []);

  const isStandalone =
    window.location.hostname.startsWith("workspace.") ||
    new URLSearchParams(window.location.search).get("standalone") === "true";

  const isIdeView = ["/editor", "/workspace/", "/trials/live-session"].some(
    (path) => location.pathname.includes(path),
  ) || isStandalone;

  // Global Key Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl+N or Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault(); // Prevent browser new window
        logActivity("save", { context: location.pathname });
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

      // Open Workspace in New Window: Ctrl+Space or Cmd+Space
      if ((e.ctrlKey || e.metaKey) && e.key === " ") {
        e.preventDefault(); // Prevent page scroll
        e.stopPropagation(); // Stop event from bubbling

        // Open workspace in a new window with standalone mode
        let workspaceUrl;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          // Localhost: use query param to trigger standalone mode
          workspaceUrl = `${window.location.origin}/?standalone=true#/workspaces`;
        } else {
          // Production: use subdomain
          workspaceUrl = `https://workspace.trackcodex.com`;
        }

        window.open(workspaceUrl, '_blank', 'width=1200,height=800');
        setNotification({
          id: `workspace-notif-${Date.now()}`,
          type: "info" as const,
          title: "Workspace Opened",
          message: "Workspace opened in a new window.",
          createdAt: new Date().toISOString(),
          read: false,
          hasActions: false,
        });
        return false; // Additional prevention
      }

      // Command Palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault(); // Prevent browser search focus
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener("keydown", handleKeyDown, true);
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
  }, [isAddMenuOpen, isNotificationsOpen, isProfileDropdownOpen]);

  // Use notification context
  const { notifications, markAllAsRead } = useNotifications();
  const { logout } = useAuth(); // Restore logout for UserProfileDropdown

  // Listen for Real-Time Notification Events (Toast only)
  useEffect(() => {
    const handleRealTimeNotif = (event: Event) => {
      const e = event as CustomEvent<NotificationItem>;
      const newNotif = e.detail;

      // Context handles list update, we only handle toast here
      // Only show toast if not skipped
      if (!newNotif.skipToast) {
        setNotification({
          ...newNotif,
          id: newNotif.id || `toast-${Date.now()}`,
          hasActions: false,
        });
      }
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

  // Use the fetched notifications from Context
  // We explicitly cast to any to avoid type mismatches with legacy NotificationItem during refactor
  // or we just trust the shape is compatible enough for the UI
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayNotifications: any[] =
    notifications.length > 0
      ? notifications
      : [
        {
          id: "mock1",
          type: "system",
          title: "Welcome",
          message: "No new notifications yet.",
          timestamp: new Date().toISOString(), // Changed from createdAt
          read: true,
        },
      ];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-gh-text font-display bg-gh-bg transition-colors duration-300">
      {notification && (
        <div className="fixed top-12 right-12 z-[500] bg-gh-bg-secondary border border-gh-border/30 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col gap-6 max-w-sm ring-2 ring-black/50 ring-inset">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <span className="material-symbols-outlined !text-[20px]">
                {notification.type === "job" ? "work" : "notifications"}
              </span>
            </div>
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
        {!isFocusMode && <Sidebar />}

        <main
          ref={mainScrollRef}
          className={`flex-1 min-w-0 flex flex-col bg-gh-bg relative ${isIdeView || isFocusMode ? "overflow-hidden" : "overflow-y-auto custom-scrollbar"}`}
        >
          {/* Global Search Header */}
          {!isIdeView && !isFocusMode && (
            <div className="h-14 border-b border-gh-border grid grid-cols-[1fr_auto_1fr] items-center px-6 bg-gh-bg shrink-0 sticky top-0 z-40">
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
              </div>

              <div
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gh-bg-secondary border border-gh-border rounded-md w-[400px] cursor-pointer hover:border-gh-text-secondary transition-colors group shadow-sm"
              >
                <span className="material-symbols-outlined !text-[16px] text-gh-text-secondary group-hover:text-gh-text">
                  search
                </span>
                <span className="text-sm text-gh-text-secondary group-hover:text-gh-text flex-1">
                  Type <kbd className="border border-gh-border rounded px-1 text-[10px] bg-gh-bg">/</kbd> to search
                </span>
              </div>

              <div className="flex items-center justify-end gap-4">
                {/* Notifications Bell */}
                <div className="relative notifications-container">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="text-gh-text-secondary hover:text-white transition-colors relative h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      notifications
                    </span>
                    {displayNotifications.some((n) => !n.read) && (
                      <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full ring-2 ring-gh-bg-secondary" />
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-gh-bg-secondary border border-gh-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gh-border bg-gh-bg flex justify-between items-center">
                        <span className="text-xs font-bold text-gh-text">
                          Notifications
                        </span>
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-primary hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {displayNotifications.map((notif: any) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 border-b border-gh-border/50 hover:bg-gh-bg transition-colors cursor-pointer ${!notif.read ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="size-8 rounded-lg bg-gh-bg flex items-center justify-center text-gh-text-secondary border border-gh-border/50">
                                <span className="material-symbols-outlined !text-[16px]">
                                  {notif.type === "job" ? "work" : "info"}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start mb-0.5">
                                  <h5 className="text-sm font-bold text-gh-text truncate">
                                    {notif.title}
                                  </h5>
                                  <span className="text-[10px] text-gh-text-secondary whitespace-nowrap ml-2">
                                    Now
                                  </span>
                                </div>
                                <p className="text-xs text-gh-text-secondary line-clamp-2">
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
                        className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-gh-text-secondary hover:text-white bg-gh-bg border-t border-gh-border transition-colors"
                      >
                        View All
                      </button>
                    </div>
                  )}
                </div>

                {/* Add Menu */}
                <div className="relative add-menu-container">
                  <button
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    className="text-gh-text-secondary hover:text-white transition-colors h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      add_circle
                    </span>
                  </button>
                  {isAddMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-gh-bg-secondary border border-gh-border rounded-xl shadow-2xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
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
                        className="w-full text-left px-4 py-2.5 text-sm text-gh-text hover:text-white hover:bg-gh-bg flex items-center gap-2"
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
                        className="w-full text-left px-4 py-2.5 text-sm text-gh-text hover:text-white hover:bg-gh-bg flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          folder_open
                        </span>
                        Repository
                      </button>
                      <button
                        onClick={() => {
                          setIsAddMenuOpen(false);
                          navigate("/strata");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gh-text hover:text-white hover:bg-gh-bg flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined !text-[16px]">
                          corporate_fare
                        </span>
                        Strata
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown-container">
                  <div
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="cursor-pointer"
                  >
                    <img
                      src={profile.avatar}
                      className="size-6 rounded-full border border-gh-border hover:border-gh-text transition-colors"
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

          <ErrorBoundary>
            <Routes>
              <Route path="/taskvault" element={<TaskVault />} />
              <Route path="/" element={<Navigate to="/dashboard/home" />} />
              <Route path="/dashboard/home" element={<HomeView />} />
              <Route path="/onboarding/welcome" element={<WelcomeView />} />
              <Route
                path="/network/:slug"
                element={<EnterpriseDashboard />}
              />
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
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route
                path="/stars"
                element={<Navigate to="/repositories" replace />}
              />

              <Route path="/notifications" element={<NotificationsView />} />

              <Route path="/strata-dashboard" element={<AdminDashboard />} />

              <Route path="/strata" element={<StrataIndexView />} />
              <Route path="/strata/:orgId" element={<StrataDetailView />}>
                <Route index element={<StrataOverview />} />
                <Route path="repositories" element={<StrataRepositories />} />
                <Route path="people" element={<StrataPeople />} />
                <Route path="teams" element={<StrataTeams />} />
                <Route path="settings" element={<StrataSettingsLayout />}>
                  <Route index element={<Navigate to="general" replace />} />
                  <Route path="general" element={<StrataGeneralSettings />} />
                  <Route
                    path="authentication"
                    element={<StrataAuthenticationSecurity />}
                  />
                  <Route path="environments" element={<StrataEnvironments />} />
                  <Route path="permissions" element={<StrataPermissions />} />
                  <Route path="webhooks" element={<StrataWebhooks />} />
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
                <Route path="sessions" element={<SessionsSettings />} />
                <Route path="ssh-keys" element={<SSHKeysSettings />} />
                <Route path="ahi-cs" element={<AhiCsSettings />} />
                <Route path="privacy" element={<PrivacySettings />} />
                <Route path="billing/usage" element={<BillingUsage />} />
                <Route path="billing/analytics" element={<BillingAnalytics />} />
                <Route path="billing/budgets" element={<BillingBudgets />} />
                <Route path="billing/licensing" element={<BillingLicensing />} />
                <Route path="billing/payment-info" element={<BillingPaymentInfo />} />
                <Route path="billing/payment-history" element={<BillingPaymentHistory />} />
                <Route path="billing/additional" element={<BillingAdditional />} />
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
          </ErrorBoundary>
        </main>
      </div>
      {!isFocusMode && <MessagingPanel />}
      <ChatWidget />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAppLoading] = useState(false);

  if (isLoading || isAppLoading) {
    return <SplashScreen />;
  }

  return (
    <React.Suspense fallback={<SplashScreen />}>
      <div className="flex flex-col h-screen overflow-hidden">
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          <Routes>
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/status" element={<Status />} />
            <Route path="/security" element={<Security />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/auth/callback/:provider"
                  element={<OAuthCallback />}
                />
                <Route path="/" element={<LandingPage />} />
                <Route path="*" element={<RedirectToLogin />} />
              </>
            ) : (
              <Route path="/*" element={<ProtectedApp isFocusMode={false} />} />
            )}
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </React.Suspense>
  );
};

const AppWithProviders = () => {
  const { user, isAuthenticated } = useAuth();

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

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Views
import Login from './views/auth/Login';
import Signup from './views/auth/Signup';

// Layout Components
import StatusBar from './components/layout/StatusBar';
import Sidebar from './components/layout/Sidebar';
import MessagingPanel from './components/messaging/MessagingPanel';
import SplashScreen from './components/branding/SplashScreen';
import SettingsLayout from './components/settings/SettingsLayout';

// Core Views
import RepositoriesView from './views/Repositories';
import RepoDetailView from './views/RepoDetail';
import EditorView from './views/Editor';
import ProfileView from './views/Profile';
import Overview from './views/Overview';
import WorkspacesView from './views/Workspaces';
import CreateWorkspaceView from './views/CreateWorkspace';
import WorkspaceDetailView from './views/WorkspaceDetailView';
import HomeView from './views/Home';
import LibraryView from './views/Library';
import ForgeAIView from './views/ForgeAI';
import LiveSessions from './views/LiveSessions';
import AdminRoomView from './views/Admin';
import PlatformMatrix from './views/PlatformMatrix';
import ActivityView from './views/ActivityView';
import RoleGuard from './auth/RoleGuard';
import CommunityView from './views/Community';

// Organization Views
import OrganizationIndexView from './views/organizations/OrganizationIndexView';
import OrganizationDetailView from './views/organizations/OrganizationDetailView';
import OrgOverview from './components/organizations/OrgOverview';
import OrgRepositories from './components/organizations/OrgRepositories';
import OrgPeople from './components/organizations/OrgPeople';
import OrgTeams from './components/organizations/OrgTeams';
import OrgSettingsLayout from './components/organizations/OrgSettingsLayout';
import OrgGeneralSettings from './views/organizations/settings/OrgGeneralSettings';
import OrgAuthenticationSecurity from './views/organizations/settings/OrgAuthenticationSecurity';
import OrgEnvironments from './views/organizations/settings/OrgEnvironments';
import OrgPermissions from './views/organizations/settings/OrgPermissions';
import OrgWebhooks from './views/organizations/settings/OrgWebhooks';

// Settings Sub-views
import AppearanceSettings from './views/settings/AppearanceSettings';
import EmailSettings from './views/settings/EmailSettings';
import SecuritySettings from './views/settings/SecuritySettings';
import AccountSettings from './views/settings/AccountSettings';
import ProfileSettings from './views/settings/ProfileSettings';
import BillingSettings from './views/settings/BillingSettings';
import ForgeAIUsageSettings from './views/settings/ForgeAIUsageSettings';
import AccessibilitySettings from './views/settings/AccessibilitySettings';
import NotificationsSettings from './views/settings/NotificationsSettings';
import PersonalAccessTokensSettings from './views/settings/PersonalAccessTokensSettings';

// --- NEW HIRING & GROWTH VIEWS ---
import MarketplaceLayout from './views/marketplace/MarketplaceLayout';
import OnboardingLayout from './views/onboarding/OnboardingLayout';
import WelcomeView from './views/onboarding/WelcomeView';
import OfferAcceptanceView from './views/trials/OfferAcceptanceView';
import LivePairingLobbyView from './views/trials/LivePairingLobbyView';
import TrialSubmittedView from './views/trials/TrialSubmittedView';

// --- Marketplace Sub-views ---
import MissionsView from './views/marketplace/MissionsView';
import MissionDetailView from './views/marketplace/MissionDetailView';
import TrialRepositoriesView from './views/marketplace/TrialRepositoriesView';

// --- Hiring Sub-views ---
import HiringLayout from './views/hiring/HiringLayout';
import CandidateDiscoveryView from './views/hiring/CandidateDiscoveryView';
import CandidateScorecardView from './views/hiring/CandidateScorecardView';
import CandidateComparisonView from './views/hiring/CandidateComparisonView';
import OfferEditorView from './views/hiring/OfferEditorView';
import SessionSchedulerView from './views/hiring/SessionSchedulerView';
import InterviewerFeedbackView from './views/hiring/InterviewerFeedbackView';
import AssessmentsView from './views/hiring/AssessmentsView';

// --- Growth Sub-views ---
import GrowthLayout from './views/growth/GrowthLayout';
import SkillDashboardView from './views/growth/SkillDashboardView';
import DeveloperProfileView from './views/growth/DeveloperProfileView';

// --- Onboarding Sub-views ---
import OnboardingWorkspace from './views/onboarding/OnboardingWorkspace';
import BuddyDashboardView from './views/onboarding/BuddyDashboardView';

// --- Admin Sub-views ---
import AdminOverview from './components/admin/AdminOverview';
import UserManager from './components/admin/UserManager';
import TeamManager from './components/admin/TeamManager';
import WorkspaceMonitor from './components/admin/WorkspaceMonitor';
import RepositoryGovernance from './components/admin/RepositoryGovernance';
import JobOversight from './components/admin/JobOversight';
import CommunityModeration from './components/admin/CommunityModeration';
import RoleEditor from './components/admin/RoleEditor';
import AuditLogs from './components/admin/AuditLogs';


const ProtectedApp = () => {
  const [notification, setNotification] = useState<any>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    const handleNotify = (e: any) => {
      setNotification(e.detail);
      if (!e.detail.hasActions) {
        setTimeout(() => setNotification(null), 5000);
      }
    };
    window.addEventListener('trackcodex-notification', handleNotify);
    return () => window.removeEventListener('trackcodex-notification', handleNotify);
  }, []);

  const handleAction = (action: 'accept' | 'reject') => {
    setNotification(null);
  };

  const isIdeView = ['/editor', '/workspace/', '/trials/live-session'].some(path => location.pathname.includes(path));

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden text-slate-300 font-display bg-[#0d0d0f] transition-colors duration-300">
      
      {notification && (
         <div className="fixed top-12 right-12 z-[500] bg-[#161b22] border border-primary/30 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col gap-6 max-w-sm ring-2 ring-black/50 ring-inset">
           <div className="flex items-start gap-4">
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${notification.type === 'mission' ? 'bg-amber-500/10 text-amber-500' : notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined !text-3xl filled">{notification.type === 'mission' ? 'work' : 'verified'}</span>
              </div>
              <div className="min-w-0">
                  <h4 className="text-[15px] font-black text-white uppercase tracking-tight truncate">{notification.title}</h4>
                  <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="text-gh-text-secondary hover:text-white shrink-0 mt-1">
                  <span className="material-symbols-outlined !text-[20px]">close</span>
              </button>
           </div>
           {notification.hasActions && (
             <div className="flex items-center gap-3"><button onClick={() => handleAction('accept')} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">Accept</button><button onClick={() => handleAction('reject')} className="flex-1 py-2.5 bg-[#0d1117] border border-[#30363d] text-slate-400 rounded-xl text-[11px] font-black uppercase tracking-widest">Reject</button></div>
           )}
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {!isFocusMode && <Sidebar />}
        
        <main 
          ref={mainScrollRef}
          className={`flex-1 min-w-0 flex flex-col bg-gh-bg relative ${isIdeView || isFocusMode ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/home" />} />
            <Route path="/dashboard/home" element={<HomeView />} />
            <Route path="/platform-matrix" element={<PlatformMatrix />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/workspaces" element={<WorkspacesView />} />
            <Route path="/community" element={<CommunityView />} />
            <Route path="/workspace/new" element={<CreateWorkspaceView />} />
            <Route path="/workspace/:id" element={<WorkspaceDetailView />} />
            <Route path="/repositories" element={<RepositoriesView />} />
            <Route path="/repo/:id" element={<RepoDetailView />} />
            <Route path="/dashboard/library" element={<LibraryView />} />
            <Route path="/editor" element={<EditorView isFocusMode={isFocusMode} />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/activity" element={<ActivityView />} />
            
            <Route path="/organizations" element={<OrganizationIndexView />} />
            <Route path="/org/:orgId" element={<OrganizationDetailView />}>
                <Route index element={<OrgOverview />} />
                <Route path="repositories" element={<OrgRepositories />} />
                <Route path="people" element={<OrgPeople />} />
                <Route path="teams" element={<OrgTeams />} />
                <Route path="settings" element={<OrgSettingsLayout />}>
                    <Route index element={<Navigate to="general" replace />} />
                    <Route path="general" element={<OrgGeneralSettings />} />
                    <Route path="authentication" element={<OrgAuthenticationSecurity />} />
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
                <Route path="trials" element={<TrialRepositoriesView />} />
                
                <Route path="hiring" element={<HiringLayout />}>
                    <Route index element={<Navigate to="discovery" replace />} />
                    <Route path="discovery" element={<CandidateDiscoveryView />} />
                    <Route path="candidate/:id" element={<CandidateScorecardView />} />
                    <Route path="compare" element={<CandidateComparisonView />} />
                    <Route path="offer/:id" element={<OfferEditorView />} />
                    <Route path="schedule/:id" element={<SessionSchedulerView />} />
                    <Route path="feedback/:id" element={<InterviewerFeedbackView />} />
                    <Route path="assessments" element={<AssessmentsView />} />
                    <Route path="*" element={<Navigate to="discovery" replace />} />
                </Route>

                <Route path="growth" element={<GrowthLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<SkillDashboardView />} />
                    <Route path="profile/:id" element={<DeveloperProfileView />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Route>

                <Route path="*" element={<Navigate to="missions" replace />} />
            </Route>
            <Route path="/dashboard/jobs" element={<Navigate to="/marketplace/missions" replace />} />
            <Route path="/jobs/:id" element={<Navigate to="/marketplace/missions/:id" replace />} />
            
            <Route path="/onboarding" element={<OnboardingLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<OnboardingWorkspace />} />
                <Route path="buddy" element={<BuddyDashboardView />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route path="/welcome/:userId" element={<WelcomeView />} />
            <Route path="/offer/:offerId/accept" element={<OfferAcceptanceView />} />
            <Route path="/trials/lobby/:sessionId" element={<LivePairingLobbyView />} />
            <Route path="/trials/submitted/:trialId" element={<TrialSubmittedView />} />

            <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="appearance" element={<AppearanceSettings />} />
                <Route path="accessibility" element={<AccessibilitySettings />} />
                <Route path="notifications" element={<NotificationsSettings />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="emails" element={<EmailSettings />} />
                <Route path="billing" element={<BillingSettings />} />
                <Route path="forge-ai-usage" element={<ForgeAIUsageSettings />} />
                <Route path="tokens" element={<PersonalAccessTokensSettings />} />
                <Route path="*" element={<Navigate to="profile" replace />} />
            </Route>

            <Route path="/forge-ai" element={<ForgeAIView />} />
            <Route path="/live-sessions" element={<LiveSessions />} />

            <Route path="/admin" element={<RoleGuard><AdminRoomView /></RoleGuard>}>
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
        </main>
      </div>

      {!isFocusMode && <StatusBar />}
      {!isFocusMode && <MessagingPanel />}
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isAppLoading) {
    return <SplashScreen />;
  }
  
  return (
     <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/*" element={<ProtectedApp />} />
      )}
    </Routes>
  );
};

// This new component ensures that AuthProvider and AppContent are rendered *inside* the router's context,
// preventing the `useNavigate` hook in AuthProvider from being called before the context is available.
const AppWithProviders = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <AppWithProviders />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;

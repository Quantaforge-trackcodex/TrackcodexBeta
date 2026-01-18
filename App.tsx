import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Views
import Login from './views/auth/Login';
import Signup from './views/auth/Signup';

// VS Code Layout Components
import StatusBar from './components/layout/StatusBar';
import Sidebar from './components/layout/Sidebar';
import MessagingPanel from './components/messaging/MessagingPanel';
import SplashScreen from './components/branding/SplashScreen';
import SettingsLayout from './components/settings/SettingsLayout';

// Views
import RepositoriesView from './views/Repositories';
import RepoDetailView from './views/RepoDetail';
import EditorView from './views/Editor';
import ProfileView from './views/Profile';
import Overview from './views/Overview';
import WorkspacesView from './views/Workspaces';
import CreateWorkspaceView from './views/CreateWorkspace';
import WorkspaceDetailView from './views/WorkspaceDetail';
import HomeView from './views/Home';
import LibraryView from './views/Library';
import ForgeAIView from './views/ForgeAI';
import LiveSessions from './views/LiveSessions';
import JobsView from './views/Jobs';
import JobDetailView from './views/JobDetailView';
import CommunityView from './views/Community';
import AdminRoomView from './views/Admin';
import PlatformMatrix from './views/PlatformMatrix';
import ActivityView from './views/ActivityView';
import RoleGuard from './auth/RoleGuard';

// New Organization Views
import OrganizationIndexView from './views/organizations/OrganizationIndexView';
import OrganizationDetailView from './views/organizations/OrganizationDetailView';

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

const ProtectedApp = () => {
  const [notification, setNotification] = useState<any>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Reset scroll on navigation
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Global notification handler
  useEffect(() => {
    const handleNotify = (e: any) => {
      setNotification(e.detail);
      if (!e.detail.hasActions) {
        setTimeout(() => setNotification(null), 5000);
      }
    };

    window.addEventListener('trackcodex-notification', handleNotify);
    
    return () => {
      window.removeEventListener('trackcodex-notification', handleNotify);
    };
  }, []);

  // Focus Mode keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsFocusMode(prev => {
          const nextState = !prev;
          window.dispatchEvent(new CustomEvent('trackcodex-notification', {
            detail: {
              title: nextState ? 'Focus Mode Enabled' : 'Focus Mode Disabled',
              message: nextState ? 'All UI is hidden. Press Ctrl+K or Esc to exit.' : 'Editor UI restored.',
              type: 'info'
            }
          }));
          return nextState;
        });
      }
      if (e.key === 'Escape' && isFocusMode) {
        e.preventDefault();
        setIsFocusMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);


  const handleAction = (action: 'accept' | 'reject') => {
    const title = action === 'accept' ? 'Offer Accepted' : 'Offer Declined';
    const message = action === 'accept' ? 'The mission has been added to your dashboard.' : 'The mission was removed from your queue.';
    
    setNotification({
      title,
      message,
      type: action === 'accept' ? 'success' : 'info',
      hasActions: false
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const isIdeView = ['/editor', '/workspace/'].some(path => location.pathname.includes(path));

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
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleAction('accept')}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleAction('reject')}
                  className="flex-1 py-2.5 bg-[#0d1117] border border-[#30363d] hover:border-rose-500/50 text-slate-400 hover:text-rose-400 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                >
                  Reject
                </button>
             </div>
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
            <Route path="/dashboard/jobs" element={<JobsView />} />
            <Route path="/jobs/:id" element={<JobDetailView />} />
            <Route path="/editor" element={<EditorView isFocusMode={isFocusMode} />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/activity" element={<ActivityView />} />
            
            <Route path="/organizations" element={<OrganizationIndexView />} />
            <Route path="/org/:orgId/*" element={<OrganizationDetailView />} />

            <Route path="/settings/*" element={
              <SettingsLayout>
                <Routes>
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
                </Routes>
              </SettingsLayout>
            } />

            <Route path="/forge-ai" element={<ForgeAIView />} />
            <Route path="/live-sessions" element={<LiveSessions />} />
            <Route 
              path="/admin/*" 
              element={
                <RoleGuard>
                  <AdminRoomView />
                </RoleGuard>
              } 
            />
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

const App = () => (
  <ThemeProvider>
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  </ThemeProvider>
);

export default App;
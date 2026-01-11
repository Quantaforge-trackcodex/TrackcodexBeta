
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { profileService, UserProfile } from './services/profile';
import { isAdmin } from './auth/AccessMatrix';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import MessagingPanel from './components/messaging/MessagingPanel';

// Views
import RepositoriesView from './views/Repositories';
import RepoDetailView from './views/RepoDetail';
import EditorView from './views/Editor';
import SettingsView from './views/Settings';
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
import RoleGuard from './auth/RoleGuard';

const TopNav = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());

  useEffect(() => {
    return profileService.subscribe((updated) => setProfile(updated));
  }, []);

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 z-20 shrink-0 bg-[#0d1117] border-[#1e293b]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard/home')}>
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined !text-[20px] filled">hub</span>
          </div>
          <span className="font-black text-lg tracking-tighter text-white">TrackCodex</span>
        </div>

        <div className="relative group ml-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
            <span className="material-symbols-outlined !text-[18px]">search</span>
          </div>
          <input 
            className="w-80 border rounded-lg text-[13px] py-1.5 pl-10 pr-8 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all bg-[#161b22] border-[#30363d] text-white" 
            placeholder="Type / to search workspace..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-slate-400 hover:text-primary relative transition-colors">
          <span className="material-symbols-outlined !text-[24px]">notifications</span>
          <span className="absolute top-0 right-0 size-2 bg-blue-500 rounded-full border-2 border-[#0d1117]"></span>
        </button>
        <button className="text-slate-400 hover:text-primary transition-colors" onClick={() => navigate('/profile')}>
          <img src={profile.avatar} className="size-8 rounded-full border border-border-dark object-cover" alt="Profile" />
        </button>
      </div>
    </header>
  );
};

const App = () => {
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);

  useEffect(() => {
    const handleNotify = (e: any) => {
      setNotification(e.detail);
      setTimeout(() => setNotification(null), 5000);
    };
    window.addEventListener('trackcodex-notification', handleNotify);
    return () => window.removeEventListener('trackcodex-notification', handleNotify);
  }, []);

  return (
    <HashRouter>
      <div className="flex h-screen w-full overflow-hidden text-slate-900 font-display">
        
        {/* Global Toast */}
        {notification && (
          <div className="fixed top-20 right-8 z-[300] bg-[#161b22] border border-amber-500/30 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-right duration-300 flex items-start gap-4 max-w-sm ring-1 ring-white/10">
             <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
               <span className="material-symbols-outlined filled">verified</span>
             </div>
             <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{notification.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
             </div>
             <button onClick={() => setNotification(null)} className="text-slate-600 hover:text-white">
                <span className="material-symbols-outlined !text-[18px]">close</span>
             </button>
          </div>
        )}

        <Routes>
          <Route path="/editor" element={null} />
          <Route path="*" element={<Sidebar />} />
        </Routes>
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Routes>
             <Route path="/editor" element={null} />
             <Route path="*" element={<TopNav />} />
          </Routes>
          <main className="flex-1 overflow-hidden flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/home" />} />
              <Route path="/dashboard/home" element={<HomeView />} />
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
              <Route path="/editor" element={<EditorView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/settings" element={<SettingsView />} />
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
              <Route path="*" element={<HomeView />} />
            </Routes>
          </main>
        </div>
        
        {/* Global DM Overlay */}
        <MessagingPanel />
      </div>
    </HashRouter>
  );
};

export default App;

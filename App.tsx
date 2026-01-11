
import React from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';

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

const SidebarItem = ({ to, icon, label, badgeCount }: { to: string; icon: string; label: string; badgeCount?: number }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
        isActive
          ? 'bg-[#1e293b] text-white font-medium'
          : 'text-slate-400 hover:bg-[#1e293b]/50 hover:text-slate-100'
      }`
    }
  >
    <span className="material-symbols-outlined text-[20px] shrink-0">{icon}</span>
    <span className="text-[13px] font-medium flex-1">{label}</span>
    {badgeCount && (
      <span className="bg-[#2d333b] text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
        {badgeCount}
      </span>
    )}
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="w-[260px] flex-shrink-0 border-r border-[#1e293b] bg-[#0d1117] h-full flex flex-col p-4 font-display">
      <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined !text-[20px]">hub</span>
        </div>
        <div className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Acme Corp</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enterprise Plan</span>
          </div>
          <span className="material-symbols-outlined text-slate-500 text-sm group-hover:text-white">expand_more</span>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Platform</p>
          <nav className="space-y-1">
            <SidebarItem to="/dashboard/home" icon="home" label="Home" />
            <SidebarItem to="/overview" icon="dashboard" label="Overview" />
            <SidebarItem to="/workspaces" icon="view_quilt" label="Workspaces" />
            <SidebarItem to="/repositories" icon="account_tree" label="Repositories" />
            <SidebarItem to="/dashboard/library" icon="local_library" label="Library" />
            <SidebarItem to="/issues" icon="error" label="Issues" badgeCount={12} />
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Tools</p>
          <nav className="space-y-1">
            <SidebarItem to="/forge-ai" icon="insights" label="Insights" />
            <SidebarItem to="/settings" icon="settings" label="Settings" />
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <div className="bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a] rounded-xl p-4 relative overflow-hidden group cursor-pointer shadow-xl border border-white/5">
           <div className="absolute -top-4 -right-4 size-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
           <div className="flex items-start gap-2 mb-4 relative z-10">
              <span className="material-symbols-outlined text-white filled text-xl animate-pulse">auto_awesome</span>
              <div>
                 <p className="text-xs font-black text-white">Upgrade to Pro</p>
                 <p className="text-[10px] text-blue-100 mt-1 leading-tight">Get advanced AI health checks and unlimited history.</p>
              </div>
           </div>
           <button className="w-full py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[11px] font-bold text-white transition-all backdrop-blur-sm relative z-10">
              View Plans
           </button>
        </div>
      </div>
    </aside>
  );
};

const TopNav = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 z-20 shrink-0 bg-[#0d1117] border-[#1e293b]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/repositories')}>
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined !text-[20px] text-white">hub</span>
          </div>
          <span className="text-[16px] font-bold tracking-tight text-white">TrackCodex</span>
          <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] text-slate-500 font-bold bg-[#161b22] ml-2">Dashboard</span>
        </div>

        <div className="relative group ml-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
            <span className="material-symbols-outlined !text-[18px]">search</span>
          </div>
          <input 
            className="w-80 border rounded-lg text-[13px] py-1.5 pl-10 pr-8 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 transition-all bg-[#161b22] border-[#30363d] text-white" 
            placeholder="Type / to search" 
            type="text"
          />
          <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
            <span className="px-1.5 py-0.5 rounded border text-[10px] text-slate-400 font-mono bg-[#21262d] border-[#30363d]">/</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 ml-4 text-slate-300">
          <a href="#" className="text-[13px] hover:text-primary transition-colors">Pulls</a>
          <a href="#" className="text-[13px] hover:text-primary transition-colors">Issues</a>
          <a href="#" className="text-[13px] hover:text-primary transition-colors">Codespaces</a>
          <a href="#" className="text-[13px] hover:text-primary transition-colors">Marketplace</a>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-slate-400 hover:text-primary relative transition-colors">
          <span className="material-symbols-outlined !text-[24px]">notifications</span>
          <span className="absolute top-0 right-0 size-2 bg-blue-500 rounded-full border-2 border-[#0d1117]"></span>
        </button>
        <button className="text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined !text-[24px]">add</span>
        </button>
        <div 
          onClick={() => navigate('/profile')}
          className="size-8 rounded-full bg-cover bg-center border-2 border-[#30363d] cursor-pointer hover:border-primary transition-all overflow-hidden" 
        >
          <img src="https://picsum.photos/seed/alexprofile/64" alt="Avatar" className="w-full h-full" />
        </div>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <HashRouter>
      <div className="flex h-screen w-full overflow-hidden text-slate-900 font-display">
        <Routes>
          <Route path="/profile" element={null} />
          <Route path="*" element={<Sidebar />} />
        </Routes>
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-hidden flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/home" />} />
              <Route path="/dashboard/home" element={<HomeView />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/workspaces" element={<WorkspacesView />} />
              <Route path="/workspace/new" element={<CreateWorkspaceView />} />
              <Route path="/workspace/:id" element={<WorkspaceDetailView />} />
              <Route path="/repositories" element={<RepositoriesView />} />
              <Route path="/repo/:id" element={<RepoDetailView />} />
              <Route path="/dashboard/library" element={<LibraryView />} />
              <Route path="/editor" element={<EditorView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<HomeView />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;

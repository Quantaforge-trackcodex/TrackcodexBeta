
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, UserProfile } from '../../services/profile';
import { isAdmin } from '../../auth/AccessMatrix';
import { useSidebarState } from '../../hooks/useSidebarState';
import SidebarItem from './SidebarItem';
import SidebarToggle from './SidebarToggle';
import SidebarSection from './SidebarSection';

const Sidebar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());
  const { isExpanded, toggleSidebar } = useSidebarState();

  useEffect(() => {
    return profileService.subscribe((updated) => setProfile(updated));
  }, []);

  return (
    <aside 
      className={`flex-shrink-0 border-r border-[#1e293b] bg-[#0d1117] h-full flex flex-col transition-all duration-250 ease-in-out font-display ${
        isExpanded ? 'w-[260px] p-4' : 'w-[72px] py-4'
      }`}
    >
      {/* Header / Logo */}
      <div className={`flex items-center gap-3 mb-8 cursor-pointer ${isExpanded ? 'px-2' : 'justify-center'}`} onClick={() => navigate('/dashboard/home')}>
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
          <span className="material-symbols-outlined !text-[20px] filled">hub</span>
        </div>
        
        {isExpanded && (
          <>
            <span className="font-black text-lg tracking-tighter text-white animate-in fade-in duration-200">TrackCodex</span>
            <div className="ml-auto">
               <SidebarToggle isExpanded={isExpanded} onToggle={toggleSidebar} />
            </div>
          </>
        )}
      </div>

      {!isExpanded && (
        <div className="flex justify-center mb-6">
           <SidebarToggle isExpanded={isExpanded} onToggle={toggleSidebar} />
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        <SidebarSection title="Platform" isExpanded={isExpanded}>
          <SidebarItem to="/dashboard/home" icon="home" label="Home" isExpanded={isExpanded} />
          <SidebarItem to="/overview" icon="dashboard" label="Overview" isExpanded={isExpanded} />
          <SidebarItem to="/workspaces" icon="view_quilt" label="Workspaces" isExpanded={isExpanded} />
          <SidebarItem to="/community" icon="diversity_3" label="Community" isExpanded={isExpanded} />
          <SidebarItem to="/repositories" icon="account_tree" label="Repositories" isExpanded={isExpanded} />
          <SidebarItem to="/dashboard/library" icon="local_library" label="Library" isExpanded={isExpanded} />
          <SidebarItem to="/dashboard/jobs" icon="work" label="Jobs" isExpanded={isExpanded} />
          <SidebarItem to="/issues" icon="error" label="Issues" badgeCount={12} isExpanded={isExpanded} />
        </SidebarSection>

        <SidebarSection title="Tools" isExpanded={isExpanded}>
          <SidebarItem to="/forge-ai" icon="insights" label="Insights" isExpanded={isExpanded} />
          <SidebarItem to="/live-sessions" icon="diversity_3" label="Live Sessions" isExpanded={isExpanded} />
          <SidebarItem to="/settings" icon="settings" label="Settings" isExpanded={isExpanded} />
          {isAdmin(profile.systemRole) && (
            <SidebarItem to="/admin" icon="admin_panel_settings" label="Admin Room" isExpanded={isExpanded} />
          )}
        </SidebarSection>
      </div>

      {/* Footer / Profile */}
      <div className={`mt-auto pt-6 border-t border-border-dark ${!isExpanded ? 'flex flex-col items-center' : ''}`}>
        <div 
          onClick={() => navigate('/profile')}
          className={`flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-all ${
            isExpanded ? 'w-full' : 'w-12 justify-center'
          }`}
          title={!isExpanded ? profile.name : undefined}
        >
          <img src={profile.avatar} className="size-9 rounded-full border border-border-dark object-cover shrink-0" />
          
          {isExpanded && (
            <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
              <span className="text-[12px] font-bold text-white truncate">{profile.name}</span>
              <span className="text-[10px] text-slate-500 font-medium">{profile.role}</span>
            </div>
          )}
          
          {isExpanded && <span className="material-symbols-outlined text-slate-500 ml-auto">settings</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

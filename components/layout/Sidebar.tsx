
import React, { useEffect, useState } from 'react';
import { useSidebarState } from '../../hooks/useSidebarState';
import { profileService, UserProfile } from '../../services/profile';
import SidebarItem from './SidebarItem';

const Sidebar = () => {
  const { isExpanded, toggleSidebar } = useSidebarState();
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());

  useEffect(() => {
    return profileService.subscribe(setProfile);
  }, []);

  const isAdmin = ['Super Admin', 'Org Admin'].includes(profile.systemRole);

  return (
    <aside 
      className={`
        bg-[#09090b] border-r border-white/5 flex flex-col shrink-0 h-full 
        transition-all duration-300 ease-in-out font-display relative z-50
        ${isExpanded ? 'w-[240px]' : 'w-[64px]'}
      `}
    >
      {/* Platform Branding & Toggle */}
      <div className={`h-14 flex items-center px-4 shrink-0 border-b border-white/5 relative group ${!isExpanded ? 'justify-center' : 'justify-between'}`}>
        {isExpanded ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-500">
            <div className="size-6 bg-primary rounded flex items-center justify-center shadow-[0_0_10px_rgba(19,91,236,0.3)]">
              <span className="material-symbols-outlined !text-[14px] text-white filled">hub</span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">TrackCodex</span>
          </div>
        ) : (
          <span className="material-symbols-outlined text-slate-500">menu</span>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute -right-3 top-4 size-6 bg-[#09090b] border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl z-[60] hover:scale-110 ${isExpanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
        >
          <span className={`material-symbols-outlined !text-[16px] transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}>
            chevron_left
          </span>
        </button>
      </div>

      {/* Primary Navigation - Flat Hierarchy */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1">
        <SidebarItem to="/dashboard/home" icon="home" label="Home" isExpanded={isExpanded} />
        
        {/* Unified Platform Intelligence Hub */}
        <SidebarItem to="/platform-matrix" icon="insights" label="Platform Matrix" isExpanded={isExpanded} />
        
        <SidebarItem to="/repositories" icon="account_tree" label="Repositories" isExpanded={isExpanded} />
        <SidebarItem to="/workspaces" icon="terminal" label="Workspaces" isExpanded={isExpanded} />
        
        <SidebarItem to="/dashboard/library" icon="auto_stories" label="Library" isExpanded={isExpanded} />
        <SidebarItem to="/community" icon="diversity_3" label="Community" isExpanded={isExpanded} />
        <SidebarItem to="/dashboard/jobs" icon="work" label="Marketplace" isExpanded={isExpanded} />
        <SidebarItem to="/forge-ai" icon="bolt" label="ForgeAI" isExpanded={isExpanded} />
        <SidebarItem to="/profile" icon="account_circle" label="Profile" isExpanded={isExpanded} />
        <SidebarItem to="/settings" icon="settings" label="Settings" isExpanded={isExpanded} />
        
        {/* Role Restricted Admin Panel */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-white/5">
            <SidebarItem to="/admin" icon="verified_user" label="Admin Panel" isExpanded={isExpanded} />
          </div>
        )}
      </div>

      {/* User Quick Profile */}
      <div className="p-3 border-t border-white/5 bg-black/20 shrink-0">
        <div 
          onClick={() => window.location.hash = '/profile'}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group ${!isExpanded ? 'justify-center' : ''}`}
        >
          <div className="relative shrink-0">
            <img 
              src={profile.avatar} 
              className="size-8 rounded-lg border border-white/10 group-hover:border-primary/50 transition-all object-cover" 
              alt=""
            />
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border-2 border-[#09090b]" />
          </div>
          {isExpanded && (
            <div className="flex flex-col min-w-0 flex-1 animate-in fade-in duration-300">
              <span className="text-[12px] font-bold text-white truncate leading-none mb-1">{profile.name}</span>
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{profile.systemRole}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

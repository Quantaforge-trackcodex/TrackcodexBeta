import React, { useEffect, useState } from 'react';
import { useSidebarState } from '../../hooks/useSidebarState';
import { profileService, UserProfile } from '../../services/profile';
import SidebarItem from './SidebarItem';
import { MOCK_ORGANIZATIONS } from '../../constants';

const OrgSwitcher = ({ isExpanded, profile }: { isExpanded: boolean, profile: UserProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState({ 
    name: profile.name, 
    avatar: profile.avatar, 
    type: 'user'
  });

  const handleSelect = (context: any) => {
    setCurrentContext(context);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-2 rounded-xl transition-all group cursor-pointer ${isExpanded ? 'bg-[#161b22] border border-[#30363d] hover:bg-[#21262d]' : ''}`}
      >
        <div className="relative shrink-0">
          <img 
            src={currentContext.avatar} 
            className={`size-8 rounded-lg border border-white/10 group-hover:border-primary/50 transition-all object-cover ${currentContext.type === 'org' ? 'p-1 bg-white/10' : ''}`}
          />
        </div>
        {isExpanded && (
          <div className="flex flex-col min-w-0 flex-1 animate-in fade-in duration-300">
            <span className="text-[12px] font-bold text-white truncate leading-none mb-1">{currentContext.name}</span>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{currentContext.type === 'user' ? 'Personal Account' : 'Organization'}</span>
          </div>
        )}
        {isExpanded && (
           <span className={`material-symbols-outlined !text-[16px] text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-[100] p-2 animate-in fade-in zoom-in-95 duration-200">
          <div onClick={() => handleSelect({ name: profile.name, avatar: profile.avatar, type: 'user' })} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
             <img src={profile.avatar} className="size-8 rounded-lg border border-white/10 object-cover" />
             <span className="text-xs font-bold text-white">{profile.name}</span>
          </div>
          <div className="h-px bg-white/5 my-2"></div>
          <p className="px-2 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Organizations</p>
          {MOCK_ORGANIZATIONS.map(org => (
            <div key={org.id} onClick={() => handleSelect({ name: org.name, avatar: org.avatar, type: 'org' })} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <img src={org.avatar} className="size-8 rounded-lg border border-white/10 object-cover p-1 bg-white/10" />
              <span className="text-xs font-bold text-white">{org.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
      <div className={`h-14 flex items-center shrink-0 border-b border-white/5 relative group ${isExpanded ? 'p-2' : 'justify-center'}`}>
        {isExpanded ? (
          <OrgSwitcher isExpanded={isExpanded} profile={profile} />
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
        
        <SidebarItem to="/repositories" icon="account_tree" label="Dashboard" isExpanded={isExpanded} />
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
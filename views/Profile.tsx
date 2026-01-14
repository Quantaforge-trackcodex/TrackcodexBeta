import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import Highlights from '../components/profile/Highlights';
import CodingSnapshot from '../components/profile/CodingSnapshot';
import ForgeAIUsage from '../components/profile/ForgeAIUsage';
import SecurityImpact from '../components/profile/SecurityImpact';
import FreelanceCard from '../components/profile/FreelanceCard';
import PinnedRepos from '../components/profile/PinnedRepos';
import ContributionHeatmap from '../components/profile/ContributionHeatmap';
import ActivityFeed from '../components/profile/ActivityFeed';
import { profileService, UserProfile } from '../services/profile';
import { MOCK_REPOS } from '../constants';
import { useNavigate } from 'react-router-dom';

const ProfileRepositories = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-white tracking-tight">Repositories</h3>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gh-text-secondary text-sm">search</span>
            <input className="bg-gh-bg border border-gh-border rounded-md pl-9 pr-4 py-1.5 text-xs text-gh-text focus:ring-1 focus:ring-primary w-64 outline-none transition-all placeholder:text-gh-text-secondary" placeholder="Search profile repositories..." />
          </div>
          <button onClick={() => navigate('/repositories')} className="text-[11px] font-bold uppercase text-primary tracking-widest hover:underline flex items-center gap-1">
            Global View <span className="material-symbols-outlined !text-[16px]">open_in_new</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {MOCK_REPOS.map(repo => (
          <div 
            key={repo.id} 
            onClick={() => navigate(`/repo/${repo.id}`)}
            className="group bg-gh-bg-secondary border border-gh-border p-5 rounded-lg hover:border-gh-text-secondary transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-md bg-gh-bg border border-gh-border flex items-center justify-center text-gh-text-secondary group-hover:text-primary transition-all">
                <span className="material-symbols-outlined">account_tree</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-gh-text group-hover:text-primary transition-colors">{repo.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gh-text-secondary font-bold uppercase tracking-widest">{repo.visibility}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-gh-text-secondary font-medium">
                    <div className="size-2 rounded-full" style={{ backgroundColor: repo.techColor }}></div>
                    {repo.techStack}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="hidden md:flex flex-col items-center">
                 <span className="text-[9px] font-bold text-gh-text-secondary uppercase tracking-widest">Health</span>
                 <span className={`text-xs font-bold ${repo.aiHealth.startsWith('A') ? 'text-emerald-500' : 'text-amber-500'}`}>{repo.aiHealth}</span>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                 <span className="text-[9px] font-bold text-gh-text-secondary uppercase tracking-widest">Updated</span>
                 <span className="text-xs text-gh-text-secondary font-medium">{repo.lastUpdated}</span>
              </div>
              <span className="material-symbols-outlined text-gh-text-secondary group-hover:text-white transition-all group-hover:translate-x-1">chevron_right</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileView = () => {
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();

  useEffect(() => {
    return profileService.subscribe(updated => setProfile(updated));
  }, []);

  const tabs = [
    { label: 'Overview', icon: 'dashboard' },
    { label: 'Code & Repos', icon: 'account_tree', badge: '42' },
    { label: 'Security', icon: 'verified_user', badge: 'Top 5%' },
    { label: 'AI & ForgeAI', icon: 'auto_awesome' },
    { label: 'Community', icon: 'hub' },
    { label: 'Jobs', icon: 'work' },
    { label: 'Activity', icon: 'history' }
  ];

  const handleTabClick = (label: string) => {
    setActiveTab(label);
  };

  return (
    <div className="font-display p-10">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Profile Identity Sidebar */}
        <div className="w-full lg:w-[300px] shrink-0 animate-in fade-in slide-in-from-left duration-500">
          <ProfileCard />
        </div>

        {/* Dynamic Content Dashboard */}
        <div className="flex-1 min-w-0">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-gh-border mb-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab.label} 
                onClick={() => handleTabClick(tab.label)}
                className={`flex items-center gap-2 pb-4 text-[14px] font-medium transition-all relative shrink-0 ${activeTab === tab.label ? 'text-white' : 'text-gh-text-secondary hover:text-gh-text'}`}
              >
                <span className="material-symbols-outlined !text-[20px] opacity-70">{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    tab.label === 'Security' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-gh-bg-secondary text-gh-text-secondary border border-gh-border'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.label && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f78166] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'Overview' && (
              <div className="space-y-12">
                {/* Highlights Section */}
                <Highlights />

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                   <CodingSnapshot />
                   <SecurityImpact />
                   <ForgeAIUsage />
                   <FreelanceCard />
                </div>

                {/* Secondary Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                   <div className="xl:col-span-2 space-y-12">
                      <PinnedRepos />
                      <ContributionHeatmap />
                   </div>

                   {/* Right Side Activity Hub */}
                   <div className="space-y-12">
                      <ActivityFeed />
                      <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl relative overflow-hidden group">
                         <div className="flex items-center gap-2 mb-4 text-primary">
                            <span className="material-symbols-outlined filled !text-xl">verified</span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest">ForgeAI Audited</h3>
                         </div>
                         <p className="text-[13px] text-gh-text-secondary leading-relaxed font-medium">
                            Professional history and community contributions are verified by ForgeAI protocols to maintain network-wide trust levels.
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'Code & Repos' && <ProfileRepositories />}
            
            {activeTab === 'Activity' && (
              <div className="max-w-3xl">
                <ActivityFeed />
              </div>
            )}

            {['Security', 'AI & ForgeAI', 'Community', 'Jobs'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-20 bg-gh-bg-secondary border border-gh-border border-dashed rounded-xl">
                 <div className="size-14 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined !text-[28px]">construction</span>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{activeTab} Details</h3>
                 <p className="text-gh-text-secondary text-sm mb-6">Launching dedicated platform module for expanded view.</p>
                 <button 
                  onClick={() => {
                    const pathMap: any = { 'Security': '/activity', 'AI & ForgeAI': '/forge-ai', 'Community': '/community', 'Jobs': '/dashboard/jobs' };
                    navigate(pathMap[activeTab]);
                  }}
                  className="px-6 py-2 bg-gh-bg border border-gh-border hover:border-gh-text-secondary text-white rounded-md font-bold text-xs shadow-sm transition-all active:scale-95"
                 >
                   Open {activeTab}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
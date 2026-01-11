
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
import KarmaBadge from '../components/community/KarmaBadge';

const CommunitySubsection = ({ profile }: { profile: UserProfile }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="p-8 rounded-2xl bg-[#161b22] border border-[#30363d] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <span className="material-symbols-outlined !text-2xl">hub</span>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Community Reputation</h3>
            </div>
            <KarmaBadge karma={profile.communityKarma} />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d]">
                <p className="text-[42px] font-black text-primary leading-none mb-1">{profile.communityKarma}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Karma Points</p>
             </div>
             <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d]">
                <p className="text-[42px] font-black text-white leading-none mb-1">{profile.postsCount}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discussion Posts</p>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#30363d]">
             <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span>Next Level: Expert</span>
                <span>{profile.communityKarma}/500</span>
             </div>
             <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(profile.communityKarma / 500) * 100}%` }}></div>
             </div>
          </div>
       </div>

       <div className="p-8 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col justify-center gap-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Karma Earning Guide</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <span className="material-symbols-outlined !text-[18px]">add_circle</span>
                   </div>
                   <span className="text-sm font-bold text-slate-300">Creating a Post</span>
                </div>
                <span className="text-sm font-black text-emerald-500">+2 Karma</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <span className="material-symbols-outlined !text-[18px]">favorite</span>
                   </div>
                   <span className="text-sm font-bold text-slate-300">Receiving a Like</span>
                </div>
                <span className="text-sm font-black text-amber-500">+1 Karma</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <span className="material-symbols-outlined !text-[18px]">forum</span>
                   </div>
                   <span className="text-sm font-bold text-slate-300">Receiving a Comment</span>
                </div>
                <span className="text-sm font-black text-blue-500">+2 Karma</span>
             </div>
          </div>
       </div>
    </div>
    
    <div className="p-8 rounded-2xl border border-dashed border-[#30363d] bg-white/[0.01] text-center">
       <h4 className="text-sm font-bold text-white mb-2">Detailed Community History</h4>
       <p className="text-xs text-slate-500 max-w-sm mx-auto">This section tracks your impact on the TrackCodex community through technical discussions and peer support.</p>
    </div>
  </div>
);

const ProfileView = () => {
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    return profileService.subscribe(updated => setProfile(updated));
  }, []);

  const tabs = [
    { label: 'Overview', icon: 'dashboard' },
    { label: 'Repositories', icon: 'account_tree', badge: '42' },
    { label: 'Community', icon: 'hub' },
    { label: 'Security', icon: 'verified_user' },
    { label: 'Activity', icon: 'history' }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] font-display">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10 flex flex-col lg:flex-row gap-10 lg:gap-12">
        
        {/* Column 1: Profile Card (Left Identity) */}
        <ProfileCard />

        {/* Content Area (Center & Right) */}
        <div className="flex-1 min-w-0">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-[#30363d] mb-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab.label} 
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 pb-4 text-[14px] font-medium transition-all relative shrink-0 ${activeTab === tab.label ? 'text-[#f0f6fc]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="material-symbols-outlined !text-[20px]">{tab.icon}</span>
                {tab.label}
                {tab.badge && <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-500">{tab.badge}</span>}
                {activeTab === tab.label && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#f78166] rounded-t-full"></div>}
              </button>
            ))}
          </div>

          {activeTab === 'Community' ? (
            <CommunitySubsection profile={profile} />
          ) : (
            <div className="flex flex-col xl:flex-row gap-10">
              {/* Center: Developer Stats and Projects */}
              <div className="flex-1 flex flex-col gap-10 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] font-display relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary !text-xl">hub</span>
                          <h3 className="text-[14px] font-black text-[#f0f6fc] tracking-tight uppercase">Community Reputation</h3>
                        </div>
                        <KarmaBadge karma={profile.communityKarma} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                            <p className="text-[32px] font-black text-primary leading-none mb-1">{profile.communityKarma}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Karma</p>
                         </div>
                         <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                            <p className="text-[32px] font-black text-white leading-none mb-1">{profile.postsCount}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Post History</p>
                         </div>
                      </div>
                   </div>
                   <FreelanceCard />
                </div>

                <Highlights />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <CodingSnapshot />
                  <SecurityImpact />
                </div>

                <ForgeAIUsage />
                <PinnedRepos />
                <ContributionHeatmap />
              </div>

              {/* Right Sidebar: Activity Feed */}
              <aside className="w-full xl:w-[320px] shrink-0">
                 <div className="sticky top-4">
                    <ActivityFeed />
                    
                    <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary !text-[18px]">verified</span>
                          <span className="text-[11px] font-black uppercase tracking-widest text-primary">ForgeAI Audited</span>
                       </div>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                          Professional history and community contributions are verified by ForgeAI to maintain enterprise-grade trust levels.
                       </p>
                    </div>
                 </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

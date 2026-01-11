
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/community/PostCard';
import CreatePostBox from '../components/community/CreatePostBox';
import CommunitySidebar from '../components/community/CommunitySidebar';
import { communityBus } from '../services/communityBus';
import { CommunityPost } from '../types';

const CommunityView = () => {
  const [activeTab, setActiveTab] = useState('Trending');
  const [activeFilter, setActiveFilter] = useState('All View');
  const [toast, setToast] = useState<string | null>(null);

  const tabs = ['Trending', 'Latest', 'Following'];
  const filters = ['All View', 'Question', 'Build Log', 'Showcase'];

  const INITIAL_POSTS: CommunityPost[] = [
    {
      id: 'p1',
      author: {
        name: 'Sarah Chen',
        username: 'sarah_backend',
        role: 'SR. BACKEND ENG',
        avatar: 'https://picsum.photos/seed/sarah/64',
        karma: 450
      },
      time: '2 hours ago',
      visibility: 'Public',
      title: 'Best practices for scaling Postgres in 2024?',
      content: "We're hitting some performance bottlenecks with our current RDS setup as we cross 5TB of data. Looking into partitioning strategies vs just throwing more hardware at it.",
      tags: ['Database', 'Scaling', 'Postgres'],
      upvotes: 142,
      comments: 24,
      linkedEntity: {
        type: 'repo',
        id: 'trackcodex-backend',
        label: 'trackcodex-backend'
      }
    },
    {
      id: 'p2',
      author: {
        name: 'David Kim',
        username: 'david_kim',
        role: 'FOUNDER',
        avatar: 'https://picsum.photos/seed/david/64',
        isLive: true,
        karma: 850
      },
      time: 'Just now',
      visibility: 'Public',
      title: 'Thoughts on the new Vercel pricing model for startups.',
      content: "I've been running the numbers for our SaaS, and the new per-seat pricing combined with the bandwidth changes seems to impact bootstrapped teams significantly.",
      tags: ['Startup', 'Pricing', 'Vercel'],
      upvotes: 89,
      comments: 12,
    }
  ];

  const [localPosts, setLocalPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  useEffect(() => {
    const unsub = communityBus.subscribe((event) => {
      if (event.type === 'POST_CREATED') {
        setLocalPosts(prev => [event.data, ...prev]);
        showToast('New post published!');
      }
      if (event.type === 'REACTION_ADDED') {
         // Optionally show a mini signal
      }
    });

    // Start background activity simulation
    communityBus.simulateActivity();

    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredPosts = useMemo(() => {
    return localPosts.filter(post => {
      if (activeFilter === 'All View') return true;
      if (activeFilter === 'Build Log') return post.type === 'BUILD LOG';
      return true;
    });
  }, [localPosts, activeFilter]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] font-display relative">
      
      {/* Real-time notification toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 animate-in slide-in-from-bottom-4 flex items-center gap-3">
           <span className="material-symbols-outlined !text-[18px] animate-pulse">hub</span>
           {toast}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Feed Column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">Community Feed</h1>
              <p className="text-slate-500 text-sm">Real-time collaboration with 10k+ developers.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">1,242 Online</span>
               </div>
            </div>
          </div>

          {/* Feed Tabs */}
          <div className="flex items-center gap-8 border-b border-[#30363d] mb-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[14px] font-bold transition-all relative shrink-0 ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-t-full"></div>}
              </button>
            ))}
          </div>

          <CreatePostBox />

          {/* Secondary Filters */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {filters.map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                    activeFilter === filter 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-[#161b22] text-slate-500 border-[#30363d] hover:border-slate-500'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[12px] font-bold shrink-0">
               <span>Sort:</span>
               <div className="flex items-center gap-1 text-white cursor-pointer hover:text-primary transition-colors">
                  Trending
                  <span className="material-symbols-outlined !text-[16px]">expand_more</span>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
           <CommunitySidebar />
           
           {/* Trending Tags Widget */}
           <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['#AI', '#Rust', '#SaaS', '#DevOps', '#Postgres', '#Frontend'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[11px] font-bold text-slate-400 hover:text-white hover:border-primary transition-all cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default CommunityView;

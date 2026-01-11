
import React from 'react';

const ActivityFeed = () => {
  const events = [
    { type: 'push', repo: 'rust-crypto-guard', date: '2 hours ago', commits: 3, description: 'Optimized GCM-AES primitives' },
    { type: 'pr', repo: 'forge-ai-security', date: 'Yesterday', title: 'Fix: update AI model path', status: 'merged' },
    { type: 'create', repo: 'temp-security-test', date: '3 days ago', description: 'Initial repository setup' },
    { type: 'push', repo: 'rust-crypto-guard', date: '4 days ago', commits: 1, description: 'Updated README documentation' }
  ];

  return (
    <div className="font-display">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-slate-500 !text-xl">history</span>
        <h3 className="text-[16px] font-bold text-[#f0f6fc]">Latest Activity</h3>
      </div>
      
      <div className="space-y-0">
        <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-4">March 2024</p>
        <div className="space-y-0 relative">
          <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-[#30363d]"></div>
          
          {events.map((event, i) => (
            <div key={i} className="flex gap-4 mb-6 relative z-10">
              <div className="size-6 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center shrink-0 shadow-sm">
                <span className={`material-symbols-outlined !text-[12px] ${
                  event.type === 'push' ? 'text-primary' : 
                  event.type === 'pr' ? 'text-purple-400' : 'text-emerald-400'
                }`}>
                  {event.type === 'push' ? 'commit' : event.type === 'pr' ? 'fork_right' : 'add'}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <p className="text-[13px] text-[#c9d1d9] leading-snug">
                    <span className="font-bold text-white">
                      {event.type === 'push' ? `Pushed ${event.commits} commits` : 
                       event.type === 'pr' ? 'Opened pull request' : 'Created repository'}
                    </span>
                    {" "}to{" "}
                    <span className="text-primary hover:underline cursor-pointer font-bold">{event.repo}</span>
                  </p>
                  
                  {event.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                      "{event.description}"
                    </p>
                  )}
                  
                  {event.title && (
                    <p className="text-[11px] text-slate-500 mt-1 font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5 inline-block w-fit">
                      {event.title}
                    </p>
                  )}
                  
                  <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-tighter">{event.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 bg-transparent hover:bg-white/5 border border-[#30363d] text-slate-500 hover:text-white rounded-xl font-bold text-xs transition-all">
        View full activity
      </button>
    </div>
  );
};

export default ActivityFeed;

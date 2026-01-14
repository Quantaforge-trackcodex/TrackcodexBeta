
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
      <div className="flex items-center gap-3 mb-8">
         <span className="material-symbols-outlined text-slate-500 !text-[20px]">history</span>
         <h3 className="text-[16px] font-black uppercase tracking-tight text-white">Latest Activity</h3>
      </div>
      
      <div className="relative pl-8">
        <div className="absolute left-[3px] top-2 bottom-8 w-[1px] bg-[#30363d]"></div>
        <p className="text-[11px] font-black uppercase text-slate-700 tracking-[0.3em] mb-8">March 2024</p>
        
        <div className="space-y-12">
          {events.map((event, i) => (
            <div key={i} className="relative group cursor-pointer">
               <div className="absolute left-[-32px] top-1 size-5 rounded-full bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                  <div className={`size-1.5 rounded-full ${event.type === 'push' ? 'bg-primary' : event.type === 'pr' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
               </div>
               
               <div className="min-w-0">
                  <p className="text-[14px] text-slate-300 leading-snug">
                     <span className="font-black text-white group-hover:text-primary transition-colors">
                        {event.type === 'push' ? `Pushed ${event.commits} commits` : 
                         event.type === 'pr' ? 'Opened pull request' : 'Created repository'}
                     </span>
                     {" "}to{" "}
                     <span className="text-primary font-bold hover:underline">{event.repo}</span>
                  </p>
                  
                  {event.description && (
                    <p className="text-[12px] text-slate-500 mt-2 font-medium italic">
                       "{event.description}"
                    </p>
                  )}
                  
                  {event.title && (
                    <div className="mt-3 px-3 py-1.5 bg-[#1e1e1e] border border-white/5 rounded-lg text-[11px] text-slate-400 font-bold uppercase tracking-tight inline-block">
                       {event.title}
                    </div>
                  )}
                  
                  <p className="text-[10px] text-slate-600 mt-4 font-black uppercase tracking-widest">{event.date}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="w-full mt-12 py-3 bg-[#161b22] border border-[#30363d] text-slate-400 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm hover:border-primary/40 active:scale-[0.98]">
        View full activity
      </button>
    </div>
  );
};

export default ActivityFeed;

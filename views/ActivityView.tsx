
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: 'commit' | 'ai' | 'mission' | 'social' | 'security';
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  entityName: string;
  entityId: string;
  impact?: 'high' | 'medium' | 'low';
}

const ActivityView = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'commit',
      title: 'Pushed 3 commits to main',
      description: 'Refactor: implemented shared buffer logic for live session synchronization.',
      timestamp: '2024-11-10T14:20:00Z',
      relativeTime: '2 hours ago',
      entityName: 'trackcodex-core',
      entityId: 'trackcodex-backend'
    },
    {
      id: '2',
      type: 'ai',
      title: 'ForgeAI Refactor Generated',
      description: 'AI suggested a complexity reduction for the auth validation middleware.',
      timestamp: '2024-11-10T12:15:00Z',
      relativeTime: '4 hours ago',
      entityName: 'auth_module.ts',
      entityId: 'trackcodex-backend',
      impact: 'high'
    },
    {
      id: '3',
      type: 'mission',
      title: 'Mission Offer Accepted',
      description: 'Accepted the "DeFi Protocol Security Audit" mission from @solanalend.',
      timestamp: '2024-11-10T10:05:00Z',
      relativeTime: '6 hours ago',
      entityName: 'Mission Marketplace',
      entityId: 'job-1'
    },
    {
      id: '4',
      type: 'security',
      title: 'Vulnerability Resolved',
      description: 'Patched a potential SQL injection vulnerability detected by DAST scanner.',
      timestamp: '2024-11-09T18:30:00Z',
      relativeTime: 'Yesterday',
      entityName: 'legacy-importer',
      entityId: 'legacy-importer',
      impact: 'high'
    },
    {
      id: '5',
      type: 'social',
      title: 'Commented on Community Thread',
      description: 'Replied to @sarah_backend regarding Postgres scaling strategies.',
      timestamp: '2024-11-09T15:45:00Z',
      relativeTime: 'Yesterday',
      entityName: 'Community Feed',
      entityId: 'p1'
    }
  ];

  const filteredActivities = useMemo(() => {
    if (filter === 'All') return activities;
    return activities.filter(a => a.type === filter.toLowerCase());
  }, [filter]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'commit': return 'account_tree';
      case 'ai': return 'auto_awesome';
      case 'mission': return 'work';
      case 'social': return 'forum';
      case 'security': return 'shield';
      default: return 'history';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'commit': return 'text-primary';
      case 'ai': return 'text-purple-400';
      case 'mission': return 'text-amber-500';
      case 'social': return 'text-cyan-400';
      case 'security': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-8 font-display">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="size-10 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-primary shadow-xl">
                 <span className="material-symbols-outlined filled">history</span>
               </div>
               <h1 className="text-3xl font-black text-white tracking-tight uppercase">Activity Stream</h1>
            </div>
            <p className="text-slate-500 text-sm">Chronological ledger of your interactions across the ecosystem.</p>
          </div>
          <div className="flex bg-[#161b22] border border-[#30363d] p-1 rounded-xl">
             {['All', 'Commit', 'AI', 'Mission', 'Social'].map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${
                   filter === f ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/30 via-[#30363d] to-transparent"></div>

          <div className="space-y-10">
            {filteredActivities.map((activity, i) => (
              <div 
                key={activity.id} 
                className="flex gap-8 relative group animate-in slide-in-from-left-4 duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Timeline Node */}
                <div className={`size-12 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center shrink-0 z-10 group-hover:border-primary transition-colors shadow-2xl`}>
                  <span className={`material-symbols-outlined !text-[20px] ${getColor(activity.type)}`}>
                    {getIcon(activity.type)}
                  </span>
                </div>

                <div className="flex-1 pt-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-base font-black text-slate-100 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                        {activity.title}
                     </h3>
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{activity.relativeTime}</span>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-sm group-hover:shadow-xl transition-all relative overflow-hidden">
                     {activity.impact === 'high' && (
                       <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest border-l border-b border-rose-500/20 rounded-bl-xl">
                         High Impact
                       </div>
                     )}
                     <p className="text-[14px] text-slate-400 leading-relaxed mb-4 font-medium italic">
                        "{activity.description}"
                     </p>
                     <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Context:</span>
                           <span 
                             onClick={() => activity.type === 'commit' && navigate(`/repo/${activity.entityId}`)}
                             className={`text-[11px] font-black uppercase tracking-tight hover:underline cursor-pointer ${getColor(activity.type)}`}
                           >
                             {activity.entityName}
                           </span>
                        </div>
                        <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">
                           View Detail
                           <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
               <div className="size-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-6">
                 <span className="material-symbols-outlined !text-[40px]">history_toggle_off</span>
               </div>
               <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">End of Activity Stream</h3>
               <p className="text-slate-500 text-sm max-w-xs">No records matching your current filter were found in the audit ledger.</p>
            </div>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-[#30363d] text-center">
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">TrackCodex Activity Registry • Protected by ForgeAI Governance</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityView;

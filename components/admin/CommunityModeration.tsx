
import React from 'react';

const CommunityModeration = () => {
  const flags = [
    { id: 'f1', type: 'Content', reason: 'Potential Spam', reporter: 'System (ForgeAI)', post: 'Free Crypto Giveaway!', status: 'Pending Review' },
    { id: 'f2', type: 'User', reason: 'Toxic Behavior', reporter: 'AlexRivers', post: 'Comment on PR #452', status: 'Reviewing' },
    { id: 'f3', type: 'Karma', reason: 'Unusual Inflow', reporter: 'System', post: 'Account Activity Spike', status: 'Investigating' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Community Moderation</h1>
          <p className="text-slate-500">Oversee discussion quality and handle moderation escalations.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
              <span className="material-symbols-outlined !text-[18px]">auto_awesome</span>
              AI Sensitivity: High
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500 !text-[18px]">flag</span>
              Moderation Queue
           </h3>
           <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0d0d0f] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#30363d]">
                    <th className="px-6 py-4">Trigger</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Evidence/Content</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  {flags.map(flag => (
                    <tr key={flag.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 uppercase">{flag.type}</span>
                            <span className="text-[10px] text-slate-600 font-mono">#{flag.id}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <p className="text-sm font-bold text-rose-500">{flag.reason}</p>
                         <p className="text-[10px] text-slate-500 uppercase font-black">by {flag.reporter}</p>
                      </td>
                      <td className="px-6 py-5">
                         <p className="text-xs text-slate-300 italic">"{flag.post}"</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-[9px] font-black uppercase tracking-widest border border-primary/20 transition-all">Dismiss</button>
                            <button className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest border border-rose-500/20 transition-all">Enforce</button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        <div className="space-y-8">
           <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-emerald-500 !text-[18px]">verified_user</span>
                 Moderation Summary
              </h3>
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Flags Today</span>
                    <span className="text-sm font-black text-white">24</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Auto-Resolved</span>
                    <span className="text-sm font-black text-emerald-500">18</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Human Action</span>
                    <span className="text-sm font-black text-amber-500">4</span>
                 </div>
                 <div className="pt-4 border-t border-[#30363d]">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase mb-4">
                       <span className="material-symbols-outlined !text-[16px]">info</span>
                       Moderator Guidelines
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic">"Always prioritize professional technical discourse. Suspensions require clear evidence of recurring violation."</p>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default CommunityModeration;

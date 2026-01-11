
import React from 'react';

const NeedsAttention = () => {
  return (
    <div className="space-y-4">
       <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 flex items-center justify-between border-b border-[#30363d]">
             <div className="flex items-center gap-4">
                <div className="size-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                <div>
                   <h4 className="text-sm font-bold text-white">legacy-auth-service</h4>
                   <p className="text-xs text-slate-500">Critical vulnerability in dependencies</p>
                </div>
             </div>
             <button className="px-4 py-2 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20">Fix Now</button>
          </div>
          <div className="p-5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="size-2.5 rounded-full bg-amber-500"></div>
                <div>
                   <h4 className="text-sm font-bold text-white">frontend-dashboard</h4>
                   <p className="text-xs text-slate-500">AI Health Score dropped to C (74)</p>
                </div>
             </div>
             <button className="px-4 py-2 bg-[#0d1117] text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 hover:text-white transition-all border border-[#30363d]">Review</button>
          </div>
       </div>
    </div>
  );
};

export default NeedsAttention;

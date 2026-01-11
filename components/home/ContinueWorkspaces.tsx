
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContinueWorkspaces = () => {
  const navigate = useNavigate();
  const workspaces = [
    { name: 'trackcodex-core', org: 'Quantaforge Organization', status: '98 A+', badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', aiText: 'ForgeAI fixed 3 issues' },
    { name: 'client-payment-gateway', org: 'Freelance Project', status: '85 B', badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20', aiText: 'Edited 2 hours ago', icon: 'edit' },
    { name: 'personal-blog-v3', org: 'Personal', status: '92 A', badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', aiText: 'CI Pipeline failing', icon: 'error', aiColor: 'text-rose-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((ws, i) => (
        <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-lg hover:border-primary/50 transition-all group">
          <div className="flex items-start justify-between mb-4">
             <div className="min-w-0">
               <h3 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">{ws.name}</h3>
               <p className="text-[11px] text-slate-500 mt-0.5 font-bold uppercase tracking-wider">{ws.org}</p>
             </div>
             <div className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase flex items-center gap-1 shrink-0 ${ws.badgeColor}`}>
                <span className="material-symbols-outlined !text-[12px] filled">shield</span>
                {ws.status}
             </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
             <span className={`material-symbols-outlined !text-[16px] ${ws.aiColor || 'text-primary'} ${ws.aiText.includes('ForgeAI') ? 'filled' : ''}`}>
                {ws.icon || 'auto_awesome'}
             </span>
             <span className={`text-[12px] font-bold ${ws.aiColor || 'text-slate-400'}`}>{ws.aiText}</span>
          </div>
          <button 
            onClick={() => navigate('/workspaces')}
            className="w-full py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-sm font-bold text-white hover:bg-primary transition-all shadow-sm"
          >
            Open Workspace
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContinueWorkspaces;

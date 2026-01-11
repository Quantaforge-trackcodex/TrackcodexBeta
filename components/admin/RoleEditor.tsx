
import React from 'react';

const RoleEditor = () => {
  const roles = [
    { name: 'Super Admin', scope: 'Global', users: 3, permissions: 12, system: true },
    { name: 'Org Admin', scope: 'Organization', users: 12, permissions: 8, system: true },
    { name: 'Team Admin', scope: 'Team', users: 45, permissions: 5, system: true },
    { name: 'External Auditor', scope: 'Workspace', users: 2, permissions: 3, system: false },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Roles & Permissions</h1>
          <p className="text-slate-500">Define administrative scopes and granular permission sets.</p>
        </div>
        <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
           <span className="material-symbols-outlined text-lg">shield_with_heart</span>
           Add Custom Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role, i) => (
          <div key={i} className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl hover:border-primary/50 transition-all group">
            <div className="flex items-start justify-between mb-6">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">shield_person</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">{role.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Scope: {role.scope}</p>
                  </div>
               </div>
               {role.system && (
                 <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest">System Role</span>
               )}
            </div>
            
            <div className="flex items-center gap-8 mb-8">
               <div className="flex flex-col">
                  <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Users</span>
                  <span className="text-xl font-black text-white">{role.users}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Permissions</span>
                  <span className="text-xl font-black text-white">{role.permissions}</span>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="flex-1 py-2 bg-[#0d0d0f] border border-[#30363d] text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Edit Matrix</button>
               <button className="flex-1 py-2 bg-[#0d0d0f] border border-[#30363d] text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Simulate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleEditor;

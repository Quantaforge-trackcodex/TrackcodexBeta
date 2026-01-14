
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const DATA = [
  { name: 'Python', value: 45, color: '#135bec' },
  { name: 'Rust', value: 30, color: '#f97316' },
  { name: 'Go', value: 25, color: '#a855f7' },
];

const CodingSnapshot = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-8 h-full flex flex-col shadow-xl hover:border-[#8b949e] transition-all group">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
           <span className="material-symbols-outlined text-primary !text-[22px]">code</span>
           <h3 className="text-[15px] font-black text-white tracking-tight uppercase">Coding Snapshot</h3>
        </div>
        <button 
          onClick={() => navigate('/platform-matrix')}
          className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-all flex items-center gap-1"
        >
          View Details
          <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
        </button>
      </div>

      <div className="flex items-center gap-10 mb-10 flex-1">
         <div className="size-40 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie data={DATA} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                     {DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                  </Pie>
               </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-xl font-black text-white">856</span>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sessions</span>
            </div>
         </div>
         <div className="flex-1 space-y-5">
            {DATA.map(lang => (
              <div key={lang.name} className="flex items-center justify-between group/lang cursor-pointer">
                 <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)]" style={{ backgroundColor: lang.color }}></div>
                    <span className="text-[14px] font-bold text-slate-300 group-hover/lang:text-white transition-colors">{lang.name}</span>
                 </div>
                 <span className="text-[14px] font-black text-white">{lang.value}%</span>
              </div>
            ))}
         </div>
      </div>

      <div className="pt-6 border-t border-white/5">
         <p className="text-[11px] text-slate-500 font-bold italic flex items-center gap-2">
            <span className="material-symbols-outlined !text-[16px] text-emerald-500">history</span>
            Latest Activity: <span className="text-slate-300 font-medium">Refactored auth module in core-lib</span>
         </p>
      </div>
    </div>
  );
};

export default CodingSnapshot;

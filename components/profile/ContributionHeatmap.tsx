
import React, { useMemo } from 'react';

const ContributionHeatmap = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const heatmapData = useMemo(() => {
    return Array.from({ length: 7 * 52 }, () => Math.floor(Math.random() * 5));
  }, []);

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-[#161b22]';
      case 1: return 'bg-[#0e4429]';
      case 2: return 'bg-[#006d32]';
      case 3: return 'bg-[#26a641]';
      case 4: return 'bg-[#39d353]';
      default: return 'bg-[#161b22]';
    }
  };

  return (
    <div className="font-display">
      <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">2,450 contributions in the last year</h3>
      <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-xl overflow-x-auto custom-scrollbar">
        <div className="flex gap-1 min-w-[700px]">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-slate-600 mb-2 px-1">
              {months.map(month => <span key={month}>{month}</span>)}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {heatmapData.map((val, i) => (
                <div 
                  key={i} 
                  className={`rounded-[2px] w-3 h-3 transition-colors hover:ring-1 hover:ring-white/50 cursor-pointer ${getIntensityColor(val)}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-slate-600">
           <span>Less</span>
           <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(l => (
                <div key={l} className={`size-2.5 rounded-[1px] ${getIntensityColor(l)}`} />
              ))}
           </div>
           <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionHeatmap;

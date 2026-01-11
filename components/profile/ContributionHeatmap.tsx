
import React, { useMemo } from 'react';

const ContributionHeatmap = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Generate more realistic mock data with some clusters of high activity
  const heatmapData = useMemo(() => {
    return Array.from({ length: 7 * 52 }, (_, i) => {
      const base = Math.random();
      // Add some "busy" periods using a sine wave to cluster high activity
      const clusterFactor = Math.sin(i / 20) > 0.7 ? 2 : 1;
      const val = Math.floor(base * 5 * clusterFactor);
      return Math.min(val, 4); // Cap at level 4 (vibrant green)
    });
  }, []);

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-[#0d1117] border border-white/5';
      case 1: return 'bg-[#0e4429]';
      case 2: return 'bg-[#006d32]';
      case 3: return 'bg-[#26a641]';
      case 4: return 'bg-[#39d353]';
      default: return 'bg-[#0d1117]';
    }
  };

  return (
    <div className="font-display">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-emerald-500 !text-xl">monitoring</span>
           <h3 className="text-[16px] font-bold text-[#f0f6fc]">TrackCodex Activity</h3>
        </div>
        <span className="text-[12px] text-slate-500">
          <span className="font-bold text-[#f0f6fc]">2,450</span> contributions in the last year
        </span>
      </div>
      
      <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-[720px]">
          {/* Days Labels Column */}
          <div className="grid grid-rows-7 gap-[3px] text-[9px] text-slate-500 pr-2 pt-6">
            {weekDays.map((day, i) => (
              <div key={i} className="h-2.5 flex items-center">{day}</div>
            ))}
          </div>
          
          <div className="flex-1">
            {/* Months Labels Row */}
            <div className="flex justify-between text-[10px] text-slate-500 mb-2 px-1">
              {months.map(month => <span key={month}>{month}</span>)}
            </div>
            
            {/* Heatmap Grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] h-[88px]">
              {heatmapData.map((val, i) => (
                <div 
                  key={i} 
                  className={`rounded-[2px] w-2.5 h-2.5 transition-all duration-200 hover:ring-2 hover:ring-white/50 cursor-pointer ${getIntensityColor(val)}`}
                  title={`${val === 0 ? 'No' : val * 3} contributions on this day`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] text-slate-500 border-t border-[#30363d] pt-4">
          <p className="hover:text-primary cursor-pointer transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined !text-[14px]">info</span>
            How TrackCodex counts contributions
          </p>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold">Less</span>
             <div className="flex gap-[3px]">
                <div className="size-2.5 bg-[#0d1117] rounded-[1px] border border-white/5"></div>
                <div className="size-2.5 bg-[#0e4429] rounded-[1px]"></div>
                <div className="size-2.5 bg-[#006d32] rounded-[1px]"></div>
                <div className="size-2.5 bg-[#26a641] rounded-[1px]"></div>
                <div className="size-2.5 bg-[#39d353] rounded-[1px]"></div>
             </div>
             <span className="text-[10px] font-bold">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionHeatmap;

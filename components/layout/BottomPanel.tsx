
import React, { useState } from 'react';

const BottomPanel = () => {
  const [activeTab, setActiveTab] = useState('Terminal');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = ['Problems', 'Output', 'Debug Console', 'Terminal', 'Ports'];

  if (isCollapsed) {
    return (
      <div className="h-8 border-t border-vscode-border bg-vscode-editor flex items-center px-4 shrink-0">
        <button onClick={() => setIsCollapsed(false)} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined !text-[16px]">expand_less</span>
          Restore Panel
        </button>
      </div>
    );
  }

  return (
    <div className="h-[280px] border-t border-vscode-border bg-vscode-editor flex flex-col shrink-0 animate-in slide-in-from-bottom duration-200">
      <div className="h-9 px-4 flex items-center justify-between border-b border-vscode-border select-none">
        <div className="flex items-center gap-6 h-full">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-full text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
           <button className="p-1 hover:bg-white/5 rounded text-slate-500"><span className="material-symbols-outlined !text-[16px]">add</span></button>
           <button className="p-1 hover:bg-white/5 rounded text-slate-500"><span className="material-symbols-outlined !text-[16px]">delete</span></button>
           <button onClick={() => setIsCollapsed(true)} className="p-1 hover:bg-white/5 rounded text-slate-500"><span className="material-symbols-outlined !text-[16px]">close</span></button>
        </div>
      </div>

      <div className="flex-1 bg-black/20 overflow-hidden font-mono p-4">
         {activeTab === 'Terminal' && (
           <div className="text-[13px] leading-relaxed">
             <div className="flex items-center gap-2 text-primary font-bold mb-1">
               <span>trackcodex@cloud-vps</span>
               <span className="text-white">~/projects/core-api</span>
               <span className="text-slate-500">$</span>
               <span className="text-white animate-pulse">|</span>
             </div>
             <div className="text-slate-400"># ForgeAI environment ready for deployment analysis</div>
           </div>
         )}
         {activeTab === 'Problems' && (
           <div className="flex items-center gap-3 text-slate-500 text-[13px] h-full justify-center">
             <span className="material-symbols-outlined !text-[48px] opacity-20">check_circle</span>
             No problems have been detected in the workspace.
           </div>
         )}
      </div>
    </div>
  );
};

export default BottomPanel;

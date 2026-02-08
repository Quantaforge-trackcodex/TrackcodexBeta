import React from "react";

const NeedsAttention = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl overflow-hidden shadow-xl animate-fade-in hover-lift">
        <div className="p-5 flex items-center justify-between border-b border-gh-border">
          <div className="flex items-center gap-4">
            <div className="size-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
            <div>
              <h4 className="text-sm font-bold text-gh-text">
                legacy-auth-service
              </h4>
              <p className="text-xs text-gh-text-secondary">
                Critical vulnerability in dependencies
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20">
            Fix Now
          </button>
        </div>
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-2.5 rounded-full bg-amber-500"></div>
            <div>
              <h4 className="text-sm font-bold text-gh-text">
                frontend-dashboard
              </h4>
              <p className="text-xs text-gh-text-secondary">
                AI Health Score dropped to C (74)
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gh-bg text-gh-text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-gh-bg-tertiary hover:text-gh-text transition-all border border-gh-border">
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedsAttention;

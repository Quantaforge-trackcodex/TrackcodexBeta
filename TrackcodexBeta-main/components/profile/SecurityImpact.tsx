import React from "react";
import { useNavigate } from "react-router-dom";

const SecurityImpact = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gh-bg-secondary border border-gh-border rounded-3xl p-8 h-full flex flex-col shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
      <div className="absolute -top-12 -right-12 size-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-1000"></div>

      <div className="flex items-center gap-3 mb-10 relative z-10">
        <span className="material-symbols-outlined text-emerald-500 !text-[22px] filled">
          verified_user
        </span>
        <h3 className="text-[15px] font-black text-gh-text tracking-tight uppercase">
          Security Impact
        </h3>
        <div className="ml-auto size-8 bg-gh-bg border border-gh-border rounded-lg flex items-center justify-center shadow-inner group-hover:border-emerald-500/30 transition-all">
          <span className="material-symbols-outlined !text-[18px] text-gh-text-secondary">
            shield
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10 flex-1 relative z-10">
        <div className="p-7 rounded-2xl bg-gh-bg border border-gh-border/50 flex flex-col justify-center shadow-inner group-hover:border-emerald-500/20 transition-all">
          <p className="text-5xl font-black text-emerald-500 leading-none mb-3 tracking-tighter shadow-emerald-500/10 drop-shadow-lg">
            142
          </p>
          <p className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.25em]">
            Vulns Fixed
          </p>
        </div>
        <div className="p-7 rounded-2xl bg-gh-bg border border-gh-border/50 flex flex-col justify-center shadow-inner group-hover:border-rose-500/20 transition-all">
          <p className="text-5xl font-black text-rose-500 leading-none mb-3 tracking-tighter">
            2
          </p>
          <p className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.25em]">
            Intro'd (90d)
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/activity")}
        className="flex items-center gap-3 pt-6 border-t border-gh-border/50 w-full text-left group/btn"
      >
        <span className="material-symbols-outlined text-emerald-500 filled !text-[22px] group-hover/btn:scale-110 transition-transform">
          check_circle
        </span>
        <span className="text-[13px] font-bold text-gh-text-secondary group-hover/btn:text-gh-text transition-colors">
          340 Reviews Completed
        </span>
        <span className="material-symbols-outlined ml-auto text-gh-text-secondary !text-[18px] group-hover/btn:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>
    </div>
  );
};

export default SecurityImpact;

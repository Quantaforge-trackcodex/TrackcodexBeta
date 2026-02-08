import React from "react";
import { useNavigate } from "react-router-dom";

const FreelanceCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gh-bg-secondary border border-gh-border rounded-3xl p-8 flex flex-col shadow-xl hover:border-amber-500/30 transition-all group">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 filled !text-[22px]">
            work
          </span>
          <h3 className="text-[15px] font-black text-gh-text tracking-tight uppercase">
            Freelance Profile
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-amber-500 font-black">
          <span className="material-symbols-outlined !text-[20px]">star</span>
          <span className="text-xl tracking-tighter">5.0</span>
        </div>
      </div>

      <div className="space-y-8 mb-10 flex-1">
        <button
          onClick={() => navigate("/dashboard/jobs")}
          className="flex items-center justify-between border-b border-gh-border pb-4 w-full group/stat hover:border-amber-500/50 transition-all"
        >
          <span className="text-[14px] font-bold text-gh-text-secondary group-hover/stat:text-gh-text transition-colors">
            Jobs Completed
          </span>
          <span className="text-2xl font-black text-gh-text">24</span>
        </button>
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gh-text-secondary leading-tight">
              Top Performance
            </span>
            <span className="text-[13px] font-bold text-gh-text-secondary leading-tight">
              Category
            </span>
          </div>
          <div className="text-right">
            <span className="text-[16px] font-black text-gh-text uppercase block leading-none tracking-tight">
              Security
            </span>
            <span className="text-[16px] font-black text-gh-text uppercase block leading-none mt-1.5 tracking-tight">
              Audits
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gh-border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-widest">
            88% Repeat Hire Rate
          </span>
          <span className="text-[10px] font-bold text-amber-500 uppercase">
            Excellent
          </span>
        </div>
        <div className="h-2.5 w-full bg-gh-bg rounded-full overflow-hidden shadow-inner relative group-hover:ring-1 group-hover:ring-amber-500/20 transition-all">
          <div className="h-full bg-amber-500 w-[88%] shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-1000 ease-out"></div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceCard;

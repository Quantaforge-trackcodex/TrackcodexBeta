import React from "react";

const LearnGrow = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
      <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer hover:border-primary transition-all group hover-lift">
        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined !text-[22px] filled">
            forum
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.2em]">
            Community
          </span>
          <span className="text-sm font-bold text-gh-text group-hover:text-primary transition-colors">
            Latest from the Forum
          </span>
        </div>
      </div>

      <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer hover:border-primary transition-all group hover-lift">
        <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined !text-[22px] filled">
            library_books
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.2em]">
            Library Pack
          </span>
          <span className="text-sm font-bold text-gh-text group-hover:text-emerald-500 transition-colors">
            Essential Security Modules
          </span>
        </div>
      </div>

      <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-2xl shadow-lg flex items-center gap-4 cursor-pointer hover:border-primary transition-all group hover-lift">
        <div className="size-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined !text-[22px] filled">
            lightbulb
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.2em]">
            ForgeAI Tip
          </span>
          <span className="text-sm font-bold text-gh-text group-hover:text-amber-500 transition-colors">
            Optimizing Prompt Chains
          </span>
        </div>
      </div>
    </div>
  );
};

export default LearnGrow;

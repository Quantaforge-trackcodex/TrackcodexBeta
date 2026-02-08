import React from "react";
import { useNavigate } from "react-router-dom";

const Highlights = () => {
  const navigate = useNavigate();

  return (
    <div className="font-display">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-amber-500 filled !text-xl">
          bolt
        </span>
        <h3 className="text-[16px] font-black uppercase tracking-tight text-gh-text">
          Highlights
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Community Highlight */}
        <div
          onClick={() => navigate("/community")}
          className="p-8 bg-gh-bg-secondary border border-gh-border rounded-2xl group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-primary/5"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              Top Community Post
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-black text-xs bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              <span className="material-symbols-outlined !text-[16px]">
                arrow_upward
              </span>{" "}
              342
            </div>
          </div>
          <h4 className="text-[17px] font-bold text-gh-text group-hover:text-primary transition-colors leading-snug">
            Guide: Implementing Zero-Trust with Rust in 2024
          </h4>
        </div>

        {/* Best Project Highlight */}
        <div
          onClick={() => navigate("/repo/rust-crypto-guard")}
          className="p-8 bg-gh-bg-secondary border border-gh-border rounded-2xl group hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/5"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
              Best Project
            </span>
            <span className="material-symbols-outlined text-emerald-500 filled !text-[20px]">
              check_circle
            </span>
          </div>
          <h4 className="text-[17px] font-bold text-gh-text group-hover:text-emerald-500 transition-colors uppercase tracking-tight leading-none mb-2">
            rust-crypto-guard
          </h4>
          <p className="text-xs text-gh-text-secondary font-bold uppercase tracking-widest">
            Used by 1.2k developers
          </p>
        </div>

        {/* Gig Highlight */}
        <div
          onClick={() => navigate("/dashboard/jobs")}
          className="p-8 bg-gh-bg-secondary border border-gh-border rounded-2xl group hover:border-amber-500/50 transition-all cursor-pointer shadow-lg hover:shadow-amber-500/5"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">
              Featured Gig
            </span>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-black rounded border border-amber-500/20 uppercase tracking-widest">
              Open
            </span>
          </div>
          <h4 className="text-[17px] font-bold text-gh-text group-hover:text-amber-500 transition-colors uppercase tracking-tight leading-none mb-2">
            Security Audit for DeFi Protocol
          </h4>
          <p className="text-xs text-gh-text-secondary font-bold uppercase tracking-widest">
            High Value Contract
          </p>
        </div>
      </div>
    </div>
  );
};

export default Highlights;

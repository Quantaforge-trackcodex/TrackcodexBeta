import React from "react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const DATA = [
  { value: 40 },
  { value: 65 },
  { value: 85 },
  { value: 50 },
  { value: 95 },
];

const ForgeAIUsage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gh-bg-secondary border border-gh-border rounded-3xl p-8 flex flex-col shadow-xl group hover:border-cyan-500/30 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-cyan-400 filled !text-[22px]">
            auto_awesome
          </span>
          <h3 className="text-[15px] font-black text-gh-text tracking-tight uppercase">
            ForgeAI Usage
          </h3>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="px-3 py-1 bg-cyan-400/5 border border-cyan-400/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:bg-cyan-400 hover:text-white transition-all"
        >
          Pro
        </button>
      </div>

      <div className="h-32 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA}>
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === DATA.length - 1
                      ? "#22d3ee"
                      : "var(--gh-bg-tertiary)"
                  }
                  className="transition-all hover:fill-cyan-400 cursor-help"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gh-border/50">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gh-text-secondary uppercase tracking-widest mb-1">
            856 SESSIONS
          </span>
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold text-gh-text-secondary uppercase">
              Operational
            </span>
          </div>
        </div>
        <span className="text-[15px] font-black text-cyan-400 uppercase tracking-tight shadow-cyan-400/10 drop-shadow-md">
          32% Code AI-Assisted
        </span>
      </div>
    </div>
  );
};

export default ForgeAIUsage;

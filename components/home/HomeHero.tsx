
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const HomeHero = () => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setAiOutput(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are TrackCodex Assistant, an expert engineering co-pilot. The user has given this task or question: "${prompt}". 
        
        Provide a sharp, technical, and actionable response that helps them start this task. 
        If it's a code request, provide a concise snippet. 
        If it's a project plan request, provide a step-by-step checklist.
        Keep it brief and professional.`,
        config: {
            temperature: 0.7,
            maxOutputTokens: 500,
            thinkingConfig: { thinkingBudget: 100 }
        }
      });
      
      setAiOutput(response.text);
    } catch (err) {
      console.error("Home AI Error:", err);
      setAiOutput("I encountered an error while processing your request. Please ensure your API key is configured correctly.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <span className="material-symbols-outlined text-[120px] text-primary filled">auto_awesome</span>
      </div>
      
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2 text-primary">
           <span className="material-symbols-outlined !text-[18px] filled animate-pulse">auto_awesome</span>
           <span className="text-[13px] font-black uppercase tracking-widest">Ask TrackCodex or start a task...</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:border-slate-500 transition-all">
              <span className="text-[11px] font-bold text-slate-400">Gemini 3 Flash</span>
              <span className="material-symbols-outlined !text-[16px] text-slate-500">expand_more</span>
           </div>
           <button 
             onClick={() => setAiOutput(null)}
             className="text-slate-500 text-xs font-bold hover:text-white transition-colors"
           >
             Clear Workspace
           </button>
        </div>
      </div>

      <div className="relative mb-6 z-10">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAskAI())}
          placeholder="Describe the app you want to build or the bug you need to fix..."
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-5 text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[140px] resize-none text-[15px] font-medium shadow-inner"
        />
        <div className="absolute right-4 bottom-4">
           <button 
             onClick={handleAskAI}
             disabled={isAnalyzing || !prompt.trim()}
             className="size-11 bg-primary hover:bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all active:scale-95 group/btn disabled:opacity-50"
           >
              <span className={`material-symbols-outlined group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${isAnalyzing ? 'animate-spin' : ''}`}>
                {isAnalyzing ? 'progress_activity' : 'send'}
              </span>
           </button>
        </div>
      </div>

      {aiOutput && (
        <div className="mb-6 p-6 bg-primary/5 border border-primary/20 rounded-2xl animate-in slide-in-from-top-4 duration-500 relative z-10">
          <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined !text-[16px] filled">auto_awesome</span>
            AI Assistance Protocol Active
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-medium">
            {aiOutput.split('\n').map((line, i) => (
                <p key={i} className="mb-3 last:mb-0">{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 relative z-10">
         {[
           { label: 'Fix security issues', icon: 'shield' },
           { label: 'Start new project', icon: 'rocket_launch' },
           { label: 'Summarize health', icon: 'health_and_safety' },
           { label: 'Raise job', icon: 'work' }
         ].map((chip) => (
           <button 
             key={chip.label}
             onClick={() => { setPrompt(chip.label); }}
             className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-500 transition-all"
           >
              <span className="material-symbols-outlined !text-[16px]">{chip.icon}</span>
              {chip.label}
           </button>
         ))}
      </div>
    </div>
  );
};

export default HomeHero;

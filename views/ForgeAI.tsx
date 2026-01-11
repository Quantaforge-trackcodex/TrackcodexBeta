
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ForgeAIView = () => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ type: string; content: string }[]>([]);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are ForgeAI, an advanced engineering co-pilot. Help the user with technical questions, code reviews, and project planning.',
          temperature: 0.7,
        }
      });
      
      setResults(prev => [{ type: 'AI', content: response.text || 'No response.' }, ...prev]);
      setPrompt('');
    } catch (error) {
      console.error(error);
      setResults(prev => [{ type: 'Error', content: 'Failed to connect to AI services.' }, ...prev]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] font-display">
      <div className="p-8 border-b border-[#1e293b]">
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary filled">auto_awesome</span>
          ForgeAI Insights
        </h1>
        <p className="text-slate-500 text-sm mt-1">Your advanced engineering co-pilot for code analysis and project strategy.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {results.length === 0 && (
            <div className="py-20 text-center">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                <span className="material-symbols-outlined !text-[40px] filled">psychology</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">How can I assist you today?</h2>
              <p className="text-slate-500 max-w-sm mx-auto">Ask about architecture, security vulnerabilities, or refactoring opportunities in your current workspace.</p>
            </div>
          )}

          {results.map((res, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${res.type === 'Error' ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-border-dark bg-[#161b22] text-slate-300'}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-xs filled text-primary">auto_awesome</span>
                <span className="text-[10px] font-black uppercase tracking-widest">ForgeAI Response</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                {res.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-[#161b22] border-t border-[#30363d]">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAsk())}
            placeholder="Ask ForgeAI for technical insights or security analysis..."
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl p-5 pr-20 text-slate-200 focus:ring-1 focus:ring-primary outline-none min-h-[100px] resize-none"
          />
          <button
            onClick={handleAsk}
            disabled={isAnalyzing || !prompt.trim()}
            className="absolute right-4 bottom-4 size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            <span className={`material-symbols-outlined ${isAnalyzing ? 'animate-spin' : ''}`}>
              {isAnalyzing ? 'progress_activity' : 'send'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgeAIView;

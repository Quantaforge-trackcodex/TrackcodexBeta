
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REPOS } from '../constants';
import ContributionHeatmap from '../components/profile/ContributionHeatmap';

const RepoDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const repo = MOCK_REPOS.find(r => r.id === id) || MOCK_REPOS[0];
  const [activeTab, setActiveTab] = useState('Code');

  const tabs = ['Code', 'Commits', 'Issues', 'Pull Requests', 'Actions', 'Insights', 'Settings'];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-8 font-display">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-primary shadow-xl">
              <span className="material-symbols-outlined !text-[32px] filled">hub</span>
            </div>
            <div>
               <div className="flex items-center gap-2">
                 <span className="text-xl text-[#58a6ff] hover:underline cursor-pointer font-bold" onClick={() => navigate('/repositories')}>track-codex</span>
                 <span className="text-xl text-slate-500">/</span>
                 <span className="text-xl text-white font-black uppercase tracking-tight">{repo.name}</span>
               </div>
               <div className="flex items-center gap-3 mt-1">
                 <span className="px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                   <span className="material-symbols-outlined !text-[12px] filled">verified</span>
                   Verified Safe
                 </span>
                 <span className="text-[10px] text-slate-500 font-mono">Synced {repo.lastUpdated}</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border border-[#30363d] rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all">
                <span className="material-symbols-outlined !text-[18px]">star</span>
                Star <span className="ml-1 opacity-50">{repo.stars}</span>
             </button>
          </div>
        </div>

        <div className="flex items-center gap-8 border-b border-[#30363d] mb-8 overflow-x-auto no-scrollbar">
           {tabs.map((tab) => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab)}
               className={`flex items-center gap-2 px-1 py-4 text-[13px] font-bold border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === tab ? 'text-white border-[#f78166]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
             >
                {tab}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
           <div className="space-y-6 min-w-0">
              {activeTab === 'Code' && (
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
                   <div className="p-4 bg-black/20 border-b border-[#30363d] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/seed/alex/32" className="size-6 rounded-full border border-white/10" />
                        <p className="text-[13px] text-slate-300"><span className="font-bold text-white">alex-coder</span> updated CI pipeline configuration • 12m ago</p>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">main / root</span>
                   </div>
                   <div className="divide-y divide-[#30363d]">
                      {['src', 'public', 'package.json', 'README.md'].map(file => (
                        <div key={file} className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer group">
                           <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">
                                {file.includes('.') ? 'description' : 'folder'}
                              </span>
                              <span className="text-sm text-slate-200">{file}</span>
                           </div>
                           <span className="text-xs text-slate-600 group-hover:text-slate-400">Updated 2 days ago</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
              {activeTab === 'Insights' && <ContributionHeatmap />}
           </div>

           <div className="space-y-8">
              <section className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                 <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Repo Ecosystem</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-slate-500">ForgeAI Health</span>
                       <span className="text-sm font-black text-emerald-500">{repo.aiHealth}</span>
                    </div>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RepoDetailView;

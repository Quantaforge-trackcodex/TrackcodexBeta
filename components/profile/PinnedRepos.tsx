import React from 'react';
import { useNavigate } from 'react-router-dom';

const REPOS = [
  { 
    displayName: 'RUST-CR...',
    id: 'rust-crypto-guard', 
    desc: 'High-performance cryptographic primitives for secure...', 
    lang: 'Rust', 
    langColor: '#f97316', 
    stars: '1.2k', 
    forks: 142,
    health: 'A+',
    assist: '45%'
  },
  { 
    displayName: 'FORGE-AI...',
    id: 'forge-ai-security',
    desc: 'Automated vulnerability scanning pipeline leveraging LLMs for co...', 
    lang: 'Python', 
    langColor: '#135bec', 
    stars: '856', 
    forks: 89,
    health: 'A',
    assist: '90%'
  }
];

const PinnedRepos = () => {
  const navigate = useNavigate();

  return (
    <div className="font-display">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <span className="material-symbols-outlined text-slate-500 !text-[20px]">bookmark</span>
           <h3 className="text-[14px] font-black uppercase tracking-widest text-white">Pinned Repositories</h3>
        </div>
        <button className="text-[11px] font-black uppercase text-primary tracking-widest hover:underline transition-all">Customize pins</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPOS.map(repo => (
          <div 
            key={repo.id} 
            onClick={() => navigate(`/repo/${repo.id}`)}
            className="p-6 bg-[#161b22] border border-[#30363d] rounded-2xl group hover:border-[#8b949e] transition-all cursor-pointer flex flex-col shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-slate-500 !text-[20px] shrink-0">book</span>
                <h4 className="text-[14px] font-bold text-primary group-hover:underline truncate">{repo.displayName}</h4>
                <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[9px] text-slate-500 font-black uppercase tracking-widest shrink-0">Public</span>
              </div>
              <div className={`size-8 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 shadow-md
                ${repo.health.startsWith('A') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                 {repo.health}
              </div>
            </div>
            
            <p className="text-[14px] text-slate-400 leading-normal mb-6 h-12 line-clamp-2 font-medium italic">
              "{repo.desc}"
            </p>

            <div className="flex items-center gap-5 text-[12px] text-slate-500 mt-auto font-bold">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: repo.langColor }}></div>
                <span className="text-slate-400 uppercase text-[11px] font-black tracking-wider">{repo.lang}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-[16px]">star</span>
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-[16px]">fork_right</span>
                <span>{repo.forks}</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-emerald-400 font-black">
                 <span className="material-symbols-outlined !text-[16px] filled">auto_fix_high</span>
                 <span>{repo.assist}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedRepos;
import React, { useState, useEffect } from 'react';
import { MOCK_REPOS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Repository } from '../types';
import CreateRepoModal from '../components/repositories/CreateRepoModal';

const AIHealthIndicator = ({ score, label }: { score: string; label: string }) => {
  const getColors = () => {
    if (score.startsWith('A')) return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score.startsWith('B')) return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
  };
  const colors = getColors();
  
  return (
    <div className="flex items-center gap-3">
      <div className={`size-10 rounded-full border-2 ${colors.border} flex items-center justify-center font-black text-xs ${colors.text} ${colors.bg}`}>
        {score}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Health</span>
        <span className={`text-[11px] font-bold ${colors.text}`}>{label}</span>
      </div>
    </div>
  );
};

const SecurityIndicator = ({ status }: { status: string }) => {
  const isPassing = status === 'Passing';
  return (
    <div className="flex items-center gap-3">
      <div className={`size-10 rounded-full border-2 ${isPassing ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'} flex items-center justify-center`}>
        <span className="material-symbols-outlined !text-[20px] filled">{isPassing ? 'verified' : 'error'}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security</span>
        <span className={`text-[11px] font-bold ${isPassing ? 'text-slate-300' : 'text-rose-400'}`}>{status}</span>
      </div>
    </div>
  );
};

const Repositories = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Repos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [repos, setRepos] = useState<Repository[]>(() => {
    try {
      const saved = localStorage.getItem('trackcodex_local_repos');
      return saved ? JSON.parse(saved) : MOCK_REPOS;
    } catch (e) {
      console.error("Failed to parse local repos from localStorage", e);
      return MOCK_REPOS;
    }
  });

  const renderMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-black/20 px-1.5 py-0.5 rounded text-xs font-mono text-amber-400">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
  };

  const handleCreateRepo = (newRepoData: Partial<Repository>) => {
    const newRepo = {
      ...newRepoData,
      isPublic: newRepoData.visibility === 'PUBLIC',
    } as Repository;
    
    const updated = [newRepo, ...repos];
    setRepos(updated);
    localStorage.setItem('trackcodex_local_repos', JSON.stringify(updated));
    setIsModalOpen(false);
    
    window.dispatchEvent(new CustomEvent('trackcodex-notification', {
      detail: {
        title: 'Repository Initialized',
        message: `${newRepo.name} has been created and indexed on the Gitea cluster.`,
        type: 'success'
      }
    }));
  };

  const filteredRepos = repos.filter(repo => {
    if (filter === 'Public') return repo.visibility === 'PUBLIC';
    if (filter === 'Private') return repo.visibility === 'PRIVATE';
    return true;
  });

  return (
    <div className="p-8 font-display">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Dashboard</h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Your dashboard for all repositories. Track AI-driven health scores, compliance metrics, and deployment readiness.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <span className="material-symbols-outlined !text-[20px]">add</span>
            New Repository
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] p-1 rounded-xl">
            {['All Repos', 'Public', 'Private', 'Sources', 'Forks'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  filter === f ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-primary transition-colors">search</span>
                <input className="bg-[#161b22] border border-[#30363d] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:ring-1 focus:ring-primary w-64 outline-none" placeholder="Filter repositories..." />
             </div>
             <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-xl p-0.5">
               <button className="size-8 flex items-center justify-center bg-[#2d333b] text-white rounded-lg shadow-sm">
                 <span className="material-symbols-outlined !text-[20px]">grid_view</span>
               </button>
               <button className="size-8 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                 <span className="material-symbols-outlined !text-[20px]">list</span>
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-primary/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all min-h-[300px] animate-in fade-in duration-500"
          >
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-6 border border-primary/20">
              <span className="material-symbols-outlined !text-[36px] text-primary">add</span>
            </div>
            <h3 className="text-xl font-black text-primary mb-2 uppercase tracking-tight">Create new repository</h3>
            <p className="text-[12px] text-slate-400 max-w-[240px] leading-relaxed font-medium">Start a new project or import an existing repository from another Git provider.</p>
          </div>

          {filteredRepos.map(repo => (
            <div 
              key={repo.id}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if ((e.target as HTMLElement).tagName !== 'A') {
                  navigate(`/repo/${repo.id}`);
                }
              }}
              className="group bg-[#161b22] border border-[#30363d] rounded-3xl p-7 hover:border-[#8b949e] transition-all flex flex-col relative overflow-hidden shadow-sm hover:shadow-2xl animate-in slide-in-from-bottom-2 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-[#0d1117] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all border border-[#30363d] overflow-hidden">
                    {repo.logo ? (
                      <img src={repo.logo} alt={`${repo.name} logo`} className="size-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined !text-[28px]">source</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-100 group-hover:text-primary transition-colors leading-none uppercase tracking-tight">{repo.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                       <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[9px] text-slate-500 font-black uppercase tracking-widest">{repo.visibility}</span>
                       <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">Updated {repo.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="text-[13px] text-slate-400 leading-relaxed mb-8 h-12 line-clamp-2 overflow-hidden font-medium prose prose-sm prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(repo.description) }}
              />

              <div className="grid grid-cols-2 gap-4 bg-[#0d1117] border border-[#30363d] p-5 rounded-2xl mb-8">
                <AIHealthIndicator score={repo.aiHealth} label={repo.aiHealthLabel} />
                <SecurityIndicator status={repo.securityStatus} />
              </div>

              <div className="mt-auto pt-6 border-t border-[#30363d]/50 flex items-center justify-between">
                <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: repo.techColor }}></div>
                    <span>{repo.techStack}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className="material-symbols-outlined !text-[16px]">star</span>
                     <span>{repo.stars}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/workspace/new');
                  }}
                  className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-primary/20 shadow-lg shadow-primary/5 active:scale-95"
                >
                  Launch Workspace
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateRepoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateRepo} 
      />
    </div>
  );
};

export default Repositories;
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REPOS } from '../constants';
import ContributionHeatmap from '../components/profile/ContributionHeatmap';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const commitHistoryData = [
  { name: 'Jan', commits: 45 },
  { name: 'Feb', commits: 52 },
  { name: 'Mar', commits: 38 },
  { name: 'Apr', commits: 65 },
  { name: 'May', commits: 48 },
  { name: 'Jun', commits: 72 },
  { name: 'Jul', commits: 85 },
];

const CodeDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('Local');
  const cloneUrl = "https://trackcodex.io/git/track-codex/core.git";

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-[#1c2128] border border-[#444c56] rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/50 overflow-hidden">
      <div className="p-4 border-b border-[#444c56] flex items-center justify-between">
        <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined !text-[16px]">terminal</span> Clone
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined !text-[16px]">close</span></button>
      </div>
      <div className="p-4">
        <div className="flex gap-4 border-b border-[#444c56] mb-4">
          {['Local', 'Codespaces'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`pb-2 text-xs font-medium transition-all relative ${activeTab === t ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {t}
              {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f78166]"></div>}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 mb-2">HTTPS clone URL</p>
        <div className="flex items-center bg-[#0d1117] border border-[#444c56] rounded-md px-2 py-1.5 mb-4 group focus-within:border-primary">
          <input readOnly value={cloneUrl} className="flex-1 bg-transparent border-none text-[11px] text-slate-300 focus:ring-0" />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(cloneUrl);
              window.dispatchEvent(new CustomEvent('trackcodex-notification', { detail: { title: 'Copied', message: 'Clone URL copied to clipboard.', type: 'info' } }));
            }}
            className="text-slate-500 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined !text-[16px]">content_copy</span>
          </button>
        </div>
        <button className="w-full py-2 bg-[#347d39] hover:bg-[#46954a] text-white text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 shadow-sm">
          <span className="material-symbols-outlined !text-[18px]">download</span> Download ZIP
        </button>
      </div>
      <div className="p-4 bg-[#22272e] border-t border-[#444c56]">
         <button 
          onClick={() => window.location.hash = '/editor'}
          className="w-full py-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2"
         >
           <span className="material-symbols-outlined !text-[18px]">terminal</span> Open with TrackCodex
         </button>
      </div>
    </div>
  );
};

const BranchSelector = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [filter, setFilter] = useState('');
  
  const branches = ['main', 'develop', 'feature/auth-fix', 'feature/ui-refactor', 'hotfix/api-latency', 'release/v2.4.0'];

  const filteredBranches = branches.filter(b => b.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 bg-[#21262d] border border-[#30363d] rounded-md text-[11px] font-bold text-slate-300 hover:bg-[#30363d] transition-all h-7"
      >
        <span className="material-symbols-outlined !text-[16px] text-slate-500">account_tree</span>
        <span className="truncate max-w-[120px]">{selectedBranch}</span>
        <span className="material-symbols-outlined !text-[14px] text-slate-500">expand_more</span>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-1 w-72 bg-[#1c2128] border border-[#444c56] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-[70] overflow-hidden ring-1 ring-black/50 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-3 border-b border-[#444c56] flex items-center justify-between bg-[#1c2128]">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Switch branches/tags</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined !text-[16px]">close</span></button>
            </div>
            <div className="p-2 bg-[#1c2128]">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 !text-[14px]">search</span>
                <input 
                  autoFocus
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter branches..." 
                  className="w-full bg-[#0d1117] border border-[#444c56] rounded-md pl-7 pr-3 py-1.5 text-[12px] text-white outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-600" 
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar py-1 bg-[#1c2128]">
              {filteredBranches.map(b => (
                <div 
                  key={b} 
                  onClick={() => { setSelectedBranch(b); setIsOpen(false); }} 
                  className="px-4 py-2.5 text-[12px] text-slate-300 hover:bg-primary hover:text-white cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <span className={selectedBranch === b ? 'font-black text-white' : 'font-medium'}>{b}</span>
                  {selectedBranch === b && <span className="material-symbols-outlined !text-[16px] text-primary group-hover:text-white">check</span>}
                </div>
              ))}
              {filteredBranches.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-slate-500 italic">No branches found</div>
              )}
            </div>
            <div className="p-3 bg-[#22272e] border-t border-[#444c56]">
               <button className="w-full py-1.5 bg-[#21262d] border border-[#30363d] text-slate-300 hover:text-white text-[11px] font-black uppercase tracking-widest rounded-md transition-all">
                  View all branches
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const RepoDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const repo = MOCK_REPOS.find(r => r.id === id) || MOCK_REPOS[0];
  const [activeTab, setActiveTab] = useState('Code');
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [watchStatus, setWatchStatus] = useState('Watch');

  const tabs = [
    { name: 'Code', icon: 'code' },
    { name: 'Commits', icon: 'history' },
    { name: 'Issues', icon: 'error_outline', badge: 14 },
    { name: 'Pull Requests', icon: 'rule', badge: 2 },
    { name: 'Actions', icon: 'play_circle' },
    { name: 'Insights', icon: 'monitoring' },
    { name: 'Settings', icon: 'settings' }
  ];

  const workflowRuns = [
    { id: '1', msg: 'Merge branch main', status: 'Success', time: '12m ago', workflow: 'Deploy Production', branch: 'main', author: 'Alex C.' },
    { id: '2', msg: 'fix: auth validation', status: 'Failure', time: '2h ago', workflow: 'Integration Tests', branch: 'develop', author: 'Sarah K.' },
    { id: '3', msg: 'chore: update docs', status: 'Success', time: '5h ago', workflow: 'Lint & Typecheck', branch: 'main', author: 'Alex C.' },
    { id: '4', msg: 'feat: add metrics engine', status: 'Running', time: 'Just now', workflow: 'Integration Tests', branch: 'feat/metrics', author: 'Marcus T.' },
    { id: '5', msg: 'docs: update README', status: 'Success', time: '1d ago', workflow: 'Lint & Typecheck', branch: 'main', author: 'Sarah K.' },
  ];

  const handleOpenFocusedEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/editor');
    window.dispatchEvent(new CustomEvent('trackcodex-notification', {
      detail: { title: 'Focused Mode', message: 'Entering focused editor environment.', type: 'info' }
    }));
  };

  return (
    <div className="font-display text-[#c9d1d9]">
      {/* GitHub Style Top Navigation Header */}
      <div className="bg-[#161b22] border-b border-[#30363d] pt-4">
        <div className="max-w-[1400px] mx-auto px-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#8b949e] !text-[20px]">book</span>
              <div className="flex items-center gap-3 text-xl">
                 <div className="flex items-center gap-1.5">
                   <span className="text-[#58a6ff] hover:underline cursor-pointer" onClick={() => navigate('/repositories')}>track-codex</span>
                   <span className="text-[#8b949e]">/</span>
                   <span className="text-[#58a6ff] font-bold hover:underline cursor-pointer uppercase tracking-tight">{repo.name}</span>
                 </div>
                 <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[11px] font-bold text-[#8b949e] uppercase tracking-widest bg-[#1c2128]">{repo.visibility}</span>
                 <BranchSelector className="ml-2" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <div className="flex bg-[#21262d] border border-[#30363d] rounded-md overflow-hidden shadow-sm h-7">
                  <button onClick={() => setWatchStatus(watchStatus === 'Watch' ? 'Unwatch' : 'Watch')} className="px-3 flex items-center gap-2 text-xs font-bold text-slate-300 hover:bg-[#30363d] border-r border-[#30363d] transition-all">
                     <span className="material-symbols-outlined !text-[18px] text-slate-400">visibility</span>
                     {watchStatus}
                  </button>
                  <button className="px-2 flex items-center bg-[#21262d] hover:bg-[#30363d] text-slate-400">
                    <span className="material-symbols-outlined !text-[14px]">expand_more</span>
                  </button>
               </div>

               <div className="flex bg-[#21262d] border border-[#30363d] rounded-md overflow-hidden shadow-sm h-7">
                  <button className="px-3 flex items-center gap-2 text-xs font-bold text-slate-300 hover:bg-[#30363d] border-r border-[#30363d] transition-all">
                     <span className="material-symbols-outlined !text-[18px] text-slate-400">fork_right</span>
                     Fork
                  </button>
                  <span className="px-3 flex items-center text-xs font-bold text-slate-300 bg-[#21262d] border-r border-[#30363d]">
                    {repo.forks}
                  </span>
               </div>

               <div className="flex bg-[#21262d] border border-[#30363d] rounded-md overflow-hidden shadow-sm h-7">
                  <button onClick={() => setIsStarred(!isStarred)} className="px-3 flex items-center gap-2 text-xs font-bold text-slate-300 hover:bg-[#30363d] border-r border-[#30363d] transition-all">
                     <span className={`material-symbols-outlined !text-[18px] ${isStarred ? 'text-amber-500 filled' : 'text-slate-400'}`}>star</span>
                     {isStarred ? 'Starred' : 'Star'}
                  </button>
                  <span className="px-3 flex items-center text-xs font-bold text-slate-300 bg-[#21262d] border-r border-[#30363d]">
                    {isStarred ? repo.stars + 1 : repo.stars}
                  </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
             {tabs.map((tab) => (
               <button 
                 key={tab.name} 
                 onClick={() => setActiveTab(tab.name)}
                 className={`flex items-center gap-2 px-3 py-2 text-[13px] font-medium border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === tab.name ? 'text-[#f0f6fc] border-[#f78166]' : 'text-[#8b949e] border-transparent hover:border-[#8b949e] hover:text-[#f0f6fc]'}`}
               >
                  <span className={`material-symbols-outlined !text-[18px] opacity-70 ${activeTab === tab.name ? 'text-[#f0f6fc]' : ''}`}>{tab.icon}</span>
                  {tab.name}
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#30363d] text-[10px] font-bold text-[#f0f6fc]">
                      {tab.badge}
                    </span>
                  )}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
           <div className="min-w-0">
              {activeTab === 'Code' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <BranchSelector />
                      <div className="flex items-center gap-3 ml-4 text-xs font-bold">
                        <span className="text-slate-100">1</span> <span className="text-[#8b949e]">branches</span>
                        <span className="text-slate-100 ml-2">1</span> <span className="text-[#8b949e]">tags</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 relative">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-xs font-bold text-slate-300 hover:bg-[#30363d] transition-all">Go to file</button>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-xs font-bold text-slate-300 hover:bg-[#30363d] transition-all">Add file</button>
                      <button 
                        onClick={() => setIsCodeOpen(!isCodeOpen)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#347d39] hover:bg-[#46954a] text-white text-xs font-bold rounded-md transition-all shadow-sm active:scale-95"
                      >
                         <span className="material-symbols-outlined !text-[18px]">code</span>
                         Code
                         <span className="material-symbols-outlined !text-[16px]">expand_more</span>
                      </button>
                      <CodeDropdown isOpen={isCodeOpen} onClose={() => setIsCodeOpen(false)} />
                    </div>
                  </div>

                  <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden mb-8">
                     <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src="https://picsum.photos/seed/alex/64" className="size-6 rounded-full border border-[#444c56]" alt="Author" />
                          <div className="flex items-center gap-1.5 text-xs">
                             <span className="font-bold text-slate-100 hover:text-primary hover:underline cursor-pointer">alex-coder</span>
                             <span className="text-slate-400">updated CI pipeline configuration •</span>
                             <span className="text-slate-400 hover:underline cursor-pointer">12m ago</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                           <span className="text-slate-400 font-mono text-[11px]">89c2a12</span>
                           <span className="text-slate-400 font-bold hover:text-primary cursor-pointer">82 commits</span>
                        </div>
                     </div>
                     <div className="divide-y divide-[#30363d]">
                        {[
                          { name: 'src', msg: 'Merge branch main into dev', time: 'Updated 2 days ago', type: 'folder' },
                          { name: 'public', msg: 'Initial public assets', time: 'Updated 2 days ago', type: 'folder' },
                          { name: 'package.json', msg: 'feat: add analytics deps', time: 'Updated 2 days ago', type: 'file' },
                          { name: 'README.md', msg: 'docs: update setup guide', time: 'Updated 2 days ago', type: 'file' }
                        ].map(file => (
                          <div 
                            key={file.name} 
                            onClick={() => navigate('/editor')}
                            className="flex items-center justify-between p-3 hover:bg-[#161b22] cursor-pointer group transition-colors"
                          >
                             <div className="flex items-center gap-3 min-w-[200px]">
                                <span className={`material-symbols-outlined !text-[20px] ${file.type === 'folder' ? 'text-[#85e89d]' : 'text-[#8b949e]'} group-hover:text-primary transition-colors`}>
                                  {file.type === 'folder' ? 'folder' : 'description'}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-[#f0f6fc] group-hover:text-[#58a6ff] hover:underline">{file.name}</span>
                                  <button 
                                    onClick={handleOpenFocusedEditor}
                                    className="opacity-0 group-hover:opacity-100 size-6 bg-[#21262d] border border-[#30363d] rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:border-primary transition-all shadow-lg"
                                    title="Open focused editor"
                                  >
                                    <span className="material-symbols-outlined !text-[16px]">open_in_full</span>
                                  </button>
                                </div>
                             </div>
                             <div className="flex-1 text-xs text-[#8b949e] truncate px-4 group-hover:text-[#f0f6fc] transition-colors">{file.msg}</div>
                             <div className="text-xs text-[#8b949e] text-right min-w-[120px]">{file.time}</div>
                          </div>
                        ))}
                     </div>
                  </div>
                </>
              )}

              {activeTab === 'Commits' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <BranchSelector />
                       <div className="h-4 w-px bg-[#30363d] mx-2"></div>
                       <span className="text-xs font-bold text-slate-300">82 Commits</span>
                    </div>
                  </div>
                  <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
                    <div className="p-3 bg-[#161b22] border-b border-[#30363d] text-xs font-bold text-[#8b949e]">Commits on Mar 12, 2024</div>
                    <div className="divide-y divide-[#30363d]">
                       {[
                         { msg: 'feat: add analytics reporting service', author: 'Alex C.', hash: '89c2a12', time: '12m ago' },
                         { msg: 'fix: resolve race condition in auth bridge', author: 'Sarah K.', hash: 'f29a1d4', time: '2h ago' },
                         { msg: 'docs: update deployment architecture', author: 'Alex C.', hash: 'e45b23d', time: '5h ago' }
                       ].map(commit => (
                         <div key={commit.hash} className="p-4 hover:bg-[#161b22] cursor-pointer group flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                               <p className="text-sm font-bold text-[#f0f6fc] group-hover:text-[#58a6ff]">{commit.msg}</p>
                               <div className="flex items-center gap-2">
                                  <img src={`https://picsum.photos/seed/${commit.author}/32`} className="size-4 rounded-full" />
                                  <span className="text-xs font-bold text-[#f0f6fc] hover:underline">{commit.author}</span>
                                  <span className="text-xs text-[#8b949e]">committed {commit.time}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="px-2 py-1 bg-[#21262d] border border-[#30363d] text-[11px] font-mono text-[#58a6ff] rounded group-hover:border-[#58a6ff] transition-all">{commit.hash}</span>
                               <span className="material-symbols-outlined text-[#8b949e] !text-[18px]">code</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Issues' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-md p-1">
                        <button className="px-3 py-1.5 bg-[#2d333b] text-white text-xs font-bold rounded shadow-sm">Filters</button>
                        <div className="relative group">
                           <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[#8b949e] !text-[16px]">search</span>
                           <input placeholder="is:issue is:open" className="bg-[#0d1117] border border-[#30363d] rounded pl-8 pr-3 py-1.5 text-xs text-white w-80 outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-xs font-bold rounded hover:bg-[#30363d]">Labels</button>
                        <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] text-xs font-bold rounded hover:bg-[#30363d]">Milestones</button>
                        <button className="px-3 py-1.5 bg-[#347d39] hover:bg-[#46954a] text-white text-xs font-bold rounded transition-all">New Issue</button>
                     </div>
                  </div>
                  <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
                     <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex items-center gap-4">
                        <span className="text-xs font-bold text-white flex items-center gap-1"><span className="material-symbols-outlined !text-[16px] text-[#3fb950]">error_outline</span> 14 Open</span>
                        <span className="text-xs font-medium text-[#8b949e] flex items-center gap-1 hover:text-[#f0f6fc] cursor-pointer"><span className="material-symbols-outlined !text-[16px]">check</span> 284 Closed</span>
                     </div>
                     <div className="divide-y divide-[#30363d]">
                        {[
                          { id: '#902', title: 'Performance hit on large data ingestion', author: 'Marcus T.', time: '2 days ago', labels: ['bug', 'high-priority'] },
                          { id: '#904', title: 'ForgeAI context window needs optimization', author: 'Alex C.', time: '5 hours ago', labels: ['enhancement'] },
                          { id: '#905', title: 'Missing documentation for gRPC bridge', author: 'Sarah K.', time: '1 hour ago', labels: ['docs'] }
                        ].map(issue => (
                          <div key={issue.id} className="p-4 hover:bg-[#161b22] cursor-pointer group flex items-start gap-3">
                             <span className="material-symbols-outlined text-[#3fb950] !text-[18px] mt-0.5">error_outline</span>
                             <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                   <p className="text-sm font-bold text-[#f0f6fc] group-hover:text-[#58a6ff]">{issue.title}</p>
                                   {issue.labels.map(l => (
                                     <span key={l} className="px-1.5 py-0.5 rounded-full border border-[#30363d] text-[10px] font-bold text-[#8b949e]">{l}</span>
                                   ))}
                                </div>
                                <p className="text-[11px] text-[#8b949e] mt-1">{issue.id} opened {issue.time} by {issue.author}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'Actions' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <div className="flex flex-col lg:flex-row gap-6">
                      <aside className="w-full lg:w-64 space-y-1">
                         <div className="flex items-center justify-between mb-4 px-2">
                           <h3 className="text-xs font-bold text-slate-100 uppercase tracking-tight">Workflows</h3>
                         </div>
                         <div className="p-2 bg-[#2d333b] rounded text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                            <span className="material-symbols-outlined !text-[18px]">list</span> All workflows
                         </div>
                         <div className="h-px bg-[#30363d] my-4"></div>
                         {['Deploy Production', 'Integration Tests', 'Lint & Typecheck', 'Security Audit'].map(w => (
                           <div key={w} className="p-2 hover:bg-[#161b22] rounded text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc] cursor-pointer flex items-center gap-2 group transition-colors">
                              <span className="material-symbols-outlined !text-[16px] opacity-50 group-hover:opacity-100">play_circle</span>
                              {w}
                           </div>
                         ))}
                      </aside>

                      <div className="flex-1 space-y-4">
                         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <div className="relative group flex-1">
                               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 !text-[16px] group-focus-within:text-primary transition-colors">search</span>
                               <input placeholder="Filter workflow runs" className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-primary transition-all" />
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-xs font-bold text-slate-300 hover:bg-[#30363d] transition-all">New workflow</button>
                            </div>
                         </div>

                         <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
                            <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                               <span className="text-xs font-bold text-white uppercase tracking-tight">5 workflow runs</span>
                               <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                                  <button className="hover:text-white flex items-center gap-1">Status <span className="material-symbols-outlined !text-[14px]">expand_more</span></button>
                                  <button className="hover:text-white flex items-center gap-1">Actor <span className="material-symbols-outlined !text-[14px]">expand_more</span></button>
                               </div>
                            </div>
                            <div className="divide-y divide-[#30363d]">
                               {workflowRuns.map(run => (
                                 <div key={run.id} className="p-4 hover:bg-[#161b22] cursor-pointer group flex items-start sm:items-center justify-between gap-4 transition-colors">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                       <div className="mt-1 sm:mt-0">
                                          {run.status === 'Success' && <span className="material-symbols-outlined text-[#3fb950] !text-[20px] filled">check_circle</span>}
                                          {run.status === 'Failure' && <span className="material-symbols-outlined text-[#f85149] !text-[20px] filled">cancel</span>}
                                          {run.status === 'Running' && <span className="material-symbols-outlined text-[#d29922] !text-[20px] animate-spin">progress_activity</span>}
                                       </div>
                                       <div className="min-w-0 flex-1">
                                          <div className="flex flex-wrap items-center gap-x-2">
                                             <h4 className="text-sm font-bold text-[#f0f6fc] group-hover:text-[#58a6ff] truncate">{run.msg}</h4>
                                             <span className="text-[11px] text-[#8b949e] font-mono px-1.5 py-0.5 bg-[#21262d] rounded"># {run.id}</span>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-[#8b949e]">
                                             <span className="font-bold text-slate-300 uppercase tracking-tight">{run.workflow}</span>
                                             <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-[14px]">account_tree</span> {run.branch}</span>
                                             <span className="flex items-center gap-1"><img src={`https://picsum.photos/seed/${run.author}/32`} className="size-3.5 rounded-full" /> {run.author}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                       <span className="text-[11px] text-[#8b949e]">{run.time}</span>
                                       <span className="material-symbols-outlined text-slate-600 !text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">more_vert</span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'Insights' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <span className="material-symbols-outlined text-emerald-500 filled !text-[20px]">calendar_month</span>
                      <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Repository Activity Heatmap</h3>
                    </div>
                    <div className="p-8 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl overflow-hidden group hover:border-[#8b949e] transition-all">
                      <ContributionHeatmap />
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <span className="material-symbols-outlined text-primary !text-[20px]">query_stats</span>
                      <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Commit Frequency (2024)</h3>
                    </div>
                    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-xl group hover:border-primary/30 transition-all">
                      <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={commitHistoryData}>
                            <defs>
                              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                            <XAxis dataKey="name" stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', fontSize: '12px', color: '#c9d1d9' }} />
                            <Area type="monotone" dataKey="commits" stroke="#58a6ff" strokeWidth={3} fillOpacity={1} fill="url(#colorCommits)" animationDuration={1500} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'Settings' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-[#30363d] pb-4 mb-4">
                     <h2 className="text-xl font-bold text-white">General Settings</h2>
                  </div>
                  <div className="space-y-6">
                     <section>
                        <h3 className="text-sm font-bold text-white mb-2">Repository name</h3>
                        <div className="flex gap-2">
                           <input defaultValue={repo.name} className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white w-96 outline-none focus:ring-1 focus:ring-primary" />
                           <button className="px-4 py-1.5 bg-[#21262d] border border-[#30363d] text-white text-xs font-bold rounded hover:bg-[#30363d]">Rename</button>
                        </div>
                     </section>
                     <div className="h-px bg-[#30363d]"></div>
                     <section>
                        <h3 className="text-sm font-bold text-[#f85149] mb-2">Danger Zone</h3>
                        <div className="border border-[#f85149]/30 rounded-lg overflow-hidden">
                           <div className="p-4 flex items-center justify-between border-b border-[#30363d]">
                              <div>
                                 <p className="text-sm font-bold text-white">Archive this repository</p>
                                 <p className="text-xs text-[#8b949e]">Mark this repository as read-only.</p>
                              </div>
                              <button className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] text-[#f85149] text-xs font-bold rounded hover:bg-[#f85149] hover:text-white transition-all">Archive</button>
                           </div>
                        </div>
                     </section>
                  </div>
                </div>
              )}
           </div>

           <div className="space-y-10">
              <section>
                 <h3 className="text-sm font-bold text-slate-100 mb-3 hover:text-primary cursor-pointer transition-colors flex items-center justify-between">
                    About
                    <span className="material-symbols-outlined !text-[18px] text-slate-500 hover:text-white">settings</span>
                 </h3>
                 <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {repo.description}
                 </p>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#58a6ff] cursor-pointer">
                       <span className="material-symbols-outlined !text-[18px]">link</span>
                       <span className="font-bold underline truncate">trackcodex.dev/docs/core</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                       <span className="material-symbols-outlined !text-[18px]">star</span>
                       <span className="font-bold text-slate-200">{repo.stars}</span> stars
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                       <span className="material-symbols-outlined !text-[18px]">fork_right</span>
                       <span className="font-bold text-slate-200">{repo.forks}</span> forks
                    </div>
                 </div>
              </section>

              <section className="pt-6 border-t border-[#30363d]">
                 <h3 className="text-sm font-bold text-slate-100 mb-3 uppercase tracking-tight">Repo Ecosystem</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between group cursor-help">
                       <span className="text-xs text-slate-400 font-bold">ForgeAI Health</span>
                       <span className="text-xs font-black text-[#3fb950] bg-[#3fb950]/10 px-2 py-0.5 rounded border border-[#3fb950]/20 group-hover:scale-110 transition-transform">{repo.aiHealth}</span>
                    </div>
                 </div>
              </section>

              <section className="pt-6 border-t border-[#30363d]">
                 <h3 className="text-sm font-bold text-slate-100 mb-3">Languages</h3>
                 <div className="h-2 w-full rounded-full flex overflow-hidden mb-4">
                    <div className="bg-[#3178c6] h-full" style={{ width: '85%' }}></div>
                    <div className="bg-[#f1e05a] h-full" style={{ width: '10%' }}></div>
                 </div>
                 <div className="grid grid-cols-2 gap-y-2">
                    <div className="flex items-center gap-2">
                       <div className="size-2 rounded-full bg-[#3178c6]"></div>
                       <span className="text-[11px] font-bold text-[#f0f6fc]">TypeScript</span>
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
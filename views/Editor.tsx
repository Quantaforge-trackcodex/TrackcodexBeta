import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { forgeAIService } from '../services/gemini';
import { colab } from '../services/websocket';
import { useForgeAI } from '../hooks/useForgeAI';
import Spinner from '../components/ui/Spinner';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
  gitStatus?: 'added' | 'modified' | 'untracked';
}

const FILE_STRUCTURE: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: 'src/components',
        children: [
          { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx', gitStatus: 'modified' },
          { name: 'Card.tsx', type: 'file', path: 'src/components/Card.tsx' },
          { name: 'Input.tsx', type: 'file', path: 'src/components/Input.tsx', gitStatus: 'added' },
        ],
      },
      { name: 'services',
        type: 'folder',
        path: 'src/services',
        children: [
          { name: 'api.ts', type: 'file', path: 'src/services/api.ts' },
          { name: 'auth.ts', type: 'file', path: 'src/services/auth.ts' },
        ]
      },
      { name: 'App.tsx', type: 'file', path: 'src/App.tsx', gitStatus: 'modified' },
      { name: 'index.tsx', type: 'file', path: 'src/index.tsx' },
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
  { name: 'tsconfig.json', type: 'file', path: 'tsconfig.json' },
];

const MOCK_GRAPH_DATA = [
  { name: 'Mon', human: 12, ai: 4 },
  { name: 'Tue', human: 19, ai: 8 },
  { name: 'Wed', human: 15, ai: 18 },
  { name: 'Thu', human: 22, ai: 24 },
  { name: 'Fri', human: 30, ai: 42 },
  { name: 'Sat', human: 10, ai: 15 },
  { name: 'Sun', human: 8, ai: 5 },
];

const FileEntry = ({ node, depth, expandedFolders, onToggleFolder, activeFile, onSelectFile }: any) => {
  const isExpanded = expandedFolders.has(node.path);
  const isFolder = node.type === 'folder';
  const isActive = node.name === activeFile;

  const getGitColor = () => {
    if (node.gitStatus === 'added') return 'text-emerald-500';
    if (node.gitStatus === 'modified') return 'text-amber-500';
    return '';
  };

  return (
    <div className="select-none">
      <div 
        onClick={() => isFolder ? onToggleFolder(node.path) : onSelectFile(node.name)}
        style={{ paddingLeft: `${(depth * 12) + 12}px` }}
        className={`h-8 flex items-center gap-2 cursor-pointer transition-all group relative border-l-2 ${
          isActive 
            ? 'bg-primary/10 border-primary text-primary font-bold' 
            : 'border-transparent hover:bg-white/[0.03] text-gh-text-secondary hover:text-slate-200'
        }`}
      >
        <div className="w-4 flex items-center justify-center">
          {isFolder && <span className={`material-symbols-outlined !text-[16px] transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}>expand_more</span>}
        </div>
        <span className={`material-symbols-outlined !text-[18px] ${isFolder ? 'text-gh-text-secondary' : 'text-slate-500'} group-hover:scale-110 transition-transform`}>
          {isFolder ? (isExpanded ? 'folder_open' : 'folder') : 'description'}
        </span>
        <span className={`text-[12px] truncate flex-1 ${getGitColor()}`}>{node.name}</span>
        {node.gitStatus && (
          <span className={`text-[9px] font-black uppercase tracking-tighter opacity-60 group-hover:opacity-100 mr-2 ${getGitColor()}`}>
            {node.gitStatus === 'modified' ? 'MOD' : 'ADD'}
          </span>
        )}
      </div>
      {isFolder && isExpanded && node.children && (
        <div className="overflow-hidden">
          {node.children.map((child: any) => (
            <FileEntry 
              key={child.path} 
              node={child} 
              depth={depth + 1} 
              expandedFolders={expandedFolders} 
              onToggleFolder={onToggleFolder} 
              activeFile={activeFile} 
              onSelectFile={onSelectFile} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EditorView = () => {
  const navigate = useNavigate();
  const { getCompletion, isProcessing: aiProcessing } = useForgeAI();
  const [activeFile, setActiveFile] = useState('Button.tsx');
  const [showInsights, setShowInsights] = useState(true);
  const [codeContent, setCodeContent] = useState(`import React from 'react';
import { clsx } from 'clsx';

/**
 * High-fidelity Button component
 * Standardized across the TrackCodex ecosystem
 * Powered by ForgeAI Intelligence
 */
export const Button = ({ className, variant = 'primary', children, ...props }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-bold transition-all active:scale-95', 
        variant === 'primary' && 'bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20'
      )}
      {...props}
    >
      {children}
    </button>
  );
};`);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components']));
  const [remoteCursors, setRemoteCursors] = useState<any[]>([]);

  useEffect(() => {
    colab.connect('default-workspace');
    return colab.subscribe('REMOTE_CURSOR', (data) => {
      setRemoteCursors(prev => [...prev.filter(c => c.id !== data.id), data]);
    });
  }, []);

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  }, []);

  const lines = useMemo(() => codeContent.split('\n'), [codeContent]);

  const handleSuggest = async (lineIdx: number) => {
    const suggestion = await getCompletion({
      fileName: activeFile,
      code: codeContent,
      cursorLine: lineIdx
    });
    if (suggestion) {
       console.log('AI Suggestion:', suggestion);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gh-bg font-display animate-in fade-in duration-500">
      {/* Enhanced GitHub header */}
      <header className="h-14 border-b border-gh-border bg-gh-bg flex items-center justify-between px-6 shrink-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-gh-text font-semibold text-sm">
              <span className="material-symbols-outlined !text-[20px] text-gh-text-secondary">account_tree</span>
              <span className="text-primary hover:underline cursor-pointer font-bold">track-codex</span>
              <span className="text-gh-text-secondary">/</span>
              <span className="flex items-center gap-1.5 text-gh-text cursor-default">
                <span className="material-symbols-outlined !text-[16px] text-slate-500">description</span>
                {activeFile}
              </span>
           </div>
           <div className="flex items-center gap-2 bg-gh-bg-secondary border border-gh-border rounded-md px-2 py-0.5 text-[11px] font-bold text-gh-text-secondary">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              main
              <span className="material-symbols-outlined !text-[14px]">expand_more</span>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex -space-x-2 mr-4">
              {remoteCursors.map((c, i) => (
                <div 
                  key={c.id} 
                  className="size-7 rounded-full border-2 border-gh-bg bg-primary flex items-center justify-center text-[10px] font-black text-white shadow-xl hover:translate-y-[-2px] transition-transform cursor-help" 
                  title={`${c.name} (Collaborating)`}
                  style={{ zIndex: 10 - i }}
                >
                   {c.name[0]}
                </div>
              ))}
              <button className="size-7 rounded-full border-2 border-gh-border bg-gh-bg-secondary flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-[14px]">add</span>
              </button>
           </div>
           <button 
            onClick={() => setShowInsights(!showInsights)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-all text-[12px] font-black uppercase tracking-widest active:scale-95 ${
              showInsights 
                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(88,166,255,0.2)]' 
                : 'border-gh-border text-gh-text-secondary hover:text-white hover:border-gh-text-secondary'
            }`}
           >
             <span className={`material-symbols-outlined !text-[18px] ${showInsights ? 'filled' : ''}`}>analytics</span>
             Insights
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Explorer Panel */}
        <aside className="w-[280px] border-r border-gh-border bg-gh-bg flex flex-col shrink-0 animate-in slide-in-from-left duration-300">
          <div className="h-12 px-4 flex items-center justify-between border-b border-gh-border bg-gh-bg-secondary/50">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gh-text-secondary">Project Explorer</span>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-white/10 rounded text-gh-text-secondary"><span className="material-symbols-outlined !text-[16px]">create_new_folder</span></button>
              <button className="p-1 hover:bg-white/10 rounded text-gh-text-secondary"><span className="material-symbols-outlined !text-[16px]">refresh</span></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
            {FILE_STRUCTURE.map(node => (
              <FileEntry 
                key={node.path} 
                node={node} 
                depth={0} 
                expandedFolders={expandedFolders} 
                onToggleFolder={toggleFolder} 
                activeFile={activeFile} 
                onSelectFile={setActiveFile} 
              />
            ))}
          </div>
        </aside>

        {/* Editor Central Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-gh-bg relative animate-in zoom-in-95 duration-500">
          <div className="m-4 rounded-xl border border-gh-border overflow-hidden flex flex-col bg-gh-bg shadow-2xl ring-1 ring-white/[0.02]">
            <div className="h-14 bg-gh-bg-secondary border-b border-gh-border flex items-center justify-between px-5">
              <div className="flex items-center gap-4">
                <img src="https://picsum.photos/seed/alex/64" className="size-7 rounded-full border border-gh-border shadow-sm" alt="Author" />
                <div className="flex flex-col">
                   <div className="flex items-center gap-1.5 text-[12px]">
                      <span className="font-bold text-gh-text hover:text-primary cursor-pointer transition-colors">alex-coder</span>
                      <span className="text-gh-text-secondary">optimized core performance path</span>
                   </div>
                   <span className="text-[10px] text-gh-text-secondary font-medium tracking-tight">15m ago • Committed via TrackCodex Enterprise</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                 <div className="flex items-center gap-2 bg-gh-bg border border-gh-border rounded-md px-3 py-1 text-[11px] font-mono text-gh-text-secondary shadow-inner">
                    <span className="material-symbols-outlined !text-[14px]">commit</span>
                    89c2a12
                 </div>
                 <div className="h-4 w-px bg-gh-border"></div>
                 <button className="flex items-center gap-1 text-[11px] font-black uppercase text-primary hover:underline">
                    122 commits
                 </button>
              </div>
            </div>

            <div className="bg-gh-bg flex flex-col">
               <div className="h-11 bg-gh-bg flex items-center border-b border-gh-border shrink-0 px-5">
                  <div className="flex items-center gap-8 text-[12px] font-bold h-full">
                     <span className="cursor-pointer border-b-2 border-primary h-full flex items-center px-1 text-gh-text">Code</span>
                     <span className="text-gh-text-secondary hover:text-gh-text cursor-pointer h-full flex items-center px-1 transition-colors">Blame</span>
                     <span className="text-gh-text-secondary hover:text-gh-text cursor-pointer h-full flex items-center px-1 transition-colors">History</span>
                     <span className="text-gh-text-secondary hover:text-gh-text cursor-pointer h-full flex items-center px-1 transition-colors">Raw</span>
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-3">
                     {aiProcessing && (
                       <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                         <Spinner size="sm" className="text-primary" />
                         <span className="text-[10px] font-black uppercase text-primary tracking-widest">ForgeAI Thinking</span>
                       </div>
                     )}
                     <button className="p-1.5 hover:bg-white/10 rounded-md text-gh-text-secondary transition-all" title="Copy to clipboard"><span className="material-symbols-outlined !text-[20px]">content_copy</span></button>
                     <button className="p-1.5 hover:bg-white/10 rounded-md text-gh-text-secondary transition-all" title="Download file"><span className="material-symbols-outlined !text-[20px]">download</span></button>
                  </div>
               </div>

               <div className="overflow-y-auto custom-scrollbar font-mono text-[13px] leading-6 bg-[#010409]">
                <div className="min-w-fit py-6">
                  {lines.map((line, i) => (
                    <div key={i} className="flex group relative hover:bg-primary/5 transition-colors">
                      <div className="w-14 shrink-0 flex items-center justify-end pr-4 text-gh-text-secondary select-none border-r border-gh-border bg-gh-bg-secondary/20 h-6">
                        <span className="text-[10px] font-bold opacity-40 group-hover:opacity-100 transition-opacity">{i + 1}</span>
                      </div>
                      <div className="flex-1 px-8 relative h-6 flex items-center">
                        <pre className="text-gh-text leading-none whitespace-pre select-all">{line || ' '}</pre>
                        <button 
                          onClick={() => handleSuggest(i)} 
                          className="absolute left-1 top-0 h-6 flex items-center opacity-0 group-hover:opacity-100 text-primary transition-all hover:scale-125 z-10"
                          title="Ask ForgeAI to complete"
                        >
                          <span className="material-symbols-outlined !text-[16px] filled shadow-sm">auto_awesome</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improved Insights Sidebar */}
        {showInsights && (
          <aside className="w-[400px] border-l border-gh-border bg-gh-bg flex flex-col shrink-0 animate-in slide-in-from-right duration-300 relative shadow-2xl z-20">
            <div className="h-14 border-b border-gh-border flex items-center bg-gh-bg-secondary/50 px-6 justify-between">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gh-text">Repository Pulse</h3>
               <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                 <span className="material-symbols-outlined !text-[12px] filled">verified</span>
                 HEALTHY
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
               {/* Multi-series activity graph */}
               <section className="animate-in slide-in-from-bottom-2 duration-700">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h4 className="text-[10px] font-black uppercase text-gh-text-secondary tracking-widest">Commit Velocity</h4>
                    <span className="text-[9px] font-black text-emerald-500 uppercase">+18% Efficiency boost</span>
                  </div>
                  <div className="h-56 w-full bg-gh-bg-secondary/30 border border-gh-border rounded-2xl p-4 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_GRAPH_DATA}>
                        <defs>
                          <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#58a6ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8957e5" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#8957e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} opacity={0.5} />
                        <XAxis dataKey="name" stroke="#484f58" fontSize={10} tickLine={false} axisLine={false} dy={5} />
                        <YAxis hide />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                          itemStyle={{ padding: '2px 0' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '10px' }} />
                        <Area type="monotone" name="Human Commits" dataKey="human" stroke="#58a6ff" strokeWidth={2} fillOpacity={1} fill="url(#colorHuman)" animationDuration={1500} />
                        <Area type="monotone" name="AI Suggestions" dataKey="ai" stroke="#8957e5" strokeWidth={2} fillOpacity={1} fill="url(#colorAI)" animationDuration={2000} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </section>

               {/* AI Intelligence Metrics Section */}
               <section className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-2xl relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
                  <div className="absolute -top-4 -right-4 size-40 bg-primary/10 rounded-full blur-[60px] animate-pulse"></div>
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg border border-primary/20">
                      <span className="material-symbols-outlined !text-[22px] filled">auto_awesome</span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">ForgeAI Matrix</h4>
                      <p className="text-[14px] font-black text-white">4 optimization paths</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-gh-text-secondary leading-relaxed font-medium relative z-10 mb-5">
                     Gemini 3.0 analyzed current module patterns. Detected redundant memoization in <span className="text-white font-bold">Button.tsx</span>.
                  </p>
                  <button className="w-full py-2.5 bg-primary text-gh-bg rounded-xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                     Review Logic Diff
                     <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                  </button>
               </section>

               {/* Collaborator Activity */}
               <section>
                  <h4 className="text-[10px] font-black uppercase text-gh-text-secondary tracking-widest mb-5 px-1 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary"></span>
                    Recent Activity
                  </h4>
                  <div className="space-y-4">
                     {[
                       { name: 'Sarah Chen', action: 'added tests for Input.tsx', time: '2h ago', img: 'sarah' },
                       { name: 'Marcus Thorne', action: 'merged pull request #42', time: '5h ago', img: 'marcus' },
                       { name: 'ForgeAI', action: 'autofixed 3 security flags', time: '1d ago', img: 'ai', isAI: true }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-3 group/item cursor-default">
                          <img src={`https://picsum.photos/seed/${item.img}/64`} className="size-8 rounded-full border border-gh-border group-hover/item:border-primary transition-colors" />
                          <div className="flex flex-col">
                             <p className="text-[11px] text-gh-text">
                                <span className={`font-bold hover:underline cursor-pointer ${item.isAI ? 'text-primary' : ''}`}>{item.name}</span> {item.action}
                             </p>
                             <span className="text-[9px] text-gh-text-secondary uppercase font-bold tracking-tight mt-0.5">{item.time}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </section>

               {/* Languages Breakdown */}
               <section className="pt-4">
                  <h4 className="text-[10px] font-black uppercase text-gh-text-secondary tracking-widest mb-4 px-1">Language Composition</h4>
                  <div className="h-2 w-full rounded-full flex overflow-hidden mb-5 bg-gh-border shadow-inner">
                    <div className="bg-[#3178c6] h-full transition-all duration-1000" style={{ width: '82.4%' }}></div>
                    <div className="bg-[#f1e05a] h-full transition-all duration-1000 delay-200" style={{ width: '15.1%' }}></div>
                    <div className="bg-white/10 h-full flex-1"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3">
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-[#3178c6] shadow-[0_0_8px_rgba(49,120,198,0.5)]"></div>
                          <span className="font-bold text-gh-text text-[11px]">TypeScript</span>
                        </div>
                        <span className="text-gh-text-secondary text-[10px] font-black tracking-widest">82.4%</span>
                     </div>
                     <div className="flex items-center justify-between px-2 border-l border-gh-border ml-2">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-[#f1e05a] shadow-[0_0_8px_rgba(241,224,90,0.5)]"></div>
                          <span className="font-bold text-gh-text text-[11px]">JavaScript</span>
                        </div>
                        <span className="text-gh-text-secondary text-[10px] font-black tracking-widest">15.1%</span>
                     </div>
                  </div>
               </section>
            </div>
            
            <div className="h-14 border-t border-gh-border bg-gh-bg-secondary/50 flex items-center px-6 shadow-lg">
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gh-text-secondary hover:text-white transition-all hover:translate-x-1 group">
                  <span className="material-symbols-outlined !text-[18px] opacity-70 group-hover:opacity-100">history</span>
                  View Full Audit Log
               </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default EditorView;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { forgeAIService } from '../services/gemini';
import { profileService } from '../services/profile';
import EditorCommentThread from '../components/editor/EditorCommentThread';

const BlameTooltip = ({ blame, position }: { blame: any, position: { top: number, left: number } }) => {
  if (!blame) return null;
  return (
    <div 
      className="fixed z-[100] w-64 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/50"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-start gap-3 mb-3">
        <img src={blame.avatar || `https://picsum.photos/seed/${blame.author}/32`} className="size-8 rounded-full border border-white/10" alt="" />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-white truncate">{blame.author}</p>
          <p className="text-[10px] text-slate-500">{blame.time} ({blame.fullDate || 'Oct 12, 2023'})</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-primary bg-primary/10 px-1 rounded border border-primary/20">{blame.hash}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commit</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
          {blame.message || 'Optimized rendering logic for high-fidelity interactive co-pilot components.'}
        </p>
      </div>
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
         <span>4 changes in this commit</span>
         <span className="text-primary hover:underline cursor-pointer">View Commit</span>
      </div>
    </div>
  );
};

const EditorView = () => {
  const [activeFile, setActiveFile] = useState('Button.tsx');
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['src', 'components']));
  const [searchQuery, setSearchQuery] = useState('');
  
  // View Modes
  const [viewMode, setViewMode] = useState<'code' | 'blame' | 'history'>('code');

  // Hover States for Blame
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{ blame: any, pos: { top: number, left: number } } | null>(null);

  // AI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  // Commenting States
  const [activeCommentLine, setActiveCommentLine] = useState<number | null>(null);
  const [commentsByLine, setCommentsByLine] = useState<Record<number, any[]>>({
    6: [
      {
        id: 'ec1',
        author: { name: 'Sarah Chen', username: 'sarah_backend', avatar: 'https://picsum.photos/seed/sarah/64' },
        text: 'We should probably extract this Spinner to a shared component instead of inlining it everywhere.',
        timestamp: '2h ago',
        replies: [
          {
            id: 'ec2',
            author: { name: 'Alex Chen', username: 'alexcoder', avatar: 'https://picsum.photos/seed/alexprofile/600' },
            text: '@sarah_backend Good point. I\'ll handle this in the next PR.',
            timestamp: '1h ago',
            replies: []
          }
        ]
      }
    ]
  });

  const codeContent = `import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean; // TODO: Refactor prop drilling
}

export const Button = ({
  className,
  variant = 'primary',
  isLoading,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-bold transition-all',
        variant === 'primary' && 'bg-primary text-white shadow-lg shadow-primary/20',
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};`;

  const lines = useMemo(() => codeContent.split('\n'), [codeContent]);

  // Enhanced Mock Blame Data
  const blameData = useMemo(() => [
    { hash: 'f29a1d4', author: 'Alex Chen', time: '2mo ago', color: 'bg-slate-700/20', message: 'Initial architecture setup', avatar: 'https://picsum.photos/seed/alex/32' },
    { hash: 'f29a1d4', author: 'Alex Chen', time: '2mo ago', color: 'bg-slate-700/20', message: 'Initial architecture setup' },
    { hash: 'f29a1d4', author: 'Alex Chen', time: '2mo ago', color: 'bg-slate-700/20', message: 'Initial architecture setup' },
    { hash: 'a1b2c3d', author: 'Sarah Chen', time: '1mo ago', color: 'bg-primary/10', message: 'Implement base UI primitives', avatar: 'https://picsum.photos/seed/sarah/32' },
    { hash: 'a1b2c3d', author: 'Sarah Chen', time: '1mo ago', color: 'bg-primary/10', message: 'Implement base UI primitives' },
    { hash: 'e5f6g7h', author: 'Alex Chen', time: '5d ago', color: 'bg-emerald-500/10', message: 'Fix: accessibility on buttons' },
    { hash: 'e5f6g7h', author: 'Alex Chen', time: '5d ago', color: 'bg-emerald-500/10', message: 'Fix: accessibility on buttons' },
    { hash: 'e5f6g7h', author: 'Alex Chen', time: '5d ago', color: 'bg-emerald-500/10', message: 'Fix: accessibility on buttons' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0', avatar: 'https://picsum.photos/seed/marcus/32' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
    { hash: 'j9k0l1m', author: 'Marcus Thorne', time: '2h ago', color: 'bg-amber-500/10', message: 'chore: updated styles for v2.4.0' },
  ], []);

  const handleAskAI = async () => {
    setIsGenerating(true);
    setShowInsight(true);
    setAiInsight(null);
    try {
      const result = await forgeAIService.getCodeRefactorSuggestion(codeContent, activeFile);
      setAiInsight(result);
    } catch (error) {
      setAiInsight("Unable to generate insight. Please check your connection and API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddComment = (text: string, line: number, parentId?: string) => {
    const profile = profileService.getProfile();
    const newComment = {
      id: `ec-${Date.now()}`,
      author: {
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar
      },
      text,
      timestamp: 'Just now',
      replies: []
    };

    setCommentsByLine(prev => {
      const lineComments = [...(prev[line] || [])];
      
      if (!parentId) {
        return { ...prev, [line]: [...lineComments, newComment] };
      }

      const recursiveAdd = (comments: any[]): any[] => {
        return comments.map(c => {
          if (c.id === parentId) {
            return { ...c, replies: [...(c.replies || []), newComment] };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: recursiveAdd(c.replies) };
          }
          return c;
        });
      };

      return { ...prev, [line]: recursiveAdd(lineComments) };
    });
  };

  const explorerData = useMemo(() => [
    { id: 'src', name: 'src', type: 'folder', depth: 0, parentId: null },
    { id: 'components', name: 'components', type: 'folder', depth: 1, parentId: 'src' },
    { id: 'Button.tsx', name: 'Button.tsx', type: 'file', depth: 2, parentId: 'components', icon: 'javascript', iconColor: 'text-blue-400' },
    { id: 'Card.tsx', name: 'Card.tsx', type: 'file', depth: 2, parentId: 'components', icon: 'javascript', iconColor: 'text-blue-400' },
    { id: 'Input.tsx', name: 'Input.tsx', type: 'file', depth: 2, parentId: 'components', icon: 'javascript', iconColor: 'text-blue-400' },
    { id: 'utils', name: 'utils', type: 'folder', depth: 1, parentId: 'src' },
    { id: 'package.json', name: 'package.json', type: 'file', depth: 0, parentId: null, icon: 'description', iconColor: 'text-slate-500' },
    { id: 'README.md', name: 'README.md', type: 'file', depth: 0, parentId: null, icon: 'info', iconColor: 'text-slate-500' },
  ], []);

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const collapseAll = () => {
    setOpenFolders(new Set());
  };

  const expandAll = () => {
    const allFolderIds = explorerData.filter(i => i.type === 'folder').map(i => i.id);
    setOpenFolders(new Set(allFolderIds));
  };

  const isFolderOpen = (folderId: string) => openFolders.has(folderId);

  const isItemVisible = (item: any) => {
    if (searchQuery.trim()) return true;
    let parentId = item.parentId;
    while (parentId) {
      if (!openFolders.has(parentId)) return false;
      const parent = explorerData.find(i => i.id === parentId);
      parentId = parent ? parent.parentId : null;
    }
    return true;
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return explorerData;
    const query = searchQuery.toLowerCase();
    const checkMatch = (item: any): boolean => {
      if (item.name.toLowerCase().includes(query)) return true;
      const children = explorerData.filter(child => child.parentId === item.id);
      return children.some(child => checkMatch(child));
    };
    return explorerData.filter(item => checkMatch(item));
  }, [searchQuery, explorerData]);

  const handleGutterMouseEnter = (e: React.MouseEvent, index: number) => {
    const blame = blameData[index];
    if (blame) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setTooltipData({
        blame,
        pos: { top: rect.top, left: rect.right + 10 }
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117] font-display">
      {/* Blame Tooltip Portal Overlay */}
      {tooltipData && <BlameTooltip blame={tooltipData.blame} position={tooltipData.pos} />}

      {/* Tab bar / Breadcrumbs */}
      <div className="h-10 border-b border-[#1e293b] flex items-center px-4 bg-[#0d1117] gap-3 shrink-0">
         <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <span>track-codex</span>
            <span className="text-[10px]">/</span>
            <span>frontend</span>
            <span className="text-[10px]">/</span>
            <span>src</span>
            <span className="text-[10px]">/</span>
            <span>components</span>
            <span className="text-[10px]">/</span>
            <div className="flex items-center gap-1.5 text-white bg-white/5 px-2 py-0.5 rounded border border-white/5">
               <span className="material-symbols-outlined !text-[14px] text-blue-400">javascript</span>
               <span className="font-bold">Button.tsx</span>
               <span className="text-[9px] font-black uppercase text-slate-500">TSX</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Explorer Sidebar */}
        <aside className="w-[240px] border-r border-[#1e293b] flex flex-col bg-[#0d1117] shrink-0">
           <div className="p-4 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Explorer</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={expandAll}
                  className="size-6 flex items-center justify-center rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                  title="Expand All Folders"
                >
                  <span className="material-symbols-outlined !text-[18px]">expand_all</span>
                </button>
                <button 
                  onClick={collapseAll}
                  className="size-6 flex items-center justify-center rounded hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                  title="Collapse All Folders"
                >
                  <span className="material-symbols-outlined !text-[18px]">collapse_all</span>
                </button>
                <span className="material-symbols-outlined !text-[18px] text-slate-500 cursor-pointer hover:text-white transition-colors">more_horiz</span>
              </div>
           </div>

           <div className="px-4 pb-4">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 !text-[16px]">search</span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files..."
                  className="w-full bg-[#161b22] border border-[#30363d] rounded-md pl-8 pr-2 py-1.5 text-[12px] text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              {filteredItems.map(item => {
                if (!isItemVisible(item)) return null;
                
                const paddingLeft = `${(item.depth * 12) + 12}px`;
                if (item.type === 'folder') {
                  const isOpen = isFolderOpen(item.id) || !!searchQuery.trim();
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-1.5 py-1 text-slate-400 cursor-pointer group hover:bg-white/5 transition-colors select-none" 
                      style={{ paddingLeft }} 
                      onClick={() => toggleFolder(item.id)}
                    >
                      <span className={`material-symbols-outlined !text-[18px] transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}>
                        expand_more
                      </span>
                      <span className={`material-symbols-outlined !text-[18px] ${isOpen ? 'text-amber-400' : 'text-slate-500'}`}>
                        {isOpen ? 'folder_open' : 'folder'}
                      </span>
                      <span className="text-[13px] font-medium group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                  );
                }
                return (
                  <div 
                    key={item.id} 
                    onClick={() => setActiveFile(item.id)} 
                    style={{ paddingLeft: `${(item.depth * 12) + 12 + 22}px` }} 
                    className={`flex items-center gap-2 py-1 cursor-pointer group border-l-2 transition-all ${activeFile === item.id ? 'bg-primary/10 border-primary text-white' : 'border-transparent text-slate-400 hover:bg-white/5'}`}
                  >
                    <span className={`material-symbols-outlined !text-[16px] ${item.iconColor}`}>{item.icon}</span>
                    <span className="text-[13px] font-medium">{item.name}</span>
                  </div>
                );
              })}
           </div>
        </aside>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b0e14] relative">
           {/* Code Toolbar */}
           <div className="h-14 border-b border-[#1e293b] flex items-center justify-between px-6 bg-[#0d1117] shrink-0">
              <div className="flex items-center gap-3">
                 <img src="https://picsum.photos/seed/u1/64" className="size-6 rounded-full border border-border-dark" alt="User" />
                 <p className="text-[13px] text-slate-400"><span className="font-bold text-white">jdoe</span> updated styling for primary variant • 2 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex items-center bg-[#161b22] border border-[#30363d] p-0.5 rounded-lg mr-2">
                    <button 
                      onClick={() => setViewMode('code')}
                      className={`px-3 py-1 text-[11px] font-bold rounded shadow-sm transition-all ${viewMode === 'code' ? 'bg-[#2d333b] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Code
                    </button>
                    <button 
                      onClick={() => setViewMode('blame')}
                      className={`px-3 py-1 text-[11px] font-bold rounded transition-all ${viewMode === 'blame' ? 'bg-[#2d333b] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Blame
                    </button>
                    <button 
                      onClick={() => setViewMode('history')}
                      className={`px-3 py-1 text-[11px] font-bold rounded transition-all ${viewMode === 'history' ? 'bg-[#2d333b] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      History
                    </button>
                 </div>
                 <button className="size-8 flex items-center justify-center bg-[#161b22] border border-[#30363d] rounded-lg text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined !text-[18px]">content_copy</span>
                 </button>
                 <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-[12px] font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all">
                    <span className="material-symbols-outlined !text-[18px]">open_in_new</span>
                    Open in Workspace
                 </button>
              </div>
           </div>

           {/* Editor Content */}
           <div className="flex-1 flex font-mono text-[14px] leading-relaxed relative bg-[#0d1117]">
              <div className="absolute top-6 right-8 z-30">
                 <button 
                  onClick={handleAskAI}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 disabled:opacity-50 disabled:scale-100"
                 >
                    <span className={`material-symbols-outlined !text-[16px] filled ${isGenerating ? 'animate-spin' : 'animate-pulse'}`}>
                      {isGenerating ? 'progress_activity' : 'auto_awesome'}
                    </span>
                    {isGenerating ? 'Analyzing...' : 'Ask AI to Explain'}
                 </button>
              </div>

              {/* Line Content Wrapper */}
              <div className="flex-1 flex overflow-hidden">
                {/* Line Numbers and Comment Indicators */}
                <div className="w-16 pt-6 flex flex-col items-center text-slate-700 bg-[#0d1117] select-none border-r border-[#1e293b] shrink-0">
                  {lines.map((_, i) => {
                    const n = i + 1;
                    const hasComments = !!commentsByLine[n] && commentsByLine[n].length > 0;
                    return (
                      <div key={n} className="h-6 flex items-center justify-end w-full px-2 group/line relative">
                        <span className={`text-[12px] tabular-nums mr-2 ${hasComments ? 'text-primary font-black' : ''}`}>{n}</span>
                        <button 
                          onClick={() => setActiveCommentLine(activeCommentLine === n ? null : n)}
                          className={`size-4 flex items-center justify-center rounded transition-all ${
                            hasComments ? 'text-primary bg-primary/10' : 'text-slate-700 hover:text-slate-400 opacity-0 group-hover/line:opacity-100'
                          }`}
                        >
                          <span className={`material-symbols-outlined !text-[14px] ${hasComments ? 'filled' : ''}`}>
                            {hasComments ? 'forum' : 'add_comment'}
                          </span>
                          {hasComments && (
                            <span className="absolute -top-1 -right-1 size-2.5 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-[#0d1117]">
                              {commentsByLine[n].length}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Git Blame Gutter (Visible only in blame mode) */}
                {viewMode === 'blame' && (
                  <div className="w-[200px] pt-6 flex flex-col bg-[#0d1117] border-r border-[#1e293b] shrink-0 select-none animate-in slide-in-from-left duration-300">
                    {lines.map((_, i) => {
                      const blame = blameData[i] || { hash: '-------', author: 'Unknown', time: '--', color: '' };
                      const isFirstInBlock = i === 0 || (blameData[i]?.hash !== blameData[i-1]?.hash);
                      
                      return (
                        <div 
                          key={i} 
                          onMouseEnter={(e) => handleGutterMouseEnter(e, i)}
                          onMouseLeave={() => setTooltipData(null)}
                          className={`h-6 flex items-center px-3 text-[10px] gap-2 border-l-2 transition-colors hover:bg-white/10 cursor-help ${blame.color} ${isFirstInBlock ? 'border-primary/50' : 'border-transparent'}`}
                        >
                          {isFirstInBlock ? (
                            <>
                              <span className="font-mono text-slate-500 shrink-0">{blame.hash}</span>
                              <span className="font-bold text-slate-300 truncate flex-1">{blame.author}</span>
                              <span className="text-slate-600 shrink-0">{blame.time}</span>
                            </>
                          ) : (
                            <div className="flex-1 border-l border-slate-800 ml-1 h-full opacity-30"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Code Content */}
                <div className="flex-1 pt-6 overflow-y-auto custom-scrollbar relative">
                  <div className="min-w-full inline-block pb-20">
                    {lines.map((line, i) => {
                      const n = i + 1;
                      const hasComments = !!commentsByLine[n] && commentsByLine[n].length > 0;
                      const isOpen = activeCommentLine === n;
                      const blame = blameData[i];

                      return (
                        <React.Fragment key={n}>
                          <div 
                            className={`h-6 px-8 relative group ${hasComments ? 'bg-primary/5' : 'hover:bg-white/[0.02]'}`}
                            onMouseEnter={() => setHoveredLineIndex(i)}
                            onMouseLeave={() => { setHoveredLineIndex(null); setTooltipData(null); }}
                          >
                            {hasComments && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                            
                            <div className="flex items-center">
                              <pre className="text-slate-300 whitespace-pre">{line}</pre>
                              
                              {/* Git Blame Ghost Text (GitLens style) */}
                              {hoveredLineIndex === i && blame && (
                                <span 
                                  onMouseEnter={(e) => handleGutterMouseEnter(e, i)}
                                  className="ml-8 text-[11px] text-slate-500/60 font-medium italic cursor-help hover:text-primary transition-colors flex items-center gap-2 select-none shrink-0"
                                >
                                   <span className="size-1 rounded-full bg-slate-700"></span>
                                   {blame.author}, {blame.time} • {blame.message?.slice(0, 40)}...
                                </span>
                              )}
                            </div>
                            
                            {/* Hover Plus Button for New Comments */}
                            {!hasComments && (
                              <button 
                                onClick={() => setActiveCommentLine(n)}
                                className="absolute left-1 top-1/2 -translate-y-1/2 size-4 bg-primary rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 shadow-lg"
                              >
                                <span className="material-symbols-outlined !text-[12px] font-black">add</span>
                              </button>
                            )}
                          </div>
                          
                          {(isOpen || (hasComments && !activeCommentLine)) && (
                            <div className="animate-in slide-in-from-top-1 duration-200">
                               <EditorCommentThread 
                                 lineNumber={n}
                                 comments={commentsByLine[n] || []}
                                 onAddComment={(text, parentId) => handleAddComment(text, n, parentId)}
                                 onClose={() => setActiveCommentLine(null)}
                               />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* AI Insight Popup Overlay */}
                  {showInsight && (
                    <div className="absolute top-12 left-12 right-12 z-40 animate-in slide-in-from-top-4 duration-300">
                      <div className="bg-[#161b22]/95 backdrop-blur-xl border border-primary/40 rounded-2xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 max-w-2xl mx-auto">
                        <div className="flex items-start gap-4">
                          <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
                             <span className="material-symbols-outlined !text-[32px] filled animate-pulse">psychology</span>
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center justify-between mb-2">
                               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">TrackCodex ForgeAI Analysis</h4>
                               <button onClick={() => setShowInsight(false)} className="text-slate-500 hover:text-white transition-colors">
                                  <span className="material-symbols-outlined !text-[18px]">close</span>
                                </button>
                             </div>
                             
                             {isGenerating ? (
                               <div className="space-y-3 pt-2">
                                 <div className="h-4 bg-slate-800 rounded-md w-3/4 skeleton"></div>
                                 <div className="h-4 bg-slate-800 rounded-md w-full skeleton"></div>
                                 <div className="h-4 bg-slate-800 rounded-md w-1/2 skeleton"></div>
                               </div>
                             ) : (
                               <div className="pt-2">
                                 <p className="text-[14px] text-slate-200 leading-relaxed font-medium mb-4">
                                    {aiInsight}
                                 </p>
                                 <div className="flex items-center gap-3">
                                    <button className="px-4 py-2 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all flex items-center gap-2">
                                       <span className="material-symbols-outlined !text-[16px]">rocket_launch</span>
                                       Apply Refactor
                                    </button>
                                    <button className="px-4 py-2 bg-transparent border border-[#30363d] text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-xl hover:text-white hover:bg-white/5 transition-all">
                                       Explain Complexity
                                    </button>
                                 </div>
                               </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer / Status bar */}
      <footer className="h-8 border-t border-[#1e293b] bg-[#0d1117] flex items-center justify-between px-4 text-[11px] text-slate-500 shrink-0">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <span className="material-symbols-outlined !text-[14px] text-emerald-500">check_circle</span>
               <span>Build Passing</span>
            </div>
            <div className="flex items-center gap-1.5">
               <span className="material-symbols-outlined !text-[14px]">account_tree</span>
               <span>main</span>
            </div>
            {Object.keys(commentsByLine).length > 0 && (
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined !text-[14px] filled">forum</span>
                <span>{Object.values(commentsByLine).flat().length} Code Comments</span>
              </div>
            )}
            {viewMode === 'blame' && (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-tight">
                <span className="material-symbols-outlined !text-[14px] filled">history</span>
                <span>Blame Gutter Active</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-500">
               <span className="material-symbols-outlined !text-[14px]">info</span>
               <span>Hover line for Blame details</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>TypeScript JSX</span>
            <span>v2.4.0</span>
         </div>
      </footer>
    </div>
  );
};

export default EditorView;

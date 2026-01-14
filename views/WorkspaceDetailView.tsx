
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiffEditor } from '@monaco-editor/react';
import Spinner from '../components/ui/Spinner';

// --- Sub-components for GitHub-like Utilitarian UI ---

const ActivityBarItem = ({ icon, label, active, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-12 h-12 flex items-center justify-center relative group transition-all ${active ? 'text-white border-l-2 border-primary bg-gh-bg-secondary' : 'text-gh-text-secondary hover:text-white hover:bg-white/5'}`}
    title={label}
  >
    <span className={`material-symbols-outlined !text-[22px] ${active ? 'filled' : ''}`}>{icon}</span>
    {badge && (
      <span className="absolute top-2 right-2 size-4 bg-primary text-gh-bg text-[9px] font-black rounded-full flex items-center justify-center border border-gh-bg">
        {badge}
      </span>
    )}
  </button>
);

const ExplorerSection = ({ title, count, children, defaultOpen = true }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col border-b border-gh-border last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 flex items-center px-4 hover:bg-gh-bg-secondary transition-colors text-[11px] font-bold text-gh-text-secondary gap-2 select-none"
      >
        <span className={`material-symbols-outlined !text-[16px] transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}>chevron_right</span>
        <span className="flex-1 text-left uppercase tracking-wider">{title}</span>
        {count !== undefined && <span className="text-[10px] opacity-60 bg-gh-bg px-1.5 rounded-full">{count}</span>}
      </button>
      {isOpen && <div className="pb-2 bg-gh-bg">{children}</div>}
    </div>
  );
};

const WorkspaceDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('database.config.ts');
  const [activePR, setActivePR] = useState('#453');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const leftContent = `import { Sareost } from 'testLocal';
import { C1aimDat } from 'api.cotentafivomemardate';
import ForgeA from 'origess';

export debw = {
  connection: {
    methods: 'connection pool',
    pav: 'sistemwt.passiowen.connection.pool',
    paq: 'slnarmut.asseimtensepteas'
  },
  metacoement: {
    writIid: 'applicationL',
    rename: 'string-contaimed',
    lintename: 'Scereipt',
    username: 'string'
  }
};`;

  const rightContent = `import { Evert } from 'testLocal';
import { ClaimAs } from 'api.contoi@emenardate';
import Forget from 'origess';

export debw = {
  connection: {
    methods: 'connection pool',
    pav: 'sistemwt.passiowen.connection.pool',
    paq: 'slnarmut.pass%asseptman'
  },
  metacoement: {
    writIid: 'applicationL',
    rename: 'string-contaimed',
    lintename: 'Scereipt',
    username: 'string',
    consicolorContnent: {
      enableId: "config.tsas",
      addressubtsd: 'amdroverest.pool',
    }
  }
};`;

  const handleMerge = () => {
    window.dispatchEvent(new CustomEvent('trackcodex-notification', {
      detail: { title: 'PR Integrated', message: 'Pull Request #453 successfully merged.', type: 'success' }
    }));
    navigate('/repositories');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gh-bg font-display overflow-hidden select-none">
      
      {/* GitHub-Style Breadcrumb/Header */}
      <header className="h-14 border-b border-gh-border bg-gh-bg flex items-center justify-between px-6 shrink-0 z-40">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-gh-text font-semibold text-sm">
              <span className="material-symbols-outlined !text-[20px] text-gh-text-secondary">account_tree</span>
              <span className="text-primary hover:underline cursor-pointer">TrackCodex</span>
              <span className="text-gh-text-secondary">/</span>
              <span className="text-primary hover:underline cursor-pointer">Core-API</span>
              <span className="ml-2 px-2 py-0.5 rounded-full border border-gh-border text-[11px] text-gh-text-secondary uppercase">main</span>
           </div>
           <div className="h-4 w-px bg-gh-border"></div>
           <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              CONNECTED
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex border border-gh-border rounded-md overflow-hidden h-8">
              <button className="px-3 text-xs font-bold text-gh-text hover:bg-gh-bg-secondary border-r border-gh-border flex items-center gap-1.5">
                 <span className="material-symbols-outlined !text-[18px]">star</span> Star
              </button>
              <button className="px-3 text-xs font-bold text-gh-text hover:bg-gh-bg-secondary">42</button>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Activity Bar (Side) */}
        <aside className="w-12 bg-vscode-sidebar flex flex-col border-r border-gh-border shrink-0 z-50">
           <ActivityBarItem icon="source_control" label="PRs" active />
           <ActivityBarItem icon="search" label="Search" />
           <ActivityBarItem icon="psychology" label="ForgeAI" badge={1} />
           <div className="mt-auto">
              <ActivityBarItem icon="settings" label="Settings" />
           </div>
        </aside>

        {/* Side Bar (PR Explorer) - Collapsible */}
        {isSidebarOpen && (
          <aside className="w-[300px] border-r border-gh-border bg-gh-bg flex flex-col shrink-0 animate-in slide-in-from-left duration-200">
            <div className="h-12 px-4 flex items-center justify-between border-b border-gh-border">
              <span className="text-[12px] font-bold text-gh-text">Pull Requests</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gh-text-secondary hover:text-gh-text transition-colors">
                <span className="material-symbols-outlined !text-[18px]">keyboard_double_arrow_left</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ExplorerSection title="Active" count={2}>
                 <div className={`px-4 py-3 mx-2 mt-2 rounded-md cursor-pointer transition-all border ${activePR === '#453' ? 'bg-gh-bg-secondary border-primary' : 'border-transparent hover:bg-white/5'}`} onClick={() => setActivePR('#453')}>
                    <div className="flex items-start gap-2">
                       <span className="material-symbols-outlined !text-[16px] text-emerald-500">rule</span>
                       <div className="min-w-0">
                          <h4 className="text-[13px] font-semibold text-gh-text truncate">#453: Fix memory leak in auth</h4>
                          <p className="text-[11px] text-gh-text-secondary mt-0.5">Updated 2h ago</p>
                       </div>
                    </div>
                 </div>
              </ExplorerSection>
            </div>
          </aside>
        )}

        {!isSidebarOpen && (
          <div className="w-1 border-r border-gh-border bg-gh-bg cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => setIsSidebarOpen(true)}></div>
        )}

        {/* Editor Main Section - NOW FULLY VISIBLE */}
        <main className="flex-1 flex flex-col min-w-0 bg-gh-bg relative">
          
          {/* Tab Bar */}
          <div className="h-10 bg-gh-bg flex items-center border-b border-gh-border shrink-0 overflow-x-auto no-scrollbar">
             {['database.config.ts', 'auth.module.ts'].map(tab => (
               <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-full px-5 flex items-center gap-2.5 text-[12px] font-medium border-r border-gh-border cursor-pointer transition-all ${activeTab === tab ? 'bg-gh-bg-secondary text-gh-text border-t-2 border-primary' : 'text-gh-text-secondary hover:bg-white/5'}`}
               >
                  <span className="material-symbols-outlined !text-[16px] text-primary">javascript</span>
                  {tab}
               </div>
             ))}
             <div className="flex-1"></div>
             <div className="px-4 h-full flex items-center gap-2 text-xs font-bold text-emerald-500">
                <span className="material-symbols-outlined !text-[18px]">verified</span>
                Ready to Merge
             </div>
          </div>

          {/* Monaco Diff Editor Section */}
          <div className="flex-1 overflow-hidden relative">
            <DiffEditor
              height="100%"
              language="typescript"
              original={leftContent}
              modified={rightContent}
              theme="vs-dark"
              options={{
                renderSideBySide: true,
                readOnly: true,
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                minimap: { enabled: true },
                automaticLayout: true,
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />
          </div>

          {/* Bottom Merge Control */}
          <div className="h-16 border-t border-gh-border bg-gh-bg-secondary flex items-center justify-between px-8 shrink-0 z-30 shadow-lg">
             <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                   <img src="https://picsum.photos/seed/u1/32" className="size-6 rounded-full border border-gh-border" />
                   <img src="https://picsum.photos/seed/u2/32" className="size-6 rounded-full border border-gh-border" />
                </div>
                <span className="text-[11px] font-semibold text-gh-text-secondary uppercase tracking-widest">2 Approvals • CI Passing</span>
             </div>
             <div className="flex gap-2">
                <button className="px-5 h-9 bg-gh-bg border border-gh-border text-gh-text rounded-md text-xs font-bold hover:bg-white/5 transition-all">Request Changes</button>
                <button 
                  onClick={handleMerge}
                  className="px-6 h-9 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined !text-[18px]">merge</span> Merge Pull Request
                </button>
             </div>
          </div>
        </main>
      </div>

      {/* VS Code-Style High-Fidelity Status Bar */}
      <footer className="h-6 bg-primary text-gh-bg flex items-center justify-between px-3 text-[10px] font-bold shrink-0 z-50">
         <div className="flex items-center gap-4 h-full">
            <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
               <span className="material-symbols-outlined !text-[15px]">account_tree</span>
               <span>main*</span>
            </div>
            <div className="flex items-center gap-2 hover:bg-white/10 px-2 h-full cursor-pointer">
               <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-[15px]">error_outline</span> 2</span>
               <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-[15px]">warning_amber</span> 1</span>
            </div>
         </div>
         <div className="flex items-center gap-4 h-full">
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">TypeScript JSX</div>
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer gap-1">
               <span className="material-symbols-outlined !text-[15px] filled">auto_awesome</span>
               ForgeAI: Active
            </div>
         </div>
      </footer>
    </div>
  );
};

export default WorkspaceDetailView;

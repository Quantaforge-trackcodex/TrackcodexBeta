import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Unused

// --- Sub-components for VS Code UI ---

const ActivityBarItem = ({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 flex items-center justify-center relative group transition-all ${active ? "text-white border-l-2 border-primary" : "text-gh-text-secondary hover:text-gh-text"}`}
    title={label}
  >
    <span
      className={`material-symbols-outlined !text-[24px] ${active ? "filled" : ""}`}
    >
      {icon}
    </span>
    {badge && (
      <span className="absolute top-2 right-2 size-4 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#333333]">
        {badge}
      </span>
    )}
  </button>
);

const ExplorerSection = ({
  title,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  count?: number;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 flex items-center px-4 hover:bg-gh-bg-secondary transition-colors text-[11px] font-black uppercase tracking-widest text-gh-text-secondary gap-2 select-none"
      >
        <span
          className={`material-symbols-outlined !text-[16px] transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}
        >
          expand_more
        </span>
        <span className="flex-1 text-left">{title}</span>
        {count !== undefined && (
          <span className="text-[10px] opacity-50">({count})</span>
        )}
      </button>
      {isOpen && <div className="pb-2">{children}</div>}
    </div>
  );
};

const QuickSelector = ({
  label,
  value,
  options,
  icon,
  subValue,
}: {
  label: string;
  value: string;
  options: string[];
  icon?: string;
  subValue?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gh-bg-secondary hover:bg-gh-bg-tertiary border border-gh-border px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-300 transition-all active:scale-95 shadow-sm"
      >
        <span className="text-gh-text-secondary font-medium">{label}:</span>
        <span className="text-white flex items-center gap-1.5">
          {icon && (
            <span className="material-symbols-outlined !text-[16px] text-slate-400">
              {icon}
            </span>
          )}
          {value}
          {subValue && (
            <span className="text-slate-500 font-normal ml-1">
              ({subValue})
            </span>
          )}
        </span>
        <span className="material-symbols-outlined !text-[16px] text-slate-500">
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#252526] border border-[#454545] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden ring-1 ring-black/50">
          <div className="p-3 border-b border-[#3c3c3c] bg-[#1e1e1e]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 !text-[14px]">
                search
              </span>
              <input
                autoFocus
                placeholder="Search..."
                className="w-full bg-[#3c3c3c] border-none text-[12px] rounded-md pl-7 pr-2 py-1.5 text-white outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 text-[12px] text-slate-300 hover:bg-primary hover:text-white cursor-pointer transition-colors flex items-center justify-between group/opt"
              >
                <span className="group-hover/opt:font-bold">{opt}</span>
                {opt === value && (
                  <span className="material-symbols-outlined !text-[16px] text-primary group-hover/opt:text-white">
                    check
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const WorkspaceDetailView = () => {
  // const navigate = useNavigate(); // Unused
  const [activeTab, setActiveTab] = useState("database.config.ts");
  const [activePR, setActivePR] = useState("#453");
  // const [rightPanel, setRightPanel] = useState<"ai" | "ci" | "approvals">("ai"); // Unused setter
  const [rightPanel] = useState<"ai" | "ci" | "approvals">("ai");
  const [viewMode] = useState<"split" | "unified">("split"); // Unused setter
  const [isSidebarOpen] = useState(true); // Unused setter

  // Mock code data reflecting the screenshot
  const leftLines = [
    "import { Sareost } from 'testLocal';",
    "import { C1aimDat } from 'api.cotentafivomemardate';",
    "import ForgeA from 'origess';",
    "",
    "export debw = {",
    "  connection: {",
    "    methods: 'connection pool',",
    "    pav: 'sistemwt.passiowen.connection.pool',",
    "    paq: 'slnarmut.asseimtensepteas'",
    "  },",
    "  metacoement: {",
    "    writIid: 'applicationL',",
    "    rename: 'string-contaimed',",
    "    lintename: 'Scereipt',",
    "    username: 'string'",
    "  }",
    "};",
  ];

  const rightLines = [
    "import { Evert } from 'testLocal';",
    "import { ClaimAs } from 'api.contoi@emenardate';",
    "import Forget from 'origess';",
    "",
    "export debw = {",
    "  connection: {",
    "    methods: 'connection pool',",
    "    pav: 'sistemwt.passiowen.connection.pool',",
    "    paq: 'slnarmut.pass%asseptman'",
    "  },",
    "  metacoement: {",
    "    writIid: 'applicationL',",
    "    rename: 'string-contaimed',",
    "    lintename: 'Scereipt',",
    "    username: 'string',",
    "    consicolorContnent: {",
    '      enableId: "config.tsas",',
    "      addressubtsd: 'amdroverest.pool',",
    "    }",
    "  }",
    "};",
  ];

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        console.log("Quick Open Triggered");
      }
      if (e.altKey && e.key === "n") {
        console.log("Next Diff");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-gh-bg font-display overflow-hidden select-none">
      {/* VS Code Context Top Bar */}
      <header className="h-14 border-b border-gh-border bg-gh-bg flex items-center justify-between px-4 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <QuickSelector
            label="Workspace"
            value="Core Services"
            options={[
              "Core Services",
              "Frontend",
              "Auth Stack",
              "Infra-Module",
            ]}
          />
          <QuickSelector
            label="Project"
            value="Phoenix Core"
            options={["Phoenix Core", "Identity V2", "Bridge API"]}
          />
          <div className="h-6 w-px bg-[#3c3c3c] mx-2"></div>
          <QuickSelector
            label="Branch"
            value="main"
            subValue="4 commits ahead"
            options={["main", "develop", "feat/auth-fix"]}
            icon="account_tree"
          />

          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="material-symbols-outlined !text-[16px] animate-pulse">
              check_circle
            </span>
            SYNCED
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-gh-text-secondary uppercase tracking-widest">
              Environment:
            </span>
            <div className="flex bg-gh-bg-secondary p-1 rounded-lg border border-gh-border">
              {["DEV", "STG", "PRD"].map((e) => (
                <button
                  key={e}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${e === "DEV" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-400"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-[20px]">
              shield
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar (Side) */}
        <aside className="w-12 bg-gh-bg flex flex-col border-r border-gh-border shrink-0 z-50">
          <ActivityBarItem
            icon="source_control"
            label="Source Control"
            active
          />
          <ActivityBarItem icon="search" label="Global Search" />
          <ActivityBarItem icon="extension" label="Extensions" />
          <ActivityBarItem
            icon="psychology"
            label="ForgeAI Insights"
            badge={2}
          />
          <div className="mt-auto">
            <ActivityBarItem icon="account_circle" label="Profile" />
            <ActivityBarItem icon="settings" label="Settings" />
          </div>
        </aside>

        {/* Side Bar (PR Explorer) */}
        {isSidebarOpen && (
          <aside className="w-[320px] border-r border-gh-border bg-gh-bg-secondary flex flex-col shrink-0 animate-in slide-in-from-left duration-200">
            <div className="h-14 px-4 flex items-center justify-between border-b border-gh-border">
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-300">
                Pull Requests
              </span>
              <div className="flex gap-1.5">
                <button className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined !text-[18px]">
                    filter_list
                  </span>
                </button>
                <button className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined !text-[18px]">
                    refresh
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ExplorerSection title="Open" count={2}>
                <div
                  onClick={() => setActivePR("#452")}
                  className={`px-4 py-4 mb-2 mx-2 rounded-xl flex flex-col gap-1 cursor-pointer transition-all border-l-4 ${activePR === "#452" ? "bg-[#161b22] border-emerald-500 ring-1 ring-white/5 shadow-xl" : "hover:bg-white/5 border-transparent"}`}
                >
                  <h4 className="text-[13px] font-black text-white leading-tight">
                    #452: Fix API endpoint bug
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    Open, Failing CI
                  </p>
                </div>
                <div
                  onClick={() => setActivePR("#453")}
                  className={`px-4 py-4 mx-2 rounded-xl flex flex-col gap-1 cursor-pointer transition-all border-l-4 ${activePR === "#453" ? "bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/20 shadow-xl shadow-amber-500/5" : "hover:bg-white/5 border-transparent"}`}
                >
                  <h4 className="text-[13px] font-black text-slate-100 leading-tight">
                    #453: Database schema update
                  </h4>
                  <p className="text-[11px] text-amber-500/80 font-bold uppercase tracking-widest">
                    Active Review, Passing CI
                  </p>
                </div>
              </ExplorerSection>

              <ExplorerSection title="Merged" count={1} defaultOpen={false}>
                <div
                  onClick={() => setActivePR("#454")}
                  className={`px-4 py-4 mx-2 rounded-xl flex flex-col gap-1 cursor-pointer transition-all border-l-4 ${activePR === "#454" ? "bg-purple-500/10 border-purple-500 ring-1 ring-purple-500/20 shadow-xl" : "hover:bg-white/5 border-transparent"}`}
                >
                  <h4 className="text-[13px] font-black text-slate-300 leading-tight">
                    #454: UI enhancements
                  </h4>
                  <p className="text-[11px] text-purple-500/80 font-black uppercase tracking-widest">
                    Merged
                  </p>
                </div>
              </ExplorerSection>

              <ExplorerSection
                title="Drafts"
                count={0}
                defaultOpen={false}
              ></ExplorerSection>
            </div>
          </aside>
        )}

        {/* Editor Main Section */}
        <main className="flex-1 flex flex-col min-w-0 bg-gh-bg-secondary relative">
          {/* Tab Bar */}
          <div className="h-10 bg-gh-bg flex items-center border-b border-gh-border shrink-0 overflow-x-auto no-scrollbar">
            {["database.config.ts", "server.ts", "auth.module.ts"].map(
              (tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-full px-5 flex items-center gap-2.5 text-[12px] font-bold border-r border-gh-border cursor-pointer transition-all ${activeTab === tab ? "bg-gh-bg-secondary text-white border-t-2 border-primary" : "bg-gh-bg-tertiary text-gh-text-secondary hover:bg-gh-bg-secondary"}`}
                >
                  <span className="material-symbols-outlined !text-[16px] text-blue-400">
                    javascript
                  </span>
                  {tab}
                  <span className="material-symbols-outlined !text-[16px] opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-opacity">
                    close
                  </span>
                </div>
              ),
            )}
            <div className="flex-1 h-full flex items-center justify-end px-4 gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                <span>Comment</span>
                <span className="material-symbols-outlined !text-[16px]">
                  expand_more
                </span>
              </div>
              <div className="flex bg-[#1e1e1e] rounded-lg border border-[#3c3c3c] overflow-hidden p-0.5">
                <button className="px-2 py-0.5 rounded hover:bg-white/5 text-slate-500">
                  <span className="material-symbols-outlined !text-[18px]">
                    view_column
                  </span>
                </button>
                <button className="px-2 py-0.5 rounded bg-[#3c3c3c] text-white shadow-sm">
                  <span className="material-symbols-outlined !text-[18px]">
                    view_stream
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Diff Editor Engine */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div
              className={`flex-1 grid ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"} divide-x divide-[#2b2b2b] overflow-hidden`}
            >
              {/* Left Side (Deleted Content) */}
              <div className="overflow-y-auto no-scrollbar bg-gh-bg-secondary relative flex">
                <div className="w-12 bg-gh-bg-secondary flex flex-col items-end pt-4 pr-3 text-gh-text-secondary font-mono text-[12px] select-none shrink-0 border-r border-gh-border">
                  {leftLines.map((_, i) => (
                    <span
                      key={i}
                      className={`h-6 leading-6 ${i >= 12 && i <= 13 ? "text-rose-500 font-black bg-rose-500/20 w-full text-right pr-3 border-r-2 border-rose-500" : ""}`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
                <div className="flex-1 pt-4 font-mono text-[13px] leading-6 whitespace-pre">
                  {leftLines.map((line, i) => (
                    <div
                      key={i}
                      className={`h-6 px-4 ${i >= 12 && i <= 13 ? "bg-rose-500/20 text-rose-200 line-through decoration-rose-500/50" : "text-slate-500"}`}
                    >
                      {line || " "}
                    </div>
                  ))}

                  {/* Inline Comment in Diff (Left) */}
                  <div className="mx-4 mt-4 p-4 bg-[#252526] border border-primary/40 rounded-2xl shadow-2xl relative animate-in slide-in-from-top-2 duration-300 ring-1 ring-black/50">
                    <div className="flex items-start gap-3 mb-4">
                      <img
                        src="https://picsum.photos/seed/sarah/32"
                        alt="Sarah K."
                        className="size-8 rounded-full border-2 border-primary/20 shadow-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-black text-white mb-1 flex items-center justify-between">
                          Sarah K.
                          <span className="text-slate-500 font-normal">
                            2 hours ago
                          </span>
                        </p>
                        <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                          This looks good, but consider line 14 with major
                          connection pool optimizations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-4 pl-4 border-l-2 border-white/10">
                      <img
                        src="https://picsum.photos/seed/alex/32"
                        alt="David L."
                        className="size-6 rounded-full border border-white/10 shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-slate-300 mb-1 flex items-center justify-between">
                          David L.
                        </p>
                        <p className="text-[12px] text-slate-400 leading-relaxed">
                          Added a fix.
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 bg-[#1e1e1e] border border-[#3c3c3c] rounded-xl flex items-center px-4 py-2 group-focus-within:border-primary transition-all">
                      <input
                        placeholder="Reply..."
                        className="w-full bg-transparent border-none text-[12px] text-slate-400 outline-none"
                      />
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors cursor-pointer">
                        send
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side (Added Content) */}
              <div className="overflow-y-auto no-scrollbar bg-gh-bg-secondary relative flex group/gutter">
                {/* Minimap Placeholder */}
                <div className="absolute top-0 right-0 w-14 h-full bg-black/20 border-l border-white/5 pointer-events-none z-20 backdrop-blur-sm">
                  <div className="absolute top-48 left-0 right-0 h-24 bg-emerald-500/20 border-y border-emerald-500/30"></div>
                </div>

                <div className="w-12 bg-gh-bg-secondary flex flex-col items-end pt-4 pr-3 text-gh-text-secondary font-mono text-[12px] select-none shrink-0 border-r border-gh-border">
                  {rightLines.map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 leading-6 w-full flex items-center justify-end relative group/line`}
                    >
                      <button className="absolute left-1 size-4 opacity-0 group-hover/line:opacity-100 transition-opacity bg-primary text-primary-foreground rounded flex items-center justify-center scale-90 shadow-lg">
                        <span className="material-symbols-outlined !text-[12px]">
                          add
                        </span>
                      </button>
                      <span
                        className={`${i >= 12 && i <= 19 ? "text-emerald-500 font-black bg-emerald-500/20 w-full text-right pr-3 border-r-2 border-emerald-500" : ""}`}
                      >
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 pt-4 font-mono text-[13px] leading-6 whitespace-pre">
                  {rightLines.map((line, i) => (
                    <div
                      key={i}
                      className={`h-6 px-4 relative ${i >= 12 && i <= 19 ? "bg-emerald-500/20 text-emerald-100 font-medium" : "text-slate-300"}`}
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Merge Control Bar */}
            <div className="h-16 border-t border-gh-border bg-gh-bg flex items-center justify-center px-8 gap-4 shrink-0 z-30">
              <button className="px-10 h-11 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(19,91,236,0.4)] hover:brightness-110 flex items-center gap-2 transition-all active:scale-95">
                <span className="material-symbols-outlined !text-[20px]">
                  merge
                </span>
                MERGE PULL REQUEST
              </button>
              <button className="px-8 h-11 bg-[#1e1e1e] hover:bg-[#2d2d2d] text-white rounded-xl font-black uppercase tracking-widest border border-white/5 transition-all shadow-xl">
                Request Changes
              </button>
            </div>
          </div>
        </main>

        {/* Modular Activity Side Bar (Right) */}
        <aside className="w-[400px] border-l border-gh-border bg-gh-bg-secondary flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
          <div className="h-14 px-6 flex items-center justify-between border-b border-gh-border bg-black/20">
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">
              {rightPanel === "ai"
                ? "🤖 AI REVIEW SUMMARY & CI/CD"
                : "👥 Reviewers"}
            </span>
            <span className="material-symbols-outlined !text-[18px] text-primary filled animate-pulse">
              auto_awesome
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
            <div className="space-y-6">
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 size-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                <h4 className="text-[13px] font-black text-white uppercase tracking-widest mb-4">
                  AI Summary:
                </h4>
                <p className="text-[14px] text-slate-300 leading-relaxed font-medium">
                  The changes introduce a new connection pool. No major issues
                  found.{" "}
                  <span className="text-emerald-500 font-black">
                    92% test coverage
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                  CI/CD Status:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-400">Build:</span>
                    <span className="text-emerald-500 font-black flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>{" "}
                      Passing
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-400">Tests:</span>
                    <span className="text-rose-500 font-black flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-rose-500 animate-pulse"></span>{" "}
                      Failing (2/234)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-400">Linting:</span>
                    <span className="text-emerald-500 font-black flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>{" "}
                      Passing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                MERGE APPROVAL
              </h4>
              <div className="space-y-4">
                {[
                  {
                    name: "Sarah K.",
                    status: "(Approved)",
                    color: "text-emerald-500",
                    avatar: "https://picsum.photos/seed/sarah/32",
                  },
                  {
                    name: "David L.",
                    status: "(Approved)",
                    color: "text-emerald-500",
                    avatar: "https://picsum.photos/seed/david/32",
                  },
                  {
                    name: "Michael R.",
                    status: "(Pending)",
                    color: "text-amber-500",
                    avatar: "https://picsum.photos/seed/u3/32",
                  },
                ].map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="size-9 rounded-full border border-white/10 group-hover:border-primary transition-all"
                      />
                      <span className="text-[14px] font-bold text-white">
                        {user.name}
                      </span>
                    </div>
                    <span className={`text-[12px] font-black ${user.color}`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-[#1e1e1e] border border-white/5 hover:border-primary/50 text-slate-400 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mt-4">
                MANAGE REVIEWERS
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* VS Code Status Bar */}
      <footer className="h-6 bg-primary text-primary-foreground flex items-center justify-between px-3 text-[10px] font-medium shrink-0 z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-4 h-full">
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
            <span className="material-symbols-outlined !text-[15px]">
              account_tree
            </span>
            <span className="font-bold">main*</span>
          </div>
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
            <span className="material-symbols-outlined !text-[15px]">sync</span>
            <span>0 ↓ 4 ↑</span>
          </div>
          <div className="flex items-center gap-2 hover:bg-white/10 px-2 h-full cursor-pointer transition-colors">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-[15px]">
                error_outline
              </span>{" "}
              2
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined !text-[15px]">
                warning_amber
              </span>{" "}
              1
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5 h-full">
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">
            Spaces: 2
          </div>
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">
            UTF-8
          </div>
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">
            TypeScript JSX
          </div>
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer gap-1 text-emerald-200">
            <span className="material-symbols-outlined !text-[15px] filled">
              auto_awesome
            </span>
            ForgeAI: Optimized
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkspaceDetailView;

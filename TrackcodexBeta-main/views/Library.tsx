import React, { useState, useMemo } from "react";
import { MOCK_LIBRARY_RESOURCES, MOCK_LIBRARY_CATEGORIES } from "../constants";
import { LibraryResource } from "../types";
import { forgeAIService } from "../services/gemini";

// Typed as React.FC to resolve TypeScript error regarding missing 'key' property in prop definition
const LibraryCard: React.FC<{
  resource: LibraryResource;
  onClick: () => void;
}> = ({ resource, onClick }) => {
  const handleInsert = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("trackcodex-notification", {
        detail: {
          title: "Resource Added",
          message: `${resource.name} has been staged for your active workspace.`,
          type: "success",
        },
      }),
    );
  };

  return (
    <div
      onClick={onClick}
      className="group bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer flex flex-col relative"
    >
      <div className="absolute top-4 right-4">
        <span className="material-symbols-outlined text-gh-text-secondary hover:text-gh-text transition-colors !text-[20px]">
          star
        </span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-xl bg-gh-bg-tertiary flex items-center justify-center text-gh-text-secondary group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined !text-[24px]">
            {resource.type === "Paper"
              ? "menu_book"
              : resource.type === "Snippet"
                ? "code"
                : "source"}
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gh-text group-hover:text-primary transition-colors truncate">
              {resource.name}
            </h3>
            <span className="px-1.5 py-0.5 rounded border border-gh-border text-[9px] text-gh-text-secondary font-bold uppercase tracking-wider">
              {resource.visibility}
            </span>
          </div>
          <p className="text-[10px] text-gh-text-secondary mt-0.5 font-medium tracking-tight">
            Updated {resource.lastUpdated}
          </p>
        </div>
      </div>

      <p className="text-[12px] text-gh-text-secondary leading-snug mb-8 h-10 line-clamp-2 overflow-hidden">
        {resource.description}
      </p>

      <div className="flex items-center gap-4 text-[11px] font-bold text-gh-text-secondary mb-6">
        <div className="flex items-center gap-1.5">
          <div
            className="size-2.5 rounded-full"
            style={{ backgroundColor: resource.techColor }}
          ></div>
          <span>{resource.techStack}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined !text-[14px]">star</span>
          <span>{(resource.stars / 1000).toFixed(1)}k</span>
        </div>
        {resource.forks > 0 && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined !text-[14px]">
              fork_right
            </span>
            <span>{(resource.forks / 1000).toFixed(1)}k</span>
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gh-border/50">
        <div className="flex items-center gap-2">
          {resource.isAudited && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
              <span className="material-symbols-outlined !text-[12px] filled">
                verified
              </span>
              Audited
            </span>
          )}
          {resource.tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded bg-gh-bg-tertiary text-gh-text-secondary text-[9px] font-black uppercase tracking-widest border border-gh-border"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={handleInsert}
          className="flex items-center gap-2 text-gh-text-secondary/50 hover:text-gh-text text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <span className="material-symbols-outlined !text-[16px]">add</span>
          Insert into Workspace
        </button>
      </div>
    </div>
  );
};

const LibraryDetail = ({
  resource,
  onBack,
}: {
  resource: LibraryResource;
  onBack: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleAddToWorkspace = () => {
    window.dispatchEvent(
      new CustomEvent("trackcodex-notification", {
        detail: {
          title: "Component Integrated",
          message: `${resource.name} is being cloned into your current development environment.`,
          type: "success",
        },
      }),
    );
  };

  const handleForgeAIPreview = async () => {
    setIsAnalyzing(true);
    try {
      const insight = await forgeAIService.getLiveChatResponse(
        `Provide a quick technical preview and security analysis for the template: ${resource.name}. Describe why it's a good choice for high-fidelity production apps.`,
        [],
        `Analyzing Library Resource: ${resource.name}`,
        ["ForgeAI Specialist"],
      );
      setAiInsight(insight || null);
    } catch {
      setAiInsight(
        "ForgeAI analysis failed to initialize. Please check your connectivity.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gh-bg animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="px-8 pt-6 pb-2 border-b border-gh-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="size-10 flex items-center justify-center bg-gh-bg-secondary border border-gh-border rounded-xl text-gh-text-secondary hover:text-gh-text transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-gh-bg-secondary border border-gh-border flex items-center justify-center text-primary shadow-xl">
                <span className="material-symbols-outlined !text-[32px] filled">
                  hub
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gh-text tracking-tight flex items-center gap-3">
                  {resource.name}
                  <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 flex items-center gap-1">
                    <span className="material-symbols-outlined !text-[12px] filled">
                      security
                    </span>
                    Verified Safe
                  </span>
                </h1>
                <p className="text-xs text-gh-text-secondary font-mono flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1.5">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: resource.techColor }}
                    ></div>{" "}
                    {resource.techStack}
                  </span>
                  <span>{resource.version}</span>
                  <span>Updated {resource.lastUpdated}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-xl text-xs font-bold text-gh-text-secondary hover:text-gh-text transition-all">
              <span className="material-symbols-outlined !text-[18px]">
                share
              </span>
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-xl text-xs font-bold text-gh-text-secondary hover:text-gh-text transition-all">
              <span className="material-symbols-outlined !text-[18px]">
                star
              </span>
              Star
            </button>
            <button
              onClick={handleAddToWorkspace}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95"
            >
              <span className="material-symbols-outlined !text-[18px]">
                add
              </span>
              Add to Workspace
            </button>
            <button
              onClick={handleForgeAIPreview}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-primary text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 ${isAnalyzing ? "opacity-75 cursor-wait" : ""}`}
            >
              <span
                className={`material-symbols-outlined !text-[18px] filled ${isAnalyzing ? "animate-spin" : ""}`}
              >
                {isAnalyzing ? "sync" : "auto_awesome"}
              </span>
              {isAnalyzing ? "Analyzing..." : "Use with ForgeAI"}
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gh-bg-secondary border border-gh-border rounded-xl text-xs font-bold text-gh-text-secondary hover:text-gh-text transition-all">
              <span className="material-symbols-outlined !text-[18px]">
                forum
              </span>
              Discussions
            </button>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {[
            "Overview",
            "File Structure",
            "Dependencies",
            "Changelog",
            "Integration",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[13px] font-bold transition-all relative ${activeTab === tab ? "text-gh-text" : "text-gh-text-secondary hover:text-gh-text"}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div className="space-y-10">
            {aiInsight && (
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                  <span className="material-symbols-outlined !text-[16px] filled">
                    auto_awesome
                  </span>
                  ForgeAI Contextual Preview
                </div>
                <p className="text-sm text-gh-text-secondary leading-relaxed font-medium">
                  {aiInsight}
                </p>
              </div>
            )}

            <section>
              <h2 className="text-xl font-bold text-gh-text mb-4">Overview</h2>
              <p className="text-base text-gh-text-secondary leading-relaxed max-w-3xl">
                {resource.longDescription || resource.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  {
                    title: "CSRF Protection",
                    desc: "Double-submit cookie pattern implemented.",
                    icon: "security",
                  },
                  {
                    title: "Rate Limiting",
                    desc: "Redis-backed sliding window limiter.",
                    icon: "speed",
                  },
                  {
                    title: "Input Validation",
                    desc: "Zod schemas for all API endpoints.",
                    icon: "verified_user",
                  },
                  {
                    title: "Secure Headers",
                    desc: "Helmet.js pre-configured for strict CSP.",
                    icon: "lock",
                  },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="p-5 rounded-xl bg-gh-bg-secondary border border-gh-border flex flex-col gap-3 group hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <span className="material-symbols-outlined !text-[18px] filled">
                          {feat.icon}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gh-text">
                        {feat.title}
                      </h4>
                    </div>
                    <p className="text-[12px] text-gh-text-secondary font-medium">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {resource.snippetPreview && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gh-text-secondary uppercase tracking-widest">
                    Code Snippet Preview
                  </h3>
                  <button className="text-[10px] font-bold text-gh-text-secondary hover:text-gh-text uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined !text-[14px]">
                      content_copy
                    </span>
                    Copy
                  </button>
                </div>
                <div className="rounded-2xl border border-gh-border overflow-hidden bg-gh-bg-tertiary">
                  <div className="bg-gh-bg-secondary px-4 py-2 border-b border-gh-border flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-500/50"></span>
                    <span className="size-2.5 rounded-full bg-amber-500/50"></span>
                    <span className="size-2.5 rounded-full bg-emerald-500/50"></span>
                    <span className="ml-2 text-[10px] font-mono text-gh-text-secondary">
                      server.ts
                    </span>
                  </div>
                  <pre className="p-6 font-mono text-[13px] text-gh-text-secondary leading-relaxed overflow-x-auto">
                    <code>{resource.snippetPreview}</code>
                  </pre>
                </div>
              </section>
            )}

            <section className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-1">
                  Freelancer Context
                </h3>
                <p className="text-[12px] text-gh-text-secondary">
                  Popular in high-value freelance gigs like{" "}
                  <span className="text-indigo-300 font-bold">SaaS MVPs</span>{" "}
                  and{" "}
                  <span className="text-indigo-300 font-bold">
                    Internal Dashboards
                  </span>
                  .
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gh-text">~45h</p>
                <p className="text-[10px] text-gh-text-secondary uppercase font-black">
                  Est. Effort Saved
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-gh-bg-secondary border border-gh-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-gh-text-secondary uppercase tracking-widest">
                  Security & Quality
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">
                  A+ Grade
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="text-gh-text-secondary">
                      Vuln Scan History
                    </span>
                    <span className="text-emerald-500 font-bold">Clean</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full ${i === 8 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-emerald-900"}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-[9px] text-gh-text-secondary mt-2 text-right uppercase font-bold tracking-tighter">
                    Last scan: 10m ago
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-gh-border">
                  <img
                    src="https://picsum.photos/seed/u1/64"
                    alt="Maintainer Avatar"
                    className="size-9 rounded-full border border-primary/30"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-gh-text">
                      Maintained by
                    </p>
                    <p className="text-[11px] text-primary font-black hover:underline cursor-pointer">
                      @schen_sec
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gh-bg-secondary border border-gh-border">
              <h3 className="text-xs font-black text-gh-text-secondary uppercase tracking-widest mb-6">
                Community
              </h3>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-amber-500 filled !text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-xs font-black text-gh-text">4.8</span>
                <span className="text-xs text-gh-text-secondary">
                  (120 reviews)
                </span>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-black/20 rounded-xl border border-gh-border">
                  <p className="text-[12px] font-bold text-gh-text-secondary">
                    How to extend the...
                  </p>
                  <p className="text-[10px] text-gh-text-secondary mt-1">
                    3 replies • Last by @alex_dev
                  </p>
                </div>
                <div className="p-3 bg-black/20 rounded-xl border border-gh-border">
                  <p className="text-[12px] font-bold text-gh-text-secondary">
                    Issues with Dock...
                  </p>
                  <p className="text-[10px] text-gh-text-secondary mt-1 text-emerald-500 font-bold">
                    Resolved • 5 replies
                  </p>
                </div>
              </div>
              <button className="w-full mt-6 py-2 border border-primary/30 rounded-xl text-[11px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 transition-all">
                Ask a Question
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gh-bg-secondary border border-gh-border rounded-lg text-[10px] text-gh-text-secondary font-black uppercase tracking-widest hover:text-gh-text transition-all cursor-pointer"
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
              <span className="px-2 py-1 bg-gh-bg-secondary border border-gh-border rounded-lg text-[10px] text-gh-text-secondary font-black uppercase tracking-widest hover:text-gh-text transition-all cursor-pointer">
                #security-hardened
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryView = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    return MOCK_LIBRARY_RESOURCES.filter((r) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query);
      const matchesCategory = activeCategory
        ? r.category === activeCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const selectedResource = useMemo(
    () => MOCK_LIBRARY_RESOURCES.find((r) => r.id === selectedId),
    [selectedId],
  );

  if (selectedId && selectedResource) {
    return (
      <LibraryDetail
        resource={selectedResource}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-gh-bg font-display">
      {/* Internal Library Sidebar */}
      <aside className="w-[280px] border-r border-gh-border flex flex-col shrink-0">
        <div className="p-6 border-b border-gh-border">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gh-text-secondary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">
              filter_list
            </span>
            Library Explorer
          </h2>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-black text-gh-text-secondary uppercase tracking-widest mb-2 mt-4">
              Resource Type
            </p>
            {MOCK_LIBRARY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(
                    cat.name === activeCategory ? null : cat.name,
                  )
                }
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-[13px] font-medium group ${activeCategory === cat.name
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-gh-text-secondary hover:bg-white/5 hover:text-gh-text"
                  }`}
              >
                <span
                  className={`material-symbols-outlined !text-[20px] ${activeCategory === cat.name ? "text-primary" : "text-gh-text-secondary group-hover:text-gh-text"}`}
                >
                  {cat.icon}
                </span>
                <span className="flex-1 text-left">{cat.name}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeCategory === cat.name ? "bg-primary text-primary-foreground" : "bg-gh-bg-tertiary text-gh-text-secondary"}`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <p className="px-3 text-[10px] font-black text-gh-text-secondary uppercase tracking-widest mb-2">
              Filters
            </p>
            <div className="space-y-3 px-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="size-4 border-2 border-gh-border rounded bg-transparent group-hover:border-primary transition-all"></div>
                <span className="text-[12px] text-gh-text-secondary group-hover:text-gh-text transition-colors">
                  Freelancer-Focused
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="size-4 border-2 border-primary rounded bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined !text-[12px] text-white">
                    check
                  </span>
                </div>
                <span className="text-[12px] text-gh-text-secondary font-bold">
                  Security-Hardened Only
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group opacity-50">
                <div className="size-4 border-2 border-gh-border rounded bg-transparent"></div>
                <span className="text-[12px] text-gh-text-secondary">
                  Org-Approved Only
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-black text-emerald-500 uppercase tracking-widest">
            <span className="material-symbols-outlined !text-[16px] filled">
              verified
            </span>
            Verified Safe
          </div>
          <div className="flex items-center gap-2 text-[11px] font-black text-gh-text-secondary uppercase tracking-widest">
            <span className="material-symbols-outlined !text-[16px]">
              hourglass_empty
            </span>
            Audit Pending
          </div>
        </div>
      </aside>

      {/* Library Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-8 border-b border-gh-border">
          <div className="flex items-start justify-between mb-8">
            <div>
              <nav className="flex items-center gap-2 text-[11px] text-gh-text-secondary font-bold uppercase tracking-widest mb-4">
                <span className="hover:text-gh-text cursor-pointer">
                  library
                </span>
                <span>/</span>
                <span className="hover:text-gh-text cursor-pointer">
                  templates
                </span>
                <span>/</span>
                <span className="text-gh-text">backend-api</span>
              </nav>
              <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
                Backend API Templates{" "}
                <span className="px-2 py-0.5 rounded-full border border-gh-border text-[11px] font-black uppercase text-gh-text-secondary ml-2">
                  Public
                </span>
              </h1>
              <p className="text-sm text-gh-text-secondary max-w-2xl leading-relaxed">
                Production-ready, security-hardened backend scaffoldings
                pre-configured for enterprise environments.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-xl text-xs font-bold text-gh-text-secondary hover:text-gh-text transition-all">
                <span className="material-symbols-outlined !text-[18px]">
                  filter_list
                </span>
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined !text-[18px]">
                  add
                </span>
                Import New
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
            <div className="flex items-center gap-8 border-b lg:border-none border-gh-border pb-2 lg:pb-0">
              <button className="flex items-center gap-2 text-sm font-bold text-gh-text relative pb-2 lg:pb-0">
                <span className="material-symbols-outlined !text-[18px]">
                  grid_view
                </span>
                Overview
                <div className="absolute bottom-[-8px] lg:bottom-[-2px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gh-text-secondary hover:text-gh-text transition-colors">
                <span className="material-symbols-outlined !text-[18px]">
                  list
                </span>
                List View
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-gh-text-secondary hover:text-gh-text transition-colors">
                <span className="material-symbols-outlined !text-[18px]">
                  history
                </span>
                Recent
              </button>
            </div>

            <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative group flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gh-text-secondary text-sm group-focus-within:text-primary transition-colors">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gh-bg-secondary border border-gh-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-gh-text focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gh-text-secondary transition-all shadow-inner"
                  placeholder="Global library search (title or description)..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gh-text-secondary hover:text-gh-text transition-colors"
                  >
                    <span className="material-symbols-outlined !text-[18px]">
                      close
                    </span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center bg-gh-bg-secondary border border-gh-border px-3 py-2 rounded-xl text-[11px] font-bold text-gh-text-secondary gap-2 cursor-pointer hover:border-gh-text-secondary transition-all">
                  Language: All
                  <span className="material-symbols-outlined !text-[14px]">
                    expand_more
                  </span>
                </div>
                <div className="flex items-center bg-gh-bg-secondary border border-gh-border px-3 py-2 rounded-xl text-[11px] font-bold text-gh-text-secondary gap-2 cursor-pointer hover:border-gh-text-secondary transition-all">
                  Sort: Most stars
                  <span className="material-symbols-outlined !text-[14px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <LibraryCard
                  key={resource.id}
                  resource={resource}
                  onClick={() => setSelectedId(resource.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="size-20 rounded-full bg-gh-bg-secondary flex items-center justify-center text-gh-text-secondary mb-6">
                  <span className="material-symbols-outlined !text-[40px]">
                    search_off
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gh-text mb-2">
                  No results found for "{searchQuery}"
                </h3>
                <p className="text-gh-text-secondary text-sm max-w-sm">
                  Try adjusting your filters or search query to find the
                  resources you need.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory(null);
                  }}
                  className="mt-6 px-6 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl font-bold text-sm transition-all border border-primary/20"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="h-10 border-t border-gh-border bg-gh-bg flex items-center justify-between px-6 text-[10px] text-gh-text-secondary shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined !text-[14px]">
                account_tree
              </span>{" "}
              library-view
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
              <span className="material-symbols-outlined !text-[14px]">
                history
              </span>{" "}
              main
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined !text-[14px]">
                info
              </span>{" "}
              0 0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-500/70 font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined !text-[14px] filled">
                auto_awesome
              </span>{" "}
              Copilot Ready
            </span>
            <span>Showing {filteredResources.length} items</span>
            <span>UTF-8</span>
            <span>TypeScript</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LibraryView;

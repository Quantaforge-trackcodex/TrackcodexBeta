import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchService, SearchResult } from "../../services/searchService";

const CommandPalette = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Navigation Commands (Static)
  const navCommands: SearchResult[] = [
    {
      id: "nav-home",
      type: "nav",
      label: "Go to Home",
      icon: "home",
      group: "Navigation",
      url: "/dashboard/home",
    },
    {
      id: "nav-settings",
      type: "nav",
      label: "Settings",
      icon: "settings",
      group: "Navigation",
      url: "/settings",
    },
  ];

  // Fetch Results
  useEffect(() => {
    if (!search || search.length < 2) {
      setResults(navCommands);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const serviceResults = await searchService.search(search);
        setResults([
          ...serviceResults,
          ...navCommands.filter((c) =>
            c.label.toLowerCase().includes(search.toLowerCase()),
          ),
        ]);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  // Grouping for render
  const groupedResults = results.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (item: SearchResult) => {
    navigate(item.url);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (results[selectedIndex]) handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-3xl glass-panel rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[600px] animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-white/5">
          <span className="material-symbols-outlined text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
            search
          </span>
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search people, jobs, repos, or commands..."
            className="flex-1 bg-transparent text-base text-white placeholder-slate-500 border-none focus:ring-0 outline-none h-8 font-medium"
          />
          <span className="text-xs text-slate-500 border border-white/10 rounded px-1.5 py-0.5 bg-black/20">
            Esc
          </span>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {loading && (
            <div className="p-8 flex justify-center text-primary">
              <span className="material-symbols-outlined animate-spin text-3xl">
                progress_activity
              </span>
            </div>
          )}
          {!loading &&
            Object.entries(groupedResults).map(([group, items]) => (
              <div key={group}>
                <h3 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-[#0d1117]/90 backdrop-blur-md z-10">
                  {group}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => {
                    const isSelected = results.indexOf(item) === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() =>
                          setSelectedIndex(results.indexOf(item))
                        }
                        className={`
                        flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer group transition-all relative overflow-hidden
                        ${isSelected ? "bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]" : "border border-transparent hover:bg-white/5"}
                      `}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#8b5cf6]"></div>
                        )}

                        {/* Icon / Avatar */}
                        {item.type === "user" && item.metadata?.avatar ? (
                          <img
                            src={item.metadata.avatar}
                            className="size-8 rounded-full border border-white/10"
                            alt={item.label}
                          />
                        ) : (
                          <div
                            className={`
                          size-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5
                          ${
                            item.type === "job"
                              ? "bg-amber-500/10 text-amber-500"
                              : item.type === "repo"
                                ? "bg-blue-500/10 text-blue-500"
                                : item.type === "workspace"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-slate-500/10 text-slate-400"
                          }
                        `}
                          >
                            <span className="material-symbols-outlined !text-[18px]">
                              {item.icon}
                            </span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-slate-300"}`}
                            >
                              {item.label}
                            </span>
                            {/* Specific styling for Job Bounties */}
                            {item.type === "job" &&
                              item.subLabel?.includes("$") && (
                                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded ml-2">
                                  {item.subLabel.split("•").pop()?.trim()}
                                </span>
                              )}
                          </div>
                          {item.subLabel && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                              {item.type === "repo" && (
                                <span
                                  className={`size-2 rounded-full ${item.subLabel.includes("TypeScript") ? "bg-blue-400" : "bg-yellow-400"}`}
                                ></span>
                              )}
                              {item.subLabel}
                            </div>
                          )}
                        </div>

                        {/* Action Hint */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest transition-opacity ${isSelected ? "text-primary opacity-100" : "opacity-0"}`}
                        >
                          {item.type === "user" ? "View Profile" : "Open"} ↩
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {!loading && results.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4 text-slate-500">
                <span className="material-symbols-outlined text-4xl">
                  travel_explore
                </span>
              </div>
              <h3 className="text-slate-300 font-bold">No results found</h3>
              <p className="text-sm text-slate-500 mt-1">
                We couldn't find anything matching "{search}"
              </p>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-white/5 bg-[#0d1117]/50 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-slate-400">ProTip:</strong> Search "React"
              to find devs, or "Bounty" for paid missions.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-white/5 border border-white/10 rounded px-1.5 min-w-[16px] text-center">
                ↑
              </kbd>{" "}
              <kbd className="bg-white/5 border border-white/10 rounded px-1.5 min-w-[16px] text-center">
                ↓
              </kbd>{" "}
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white/5 border border-white/10 rounded px-1.5 min-w-[20px] text-center">
                ↵
              </kbd>{" "}
              to select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

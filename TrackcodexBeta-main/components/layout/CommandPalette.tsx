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

  // Mock Data for "Jump to" - extending SearchResult structure
  // In a real app these would come from the API
  const mockJumpToResults: SearchResult[] = [
    { id: "owner-1", type: "user", label: "Quantaforge-trackcodex", group: "Owners", icon: "business", url: "/org/Quantaforge-trackcodex" },
    { id: "repo-1", type: "repo", label: "Quantaforge-trackcodex/meeting_1", group: "Repositories", icon: "book", url: "/repo/meeting_1" },
    { id: "repo-2", type: "repo", label: "Quantaforge-trackcodex/Nexuscode", group: "Repositories", icon: "book", url: "/repo/Nexuscode" },
    { id: "repo-3", type: "repo", label: "Quantaforge-trackcodex/club-communtiy-", group: "Repositories", icon: "book", url: "/repo/club-community" },
    { id: "repo-4", type: "repo", label: "Quantaforge-trackcodex/browser", group: "Repositories", icon: "book", url: "/repo/browser" },
    { id: "repo-5", type: "repo", label: "Quantaforge-trackcodex/app-communtiy", group: "Repositories", icon: "book", url: "/repo/app-community" },
  ];

  // Fetch Results
  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    // Simulate search delay
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Integrating Logic: If search is empty or just starting, shows recent or default "Jump to" suggestions
        const filtered = mockJumpToResults.filter(r => r.label.toLowerCase().includes(search.toLowerCase()) || r.group.toLowerCase().includes(search.toLowerCase()));

        // Always add a "Search for..." option to allow navigation to the full search page
        // This is crucial for the user to reach the "Empty State" page
        const searchOption: SearchResult = {
          id: 'search-global',
          type: 'action',
          label: `Search for "${search}"`,
          group: 'Global Search',
          icon: 'search',
          url: `/search?q=${search}`
        };

        // Put "Search for..." at the top, followed by filtered results
        setResults([searchOption, ...filtered]);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 100);

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
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d1117] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[600px] border border-gh-border text-gh-text animate-in fade-in zoom-in-95 duration-100">

        {/* Search Input Area */}
        <div className="p-2 border-b border-gh-border">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-[#0d1117] border border-blue-500 rounded-md box-shadow-[0_0_0_2px_rgba(9,105,218,0.3)]">
            <span className="material-symbols-outlined text-gh-text-secondary" style={{ fontSize: '20px' }}>
              search
            </span>
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..." // Screenshot has empty or specific text, generic is fine
              className="flex-1 bg-transparent text-sm text-gh-text placeholder-gh-text-secondary border-none focus:ring-0 outline-none h-6"
            />
            {/* Optional Right Action if needed */}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="p-4 text-center text-gh-text-secondary text-sm">Loading...</div>
          )}

          {!loading && results.length === 0 && search.length > 0 && (
            <div className="p-4 text-center text-gh-text-secondary text-sm">
              No results found. <br />
              <span className="text-xs">Try searching for "trackcodex" to recall mocks.</span>
            </div>
          )}

          {!loading &&
            Object.entries(groupedResults).map(([group, items]) => (
              <div key={group}>
                <h3 className="px-4 py-2 text-xs font-semibold text-gh-text-secondary bg-gh-bg-secondary/50 border-b border-gh-border/50">
                  {group}
                </h3>
                <div>
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
                        flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors
                        ${isSelected ? "bg-gh-primary text-white" : "hover:bg-gh-bg-secondary text-gh-text"}
                      `}
                      >
                        <span className={`material-symbols-outlined text-lg ${isSelected ? "text-white" : "text-gh-text-secondary"}`}>
                          {item.icon}
                        </span>

                        <div className="flex-1 truncate text-sm">
                          {item.label}
                        </div>

                        <div className={`text-xs ${isSelected ? "text-white/80" : "text-gh-text-secondary"} flex-shrink-0`}>
                          Jump to
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Copilot / Footer Section match Screenshot 2 */}
          {!loading && results.length > 0 && (
            <div className="border-t border-gh-border mt-2">
              <h3 className="px-4 py-2 text-xs font-semibold text-gh-text-secondary">Copilot</h3>
              <div className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gh-bg-secondary text-gh-text">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
                <div className="flex-1 text-sm">Chat with Copilot</div>
                <div className="text-xs text-gh-text-secondary">Start a new Copilot thread</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gh-border bg-gh-bg-secondary/50 flex items-center justify-between text-xs text-gh-text-secondary px-4">
          <div className="flex items-center gap-4">
            <a href="/search/syntax" className="hover:text-accent text-blue-500 no-underline">Search syntax tips</a>
          </div>
          <div>
            <a href="#" className="hover:text-accent text-blue-500 no-underline">Give feedback</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommandPalette;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GlobalSearchModal.css";

interface SearchResult {
  id: string;
  type: string;
  label: string;
  subLabel?: string;
  icon: string;
  group: string;
  url: string;
}

interface RecentRepo {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  lastVisited: Date;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentRepos, setRecentRepos] = useState<RecentRepo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSyntaxTips, setShowSyntaxTips] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent repositories on mount
  useEffect(() => {
    if (isOpen) {
      loadRecentRepos();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const loadRecentRepos = async () => {
    try {
      const res = await fetch("/api/v1/search/recent");
      if (res.ok) {
        const data = await res.json();
        setRecentRepos(data.recent || []);
      }
    } catch (error) {
      console.error("Error loading recent repos:", error);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/search?q=${encodeURIComponent(query)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(
            prev + 1,
            Math.max(results.length - 1, recentRepos.length - 1),
          ),
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, recentRepos, selectedIndex]);

  const handleSelect = () => {
    const items = query.trim()
      ? results
      : recentRepos.map((r) => ({
          id: r.id,
          type: "repo",
          label: r.name,
          subLabel: r.fullName,
          icon: "book",
          group: "Repositories",
          url: `/repo/${r.owner}/${r.name}`,
        }));

    if (items[selectedIndex]) {
      jumpTo(items[selectedIndex].url);
    }
  };

  const jumpTo = (url: string) => {
    navigate(url);
    onClose();
  };

  const submitFeedback = async (message: string) => {
    try {
      await fetch("/api/v1/search/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          category: "search",
          url: window.location.href,
        }),
      });
      setShowFeedback(false);
      alert("Thank you for your feedback!");
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };

  if (!isOpen) return null;

  // Group results
  const groupedResults: Record<string, SearchResult[]> = {};
  results.forEach((result) => {
    if (!groupedResults[result.group]) {
      groupedResults[result.group] = [];
    }
    groupedResults[result.group].push(result);
  });

  return (
    <>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-modal">
        <div className="search-header">
          <span className="material-icons search-icon">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search or jump to..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          {loading && <div className="search-spinner"></div>}
        </div>

        <div className="search-body">
          {query.trim() ? (
            // Search results
            Object.keys(groupedResults).length > 0 ? (
              Object.entries(groupedResults).map(([group, items]) => (
                <div key={group} className="search-section">
                  <div className="search-section-header">{group}</div>
                  {items.map((result, idx) => (
                    <div
                      key={result.id}
                      className={`search-result-item ${selectedIndex === idx ? "selected" : ""}`}
                      onClick={() => jumpTo(result.url)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <span className="material-icons result-icon">
                        {result.icon}
                      </span>
                      <div className="result-content">
                        <div className="result-label">{result.label}</div>
                        {result.subLabel && (
                          <div className="result-sublabel">
                            {result.subLabel}
                          </div>
                        )}
                      </div>
                      <button className="jump-to-btn">Jump to →</button>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="no-results">No results found</div>
            )
          ) : (
            // Recent repositories
            <>
              {recentRepos.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">Repositories</div>
                  {recentRepos.map((repo, idx) => (
                    <div
                      key={repo.id}
                      className={`search-result-item ${selectedIndex === idx ? "selected" : ""}`}
                      onClick={() => jumpTo(`/repo/${repo.owner}/${repo.name}`)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <span className="material-icons result-icon">book</span>
                      <div className="result-content">
                        <div className="result-label">{repo.fullName}</div>
                      </div>
                      <button className="jump-to-btn">Jump to →</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Copilot Section */}
              <div className="search-section">
                <div className="search-section-header">Copilot</div>
                <div className="search-result-item copilot-item">
                  <span className="material-icons result-icon">chat</span>
                  <div className="result-content">
                    <div className="result-label">Chat with Copilot</div>
                  </div>
                  <span className="copilot-cta">
                    Start a new Copilot thread
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="search-footer">
          <button
            className="footer-link"
            onClick={() => setShowSyntaxTips(true)}
          >
            Search syntax tips
          </button>
          <button className="footer-link" onClick={() => setShowFeedback(true)}>
            Give feedback
          </button>
        </div>
      </div>

      {/* Syntax Tips Modal */}
      {showSyntaxTips && (
        <div
          className="tips-modal-backdrop"
          onClick={() => setShowSyntaxTips(false)}
        >
          <div className="tips-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Search Syntax Tips</h3>
            <ul>
              <li>
                <code>repo:owner/name</code> - Search in specific repository
              </li>
              <li>
                <code>org:name</code> - Search in organization
              </li>
              <li>
                <code>user:username</code> - Find user
              </li>
              <li>
                <code>type:repo</code> - Filter by repositories
              </li>
              <li>
                <code>language:javascript</code> - Filter by language
              </li>
            </ul>
            <button onClick={() => setShowSyntaxTips(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div
          className="tips-modal-backdrop"
          onClick={() => setShowFeedback(false)}
        >
          <div className="tips-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Send Feedback</h3>
            <textarea
              placeholder="Tell us what you think..."
              rows={5}
              id="feedback-input"
            />
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  const input = document.getElementById(
                    "feedback-input",
                  ) as HTMLTextAreaElement;
                  submitFeedback(input.value);
                }}
              >
                Submit
              </button>
              <button onClick={() => setShowFeedback(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearchModal;

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/SearchResults.css";

interface SearchFilter {
  name: string;
  icon?: string; // Material Icon name if used, though GitHub uses SVGs mainly. Using Material for now.
  count: number;
  type: string;
}

interface SearchResultsPageProps { }

const SearchResultsPage: React.FC<SearchResultsPageProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "repositories";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("best-match");
  const [searchTime, setSearchTime] = useState(0);

  // Full Filter List per GitHub + Custom Types
  const [filters, setFilters] = useState<SearchFilter[]>([
    { name: "Code", count: 0, type: "code" },
    { name: "Repositories", count: 0, type: "repositories" },
    { name: "Issues", count: 6, type: "issues" }, // Mock count per screenshot
    { name: "Pull requests", count: 3, type: "pullrequests" }, // Mock count
    { name: "Discussions", count: 0, type: "discussions" },
    { name: "Users", count: 0, type: "users" },
    { name: "Commits", count: 1, type: "commits" }, // Mock count
    { name: "Packages", count: 0, type: "packages" },
    { name: "Wikis", count: 5, type: "wikis" }, // Mock count
    { name: "Topics", count: 0, type: "topics" },
    { name: "Marketplace", count: 0, type: "marketplace" },
    // Custom TrackCodex Types
    { name: "Jobs", count: 5, type: "jobs" }, // Mock count
    { name: "Projects", count: 0, type: "projects" },
    { name: "Workspaces", count: 1, type: "workspaces" }, // Mock count
    { name: "Community", count: 2, type: "community" }, // Mock count
  ]);

  useEffect(() => {
    performSearch();
  }, [query, type]);

  const performSearch = async () => {
    setLoading(true);
    const startTime = performance.now();

    // Simulating Search Delay and Results
    setTimeout(() => {
      // MOCK LOGIC: If query is "react" or similar, show results. Else empty.
      // For the purpose of "Empty Screen UI" task, we default to empty if type is 'repositories' and query is not 'repo'
      // But we kept 'Issues' count > 0 to demo the "However we found..." logic.

      let mockResults: any[] = [];

      // Dynamic Filter Counts Simulation
      const newFilters = [...filters];

      if (query.toLowerCase().includes("react")) {
        // Simulate finding repositories
        if (type === 'repositories') {
          mockResults = [
            { label: "facebook/react", subLabel: "A declarative, efficient, and flexible JavaScript library for building user interfaces.", icon: "book", url: "#" },
            { label: "typescript-cheatsheets/react", subLabel: "Cheatsheets for experienced React developers getting started with TypeScript", icon: "book", url: "#" }
          ];
        }
        newFilters.find(f => f.type === 'repositories')!.count = 2542;
        newFilters.find(f => f.type === 'code')!.count = 15400;
      } else {
        // Default "Empty" scenario matching screenshot
        // Reset counts to screenshot defaults if not searching specifically
        // Screenshot has: Code 0, Repos 0, Issues 6, PRs 3, Wikis 5.
        // We will stick to the hardcoded initial state for demo unless query changes.
      }

      if (mockResults.length > 0) {
        setResults(mockResults);
      } else {
        setResults([]);
      }

      const endTime = performance.now();
      setSearchTime(Math.round(endTime - startTime));
      setLoading(false);
    }, 300);
  };

  const totalResults = results.length;
  // Logic to find other categories with results
  const otherResults = filters.filter((f) => f.type !== type && f.count > 0);

  return (
    <div className="search-results-page">
      {/* Sidebar Filters */}
      <aside className="search-sidebar">
        <h3 className="sidebar-title">Filter by</h3>
        <nav className="filter-nav">
          {filters.map((filter) => (
            <button
              key={filter.type}
              className={`filter-item ${type === filter.type ? "active" : ""}`}
              onClick={() =>
                navigate(
                  `/search?q=${encodeURIComponent(query)}&type=${filter.type}`,
                )
              }
            >
              <span className="filter-name">{filter.name}</span>
              <span className="filter-count">{filter.count}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Results Area */}
      <main className="search-main">
        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">
              {totalResults > 0 ? (
                formattedCount(totalResults) + " results"
              ) : (
                "0 results"
              )}
            </span>
            {/* Note: GitHub hides time on empty state usually, but screenshot shows header "0 results" */}
          </div>

          <div className="results-controls">
            <div className="sort-dropdown">
              <label htmlFor="sort-by">Sort by:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort search results by"
              >
                <option value="best-match">Best match</option>
                <option value="most-stars">Most stars</option>
                <option value="recently-updated">Recently updated</option>
                <option value="least-recently-updated">
                  Least recently updated
                </option>
              </select>
            </div>

            <button className="save-button" title="Save search">
              <span className="material-symbols-outlined !text-[16px]">bookmark_border</span>
              Save
            </button>
            {/* More options button if needed */}
          </div>
        </div>

        {/* Results Content */}
        {loading ? (
          <div className="search-loading">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        ) : totalResults === 0 ? (
          // No Results State
          <div className="no-results-container">
            <div className="no-results-illustration">
              {/* GitHub's Octocat/Globe Illustration approximation */}
              <svg width="320" height="240" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="150" r="100" fill="currentColor" fillOpacity="0.05" />
                <path d="M200 60 C 260 60, 300 110, 300 150" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 4" />
                <path d="M100 150 C 100 190, 140 240, 200 240" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 4" />

                {/* Simplified Octocat Head */}
                <path d="M140 180 C 120 180, 110 160, 120 130 C 130 100, 170 100, 180 130" fill="currentColor" fillOpacity="0.8" />
                <ellipse cx="150" cy="140" rx="30" ry="25" fill="#0d1117" />
                {/* Goggles */}
                <circle cx="140" cy="140" r="10" fill="#a371f7" />
                <circle cx="160" cy="140" r="10" fill="#a371f7" />

                {/* Magnifying Glass */}
                <circle cx="180" cy="160" r="30" stroke="#66c0f4" strokeWidth="4" strokeOpacity="0.8" fill="rgba(102, 192, 244, 0.1)" />
                <line x1="205" y1="180" x2="230" y2="205" stroke="#66c0f4" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>

            <h2 className="no-results-title">
              Your search did not match any {filters.find(f => f.type === type)?.name.toLowerCase() || type}
            </h2>

            {otherResults.length > 0 && (
              <p className="no-results-subtitle">
                However we found{" "}
                {otherResults.map((f, i, arr) => {
                  return (
                    <React.Fragment key={f.type}>
                      <a href={`/search?q=${query}&type=${f.type}`}>{f.count} {f.name.toLowerCase()}</a>
                      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " and " : ""}
                    </React.Fragment>
                  )
                })}
                {" "}that matched your search query.
              </p>
            )}

            <p className="no-results-subtitle" style={{ marginTop: 0, fontSize: '14px' }}>
              Alternatively try one of the tips below.
            </p>

            <div className="search-suggestions">
              <details className="suggestion-dropdown">
                <summary>Search across an organization</summary>
                <div className="dropdown-content">
                  <p>
                    Use the <code>org:</code> qualifier to search within
                    specific organizations
                  </p>
                  <code>org:trackcodex {query}</code>
                </div>
              </details>

              <details className="suggestion-dropdown">
                <summary>Saved searches</summary>
                <div className="dropdown-content">
                  <p>You don't have any saved searches yet.</p>
                  <a href="/search/saved" style={{ color: 'var(--gh-primary)', textDecoration: 'none' }}>Manage saved searches</a>
                </div>
              </details>
            </div>

            <p className="advanced-search-tip">
              You could try an <a href="/search/advanced">advanced search</a>.
            </p>
          </div>
        ) : (
          // Results List
          <div className="results-list">
            {results.map((result, idx) => (
              <div key={idx} className="result-card">
                <div className="result-header">
                  <span className="material-icons result-type-icon">
                    {result.icon}
                  </span>
                  <a href={result.url} className="result-title">
                    {result.label}
                  </a>
                </div>
                {result.subLabel && (
                  <p className="result-description">{result.subLabel}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const formattedCount = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default SearchResultsPage;

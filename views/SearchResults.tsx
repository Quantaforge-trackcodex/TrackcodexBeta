import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/SearchResults.css";

interface SearchFilter {
  name: string;
  icon: string;
  count: number;
  type: string;
}

interface SearchResultsPageProps {}

const SearchResultsPage: React.FC<SearchResultsPageProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "repositories";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("best-match");
  const [searchTime, setSearchTime] = useState(0);

  // Filter categories with counts
  const [filters, setFilters] = useState<SearchFilter[]>([
    { name: "Code", icon: "code", count: 0, type: "code" },
    { name: "Repositories", icon: "book", count: 0, type: "repositories" },
    { name: "Issues", icon: "error_outline", count: 0, type: "issues" },
    {
      name: "Pull requests",
      icon: "merge_type",
      count: 3,
      type: "pullrequests",
    },
    { name: "Discussions", icon: "forum", count: 0, type: "discussions" },
    { name: "Users", icon: "person", count: 0, type: "users" },
    { name: "Commits", icon: "commit", count: 1, type: "commits" },
    { name: "Packages", icon: "inventory_2", count: 0, type: "packages" },
    { name: "Wikis", icon: "description", count: 5, type: "wikis" },
    { name: "Topics", icon: "label", count: 0, type: "topics" },
    { name: "Marketplace", icon: "store", count: 0, type: "marketplace" },
  ]);

  useEffect(() => {
    performSearch();
  }, [query, type]);

  const performSearch = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      const res = await fetch(
        `/api/v1/search?q=${encodeURIComponent(query)}&type=${type}`,
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);

        // Update filter counts (mock data for now)
        // In real implementation, backend would return counts for each type
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      const endTime = performance.now();
      setSearchTime(Math.round(endTime - startTime));
      setLoading(false);
    }
  };

  const totalResults = results.length;
  const hasOtherResults = filters.some((f) => f.type !== type && f.count > 0);

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
              <span className="material-icons filter-icon">{filter.icon}</span>
              <span className="filter-name">{filter.name}</span>
              <span className="filter-count">{filter.count}</span>
            </button>
          ))}
        </nav>

        <a href="/search/advanced" className="advanced-search-link">
          <span className="material-icons">search</span>
          Advanced search
        </a>
      </aside>

      {/* Main Results Area */}
      <main className="search-main">
        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">
              {totalResults} result{totalResults !== 1 ? "s" : ""}
            </span>
            {searchTime > 0 && (
              <span className="results-time">({searchTime} ms)</span>
            )}
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

            <button className="save-button">
              <span className="material-icons">bookmark_border</span>
              Save
            </button>

            <button className="more-options">
              <span className="material-icons">more_horiz</span>
            </button>
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
              <svg width="300" height="200" viewBox="0 0 300 200" fill="none">
                {/* Illustration SVG - simplified version */}
                <circle cx="150" cy="100" r="80" fill="#f6f8fa" />
                <circle cx="150" cy="100" r="60" fill="#0969da" opacity="0.1" />
                <path
                  d="M150 60 L150 140 M110 100 L190 100"
                  stroke="#6e7781"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle
                  cx="180"
                  cy="130"
                  r="25"
                  fill="#fff"
                  stroke="#6e7781"
                  strokeWidth="3"
                />
                <line
                  x1="198"
                  y1="148"
                  x2="220"
                  y2="170"
                  stroke="#6e7781"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="no-results-title">
              Your search did not match any {type}
            </h2>

            {hasOtherResults && (
              <p className="no-results-subtitle">
                However we found{" "}
                {filters
                  .filter((f) => f.count > 0 && f.type !== type)
                  .map((f, i, arr) => {
                    const text = `${f.count} ${f.name.toLowerCase()}`;
                    if (i === arr.length - 1 && arr.length > 1)
                      return `and ${text}`;
                    return text;
                  })
                  .join(", ")}{" "}
                that matched your search query.
                <br />
                Alternatively try one of the tips below.
              </p>
            )}

            <div className="search-suggestions">
              <details className="suggestion-dropdown">
                <summary>Search across an organization</summary>
                <div className="dropdown-content">
                  <p>
                    Use the <code>org:</code> qualifier to search within
                    specific organizations
                  </p>
                  <code>org:github {query}</code>
                </div>
              </details>

              <details className="suggestion-dropdown">
                <summary>Saved searches</summary>
                <div className="dropdown-content">
                  <p>You don't have any saved searches yet.</p>
                  <a href="/search/saved">Manage saved searches</a>
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

export default SearchResultsPage;

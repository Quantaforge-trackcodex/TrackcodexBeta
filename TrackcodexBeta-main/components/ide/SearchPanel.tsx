import React, { useState } from "react";

const SearchPanel = () => {
  const [query, setQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [isReplaceExpanded, setIsReplaceExpanded] = useState(false);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/search/code?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();

        // Group by file path for the tree view
        const grouped: any = {};
        data.results.forEach((item: any) => {
          const path = item.subLabel.split(" • ")[1];
          if (!grouped[path]) {
            grouped[path] = {
              file: path.split("/").pop(),
              path,
              matches: 0,
              lines: [],
            };
          }
          grouped[path].matches++;
          grouped[path].lines.push({
            line: parseInt(item.subLabel.split(" • ")[2].replace("Line ", "")),
            content: item.metadata.signature || item.label,
            original: item,
          });
        });

        setResults(Object.values(grouped));
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full h-full flex flex-col bg-[#252526] text-[#cccccc] font-sans">
      <div className="px-4 py-2 text-[11px] text-[#bbbbbb] flex items-center justify-between font-bold">
        <span className="tracking-wide uppercase">SEARCH</span>
        <div className="flex items-center gap-1">
          <span
            className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white"
            title="Refresh"
          >
            refresh
          </span>
          <span
            className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white"
            title="Collapse All"
          >
            collapse_all
          </span>
        </div>
      </div>

      <div className="px-3 pb-2 border-b border-[#30363d] relative">
        <div className="flex flex-col gap-1.5 relative">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#3c3c3c] border border-[#3c3c3c] focus:border-[#007fd4] text-white text-[13px] px-2 py-1 outline-none placeholder-[#969696] rounded-sm pr-16"
            />
            <div className="absolute right-1 top-1 flex items-center gap-0.5">
              <span
                className="material-symbols-outlined !text-[14px] cursor-pointer hover:bg-[#454545] p-0.5 rounded text-[#cccccc]"
                title="Match Case"
              >
                uppercase
              </span>
              <span
                className="material-symbols-outlined !text-[14px] cursor-pointer hover:bg-[#454545] p-0.5 rounded text-[#cccccc]"
                title="Match Whole Word"
              >
                match_word
              </span>
              <span
                className="material-symbols-outlined !text-[14px] cursor-pointer hover:bg-[#454545] p-0.5 rounded text-[#cccccc]"
                title="Use Regular Expression"
              >
                regular_expression
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span
              onClick={() => setIsReplaceExpanded(!isReplaceExpanded)}
              className={`material-symbols-outlined !text-[16px] cursor-pointer transition-transform ${isReplaceExpanded ? "rotate-90" : ""}`}
            >
              chevron_right
            </span>

            {isReplaceExpanded && (
              <div className="relative flex-1">
                <input
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace"
                  className="w-full bg-[#3c3c3c] border border-[#3c3c3c] focus:border-[#007fd4] text-white text-[13px] px-2 py-1 outline-none placeholder-[#969696] rounded-sm pr-8"
                />
                <span
                  className="material-symbols-outlined !text-[14px] absolute right-1 top-1 cursor-pointer hover:bg-[#454545] p-0.5 rounded text-[#cccccc]"
                  title="Replace All"
                >
                  find_replace
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
        {query.length > 2 && (
          <div className="px-4 text-[11px] text-[#cccccc] mb-2">
            {results.reduce((acc, curr) => acc + curr.matches, 0)} results in{" "}
            {results.length} files
          </div>
        )}

        {results.map((res, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer group">
              <span className="material-symbols-outlined !text-[16px] text-[#cccccc]">
                expand_more
              </span>
              <span className="material-symbols-outlined !text-[16px] text-[#cccccc]">
                {res.file.endsWith("cpp") ? "code" : "description"}
              </span>
              <span className="text-[13px] font-bold text-[#e8e8e8]">
                {res.file.split("/").pop()}
              </span>
              <span className="text-[11px] text-[#888888] ml-1">
                {res.path}
              </span>
              <span className="ml-auto bg-[#454545] text-white text-[10px] px-1.5 rounded-full">
                {res.matches}
              </span>
            </div>
            {res.lines.map((line, lIdx) => (
              <div
                key={lIdx}
                onClick={() =>
                  line.original && (window.location.hash = line.original.url)
                }
                className="pl-6 pr-2 py-0.5 hover:bg-[#37373d] cursor-pointer text-[12px] font-mono text-[#bbbbbb] truncate flex items-center"
              >
                <span className="w-6 text-right mr-2 text-[#666666] shrink-0">
                  {line.line}
                </span>
                <span className="truncate">{line.content.trim()}</span>
              </div>
            ))}
          </div>
        ))}

        {query.length > 0 && query.length <= 2 && (
          <div className="p-4 text-center text-xs text-[#969696]">
            Type more to search...
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;

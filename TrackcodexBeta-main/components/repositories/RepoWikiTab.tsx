import React, { useState, useEffect } from "react";
import { Repository } from "../../types";

interface RepoWikiTabProps {
  repo: Repository;
}

const RepoWikiTab: React.FC<RepoWikiTabProps> = ({ repo }) => {
  const [pages, setPages] = useState<{ slug: string; title: string }[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("Home");
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPages();
  }, [repo.id]);

  useEffect(() => {
    if (activeSlug) fetchPageContent(activeSlug);
  }, [activeSlug, repo.id]);

  const fetchPages = async () => {
    try {
      const res = await fetch(`/api/v1/repositories/${repo.id}/wiki/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data);
        if (data.length > 0 && !data.find((p: any) => p.slug === "Home")) {
          setActiveSlug(data[0].slug);
        }
      }
    } catch (e) {
      console.error("Failed to fetch pages", e);
    }
  };

  const fetchPageContent = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repo.id}/wiki/pages/${slug}`,
      );
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setEditVal(data.content);
      } else {
        setContent("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/v1/repositories/${repo.id}/wiki/pages/${activeSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editVal }),
      });
      setIsEditing(false);
      fetchPageContent(activeSlug);
    } catch (e) {
      alert("Failed to save page");
    }
  };

  return (
    <div className="flex gap-8 p-6">
      {/* Wiki Sidebar */}
      <div className="w-[240px] text-sm hidden md:block">
        <div className="flex items-center justify-between font-bold text-[#c9d1d9] mb-2 px-2">
          <span>Pages</span>
        </div>
        <ul className="text-[#c9d1d9] space-y-1">
          {pages.map((page) => (
            <li
              key={page.slug}
              onClick={() => setActiveSlug(page.slug)}
              className={`px-2 py-1.5 rounded-md cursor-pointer ${
                activeSlug === page.slug
                  ? "bg-[#21262d] font-medium border-l-[3px] border-[#f78166]"
                  : "hover:underline opacity-75 hover:opacity-100"
              }`}
            >
              {page.title}
            </li>
          ))}
          {pages.length === 0 && <li className="px-2 opacity-50">No pages</li>}
        </ul>

        <button
          className="mt-4 w-full text-xs text-[#8b949e] hover:text-[#58a6ff] text-left px-2 mb-4"
          onClick={() => {
            const newTitle = prompt("Enter page title:");
            if (newTitle) {
              const slug = newTitle.replace(/\s+/g, "-");
              setPages([...pages, { slug, title: newTitle }]);
              setActiveSlug(slug);
              setIsEditing(true);
              setEditVal(`# ${newTitle}\n\nNew page content.`);
            }
          }}
        >
          + Add a custom page
        </button>

        <div className="border-t border-[#30363d] pt-4">
          <div className="text-[#8b949e] font-bold text-xs mb-2 px-2">
            Clone this wiki locally
          </div>
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden">
            <input
              type="text"
              aria-label="Wiki Clone URL"
              value={`https://trackcodex.dev/${repo.name}.wiki.git`}
              readOnly
              className="w-full bg-transparent text-xs text-[#c9d1d9] px-2 py-1 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Wiki Content */}
      <div className="flex-1 min-h-[400px]">
        <div className="flex items-center justify-between border-b border-[#30363d] pb-4 mb-6">
          <h1 className="text-3xl font-normal text-[#c9d1d9]">
            {activeSlug.replace(/-/g, " ")}
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-[#1f6feb] border border-[#1f6feb] text-white rounded-md text-sm font-bold hover:bg-[#388bfd] transition-colors"
            >
              Edit Page
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] rounded-md text-sm font-bold hover:bg-[#30363d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#238636] border border-[#238636] text-white rounded-md text-sm font-bold hover:bg-[#2ea043] transition-colors"
              >
                Save Page
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading content...
          </div>
        ) : isEditing ? (
          <>
            <label htmlFor="wiki-content" className="sr-only">
              Wiki page content
            </label>
            <textarea
              id="wiki-content"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              className="w-full h-[500px] bg-[#0d1117] border border-[#30363d] rounded-md p-4 text-[#c9d1d9] font-mono focus:border-[#58a6ff] focus:outline-none resize-none"
              aria-label="Edit wiki page content"
            />
          </>
        ) : (
          <div className="prose prose-invert max-w-none text-[#c9d1d9] space-y-4 whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoWikiTab;

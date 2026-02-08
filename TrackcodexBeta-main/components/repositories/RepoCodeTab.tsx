import React, { useState, useEffect } from "react";
import { MOCK_REPO_FILES } from "../../constants";
import { Repository } from "../../types";
import { githubService } from "../../services/github";
import UniversalFileList from "../common/UniversalFileList";
import RepoCodeViewer from "./RepoCodeViewer";

import { FileItem } from "../common/UniversalFileList";

interface RepoCodeTabProps {
  repo: Repository;
}

const RepoCodeTab: React.FC<RepoCodeTabProps> = ({ repo }) => {
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    line?: number;
  } | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      if (!repo.name) return;

      setLoading(true);
      try {
        // Use internal Native Git API
        const res = await fetch(
          `/api/v1/repositories/${repo.id}/contents?path=${encodeURIComponent(currentPath)}`,
        );

        if (res.ok) {
          const data = await res.json();
          // Map internal API to FileItem type
          const mappedFiles: FileItem[] = data.map((item: any) => ({
            name: item.name,
            type: item.type === "tree" || item.type === "dir" ? "dir" : "file",
            commitVal: "Updated just now", // We could fetch latest commit for file later
            time: "Recently",
            path: item.path, // Full path
          }));

          setFiles(mappedFiles);
        } else {
          // Fallback or empty
          setFiles([]);
        }
      } catch (err) {
        console.error("Failed to fetch contents", err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [repo.id, repo.name, currentPath]);

  const handleFileClick = (file: FileItem) => {
    if (file.type === "dir") {
      setCurrentPath(file.path);
    } else {
      setSelectedFile({ path: file.path });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Repo Stats & Controls */}
      <div className="flex items-center justify-between">
        {/* Left: Stats/History */}
        <div className="flex items-center gap-4 text-sm font-medium text-gh-text-secondary">
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined !text-[18px]">
              history
            </span>
            <span className="text-gh-text font-bold">Latest History</span>
          </button>
          <span className="text-gh-border">|</span>
          <div className="flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined !text-[14px]">
              adjust
            </span>
            {repo.open_issues || 0} issues
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() =>
              setCurrentPath(currentPath.split("/").slice(0, -1).join("/"))
            }
            disabled={!currentPath}
            className="px-3 py-1 text-xs font-bold bg-gh-bg-secondary border border-gh-border rounded hover:bg-gh-bg-tertiary disabled:opacity-50"
          >
            Back
          </button>
          <span className="text-xs text-gh-text-secondary font-mono mr-2">
            {currentPath || "/"}
          </span>

          {/* CLONE BUTTON (New) */}
          <div className="relative group">
            <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm">
              Code
              <span className="material-symbols-outlined !text-[16px]">
                arrow_drop_down
              </span>
            </button>

            {/* Dropdown Content (CSS native hover for simplicity, or State) */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-gh-bg-secondary border border-gh-border rounded-md shadow-xl p-4 hidden group-hover:block z-50">
              <div className="flex items-center gap-2 border-b border-gh-border pb-2 mb-3">
                <span className="material-symbols-outlined text-gh-text-secondary">
                  terminal
                </span>
                <h4 className="font-bold text-sm">Clone</h4>
              </div>

              <div className="text-xs text-gh-text-secondary mb-2">HTTPS</div>
              <div className="flex items-center gap-0 border border-gh-border rounded-md overflow-hidden bg-gh-bg">
                <input
                  readOnly
                  aria-label="Clone URL"
                  title="Repository Clone URL"
                  value={`${window.location.protocol}//${window.location.host}/git/${repo.name || repo.id}.git`}
                  className="flex-1 bg-transparent px-2 py-1.5 text-xs font-mono outline-none text-gh-text select-all"
                />
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.protocol}//${window.location.host}/git/${repo.name || repo.id}.git`,
                    )
                  }
                  className="px-2 py-1.5 hover:bg-gh-bg-tertiary border-l border-gh-border"
                  title="Copy to clipboard"
                >
                  <span className="material-symbols-outlined !text-[14px]">
                    content_copy
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-gh-text-secondary mt-2">
                Use Git or checkout with SVN using the web URL.
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gh-text-secondary">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold">Synchronizing File Tree...</p>
        </div>
      ) : selectedFile ? (
        <div className="h-[600px] mb-6">
          <RepoCodeViewer
            repoId={repo.id}
            path={selectedFile.path}
            initialLine={selectedFile.line}
            onClose={() => setSelectedFile(null)}
          />
        </div>
      ) : (
        <UniversalFileList
          files={files}
          onFileClick={handleFileClick}
          latestCommit={{
            message: "Project files synchronized with GitHub Hardware",
            author: repo.owner || "trackcodex",
            time: "Live",
            avatar: "https://github.com/github.png",
          }}
        />
      )}

      {/* Readme Section */}
      <div className="mt-6 border border-gh-border rounded-md overflow-hidden bg-gh-bg">
        <div className="border-b border-gh-border px-4 py-2 flex items-center justify-between sticky top-0 bg-gh-bg z-10">
          <div className="flex items-center gap-2 text-sm font-bold text-gh-text">
            <span className="material-symbols-outlined !text-[18px]">list</span>
            README.md
          </div>
        </div>
        <div className="p-8 prose prose-invert max-w-none text-gh-text">
          <div
            dangerouslySetInnerHTML={{
              __html:
                repo.description ||
                "No description provided for this repository.",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RepoCodeTab;

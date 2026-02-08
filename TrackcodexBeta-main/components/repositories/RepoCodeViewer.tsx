import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

interface RepoCodeViewerProps {
  repoId: string;
  path: string;
  onClose: () => void;
  initialLine?: number;
}

const RepoCodeViewer: React.FC<RepoCodeViewerProps> = ({
  repoId,
  path,
  onClose,
  initialLine,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Assuming we have an endpoint that can fetch file content from indexed repos
        // Or we use the git server to read the file
        const res = await fetch(
          `/api/v1/repositories/${repoId}/content?path=${encodeURIComponent(path)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        } else {
          setContent("// Error: Failed to load file content.");
        }
      } catch (err) {
        setContent("// Error: Network failure.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [repoId, path]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border border-gh-border rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#252526] px-4 py-2 border-b border-[#1e1e1e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 !text-[18px]">
            description
          </span>
          <span className="text-sm font-mono text-gh-text-secondary truncate max-w-[400px]">
            {path}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors text-gh-text-secondary"
        >
          <span className="material-symbols-outlined !text-[18px]">close</span>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-gh-text-secondary gap-4">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold animate-pulse uppercase tracking-widest">
              Fetching Source Hardware...
            </p>
          </div>
        ) : (
          <Editor
            height="100%"
            path={path}
            value={content}
            language={path.split(".").pop() || "plaintext"}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbersMinChars: 3,
            }}
            onMount={(editor) => {
              if (initialLine) {
                editor.revealLineInCenter(initialLine);
                editor.setPosition({ lineNumber: initialLine, column: 1 });
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RepoCodeViewer;

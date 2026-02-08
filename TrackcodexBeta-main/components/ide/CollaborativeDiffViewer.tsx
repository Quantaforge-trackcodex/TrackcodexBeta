import React, { useRef, useEffect } from "react";
import { DiffEditor, Monaco } from "@monaco-editor/react";
import { useRealtime } from "../../contexts/RealtimeContext";

interface CollaborativeDiffViewerProps {
  original: string;
  modified: string;
  language: string;
  prId: number;
  fileName: string;
}

const CollaborativeDiffViewer: React.FC<CollaborativeDiffViewerProps> = ({
  original,
  modified,
  language,
  prId,
  fileName,
}) => {
  const { send, subscribe, presence } = useRealtime();
  const diffEditorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    diffEditorRef.current = editor;

    // Configure diff editor
    editor.updateOptions({
      renderSideBySide: true,
      readOnly: true,
      minimap: { enabled: false },
      fontSize: 13,
      fontFamily: "'JetBrains Mono', monospace",
      automaticLayout: true,
      scrollBeyondLastLine: false,
    });

    // Notify others that we are reviewing this file
    send({
      type: "PR_REVIEW_ACTIVITY",
      prId,
      fileName,
      status: "reviewing",
    });
  };

  useEffect(() => {
    if (prId) {
      send({ type: "WORKSPACE_JOIN", workspaceId: `pr-${prId}` });
    }
  }, [prId, send]);

  return (
    <div className="h-[500px] border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
      <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined !text-[18px] text-[#8b949e]">
            history_edu
          </span>
          <span className="text-sm font-mono text-[#c9d1d9]">{fileName}</span>
        </div>
        <div className="flex -space-x-2">
          {presence.slice(0, 5).map((uid) => (
            <div
              key={uid}
              className="size-6 rounded-full border-2 border-[#161b22] bg-[#30363d] flex items-center justify-center text-[10px] text-white font-bold"
              title={`User ${uid} is reviewing`}
            >
              {uid.substring(0, 1).toUpperCase()}
            </div>
          ))}
          {presence.length > 5 && (
            <div className="size-6 rounded-full border-2 border-[#161b22] bg-[#21262d] flex items-center justify-center text-[10px] text-[#8b949e]">
              +{presence.length - 5}
            </div>
          )}
        </div>
      </div>
      <DiffEditor
        height="100%"
        language={language}
        original={original}
        modified={modified}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-[#8b949e] text-sm animate-pulse">
            Generating Secure Diff...
          </div>
        }
      />
    </div>
  );
};

export default CollaborativeDiffViewer;

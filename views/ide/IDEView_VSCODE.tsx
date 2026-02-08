import React from "react";
import { useParams } from "react-router-dom";

/**
 * IDEView - Full VS Code OSS Integration
 *
 * This replaces the Monaco simulator with real VS Code Web
 */
const IDEView: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="w-full h-screen flex flex-col bg-[#1e1e1e]">
      {/* VS Code Web Iframe - Embedding vscode.dev for now */}
      <iframe
        src="https://vscode.dev"
        className="w-full h-full border-0"
        title="TrackCodex IDE (VS Code OSS)"
        allow="cross-origin-isolated; clipboard-read; clipboard-write; microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-popups-to-escape-sandbox"
      />

      {/* Attribution Footer */}
      <div className="absolute bottom-2 right-2 bg-[#1e1e1e]/90 backdrop-blur-sm border border-[#3c3c3c] rounded px-3 py-1 text-[10px] text-[#858585]">
        <span>Powered by </span>
        <a
          href="https://github.com/microsoft/vscode"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#007fd4] hover:underline"
        >
          VS Code OSS
        </a>
        <span> (MIT License)</span>
      </div>
    </div>
  );
};

export default IDEView;

import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Import the working components from IDEShim
import ActivityBar from "../../components/ide/ActivityBar";
import FileExplorer from "../../components/ide/FileExplorer";
import MonacoEditor from "../../components/ide/MonacoEditor";
import Terminal from "../../components/ide/Terminal";
import SourceControlPanel from "../../components/ide/SourceControlPanel";
import SearchPanel from "../../components/ide/SearchPanel";
import ExtensionsPanel from "../../components/ide/ExtensionsPanel";
import RunAndDebugPanel from "../../components/ide/RunAndDebugPanel";

/**
 * TrackCodex IDE - Branded Monaco Integration
 *
 * Combines working Monaco editor with TrackCodex branding
 */
const TrackCodexIDE: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // IDE State
  const [activePanel, setActivePanel] = useState<
    "explorer" | "search" | "source-control" | "debug" | "extensions"
  >("explorer");
  const [openFiles, setOpenFiles] = useState<any[]>([
    {
      id: 1,
      name: "index.tsx",
      path: "/src/index.tsx",
      language: "typescript",
      content:
        '// Welcome to TrackCodex IDE\nimport React from "react";\n\nfunction App() {\n  return <h1>Hello TrackCodex!</h1>;\n}\n\nexport default App;',
    },
  ]);
  const [activeFileId, setActiveFileId] = useState(1);
  const [showTerminal, setShowTerminal] = useState(true);

  const activeFile = openFiles.find((f) => f.id === activeFileId);

  const handleFileChange = (content: string | undefined) => {
    if (!content || !activeFile) return;
    setOpenFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content } : f)),
    );
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* ========== TRACKCODEX BRANDED HEADER ========== */}
      <div className="h-12 bg-gradient-to-r from-[#0a0a0f] via-[#1a0f2e] to-[#0a0a0f] border-b border-[#2d1b4e]/30 flex items-center px-4 justify-between z-50 shrink-0">
        {/* Left: Branding */}
        <div className="flex items-center space-x-4">
          {/* TrackCodex Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] p-0.5">
              <div className="w-full h-full rounded-lg bg-[#0a0a0f] flex items-center justify-center">
                <span className="text-[#8b5cf6] font-bold text-lg">T</span>
              </div>
            </div>
            <div>
              <h1 className="text-white text-sm font-semibold tracking-tight">
                TrackCodex IDE
              </h1>
              <p className="text-[#6b7280] text-[10px] -mt-0.5">
                Workspace {id}
              </p>
            </div>
          </div>

          {/* Active File Indicator */}
          {activeFile && (
            <div className="flex items-center space-x-2 ml-6 px-3 py-1 bg-[#1a1a2e]/50 rounded-md border border-[#2d1b4e]/30">
              <span className="material-symbols-outlined text-[#8b5cf6] text-[16px]">
                description
              </span>
              <span className="text-[#9ca3af] text-xs">{activeFile.name}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Command Palette */}
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-[#1a1a2e]/80 hover:bg-[#1a1a2e] border border-[#2d1b4e]/50 rounded-md transition-all group">
            <span className="material-symbols-outlined text-[#8b5cf6] text-[14px]">
              search
            </span>
            <span className="text-[#9ca3af] text-xs group-hover:text-white">
              Command Palette
            </span>
            <kbd className="ml-2 px-1.5 py-0.5 bg-[#0a0a0f] border border-[#2d1b4e]/30 rounded text-[10px] text-[#6b7280]">
              Ctrl+P
            </kbd>
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-[#1a1a2e]/80 rounded-md transition-all group">
            <span className="material-symbols-outlined text-[#6b7280] group-hover:text-[#8b5cf6] text-[18px]">
              settings
            </span>
          </button>
        </div>
      </div>

      {/* ========== IDE WORKSPACE (from IDEShim) ========== */}
      <div className="flex-1 flex min-h-0">
        {/* Activity Bar */}
        <ActivityBar activePanel={activePanel} onPanelChange={setActivePanel} />

        {/* Side Panel */}
        <div className="w-64 bg-[#1e1e1e] border-r border-[#2d2d2d] flex flex-col shrink-0">
          {activePanel === "explorer" && (
            <FileExplorer
              files={openFiles}
              onFileSelect={(file) => {
                if (!openFiles.find((f) => f.id === file.id)) {
                  setOpenFiles((prev) => [...prev, file]);
                }
                setActiveFileId(file.id);
              }}
            />
          )}
          {activePanel === "search" && <SearchPanel />}
          {activePanel === "source-control" && <SourceControlPanel />}
          {activePanel === "extensions" && <ExtensionsPanel />}
          {activePanel === "debug" && <RunAndDebugPanel />}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab Bar */}
          <div className="h-9 bg-[#252526] border-b border-[#2d2d2d] flex items-center px-2 gap-1 shrink-0">
            {openFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t cursor-pointer transition-all ${
                  file.id === activeFileId
                    ? "bg-[#1e1e1e] text-white border-t-2 border-[#8b5cf6]"
                    : "bg-transparent text-[#969696] hover:bg-[#2d2d2d]"
                }`}
              >
                <span className="material-symbols-outlined !text-[14px]">
                  description
                </span>
                <span className="text-xs">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFiles((prev) =>
                      prev.filter((f) => f.id !== file.id),
                    );
                    if (file.id === activeFileId && openFiles.length > 1) {
                      setActiveFileId(
                        openFiles[0].id === file.id
                          ? openFiles[1].id
                          : openFiles[0].id,
                      );
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                >
                  <span className="material-symbols-outlined !text-[14px]">
                    close
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            {activeFile ? (
              <MonacoEditor
                content={activeFile.content}
                language={activeFile.language}
                onChange={handleFileChange}
                theme="vs-dark"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[#969696]">
                <div className="text-center">
                  <span className="material-symbols-outlined !text-[64px] mb-4 text-[#8b5cf6]">
                    code
                  </span>
                  <p>Select a file to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Panel */}
          {showTerminal && (
            <div className="h-48 border-t border-[#2d2d2d] shrink-0">
              <Terminal />
            </div>
          )}
        </div>
      </div>

      {/* ========== TRACKCODEX BRANDED STATUS BAR ========== */}
      <div className="h-7 bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#06b6d4] flex items-center px-4 justify-between text-white text-xs z-50 shrink-0">
        {/* Left Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[14px]">
              radio_button_checked
            </span>
            <span>TrackCodex IDE v1.0</span>
          </div>
          <div className="flex items-center space-x-1.5 opacity-80">
            <span className="material-symbols-outlined text-[14px]">
              folder_open
            </span>
            <span>Workspace {id}</span>
          </div>
          {activeFile && (
            <div className="flex items-center space-x-1.5 opacity-80">
              <span className="material-symbols-outlined text-[14px]">
                edit
              </span>
              <span>{activeFile.name}</span>
            </div>
          )}
        </div>

        {/* Right Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 opacity-80">
            <span className="material-symbols-outlined text-[14px]">
              extension
            </span>
            <span>Monaco Editor</span>
          </div>
          <div className="flex items-center space-x-1.5 opacity-80">
            <span className="material-symbols-outlined text-[14px]">code</span>
            <span>TypeScript</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCodexIDE;

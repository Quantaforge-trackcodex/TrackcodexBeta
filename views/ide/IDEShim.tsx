import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import FileExplorer from "../../components/ide/FileExplorer";
import MonacoEditor from "../../components/ide/MonacoEditor";
import Terminal from "../../components/ide/Terminal";
import ExtensionsPanel from "../../components/ide/ExtensionsPanel";
import { VirtualFileSystem, FileNode } from "../../utils/virtualFileSystem";
import { useRealtime } from "../../contexts/RealtimeContext";

const IDEShim: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected, presence, send } = useRealtime();
  // VFS State
  const vfs = VirtualFileSystem.getInstance();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lazy init to prevent double-render on mount
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);

  const [activeView, setActiveView] = useState<
    "files" | "extensions" | "search" | "git"
  >("files");

  useEffect(() => {
    const initIDE = async () => {
      if (!id) return;
      setIsLoading(true);
      const wsFiles = await vfs.loadWorkspace(id);
      setFiles([...wsFiles]);

      // Auto-open README.md if it exists
      const readme = vfs.findNode("README.md");
      if (readme) {
        const content = await vfs.getFileContent(readme.id);
        setActiveFile({ ...readme, content });
      }
      setIsLoading(false);
    };

    initIDE();
  }, [id, vfs]);

  const handleFileClick = async (file: FileNode) => {
    if (file.type === "file") {
      const content = await vfs.getFileContent(file.id);
      setActiveFile({ ...file, content });
    }
  };

  const handleEditorChange = async (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      await vfs.updateFileContent(activeFile.id, value);
    }
  };

  useEffect(() => {
    if (isConnected && id) {
      send({ type: "WORKSPACE_JOIN", workspaceId: id });
      return () => {
        send({ type: "WORKSPACE_LEAVE", workspaceId: id });
      };
    }
  }, [isConnected, id, send]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center text-primary">
        <div className="flex flex-col items-center">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <div className="text-sm font-medium animate-pulse">
            Mounting Real Hardware Storage...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden font-sans">
      {/* Top Bar (IDE Palette) */}
      <div className="h-9 bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center px-4 justify-between select-none">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-xs text-[#969696] bg-[#2d2d2d] px-32 py-1 rounded-md flex items-center border border-[#3c3c3c]">
          <span className="material-symbols-outlined text-[14px] mr-2">
            source_branch
          </span>
          TrackCodex IDE - {activeFile?.name || "No file selected"}
        </div>
        <div className="flex items-center space-x-3">
          {presence.length > 1 && (
            <div className="flex -space-x-2 mr-2">
              {presence.map((uid) => (
                <div
                  key={uid}
                  className="size-6 rounded-full border border-[#1e1e1e] bg-primary/20 flex items-center justify-center text-[10px] font-bold text-white uppercase ring-1 ring-primary/30"
                  title={`User ${uid} is online`}
                >
                  {uid.substring(0, 1)}
                </div>
              ))}
              <div className="size-6 bg-[#333] rounded-full border border-[#1e1e1e] flex items-center justify-center text-[8px] text-[#969696] ml-1">
                +{presence.length}
              </div>
            </div>
          )}
          <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-white">
            settings
          </span>
          <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-white">
            account_circle
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar (Leftmost Slim) */}
        <div className="w-12 bg-[#181818] border-r border-[#2b2b2b] flex flex-col items-center py-2 space-y-4 z-10 overflow-hidden">
          <div
            title="Explorer"
            onClick={() => setActiveView("files")}
            className={`p-2 border-l-2 cursor-pointer ${activeView === "files" ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}
          >
            <span
              className={`material-symbols-outlined text-[24px] ${activeView === "files" ? "text-white" : ""}`}
            >
              files
            </span>
          </div>
          <div
            title="Search"
            onClick={() => setActiveView("search")}
            className={`p-2 border-l-2 cursor-pointer ${activeView === "search" ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}
          >
            <span
              className={`material-symbols-outlined text-[24px] ${activeView === "search" ? "text-white" : ""}`}
            >
              search
            </span>
          </div>
          <div
            title="Source Control"
            onClick={() => setActiveView("git")}
            className={`p-2 border-l-2 cursor-pointer ${activeView === "git" ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}
          >
            <span
              className={`material-symbols-outlined text-[24px] ${activeView === "git" ? "text-white" : ""}`}
            >
              source_control
            </span>
          </div>
          <div className="p-2 border-l-2 border-transparent opacity-50 cursor-pointer hover:opacity-100">
            <span className="material-symbols-outlined text-[24px]">
              bug_report
            </span>
          </div>
          <div
            title="Extensions"
            onClick={() => setActiveView("extensions")}
            className={`p-2 border-l-2 cursor-pointer ${activeView === "extensions" ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}
          >
            <span
              className={`material-symbols-outlined text-[24px] ${activeView === "extensions" ? "text-white" : ""}`}
            >
              extension
            </span>
          </div>
        </div>

        {/* Resizable Panels */}
        <PanelGroup direction="horizontal" autoSaveId="ide-layout-h">
          {/* Side Panel (Explorer / Extensions) */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="bg-[#181818]"
          >
            {activeView === "files" && (
              <FileExplorer
                files={files}
                onFileClick={handleFileClick}
                activeFileId={activeFile?.id}
              />
            )}
            {activeView === "extensions" && <ExtensionsPanel />}
            {activeView === "search" && (
              <div className="p-4 text-xs text-[#858585]">
                <div className="mb-2">Search Workspace</div>
                <div className="opacity-50 italic">
                  Indexing workspace files...
                </div>
              </div>
            )}
            {activeView === "git" && (
              <div className="p-4 text-xs text-[#858585]">
                <div className="mb-2">Source Control</div>
                <div className="opacity-50 italic">
                  Connecting to GitNexus...
                </div>
              </div>
            )}
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#2b2b2b] hover:bg-[#007fd4] transition-colors" />

          {/* Main Editor Area */}
          <Panel>
            <PanelGroup direction="vertical" autoSaveId="ide-layout-v">
              <Panel defaultSize={70}>
                {activeFile ? (
                  <div className="h-full flex flex-col">
                    {/* Tab Bar */}
                    <div className="h-9 bg-[#1e1e1e] flex items-center border-b border-[#2b2b2b]">
                      <div className="h-full px-3 flex items-center bg-[#1e1e1e] border-t-2 border-[#007fd4] text-white text-sm min-w-[120px] justify-between">
                        <span className="mr-2">{activeFile.name}</span>
                        <span className="material-symbols-outlined text-[12px] hover:bg-[#333] rounded p-0.5 cursor-pointer">
                          close
                        </span>
                      </div>
                    </div>
                    {/* Editor */}
                    <div className="flex-1 relative">
                      <MonacoEditor
                        content={activeFile.content || ""}
                        fileId={activeFile.id}
                        language={
                          activeFile.name.endsWith("css")
                            ? "css"
                            : activeFile.name.endsWith("json")
                              ? "json"
                              : activeFile.name.endsWith("md")
                                ? "markdown"
                                : "typescript"
                        }
                        onChange={handleEditorChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-[#555]">
                    <div className="text-center">
                      <div className="mb-4 opacity-20">
                        <span className="material-symbols-outlined text-[64px]">
                          code_off
                        </span>
                      </div>
                      <p>Select a file to start editing</p>
                      <p className="text-xs mt-2 text-primary/50">
                        TrackCodex Professional IDE
                      </p>
                    </div>
                  </div>
                )}
              </Panel>

              <PanelResizeHandle className="h-1 bg-[#2b2b2b] hover:bg-[#007fd4] transition-colors" />

              {/* Terminal */}
              <Panel defaultSize={30} minSize={10}>
                <div className="h-full bg-[#1e1e1e] border-t border-[#2b2b2b] flex flex-col">
                  <div className="flex items-center px-4 py-1 text-xs uppercase tracking-wider space-x-4 border-b border-[#2b2b2b] text-[#969696]">
                    <span className="cursor-pointer hover:text-white underline decoration-[#007fd4] underline-offset-4 text-white">
                      Terminal
                    </span>
                    <span className="cursor-pointer hover:text-white">
                      Output
                    </span>
                    <span className="cursor-pointer hover:text-white">
                      Debug Console
                    </span>
                    <span className="cursor-pointer hover:text-white">
                      Problems
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <Terminal workspaceId={id || "default"} />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007fd4] text-white text-[11px] flex items-center px-3 justify-between select-none">
        <div className="flex items-center space-x-3">
          <span className="flex items-center cursor-pointer hover:bg-white/20 px-1 rounded">
            <span className="material-symbols-outlined text-[12px] mr-1">
              source_branch
            </span>{" "}
            main*
          </span>
          <span className="flex items-center cursor-pointer hover:bg-white/20 px-1 rounded">
            <span className="material-symbols-outlined text-[12px] mr-1">
              sync
            </span>{" "}
            0↓ 0↑
          </span>
          <span className="flex items-center cursor-pointer hover:bg-white/20 px-1 rounded">
            <span className="material-symbols-outlined text-[12px] mr-1">
              error
            </span>{" "}
            0
          </span>
          <span className="flex items-center cursor-pointer hover:bg-white/20 px-1 rounded">
            <span className="material-symbols-outlined text-[12px] mr-1">
              warning
            </span>{" "}
            0
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">
            Ln {1}, Col {1}
          </span>
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">
            Spaces: 2
          </span>
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">
            UTF-8
          </span>
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">
            {activeFile?.name.endsWith("ts") ? "TypeScript JSX" : "Markdown"}
          </span>
          <span className="cursor-pointer hover:bg-white/20 px-1 rounded">
            <span className="material-symbols-outlined text-[12px]">
              notifications
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default IDEShim;

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle
} from 'react-resizable-panels';
import { forgeAIService } from '../services/gemini';
import { fileService } from '../services/fileService';
import Spinner from '../components/ui/Spinner';
import FileExplorer from '../components/ide/FileExplorer';
import SearchPanel from '../components/ide/SearchPanel';
import SourceControlPanel from '../components/ide/SourceControlPanel';
import RunAndDebugPanel from '../components/ide/RunAndDebugPanel';
import ExtensionsPanel from '../components/ide/ExtensionsPanel';
import TerminalPanel from '../components/ide/TerminalPanel';
import { useParams } from 'react-router-dom';

// --- SHARED TYPES ---
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
  id?: string;
  language?: string;
  content?: string;
}

// --- AI ASSISTANT PANEL ---
interface ForgeAIAssistantPanelProps {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  activeFile: string;
}

interface Message {
  type: 'user' | 'ai' | 'system';
  text: string;
}

const ForgeAIAssistantPanel: React.FC<ForgeAIAssistantPanelProps> = ({ editorRef, activeFile }) => {
  const [conversation, setConversation] = useState<Message[]>([
    { type: 'system', text: 'ForgeAI assistant ready. Select code and choose an action, or ask a question.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  const handleAction = useCallback(async (action: 'review' | 'explain' | 'refactor') => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const selectedText = selection && !selection.isEmpty() ? editor.getModel()?.getValueInRange(selection) : editor.getValue();

    if (!selectedText) {
      setConversation(prev => [...prev, { type: 'system', text: 'Please select some code in the editor first.' }]);
      return;
    }

    let prompt = '';
    let serviceCall: Promise<string | undefined>;

    if (action === 'review') {
      prompt = `Reviewing selected code from ${activeFile}:`;
      serviceCall = forgeAIService.getCodeReview(selectedText, activeFile);
    } else if (action === 'explain') {
      prompt = `Explaining selected code from ${activeFile}:`;
      serviceCall = forgeAIService.getTechnicalAnswer(`Explain this code snippet`, selectedText, activeFile);
    } else { // refactor
      prompt = `Refactoring selected code from ${activeFile}:`;
      serviceCall = forgeAIService.getCodeRefactorSuggestion(selectedText, activeFile);
    }

    setConversation(prev => [...prev, { type: 'user', text: prompt }]);
    setIsLoading(true);

    try {
      const response = await serviceCall;
      setConversation(prev => [...prev, { type: 'ai', text: response || "I couldn't generate a response." }]);
    } catch (e: any) {
      setConversation(prev => [...prev, { type: 'system', text: `An error occurred: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  }, [editorRef, activeFile]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const editor = editorRef.current;
    const fullCode = editor ? editor.getValue() : '';

    const question = input;
    setInput('');
    setConversation(prev => [...prev, { type: 'user', text: question }]);
    setIsLoading(true);

    try {
      const response = await forgeAIService.getTechnicalAnswer(question, fullCode, activeFile);
      setConversation(prev => [...prev, { type: 'ai', text: response || "I couldn't generate a response." }]);
    } catch (e: any) {
      setConversation(prev => [...prev, { type: 'system', text: `An error occurred: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const actions = [
      editor.addAction({ id: 'forgeai-explain', label: 'ForgeAI: Explain Selection', contextMenuGroupId: '9_cutcopypaste', contextMenuOrder: 3.1, run: () => handleAction('explain') }),
      editor.addAction({ id: 'forgeai-review', label: 'ForgeAI: Review Selection', contextMenuGroupId: '9_cutcopypaste', contextMenuOrder: 3.2, run: () => handleAction('review') }),
      editor.addAction({ id: 'forgeai-refactor', label: 'ForgeAI: Refactor Selection', contextMenuGroupId: '9_cutcopypaste', contextMenuOrder: 3.3, run: () => handleAction('refactor') }),
    ];

    return () => {
      actions.forEach(action => action.dispose());
    };
  }, [editorRef, handleAction]);


  return (
    <div className="h-full bg-vscode-sidebar flex flex-col text-sm">
      <div className="h-10 flex items-center px-4 border-b border-vscode-border">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-400 !text-base filled">auto_awesome</span>
          ForgeAI Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-2 ${msg.type === 'user' ? 'items-end' : ''}`}>
            {msg.type === 'ai' && <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">ForgeAI</div>}
            <div className={`p-3 rounded-lg max-w-[90%] prose prose-invert prose-sm leading-relaxed ${msg.type === 'user' ? 'bg-primary text-white' :
              msg.type === 'ai' ? 'bg-[#2a2d2e] border border-vscode-border' :
                'text-center text-xs text-slate-500 w-full'
              }`}>
              {msg.text.split(/```(\w*)\n([\s\S]*?)```/g).map((part, index) => {
                if (index % 3 === 2) {
                  return <pre key={index} className="bg-black/50 p-3 rounded-md overflow-x-auto my-2"><code className="font-mono">{part}</code></pre>
                }
                if (index % 3 === 0) {
                  return <div key={index}>{part}</div>
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-purple-400 animate-pulse p-3">
            <Spinner size="sm" />
            <span className="text-xs font-bold uppercase">ForgeAI is thinking...</span>
          </div>
        )}
        <div ref={conversationEndRef} />
      </div>

      <div className="p-4 border-t border-vscode-border space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleAction('review')} className="px-2 py-1.5 bg-[#2a2d2e] text-slate-300 text-[10px] font-bold rounded hover:bg-white/10 transition-colors">Review</button>
          <button onClick={() => handleAction('refactor')} className="px-2 py-1.5 bg-[#2a2d2e] text-slate-300 text-[10px] font-bold rounded hover:bg-white/10 transition-colors">Refactor</button>
          <button onClick={() => handleAction('explain')} className="px-2 py-1.5 bg-[#2a2d2e] text-slate-300 text-[10px] font-bold rounded hover:bg-white/10 transition-colors">Explain</button>
        </div>
        <form onSubmit={handleAskQuestion}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="w-full bg-vscode-editor border border-vscode-border rounded-md px-3 py-2 text-xs text-white focus:ring-1 focus:ring-primary outline-none"
          />
        </form>
      </div>
    </div>
  );
};

// --- MENU BAR COMPONENT ---

interface MenuItem {
  label: string;
  action?: () => void;
  shortcut?: string;
}

const MenuBarItem = ({ label, items = [] }: { label: string; items?: (string | MenuItem)[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 text-[13px] hover:bg-[#333333] rounded-sm transition-colors cursor-default ${isOpen ? 'bg-[#333333] text-white' : 'text-[#cccccc]'}`}
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full min-w-[200px] bg-[#252526] border border-[#454545] shadow-xl py-1 rounded-sm flex flex-col z-[100]">
          {items.map((item, i) => {
            const isString = typeof item === 'string';
            const itemLabel = isString ? item : item.label;
            const itemAction = isString ? undefined : item.action;
            const itemShortcut = isString ? undefined : item.shortcut;

            return (
              <button
                key={i}
                onClick={() => {
                  if (itemAction) itemAction();
                  setIsOpen(false);
                }}
                className="text-left px-3 py-1.5 text-[12px] text-[#cccccc] hover:bg-[#094771] hover:text-white flex items-center justify-between group"
              >
                <span>{itemLabel}</span>
                {itemShortcut && <span className="text-[10px] ml-4 opacity-70 group-hover:text-white">{itemShortcut}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const MenuBar = ({ onAction }: { onAction: (action: string) => void }) => {
  return (
    <div className="h-[30px] bg-[#333333] flex items-center shrink-0 select-none border-b border-[#252526] px-1 gap-1">
      <div className="mx-2 flex items-center justify-center">
        <span className="material-symbols-outlined !text-[18px] text-blue-400">code_blocks</span>
      </div>
      <MenuBarItem label="File" items={[
        { label: 'New File', action: () => onAction('new_file'), shortcut: 'Ctrl+N' },
        { label: 'New Folder', action: () => onAction('new_folder') },
        { label: 'Save', action: () => onAction('save'), shortcut: 'Ctrl+S' },
        'Open File...', 'Open Folder...', 'Save As...', 'Exit'
      ]} />
      <MenuBarItem label="Edit" items={['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Find', 'Replace']} />
      <MenuBarItem label="Selection" items={['Select All', 'Expand Selection', 'Shrink Selection']} />
      <MenuBarItem label="View" items={[
        { label: 'Command Palette...', trigger: 'command_palette', shortcut: 'Ctrl+Shift+P' },
        { label: 'Open View...', trigger: 'open_view' },
        { label: 'Toggle Sidebar', action: () => onAction('toggle_sidebar'), shortcut: 'Ctrl+B' },
        'Editor Layout'
      ]} />
      <MenuBarItem label="Go" items={['Back', 'Forward', 'Go to File...', 'Go to Symbol...']} />
      <MenuBarItem label="Run" items={[{ label: 'Start Debugging', action: () => onAction('run_code'), shortcut: 'F5' }, 'Run Without Debugging', 'Stop Debugging']} />
      <MenuBarItem label="Terminal" items={[
        { label: 'New Terminal', action: () => onAction('toggle_terminal'), shortcut: 'Ctrl+`' },
        'Split Terminal',
        'Run Task...'
      ]} />
      <MenuBarItem label="Help" items={['Welcome', 'Documentation', 'About']} />

      {/* Window Controls Mock */}
      <div className="ml-auto text-[11px] text-[#969696] pr-4 font-sans font-medium">TrackCodex - Workspace</div>
    </div>
  )
}

// --- MAIN EDITOR VIEW ---

const ActivityBarItem = ({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} title={label} className="w-full h-12 flex items-center justify-center relative cursor-pointer group">
    {active && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-white rounded-r-full"></div>}
    <span className={`material-symbols-outlined !text-2xl transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
      {icon}
    </span>
  </button>
);

const EditorView = ({ isFocusMode = false }: { isFocusMode?: boolean }) => {
  // Params
  const { id: routeWorkspaceId } = useParams();
  const workspaceId = routeWorkspaceId || 'default'; // Fallback for testing

  // State
  const [activeSidePanel, setActiveSidePanel] = useState('explorer');
  const [openFiles, setOpenFiles] = useState<any[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('// Select a file to edit');
  const [language, setLanguage] = useState<string>('typescript');
  const [line, setLine] = useState(1);
  const [col, setCol] = useState(1);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [fileSystem, setFileSystem] = useState<any[]>([]); // Real files
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // Load Files on Mount
  useEffect(() => {
    loadFiles();
  }, [workspaceId]);

  const loadFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const files = await fileService.getFiles(workspaceId);
      // Transform linear list to tree? Or API returns list of paths?
      // Our API currently returns list of relative paths strings e.g. ["index.js", "src/foo.ts"]
      // We need to hydrate this into the nested structure FileExplorer expects.
      const tree = buildTreeFromPaths(files);
      setFileSystem(tree);
    } catch (e) {
      console.error("Failed to load files", e);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const buildTreeFromPaths = (paths: string[]) => {
    const root: any[] = [];
    paths.forEach(path => {
      const parts = path.split('/');
      let currentLevel = root;
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const existingPath = currentLevel.find(n => n.name === part);
        if (existingPath) {
          currentLevel = existingPath.children || [];
        } else {
          const newNode = {
            id: path, // Use full path as ID for simplicity
            name: part,
            type: isFile ? 'file' : 'folder',
            children: isFile ? undefined : [],
            language: isFile ? part.split('.').pop() : undefined
          };
          currentLevel.push(newNode);
          if (!isFile) currentLevel = newNode.children!;
        }
      });
    });
    return root;
  };

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Handlers
  const toggleSidePanel = (panel: string) => {
    if (activeSidePanel === panel) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setActiveSidePanel(panel);
      setSidebarVisible(true);
    }
  };

  const handleFileClick = async (file: any) => {
    // If it's a folder, toggle expand (handled by FileExplorer mostly, but here we handle file open)
    if (file.type === 'folder') return;

    // Check if already open
    const isOpen = openFiles.find(f => f.id === file.id);
    if (!isOpen) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFileId(file.id);

    // Fetch Content
    try {
      const data = await fileService.getFileContent(workspaceId, file.id); // file.id is path
      setFileContent(data.content);
      setLanguage(file.language || 'plaintext');
    } catch (e) {
      setFileContent('// Failed to load content');
    }
  };

  const handleSave = async () => {
    if (!activeFileId) return;
    try {
      await fileService.saveFile(workspaceId, activeFileId, fileContent);
      // Show toast success?
      console.log("File saved!");
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleCloseFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFiles = openFiles.filter(f => f.id !== id);
    setOpenFiles(newFiles);
    if (activeFileId === id && newFiles.length > 0) {
      const nextFile = newFiles[newFiles.length - 1];
      setActiveFileId(nextFile.id);
      // We should technically fetch content for nextFile here too if not cached
      handleFileClick(nextFile);
    } else if (newFiles.length === 0) {
      setActiveFileId('');
      setFileContent('// Select a file');
    }
  };

  // Run Code triggers the Terminal log mainly
  const handleRunCode = () => {
    // In real app, send socket message to run command
    console.log("Run triggered. Terminal should handle this via socket.");
  };

  const handleAddFile = (name: string, type: 'file' | 'folder') => {
    // Optimistic UI update + API call to create file? 
    // For now, let's just reload files after creation if we had a create API
    // We only have 'saveFile' which creates if not exists.
    if (type === 'file') {
      const path = name; // Simplified: assumes root
      fileService.saveFile(workspaceId, path, '// New File').then(() => loadFiles());
    }
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'new_file':
        const fileName = prompt('Enter file name (e.g. src/utils.ts):');
        if (fileName) handleAddFile(fileName, 'file');
        break;
      case 'save':
        handleSave();
        break;
      case 'toggle_sidebar':
        setSidebarVisible(!sidebarVisible);
        break;
      case 'run_code':
        handleRunCode();
        break;
    }
  };

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, fileContent]);

  const renderSidePanel = () => {
    switch (activeSidePanel) {
      case 'explorer': return (
        <div className="h-full flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-2 bg-[#252526]">Explorer</h2>
          {isLoadingFiles ? (
            <div className="p-4 text-xs text-slate-500">Loading workspace...</div>
          ) : (
            <FileExplorer
              fileSystem={fileSystem}
              onFileClick={handleFileClick}
              openFiles={openFiles}
              activeFileId={activeFileId}
              onCloseFile={handleCloseFile}
              onAddFile={handleAddFile}
            />
          )}
        </div>
      );
      case 'search': return <SearchPanel />;
      case 'git': return <SourceControlPanel />;
      case 'debug': return <RunAndDebugPanel />;
      case 'extensions': return <ExtensionsPanel />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full font-display bg-[#1e1e1e] overflow-hidden">
      {!isFocusMode && <MenuBar onAction={handleMenuAction} />}

      <div className="flex-1 flex overflow-hidden">
        {!isFocusMode && (
          <div className="w-12 bg-[#333333] flex flex-col items-center py-2 shrink-0 z-20 border-r border-[#1e1e1e]">
            <ActivityBarItem icon="description" label="Explorer" active={activeSidePanel === 'explorer' && sidebarVisible} onClick={() => toggleSidePanel('explorer')} />
            <ActivityBarItem icon="search" label="Search" active={activeSidePanel === 'search' && sidebarVisible} onClick={() => toggleSidePanel('search')} />
            <ActivityBarItem icon="source_control" label="Source Control" active={activeSidePanel === 'git' && sidebarVisible} onClick={() => toggleSidePanel('git')} />
            <ActivityBarItem icon="play_circle" label="Run and Debug" active={activeSidePanel === 'debug' && sidebarVisible} onClick={() => toggleSidePanel('debug')} />
            <ActivityBarItem icon="extension" label="Extensions" active={activeSidePanel === 'extensions' && sidebarVisible} onClick={() => toggleSidePanel('extensions')} />
            <div className="mt-auto">
              <ActivityBarItem icon="account_circle" label="Account" />
              <ActivityBarItem icon="settings" label="Settings" />
            </div>
          </div>
        )}

        <PanelGroup direction="horizontal">
          {sidebarVisible && !isFocusMode && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full bg-vscode-sidebar border-r border-[#1e1e1e]">
                  {renderSidePanel()}
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-[#2b2b2b] hover:bg-primary transition-colors" />
            </>
          )}

          <Panel>
            <div className="flex flex-col h-full bg-vscode-editor">
              {/* TABS */}
              <div className="flex bg-[#252526] shrink-0 overflow-x-auto no-scrollbar border-b border-[#1e1e1e]">
                {openFiles.length > 0 ? (
                  openFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className={`flex items-center gap-2 px-3 h-9 text-sm cursor-pointer border-r border-[#1e1e1e] border-t-2 select-none min-w-[120px] max-w-[200px] ${activeFileId === file.id ? 'bg-[#1e1e1e] text-white border-t-[#007fd4]' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2d2e] border-t-transparent'}`}
                    >
                      <span className={`material-symbols-outlined !text-[16px] ${file.language === 'cpp' ? 'text-blue-400' : 'text-amber-400'}`}>
                        {file.language === 'folder' ? 'folder' : 'description'}
                      </span>
                      <span className="truncate flex-1">{file.name}</span>
                      <button
                        onClick={(e) => handleCloseFile(e, file.id)}
                        className={`ml-1 p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white ${activeFileId === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <span className="material-symbols-outlined !text-[14px]">close</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-xs text-[#969696] italic">No open files</div>
                )}
                {/* Editor Actions (Run Button) */}
                <div className="ml-auto flex items-center gap-1 pr-2">
                  <button
                    onClick={handleRunCode}
                    className="p-1 hover:bg-[#3e3e42] rounded text-[#cccccc] hover:text-white transition-colors flex items-center justify-center tooltip"
                    title="Run Code (Ctrl+Enter)"
                  >
                    <span className="material-symbols-outlined !text-[18px] text-green-500">play_arrow</span>
                  </button>
                </div>
              </div>

              <PanelGroup direction="vertical">
                <Panel defaultSize={75} minSize={30}>
                  {openFiles.length > 0 ? (
                    <div className="flex-1 h-full relative">
                      <Editor
                        height="100%"
                        path={activeFileId}
                        value={fileContent}
                        language={language}
                        theme="vs-dark"
                        onChange={(val) => setFileContent(val || '')}
                        onMount={(editor) => {
                          editorRef.current = editor;
                          editor.onDidChangeCursorPosition(e => {
                            setLine(e.position.lineNumber);
                            setCol(e.position.column);
                          });
                        }}
                        options={{
                          minimap: { enabled: true, showSlider: 'always' },
                          fontSize: 14,
                          fontFamily: 'JetBrains Mono, monospace',
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#555] bg-[#1e1e1e]">
                      <span className="material-symbols-outlined !text-[64px] mb-4 opacity-20">code_off</span>
                      <p className="text-sm">Select a file from the explorer to start editing</p>
                    </div>
                  )}
                </Panel>

                <PanelResizeHandle className="h-1 bg-[#2b2b2b] hover:bg-primary transition-colors" />

                <Panel defaultSize={25} minSize={10} collapsible>
                  <TerminalPanel workspaceId={workspaceId} />
                </Panel>
              </PanelGroup>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#2b2b2b] hover:bg-primary transition-colors" />

          <Panel defaultSize={25} minSize={20} collapsible collapsed={isFocusMode}>
            <ForgeAIAssistantPanel editorRef={editorRef} activeFile={openFiles.find(f => f.id === activeFileId)?.name || 'Untitled'} />
          </Panel>
        </PanelGroup>
      </div>

      {!isFocusMode && (
        <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-medium shrink-0 z-50">
          <div className="flex items-center gap-4 h-full">
            <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer">
              <span className="material-symbols-outlined !text-[14px]">source_control</span>
              <span className="font-bold">main*</span>
            </div>
          </div>
          <div className="flex items-center gap-4 h-full">
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">
              Ln {line}, Col {col}
            </div>
            <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer uppercase">{language}</div>
          </div>
        </footer>
      )}
    </div>
  );
};
export default EditorView;
